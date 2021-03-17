/* eslint-disable no-unused-vars */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const history = require('connect-history-api-fallback');
const app = express();
const users = require('./queries/users.queries');
const posts = require('./queries/posts.queries');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
if (process.env.NODE_ENV === 'production') {
  const staticFileMiddleware = path.join(__dirname, '../dist');
  app.use(express.static(staticFileMiddleware));
  app.use(
    history({
      disableDotRule: true,
    })
  );
  app.use(express.static(staticFileMiddleware));
} else {
  app.use(cors());
}
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send({ message: 'Войдите в систему' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.status(403).send({ message: 'Ошибка пользователя' });
    req.user = user;
    next();
  });
}

function validateUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1] || '';

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    req.user = user;
    next();
  });
}

// ===============================================================

app.post('/api/token', authenticateToken, (req, res) => {
  res.status(200).send({ user: req.user });
});

// ======================= USERS =================================
app.get('/api/users', authenticateToken, users.fetchUsers);
app.put('/api/updateUser', authenticateToken, users.updateUser);
app.post('/api/deleteUser', authenticateToken, users.deleteUser);
app.post('/api/register', users.createUser);
app.post('/api/sendRecoveryEmail', users.sendRecoveryEmail);
app.put('/api/resetPassword', users.resetPassword);
app.post('/api/login', users.login);
app.post('/api/verifyEmail', users.verifyEmail);
app.post('/api/verifyEDS', users.verifyEDS);
app.post('/api/logout', (req, res) => {
  res.status(200).send({ message: 'Вы вышли из системы' });
});

// ======================= POSTS =================================

app.get('/api/fetchAllPosts', authenticateToken, posts.fetchAllPosts);
app.get('/api/fetchApprovedPosts', posts.fetchApprovedPosts);
app.post('/api/fetchPostByPid', validateUser, posts.fetchPostByPid);
app.post('/api/fetchGeometry', posts.fetchGeometry);
app.get('/api/fetchUserPosts', authenticateToken, posts.fetchUserPosts);
app.post('/api/createPost', authenticateToken, posts.createPost);
app.put('/api/updatePost', authenticateToken, posts.updatePost);
app.put('/api/updatePostStatus', authenticateToken, posts.updatePostStatus);
app.post('/api/deletePost', authenticateToken, posts.deletePost);

app.listen(PORT, _ => {
  console.log(`App running on port: ${PORT}.`);
});
