"use strict";
$(function(){

// console.log("CURRENTLY LOCATED AT", location)

$("#find-pets-button").on("click", function(event){
  event.preventDefault();
  function alertMyPosition(position) {
      console.log("Your position is "+position.coords.latitude+
        ", "+position.coords.longitude);
      var latlng = position.coords.latitude+
      ","+position.coords.longitude
      $.ajax({
        "url" : "/api/location/"+latlng,
        "method":"GET",
        "success" : function(location_data){
          console.log("current location", location_data);
          var geolocation = Number(location_data.zip);
          // debugger
              $.ajax({
                "url" : "/api/findPet/"+geolocation,
                "method" : "GET",
                "success" : function(pet_data){
                  var pet_id = pet_data[3];
                  // debugger;
                    $.ajax({
                      "url" : "/pet/"+pet_id,
                      "method" : "GET",
                      "success" : function(show_pet_data){
                        $("#pet-card").show();
                          // debugger;
                        window.location.replace('/pet/'+pet_id);
                        event.preventDefault();
                      },
                      "error" : function(message){
                        console.log(message)
                      }
                    })
                },
                "error" : function(message){
                  console.log(message)
                }
              })
        },
        "error": function(){
          console.log("geolocation failed")
        }
      })
  };
  function noLocation(error) {
      console.log("No location info available. Error code: " + error.code);
  };
  $.geolocation.get({win: alertMyPosition, fail: noLocation});
})



$(".desc").on('click', function(){
  $(".desc").removeClass('truncate')
})


$("#add-to-mypets").on("click", function(event){
  event.preventDefault();
  var pet_id = $("#pet_id").text();
  var number = parseInt(pet_id.replace(/[^0-9\.]/g, ''), 10);
  //pulled the above replace method off a stack overflow post
  $.ajax({
    "url" : "/add/"+number,
    "method" : "POST",
    "success" : function(){
      console.log("successfully added!");
    }
  })
})


$(".mypets-remove").on("click", function(event){
  event.preventDefault();
  var parent = ($(event.target).parent());
  var pet_id = parent[0].lastElementChild.childNodes[0].data;
  var promise = $.ajax({
    "type" : "DELETE",
    "url" : "/remove/"+pet_id,
  });

  promise.fail( function(){
    console.log('IM FAILING.')
  });

  promise.done( function(){
    $('#pet-' + pet_id).fadeOut();
  })
})

//bottom
});
