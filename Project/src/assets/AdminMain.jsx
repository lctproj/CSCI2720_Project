import React, { useState, useEffect } from "react";
import './adminmain.css';

export default function AdminMain() {
  const [events, setEvents] = useState([]);
  const [fetched, setFetched] = useState(false);

  const fetchInitial = async () => {
    try {
      const response = await fetch("http://localhost:8964/all-events", {
        method: "GET"
      });
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  if (!fetched) {
    fetchInitial();
  }

  useEffect(() => {
    fetchInitial();
    console.log(events);
  }, []);

  return (
    <div className="container">
      <h1>Admin Main Page</h1>
      <ul className="event-list">
        {events.map(event => (
          <li key={event.id} className="event-item">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}