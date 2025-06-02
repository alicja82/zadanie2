const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const AUTHOR = 'Alicja Kwiatkowska';

app.use(express.static('public'));
app.use(express.json());

app.listen(PORT, () => {
  const startTime = new Date().toISOString();
  console.log(`Aplikacja uruchomiona: ${startTime}`);
  console.log(`Autor: ${AUTHOR}`);
  console.log(`Nasłuchiwanie na porcie: ${PORT}`);
});

app.post('/weather', async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const data = await response.json();

    if (data.current_weather) {
      res.json({
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        weathercode: data.current_weather.weathercode
      });
    } else {
      res.status(500).json({ error: 'Brak danych pogodowych' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Błąd pobierania danych pogodowych' });
  }
});
