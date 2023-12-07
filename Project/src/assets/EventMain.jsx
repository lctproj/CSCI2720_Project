import "./eventmain.css";
import EventFilterBar from "./EventFilterBar.jsx";
import mockEventData from "./mockeventdata.json"
import EventCard from "./EventCard.jsx";
import React, {useState} from "react";
import { HiArrowsUpDown, HiOutlineArrowSmallUp , HiOutlineArrowSmallDown  } from "react-icons/hi2";




const HeaderBar = ({handleCategory}) =>{
    return(
        <div className="header-bar">
            <div className="header-element" onClick={()=>handleCategory('name')}><p id="event-name">Event Name</p></div>
            <div className="header-element" onClick={()=>handleCategory('earliestdate')}><p id="earliest-date">Earliest Date</p></div>
            <div className="header-element" onClick={()=>handleCategory('latestdate')} ><p id="latest-date">Latest Date</p></div>
            <div className="header-element" onClick={()=>handleCategory('price')}><p id="price">Price</p></div>
            <div className="header-element"><p id="favorite">Favorite</p></div>
        </div>
    );
}



export default function EventMain (){
    const [searchInput,setInput]=useState('');
    const [maxPrice,setMaxPrice] = useState(750);
    const [earliestDate,setEarliestDate] = useState('');
    const [latestDate,setLatestDate] = useState('');
    const [category ,setCategory] = useState('');
    const [ascending,setAscending] = useState(true);

    const handleSearchInput = (value) => {
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

    const handleEarliestDateChange = (value)=>{
        setEarliestDate(value);
    }

    const handleLatestDateChange = (value) =>{
        setLatestDate(value);
    }

    const handleCategory = (value) => {
        console.log(value);
        setCategory(value);
        setAscending(!ascending);
    }

   const filteredEvents = mockEventData.filter((event) =>
        event.eventname.toLowerCase().includes(searchInput.toLowerCase())
         ).filter((event) =>Math.max(...event.price)<maxPrice
        );

    

    return(
        <div className="event-main">
            <EventFilterBar onInputChange={handleSearchInput} onPriceChange={handlePriceChange} onEarliestDateChange={handleEarliestDateChange} onLatestDateChange={handleLatestDateChange}/>
            <HeaderBar handleCategory={handleCategory}/>
            {filteredEvents.map((event, index) => (
                <EventCard
                key={index}
                eventname={event.eventname}
                earliestdate={getEarliestDate(event.date)}
                latestdate={getLatestDate(event.date)}
                price={event.price.toSorted((a, b) => a - b).toString()}
                />
            )).sort((a, b) => {
        if (typeof a[category] === 'string') {
            return ascending ? a[category].localeCompare(b[category]) : b[category].localeCompare(a[category]);
        }
        return ascending ? a[category] - b[category] : b[category] - a[category];
    });}
        </div>
    );
}