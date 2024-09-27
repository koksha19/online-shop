const crypto = require("crypto");
require("dotenv").config();

const bcrypt = require("bcryptjs");
const Mailjet = require("node-mailjet");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE,
});

exports.getLogin = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message,
  });
};

exports.getSignup = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    pageTitle: "Sign up",
    path: "/signup",
    errorMessage: message,
  });
};

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: errors.array()[0].msg,
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.user = user;
          req.session.isLoggedIn = true;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        req.flash("error", "Invalid email or password");
        res.redirect("/login");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postSignup = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg);
    return res.status(422).render("auth/signup", {
      pageTitle: "Sign up",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
    });
  }

  bcrypt
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
      res.redirect("/login");
      const request = mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "lev.bereza@gmail.com",
            },
            To: [
              {
                Email: email,
              },
            ],
            Subject: "Signup successful",
            TextPart: "You signed up successfully",
            HTMLPart: "<h1>You successfully signed up</h1>",
          },
        ],
      });
      return request
        .then((result) => {
          console.log(result.body);
        })
        .catch((err) => {
          console.log(err.statusCode);
        });
    });
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getResetPassword = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset-password", {
    pageTitle: "Reset password",
    path: "/reset-password",
    errorMessage: message,
  });
};

exports.postResetPassword = (req, res) => {
  crypto.randomBytes(32, (err, buf) => {
    if (err) {
      console.log(err);
      res.redirect("/reset-password");
    }
    const token = buf.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "User with such email does not exist");
          return res.redirect("/reset-password");
        }
        user.token = token;
        user.tokenExpirationDate = Date.now() + 100000000;
        return user.save();
      })
      .then(() => {
        res.redirect("/");
        const request = mailjet.post("send", { version: "v3.1" }).request({
          Messages: [
            {
              From: {
                Email: "lev.bereza@gmail.com",
              },
              To: [
                {
                  Email: req.body.email,
                },
              ],
              Subject: "Password resetting",
              TextPart: "Password resetting request",
              HTMLPart: `<h1>You are trying to reset password</h1>
                                           <p>Click the <a href="http://localhost:3000/reset-password/${token}">link</a> to reset your password</p>                 
                                `,
            },
          ],
        });
        return request
          .then(() => {
            console.log("Email sent");
          })
          .catch((err) => {
            console.log(err.statusCode);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res) => {
  const token = req.params.token;
  User.findOne({ token: token, tokenExpirationDate: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        pageTitle: "New password",
        path: "/new-password",
        errorMessage: message,
        userId: user._id,
        token: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const token = req.body.token;
  let resetUser;

  User.findOne({
    token: token,
    tokenExpirationDate: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.token = undefined;
      resetUser.tokenExpirationDate = undefined;
      return resetUser.save();
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
