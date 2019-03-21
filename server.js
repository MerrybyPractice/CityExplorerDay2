'use strict';

//SERVER ARCHITECTURE
//load enviornment variables from the .env file
require('dotenv').config();
const superagent = require('superagent');

//Application Dependencies
const express = require('express');
const cors = require('cors');


//Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());


//PATHING

//looking for a request (from a server 1 to be defined) and a response  (from server 2)
//looking for the data in our data file

//end point: location
//geodata
app.get('/location', searchToLatLong);
//end point: weather
//weather
app.get('/weather', searchWeather);
//end point: meetups
//meetup info.
app.get('/meetup', searchMeetUp);

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
function searchToLatLong(request, response){
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API}`;

  return superagent.get(url)
    .then(result =>{
      console.log('line 63', result.body);
      response.send(new Location(request.query.data, result.body.results[0]));
    })
    .catch(error => handleError(error, response));
}

//constructor function - created a Location object
//moved data from the source into properties of the object
function Location(query, location){
  // console.log(location.body);
  this.search_query = query;
  this.formatted_query = location.formatted_address;
  this.latitude = location.geometry.location.lat;
  this.longitude = location.geometry.location.lng;
}
//-------------------------------------------------------------------
//weather
//finding information from the source and returning the weather data
function searchWeather(request, response){



  const url=(`https://api.darksky.net/forecast/${process.env.WEATHER_API}/${request.query.data.latitude},${request.query.data.longitude}`);
  return superagent.get(url)
    .then(weatherResults =>{
      const weatherSummaries = weatherResults.body.daily.data.map(day =>{
        let newW = new Weather(day);

        console.log(newW);
        return newW;

      });
      return response.send(weatherSummaries);
    })
    .catch(error => handleError(error, response));
}

//constructor function - created a Weather object
//moved data from the sources into properties of the object
function Weather(day){
  this.forecast = day.summary;
  //decompressing (*1000) the input and slicing off the front 15 characters so it is something that can be read easily by users.
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

//-------------------------------------------------------------------
//Meet-up
//finding information from the source and returning the meetup data
function searchMeetUp(request, response){
  console.log("line 113");
  const url=(`api.meetup.com/find/upcoming_events?&sign=true&lon=${request.query.data.longitude}&lat=${request.query.data.latitude}&key=${process.env.MEET_UP_API}`);


  return superagent.get(url)
    .then(result =>{
      response.send(new MeetUp(request.query.data, result.body.events[0]));
    })
    .catch(error => handleError(error, response));
}

//constructor function - created a MeetUp object
//moved data from the source into properties of the object
function MeetUp(query, venue){
  console.log('line 127');
  this.search_query = query;
  this.host = group.name;
  this.link = event_url;
  this.name = name;
  this.creation_data = created;

}
