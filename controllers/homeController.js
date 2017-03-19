//pass in exports obj
//handle various request types for home portion of web page
(function (homeController) {
    //app responds to http verbs using methods
    homeController.init = function (app) {
        var data = require("../data");
        var auth = require("../auth");

        //can use a view engine if returning view -> the below uses views

        //Jade - haml like syntax
        //         app.get("/viewengines/jade", function(req, res) {
        //             res.render("jade/index.jade", {title: "Express + Jade"});
        //         });

        //Ejs - webforms like syntax
        //         app.get("/viewengines/ejs", function(req,res){
        //             res.render("ejs/index.ejs", {title: "Express + EJS"});
        //         });

        //Vash - razor like syntax
        app.get("/", function (req, res) {
            data.getNoteCategories(function (err, results) {
                //render is for returning html
                res.render("index.vash",
                {
                    title: "The Board",
                    error: err,
                    categories: results,
                    newCatError: req.flash("newCatName"), //temp way of storing error info
                    user: req.user //passport will ensure this is included in each request once authenticated
                });
            });
        });

        app.get("/notes/:categoryName",
            auth.ensureAuthenticated, //don't call but give 'get notes' the function
            //if it succeeds it will call the below function
            function (req, res) {
                let categoryName = req.params.categoryName;
                res.render("notes", { title: categoryName, user: req.user });
            });

        //Post for the form
        app.post("/newCategory", //urlencodedParser,
            function (req, res) {
                var categoryName = req.body.categoryName;
                data.createNewCategory(categoryName,
                    function (err) {
                        if (err) {
                            //handle error
                            console.log(err);
                            //use connect flash, and we can pass some temp message and show the error
                            req.flash("newCatName", err);
                            res.redirect("/");
                        } else {
                            res.redirect("/notes/" + categoryName);
                        }
                    });
            });

        //generic api example
        app.get("/api/users", function (req, res) {
            res.set("Content-Type", "application/json");
            res.send({
                name: 'me', isValid: true, group: 'admin'
            });
        });

    }
})(module.exports);