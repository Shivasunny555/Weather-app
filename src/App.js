import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [cityName, setCityName] = useState('');

  useEffect(() => {
    if (cityName.trim() !== '') {
      getWeatherData(cityName);
    }
  }, [cityName]);

  async function getWeatherData(city) {
    const apiKey = '499abb21edea17dab5a1d3f2aa293ad5';
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(weatherApiUrl),
        fetch(forecastApiUrl)
      ]);

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('Error fetching weather data');
      }

      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      setWeatherData({ weather: weatherData, forecast: forecastData });
      setError(null);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
      setError('Error fetching weather data');
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCityName(value);
    if (value.trim() !== '') {
      getWeatherData(value);
    } else {
      setWeatherData(null);
      setError(null);
    }
  };

  const displayWeatherData = () => {
    if (!weatherData && !error) {
      return <p>Loading...</p>;
    }
  
    if (error) {
      return <p className="error-message">{error}</p>;
    }
  
    if (!weatherData || !weatherData.weather || !weatherData.forecast) {
      return <p>No weather data available.</p>;
    }
  
    const { weather, forecast } = weatherData;
  
    const getWeatherSymbol = (temp) => {
      if (temp > 30) return '🔥';
      if (temp >= 25 && temp <= 30) return '☀️';
      if (temp >= 20 && temp < 25) return '🌤️';
      if (temp >= 1 && temp < 20) return '🌬️';
      return '❄️';
    };
  
    return (
      <div className="weather-info-container">
        <h2 className="weather-heading">Current Weather</h2>
        <div className="current-weather">
          <p>
            Temperature: {weather.main.temp} °C {getWeatherSymbol(weather.main.temp)}
          </p>
          <p>Description: {weather.weather[0].description}</p>
        </div>
  
        <h2 className="forecast-heading">Forecast</h2>
        <table className="forecast-table">
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>Temperature (°C)</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {forecast.list.map((item, index) => (
              <tr key={index}>
                <td>{item.dt_txt}</td>
                <td>{item.main.temp}</td>
                <td>{item.weather[0].description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <div className="container">
      <h1>Weather App</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter city name"
          value={cityName}
          onChange={handleInputChange}
          className="city-input"
        />
      </div>
      {displayWeatherData()}
    </div>
  );
};

export default App;
