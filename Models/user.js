var mongoose             =   require('mongoose');
var bcrypt               =   require('bcryptjs');

mongoose.connect('mongodb://localhost/auth');

var db = mongoose.connection;

var UserSchema = mongoose.Schema({

    name:{
        type:String,
        index:true
    },

    username:{
        type:String,
    },

    email:{
        type:String
    },

    password:{
        type:String
    },

    profileimage:{
        type:String
    },

});

var User = module.exports=mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser,callback){

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });

    
};


module.exports.getUserById = function (id,callback){

    User.findById(id, callback);

}

module.exports.getUserByUsername = function (username,callback){

    var query  =  {username : username};

    User.findOne(query, callback);

}

module.exports.comparePassword = function (candidatePassword, hash , callback){

    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
            callback(null , isMatch);
    });
   

}