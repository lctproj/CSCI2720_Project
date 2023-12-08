import React from 'react';
import "./locationmain.css";
import "../App.css";
import { Link } from 'react-router-dom';

const NameFilter = ({onInputChange}) => {
        const handleInputChange = (e) => {
            const value = e.target.value;
            onInputChange(value);
        };
        
        return(
            <div className="location-name-filter">
                <label htmlFor="locationname"  >Location name</label>
                <input type="text" id="location-name-search" 
                placeholder="Enter location name" className="location-name" onChange={handleInputChange}
                />
            </div>
    );

}

const NumberSlider = ({onNumberChange}) =>{
    const handleNumberChange = (e) => {
        const value = e.target.value;
        onNumberChange(value);
    };

    return(
        <div className='number-slider'>
            <label htmlFor="numberrange" className="flex flex-col">Number of events (less than ) </label>
            <input type="range" min="0" max="10" id="numberrange"  onInput={handleNumberChange}/>
        </div>
    )
}

const GoToEvents = () =>{
    return(
        <div className = "go-to-events"> 
            <Link to = "/eventmain"> 
                Find by events
            </Link>
        </div>
    );
}

export default function LocationFilterBar({onInputChange,onNumberChange}){
    return(
        
        <div className= "location-filter-bar">
            <NameFilter onInputChange={onInputChange}/>
            <NumberSlider onNumberChange={onNumberChange} />
            <GoToEvents />
            <div>
                <p id="username">Username</p>
            </div>
            <div>
                <img id="usericon" src="./free-user-icon-3296-thumb.png" alt="user icon" />
            </div>
        </div>
    )
}

