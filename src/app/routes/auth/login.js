const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Validation = require('../../shared/validation/validation');

//set routing here

router.post('/login', async (req, res, next) => {
  //Validate user before register user
  const { error } = new Validation().loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    //Check User exists or not
    const user = await new Validation().isEmailExist(req.body.email);
    if (!user) return res.status(400).send('Email does not exists');

    //Check User Password
    const isValidPassword = await bcrypt.compare(req.body.password , user.password);
    if(!isValidPassword) return res.status(400).send('Password does not match');

    //Create and Assign jwt token
    const jwtToken = jwt.sign({_id: user._id} , process.env.SECRET_KEY);
    res.header('auth-token', jwtToken).status(200).send(jwtToken);
  } catch (err) {
    return res.status(400).send(err.message)
  }
});

//exports here

module.exports = router;