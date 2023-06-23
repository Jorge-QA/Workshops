const Course = require("../models/courseModel");

/**
 * Creates a course
 *
 * @param {*} req
 * @param {*} res
 */
const coursePost = async (req, res) => {
  let course = new Course(req.body);
  await course
    .save()
    .then((course) => {
      res.status(201); // CREATED
      res.header({
        location: `/api/courses/?id=${course.id}`,
      });
      res.json(course);
    })
    .catch((err) => {
      res.status(422);
      console.log("error while saving the course", err);
      res.json({
        error: "There was an error saving the course",
      });
    });
};

/**
 * Get all courses or one
 *
 * @param {*} req
 * @param {*} res
 */
const courseGet = (req, res) => {
  // if an specific course is required
  if (req.query && req.query.name) {         // if (req.query && req.query.id) {  (traerlo por nombre)
    Course.findOne({ name: req.query.name })  //   Course.findById(req.query.id)
      .then((course) => {
        res.json(course);
      })
      .catch((err) => {
        res.status(404);
        console.log("error while queryting the course", err);
        res.json({ error: "Course doesnt exist" });
      });
  } else if (req.query.sort === "asc") {
    Course.find()
      .then((courses) => {
        courses = courses.sort((a, b) => a.name.localeCompare(b.name));
        res.json(courses);
      })
      .catch((err) => {
        res.status(422);
        res.json({ error: err });
      });
  } else if (req.query.sort === "desc") {
    Course.find()
      .then((courses) => {
        courses = courses.sort((a, b) => b.name.localeCompare(a.name));
        res.json(courses);
      })
      .catch((err) => {
        res.status(422);
        res.json({ error: err });
      });
  } else {
    // get all courses
    Course.find()
      .then((courses) => {
        res.json(courses);
      })
      .catch((err) => {
        res.status(422);
        res.json({ error: err });
      });
  }
};

/**
 * Updates a course
 *
 * @param {*} req
 * @param {*} res
 */
const coursePatch = (req, res) => {
  // get course by id
  if (req.query && req.query.id) {
    Course.findById(req.query.id, function (err, course) {
      if (err) {
        res.status(404);
        console.log("error while queryting the course", err);
        res.json({ error: "Course doesnt exist" });
      }
      // update the course object (patch)
      course.name = req.body.name ? req.body.name : course.name;
      course.credits = req.body.credits ? req.body.credits : course.credits;
      course.teacher = req.body.teacher ? req.body.teacher : course.teacher;

      // update the teacher object (put)
      // teacher.title = req.body.title
      // teacher.detail = req.body.detail

      course.save(function (err) {
        if (err) {
          res.status(422);
          console.log("error while saving the course", err);
          res.json({
            error: "There was an error saving the course",
          });
        }
        res.status(200); // OK
        res.json(course);
      });
    });
  } else {
    res.status(404);
    res.json({ error: "Course doesnt exist" });
  }
};

/**
 * Deletes a course
 *
 * @param {*} req
 * @param {*} res
 */
const courseDelete = (req, res) => {
  // get course by id
  if (req.query && req.query.id) {
    Course.findById(req.query.id, function (err, course) {
      if (err) {
        res.status(404);
        console.log("error while queryting the course", err);
        res.json({ error: "Course doesnt exist" });
      }

      course.deleteOne(function (err) {
        if (err) {
          res.status(422);
          console.log("error while deleting the course", err);
          res.json({
            error: "There was an error deleting the course",
          });
        }
        res.status(204); //No content
        res.json({});
      });
    });
  } else {
    res.status(404);
    res.json({ error: "Course doesnt exist" });
  }
};

module.exports = {
  coursePost,
  courseGet,
  coursePatch,
  courseDelete,
};
