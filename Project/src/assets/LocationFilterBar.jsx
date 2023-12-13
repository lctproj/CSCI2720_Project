import React,{useState} from 'react';
import "./locationmain.css";
import "../App.css";
import { Link } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";


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
    const [upperBound,setUpperBound] = useState(40);
    const handleNumberChange = (e) => {
        const value = e.target.value;
        onNumberChange(value);
        setTimeout(()=>setUpperBound(value),  300);
    };

    return(
        <div className='number-slider'>
            <label htmlFor="numberrange" className="flex flex-col">Number of events (less than {upperBound}) </label>
            <input type="range" min="0" max="20" id="numberrange"  onInput={handleNumberChange}/>
        </div>
    )
}

const SearchEvents = ({ onClick })=>{
    return(
        <div className="search" onClick={ onClick }>
            <IoSearch aria-label="Search locations"/>
        </div>
    );
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

const sendSearchParams = async (params, onResult) => {
    try {
      const response = await fetch('http://localhost:8964/navbar-venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        console.log(data);
        onResult(data);
      }
    } catch (error) {
      console.error('Error sending search inputs', error.message);
    }
  };


export default function LocationFilterBar({onInputChange,onNumberChange, searchParams, onResult}){
    const handleSearchClick = () => {
            sendSearchParams(searchParams, onResult);
        };
    
    return(
        <div className= "location-filter-bar">
            <NameFilter onInputChange={onInputChange}/>
            <NumberSlider onNumberChange={onNumberChange} />
            <SearchEvents  onClick = {handleSearchClick} onResult={onResult}/>
            <GoToEvents />
            <div className="go-to-userhome">
            <Link to="/userhome" style={{ display: "flex", alignItems: "center" }}>
            <div style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>
            <FaRegUserCircle />
            </div>
            <span>{localStorage.getItem("user")}</span>
            </Link>
            </div>
        </div>
    )
}

