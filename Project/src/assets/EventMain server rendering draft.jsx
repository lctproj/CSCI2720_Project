import "./eventmain.css";
import EventFilterBar from "./EventFilterBar.jsx";
import EventCard from "./EventCard.jsx";
import React, {useState} from "react";
import { HiArrowsUpDown, HiOutlineArrowSmallUp , HiOutlineArrowSmallDown  } from "react-icons/hi2";


const HeaderBar = ({handleCategory,category, ascending}) =>{
    return(
        //for each element
        //,a click sets the category to its corresponding one
        //,and resets the sorting order to ascending and the arrow
        <div className="header-bar">
            <div className="header-element" onClick={() => handleCategory('eventname')}>
                <p id="event-name">Event Name</p>
                <ArrowSign value="eventname" category={category} ascending={ascending} />
            </div>
            <div className="header-element" onClick={() => handleCategory('earliestdate')}>
                <p id="earliest-date">Earliest Date</p>
                <ArrowSign value="earliestdate" category={category} ascending={ascending} />
            </div>
            <div className="header-element" onClick={() => handleCategory('latestdate')}>
                <p id="latest-date">Latest Date</p>
                <ArrowSign value="latestdate" category={category} ascending={ascending} />
            </div>
            <div className="header-element" onClick={() => handleCategory('price')}>
                <p id="price">Price</p>
                <ArrowSign value="price" category={category} ascending={ascending} />
            </div>
            <div className="header-element">
                <p id="favorite">Favorite</p>
            </div>
        </div>
    );
}


const ArrowSign = ({ category, value, ascending }) => {
    if (category === value) { //if the category matches
        return ascending ? <HiOutlineArrowSmallUp /> : <HiOutlineArrowSmallDown />;
    } //and 'ascending' is true, sort in ascending order, else descending
    return <HiArrowsUpDown />; //if the category does not match the current one, revert to an 'up-down' arrow
};


export default function EventMainDraft (){
    //search parameters
    const [searchInput,setInput]=useState('');
    const [maxPrice,setMaxPrice] = useState(750);
    const [earliestDate,setEarliestDate] = useState('');
    const [latestDate,setLatestDate] = useState('');

    //search results
    const [results,setResults] = useState(null);

    //sorting
    const [category ,setCategory] = useState('');
    const [ascending,setAscending] = useState(true);

    //input-related event handlers
    const handleSearchInput = (value) => {
        setInput(value);
    };

    const handlePriceChange = (value) => {
        setMaxPrice(value);
    }

    const handleEarliestDateChange = (value)=>{
        setEarliestDate(value);
    }

    const handleLatestDateChange = (value) =>{
        setLatestDate(value);
    }

    const searchParams = {
        "name" : searchInput,
        "price" : maxPrice,
        "earliestDate" : earliestDate,
        "latestDate" : latestDate
    }

//change search results
const handleResults = (results) => {
    setResults(results);
  };

//changes the sorting category
    const handleCategory = (value) => {
        if (value === category) {
            setAscending(!ascending);
        } else {
            setCategory(value);
            setAscending(true);
        }
    }

        
    const finalResult = results.sort((a, b) => { //sorts the array
        let aValue, bValue;

        if (category === 'earliestdate') {
            aValue = a.earliestDate;
            bValue = b.earliestDate;
        } else if (category === 'latestdate') {
            aValue = a.latestDate;
            bValue = b.latestDate;
        } else if (category === 'price') {
            aValue = Math.min(...a.price); 
            bValue = Math.min(...b.price);  
        } else {
            aValue = a.name;
            bValue = b.name;
        }

        if (typeof aValue === 'string') {
            return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return ascending ? aValue - bValue : bValue - aValue;
    });

    

    return(
        <div className="event-main">
            <EventFilterBar onInputChange={handleSearchInput} onPriceChange={handlePriceChange} 
                onEarliestDateChange={handleEarliestDateChange} onLatestDateChange={handleLatestDateChange} 
                searchParams={searchParams} onResult={handleResults}/>
            <HeaderBar handleCategory={handleCategory} category={category} ascending={ascending} />
            {finalResult.map((event, index) => (
                <EventCard
                key={index}
                id={event._id}
                eventname={event.eventname}
                earliestdate={event.earliestDate}
                latestdate={event.latestDate}
                price={event.price}
                />
            ))}
        </div>
    );

   
}