import './eventmain.css';
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import React, { useState } from 'react';

export default function EventCard({ eventname, earliestdate, latestdate, price }) {
    const [starred, setStarred] = useState(false);

    const StarIcon = starred ? <IoIosStar onClick={() => setStarred(!starred)} /> 
                             : <IoIosStarOutline onClick={() => setStarred(!starred)} />;

    return (
        <div className="event-card">
            <div className="event-element"><p>{eventname}</p></div>
            <div className="event-element"><p>{earliestdate}</p></div>
            <div className="event-element"><p>{latestdate}</p></div>
            <div className="event-element"><p>{price}</p></div>
            <div className="event-element">{StarIcon}</div>
        </div>
    );
}