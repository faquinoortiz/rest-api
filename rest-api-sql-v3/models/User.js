'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {}

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A first name is required',
          },
          notEmpty: {
            msg: 'Please provide a first name',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A last name is required',
          },
          notEmpty: {
            msg: 'Please provide a last name',
          },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Email address already in use!',
        },
        validate: {
          notNull: {
            msg: 'An email address is required',
          },
          notEmpty: {
            msg: 'Please provide an email address',
    
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A password required',
          },
          len: {
            args: [8, 20],
            msg: 'The password should be between 8 and 20 characters in length',
          },
        },
      },
    },
    { sequelize }
  );

  User.hasMany(Course, { foreignKey: 'userId' });

  return User;
};
module.exports = User;