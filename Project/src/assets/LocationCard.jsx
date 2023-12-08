import './locationmain.css';
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import React, { useState } from 'react';

export default function LocationCard({ locationname, number }) {
    const [starred, setStarred] = useState(false);

    const StarIcon = starred ? <IoIosStar onClick={() => setStarred(!starred)} /> 
                             : <IoIosStarOutline onClick={() => setStarred(!starred)} />;

    return (
        <div className="event-card">
            <div className="location-element"><p>{locationname}</p></div>
            <div className="location-element"><p>{number}</p></div>
            <div className="location-element">{StarIcon}</div>
        </div>
    );
}