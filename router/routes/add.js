const express = require('express');
const router = express.Router();
const request = require('request');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const db = require('../../db/db');


router.post("/:id", function(req, res){
  console.log("sessionid", req.session.user.id)
  console.log("params", req.params.id)
  user_id = req.session.user.id;
  pet_id = req.params.id;
  db.add_pet(user_id, pet_id)
})





module.exports = router;
