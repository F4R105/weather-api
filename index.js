const express = require('express')
const app = express()

const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.json())

const getSunriseAndSunsetTimes = (timezone, sunrise, sunset) => {
  const sunrise_time = new Date((sunrise + timezone) * 1000);
  let sunset_time = new Date((sunset + timezone) * 1000);

  return {
    sunrise: sunrise_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sunset: sunset_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}

app.get('/', async (req, res) => {
  const{lat,lon} = req.query
  try{
    const weatherRes = await fetch(`${process.env.BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.API_KEY}`)
    const weatherData = await weatherRes.json()

    const {weather, main, name, sys, timezone, wind} = weatherData
    const {country, sunrise, sunset} = sys

    if(country !== "TZ") return res.status(406).json({ message: "Country not supported"})

    res.status(200).json({
      name, 
      temp: parseInt(main.temp), 
      weather: weather.map(weatherItem => 
        ({
          description: weatherItem.description, 
          icon: `${process.env.ICON_URL}/${weather[0].icon}@2x.png`
        })
      ),
      humidity: main.humidity,
      wind,
      sun: getSunriseAndSunsetTimes(timezone, sunrise, sunset)
    })
  }catch(error) {
    res.status(500).json({message: error.message})
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Server is listening on port ', PORT)
  if (process.env.ENV == "development" ){
    console.log('development URL,', `http://localhost:${PORT}?lat=x&long=y`)
  } 
})