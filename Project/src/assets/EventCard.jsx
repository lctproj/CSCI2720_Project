import './eventmain.css';
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';

export default function EventCard({ id, eventname, earliestdate, latestdate, price, username }) {
    const [starred, setStarred] = useState(false);
    const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch('http://localhost:8964/all-favorite-events/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username })
                });

                if (!response.ok) {
                    throw new Error('Error fetching favorite event list');
                }

                const favoriteList = await response.json();
                const originallyStarred = favoriteList.some(event => event.eventId === id);
                setStarred(originallyStarred);
            } catch (err) {
                console.error("Error fetching original starred state", err);
            } finally {
                setIsFetched(true);
            }
        };

        fetchFavorites();
    }, [id, username]);

    const handleStar = async () => {     
        //extract event details and format into JSON
        const favoriteEvent ={
            "id":id, 
            "username":username, 
        }

        if(starred) {
            try{
                const response = await fetch('http://localhost:8964/favorite-events',{ //url TBD
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(favoriteEvent)
                });

                if (response.ok) {
                    setStarred(prevStarred => !prevStarred);
                } else {
                    throw new Error(`HTTP error: ${response.status}`);
                }
            }catch(err){
                console.error('Error adding event to favorites:', err);
            }
        }else{
            try{
                const response = await fetch('http://localhost:8964/favorite-events',{
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                });

                if (response.ok) {
                    setStarred(prevStarred => !prevStarred);
                } else {
                    throw new Error(`HTTP error: ${response.status}`);
                }
            }catch(err){
                console.error('Error deleting event from favorites:', err);
            }
        }
    }

    const StarIcon = starred ? <IoIosStar onClick={handleStar} /> 
                             : <IoIosStarOutline onClick={handleStar} />;

    return (
        <div className="event-card">
            <div className="event-element">
                <Link to = {`/eventmain/eventId=${id}`}><p>{eventname}</p></Link>
            </div>
            <div className="event-element"><p>{earliestdate}</p></div>
            <div className="event-element"><p>{latestdate}</p></div>
            <div className="event-element"><p>{price}</p></div>
            <div className="event-element" style={{ cursor: 'pointer' }} >{StarIcon}</div>
        </div>
    );
}