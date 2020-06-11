const mysqlpool = require('../lib/mysqlPool')
const { extractValidFields } = require('../lib/validate');
exports.get_all = async () => {
  const [ result ] = await mysqlPool.query('SELECT * FROM Course');
  return result;
}

exports.get_page = async (page) => {
  const count = await getCourseCount();
  const pageSize = 10;
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;

  const [ results ] = await mysqlPool.query('SELECT * FROM Course ORDER BY id LIMIT ?,?', [ offset, pageSize ] );
  return {
    courses: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count
  };
}

exports.create = async (course) => {
  course = extractValidFields(course, CourseSchema);
  const [ result ] = await mysqlPool.query('INSERT INTO Course SET ?',course);
  return result.insertId;
}

exports.find_by_id = async (id) => {
  const [ result ] = await mysqlPool.query('SELECT * FROM Course WHERE course_id = ?;',id);
  return result;
}

exports.update_by_id = async (id, course) => {
  const [ result ] = await mysqlPool.query('UPDATE SET ? WHERE course_id = ?', [course,id]);
  return result;
}

exports.remove_by_id = async (id) => {
  const [ result ] = await mysqlPool.query('DELETE * FROM Course WHERE course_id = ?;',id);
  return result;
}

exports.students_by_id = async (id) => {
  const [ result ] = await mysqlPool.query('SELECT * FROM Enrolled_in JOIN Users WHERE Enrolled_in.student_id = Users.user_id AND course_id = ?;',id);
  return result;
  return
}

exports.enroll_by_id = async (course_id, student_id) => {
  const [ result ] = await mysqlPool.query('INSERT INTO Enrolled_in (course_id,student_id) VALUES (?, ?);',[course_id,student_id]);
  return result;
}

exports.unenroll_by_id = async (course_id, student_id) => {
  const [ result ] = await mysqlPool.query('DELETE FROM Enrolled_in WHERE course_id = ? AND student_id = ?;',[course_id,student_id]);
  return result;
}

exports.assignments_by_id = async (id) => {
  const [ result ] = await mysqlPool.query('SELECT * FROM Assignment WHERE course_id = ?;',id);
  return result;
}

async function getCourseCount() {
  const [ results ] = await mysqlPool.query(
    'SELECT COUNT(*) AS count FROM Course'
  );
  return results[0].count;
}
