const express = require('express');

const constructorMethod = (app, passport) => {

    // dev routes for testing, renders a blank gameboard
    app.get('/dev/game', async (req, res) => {
        //the gameboard is technically not a layout but has more in common with a layout than
        // the other templates (contains the head, stuff you cant have twice in a valid document)
        res.render('./layouts/gameboard.handlebars', {layout:false});
    });
    //

    app.get('/', async (req, res) => {
        res.render('index.handlebars');
    });

    app.get('/login', async (req, res) => {
        res.render('login.handlebars', { message: req.flash('loginMessage') });
    });

    app.get('/signup', async (req, res) => {
        res.render('signup.handlebars', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));

    app.get('/profile', isLoggedIn, async (req, res) => {
        res.render('profile.handlebars', { user: req.user });
    });

    app.get('/logout', async (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.use('*', (req, res) => {
        res.redirect('/');
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = constructorMethod;
