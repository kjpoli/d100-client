const express = require('express');

const constructorMethod = (app, passport) => {
    var campaign = require('../controllers/campaignController');

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
        successRedirect : '/campagin',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/campaign',
        failureRedirect : '/login',
        failureFlash : true
    }));

    app.get('/profile', isLoggedIn, async (req, res) => {
        res.render('profile.handlebars', { user: req.user });
    });

    app.get('/campaign', isLoggedIn, async (req, res) => {
        res.render('campaign.handlebars', { user: req.user });
    });

    app.get('/character', isLoggedIn, async (req, res) => {
        res.render('character.handlebars');
    });

    app.post('/campaign', isLoggedIn, campaign.createCampaign);

    app.get('/campaign/:id', isLoggedIn, async (req, res) => {
        res.redirect('/character');
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
