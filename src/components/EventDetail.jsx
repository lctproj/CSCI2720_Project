import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function EventDetails() {
    const { eventId } = useParams();
    const [event, setEvent] = useState({});

    useEffect(() => {
        fetchEventDetails();
    }, []);

    const fetchEventDetails = async () => {
        try {
            const response = await fetch(
                `http://localhost:8964/event/${eventId}`,
                { method: "GET" }
            );
            console.log(response);
            const data = await response.json();
            setEvent(data);
        } catch (error) {
            console.log("Error retrieving event:", error);
        }
    };

    return (
        <div>
            <h2>Event Details</h2>
            <p>Event Name: {event.event}</p>
            <p>Event ID: {event.eventId}</p>
            
        </div>
    );
}

export default EventDetails;
