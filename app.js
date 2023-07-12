//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { sequelize, testDatabaseConnection } = require("./config/database");
const User = require("./models/model");
const ModelItem = require("./models/modelItem");

const bcrypt = require("bcrypt");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();
const PORT = 3000;
const saltRounds = 10;

// Express session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ where: { email: email } })
      .then((user) => {
        if (!user) {
          return done(false, { message: "Incorrect email." });
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result == true) {
            return done(user);
          } else {
            return done(false, { message: "Incorrect password." });
          }
        });
      })
      .catch((err) => done(err));
  })
);

// Passport session setup
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({  }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("Main");
});

app.get("/home", (req, res) => {
  // if (req.isAuthenticated()) {
  //   res.render("Home");
  // } else {
  //   res.redirect("/login");
  // }

  ModelItem.findAll()
  .then((categoryList) => {
    res.render("Home");
  })

  // if (req.isAuthenticated()) {
  //   ModelItem.findAll().then((categoryList) => {
  //     res.render("Home", { categoryList: categoryList });
  //   });
  // } else {
  //   res.redirect("/login");
  // }
});

app
  .route("/register")
  .get((req, res) => {
    res.render("Register");
  })
  .post((req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      User.create({
        name: req.body.name,
        number: req.body.number,
        email: req.body.email,
        password: hash,
      }).then((user) => {
        req.login(user, () => {
          res.redirect("/home");
        });
      });
    });
  });

app
  .route("/login")
  .get((req, res) => {
    if (req.isAuthenticated()) {
      res.redirect("/home");
    } else {
      res.render("Login");
    }
  })
  .post(
    passport.authenticate("local", {
      successRedirect: "home",
      failureRedirect: "/login",
    })
  );

app.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(()=>{
      res.redirect("/login");
    })
  });
});

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing models:", error);
  });
