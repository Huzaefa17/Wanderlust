const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate= require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash= require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

app.use(flash());

const sessionOptions = {
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
};

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

const listingRoutes = require('./routes/listing');
const reviewRoutes = require('./routes/review');

app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/wanderlust');
}

main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.send('Welcome to the Wanderlust!');
});

app.use('/listings', listingRoutes); // Use the listing routes for any path starting with /listings
app.use('/listings/:id/reviews', reviewRoutes); // Use the review routes for any path starting with /listings/:id/reviews

app.use((req, res, next) => { // for any path that is not matched
    next(new ExpressError(404,'Page Not Found'));
});

app.use((err, req, res, next) => { // error handling middleware
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render('error.ejs', { message });
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});