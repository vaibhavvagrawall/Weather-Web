const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const weatherInfoSection = document.querySelector('.weather-info')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')
const cityTxt = document.querySelector('.city-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('#humidity-value-txt')
const windValueTxt = document.querySelector('#wind-value-txt')
const maxTempTxt = document.querySelector('#max-temp-txt');
const minTempTxt = document.querySelector('#min-temp-txt');
const sunriseTxt = document.querySelector('#sunrise-txt');
const sunsetTxt = document.querySelector('#sunset-txt');

const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')

const forecastItemsContainer = document.querySelector('.forecast-items-container')

const apiKey = '57b3c6fa2073781a41038802f70a2e31'

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        updateWeather(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != '') {
        updateWeather(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

async function getFetchData(endpoint, city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`
    const response = await fetch(apiUrl)
    return response.json()
}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection].forEach(section => section.style.display = 'none')
    section.style.display = 'flex'
}

function convertUnixTime(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB', options)
}

function getWeaatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

async function updateWeather(city){
    const weatherData = await getFetchData('weather', city);

    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection)
        return
    }

    const {
        name: name,
        main: { temp_max, temp_min, temp, humidity },
        weather: [{ id, main }],
        wind: { speed },
        sys: { sunrise, sunset }
    } = weatherData
    cityTxt.textContent = name
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + ' M/s'
    maxTempTxt.textContent = Math.round(temp_max) + ' °C';
    minTempTxt.textContent = Math.round(temp_min) + ' °C';
    sunriseTxt.textContent = convertUnixTime(sunrise);
    sunsetTxt.textContent = convertUnixTime(sunset);
    currentDateTxt.textContent = getCurrentDate()
    weatherSummaryImg.src = `images/weather/${getWeaatherIcon(id)}`

    await updateForecastsInfo(city)

    showDisplaySection(weatherInfoSection)
}

async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItemsContainer.innerHTML = ''
    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItems(forecastWeather)
        }
    })
}

function updateForecastItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="images/weather/${getWeaatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function updateTime() {
    const timeElement = document.getElementById('current-time');
    const currentDate = new Date();

    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const currentTime = hours + ':' + minutes + ' ' + ampm;

    timeElement.textContent = currentTime;
}

setInterval(updateTime, 60000);

updateTime();
