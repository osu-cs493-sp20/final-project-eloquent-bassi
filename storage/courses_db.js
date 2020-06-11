const mysqlpool = require('../lib/mysqlPool')

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
  const [ result ] = await mysqlPool.query('INSERT INTO Course SET ?',course);
  return result;
}

exports.find_by_id = async (id) => {
  const [ result ] = await mysqlPool.query('SELECT * FROM Course WHERE course_id = ?;',id);
  return result;
}

exports.update_by_id = async (id) => {
    return
}

exports.remove_by_id = async (id) => {
    return
}

exports.students_by_id = async (id) => {
    return
}

exports.enroll_by_id = async (id) => {
    return
}

exports.roster_by_id = async (id) => {
    return
}

exports.assignments_by_id = async (id) => {
    return
}

async function getCourseCount() {
  const [ results ] = await mysqlPool.query(
    'SELECT COUNT(*) AS count FROM Course'
  );
  return results[0].count;
}
