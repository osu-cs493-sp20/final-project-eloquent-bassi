const mysqlpool = require('../lib/mysqlPool')
const { extractValidFields } = require('../lib/validate');
const mysqlPool = require('../lib/mysqlPool');

exports.create = async (assignment) => {
    let obj = {
        courseId: assignment.courseId,
        title: assignment.title,
        points: assignment.points,
        due: assignment.due
    };
    const [ result ] = await mysqlPool.query('INSERT INTO Assignment SET ?', obj);
    return result.insertId;
}

exports.submit = async (submission, assignmentId) => {
    //Check if student is enrolled in the class
    let sub = {
        assignmentId: 
    }
    return 
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