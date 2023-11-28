'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config').development; 
const User = require('./User');

const Course = sequelize.define('Course', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  estimatedTime: {
    type: DataTypes.STRING,
  },
  materialsNeeded: {
    type: DataTypes.STRING,
  },
});

Course.belongsTo(User,{foreignKey:'userId'});

module.exports = Course;