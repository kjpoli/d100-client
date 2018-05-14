const express = require('express');
const url = require('url');

const constructorMethod = (app, passport) => {
    var campaign = require('../controllers/campaignController');

    // dev routes for testing, renders a blank gameboard
    app.get('/dev/game', async (req, res) => {
        //the gameboard is technically not a layout but has more in common with a layout than
        // the other templates (contains the head, stuff you cant have twice in a valid document)
        res.render('./layouts/gameboard.handlebars', {layout:false});
    });
    app.get('/dev/refcards', async (req, res) => {
        res.render('profile');
    });

    app.get('/', async (req, res) => {
        res.render('index');
    });

    app.get('/login', async (req, res) => {
        res.render('login', { message: req.flash('loginMessage') });
    });

    app.get('/signup', async (req, res) => {
        res.render('signup', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/campaign',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/campaign',
        failureRedirect : '/login',
        failureFlash : true
    }));
/*
    app.get('/profile', isLoggedIn, async (req, res) => {
        res.render('profile', { user: req.user });
    });
*/
    app.get('/campaign', isLoggedIn, async (req, res) => {
        res.render('campaign', { user: req.user });
    });

    app.get('/campaign/create', isLoggedIn, async (req, res) => {
        res.render('createCampaign', { user: req.user });
    });

    app.post('/campaign/create', isLoggedIn, campaign.createCampaign);

    app.get('/campaign/join', isLoggedIn, async (req, res) => {
        var q = url.parse(req.url, true);
        var campaignId = q.query.campaignId;
        res.redirect(`/campaign/${campaignId}`);
    });
/*
    app.get('/campaign/character', isLoggedIn, async (req, res) => {
        res.render('createCharacter', { campaignId: req.param.id });
    });
*/
    app.post('/campaign/character', isLoggedIn, campaign.createCharacter);

    app.get('/campaign/:id', isLoggedIn, campaign.joinCampaign);

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
