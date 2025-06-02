const countrySelect = document.getElementById('country');
const citySelect = document.getElementById('city');
const cityContainer = document.getElementById('city-container');

const cityData = {
  pl: {
    'Poznań': [52.4064, 16.9252],
    'Kraków': [50.0647, 19.9450],
    'Warszawa': [52.2297, 21.0122]
  },
  uk: {
    'Londyn': [51.5074, -0.1278],
    'Manchester': [53.4808, -2.2426]
  },
  fr: {
    'Paryż': [48.8566, 2.3522],
    'Lyon': [45.75, 4.85]
  }
};

countrySelect.addEventListener('change', () => {
  const selectedCountry = countrySelect.value;
  citySelect.innerHTML = '<option value="">-- wybierz miasto --</option>';

  if (cityData[selectedCountry]) {
    for (const [cityName, coords] of Object.entries(cityData[selectedCountry])) {
      const option = document.createElement('option');
      option.value = coords.join(',');
      option.textContent = cityName;
      citySelect.appendChild(option);
    }
    cityContainer.style.display = 'block';
  } else {
    cityContainer.style.display = 'none';
  }
});

const weatherDescriptions = {
    0: "Bezchmurnie",
    1: "Głównie bezchmurnie",
    2: "Częściowo pochmurno",
    3: "Zachmurzenie duże",
    45: "Mgła",
    48: "Mgła osadzająca szron",
    51: "Lekka mżawka",
    53: "Umiarkowana mżawka",
    55: "Silna mżawka",
    56: "Lekka marznąca mżawka",
    57: "Silna marznąca mżawka",
    61: "Lekki deszcz",
    63: "Umiarkowany deszcz",
    65: "Silny deszcz",
    66: "Lekki marznący deszcz",
    67: "Silny marznący deszcz",
    71: "Lekki śnieg",
    73: "Umiarkowany śnieg",
    75: "Silny śnieg",
    77: "Ziarna lodowe",
    80: "Przelotny lekki deszcz",
    81: "Przelotny umiarkowany deszcz",
    82: "Przelotny silny deszcz",
    95: "Burza",
    96: "Burza z lekkim gradem",
    99: "Burza z silnym gradem"
  };  

document.getElementById('weather-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const [latitude, longitude] = citySelect.value.split(',');

  const response = await fetch('/weather', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude, longitude })
  });

  const data = await response.json();
  const resultDiv = document.getElementById('result');

  if (data.error) {
    resultDiv.textContent = 'Błąd: ' + data.error;
  } else {
    resultDiv.innerHTML = `
      <p>Temperatura: ${data.temperature}°C</p>
      <p>Prędkość wiatru: ${data.windspeed} km/h</p>
      <p>Warunki pogodowe: ${weatherDescriptions[data.weathercode] || 'Nieznane'}</p>
    `;
  }
});
