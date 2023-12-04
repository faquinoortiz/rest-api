const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authUser = require('./middleware/authUser');
const { User, Course } = require('./models');

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error)
    }
  };
}

// GET All Users
router.get('/users', authUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  res.status(200).json(user);
}));

// Create a new user
router.post('/users', asyncHandler(async (req, res) => {
  try {
    let user = req.body
    if(user.password){
      user.password = bcrypt.hashSync(user.password,8-20)
    }
    await User.create(user);
    res.status(201).location('/').end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors= { errors: error.errors.map((error) => error.message) }
      res.status(400).json({ errors});
 
    } else {
      throw error;
    }
  }
}));

// GET All courses
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
      },
    ],
  });
  if (!courses){
    res.status(404).json({ message: 'Courses not found' });
  } else {
    res.status(200).json(courses);
  }
}));

// GET a specific course
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
      },
    ],
  });
  if (course) {
    res.status(200).json(course);
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
}));

// Create a new course
router.post('/courses', authUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).location(`/courses/${course.id}`).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ errors: error.errors.map((error) => error.message) });
    } else {
      throw error;
    }
  }
}));

// PUT route to update a specific course
router.put('/courses/:id', authUser, asyncHandler(async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await Course.update(req.body, { where: { id: courseId } });
    res.status(204).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      
      res.status(400).json({ errors: error.errors.map((error) => error.message) });
    } else {
      throw error;
    }
  }
}));

// DELETE route to delete a specific course
router.delete('/courses/:id', authUser, asyncHandler(async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await Course.findByPk(courseId);

    if (course) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Bad Request' });
  }
}));

module.exports = router;