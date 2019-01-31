var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({dest : './uploads'});
var passport             =   require('passport');
var LocalStrategy        =   require('passport-local').Strategy;

var User = require('../Models/user');




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {title : 'Register page'});
});

router.post('/register', upload.single('profileimage'), function(req, res, next) {
  
  var name        =   req.body.name;
  var username        =   req.body.username;
  var email       =   req.body.email;
  var psw         =   req.body.psw;
  var pswRepeat   =   req.body.pswrepeat;

  req.checkBody('name', 'Name is empty').notEmpty();
  req.checkBody('email', 'Email is empty').notEmpty();
  req.checkBody('email', 'Email is not correct').isEmail();
  req.checkBody('psw', 'Password is empty').notEmpty();
  req.checkBody('pswrepeat', 'Password is not match').equals(psw);
  
  var errors = req.validationErrors();
  
  if (errors) {
    
    res.render('register', {
      errors : errors
    });

  } else {
    
    console.log('Mongodb is ready');

    var newUser = new User ({
      name      :  name,
      username  :  username,
      email     :  email,
      password  :  psw
    });

    User.createUser(newUser, function(err,user){
      if(err) throw err;
      console.log(user);

    });

    req.flash('success','Done Successfully....');
    res.location('/');
    res.redirect('/');

  }
});

router.get('/login', function(req, res, next) {
  res.render('login', {title : 'Login page'});
});

router.post('/login',
    passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid Username or Password'}),
    function(req, res) {
        req.flash('success','you are now logged in');
        res.redirect('/');

    });


passport.serializeUser(function(user, done) {
      console.log('serialized....');
      done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
      console.log('DeSerialized....');
      User.findById(id, function(err, user) {
          done(err, user);
      });
});


passport.use(new LocalStrategy(function (username,password,done) {

  User.getUserByUsername(username,function(err,user){
      if(err) throw err;
      if(!user){
          return done(null,false,{message:'Unknown user'});
      }
      console.log(user);

      User.comparePassword(password,user.password,function (err,isMatch) {
          if(err) return done(err);
          if(isMatch){
              return done(null,user);
          }else{
              return done(null,false,{message:'Invalid Password'});
          }
      });

  });
}));

module.exports = router;
