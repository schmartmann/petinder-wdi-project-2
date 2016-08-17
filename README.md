# PeTinder Readme
## Why try to meet people when you can meet animals instead? 

### Technologies
I used MaterializeCSS to create the look of the website, and made use of its awesome “Card” feature to display the profiles of each pet searched from the API. 

I used a jQuery plugin called jQuery GeoLocate to dynamically grab the user’s longitude and latitude, and then used NPM Request to convert the coordinates into a zip code, which I then used jQuery to initiate an AJAX call on the front end, which then hit a route on the back end that uses NPM Request to hit the PetFinder API, save data to the database,  and dynamically display that data on the page. 

MyPets page is just a join table that’s being rendered in a Mustache template. 

Unsolved problems: 
-Wanted to hit the API and render data as soon as the window loads, but that resulted in an infinite loop of the page refreshing as soon as it finished loading. 
-Wanted to have the card that displays pet info hidden until user clicks “find pets”. 
