const { pool } = require('../config/db.config');

const fetchAllPosts = async (req, res) => {
  const { is_admin } = req.user;

  if (is_admin) {
    const { rows: posts } = await pool.query('SELECT title, price, location, space, images, categories, description, owner_uid, status, features_id, creation_date, pid FROM posts ORDER BY creation_date DESC');
    return res.status(200).send({ posts });
  } else {
    return res.status(403).send({ message: 'Отказано в доступе' });
  }
};

const fetchApprovedPosts = async (req, res) => {
  const { rows: posts } = await pool.query(`SELECT title, price, location, space, images, categories, description, owner_uid, status, features_id, creation_date, pid FROM posts WHERE status = 'approved' ORDER BY creation_date DESC`);
  return res.status(200).send({ posts });
}

const fetchUserPosts = async (req, res) => {
  const { uid } = req.user;

  const { rows: posts } = await pool.query('SELECT title, price, location, space, images, categories, description, owner_uid, status, features_id, creation_date, pid FROM posts WHERE owner_uid = $1 ORDER BY creation_date DESC', [uid]);
  return res.status(200).send({ posts });
}

const fetchPostByPid = async (req, res) => {
  const { pid } = req.body;
  const { uid, is_admin } = { ...req.user };
  let user_data = null;

  const { rows: [post] } = await pool.query('SELECT title, price, location, space, images, categories, description, owner_uid, status, features_id FROM posts WHERE pid = $1', [pid]);
  if (!post) return res.status(404).send({ message: 'Участок не найден' });

  if (is_admin) {
    const { rows: [user] } = await pool.query('SELECT name, email, phone_number, iin FROM users WHERE uid = $1', [post.owner_uid]);
    user_data = user;
  }

  if (post.status == 'approved' || (post.owner_uid == uid || is_admin)) {
    return res.status(200).send({ ...post, ...user_data });
  } else {
    return res.status(403).send({ message: 'Отказано в доступе' })
  }
}

const fetchGeometry = (req, res) => {
  const { pid } = req.body;
  pool.query(
    'SELECT ST_AsGeoJSON(geom) AS geometry, gid FROM geometries WHERE pid = $1',
    [pid],
    (error, geometries) => {
      if (error) {
        return res.status(404).send({ message: error.message });
      }
      if (geometries.rows.length) {
        const features = [];
        geometries.rows.map(it => {
          features.push({
            id: it.gid,
            type: 'Feature',
            properties: {},
            geometry: JSON.parse(it.geometry),
          });
        });

        const featureCollection = {
          type: 'FeatureCollection',
          features,
        };

        pool.query('SELECT zoom, center FROM mapinfo WHERE pid = $1', [pid], (errorMap, mapInfo) => {
          if (errorMap) return res.status(404).send({ message: errorMap.message });
          const payload = {
            gid: geometries.rows[0].gid,
            featureCollection,
            zoom: mapInfo.rows[0].zoom,
            center: JSON.parse(mapInfo.rows[0].center),
          };
          return res.status(200).send(payload);
        });
      } else {
        return res.status(404).send({ message: 'Геометрия не найдена' })
      }
    }
  );
};

const createPost = (req, res) => {
  const { uid: owner_uid, is_admin } = req.user;
  const {
    title,
    price,
    location,
    space,
    images,
    categories,
    description,
    features,
    zoom,
    center,
    features_id,
  } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const status = is_admin ? 'approved' : 'not approved';

  pool.query(
    `INSERT INTO posts(title, price, location, space, images, categories, description, owner_uid, status, features_id, ip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING pid`,
    [title, price, location, space, images, categories, description, owner_uid, status, features_id, ip],
    (error, post) => {
      if (error) return res.status(406).send({ message: error.message });
      const pid = post.rows[0].pid;
      const mapCenter = JSON.stringify(center);
      features.map(it => {
        const geoJSON = JSON.stringify(it.geometry);
        const gid = it.id;
        pool.query(
          'INSERT INTO geometries(pid, geom, gid) VALUES ($1, ST_GeomFromGeoJSON($2), $3)',
          [pid, geoJSON, gid],
          errorGeom => {
            if (errorGeom) return res.status(406).send({ message: errorGeom.message });
          }
        );
      });
      pool.query(
        'INSERT INTO mapinfo(zoom, center, pid) VALUES ($1, $2, $3)',
        [zoom, mapCenter, pid],
        errorMapInfo => {
          if (errorMapInfo) return res.status(406).send({ message: errorMapInfo.message });
        }
      );
    }
  );
  return res.status(201).send({ message: 'Участок успешно создан!' })
};

