

const apiKey = 'f00b5da72c07482a775f4df7f14c3513';

document.getElementById("search-btn").addEventListener("click", getWeather);
document.getElementById("year").textContent = new Date().getFullYear();

function getWeather() {
  const city = document.getElementById("city-input").value.trim();
  if (!city) return alert("Please enter a city name.");

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        alert(data.message);
        return;
      }

      document.getElementById("city-name").textContent = data.name;
      document.getElementById("temperature").textContent = `${data.main.temp.toFixed(1)}°C`;
      document.getElementById("feels-like").textContent = `${data.main.feels_like.toFixed(1)}°C`;
      document.getElementById("humidity").textContent = `${data.main.humidity}%`;
      document.getElementById("wind-speed").textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
      document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;
      document.getElementById("weather-desc").textContent = data.weather[0].description;
      document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      getForecast(city);
    })
    .catch(() => alert("Error fetching weather data."));
}

function getForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("forecast-container");
      container.innerHTML = "";

      const forecast = {};
      data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!forecast[date] && item.dt_txt.includes("12:00:00")) {
          forecast[date] = item;
        }
      });

      Object.values(forecast).slice(0, 5).forEach(day => {
        const card = document.createElement("div");
        card.classList.add("card");

        const date = new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: "short", day: "numeric" });

        card.innerHTML = `
          <div>${date}</div>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Icon" />
          <div>${day.main.temp.toFixed(1)}°C</div>
        `;
        container.appendChild(card);
      });
    });
}

// Time display
setInterval(() => {
  const now = new Date();
  document.getElementById("current-time").textContent = now.toLocaleTimeString();
}, 1000);
