import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
    width: "50vw",
    height: "50vh",
};
const center = {
    lat: 22.249313720211873, // default latitude
    lng: 114.15451912610017, // default longitude
};

const Map = () => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyBjvfqOkKXop0v1WMxVOzuPAxzeJ72aT8I",
    });

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading maps</div>;
    }

    return (
        <div>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={19}
                center={center}
            >
                <Marker
                    position={center}
                    icon={
                        "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    }
                />
            </GoogleMap>
        </div>
    );
};

export default Map;
