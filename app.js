//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

// const encrypt = require("mongoose-encryption"); //This is the encryption plugin
// const md5 = require("md5");   //This is the md5 hashing algorithm
const bcrypt = require("bcrypt"); //This is the bcrypt hashing algorithm
const saltRounds = 10; //This is the number of salt rounds for bcrypt
mongoose.connect('mongodb://127.0.0.1:27017/UserDb', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//Create a new user schema
const userSchema = new mongoose.Schema( {
    email: String,
    password: String
    });
    // const secret = "Thisisourlittlesecret."; //This is the secret key for password encryption
    // userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] }); //This is the encryption plugin 

//Create a new user model
const User = new mongoose.model("User", userSchema);


// GET request
app.get("/", function(req, res){
res.render("home");  
  }
);


app.get("/register", function(req, res){
    res.render("register"); 
   }
    );
    
    app.get("/login", function(req, res){
        res.render("login");   
     }
        );

// POST request
app.post("/register", function(req, res){
    bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
        const newUser = new User({
            email: req.body.username,
            password:hash
          });
          
      newUser.save().then(()=>{
        res.render("secrets");
      })
        .catch((err)=>{
            console.log(err);
        });
    });
        });
// console.log(md5("qwerty")); check the md5 hash of the password

// Post request for login
//--------------------------------------------------------------------------------------------
// POST request
app.post("/login", function(req, res){
   
   username = req.body.username;
    password = req.body.password;
    User.findOne({email: username}, ).then((founduser)=>{
        if(founduser){
            bcrypt.compare(password, founduser.password).then(function(result) {
                if(result === true){
                    res.render("secrets");
                }
            });
        }
    })
    .catch((err)=>{
        console.log(err);
    });
    });

        app.listen(3000, function(){
            console.log("Server started on port 3000.");
          }
            );
