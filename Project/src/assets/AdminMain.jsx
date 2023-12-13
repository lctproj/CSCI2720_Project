import React, { useState, useEffect } from "react";
import './adminmain.css';

export default function AdminMain() {
  const [events, setEvents] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const response = await fetch("http://localhost:8964/all-events", {
          method: "GET"
        });
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
      const username = localStorage.getItem('user');
  
      await fetch('http://localhost:8964/admin/delete-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, eventId: id }),
      });
  
      // Remove the deleted event from the events list
      setEvents(events.filter((event) => event.id !== id));
      console.log('Event deleted successfully.');
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const editEvent = async (id) => {
    // Implement the edit functionality according to your requirements
    console.log("Edit event with ID:", id);
  };

  return (
    <>
      <h2 className="title">Admin Main Page</h2>
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
                <button onClick={() => deleteEvent(event.id)}>Delete</button>
                <button onClick={() => editEvent(event.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}