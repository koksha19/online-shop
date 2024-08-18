const User = require('../models/user');

exports.getLogin = (req, res) => {
    console.log(req.session.user);
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: false,
    });
}

exports.getSignup = (req, res) => {
    res.render('auth/signup', {
        pageTitle: 'Sign up',
        path: '/signup',
        isAuthenticated: false,
    });
}

exports.postLogin = (req, res) => {
    User.findById('66bc76eaabc3bfbeb49647c1')
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            req.session.save((err) => {
                console.log(err);
                res.redirect('/');
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postSignup = (req, res) => {

};

exports.postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}