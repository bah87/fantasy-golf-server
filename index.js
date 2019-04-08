// load all env variables from .env file into process.env object.
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./queries');
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get('/', db.getHome);
app.get('/salaries', db.getSalaries);
app.post('/salaries', db.createSalary);

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}.`);
});
