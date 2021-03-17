const nodemailer = require('nodemailer');

const transpoter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

function sendMail(res, mailOptions) {
  transpoter.sendMail(mailOptions, error => {
    if (error) {
      console.log(error);
      return res
        .status(406)
        .send({ message: 'Произошла ошибка, попробуйте заново\n' + error.message });
    }
    return res.status(200).send({ message: 'Email отправлен.' });
  });
}

module.exports = sendMail;
