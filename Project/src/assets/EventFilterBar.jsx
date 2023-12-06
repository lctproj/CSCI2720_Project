import React from 'react';
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import "./eventmain.css";
import "../App.css";

const EventNameFilter = () => {
    return(
            <div className="event-name-filter">
                <label htmlFor="eventname"  >Event name</label>
                <input type="text" id="event-name-search" placeholder="Enter event name" className="event-name"/>
            </div>
    );
}

const PriceSlider = () =>{
    return(
        <div className='price-slider'>
            <label htmlFor="pricerange" className="flex flex-col">Price Range</label>
            <input type="range" min="0" max="500" id="pricerange" />
        </div>
    )
}

const GoToLocation = () =>{
    return(
        <div className = "go-to-location"> Find by location</div>
    );
}

const Search  = () =>{
    return(
        <div className = "search"> 
            <HiOutlineMagnifyingGlass />
        </div>
    );
}

export default function EventFilterBar(){
    return(
        <div className= "event-filter-bar">
            <EventNameFilter />
            <PriceSlider />
            <GoToLocation />
            <Search />
            <div>
                <p id="username">Username</p>
            </div>
            <div>
                <img id="usericon" src="./free-user-icon-3296-thumb.png" alt="user icon" />
            </div>
        </div>
    )
}

