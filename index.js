const express = require('express')
const app = express()

const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  const{lat,lon} = req.query
  try{
    const weatherRes = await fetch(`${process.env.BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.API_KEY}`)
    const {weather, main, name} = await weatherRes.json()
    res.status(200).json({
      name, 
      temp: parseInt(main.temp), 
      weather: weather.map(weatherItem => 
        ({
          description: weatherItem.description, 
          icon: `${process.env.ICON_URL}/${weather[0].icon}@2x.png`
        })
      )
    })
  }catch(error) {
    res.status(500).json({message: error.message})
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Server is listening on port ', PORT)
  if (process.env.ENV == "development" ) console.log('URL', `http://localhost:${PORT}?lat=x&long=y`)
})