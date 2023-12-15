import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Comments from './Comments'

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
    predate: "Pre Date",
    progtime: "Program Time",
    agelimit: "Age Limit",
    price: "Price",
    desc: "Description",
    url: "URL",
    tagenturl: "Tagent URL",
    remark: "Remark",
    presenterorg: "Presenter Organization",
    venueId: "Venue ID",
};

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
                {
                    method: "GET",
                }
            );
            const data = await response.json();
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
                value[0] != null &&
                !key.startsWith("_") &&
                !key.startsWith("cat")
        )
    );

    return (
        <div>
            <h2>Event Details</h2>
            {Object.entries(filteredEvent).map(([key, value]) => (
                <p key={key}>
                    {keyToNameMapping[key]}: {value}
                </p>
            ))}
            <Comments />
        </div>
    );
}

export default EventDetails;
