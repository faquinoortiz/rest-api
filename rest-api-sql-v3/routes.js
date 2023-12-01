const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authUser = require('./middlewares/authUser');
const { Course, User } = require('./models');

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}

// GET All Users
router.get('/users', authUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  res.status(200).json(user);
}));

// POST route to create a new user
router.post('/users', asyncHandler(async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.location('/');
    res.status(201).end();
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', errors: error.errors });
  }
}));

// GET route to return all courses including the User associated with each course
router.get('/courses', authUser, asyncHandler(async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

// GET route to return a specific course including the associated User
router.get('/courses/:id', authUser, asyncHandler(async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

// POST route to create a new course
router.post('/courses', authUser, asyncHandler(async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);
    res.location(`/api/courses/${newCourse.id}`);
    res.status(201).end();
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', errors: error.errors });
  }
}));

// PUT route to update a specific course
router.put('/courses/:id', authUser, asyncHandler(async (req, res) => {
  const courseId = req.params.id;

  try {
    await updateResourceById(res, Course, courseId, req.body);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', errors: error.errors });
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