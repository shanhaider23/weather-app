import axios from "axios";
import React, { useContext, createContext, useState, useEffect } from "react";
import defaultStates from "../utils/defaultStates";
import { debounce } from "lodash";

const GlobalContext = createContext();
const GlobalContextUpdate = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [forecast, setForecast] = useState({});
  const [geoCodedList, setGeoCodedList] = useState(defaultStates);
  const [inputValue, setInputValue] = useState("");
  const [activeCityCoords, setActiveCityCoords] = useState(null);
  const [airQuality, setAirQuality] = useState({});
  const [fiveDayForecast, setFiveDayForecast] = useState({});
  const [uvIndex, setUvIndex] = useState({});
  const [advice, setAdvice] = useState("");

  // Fetch weather forecast
  const fetchForecast = async (lat, lon) => {
    try {
      const res = await axios.get(`api/weather?lat=${lat}&lon=${lon}`);
      setForecast(res.data);
      generateAdvice(res.data);
    } catch (error) {
      console.error("Error fetching forecast data: ", error.message);
    }
  };

  // Fetch air quality
  const fetchAirQuality = async (lat, lon) => {
    try {
      const res = await axios.get(`api/pollution?lat=${lat}&lon=${lon}`);
      setAirQuality(res.data);
    } catch (error) {
      console.error("Error fetching air quality data: ", error.message);
    }
  };

  // Fetch five-day forecast
  const fetchFiveDayForecast = async (lat, lon) => {
    try {
      const res = await axios.get(`api/fiveday?lat=${lat}&lon=${lon}`);

      setFiveDayForecast(res.data);
      console.log(res.data, 'ddd')
    } catch (error) {
      console.error("Error fetching five day forecast data: ", error.message);
    }
  };

  // Fetch UV index
  const fetchUvIndex = async (lat, lon) => {
    try {
      const res = await axios.get(`/api/uv?lat=${lat}&lon=${lon}`);
      setUvIndex(res.data);
    } catch (error) {
      console.error("Error fetching the UV index: ", error);
    }
  };

  // Fetch geocoded list
  const fetchGeoCodedList = async (search) => {
    try {
      const res = await axios.get(`/api/geocoded?search=${search}`);
      setGeoCodedList(res.data);
    } catch (error) {
      console.error("Error fetching geocoded list: ", error.message);
    }
  };

  // Handle input
  const handleInput = (e) => {
    setInputValue(e.target.value);
    if (e.target.value === "") {
      setGeoCodedList(defaultStates);
    }
  };

  const generateAdvice = (forecast, userPreferences = {}) => {
    if (!forecast || !forecast.main || !forecast.wind || !forecast.weather) return;

    const tempCelsius = forecast.main.temp - 273.15; // Convert Kelvin to Celsius
    const { humidity } = forecast.main;
    const { speed: windSpeed } = forecast.wind;
    const weatherCondition = forecast.weather[0]?.main || "";
    const { visibility } = forecast;
    const { sunrise, sunset } = forecast.sys || {};
    const uvIndexValue = uvIndex.value || 0;

    let newAdvice = "";

    // Wind conditions
    if (windSpeed > 7) {
      newAdvice += "It's quite windy! Cycling might be tough. ";
    } else if (windSpeed > 15) {
      newAdvice += "Strong winds are expected. Secure loose objects and be cautious outdoors. ";
    }

    // Precipitation conditions
    if (weatherCondition === "Rain" || weatherCondition === "Drizzle") {
      newAdvice += "Rain is expected. Don't forget your umbrella! ";
    } else if (weatherCondition === "Snow") {
      newAdvice += "Snowy weather ahead! Be careful on the roads and dress warmly. ";
    } else if (weatherCondition === "Thunderstorm") {
      newAdvice += "Thunderstorms expected. Stay indoors if possible and avoid open areas. ";
    }

    // Temperature conditions
    if (tempCelsius > 30) {
      newAdvice += "It's hot outside. Stay hydrated and wear sunscreen! ";
    } else if (tempCelsius < 10) {
      newAdvice += "It's cold outside. Wear warm clothes! ";
    } else if (tempCelsius > 25 && humidity > 60) {
      newAdvice += "It's warm and humid. Consider light, breathable clothing. ";
    }

    // Humidity conditions
    if (humidity > 80) {
      newAdvice += "The humidity is high — it might feel warmer than it actually is. Stay cool! ";
    } else if (humidity < 30) {
      newAdvice += "The air is dry. Stay hydrated and consider using a moisturizer. ";
    }

    // UV Index conditions
    if (uvIndexValue > 6) {
      newAdvice += "The UV index is high — wear sunscreen and protect yourself from sunburn. ";
    } else if (uvIndexValue > 3) {
      newAdvice += "Moderate UV index. Some protection is recommended if you're outside for long. ";
    }

    // Visibility conditions
    if (visibility < 1000) {
      newAdvice += "Visibility is low. Drive carefully and use headlights if necessary. ";
    }

    // Sunrise and sunset conditions
    const now = new Date();
    const sunriseTime = new Date(sunrise * 1000);
    const sunsetTime = new Date(sunset * 1000);

    if (now < sunriseTime || now > sunsetTime) {
      newAdvice += "It's dark outside. Wear reflective clothing if you're out walking or cycling. ";
    }

    if (!newAdvice) {
      newAdvice = "The weather looks great! Enjoy your day!";
    }

    setAdvice(newAdvice);
  };

  // Debounce input for geocoded list
  useEffect(() => {
    const debouncedFetch = debounce((search) => {
      fetchGeoCodedList(search);
    }, 500);

    if (inputValue) {
      debouncedFetch(inputValue);
    }

    return () => debouncedFetch.cancel();
  }, [inputValue]);

  // Use geolocation to get the user's position
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setActiveCityCoords([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting user location: ", error);
          setActiveCityCoords([51.752021, -1.257726]); // Oxford as fallback
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setActiveCityCoords([51.752021, -1.257726]); // Oxford as fallback
    }
  }, []);

  // Fetch weather data when activeCityCoords changes
  useEffect(() => {
    if (activeCityCoords) {
      fetchForecast(activeCityCoords[0], activeCityCoords[1]);
      fetchAirQuality(activeCityCoords[0], activeCityCoords[1]);
      fetchFiveDayForecast(activeCityCoords[0], activeCityCoords[1]);
      fetchUvIndex(activeCityCoords[0], activeCityCoords[1]);
    }
  }, [activeCityCoords]);

  return (
    <GlobalContext.Provider
      value={{
        forecast,
        airQuality,
        fiveDayForecast,
        uvIndex,
        geoCodedList,
        inputValue,
        handleInput,
        setActiveCityCoords,
        advice, // Provide advice in context
      }}
    >
      <GlobalContextUpdate.Provider value={{ setActiveCityCoords }}>
        {children}
      </GlobalContextUpdate.Provider>
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
export const useGlobalContextUpdate = () => useContext(GlobalContextUpdate);
