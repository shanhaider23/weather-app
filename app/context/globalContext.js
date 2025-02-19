"use Client";
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
  const [uvIndex, seUvIndex] = useState({});

  // Fetch weather forecast
  const fetchForecast = async (lat, lon) => {
    try {
      const res = await axios.get(`api/weather?lat=${lat}&lon=${lon}`);
      setForecast(res.data);
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
    } catch (error) {
      console.error("Error fetching five day forecast data: ", error.message);
    }
  };

  // Fetch UV index
  const fetchUvIndex = async (lat, lon) => {
    try {
      const res = await axios.get(`/api/uv?lat=${lat}&lon=${lon}`);
      seUvIndex(res.data);
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
          // Fallback to a default location if geolocation fails
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
