const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/authentication');

const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/signUp', authController.getSignup);
router.post('/login', authController.postLogin);
router.post('/signup', check('email').isEmail().withMessage('Enter a valid email'), authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);
router.get('/reset-password/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;