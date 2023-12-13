import './locationmain.css';
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import React, { useState,useEffect } from 'react';
import {Link} from 'react-router-dom';

export default function LocationCard({id, locationname, number ,username}) {
    const [starred, setStarred] = useState(false);
   /* const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch('http://localhost:8964/all-favorite-venues/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username })
                });

                if (!response.ok) {
                    throw new Error('Error fetching favorite venue list');
                }

                const favoriteList = await response.json();
                const originallyStarred = favoriteList.some(venue => venue.venueId === id);
                setStarred(originallyStarred);
            } catch (err) {
                console.error("Error fetching original starred state", err);
            } finally {
                setIsFetched(true);
            }
        };

        fetchFavorites();
    }, [id, username]);
*/
    const handleStar = async () => {     
        //extract event details and format into JSON
        const favoriteLoc ={
            "id":id, 
            "username":username
        }

        if(starred) {
            try{
                const response = await fetch('http://localhost:8964/favorite-venues',{ //url TBD
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
                const response = await fetch('http://localhost:8964/favorite-venues',{ //url TBD
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
            <Link to = {`/venue/${id}`}><p>{locationname}</p></Link>
            </div>
            <div className="location-element"><p>{number}</p></div>
            <div className="location-element" style={{ cursor: 'pointer' }}>{StarIcon}</div>
        </div>
    );
}