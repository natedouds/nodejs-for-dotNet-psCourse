//built in http library (listen for requests and respond to them)
var http = require('http');
var express = require('express'); //serve via express

var app = express(); //singleton that represents our app
var controllers = require("./controllers");
var ejsEngine = require("ejs-locals"); //need instance of ejsLocals

//vash
app.set("view engine", "vash");

//ejs
// app.engine("ejs", ejsEngine); //support master pages
// app.set("view engine", "ejs"); //support the ejs view engine (embedded javascript)

//jade
// app.set("view engine", "jade"); //support the jade view engine

//set the public static resource folder
//__dirname is root directory of node app
app.use(express.static(__dirname + "/public"));

//map the routes
controllers.init(app);

//create web server
var server = http.createServer(app);

server.listen(3000);