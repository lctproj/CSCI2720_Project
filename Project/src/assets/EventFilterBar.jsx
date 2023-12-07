import React from 'react';
import "./eventmain.css";
import "../App.css";

const NameFilter = ({onInputChange}) => {
        const handleInputChange = (e) => {
            const value = e.target.value;
            onInputChange(value);
        };
        
        return(
            <div className="event-name-filter">
                <label htmlFor="eventname"  >Event name</label>
                <input type="text" id="event-name-search" 
                placeholder="Enter event name" className="event-name" onChange={handleInputChange}
                />
            </div>
    );

}

const DateFilter = ({onEarliestDateChange,onLatestDateChange})=>{
    const handleEarliestDateChange = (e)=>{
        const value = e.target.value;
        onEarliestDateChange(value);
    }
  
    const handleLatestDateChange = (e)=>{
        const value = e.target.value;
        onLatestDateChange(value);
    }

    return(
        <div className='date'>
            <div className="date-filter">
                <label htmlFor="earliest-date-filter" >Earliest date</label>
                    <input type="date" id="earliest-date-filter" />
            </div>
            <div className="date-filter">
                <label htmlFor="earliest-date-filter" >Latest date</label>
                    <input type="date" id="latest-date-filter" />
            </div>    
        </div>
    )

}
const PriceSlider = ({onPriceChange}) =>{
    const handlePriceChange = (e) => {
        const value = e.target.value;
        onPriceChange(value);
    };

    return(
        <div className='price-slider'>
            <label htmlFor="pricerange" className="flex flex-col">Price Range </label>
            <input type="range" min="0" max="500" id="pricerange"  onInput={handlePriceChange}/>
        </div>
    )
}

const GoToLocation = () =>{
    return(
        <div className = "go-to-location"> Find by location</div>
    );
}

export default function EventFilterBar({onInputChange,onPriceChange,onEarliestDateChange,onLatestDateChange}){
    return(
        <div className= "event-filter-bar">
            <NameFilter onInputChange={onInputChange}/>
            <PriceSlider onPriceChange={onPriceChange} />
            <DateFilter onEarliestDateChange={onEarliestDateChange} onLatestDateChange={onLatestDateChange}/>
            <GoToLocation />
            <div>
                <p id="username">Username</p>
            </div>
            <div>
                <img id="usericon" src="./free-user-icon-3296-thumb.png" alt="user icon" />
            </div>
        </div>
    )
}

