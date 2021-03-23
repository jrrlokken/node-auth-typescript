const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const dbConnect = require('./db/dbConnect');
const User = require('./db/userModel');
const auth = require('./auth');

const app = express();

dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  res.json({ message: 'You wanted a response, so here you are!'});
  next();
});

app.post('/register', (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: req.body.email,
        password: hashedPassword,
      });
      user
        .save()
        .then((result) => {
          res.status(201).send({
            message: 'User created successfully',
            result,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: 'Error creating user',
            error,
          });
        });
    })
    .catch((error) => {
      res.status(500).send({
        message: 'Password was not hashed successfully',
        e,
      });
    });
});

app.post('/login', (req,res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      bcrypt.compare(req.body.password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return res.status(400).send({
              message: 'Passwords do not match',
              error,
            })
          }
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            'RANDOM-TOKEN',
            { expiresIn: '24h' }
          );

          res.status(200).send({
            message: 'Login successful',
            email: user.email,
            token,
          });
        })
        .catch((error) => {
          res.status(400).send({
            message: 'Passwords do not match',
            error,
          });
        });
    })
    .catch((error) => {
      res.status(404).send({
        message: 'Email not found',
        error,
      });
    });
});

// free endpoint
app.get('/free-endpoint', (req, res) => {
  res.json({ message: 'You are free to access this page anytime' });
});

// auth endpoint
app.get('/auth-endpoint', auth, (req, res) => {
  res.json({ message: 'You are authorized to access me'});
});

module.exports = app;