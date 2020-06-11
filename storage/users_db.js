const mysqlpool = require("../lib/mysqlPool");

exports.create = async user => {
  console.log("id");
  return 123;
};

exports.login = async () => {
  //TODO: This is a placeholder for the query present in /lib/auth.js:8
  return;
};

exports.find_by_id = async (id) => {//TODO: This
    return
}

/**
 * @param {string} email
 * @returns {string} hashed password
 * @throws {user_db.EmailNotFound} when the email cannot be found
 */
exports.find_hash_by_email = async (email) => {
    //TODO: This
    return
}

/**
 * @param {string} email
 * @returns {number} user id
 * @throws {user_db.EmailNotFound} when the email cannot be found
 */
exports.find_id_by_email = async (email) => {
    //TODO: This
    return
}
