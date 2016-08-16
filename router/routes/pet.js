const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const db = require('../../db/db');

router.get("/", function(req, res){
  res.render("./pet/index")
})

router.get("/:id", db.display_pet, function(req, res){
  if(res.error){
    req.flash('error', res.error);
    res.send(res.error)
  } else{
    console.log(res.pet.id);
    var pet_obj = {
      "picture" : res.pet.picture,
      "name" : res.pet.name,
      "description" : res.pet.description,
      "pet_id" : res.pet.pet_id,
      "link" : res.pet.link
    }
    res.render("./pet/index", pet_obj)
  }
})

module.exports = router;
