const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/authentication');
const {ignore} = require("nodemon/lib/rules");

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signUp', authController.getSignup);

router.post('/login', authController.postLogin);

router.post(
    '/signup',
    [check('email')
        .isEmail()
        .withMessage('Enter a valid email'),
    check('password', 'A password has to be at least 5 characters long and should contain only numbers and letters')
        .isLength({ min: 5 })
        .isAlphanumeric(),
    check('confirmedPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset-password', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);

router.get('/reset-password/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;