const bcrypt = require('bcrypt');
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

const getHome = (_request, response) => {
  response.json({ info: 'test getHome ...' });
};

const getSalaries = (_request, response) => {
  client.query('SELECT * FROM salaries;', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const deleteSalaries = (_request, response) => {
  client.query('DELETE FROM salaries;', (error, _results) => {
    if (error) {
      throw error;
    }
    response.status(200).send('All salaries deleted.');
  });
};

const getTeams = (_request, response) => {
  client.query('SELECT * FROM teams;', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const updateTeam = (request, response) => {
  const { name, team } = request.body;

  if (!name || !team) {
    response.json({ errorMsg: 'Not enough data provided.' });
    return;
  } else if (team.length != 6) {
    response.json({ errorMsg: 'Team length must be 6.' });
    return;
  }

  client.query(
    'UPDATE teams SET players = ARRAY [$1, $2, $3, $4, $5, $6] WHERE name = $7;',
    [...team, name],
    (error, _results) => {
      if (error) {
        response.json({ error });
        return;
      }
      response.json({ status: 'success' });
    }
  );
};

const createTeam = (request, response) => {
  const { name, team } = request.body;

  if (!name || !team) {
    response.json({ errorMsg: 'Not enough data provided.' });
    return;
  } else if (team.length != 6) {
    response.json({ errorMsg: 'Team length must be 6.' });
    return;
  }

  client.query(
    'INSERT INTO teams (name, players) values ($1, ARRAY [$2, $3, $4, $5, $6, $7]);',
    [name, ...team],
    (error, _results) => {
      if (error) {
        response.json({ error });
        return;
      }
      response.json({ status: 'success' });
    }
  );
};

const createSalary = (request, response) => {
  const { playerId, salary } = request.body;

  if (!playerId || !salary) {
    response.json({ errorMsg: `Not enough data provided: ${playerId}` });
    return;
  }

  client.query('INSERT INTO salaries (player_id, salary) VALUES ($1, $2)', [playerId, salary], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(201).send(`Salary added with ID: ${results.insertId}`);
  });
};

const localPassportStrategy = (req, email, password, done) => {
  client.query('SELECT id, name, email, password FROM users WHERE email=$1', [email], (err, result) => {
    if (err) {
      return done(err);
    }
    if (result.rows[0] == null) {
      return done(null, false);
    } else {
      bcrypt.compare(password, result.rows[0].password, function (err, check) {
        if (err) {
          console.log('Error while checking password');
          return done();
        } else if (check) {
          return done(null, [{ email: result.rows[0].email, name: result.rows[0].name }]);
        } else {
          return done(null, false);
        }
      });
    }
  });
};

const signUp = (req, res) => {
  console.log('request body', req.body);
  bcrypt.hash(req.body.password, 5, (err, hashedPassword) => {
    client.query('SELECT id FROM users WHERE email=$1', [req.body.email], (err, result) => {
      if (result.rows[0]) {
        res.send({ error: 'This email address is already registered.' });
      } else {
        client.query(
          'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
          [req.body.name, req.body.email, hashedPassword],
          (err, result) => {
            if (err) {
              console.log('error trying to add new user', err);
            } else {
              res.send({ message: 'User created successfully' });
            }
          }
        );
      }
    });
  });
};

module.exports = {
  getHome,
  getSalaries,
  deleteSalaries,
  createSalary,
  createTeam,
  updateTeam,
  getTeams,
  localPassportStrategy,
  signUp,
};
