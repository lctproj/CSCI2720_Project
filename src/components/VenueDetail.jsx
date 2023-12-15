import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Map from './Map'


function VenueDetails() {
    const { venueId } = useParams();
    const [venue, setVenue] = useState({});

    useEffect(() => {
        fetchVenueDetails();
    }, []);

    const fetchVenueDetails = async () => {
        try {
            const response = await fetch(
                `http://localhost:8964/venue/${venueId}`,
                { method: "GET" }
            );
            const data = await response.json();
            setVenue(data);
        } catch (error) {
            console.log("Error retrieving venue:", error);
        }
    };

    return (
        <div>
            <h2>Venue Details</h2>
            <p>Venue Name: {venue.venue}</p>
            <p>Venue ID: {venue.venueId}</p>
            <Map jsonData={venue} />
        </div>
    );
}

export default VenueDetails;