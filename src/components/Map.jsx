import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import '../../dist/output.css';

const mapContainerStyle = {
  width: "50vw",
  height: "50vh",
};

const Map = ({ jsonData }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBjvfqOkKXop0v1WMxVOzuPAxzeJ72aT8I",
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  const center = {
    lat: Number(jsonData.latitude),
    lng: Number(jsonData.longitude)
  };

  const markerIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={19}
        center={center}
      >
        <Marker position={center} icon={markerIcon} />
      </GoogleMap>
    </div>
  );
};

export default Map;