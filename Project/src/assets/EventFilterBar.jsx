import React,{useState} from 'react';
import "./eventmain.css";
import "../App.css";
import { Link } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";

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
                <label htmlFor="earliest-date-filter" >Earliest date (no earlier than)</label>
                    <input type="date" id="earliest-date-filter" onInput={handleEarliestDateChange}/>
            </div>
            <div className="date-filter">
                <label htmlFor="latest-date-filter" >Latest date (no later than)</label>
                    <input type="date" id="latest-date-filter" onInput={handleLatestDateChange}/>
            </div>    
        </div>
    )

}
const PriceSlider = ({onPriceChange}) =>{
    const [upperBound,setUpperBound] = useState(3000);
    const handlePriceChange = (e) => {
        const value = e.target.value;
        onPriceChange(value); 
        setTimeout(()=>setUpperBound(value),  300);
    };

    return(
        <div className='price-slider'>
            <label htmlFor="pricerange" className="flex flex-col">Price Range (less than ${upperBound}) </label>
            <input type="range" min="0" max="3000" id="pricerange"  onInput={handlePriceChange}/>
        </div>
    )
}

const SearchEvents = ({ onClick })=>{
    return(
        <div className="search" onClick={ onClick }>
            <IoSearch aria-label="Search Events"/>
        </div>
    );
}

const GoToLocation = () =>{
    return(
        <div className = "go-to-location"> 
            <Link to = "/locationmain"> 
                Find by location
            </Link>
        </div>
    );
}

const sendSearchParams = async (params, onResult) => {
    try {
      const response = await fetch('http://localhost:8964/navbar-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        onResult(data);
      }
    } catch (error) {
      console.error('Error sending search inputs', error.message);
    }
  };



export default function EventFilterBar({onInputChange,onPriceChange,onEarliestDateChange,onLatestDateChange, searchParams, onResult}){
    const handleSearchClick = () => {
        sendSearchParams(searchParams, onResult);
    };

    return(
    
    <div className= "event-filter-bar">
        <NameFilter onInputChange={onInputChange}/>
        <PriceSlider onPriceChange={onPriceChange}  />
        <DateFilter onEarliestDateChange={onEarliestDateChange} onLatestDateChange={onLatestDateChange}/>
        <SearchEvents  onClick = {handleSearchClick} onResult={onResult}/>
        <GoToLocation />
        <div>
        <p id="username">{localStorage.getItem('user')}</p>
        </div>
    </div>
)
}

