const pgp = require('pg-promise')();
const db = pgp('postgres://dasboogaloo@localhost:5432/auth');
var pry = require('pryjs')


const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);

var current_pet_id=0;

var login = function(req, res, next){
  var email = req.body.email;
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
            'id': user.id
          };
          console.log("SESSION USER: " + req.session.user.id)
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
  next()
};

var create_user = function(req, res, next){
  var email = req.body.email;
  var password = req.body.password;
  bcrypt.hash(password, 10, function(err, hashed_password){
    db.one(
      "INSERT INTO users (email, password_digest) VALUES ($1, $2) RETURNING id",
      [email, hashed_password]
    ).catch(function(){
      res.error = 'Error. User could not be created.';
      next();
    }).then(function(user_id){
      req.session.user = {
        'id': user_id
      };
      next();
      console.log(req.session.user)
    });
  });
};

var save_pet = function(pet_data){
  // if(!req.session.user.id) res.redirect('/');
   db.none(
    "INSERT INTO pets(name, picture, description, pet_id, link) VALUES ($1, $2, $3, $4, $5)",
    [pet_data[0], pet_data[1], pet_data[2], pet_data[3], pet_data[4]]).then(function(){
    }).catch(function(error){
      console.log(error)
      res.error = 'Error. Pet could not be created in DB.';
    });
};

var display_pet = function(req, res, next){
  if(!req.session.user) res.redirect('/');
  var pet_id = req.params.id;
  current_pet_id = pet_id;
  db.one(
  "SELECT * FROM pets WHERE pet_id=$1", [pet_id]).then(function(pet){
    res.pet = pet;
    next();
  })
}


var add_pet = function(req, res, next){
  db.none("INSERT INTO mypets(user_id, pet_id) VALUES($1, $2)",
    [user_id, pet_id]).then(function(){
    console.log("successfully added by user", user_id)
    next();
  })
};

var my_pets = function(req, res, next){
  if(!req.session.user) res.redirect('/');
  var user_id = req.session.user.id;

  console.log("MY PETS USER ID", user_id);
  db.any(
    "SELECT * FROM pets JOIN mypets ON pets.pet_id = mypets.pet_id WHERE mypets.user_id=$1",
    [user_id]).then(function(mypets){
      console.log("db", mypets);
      res.render('mypets/index', {'myPets':mypets})
      next();
  })
}

var delete_pet = function(req, res, next){
  if(!req.session.user) res.redirect('/');

  console.log("DB", req.params.id)
  var pet_id = req.params.id;
  db.none("DELETE FROM mypets WHERE pet_id=$1", [pet_id]).then(function(){
    console.log("successfully deleted", pet_id);
    next();
  })
}

module.exports = { login, logout, create_user, save_pet,
  display_pet, my_pets, add_pet, delete_pet };
