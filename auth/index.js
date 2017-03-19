(function (auth) {

    var data = require("../data");
    var hasher = require("./hasher");
    var passport = require("passport");
    var localStrategy = require("passport-local").Strategy;

    function userVerify(username, password, next) {
        data.getUser(username, function (err, user) {
            if (!err && user) {
                var testHash = hasher.computeHash(password, user.salt);
                if (testHash === user.passwordHash) {
                    //success
                    next(null, user);
                    return;
                }
            }
            //false
            next(null, false, { message: "Invalid Credentials" });
        });
    }

    auth.init = function (app) {

        //setup passport auth
        passport.use(new localStrategy(userVerify));

        passport.serializeUser(function (user, next) {
            next(null, user.username);
        });

        passport.deserializeUser(function (key, next) {
            data.getUser(key,
                function (err, user) {
                    if (err) {
                        next(null, false, { message: "Failed to retrieve user" });
                    } else {
                        next(null, user);
                    }
                });
        });
        app.use(passport.initialize());
        app.use(passport.session());

        app.get("/login", function (req, res) {
            res.render("login", { title: "Login to The Board", message: req.flash("loginError") });
        });

        //need next here based on whether or not login is successful
        app.post("/login", function (req, res, next) {
            //put together object that can be called for authentication
            var authFunction = passport.authenticate("local", function (err, user, info) {
                if (err) {
                    //error
                    next(err);
                } else {
                    req.logIn(user, function (err) {
                        if (err) {
                            next(err);
                        } else {
                            res.redirect("/");
                        }
                    });
                }
            });
            //actual authentication
            authFunction(req, res, next);
        });

        app.get("/register", function (req, res) {
            res.render("register", { title: "Register for the The Board", message: req.flash("registrationError") });
        });

        app.post("/register", function (req, res) {
            //randomly generated string that makes the password hash that much more difficult to break
            var salt = hasher.createSalt();

            var user = {
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                passwordHash: hasher.computeHash(req.body.password, salt),
                salt: salt
            };

            //can verify at http://localhost:28017/theBoard/users/
            data.addUser(user,
                function (err) {
                    if (err) {
                        req.flash("registrationError", "Could not save user to database.");
                        res.redirect("/register");
                    } else {
                        res.redirect("/login");
                    }
                });
        });
    }

})(module.exports);