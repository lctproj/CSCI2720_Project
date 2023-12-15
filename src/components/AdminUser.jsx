import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Comments from "./Comments";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Cookies from "js-cookie";

const keyToNameMapping = {
    cat1: "Category 1",
    cat2: "Category 2",
    enquiry: "Enquiry",
    fax: "Fax",
    email: "Email",
    saledate: "Sale Date",
    interbook: "Interbook",
    eventId: "Event ID",
    title: "Event Name",
    predate: "Date",
    progtime: "Program Time",
    eventDates: "Event Dates",
    agelimit: "Age Limit",
    price: "Price",
    desc: "Description",
    url: "URL",
    tagenturl: "Ticket agent URL",
    remark: "Remark",
    presenterorg: "Presenter Organization",
    venueId: "Venue ID",
};

function AdminEvent() {
    const { eventId } = useParams();
    const [event, setEvent] = useState({});

    useEffect(() => {
        fetchEventDetails();
    }, []);

    const fetchEventDetails = async () => {
        try {
            const response = await fetch(
                `http://localhost:8964/event/${eventId}`,
                {
                    method: "GET",
                }
            );
            const data = await response.json();
            delete data.eventDates;
            delete data.prices;
            console.log(data);
            setEvent(data);
        } catch (error) {
            console.log("Error retrieving event:", error);
        }
    };

    const filteredEvent = Object.fromEntries(
        Object.entries(event).filter(
            ([key, value]) =>
                value !== "" &&
                value !== null &&
                !key.startsWith("_") &&
                !key.startsWith("cat")
        )
    );

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Event Details</h2>
            {Object.entries(filteredEvent).map(([key, value]) => (
                <p key={key} className="mb-2 text-black">
                    <span className="font-bold">{keyToNameMapping[key]}: </span>
                    {key.endsWith("url") ? (
                        <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            {value}
                        </a>
                    ) : (
                        value
                    )}
                </p>
            ))}
        </div>
    );
}

export default AdminEvent;
