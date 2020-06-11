const mysqlpool = require('../lib/mysqlPool')
const { extractValidFields } = require('../lib/validate');
const mysqlPool = require('../lib/mysqlPool');

exports.create = async (assignment) => {
    let params = [
        assignment.course_id,
        assignment.title,
        assignment.points,
        assignment.due
    ];
    const [ result ] = await mysqlPool.query('INSERT INTO Assignment(course_id, title, points, due) VALUES(?,?,?,?);', params);
    return result.insertId;
}

exports.submit = async (submission, courseId) => {
    //Check if student is enrolled in the class
    const enrolled = await mysqlPool.query(`SELECT * FROM Enrolled WHERE 
                                            student_id=${submission.studentId} AND 
                                            course_id=${courseId}`);
    if(enrolled){
        let params = [
            submission.assignment_id,
            submission.student_id,
            submission.timestamp,
            submission.file
        ];
        const [ result ] = await mysqlPool.query('INSERT INTO Submission(assignment_id, student_id, timestamp, file) VALUES(?,?,?,?);', params); 
        return result.insertId;
    }
    else{
        return false;
    }
}

exports.find_by_id = async (id) => {
    const [result] = await mysqlPool.query('SELECT * FROM Assignment WHERE assignment_id= ?', id);
    return result[0];
}

exports.update_by_id = async (id, assignment) => {
    const [result] = await mysqlPool.query('UPDATE Assignment SET ? WHERE assignment_id = ?', [assignment, id]);

    return result;
}

exports.remove_by_id = async (id) => {//TODO: This
    const [ result ] = await mysqlPool.query('DELETE * FROM Assignment WHERE assignment_id = ?', id);
    return result;
}

exports.submissions_by_id = async (id, page) => {
    //Get count
    const [ results ] = await mysqlPool.query(
        'SELECT COUNT(*) AS count FROM Submissions');
    const count = results[0].count;

    const pageSize = 10;
    const lastPage = Math.ceil(count / pageSize);
    page = page > lastPage ? lastPage : page;
    page = page < 1 ? 1 : page;
    const offset = (page - 1) * pageSize;

    const [ result ] = await mysqlPool.query('SELECT * FROM Submission WHERE assignment_id = ? ORDER BY id LIMIT ?,?', [id, offset, pageSize])
    return {
        submissions: result,
        page: page,
        totalPages: lastPage,
        pageSize: pageSize,

    }
}

exports.submissions_by_studentId = async (id, studentId, page) =>{
        //Get count
    const [ results ] = await mysqlPool.query(
        'SELECT COUNT(*) AS count FROM Submissions');
    const count = results[0].count;

    const pageSize = 10;
    const lastPage = Math.ceil(count / pageSize);
    page = page > lastPage ? lastPage : page;
    page = page < 1 ? 1 : page;
    const offset = (page - 1) * pageSize;

    const [ result ] = await mysqlPool.query(
        'SELECT * FROM Submission WHERE student_id = ? AND assignment_id = ? ORDER BY id LIMIT ?,?', 
        [studentId, id, offset, pageSize]);
    return {
        submissions: result,
        page: page,
        totalPages: lastPage,
        pageSize: pageSize,  
    }
}

exports.update_submission_by_id = async (id) => {//TODO: This
    const [result] = await mysqlPool.query('UPDATE Submission SET ? WHERE assignment_id = ?', [assignment, id]);
    return result;
}