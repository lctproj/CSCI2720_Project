import './eventmain.css';
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import React, { useState } from 'react';
import {Link} from 'react-router-dom';

export default function EventCard({ id, eventname, earliestdate, latestdate, price }) {
    const [starred, setStarred] = useState(false);

    const handleStar = async () => {     
        //extract event details and format into JSON
        const favoriteEvent ={
            "id":id, 
            "name": eventname,
            "earliestdate": earliestdate,
            "latestdate": latestdate,
            "price": price
        }

        if(starred) {
            try{
                const response = await fetch('http://localhost:8964/favorites',{ //url TBD
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
                const response = await fetch('http://localhost:8964/favorites',{ //url TBD
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
                <Link to = {`/eventmain/eventid=${id}`}><p>{eventname}</p></Link>
            </div>
            <div className="event-element"><p>{earliestdate}</p></div>
            <div className="event-element"><p>{latestdate}</p></div>
            <div className="event-element"><p>{price}</p></div>
            <div className="event-element">{StarIcon}</div>
        </div>
    );
}