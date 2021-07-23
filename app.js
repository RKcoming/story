//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const { MongoServerSelectionError } = require("mongodb");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
const app=express();
app.set("view engine",'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true});
const schema=new mongoose.Schema({
    email:String,
    password:String
});

schema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
const User=new mongoose.model('user',schema);
app.get('/',function(req,res){
    res.render("home");
});
app.get('/login',function(req,res){
    res.render("login");
});
app.get('/register',function(req,res){
    res.render("register");
});
app.post('/register',function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save();
    res.render('secrets');
});
app.post('/login',function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username},function(err,result){
        if(!err){
            if(result.password===password){
                res.render("secrets");
                console.log(result.password);
            }else{
                res.send("Wrong password");
            }
        }else{
            console.log(err);
        }
    });
});














app.listen(3000,function(){
    console.log("Server is started at port 3000");
});