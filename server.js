var express = require('express');
var app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());
const FileDirectory = "D:/TEMP/airbnblike-upload/";
const fs = require('fs-extra')

var request = require('request');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/static', express.static(FileDirectory));
var mongoose= require('mongoose');
var session = require("express-session");
var promise = require('promise');

//var Trello = require("node-trello");
// var t = new Trello("c25f219ff44b0d3f8935d648f58b92d3", "9c05ec27d1c3c19e9ad620af87b9d8d61ec75dd06c80b6f6179a73e748ddfc2f");
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

var appartSchema = mongoose.Schema({
    titre: String,
    description: String,
    ville: String,
    date_debut: Date,
    date_fin:Date,
    prix:Number,
    photo_name:String
});

var userSchema = mongoose.Schema({
    login: String,
    password: String,
    appart: [appartSchema]
  },
  { collection: 'userslist' }
);
var UserModel = mongoose.model('userslist', userSchema);

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

app.get('/find', function (req, res) {
    var message = "";
    var apparts = [];
    var  where = [];
    if (req.query.date_debut)
        where.push({'appart.date_debut' :{'$lte': req.query.date_debut}});
    if (req.query.date_fin)
        where.push({'appart.date_fin' :{'$gte': req.query.date_fin}});
    if (req.query.destination)
        where.push({'appart.ville' :req.query.destination.toLowerCase()});
    var query = UserModel.find();
    if (where.length > 0)
        query.and(where);
    query.exec(function (err, results) {
        var nbap = 0;
        results.forEach(function(element) {
            element.appart.forEach(function(appart) {
                if (req.query.destination ? appart.ville == req.query.destination.toLowerCase() : true){
                    if(req.query.date_debut ? appart.date_debut <= new Date(req.query.date_debut) : true){
                        if (req.query.date_fin ? appart.date_fin >= new Date(req.query.date_fin) : true){
                            console.log(appart);
                            apparts.push(appart);
                        nbap++;
                        }
                    }
                }
            }, this);
        }, this);
        console.log(nbap);
          res.render('find', {message,apparts});
      });
});


app.get('/hote', function (req, res) {
    var message = "";
    if (!req.session.user){
        message = "Veuillez créer un compte ou vous identifier avant de proposer un logement.";
    }
    res.render('hote', {message});
});

app.post('/add', function (req, res) {
    var message = "";
    if (req.session.user){
        if (!req.files){
            message = "Aucune photo uploadée."
        }
        console.log (req.body.photo);
        console.log(req.files);

        if (req.body && req.body.titre && req.body.description && req.body.ville && req.body.date_debut && req.body.prix && req.files && req.files.photo){


            // The name of the input field (i.e. "photo") is used to retrieve the uploaded file 
            let photo = req.files.photo;
            console.log(photo);

            UserModel.findById(req.session.user._id, function (err, user) {
                if (err){
                    message = "Une erreur est survenue, l'appartement n'a pas été enregistré.";
                    console.log(err);
                }
                else{
                    if (!req.body.date_fin)
                    {
                        dfin = new Date("2020-12-31");
                    }
                    else
                    {
                        dfin = new Date(req.body.date_fin);
                    }
                    var appart = {
                        titre : req.body.titre,
                        description : req.body.description,
                        ville : req.body.ville.toLowerCase(),
                        date_debut : new Date(req.body.date_debut),
                        date_fin : dfin,
                        prix : req.body.prix,
                        photo_name : photo.name
                    } 
                    user.appart.push(appart);
                    user.save(function (error, user) {  
                        if (error)
                        {
                            message = "Une erreur est survenue, votre appartement n'a pas été ajouté.";
                            console.log(user);
                            console.log(error);
                            res.render('hote', {message});
                        }
                        else{
                                var appartID = null;
                                user.appart.forEach(function(element) {
                                    if (element.photo_name == photo.name && element.ville == req.body.ville.toLowerCase() && element.prix == req.body.prix)
                                        appartID = element._id;
                                }, this);
                                if (!appartID){
                                    console.log("ERREUR, Pas d'Appart _ID");
                                }
                                var path = FileDirectory + appartID;
                                console.log(appartID);
                                fs.ensureDir(path, err => {
                                    console.log(err);
                                    // Use the mv() method to place the file somewhere on your server 
                                    photo.mv(path+"/"+photo.name, function(err) {
                                        if (err)
                                            return res.status(500).send(err);
                                    });
                                })

                                message = "Votre appartement a bien été enregistré. Il est désormais disponible à la location.";
                                res.render('hote', {message});
                        }
                    });
                    }
            });
        }
        else{
            message = "Veuillez renseigner tous les champs.";
            res.render('hote', {message});
            
        }
    }
    else
    {
        message = "ATTENTION : veuillez créer un compte ou vous identifier avant de proposer un logement."
        res.render('hote', {message});
    }
});


app.get('/register', function (req, res) {
    var message = "";
    if(req.query.email && req.query.password){
        return new Promise(function (resolve, reject) {
                UserModel.findOne({ login : req.query.email}, function (err, user) {
                    if(user != null) {
                        message = "Ce compte existe déjà. Veuillez vous loguer ou créer un autre compte";
                        reject(message);
                    }
                    else{
                        var user = new UserModel ({login : req.query.email,password:req.query.password,appart:[]});
                        user.save(function (error, user) {
                            if (error)
                                message = "Une erreur est survenue";
                            else
                            {
                                message = "Votre compte est créé, vous êtes logué.";
                                req.session.user = user;
                            }
                            resolve(message);
                        });
                    }
                });

        }).then(function (message) {
                    res.render('register', {message});
                })
        .catch(function (error) {
            res.render('register', {message:error});
        });
    }
    else if(req.query.email=="" || req.query.password==""){
        message = "Veuillez renseigner les deux champs pour vous enregistrer."
        res.render('register', {message});
    }
    else
        res.render('register', {message});
    
});

app.get('/login', function (req, res) {
  var message = "";
    if(req.query.email && req.query.password){
        return new Promise(function (resolve, reject) {
                UserModel.findOne({ login : req.query.email,password:req.query.password}, function (err, user) {
                    if(user != null) {
                        req.session.user = user;
                        message = "Vous êtes logué.";
                        resolve(message);
                    }
                    else{
                        message = "Veuillez vérifier vos données de connexion. Aucun compte trouvé.";
                        reject(message);
                    }
                });

        }).then(function (message) {
                    res.render('login', {message});
                })
        .catch(function (error) {
            res.render('login', {message:error});
        });
    }
    else if(req.query.email=="" || req.query.password==""){
        message = "Veuillez renseigner les deux champs pour vous loguer."
        res.render('login', {message});
    }
    else
        res.render('login', {message});
    
});


app.listen(process.env.PORT || 80, function () {
  console.log("Server listening on port 80");
});