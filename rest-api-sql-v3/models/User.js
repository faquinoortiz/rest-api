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
          isEmail: {
            msg: 'Please provide a valid email address',
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
          notEmpty: {
            msg: 'Please provide a valid password',
          },
        },
      },
    },
    { sequelize }
  );
User.associate = (models) =>{
  User.hasMany(models.Course,{
     as: 'user',
     foreignKey: {
        fieldName:'userId',
        allowNull:false,
     }
  })
}
  return User;
};
