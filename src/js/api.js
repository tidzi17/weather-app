
const apiKey = "f381109b3c8c2f4b02889bfc7a2d6e38";


const cityInput = document.getElementById('city-search');
const cityName = document.getElementById('city');
const cityTemp = document.getElementById('temperature');
const weatherIcon = document.getElementById('weather-icon');
const chanceOfRain = document.getElementById('rain-chance');
   
searchWeather('Madrid');

cityInput.addEventListener('input', function () {
  weatherInfoElement.innerHTML = '';
});

cityInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    searchWeather(cityInput.value.trim());
    fetchHourlyForecast(cityInput.value.trim());
  }
});
const forecastListElement = document.getElementById('forecast-list');

let currentWeatherIconCode; 

    function searchWeather(city) {
      if (city !== '') {
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
       

        fetch(currentWeatherUrl)
          .then(response => response.json())
          .then(data => {
            currentWeatherIconCode = data.weather[0].icon;
            const temperatureCelsius = Math.round(data.main.temp - 273.15);
            cityName.innerHTML = `${city}`;
            cityTemp.innerHTML = `${temperatureCelsius}&deg;`;
            weatherIcon.src = `https://openweathermap.org/img/wn/${currentWeatherIconCode}.png`;

            const rainVolume = data.rain ? data.rain['1h'] : 0;
            chanceOfRain.innerHTML = `Chance of Rain: ${rainVolume}%`;
          })

          .catch(error => {
            console.error('Error fetching weather data:', error);
          });
          fetch(forecastUrl)
          .then(response => {
            if (!response.ok){
                throw new Error (`Failed to fetch forecast data for ${city}`)
            }
            return response.json();
          })
          .then(data => {
            displayForecast(data.list);
            fetchHourlyForecast(city);
          })
          .catch(error => {
            console.error(`Error fetching forecast data:`, error);
          });
      }
    }
    
    function displayForecast(forecastList){
        forecastListElement.innerHTML = '';
        const dailyForecasts = {};

        for (const forecast of forecastList){
            const forecastDate = new Date(forecast.dt * 1000);
            const dayOfWeek = forecastDate.toLocaleDateString('en-Us', { weekday: 'short'});
            const maxTemp = Math.round(forecast.main.temp_max);
            const minTemp = Math.round(forecast.main.temp_min);
            const weatherIconCode = forecast.weather[0].icon;
            const weatherCondition = forecast.weather[0].main;

            

            if(!dailyForecasts[dayOfWeek]){
                dailyForecasts[dayOfWeek] = {
                    maxTemp: maxTemp,
                    minTemp: minTemp,
                    weatherIconCode: weatherIconCode,
                    weatherCondition: weatherCondition,
                };
            } else {
                if (maxTemp > dailyForecasts[dayOfWeek].maxTemp){
                    dailyForecasts[dayOfWeek].maxTemp = maxTemp;
                }

                if (minTemp < dailyForecasts[dayOfWeek].minTemp){
                    dailyForecasts[dayOfWeek].minTemp = minTemp;
                }
            }
        }
        for (const dayOfWeek in dailyForecasts){
            const maxTemp = dailyForecasts[dayOfWeek].maxTemp;
            const minTemp = dailyForecasts[dayOfWeek].minTemp;
            const weatherIconCode = dailyForecasts[dayOfWeek].weatherIconCode;
            const weatherCondition = dailyForecasts[dayOfWeek].weatherCondition;

      
            const forecastEntry = document.createElement('li');
            forecastEntry.className = 'list_item';
            forecastEntry.innerHTML = `
            <p id="day">${dayOfWeek}</p>
            <img src="https://openweathermap.org/img/wn/${weatherIconCode}.png" alt="Weather Icon" id="icon">
            <p id="weather-type">${weatherCondition}</p>
            <p id="day-temp">${maxTemp}&deg;/<span>${minTemp}&deg;</span></p>
            `;
            forecastListElement.appendChild(forecastEntry);
        }

    }
   
    function fetchHourlyForecast(city){
        const hourlyForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

         fetch(hourlyForecastUrl)
         .then(response => {
            if(!response.ok){
                throw new Error(`Failed to fetch  hourly forecast for ${city}`)
            }
            return response.json();
         })
         .then(data => {
            displayHourlyForecast(data.list);
         })
         .catch(error => {
            console.error(`Error fetching hourly forecast data:`, error);
         });
    }

    function displayHourlyForecast(hourlyForecastList){
        const hourlyForecastListElement = document.getElementById('hourly-forecast-list');
        hourlyForecastListElement.innerHTML = '';

        const maxEntriesToShow = 5;

        for (let i = 0; i < hourlyForecastList.length && i < maxEntriesToShow; i++) {
            const forecast = hourlyForecastList[i];
            const forecastTime = new Date(forecast.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
            const temperature = Math.round(forecast.main.temp);
    

            const forecastEntry = document.createElement('div');
    forecastEntry.className = 'content-container__main-content__hours-container__content__item';
    forecastEntry.innerHTML = `
      <p id="hour">${forecastTime}</p>
      <p id="hour-temp">${temperature}&deg;</p>
    `;
    
 
    hourlyForecastListElement.appendChild(forecastEntry);
        }
    }