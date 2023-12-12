import './locationmain.css';
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import React, { useState } from 'react';
import {Link} from 'react-router-dom';

export default function LocationCard({id, locationname, number }) {
    const [starred, setStarred] = useState(false);

    const handleStar = async () => {     
        //extract event details and format into JSON
        const favoriteLoc ={
            "id":id, 
            "name": locationname,
            "number": number,
        }

        if(starred) {
            try{
                const response = await fetch('http://localhost:8964/favorite-locs',{ //url TBD
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(favoriteLoc)
                });

                if (response.ok) {
                    setStarred(prevStarred => !prevStarred);
                } else {
                    throw new Error(`HTTP error: ${response.status}`);
                }
            }catch(err){
                console.error('Error adding location to favorites:', err);
            }
        }else{
            try{
                const response = await fetch('http://localhost:8964/favorite-locs',{ //url TBD
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                });

                if (response.ok) {
                    setStarred(prevStarred => !prevStarred);
                } else {
                    throw new Error(`HTTP error: ${response.status}`);
                }
            }catch(err){
                console.error('Error deleting location from favorites:', err);
            }
        }
    }

    const StarIcon = starred ? <IoIosStar onClick={handleStar} /> 
                             : <IoIosStarOutline onClick={handleStar} />;

    return (
        <div className="event-card">
            <div className="location-element">
            <Link to = {`/eventmain/locationid=${id}`}><p>{locationname}</p></Link>
            </div>
            <div className="location-element"><p>{number}</p></div>
            <div className="location-element">{StarIcon}</div>
        </div>
    );
}