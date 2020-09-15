// load all env variables from .env file into process.env object.
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./queries');
const app = express();

app.use(require('cookie-parser')());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://fantasy-golf-app.herokuapp.com');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

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

passport.use(
  'local',
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, db.localPassportStrategy)
);

app.get('/', db.getHome);
app.get('/salaries', db.getSalaries);
app.post('/salaries', db.createSalary);
app.delete('/salaries', db.deleteSalaries);
app.post('/teams', db.createTeam);
app.put('/teams', db.updateTeam);
app.get('/teams', db.getTeams);
app.post('/signup', db.signUp);
app.get('/user', (req, res, next) => {
  if (req) {
    console.log('/user', req.cookies, req.user);
    return res.status(200).json({
      user: req.user,
      email: req.email,
      session: req.session,
      authenticated: true,
      sessions: req.sessions,
    });
  } else {
    return res.status(401).json({
      error: 'User is not authenticated',
      authenticated: false,
    });
  }
});
// app.post('/login', passport.authenticate('local'), function (req, res) {
//   console.log(req.user, req.session, req.body);
//   if (req.body.remember) {
//     req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
//   } else {
//     req.session.cookie.expires = false; // Cookie expires at end of session
//   }
//   req.session.user = { email: req.body.email };
//   res.status(200).json({ session: req.session });
// });

app.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send({ message: 'no user...' });
    }

    // NEED TO CALL req.login()!!!
    req.login(user, next);
  })(req, res, next);
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}.`);
});
