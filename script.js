const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');

const cityTxt = document.querySelector('.city-txt');

const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('#humidity-value-txt');
const pressureValueTxt = document.querySelector('#pressure-value-txt');
const visibilityValueTxt = document.querySelector('#visibility-value-txt');
const windValueTxt = document.querySelector('#wind-value-txt');
const maxTempTxt = document.querySelector('#max-temp-txt');
const minTempTxt = document.querySelector('#min-temp-txt');
const sunriseTxt = document.querySelector('#sunrise-txt');
const sunsetTxt = document.querySelector('#sunset-txt');

const weatherSummaryImg = document.querySelector('.weather-summary-img');

const currentDateTxt = document.querySelector('.current-date-txt');
const currentTimeTxt = document.querySelector('.current-time-txt');
const forecastItemsContainer = document.querySelector('.forecast-items-container');
const apiKey = '57b3c6fa2073781a41038802f70a2e31';

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        updateWeather(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != '') {
        updateWeather(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

async function getFetchData(endpoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection].forEach(sec => sec.style.display = 'none');
    section.style.display = 'flex';
}

function getCurrentDate(timezoneOffset) {
    const utcDate = new Date(new Date().getTime() + timezoneOffset * 1000);
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        timeZone: 'UTC'
    };
    return utcDate.toLocaleDateString('en-GB', options);
}

function getWeaatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg';
    if (id <= 321) return 'drizzle.svg';
    if (id <= 531) return 'rain.svg';
    if (id <= 622) return 'snow.svg';
    if (id <= 781) return 'atmosphere.svg';
    if (id === 800) return 'clear.svg';
    return 'clouds.svg';
}

function convertUnixTime(timestamp, timezoneOffset) {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

async function updateWeather(city) {
    const weatherData = await getFetchData('weather', city);

    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection);
        return;
    }

    const {
        name,
        main: { temp_max, temp_min, temp, humidity, pressure },
        weather: [{ id, main }],
        wind: { speed },
        sys: { sunrise, sunset, country },
        timezone,
        visibility
    } = weatherData;


    cityTxt.textContent = `${name}, ${country}`;
    tempTxt.textContent = Math.round(temp) + ' °C';
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = humidity + '%';
    pressureValueTxt.textContent = Math.round(pressure/33.863886666667) + ' Hg';
    visibilityValueTxt.textContent = visibility/1000 + ' km';
    windValueTxt.textContent = Math.round(speed/2.23694) + ' mph';
    maxTempTxt.textContent = Math.round(temp_max) + ' °C';
    minTempTxt.textContent = Math.round(temp_min) + ' °C';
    sunriseTxt.textContent = convertUnixTime(sunrise, timezone);
    sunsetTxt.textContent = convertUnixTime(sunset, timezone);
    currentDateTxt.textContent = getCurrentDate(timezone);
    weatherSummaryImg.src = `images/weather/${getWeaatherIcon(id)}`;
    currentTimeTxt.textContent = updateTime(timezone);
    await updateForecastsInfo(city);
    setInterval(() => { currentTimeTxt.textContent = updateTime(timezoneOffset); }, 60000);
    showDisplaySection(weatherInfoSection);  
}

async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city);

    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forecastItemsContainer.innerHTML = '';
    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItems(forecastWeather);
        }
    });
}

function updateForecastItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData;

    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short'
    };
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="images/weather/${getWeaatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `;
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);
}

function updateTime(timezoneOffset) {
    const localDate = new Date(new Date().getTime() + timezoneOffset * 1000);
    let hours = localDate.getUTCHours();
    const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Show '12' instead of '0' for midnight/noon
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
}
setInterval(updateTime, 60000);
updateTime();