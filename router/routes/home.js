const express = require('express');
const router = express.Router();

router.get('/api/location', function (req, res){
  if(!req.session.user){
    res.redirect('sessions/new');
  } else {
    res.render('pet/index');
  }
});


module.exports = router;
