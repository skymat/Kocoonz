var express = require('express');
var request = require('request');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
var mongoose= require('mongoose');
var session = require("express-session");
//var Trello = require("node-trello");

//var Mailchimp = require('mailchimp-api-v3')
//var mailchimp = new Mailchimp("d4d1fd4cbb4d4f1b8165eff1d880c83e-us15");

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // this is used for parsing the JSON object from POST


//Initialisation de la sessionapp.use(
app.use(
 session({ 
  secret: 'a4f8071f-c873-4447-8ee2',
  resave: false,
  saveUninitialized: false,
 })
);

//Connexion à la base de données Mongo
mongoose.connect('mongodb://localhost/airbnblike' , function(err) {
  if (err) { throw err; }
});
/*
//Définition du schéma dans Mongo
var myMovieAccountSchema = mongoose.Schema({
    id: Number,
    favori: Boolean,
});

//Lie le schéma au model Mongo
var MyMovies = mongoose.model('MyMoviesOnly', myMovieAccountSchema);
*/

function home(req,res){

    var renderPage = function () {
        res.render('home', {});
    }
    renderPage();
}

app.get('/', function (req, res) {
    home(req,res);
});

app.get('/home', function (req, res) {
    home(req,res);
});

/////TRELLO
   // var t = new Trello("c25f219ff44b0d3f8935d648f58b92d3", "9c05ec27d1c3c19e9ad620af87b9d8d61ec75dd06c80b6f6179a73e748ddfc2f");


app.listen(process.env.PORT || 80, function () {
  console.log("Server listening on port 80");
});