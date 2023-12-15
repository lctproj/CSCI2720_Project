import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

function AdminEvent() {
    const { eventId } = useParams();
    const [event, setEvent] = useState({});
    const [editedEvent, setEditedEvent] = useState({});
    const [isEditing, setIsEditing] = useState(false);

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
            console.log(data);
            setEvent(data);
            setEditedEvent(data);
        } catch (error) {
            console.log("Error retrieving event:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedEvent((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const saveChanges = async () => {
        try {
            const response = await fetch(
                "http://localhost:8964/admin/change-event",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: "admin",
                        eventId: eventId,
                        updatedEvent: editedEvent,
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Event saved successfully!", data);
                setIsEditing(false);
                setEvent(editedEvent);
            } else {
                console.log("Error saving event:", response.statusText);
            }
        } catch (error) {
            console.log("Error saving event:", error);
        }
    };

    const deleteEvent = async () => {
        try {
            const cookie = Cookies.get("payload");
            const payload = JSON.parse(cookie);
            const token = Cookies.get("token");

            const response = await fetch(
                `http://localhost:8964/admin/delete-event`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        username: payload.username,
                        eventId: eventId,
                    }),
                }
            );

            console.log(response);

            if (response.ok) {
                console.log("Event deleted successfully!");
                window.location.href = "/admin/home";
            } else {
                console.log("Error deleting event:", response.statusText);
            }
        } catch (error) {
            console.log("Error deleting event:", error);
        }
    };

    const filteredEvent = Object.fromEntries(
        Object.entries(event).filter(
            ([key, value]) =>
                !key.startsWith("_") &&
                !key.startsWith("cat") &&
                !key.endsWith("Id")
        )
    );

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Event Details</h2>
            {Object.entries(filteredEvent).map(([key, value]) => (
                <div key={key} className="mb-2">
                    <label className="font-bold">{`${key}: `}</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name={key}
                            value={editedEvent[key] || ""}
                            onChange={handleInputChange}
                            className="ml-2 px-2 py-1 border border-gray-300 rounded"
                        />
                    ) : (
                        <span>{value}</span>
                    )}
                </div>
            ))}
            {isEditing ? (
                <button
                    onClick={saveChanges}
                    className="bg-blue-500 text-white rounded-md px-4 py-2 mt-4"
                >
                    Save Changes
                </button>
            ) : (
                <>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-500 text-white rounded-md px-4 py-2 mt-4"
                    >
                        Edit Event
                    </button>
                    <button
                        onClick={deleteEvent}
                        className="bg-red-500 text-white rounded-md px-4 py-2 mt-4 ml-2"
                    >
                        Delete Event
                    </button>
                </>
            )}
        </div>
    );
}

export default AdminEvent;
