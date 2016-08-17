"use strict";
$(function(){

window.onload = function(event){
  event.preventDefault();
  function alertMyPosition(position) {
      console.log("Your position is "+position.coords.latitude+", "+position.coords.longitude);
      var latlong = position.coords.latitude+","+position.coords.longitude
      $.ajax({
        "url" : "/api/location/"+latlong,
        "method":"GET",
        "success" : function(){
          console.log("geo location successfully executed")
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
}


$("#desc").on('click', function(){
  $("#desc").removeClass('truncate')
})


$("#find-pets-button").on('click', function(event){
  event.preventDefault();
  var location = $("#location").val();
  console.log(location.length)
  if (location.length < 5){
    $("#location").addClass('location-bad')
    $("#location").val("Sorry! Zip code invalid!")
  } else {
    $.ajax({
      "url" : "/api/findPet/"+location,
      "method" : "GET",
      "success" : function(data){
        var pet_id = data[3];
          $.ajax({
            "url" : "/pet/"+pet_id,
            "method" : "GET",
            "success" : function(data){
              $("#pet-card").show();
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
  }
})

$("#location").on("click", function(){
  if($("#location").hasClass('location-bad')){
    $("#location").removeClass('location-bad');
    $("#location").val(" ");
  }
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
