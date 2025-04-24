import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

import { dirname } from 'path';
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

const apiKey = '5670044c99d4fce14697ffb4297aed9b';

app.use(express.static('public'));



app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index.ejs', );
})

app.post('/weather', async (req, res) => {
    const city = req.body.city;
  
    try {
      // STEP 1: Get latitude and longitude
      const geoResponse = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
      );
  
      if (geoResponse.data.length === 0) {
        return res.render('index.ejs', { forecast: null, error: 'City not found.' });
      } 
  
      const { lat, lon } = geoResponse.data[0];

    // console.log(lat, lon)

      // STEP 2: Use coordinates to get forecast
    
    const weatherResponse = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    
    const result = weatherResponse.data;
  

  const forecastList = result.list;
  const tomorrow = new Date(); //get todays date
  tomorrow.setDate(tomorrow.getDate() + 1); //get tomorrow's date
  const tomorrowDate = tomorrow.toISOString().split('T')[0]; //format as YYYY-MM-DD

  const tomorrowForecasts = forecastList.filter(forecast => forecast.dt_txt.startsWith(tomorrowDate)); 
  //Fiter forecast for tomorrow 


  const willRain = tomorrowForecasts.some(forecast => 
    forecast.weather.some(condition => condition.main.toLowerCase() === 'rain')
);   //Check for Rain 

if (willRain) {
    res.render('index.ejs', { forecast: "Yes, it will rain tomorrow ☔", error: null });
} else {
    console.log("No, it will not rain tomorrow ");
    res.render('index.ejs', { forecast: "No, it won't rain tomorrow 🌞", error: null });
}

    } catch (error) {
      console.error(error);
      res.render('index.ejs', { forecast: null, error: 'Something went wrong. Try again.' });
    }
  });

app.listen(port, () => {
    console.log (`Listening on port ${port}`);
});