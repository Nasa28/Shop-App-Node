const express = require('express');
const userController = require('../controllers/authController');

const { signUp, login } = userController;

const router = express.Router();

router.post('/signUp', signUp);
router.post('/login', login);

// router.get('/', getUsers)

module.exports = router;
