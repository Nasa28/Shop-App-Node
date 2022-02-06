const express = require('express');
const userController = require('../controllers/authController');

const { signUp } = userController;

const router = express.Router();

router.post('/', signUp);

// router.get('/', getUsers)

module.exports = router;
