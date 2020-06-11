const mysqlpool = require("../lib/mysqlPool");

/**
 * @typedef {dbCourse}
 * TODO: fill this out
 */

exports.get_all = async () => {
  //TODO: This
  return;
};

exports.create = async () => {
  //TODO: This
  return;
};

exports.find_by_id = async id => {
  //TODO: This
  return;
};

exports.update_by_id = async id => {
  //TODO: This
  return;
};

exports.remove_by_id = async id => {
  //TODO: This
  return;
};

exports.students_by_id = async id => {
  //TODO: This
  return;
};

exports.enroll_by_id = async id => {
  //TODO: This
  return;
};

exports.roster_by_id = async id => {
  //TODO: This
  return;
};

exports.assignments_by_id = async id => {
  //TODO: This
  return;
};

/**
 * find all courses that the student with id `id` is
 * enrolled in
 *
 * @param {number} id
 * @returns {[dbCourse]}
 */
exports.findByStudentId = async id => [];

/**
 * find all courses that the instructor with id `id` teaches
 *
 * @param {number} id
 * @returns {[dbCourse]}
 */
exports.findByInstructorId = async id => [];
