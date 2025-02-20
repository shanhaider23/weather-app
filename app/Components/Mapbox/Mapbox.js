"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useGlobalContext, useGlobalContextUpdate } from "@/app/context/globalContext";
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';

// Dynamic import for Leaflet to avoid SSR issues
const L = typeof window !== "undefined" ? require("leaflet") : null;

function Mapbox() {
  const { forecast } = useGlobalContext();
  const { setActiveCityCoords } = useGlobalContextUpdate();
  const activeCityCords = forecast?.coord;

  // State to hold the map instance and weather data
  const [map, setMap] = useState(null);
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Set city and weather data when forecast changes
    if (forecast && forecast.main && forecast.weather) {
      setCity(forecast.name);
      setWeather(`${Math.round(forecast.main.temp - 273.15)}°C`);
      setDescription(forecast.weather[0]?.description);
    }
  }, [forecast]);

  useEffect(() => {
    if (map && activeCityCords) {
      const zoomLev = 13;
      const flyToOptions = {
        animate: true,
        duration: 1.5,
      };
      map.flyTo([activeCityCords.lat, activeCityCords.lon], zoomLev, flyToOptions);
    }
  }, [map, activeCityCords]);

  if (!forecast || !activeCityCords) {
    return <div><h1>Loading...</h1></div>;
  }

  // Custom component to handle map click events
  const MapClickHandler = () => {
    const map = useMap();

    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setActiveCityCoords([lat, lng]);

        if (L) { // Check if Leaflet is available
          const popupContent = forecast && forecast.main && forecast.weather
            ? `
              <div class='map-box__popup-details'>
                <h1>${city || 'Unknown location'}</h1>
                <h2>Temperature: ${weather}</h2>
                <h2>Condition: ${description || 'No data'}</h2>
              </div>
            `
            : `
              <div class='map-box__popup-details'>
                <h1>Loading weather data...</h1>
              </div>
            `;

          L.popup()
            .setLatLng([lat, lng])
            .setContent(popupContent)
            .openOn(map);
        }
      },
    });

    return null;
  };


  return (
    <div className="flex-1 basis-[50%] border rounded-lg ">
      <h1 className="text-xl pt-2  pb-2 text-center">Tap on the Map for Local Weather</h1>
      <MapContainer
        center={[activeCityCords.lat, activeCityCords.lon]}
        zoom={13}
        scrollWheelZoom={false}
        className="rounded-lg m-4"
        style={{ height: "89%", width: "100%" }}
        whenCreated={(mapInstance) => setMap(mapInstance)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
      </MapContainer>
    </div>
  );
}

export default Mapbox;
