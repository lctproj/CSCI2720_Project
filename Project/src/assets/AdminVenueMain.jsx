import React, { useState, useEffect } from "react";
import "./adminmain.css";

export default function AdminVenueMain() {
    const [venues, setVenues] = useState([]);
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8964/all-venues",
                    {
                        method: "GET",
                    }
                );
                const data = await response.json();
                console.log("Fetched data:", data);
                setVenues(data);
                setFetched(true);
            } catch (error) {
                console.error("Failed to fetch events:", error);
            }
        };

        if (!fetched) {
            fetchInitial();
        }
    }, [fetched]);

    const deleteVenue = async (id) => {
        try {
            const username = localStorage.getItem("user");

            await fetch("http://localhost:8964/admin/delete-event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: username, venueId: id }),
            });

            // Remove the deleted event from the events list
            setVenues(venues.filter((venues) => venues.id !== id));
            console.log("Event deleted successfully.");
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };

    const editVenue = async (id) => {
        // Implement the edit functionality according to your requirements
        console.log("Edit event with ID:", id);
    };

    return (
        <>
            <h2 className="title">Admin Main Page</h2>
            <table className="venue-table">
                <thead>
                    <tr className="table-header">
                        <th>Name</th>
                        <th>ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {venues.map((venue) => (
                        <tr key={venue.id} className="venue-row">
                            <td>{venue.name}</td>
                            <td>{venue.id}</td>
                            <td>
                                <button onClick={() => deleteVenue(venue.id)}>
                                    Delete
                                </button>
                                <button onClick={() => editVenue(venue.id)}>
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
