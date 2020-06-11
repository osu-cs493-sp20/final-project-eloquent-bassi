const mysqlpool = require('../lib/mysqlPool')
const { extractValidFields } = require('../lib/validate');
const mysqlPool = require('../lib/mysqlPool');

exports.create = async (assignment) => {
    let params = [
        assignment.courseId,
        assignment.title,
        assignment.points,
        assignment.due
    ];
    const [ result ] = await mysqlPool.query('INSERT INTO Assignment(courseId, title, points, due) ', params);
    return result.insertId;
}

exports.submit = async (submission, courseId) => {
    //Check if student is enrolled in the class
    const enrolled = await mysqlPool.query(`SELECT * FROM Enrolled WHERE 
                                            studentId=${submission.studentId} AND 
                                            course_id=${courseId}`);
    if(enrolled){
        let params = [
            submission.assignmentId,
            submission.studentId,
            submission.timestamp,
            submission.file
        ];
        const [ result ] = await mysqlPool.query('INSERT INTO Submission(assignmentId, studentId, timestamp, file', params); 
        return result.insertId;
    }
    else{
        return false;
    }
}

exports.find_by_id = async (id) => {//TODO: This
    return
}

exports.update_by_id = async (id, assignment) => {//TODO: This
    return
}

exports.remove_by_id = async (id) => {//TODO: This
    return
}

exports.submissions_by_id = async (id, page) => {//TODO: This
    return
}

exports.submissions_by_studentId = async (id, studentId, page) =>{//TODO: this
    return 
}

exports.update_submission_by_id = async (id) => {//TODO: This
    return
}