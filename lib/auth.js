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

/**
 * @param {json} Authorization
 */
exports.checkJwt = async function(req,res,next) {
  const authHeader = req.get('Authorization') || ''
  const authHeaderParts = authHeader.split(' ')
  const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null
  if(token){
    try {
      const payload = checkJwt(token)
      req.jwt = payload
      next()
    } catch (err){
        console.error(err)
        res.status(401).send({error: "Invalid token"})
    }
  }

  /**
   * FIXME: No token do nothing. We could make them a guest?
   * req.jwt = { sub: null, role: "guest"}
   * next()
   */
}
