import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Comments from "./Comments";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

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

function EventDetails() {
    const { eventId } = useParams();
    const [event, setEvent] = useState({});
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        fetchEventDetails();
        checkFavoriteStatus();
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

    const addToFavorites = async (isAdd) => {
        try {
            const token = Cookies.get("token");
            console.log(token);
            const cookie = Cookies.get("payload");
            console.log(cookie);
            const payload = JSON.parse(cookie);
            console.log(payload);
            if (!payload) {
                alert("Please sign in to add this event to your favorites.");
                return;
            }

            const response = await fetch(
                "http://localhost:8964/favourite-event",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        username: payload.username,
                        eventId: eventId,
                        IsAdd: isAdd,
                    }),
                }
            );

            if (response.status === 200) {
                setIsFavorite(isAdd);
                console.log(
                    `Event ${isAdd ? "added to" : "removed from"} favorites`
                );
            } else {
                console.log(
                    `Error ${
                        isAdd ? "adding event to" : "removing event from"
                    } favorites:`,
                    response.statusText
                );
            }
        } catch (error) {
            console.log("Error adding event to favorites:", error);
        }
    };

    const checkFavoriteStatus = async () => {
        try {
            const cookie = Cookies.get("payload");
            const payload = JSON.parse(cookie);
            const token = Cookies.get("token");
            console.log(token);

            const response = await fetch("http://localhost:8964/user-data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ username: payload.username }),
            });

            if (response.ok) {
                const data = await response.json();
                const favEvent = data.favEventId;
                console.log(favEvent);
                setIsFavorite(favEvent.includes(eventId) || favEvent != []);
                console.log(isFavorite);
            } else if (response.status === 401) {
                console.log("Unauthorized access");
            } else {
                console.log("Error retrieving user:", response.statusText);
            }
        } catch (error) {
            console.log("Error checking favorite status:", error);
        }
    };

    return (
        <div className="">
        <div className="flex items-center bg-blue-500 justify-between w-full gap-4 p-4 space-x-4">
            <button className="px-4 py-2 text-white bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600">
            <Link to={`/`}>Home</Link>
            </button>
        </div>
            
            
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
            {isFavorite ? (
                <button
                    onClick={() => addToFavorites(false)}
                    className="bg-blue-500 text-white rounded-md px-4 py-2"
                >
                    <Favorite />
                </button>
            ) : (
                <button
                    onClick={() => addToFavorites(true)}
                    className="bg-white text-blue-500 border-blue-500 rounded-md px-4 py-2"
                >
                    <FavoriteBorder />
                </button>
            )}
            <Comments Id={eventId} isEvent={true} />
        </div>
        </div>
    );
}

export default EventDetails;
