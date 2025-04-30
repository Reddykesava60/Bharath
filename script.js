const API_KEY = 'f00b5da72c07482a775f4df7f14c3513';
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const weatherDesc = document.getElementById('weather-desc');
const weatherIcon = document.getElementById('weather-icon');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');
const forecastContainer = document.getElementById('forecast-container');
const currentTime = document.getElementById('current-time');
let currentCity = 'Delhi'
document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 1000);
    document.getElementById('year').textContent = new Date().getFullYear();
    fetchWeather(currentCity);
    fetchForecast(currentCity);
    searchBtn.addEventListener('click', () => {
        if (cityInput.value.trim() !== '') {
            currentCity = cityInput.value.trim();
            fetchWeather(currentCity);
            fetchForecast(currentCity);
            cityInput.value = '';
        }
    });
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && cityInput.value.trim() !== '') {
            currentCity = cityInput.value.trim();
            fetchWeather(currentCity);
            fetchForecast(currentCity);
            cityInput.value = '';
        }
    });
});
function updateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    };
    currentTime.textContent = now.toLocaleDateString('en-US', options);
}
async function fetchWeather(city) {
    try {
        const response = await fetch(
            https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}
        );
        const data = await response.json();
        
        if (data.cod === 200) {
            displayWeather(data);
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}
function displayWeather(data) {
    cityName.textContent = ${data.name}, ${data.sys.country};
    temperature.textContent = ${Math.round(data.main.temp)}°C;
    weatherDesc.textContent = data.weather[0].description;
    weatherIcon.src = https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png;
    feelsLike.textContent = ${Math.round(data.main.feels_like)}°C;
    humidity.textContent = ${data.main.humidity}%;
    windSpeed.textContent = ${(data.wind.speed * 3.6).toFixed(1)} km/h;
    pressure.textContent = ${data.main.pressure} hPa;
}
async function fetchForecast(city) {
    try {
        const response = await fetch(
            https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}
        );
        const data = await response.json();
        
        if (data.cod === '200') {
            displayForecast(data.list);
        }
    } catch (error) {
        console.error('Error fetching forecast data:', error);
    }
}
function displayForecast(forecastData) {
    forecastContainer.innerHTML = '';
    const dailyForecasts = [];
    
    for (let i = 0; i < forecastData.length; i++) {
        const forecast = forecastData[i];
        const date = new Date(forecast.dt * 1000);
        const hours = date.getHours();
        if (hours === 12 || dailyForecasts.length === 0 || 
            !isSameDay(date, new Date(dailyForecasts[dailyForecasts.length - 1].dt * 1000))) {
            dailyForecasts.push(forecast);
        }
        if (dailyForecasts.length === 5) break;
    }
    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
            <div class="forecast-day">${day}</div>
            <div class="forecast-icon">
                <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
            </div>
            <div class="forecast-temp">
                <span class="max-temp">${Math.round(forecast.main.temp_max)}°</span>
                <span class="min-temp">${Math.round(forecast.main.temp_min)}°</span>
            </div>
        `;
        
        forecastContainer.appendChild(forecastCard);
    });
}
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}
