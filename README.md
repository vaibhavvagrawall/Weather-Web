# Weather App

This is a weather application built using HTML, CSS, and JavaScript. The app allows users to view the current weather conditions for any city, along with additional information such as temperature, humidity, wind speed, and more. The current time is also displayed alongside the weather details.

## Features

- **City Search**: Users can search for the weather of any city.
- **Current Weather**: Displays the current temperature, weather condition (e.g., clouds, clear sky), and weather icon.
- **Time Display**: Shows the current time in a 12-hour format (AM/PM).
- **Weather Conditions**: Displays additional weather details such as humidity, wind speed, etc.
- **Forecast**: A section showing upcoming weather forecast.

## Technologies Used

- **HTML**: For structure and layout.
- **CSS**: For styling the application, with a focus on responsive design.
- **JavaScript**: To fetch the weather data from an API and dynamically update the UI.
- **Google Fonts**: The application uses the 'Poppins' font from Google Fonts for a clean and modern design.

## Usage

1. **Search for a City**: In the search input, type the name of any city and press enter to view the weather for that location.
2. **Current Weather**: The app displays the current weather conditions, temperature, and other relevant information for the city.
3. **Time Display**: The current time is displayed below the city and date information, and it automatically updates every minute.
4. **Forecast**: The forecast section shows upcoming weather data.

## Project Structure

- **images/**: Contains weather icons used in the app.
- **index.html**: The main HTML file for the application.
- **style.css**: Contains the styles and layout for the weather app.
- **script.js**: Handles the logic for fetching weather data and updating the UI, including the current time.

## API Integration

The weather data is fetched from a weather API. You'll need to replace the `API_KEY` in the JavaScript file with your actual API key from a service like [OpenWeatherMap](https://openweathermap.org/).

1. Sign up at OpenWeatherMap (or another weather API provider).
2. Obtain your API key.
3. Update the API key in the `script.js` file.
const API_KEY = 'your-api-key';

## Demo

A live demo of the project is available below:
- **Live Demo**: [Link](https://weather-web-vaibhav-agrawals-projects-de317429.vercel.app/)
