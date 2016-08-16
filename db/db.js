const pgp = require('pg-promise')();
const db = pgp('postgres://dasboogaloo@localhost:5432/auth');
var pry = require('pryjs')


const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);

var user=[];
var current_pet_id=0;

var login = function(req, res, next){
  var email = req.body.email;
  console.log('LOGIN EMAIL', email)
  user.push({"email" : email});
  console.log("GLOBAL USER EMAIL", user)
  var password = req.body.password;
  var auth_error = 'Incorrect Email / Password!';

  db.one(
    "SELECT * FROM users WHERE email = $1",
    [email]
  ).catch(function(){
    res.error = auth_error;
    next();
  }).then(function(user){
    bcrypt.compare(
      password,
      user.password_digest,
      function(err, cmp){
        if(cmp){
          req.session.user = {
            'email': user.email
          };
          // console.log("SESSION USER: "+req.session.user)
          next();
        } else {
          res.error = auth_error;
          next();
        }
      }
    );
  });
};

var logout = function(req, res, next){
  req.session.user = null;
  // console.log(req.session.user)
  next()
};

var create_user = function(req, res, next){
  var email = req.body.email;
  var password = req.body.password;

  bcrypt.hash(password, 10, function(err, hashed_password){
    db.none(
      "INSERT INTO users (email, password_digest) VALUES ($1, $2)",
      [email, hashed_password]
    ).catch(function(){
      res.error = 'Error. User could not be created.';
      next();
    }).then(function(user){
      req.session.user = {
        'email': email
      };
      next();
    });
  });
};

var save_pet = function(pet_data){
  // console.log(pet_data)
   db.none(
    "INSERT INTO pets(name, picture, description, pet_id, link) VALUES ($1, $2, $3, $4, $5)",
    [pet_data[0], pet_data[1], pet_data[2], pet_data[3], pet_data[4]]).then(function(){
    }).catch(function(error){
      console.log(error)
      res.error = 'Error. Pet could not be created in DB.';
    });
};

var display_pet = function(req, res, next){
  // console.log("PARAMS", req.params.id)
  var pet_id = req.params.id;
  current_pet_id = pet_id;
  db.one(
  "SELECT * FROM pets WHERE pet_id=$1", [pet_id]).then(function(pet){
    // console.log(pet)
    res.pet = pet;
    next();
  })
}


var add_pet = function(req, res, next){
  var user_id = user[0].email;
  var id = current_pet_id;
  db.none("INSERT INTO mypets(email, pet_id) VALUES($1, $2)", [user_id, id]).then(function(){
    console.log("successfully added by user", user_id)
    next();
  })
};

var my_pets = function(req, res, next){
  var email = user[0].email;
  console.log("MY PETS EMAIL", email);
  db.any(
    "SELECT * FROM pets JOIN mypets ON pets.pet_id = mypets.pet_id WHERE mypets.email=$1", [email]).then(function(mypets){
      console.log("db", mypets);
      res.render('mypets/index', {'myPets':mypets})
      next();
  })
}

var delete_pet = function(req, res, next){
  console.log("DB", req.params.id)
  var pet_id = req.params.id;
  db.none("DELETE FROM mypets WHERE pet_id=$1", [pet_id]).then(function(){
    console.log("successfully deleted", pet_id);
    next();
  })
}

module.exports = { login, logout, create_user, save_pet,
  display_pet, my_pets, add_pet, delete_pet };
