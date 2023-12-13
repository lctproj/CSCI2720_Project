import React, { useState, useEffect } from "react";
import "./adminmain.css";

export default function AdminEventMain() {
    const [events, setEvents] = useState([]);
    const [oneEvent, setOneEvent] = useState({});
    const [fetched, setFetched] = useState(false);
    const [isOpened, setIsOpened] = useState(false);
    const [editedEvent, setEditedEvent] = useState({});

    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8964/all-events",
                    {
                        method: "GET",
                    }
                );
                const data = await response.json();
                console.log("Fetched data:", data);
                setEvents(data);
                setFetched(true);
            } catch (error) {
                console.error("Failed to fetch events:", error);
            }
        };

        if (!fetched) {
            fetchInitial();
        }
    }, [fetched]);

    const deleteEvent = async (id) => {
        try {
            const username = localStorage.getItem("user");

            await fetch("http://localhost:8964/admin/delete-event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: username, eventId: id }),
            });

            // Remove the deleted event from the events list
            setEvents(events.filter((event) => event.id !== id));
            console.log("Event deleted successfully.");
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };

    const updateEvent = async () => {
        try {
            console.log(editedEvent);
            const username = localStorage.getItem("user");
            const cleanedEvent = removeCircularReferences(editedEvent);
            const response = await fetch(
                `http://localhost:8964/admin/change-event/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username,
                        eventId: eventId,
                        updatedEvent: JSON.stringify(cleanedEvent),
                    }),
                }
            );
            const data = await response.json();
            console.log("Event updated successfully:", data);
            alert("Update Successful!");
            goBack();
            setOneEvent(data);
        } catch (error) {
            console.error("Failed to update event:", error);
        }
    };

    function removeCircularReferences(obj, seen = new WeakSet()) {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }
    
      if (seen.has(obj)) {
        return null; // Circular reference found, return null
      }
    
      seen.add(obj);
    
      const cleanedObj = Array.isArray(obj) ? [] : {};
    
      for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          const cleanedValue = removeCircularReferences(value, seen);
          if (cleanedValue !== null) {
            cleanedObj[key] = cleanedValue;
          }
        }
      }
    
      return cleanedObj;
    }

    const fetchEventDetail = async (id) => {
        try {
            const response = await fetch(`http://localhost:8964/event/${id}`, {
                method: "GET",
            });
            const data = await response.json();
            console.log("Fetched event detail:", data);
            setIsOpened(true);
            setOneEvent(data);
            setEditedEvent(data);
        } catch (error) {
            console.error("Failed to fetch event detail:", error);
        }
    };

    const goBack = () => {
        console.log("Back");
        setIsOpened(false);
    };

    const handleInputChange = (e, key) => {
        const { value } = e.target;
        setEditedEvent((prevEvent) => ({
            ...prevEvent,
            [key]: value,
        }));
    };

    return (
        <>
            <h2 className="title">Admin Main Page</h2>
            {!isOpened && (
                <table className="event-table">
                    <thead>
                        <tr className="table-header">
                            <th>Name</th>
                            <th>ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.id} className="event-row">
                                <td>{event.name}</td>
                                <td>{event.id}</td>
                                <td>
                                    <button
                                        onClick={() => deleteEvent(event.id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() =>
                                            fetchEventDetail(event.id)
                                        }
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {isOpened && (
                <>
                    <button onClick={() => goBack()}>Back</button>
                    <div>
                        <h3>Event Detail</h3>
                        {Object.entries(oneEvent).map(([key, value]) => (
                            <div key={key}>
                                <label htmlFor={key}>{key}: </label>
                                <textarea
                                    id={key}
                                    value={editedEvent[key] || ""}
                                    onChange={(e) => handleInputChange(e, key)}
                                />
                            </div>
                        ))}
                        <button onClick={() => updateEvent()}>Update</button>
                    </div>
                </>
            )}
        </>
    );
}
