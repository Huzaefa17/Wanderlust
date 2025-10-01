const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const User = require('../models/user');
const { saveRedirectUrl } = require('../middleware');

router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});

router.post('/signup', async (req, res , next) => {
    try{
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.login(newUser, err => { // auto login after signup, it's is a passport method added to req object for starting a login session
            if (err) return next(err);
            req.flash('success', 'Welcome to Wanderlust!');
            res.redirect('/listings');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/signup');
    }
    
});

router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

router.post('/login', saveRedirectUrl, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    console.log('returnTo:', req.session.returnTo);
    console.log('Session ID in login:', req.sessionID);
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.redirectUrl || '/listings'; // req.session.returnTo is defined in isLoggedIn middleware
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    req.logout(function(err) { // passport method to terminate a login session
        if (err) { return next(err); }
        req.flash('success', 'Goodbye!');
        res.redirect('/login');
    });
});

module.exports = router;