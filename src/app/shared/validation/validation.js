const joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');

const User = require('../../shared/model/user-reg-model');

class Validation {

  constructor() { }

  //Email exist Validation
  async isEmailExist(email) {
    try {
      const isEmailExist = await User.findOne({ email: email });
      if (isEmailExist) return isEmailExist;
    } catch (err) {
      return err;
    }
  }

  //Register Validation
  registerValidation(user) {
    const userSchema = joi.object({
      name: joi.string().min(6).required(),
      email: joi.string().min(6).required().email(),
      password: joi.string().min(6).required()
    });
    return userSchema.validate(user);
  }

  //Login Validation
  loginValidation(user) {
    const userSchema = joi.object({
      email: joi.string().min(6).required().email(),
      password: joi.string().min(6).required()
    });
    return userSchema.validate(user);
  }

  //Hash password
  async GetHashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  }
}

module.exports = Validation;