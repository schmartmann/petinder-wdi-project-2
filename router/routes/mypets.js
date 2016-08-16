const express = require('express');
const router = express.Router();
const request = require('request');
const mustacheExpress = require('mustache-express');
const db = require('../../db/db');


router.get("/", db.my_pets, function(req, res){
  if(res.error) req.flash('error', res.error);
  // res.redirect('/');
})



module.exports = router;
