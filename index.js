// load all env variables from .env file into process.env object.
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./queries');
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// Add headers
app.use(function(req, res, next) {
  // Disable cors
  res.setHeader(false);

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
// const whitelist = [
//   'http://localhost:3000',
//   'https://fantasy-golf-app.herokuapp.com/'
// ];
// const corsOptionsDelegate = (_req, callback) => {
//   let corsOptions;
//   if (whitelist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false }; // disable CORS for this request
//   }
//   callback(null, corsOptions); // callback expects two parameters: error and options
// };

app.get('/', db.getHome);
app.get('/salaries', db.getSalaries);
app.post('/salaries', db.createSalary);
app.delete('/salaries', db.deleteSalaries);
app.post('/teams', db.createTeam);
app.get('/teams', db.getTeams);

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}.`);
});
