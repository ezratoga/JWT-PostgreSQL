const postgreConnectionHandler = require('./helper/databases/postgre/connection');
const bodyParser = require("body-parser");
const express = require('express');
const command = require('./model/command');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

postgreConnectionHandler.init();

const app = express();
app.use(bodyParser.json());

app.get('/health-check', async (req, res) => {
  res.status(200).json({message: 'this service is running'});
})
app.post('/register', async (req, res) => {
  try {
    const { username, password, email, first_name, last_name } = req.body;

    if (!email && !username && !password) 
      res.status(400).send('Email and password, First Name or Last Name must be filled in');
    
    const encryptedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign(
      { username },
      'secret',
      {
        algorithm: "HS256",
        expiresIn: "2h"
      }
    );
    console.log(token);
    const responseUser = postgreConnectionHandler.client.query('INSERT INTO user_account (username, password, email, token, first_name, last_name) VALUES ($1, $2, $3, $4, $5, $6)', [username, encryptedPassword, email, token, first_name, last_name])
    .then((res) => { console.log(res.rows[0]); return res.rows[0]; })
    .catch((err) => { console.log(err.stack); return err.stack;});
    res.status(200).json(responseUser);    
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.use(express.json());

module.exports = app;