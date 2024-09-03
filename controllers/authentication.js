const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res) => {
    //console.log(req.session.user);
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
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.user = user;
                        req.session.isLoggedIn = true;
                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    res.redirect('/login');
                })
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postSignup = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmedPassword = req.body.confirmedPassword;

    User.findOne({ email: email })
        .then((userDoc) => {
            if (userDoc) {
                return res.redirect('/signup');
            }
            return bcrypt
                .hash(password, 12)
                .then((hashedPassword) => {
                const user = new User({
                    email: email,
                    password: hashedPassword,
                    cart: { items: [] },
                });
                return user.save();
            })
                .then(() => {
                    res.redirect('/login');
                });
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}