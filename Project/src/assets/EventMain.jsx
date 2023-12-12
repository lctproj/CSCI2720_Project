import "./eventmain.css";
import EventFilterBar from "./EventFilterBar.jsx";
import EventCard from "./EventCard.jsx";
import React, {useState,useEffect } from "react";
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
    //search parameters
    const [searchInput,setInput]=useState('');
    const [maxPrice,setMaxPrice] = useState(750);
    const [earliestDate,setEarliestDate] = useState('');
    const [latestDate,setLatestDate] = useState('');

    //search results
    const [fetched, setFetched] = useState([]);
    const [display, setDisplay] = useState([]);

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
    setDisplay(results);
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

    useEffect(() => {
        const fetchInitial = async () => {
          try {
            const response = await fetch('http://localhost:8964/all-events',{
                method:'GET'
            }); 
            const data = await response.json();
            setFetched(data); 
          } catch (error) {
            console.error('Failed to fetch events:', error);
          }
        };
    
        fetchInitial();
      }, []);

        
    useEffect(() => {
        if (fetched.length>0) {
          const sortedResults = [...fetched].sort((a, b) => {
            let aValue, bValue;
    
            switch (category) {
              case 'earliestdate':
                aValue = new Date(a.earliestDate);
                bValue = new Date(b.earliestDate);
                break;
              case 'latestdate':
                aValue = new Date(a.latestDate);
                bValue = new Date(b.latestDate);
                break;
              case 'price':
                aValue = a.price; 
                bValue = b.price;
                break;
              case 'eventname':
              default:
                aValue = a.name
                bValue = b.name
                break;
            }
    
            if (ascending) {
              return aValue < bValue ? -1 : (aValue > bValue ? 1 : 0);
            } else {
              return aValue > bValue ? -1 : (aValue < bValue ? 1 : 0);
            }
          });
    
          setDisplay(sortedResults);
        }
      }, [category, ascending, fetched]);
    

    return(
        <div className="event-main">
            <EventFilterBar onInputChange={handleSearchInput} onPriceChange={handlePriceChange} 
                onEarliestDateChange={handleEarliestDateChange} onLatestDateChange={handleLatestDateChange} 
                searchParams={searchParams} onResult={handleResults}/>
            <HeaderBar handleCategory={handleCategory} category={category} ascending={ascending} />
            {display.length === 0 ? (
            <div>Loading or no results...</div>
            ) : (
            display.map((event, index) => (
                <EventCard
                key={index}
                id={event._id}
                eventname={event.eventname}
                earliestdate={event.earliestDate}
                latestdate={event.latestDate}
                price={event.price}
                />
            ))
        )}
        </div>
    );

   
}