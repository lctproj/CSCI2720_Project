import './locationmain.css';
import React from 'react';
import {Link} from 'react-router-dom';

export default function LocationCard({id, locationname, number ,username}) {
  
    const handleAddClick = async () => {     
        //extract event details and format into JSON
        const favoriteLoc ={
            "id":id, 
            "username":username,
            "IsAdd":true
        }

            try{
                const response = await fetch('http://localhost:8964/favourite-venue',{ 
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(favoriteLoc)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Venue added to favorites:', result);
                } else {
                    throw new Error(`HTTP error: ${response.status}`);
                }
            }catch(err){
                console.error('Error adding location to favorites:', err);
            }
        }
    
        const handleDeleteClick = async () => {     
            //extract event details and format into JSON
            const favoriteLoc ={
                "venueId":id, 
                "username":username,
                "IsAdd":false
            }
    
                try{
                    const response = await fetch('http://localhost:8964/favourite-venue',{ 
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(favoriteLoc)
                    });
    
                    if (response.ok) {
                        const result = await response.json();
                        console.log('Venue deleted from favorites:', result);
                    } else {
                        throw new Error(`HTTP error: ${response.status}`);
                    }
                }catch(err){
                    console.error('Error deleting location to favorites:', err);
                }
            }
  
            let Id=Number(id);

    return (
        <div className="event-card">
            <div className="location-element" style={{width:'30%'}}>
            <Link to = {`/venue/${Id}`}><p>{locationname}</p></Link>
            </div>
            <div className="location-element"style={{width:'30%'}}><p>{number}</p></div>
            <div className="add-button" onClick={handleAddClick}><p>Add to favorites</p></div>
            <div className="delete-button" onClick={handleDeleteClick}><p>Remove from favorites</p> </div>
        </div>
    );
}