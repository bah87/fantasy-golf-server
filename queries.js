const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
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

const createSalary = (request, response) => {
  const { playerId, salary } = request.body;

  if (!playerId || !salary) {
    console.log('*************', request);
    response.json({ errorMsg: `Not enough data provided: ${playerId}` });
    return;
  }

  client.query(
    'INSERT INTO salaries (player_id, salary) VALUES ($1, $2)',
    [playerId, salary],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Salary added with ID: ${results.insertId}`);
    }
  );
};

module.exports = {
  getHome,
  getSalaries,
  createSalary
};
