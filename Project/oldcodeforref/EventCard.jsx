import React from 'react';
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
        <div className="bg-gray-300 rounded border-2 border-black flex flex-row justify-around items-center py-1 my-1">
            <div className="w-1/5 items-center flex flex-row justify-around">
                <Link to = {`/event/${Id}`}><p>{eventname}</p></Link>
            </div>
            <div className="w-1/5 items-center flex flex-row justify-around"><p>{earliestdate}</p></div>
            <div className="w-1/5 items-center flex flex-row justify-around"><p>{latestdate}</p></div>
            <div className="w-1/5 items-center flex flex-row justify-around"><p>{price}</p></div>
            <div className="bg-green-200 rounded-md m-2 flex flex-row justify-center 
                items-center text-center h-1/2 hover:cursor-pointer hover:border-2 hover:border-black" onClick={handleAddClick}>
                <p>Add to favorites</p>
            </div>
            <div className="bg-red-200 rounded-md m-2 flex flex-row justify-center 
                items-center text-center h-1/2 hover:cursor-pointer hover:border-2 hover:border-black" onClick={handleDeleteClick}>
                <p>Remove from favorites</p> 
            </div>
        </div>
    );
}