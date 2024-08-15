exports.getLogin = (req, res) => {
    const isLoggedIn = req
        .get('Cookie')
        .split(';')[1]
        .split('=')[1] === 'true';
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: isLoggedIn,
    });
}

exports.postLogin = (req, res) => {
    res.setHeader('Set-Cookie', 'loggedIn=true');
    res.redirect('/');
}