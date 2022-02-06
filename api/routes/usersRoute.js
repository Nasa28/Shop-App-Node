const express = require('express');
const userController = require('../controllers/authController');

const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  protectRoutes,
  updatePassword,
} = userController;

const router = express.Router();

router.post('/signUp', signUp);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protectRoutes, updatePassword);

// router.get('/', getUsers)

module.exports = router;
