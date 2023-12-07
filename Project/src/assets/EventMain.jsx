import "./eventmain.css";
import EventFilterBar from "./EventFilterBar.jsx";
import mockEventData from "./mockeventdata.json"
import EventCard from "./EventCard.jsx";
import React, {useState} from "react";

const HeaderBar = () =>{
    return(
        <div className="header-bar">
            <div className="header-element"><p id="event-name">Event Name</p></div>
            <div className="header-element"><p id="earliest-date">Earliest Date</p></div>
            <div className="header-element"><p id="latest-date">Latest Date</p></div>
            <div className="header-element"><p id="price">Price</p></div>
            <div className="header-element"><p id="favorite">Favorite</p></div>
        </div>
    );
}



export default function EventMain (){
    const [searchInput,setInput]=useState('');
    const [maxPrice,setMaxPrice] = useState(750);
    
    const handleSearchInput = (value) => {
        console.log(value);
        setInput(value);
    };

    const handlePriceChange = (value) => {
        setMaxPrice(value);
    }

    const getEarliestDate = (dates) => {
        return Math.min(...dates);
    };
    
    const getLatestDate = (dates) => {
        return Math.max(...dates);
    };

   const filteredEvents = mockEventData.filter((event) =>
        event.eventname.toLowerCase().includes(searchInput.toLowerCase())
         ).filter((event) =>Math.max(...event.price)<maxPrice
        );

    return(
        <div className="event-main">
            <EventFilterBar onInputChange={handleSearchInput} onPriceChange={handlePriceChange}/>
            <HeaderBar/>
            {filteredEvents.map((event, index) => (
                <EventCard
                key={index}
                eventname={event.eventname}
                earliestdate={getEarliestDate(event.date)}
                latestdate={getLatestDate(event.date)}
                price={event.price.toSorted((a, b) => a - b).toString()}
                />
            ))}
        </div>
    );
}