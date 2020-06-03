const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const users_db = require("../storage/users_db");

const secretKey = process.env.JWTSECRET || "GooseGang";

exports.genToken = async function (id) {
  let user = await users_db.find_by_id(id);
  const payload = { sub: user.id, role: user.role }; //Add more perms here
  return jwt.sign(payload, secretKey, { expiresIn: "24h" });
};

/**
 * @param {string} token
 * @returns {object} the JWT payload
 * @throws {jwt.TokenExpiredError} when the token is expired
 * @throws {jwt.JsonWebTokenError} when the token is malformed or otherwise invalid
 * @throws {jwt.NotBeforeError} when the token issued date is before the current date
 */
exports.checkJwt = async function (token) {
  const payload = jwt.verify(token, secretKey);
  return payload;
};

/**
 * @param {string} password
 * @returns {Promise<string>} the hashed password
 */
exports.hashPassword = async password => {
  return bcrypt.hash(password, 8);
};

/**
 * @param {string} password
 * @param {string} passwordHash
 * @returns {boolean} true if the password and hash match
 */
exports.checkPassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};
