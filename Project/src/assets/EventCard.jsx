import './eventmain.css';
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';

export default function EventCard({ id, eventname, earliestdate, latestdate, price, username }) {
  
    const handleAddClick = async () => {     
        //extract event details and format into JSON
        const favoriteEvent ={
            "eventId":id, 
            "username":username, 
            "IsAdd": true
        }

        try{
            const response = await fetch('http://localhost:8964/favourite-event',{ //url TBD
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(favoriteEvent)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Event added to favorites:', result);
            } else {
                throw new Error(`HTTP error: ${response.status}`);
            }
        }catch(err){
            console.error('Error adding event to favorites:', err);
        }
    }
        
    const handleDeleteClick = async () => {     
        //extract event details and format into JSON
        const favoriteEvent ={
            "eventId":id, 
            "username":username, 
            "IsAdd": false
        }

        try{
            const response = await fetch('http://localhost:8964/favourite-event',{ //url TBD
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(favoriteEvent)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Event deleted from favorites:', result);
            } else {
                throw new Error(`HTTP error: ${response.status}`);
            }
        }catch(err){
            console.error('Error adding event to favorites:', err);
        }
    }

    let Id=parseInt(id);

    return (
        <div className="event-card">
            <div className="event-element">
                <Link to = {`/event/${Id}`}><p>{eventname}</p></Link>
            </div>
            <div className="event-element"><p>{earliestdate}</p></div>
            <div className="event-element"><p>{latestdate}</p></div>
            <div className="event-element"><p>{price}</p></div>
            <div className="add-button" onClick={handleAddClick}><p>Add to favorites</p></div>
            <div className="delete-button" onClick={handleDeleteClick}><p>Remove from favorites</p> </div>
        </div>
    );
}