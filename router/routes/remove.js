const express = require('express');
const router = express.Router();
const request = require('request');
const mustacheExpress = require('mustache-express');
const db = require('../../db/db');

router.delete("/:id", db.delete_pet, function(req, res, next){
  if(res.error) req.flash('error', res.error);
  res.send('ok');
})



module.exports = router;
