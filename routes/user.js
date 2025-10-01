const express = require('express');
const router = express.Router();
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controllers/user');


router.route('/signup')
    .get(userController.signUpForm)
    .post(userController.signUp);

router.route('/login')
    .get(userController.loginForm)
    .post(saveRedirectUrl, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    userController.login);


router.get('/logout', userController.logout);

module.exports = router;