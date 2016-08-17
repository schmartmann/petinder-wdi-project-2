const express = require('express');
const router = express.Router();
const request = require('request');
const mustacheExpress = require('mustache-express');
const db = require('../../db/db');


router.get("/location/:latlng", function(req, res){
  var latlng = req.params.latlng;
  request("https://maps.googleapis.com/maps/api/geocode/json?latlng="+latlng+"&key="+process.env.GOOGLE_GEOLOCATE_API, function(error, response, body){
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      var location = data.results[0].address_components[7].short_name;
      console.log("CURRENT ZIP", location);
      res.send({"zip":location})
    }
  })
})



router.get('/findPet/:geolocation', function (req, res){
  var location = req.params.geolocation
  var petfinder_api = process.env.PETFINDER_API_KEY;

  request('http://api.petfinder.com/pet.getRandom?format=json&location='+location+'&output=full&key='+petfinder_api, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var pet_data =[];
      var data = JSON.parse(body);
      //name
     if (data.petfinder.pet.name.$t){
      pet_data.push(data.petfinder.pet.name.$t)
     } else {
      pet_data.push("Name not available")
     }
      //picture
      if (data.petfinder.pet.media.photos){
        pet_data.push(data.petfinder.pet.media.photos.photo[3].$t);
      } else {
        pet_data.push('http://thefanspage.com/wp-content/themes/fearless/images/missing-image-640x360.png')
      }
      //description
      if(data.petfinder.pet.description.$t){
        pet_data.push(data.petfinder.pet.description.$t);
      } else {
        pet_data.push('No description available.')
      };
      //id
      var id = parseInt(data.petfinder.pet.id.$t)
      pet_data.push(id);
      //link
      pet_data.push('https://www.petfinder.com/petdetail/'+data.petfinder.pet.id.$t);
      // console.log(pet_data)
      db.save_pet(pet_data);
      res.send(pet_data)
      };
  });

});

module.exports = router;
