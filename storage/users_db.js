const mysqlpool = require("../lib/mysqlPool");

/**
 * @typedef dbUser
 * @property {string} password a hashed password
 * @property {string} name
 * @property {string} email
 * @property {string} role
 */
/**
 * @param {dbUser} user the user to create
 * @returns {number}  the ID of the new user
 */
exports.create = async user => {
  console.log(user);
  return 123;
};

exports.login = async () => {
  //TODO: This is a placeholder for the query present in /lib/auth.js:8
  return;
};

/**
 * @param {string} email
 * @returns {string} hashed password
 * @throws {user_db.EmailNotFound} when the email cannot be found
 */
exports.find_hash_by_email = async email => {
  //TODO: This
  return;
};

/**
 * @param {string} email
 * @returns {number} user id
 * @throws {user_db.EmailNotFound} when the email cannot be found
 */
exports.find_id_by_email = async email => {
  //TODO: This
  return;
};
exports.findById = async id => {
  //TODO: This
  return {
    id: 123,
    name: "test user",
    email: "test@example.com",
    role: "admin",
    passwordHash: "asda;sdkja;sdlkasjda"
  };
};
