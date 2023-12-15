import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function CreateEvent() {
    const [eventData, setEventData] = useState({
        cat1: "",
        cat2: "",
        enquiry: "",
        fax: "",
        email: "",
        saledate: "",
        interbook: "",
        // eventId: "",
        prices: [],
        title: "",
        predate: "",
        progtime: "",
        agelimit: "",
        price: "",
        desc: "",
        url: "",
        tagenturl: "",
        remark: "",
        presenterorg: "",
        eventDates: [],
        venueId: "",
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleDateChange = (key, date) => {
        setEventData((prevState) => ({
            ...prevState,
            [key]: [...prevState[key], date],
        }));
    };

    const handleClearDates = () => {
        setEventData((prevState) => ({
            ...prevState,
            eventDates: [],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = Cookies.get("token");

            console.log(eventData);
            eventData.eventId = 10;

            const response = await fetch(
                "http://localhost:8964/admin/create-event",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ newEvent: eventData }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Event created successfully!", data);
                window.location.href = "/admin/home";
            } else {
                console.log("Error creating event:", response.statusText);
            }
        } catch (error) {
            console.log("Error creating event:", error);
        }
    };

    const renderInputField = (key, value) => {
        if (key.endsWith("Dates")) {
            return (
                <div>
                    <input
                        type="date"
                        name={key}
                        value={""}
                        onChange={(e) => handleDateChange(key, e.target.value)}
                        className="ml-2 px-2 py-1 border border-gray-300 rounded"
                    />
                    <ul>
                        {eventData.eventDates.map((date, index) => (
                            <li key={index}>{date}</li>
                        ))}
                    </ul>
                    {eventData.eventDates.length > 0 && (
                        <button onClick={handleClearDates}>Clear Dates</button>
                    )}
                </div>
            );
        }

        return (
            <input
                type="text"
                name={key}
                value={value}
                onChange={handleInputChange}
                required={key.endsWith("Id")}
                className="ml-2 px-2 py-1 border border-gray-300 rounded"
            />
        );
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Create Event</h2>
            <form onSubmit={handleSubmit}>
                {Object.entries(eventData).map(([key, value]) => (
                    <div key={key} className="mb-2">
                        <label className="font-bold">{key}: </label>
                        {renderInputField(key, value)}
                    </div>
                ))}
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-md px-4 py-2 mt-4"
                >
                    Create Event
                </button>
            </form>
        </div>
    );
}

export default CreateEvent;
