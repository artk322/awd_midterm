const { pool } = require('../config/db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/nodemailer');
const nca_verify_xml = require('../utils/nca_verify_xml.js');

const fetchUsers = (req, res) => {
  const user = req.user;
  if (user.is_admin) {
    pool.query('SELECT * FROM users', (error, users) => {
      if (error) {
        return res.status(404).send({ message: error.message });
      }
      res.status(200).json({ users: users.rows });
    });
  } else {
    return res.status(401).send({ message: 'Недостаточно прав' });
  }
};

const createUser = async (req, res) => {
  const { name, email, phone_number, password, iin } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const { rows: users } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (users.length) return res.status(409).send({ message: 'Данный email уже занят.' })
  try {
    await pool.query('INSERT INTO users (name, email, phone_number, password, iin) VALUES ($1, $2, $3, $4, $5)', [name, email, phone_number, hashedPassword, iin]);
    return res.status(201).send({ message: 'Регистрация прошла успешно! Войдите в систему.' });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }

};

const verifyEmail = (req, res) => {
  const { emailToken } = req.body;
  if (!emailToken) return res.status(404).send({ message: 'Недействительная ссылка' });

  jwt.verify(emailToken, process.env.EMAIL_TOKEN_SECRET, (error, user) => {
    if (error) return res.status(403).send({ message: 'Ссылка устарела или недействительна.' });
    const { name, email, phone_number, hashedPassword } = user;
    pool.query(
      'INSERT INTO users (name, email, phone_number, password) VALUES ($1, $2, $3, $4)',
      [name, email, phone_number, hashedPassword],
      error => {
        if (error) {
          return res.status(404).send({ message: error.message });
        }
        res.status(201).send({ message: 'Регистрация прошла успешно! Войдите в систему.' });
      }
    );
  });
};

const sendRecoveryEmail = (req, res) => {
  const { email } = req.body;
  pool.query('SELECT * FROM users WHERE email = $1', [email], (error, users) => {
    if (error) {
      return res.status(404).send({ message: error.message });
    }
    if (users.rows.length == 0) {
      return res.status(409).send({ message: 'Пользователь не найден.' });
    } else {
      const emailToken = jwt.sign({ email }, process.env.EMAIL_TOKEN_SECRET, { expiresIn: '10m' });
      const url = `${process.env.VUE_APP_URL}/forgot-password?token=${emailToken}`;
      const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: 'Сброс пароля',
        html: `
        <h3>Сброс пароля на сайте zher.e-batys.kz.</h3>
        Чтобы сбросить пароль <a href="${url}">перейдите по ссылке</a>.
        <p>Ссылка будет действительна в течении 10 минут</p>
      `,
      };

      sendMail(res, mailOptions);
    }
  });
};

const resetPassword = async (req, res) => {
  const { emailToken, password } = req.body;
  if (!emailToken) return res.status(404).send({ message: 'Недействительная ссылка' });

  const hashedPassword = await bcrypt.hash(password, 10);

  jwt.verify(emailToken, process.env.EMAIL_TOKEN_SECRET, (error, user) => {
    if (error) return res.status(403).send({ message: 'Ссылка устарела или недействительна.' });

    pool.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, user.email],
      error => {
        if (error) {
          return res.status(404).send({ message: error.message });
        }
        return res.status(201).send({ message: 'Пароль успешно изменен' });
      }
    );
  });
};

const updateUser = (req, res) => {
  const { uid, name, phone_number } = req.body;
  pool.query('SELECT * FROM users WHERE uid = $1', [uid], (error, result) => {
    if (error) {
      return res.status(404).send({ message: error.message });
    }
    if (result.rows.length > 0 && uid == req.user.uid) {
      pool.query(
        'UPDATE users SET name = $1, phone_number = $2 WHERE uid = $3 RETURNING name, phone_number, uid, email, is_admin, registration_date',
        [name, phone_number, uid],
        (error, users) => {
          if (error) {
            return res.status(404).send({ message: error.message });
          }
          const user = users.rows[0];
          if (user) {
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.status(202).send({ message: 'Пользователь успешно обновлен!', user, accessToken });
          }
        }
      );
    } else {
      res.status(409).send({ message: 'Пользователь не найден.' });
    }
  });
};

const deleteUser = async (req, res) => {
  const { uid: target_uid } = req.body;
  const { uid, is_admin } = req.user;

  if (uid == target_uid || is_admin) {
    const { rows: [users] } = await pool.query('DELETE FROM users WHERE uid = $1', [target_uid]);
    res.status(202).send({ message: 'Пользователь успешно удален!' });
  } else {
    res.status(403).send({ message: 'Отказано в доступе' });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  pool.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
    if (error) {
      return res.status(404).send({ message: error.message });
    }

    if (result.rows.length > 0) {
      let user = result.rows[0];
      bcrypt.compare(password, user.password, (error, isMatch) => {
        if (error) {
          return res.status(404).send({ message: error.message });
        }
        if (isMatch) {
          user = {
            uid: user.uid,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            is_admin: user.is_admin,
            registration_date: user.registration_date,
          };

          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

          res.status(200).send({ message: 'Авторизация прошла успешно!', accessToken, user });
        } else {
          res.status(403).send({ message: 'Неправильный email или пароль.' });
        }
      });
    } else {
      res.status(403).send({ message: 'Неправильный email или пароль.' });
    }
  });
};

const verifyEDS = async (req, res) => {
  const { ds_challenge } = req.body;
  const ds_verify_res = await nca_verify_xml(ds_challenge);
  if (!ds_verify_res.valid || (ds_verify_res.cert && !ds_verify_res.cert.valid)) return res.status(403).send({ message: 'Ошибка ЭЦП' });
  const { iin } = ds_verify_res.cert.subject
  const { rows: users } = await pool.query('SELECT * FROM users WHERE iin = $1', [iin]);
  if (users.length) return res.status(409).send({ message: 'Пользователь уже зарегистрирован.' })
  return res.status(200).send({ iin });
}

module.exports = {
  fetchUsers,
  createUser,
  verifyEmail,
  updateUser,
  deleteUser,
  login,
  sendRecoveryEmail,
  resetPassword,
  verifyEDS
};
