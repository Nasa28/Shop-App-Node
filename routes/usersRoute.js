const express = require('express');
const authController = require('../controllers/authController');

const userController = require('../controllers/userController');
const { getUser, getUsers, updateUser, deleteUser, deleteMe, updateMe } =
  userController;

const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  protectRoutes,
  updatePassword,
  restrictTo,
} = authController;

const router = express.Router();

router.post('/signUp', signUp);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protectRoutes, updatePassword);
router.delete('/deleteMe', protectRoutes, deleteMe);

router.patch('/updateMe', protectRoutes, updateMe);
router.get('/', protectRoutes, restrictTo('admin'), getUsers);
router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(protectRoutes, restrictTo('admin'), deleteUser);

module.exports = router;
