const express = require('express');
const router = express.Router();
const request = require('request');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const db = require('../../db/db');


router.post("/:id", function(req, res){
  var id = req.params.id;
  db.add_pet()
})





module.exports = router;
