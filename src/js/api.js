const apiKey = "f381109b3c8c2f4b02889bfc7a2d6e38";


const cityInput = document.getElementById('city-search');
const cityName = document.getElementById('city');
const cityTemp = document.getElementById('temperature');
   
searchWeather('Madrid');

cityInput.addEventListener('input', function () {
  weatherInfoElement.innerHTML = '';
});

cityInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    searchWeather(cityInput.value.trim());
  }
});

    function searchWeather(city) {
      if (city !== '') {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            const temperatureCelsius = Math.round(data.main.temp - 273.15);
            cityName.innerHTML = `${city}`;
            cityTemp.innerHTML = `${temperatureCelsius}&deg;`;
          })
          .catch(error => {
            console.error('Error fetching weather data:', error);
          });
      }
    }
