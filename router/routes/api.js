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
      console.log(data.results[0].formatted_address);
      var formatted_address = data.results[0].formatted_address;
      var addArr = formatted_address.replace(/ /g,'').split(",");
      // if (addArr[length-1] = "Canada"){
      //   var postalCodeArr = (addArr[addArr.length-2]).split("").splice(2,6);
      //   var postalString = postalCodeArr
      //   var geolocation = postalCode;
        //the problem here is that it's going to be hard to represent a
        //canadian alphanumeric postal code
        // because it will always be a mix of letters and numbers.
        //is there a datatype that can have this?
        //a way to return a string that doesnt have quotes around it?
        console.log("CURRENT POSTAL CODE", geolocation);
        res.send({"zip":geolocation})
      // } else {
      // var zipPos = addArr[addArr.length-2];
      var geolocation = Number(zipPos.replace(/\D/g,''));
      console.log("CURRENT ZIP", geolocation);
      res.send({"zip":geolocation})
      // }
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
      if (!data){
        pet_data.push("Name not available");
        pet_data.push('http://thefanspage.com/wp-content/themes/fearless/images/missing-image-640x360.png');
        pet_data.push('No description available.');
        pet_data.push(Math.floor(Math.random()*300000));
        pet_data.push('https://www.petfinder.com')
      } else {
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
      if (data.petfinder.pet.id.$t){
        var id = parseInt(data.petfinder.pet.id.$t)
        pet_data.push(id);
      } else {
        pet_data.push(Math.floor(Math.random()*300000))
      }
      //link
      pet_data.push('https://www.petfinder.com/petdetail/'+data.petfinder.pet.id.$t);
      // console.log(pet_data)
      db.save_pet(pet_data);
      res.send(pet_data)
      };
    }
  });
});

module.exports = router;
