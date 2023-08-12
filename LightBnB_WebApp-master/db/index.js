const { Pool } = require('pg');

// Create a new Pool instance for managing database connections
const pool = new Pool({
  user: 'labber',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

// Export the pool instance along with a query function that uses it
module.exports = {
    // The Pool instance for managing database connections
  pool,

    // A function to execute queries using the pool
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  }
};