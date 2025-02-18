"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useGlobalContext } from "@/app/context/globalContext";

// Dynamically import Leaflet components with SSR disabled
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });

function Mapbox() {
  const { forecast } = useGlobalContext();
  const activeCityCords = forecast?.coord;

  // State to hold the map instance
  const [map, setMap] = useState(null);

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
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex-1 basis-[50%] border rounded-lg">
      <MapContainer
        center={[activeCityCords.lat, activeCityCords.lon]}
        zoom={13}
        scrollWheelZoom={false}
        className="rounded-lg m-4"
        style={{ height: "100%", width: "100%" }}
        whenCreated={(mapInstance) => setMap(mapInstance)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
}

export default Mapbox;
