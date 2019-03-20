'use strict';

//SERVER ARCHITECTURE

require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT;
//const MAPS_API = process.env.MAPS_API;

//PATHING

//looking for a request (from a server 1 to be defined) and a response  (from server 2)
//looking for the data in our data file

//end point: location
//geodata
app.get('/location', (request, response) => {
  const locationData = searchToLatLong(request.query.data);
  response.send(locationData);
});
//end point: weather
//weather
app.get('/weather', (request, response) => {
  const weatherData = searchWeather(request.query.data);
  response.send(weatherData);
})

//end point: testing
//testing route
app.get('/testing', (request, response) => {
  console.log('Im here.');
  const test = {test: `this works on PORT${PORT}`}
  response.sendStatus(test);
});

//LISTENER
//Waiting for activity on the html page (connected to server 1) and waiting for some type of action.
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

//Error handling
//Function that that is returning an unexected input
//Notifies the user that the input was not as expected.
function handleError(err, res){
  console.error(err);
  if (res) res.status(500).send('Sorry, we seem to have a bit of a problem')
}

//HELPER FUNCTIONS

//location
//finding the information from the source and returning the location
function searchToLatLong(query){
  const geoData = require('./data/geo.json');
  const location = new Location(geoData);
  location.search_query = query;
  // console.log(location);
  return location;
}

//constructor function - created a Location object
//moved data from the source into properties of the object
function Location(data){
  this.formatted_query = data.results[0].formatted_address;
  this.latitude = data.results[0].geometry.location.lat;
  this.longitude = data.results[0].geometry.location.lng;
}
//-------------------------------------------------------------------
//weather
//finding information from the source and returning the weather data
function searchWeather(query){

  const darkSky = require('./data/darksky.json');
  let weatherArray = []

  darkSky.daily.data.forEach(day =>{
    weatherArray.push(new Weather(day));
  });
  return weatherArray;
}

//constructor function - created a Weather object
//moved data from the sources into properties of the object
function Weather(day){
  this.forecast = day.summary;
  //decompressing (*1000) the input and slicing off the front 15 characters so it is something that can be read easily by users.
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

