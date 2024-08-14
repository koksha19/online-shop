const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const notFoundController = require('./controllers/notFound');


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('66b9d20d911e758b5e5a7a13')
        .then(user => {
            req.user = new User(user.username, user.email, user.cart, user._id);
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(notFoundController.getNotFound);

mongoose
    .connect('mongodb+srv://levbereza:kokshadatabases@cluster0.zpnre.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
    app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })


