import "./eventmain.css";
import EventFilterBar from "./EventFilterBar.jsx";
import EventCard from "./EventCard.jsx";
import React, {useState,useEffect} from "react";
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


export default function EventMain (){
    useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch("http:/localhost:8964/all-events", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            const data = await response.json();
            setEvents(data);
        } catch (err) {
            return(
                <p>Error fetching events from database</p>
            )
        }
    };

    fetchData();
    }, []); //fetch data through the API, from the db

    const [searchInput,setInput]=useState('');
    const [maxPrice,setMaxPrice] = useState(750);
    const [earliestDate,setEarliestDate] = useState('');
    const [latestDate,setLatestDate] = useState('');
    const [category ,setCategory] = useState('');
    const [ascending,setAscending] = useState(true);
    const [events, setEvents] = useState([]);

    const handleSearchInput = (value) => {
        setInput(value);
    };

    const handlePriceChange = (value) => {
        setMaxPrice(value);
    }

    const getEarliestDate = async (event) => {
        try{
            const response = await fetch('http://localhost:8964/event-dates',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const eventDates = await response.json();
            const eventID = event._id;

            let corrEventinDate = eventDates.find(entry=>entry._id===eventID).indate;
            return corrEventinDate[0].splice(0,10).toString;
        }catch(err){
            return (
                <p>Error fetching earliest event date</p>
            )
        }

    };
  
    const getLatestDate = async (event) => {
        try{
            const response = await fetch('http://localhost:8964/event-dates',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const eventDates = await response.json();
            const eventID = event._id;

            let corrEventinDate = eventDates.find(entry=>entry._id===eventID).indate;
            return corrEventinDate[corrEventinDate.length-1].splice(0,10).toString;
        }catch(err){
            return (
                <p>Error fetching latest event date</p>
            )
        }

    };

    const handleEarliestDateChange = (value)=>{
        setEarliestDate(value);
    }

    const handleLatestDateChange = (value) =>{
        setLatestDate(value);
    }

//changes the sorting category
    const handleCategory = (value) => {
        if (value === category) {
            setAscending(!ascending);
        } else {
            setCategory(value);
            setAscending(true);
        }
    }

// cleans the 'price' property into an array of numbers
    const processedPrice=(string)=>{
        return string.replace(/$/g,'').split(',').map(price => Number(price));
    } 

        
    const filteredEvents = events.filter((event) =>
    event.titlee.toLowerCase().includes(searchInput.toLowerCase()) //filter by title
    ).filter((event) =>Math.max(...processedPrice(event.pricee))<maxPrice //filter by price
    ).filter((event) =>getEarliestDate(event)>earliestDate) // filter by earliest date
    .filter((event) =>getLatestDate(event)<latestDate) //filter by latest date
    .sort((a, b) => { //sorts the array
        let aValue, bValue;

        if (category === 'earliestdate') {
            aValue = getEarliestDate(a);
            bValue = getEarliestDate(b);
        } else if (category === 'latestdate') {
            aValue = getLatestDate(a);
            bValue = getLatestDate(b);
        } else if (category === 'price') {
            aValue = Math.min(...a.price); 
            bValue = Math.min(...b.price);  
        } else {
            aValue = a.eventname;
            bValue = b.eventname;
        }

        if (typeof aValue === 'string') {
            return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return ascending ? aValue - bValue : bValue - aValue;
    });

    

    return(
        <div className="event-main">
            <EventFilterBar onInputChange={handleSearchInput} onPriceChange={handlePriceChange} onEarliestDateChange={handleEarliestDateChange} onLatestDateChange={handleLatestDateChange}/>
            <HeaderBar handleCategory={handleCategory} category={category} ascending={ascending} />
            {filteredEvents.map((event, index) => (
                <EventCard
                key={index}
                id={event._id}
                eventname={event.eventname}
                earliestdate={getEarliestDate(event)}
                latestdate={getLatestDate(event)}
                price={event.price.toSorted((a, b) => a - b).toString()}
                />
            ))}
        </div>
    );

   
}