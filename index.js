// load all env variables from .env file into process.env object.
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
// const db = require('./queries');
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get('/', (_request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});
// app.get('/users', db.getUsers);
// app.get('/users/:id', db.getUserById);
// app.post('/users', db.createUser);
// app.put('/users/:id', db.updateUser);
// app.delete('/users/:id', db.deleteUser);

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}.`);
});