const updatePost = (req, res) => {
  const user = req.user;
  const {
    pid,
    title,
    price,
    location,
    space,
    images,
    categories,
    description,
    features,
    zoom,
    center,
    features_id,
  } = req.body;
  const geom_errors = [];

  pool.query('SELECT * FROM posts WHERE pid = $1', [pid], (error, posts) => {
    if (error) return res.status(500).send({ message: error.message })
    if (posts.rows.length == 0) return res.status(404).send({ message: 'Участок не найден' });

    const post = posts.rows[0];
    if (user.uid != post.owner_uid || user.is_admin != true) return res.status(403).send({ message: 'Недостаточно прав' });

    pool.query(
      'UPDATE posts SET title = $1, price = $2, location = $3, space = $4, images = $5, categories = $6, description = $7, features_id = $8 WHERE pid = $9',
      [title, price, location, space, images, categories, description, features_id, pid],
      errorPost => {
        if (errorPost) return res.status(500).send({ message: errorPost.message });
        const mapCenter = JSON.stringify(center);
        pool.query('DELETE FROM geometries WHERE pid = $1', [pid], errorDel => {
          if (errorDel) return res.status(500).send({ message: errorDel.message });
        });
        features.map(it => {
          const geoJSON = JSON.stringify(it.geometry);
          const gid = it.id;
          pool.query(
            'INSERT INTO geometries(geom, gid, pid) VALUES (ST_GeomFromGeoJSON($1), $2, $3) ON CONFLICT (gid) DO UPDATE SET geom = ST_GeomFromGeoJSON($1)',
            [geoJSON, gid, pid],
            errorGeom => {
              if (errorGeom) geom_errors.push(errorGeom.message);
            }
          );
        });
        if (geom_errors.length) return res.status(500).send({ message: geom_errors[0].message });
        pool.query('UPDATE mapinfo SET zoom = $1, center = $2 WHERE pid = $3', [zoom, mapCenter, pid], errorMapInfo => {
          if (errorMapInfo) return res.status(500).send({ message: errorMapInfo.message });
        });
        return res.status(201).send({ message: 'Участок успешно обновлен!' });
      }
    );
  });
};

const deletePost = (req, res) => {
  const user = req.user;
  const { pid } = req.body;

  pool.query('SELECT * FROM posts WHERE pid = $1', [pid], (error, posts) => {
    if (error) return res.status(406).send({ message: error.message });
    if (posts.rows.length == 0) return res.status(404).send({ message: 'Участок не найден' });

    const post = posts.rows[0];
    if (user.uid == post.owner_uid || user.is_admin) {
      pool.query('DELETE FROM posts WHERE pid = $1', [pid], error => {
        if (error) return res.status(404).send({ message: error.message });
        return res.status(202).send({ message: 'Участок успешно удален!' });
      });
    }
  });
};

const updatePostStatus = (req, res) => {
  const { uid, is_admin } = req.user;
  const { pid, status } = req.body;

  pool.query('SELECT * FROM posts WHERE pid = $1', [pid], (errorSelect, posts) => {
    if (errorSelect) return res.status(500).send({ message: errorSelect.message });
    if (!posts.rows.length) return res.status(404).send({ message: 'Участок не найден' });

    const post = posts.rows[0];
    if (uid == post.owner_uid || is_admin) {
      pool.query('UPDATE posts SET status = $1 WHERE pid = $2', [status, pid], errorUpdate => {
        if (errorUpdate) return res.status(500).send({ message: errorUpdate.message });
        return res.status(200).send({ message: 'Статус участка успешно обновлен!' });
      });
    }
  });
}

module.exports = {
  fetchAllPosts,
  fetchApprovedPosts,
  fetchUserPosts,
  fetchPostByPid,
  fetchGeometry,
  createPost,
  updatePost,
  updatePostStatus,
  deletePost,
};
