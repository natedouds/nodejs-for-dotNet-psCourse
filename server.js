//built in http library (listen for requests and respond to them)
var http = require('http');
var express = require('express'); //serve via express
var app = express(); //singleton that represents our app
var controllers = require("./controllers");
var ejsEngine = require("ejs-locals"); //need instance of ejsLocals
var flash = require("connect-flash");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

//set the public static resource folder
//__dirname is root directory of node app
app.use(express.static(__dirname + "/public"));

//opt into services
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser());
app.use(session({ secret: "PluralsightTheBoard" })); //uses cookies
//flash uses session state, and express and node don't by default
app.use(flash());

//use authentication
var auth = require("./auth");
auth.init(app);

//vash
app.set("view engine", "vash");



//ejs
// app.engine("ejs", ejsEngine); //support master pages
// app.set("view engine", "ejs"); //support the ejs view engine (embedded javascript)

//jade
// app.set("view engine", "jade"); //support the jade view engine

//map the routes
controllers.init(app);

//create web server
var server = http.createServer(app);

//listen as web server
server.listen(3000);

//socket io impl
var updater = require("./updater");
//server obj is what socket io will attach to for its messages
updater.init(server);