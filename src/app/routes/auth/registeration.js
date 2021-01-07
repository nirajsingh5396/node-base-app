const express = require('express');
const router = express.Router();

const User = require('../../shared/model/user-reg-model');
const Validation = require('../../shared/validation/validation');
const verifyToken = require('../../shared/validation/verify')

//set routing here

const allUsers = async (req, res, next) => {
  const userId = req.user._id;
  
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send(err);
  }
}

//Get All Users
router.get('/rgs', verifyToken , allUsers);

//Get Specfic User
router.get('/rgs/:name', async (req, res, next) => {
  const name = req.params.name;
  try {
    const user = await User.findById(name);
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

//Create new User In DB
router.post('/rgs', async (req, res, next) => {

  //Validate user before user registeration
  const { error } = new Validation().registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check If Email is already Exists before user registeration
  try {
    const isEmailExist = await new Validation().isEmailExist(req.body.email);
    if (isEmailExist) return res.status(400).send('Email already exist');

    //Hash The Passwords
    const hashPassword = await new Validation().GetHashPassword(req.body.password);

    //Proceed to create new User
    await createNewUser(req, res, hashPassword);

  } catch (err) {
    return res.status(400).send(err.message)
  }

});

//UpDate User In DB
router.patch('/rgs/:id', async (req, res, next) => {
  try {
    const removedUser = await User.updateOne({ _id: req.params.id }, {
      $set: { name: req.body.name, email: req.body.email, password: req.body.password }
    }); res.status(200).send(removedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//Delete User In DB
router.delete('/rgs/:id', async (req, res, next) => {
  try {
    const removedUser = await User.remove({ _id: req.params.id });
    res.status(200).send(removedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});


async function createNewUser(req, res, hashPassword) {

  //Create new User
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword
  });
  try {
    const savedUser = await user.save();
    return res.status(200).send({ name: savedUser.name, email: savedUser.email });
  } catch (err) {
    return res.status(400).send(err.message);
  }
}




//exports here

module.exports = router;