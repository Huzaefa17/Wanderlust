const express = require('express');
const router = express.Router();
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controllers/user');

router.get('/signup', userController.signUpForm);

router.post('/signup', userController.signUp);

router.get('/login', userController.loginForm);

router.post('/login', saveRedirectUrl, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    userController.login
);

router.get('/logout', userController.logout);

module.exports = router;