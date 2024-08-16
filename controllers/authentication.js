const User = require('../models/user');

exports.getLogin = (req, res) => {
    console.log(req.session.user.populate);
   /* const isLoggedIn = req
        .get('Cookie')
        .split(';')[1]
        .split('=')[1] === 'true';*/
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: false,
    });
}

exports.postLogin = (req, res, next) => {
    User.findById('66bc76eaabc3bfbeb49647c1')
        .then(user => {
            req.session.user = {...user}    ;
            req.session.isLoggedIn = true;
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
};