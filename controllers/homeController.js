//pass in exports obj
//handle various request types for home portion of web page
(function(homeController) {


//app responds to http verbs using methods
    homeController.init = function(app) {
        var data = require("../data");

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
        app.get("/viewengines/vash", function(req,res){
            data.getNoteCategories(function (err, results) {
                res.render("index.vash", {title: "Express + Vash", error: err, categories: results});
            });
        });

        //generic api example
        app.get("/api/users", function(req,res) {
            res.set("Content-Type", "application/json");
            res.send({
                name: 'me', isValid: true, group: 'admin'
            });
        });





    }
})(module.exports);