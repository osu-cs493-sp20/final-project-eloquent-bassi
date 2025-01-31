const mysqlpool = require('../lib/mysqlPool')

/**
 * @param {json} user object
 * @returns {integer}
 * @throws {user_db.UserAlreadyExists}
 */
exports.create = async (user) => {
    let [id] = await mysqlpool.query(`SELECT user_id FROM Users WHERE email = "${user.email}"`)
    if(id.length > 0){
        throw new Error("user_db.UserAlreadyExists")
    }
    else{
        let [val] = await mysqlpool.query(`INSERT INTO Users(name,email,password,role,description) 
        VALUES("${user.name}","${user.email}","${user.password}","${user.role}","")`)
        return val.insertId
    }
}

/**
 * @param {integer} id
 * @returns {boolean} Weather or not the id exists
 */
exports.exists = async (id) => {
    let [name] = await mysqlpool.query(`SELECT name FROM Users WHERE user_id = ${id}`)
    if(name != []){
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
    let [[user]] = await mysqlpool.query(`SELECT * FROM Users WHERE user_id = ${id}`)
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
    let [[password]] = await mysqlpool.query(`SELECT password FROM Users WHERE email = "${email}"`)
    password = password.password
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
    let [[id]] = await mysqlpool.query(`SELECT user_id FROM Users WHERE email = "${email}"`)
    id = id.user_id
    if(id){
        return id
    }
    else{
        throw new Error("user_db.EmailNotFound")
    }
}

/**
 * @param {number} id
 * @returns {array[json]} All of the courses the instructor owns. Can be empty
 */
exports.get_courses_by_instructor_id = async (id) => {
    let [val] = await mysqlpool.query(`SELECT * FROM Course WHERE instructor_id = ${id}`)
    return val
    
}

/**
 * @param {number} id
 * @returns {array[json]} All of the courses the student is in. Can be empty
 */
exports.get_courses_by_student_id = async (id) => {
    let [val] = await mysqlpool.query(`SELECT * FROM Course INNER JOIN Enrolled_in ON 
    Enrolled_in.student_id = ${id} AND Enrolled_in.course_id = Course.course_id`)
    return val
}

exports.removeJon = async () => {
    await mysqlpool.query(`DELETE FROM Users WHERE name = "Richj"`)
    await mysqlpool.query(`DELETE FROM Users WHERE name = "Jim"`)// Jim too
}
