const mysqlpool = require('../lib/mysqlPool')

/**
 * @param {json} user object
 * @returns {integer}
 * @throws {user_db.UserAlreadyExists}
 */
exports.create = async (user) => {
    let id = await mysqlpool.query(`SELECT user_id FROM Users WHERE email = ${user.email}`)
    if(id){
        throw new Error("user_db.UserAlreadyExists")
    }
    else{
        return await mysqlpool.query(`INSERT INTO Users(name,email,password,role) 
        VALUES("${user.name}","${user.email}","${user.password}","${user.role}")`)
    }
}

/**
 * @param {integer} id
 * @returns {boolean} Weather or not the id exists
 */
exports.exists = async (id) => {
    let name = await mysqlpool.query(`SELECT name FROM Users WHERE user_id = ${id}`)
    if(name){
        return true
    }
    else{
        return false
    }
}

/**
 * @param {integer} id
 * @returns {json} An object with the users info
 * @throws {user_db.UserIdNotFound}
 */
exports.find_by_id = async (id) => {//FIXME: Do we want to return the password with this call?
    let user = await mysqlpool.query(`SELECT * FROM Users WHERE user_id = ${id}`)
    if(user){
        return user
    }
    else{
        throw new Error("user_db.UserIdNotFound")
    }
}

/**
 * @param {string} email
 * @returns {string} hashed password
 * @throws {user_db.EmailNotFound} when the email cannot be found
 */
exports.find_hash_by_email = async (email) => {
    let password = await mysqlpool.query(`SELECT password FROM Users WHERE email = "${email}"`)
    if(password){
        return password
    }
    else {
        throw new Error("user_bd.EmailNotFound")
    }
}

/**
 * @param {string} email
 * @returns {number} user id
 * @throws {user_db.EmailNotFound} when the email cannot be found
 */
exports.find_id_by_email = async (email) => {
    let id = await mysqlpool.query(`SELECT user_id FROM Users WHERE email = "${email}"`)
    if(id){
        return id
    }
    else{
        throw new Error("user_db.EmailNotFound")
    }
}

/**
 * @param {number} id
 * @returns {array[json]} All of the corses the instructor owns. Can be empty
 */
exports.get_corses_by_instructor_id = async (id) => {
    return await mysqlpool.query(`SELECT * FROM Corse WHERE instructorId = ${id}`)
    
}

/**
 * @param {number} id
 * @returns {array[json]} All of the corses the student is in. Can be empty
 */
exports.get_corses_by_student_id = async (id) => {//TODO: This
    return await mysqlpool.query(`SELECT * FROM Corse INNER JOIN Enrolled_in ON 
    Enrolled_in.student_id = ${id} AND Enrolled_in.corse_id = Corse.corse_id`)
}