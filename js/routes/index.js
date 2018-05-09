const cardRoutes = require('./cards');

const constructorMethod = app => {
    app.use('/', cardRoutes);
    app.use('*', (req, resp) => {
        resp.redirect('/');
    });
};

module.exports = constructorMethod;