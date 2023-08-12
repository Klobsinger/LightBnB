const properties = require("./json/properties.json");
const users = require("./json/users.json");
const db = require('../db'); // Import the exported object from db/index.js

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return db.pool
    .query(`SELECT * FROM users WHERE users.email = $1 `, [email])
    .then((result) => {
      const rows = result.rows
      return rows[0]
    })
    .catch((err) => {
      console.log(err.message);//move to routes
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return db.pool
  .query(`SELECT * FROM users WHERE users.id = $1 `, [id])
  .then((result) => {
    const rows = result.rows
    return rows[0]
  })
  .catch((err) => {
    console.log(err.message);//move to routes
  });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return db.pool
    .query(
      `INSERT INTO users ("name", "email", "password") VALUES ($1, $2, $3) RETURNING *`,
      [user.name, user.email, user.password]
    )
    .then((result) => {
      const insertedUser = result.rows[0];
      return insertedUser;
    })
    .catch((err) => {
      console.log(err.message);//move to routes
      throw err;
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return db.pool
    .query(
      `SELECT reservations.*, properties.*
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id
      ORDER BY reservations.start_date
      LIMIT $2`,
      [guest_id, limit]
    )
    .then((result) => {
      const rows = result.rows;
      return rows;
    })
    .catch((err) => {
      console.log(err.message);
      throw err;
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  const whereClauses = []; // Array for WhereClauses
  const queryParams = []; // Array to store query parameters
  const havingClauses = [] // Array for HavingClauses

  //starting values for the query that will always be used no matter the filter
  let query = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
  `;

  // Build the WHERE clause and update queryParams
  //Logic for city filtering
  if (options.city) {
    //Push the user-provided city to the queryParams array
    queryParams.push(options.city);
    //determining the parameter placeholder # based on how many Params are in the queryParams array
    whereClauses.push(`city = $${queryParams.length}`);
  }


  //Logic for min price filtering
  if (options.minimum_price_per_night) {
    //multiplying the price the user inputs by 100 to convert to cents
    const minimumPriceCents = options.minimum_price_per_night * 100;
    //Push the user-provided minimum price to the queryParams array
    queryParams.push(minimumPriceCents);
    //determining the parameter placeholder # based on how many Params are in the queryParams array
    whereClauses.push(`cost_per_night >= $${queryParams.length}`);
  }

  //Logic for max price filtering
  if (options.maximum_price_per_night) {
    //multiplying the price the user inputs by 100 to convert to cents
    const maximumPriceCents = options.maximum_price_per_night * 100;
    //Push the user-provided max price to the queryParams array
    queryParams.push(maximumPriceCents);
    //determining the parameter placeholder # based on how many Params are in the queryParams array
    whereClauses.push(`cost_per_night <= $${queryParams.length}`);
  }

  //Logic for rating filtering
  if(options.minimum_rating) {
    // Push the user-provided minimum rating to the queryParams array
    queryParams.push(options.minimum_rating);
    //determining the parameter placeholder # based on how many Params are in the queryParams array
    havingClauses.push(`AVG(property_reviews.rating) >= $${queryParams.length}`);
  }
  
  //checks the length of whereClauses array if user inputed any filtering that needs where clauses
  if (whereClauses.length > 0) {
    //Adds one where to query
    query += ' WHERE ';
    //joins all other additional where querys with AND
    query += whereClauses.join(" AND ");
  }
  //adding GROUP BY before any havings are needed for propper grouping
  query += `
  GROUP BY properties.id
  `;

    //checks the length of havingClauses array if user inputed any filtering that needs having clauses
  if (havingClauses.length > 0) {
    //Adds one HAVING to query
    query += ' HAVING ';
    //joins all other additional having querys with AND
    query += havingClauses.join(" AND ");
  }
  //adds limit after everything else has been added
  queryParams.push(limit);
  // Build the rest of the query
  query += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length}`;

    //Final Logic using the query built up step by step depending on user filtering choices and queryParams telling the query which placeholders to use
    return db.pool.query(query, queryParams).then((res) => res.rows);
};


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  return db.pool
    .query(
      `INSERT INTO properties ("title", "description", "number_of_bedrooms", "number_of_bathrooms", "parking_spaces","cost_per_night","thumbnail_photo_url", "cover_photo_url", "street", "country", "city", "province", "post_code", "owner_id") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [property.title, property.description, property.number_of_bedrooms, property.number_of_bathrooms, property.parking_spaces, property.cost_per_night, property.thumbnail_photo_url, property.cover_photo_url, property.street, property.country, property.city, property.province, property.post_code, property.owner_id]
    )
    .then((result) => {
      const insertedProp = result.rows[0];
      return insertedProp;
    })
    .catch((err) => {
      console.log(err.message);//move to routes
      throw err;
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
