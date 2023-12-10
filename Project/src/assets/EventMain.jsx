import "./eventmain.css";
import EventFilterBar from "./EventFilterBar.jsx";
import EventCard from "./EventCard.jsx";
import React, {useState,useEffect} from "react";
import { HiArrowsUpDown, HiOutlineArrowSmallUp , HiOutlineArrowSmallDown  } from "react-icons/hi2";




const HeaderBar = ({handleCategory,category, ascending}) =>{
    return(
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
    if (category === value) {
        return ascending ? <HiOutlineArrowSmallUp /> : <HiOutlineArrowSmallDown />;
    }
    return <HiArrowsUpDown />;
};


export default function EventMain (){
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
        if (value === category) {
            setAscending(!ascending);
        } else {
            setCategory(value);
            setAscending(true);
        }
    }

    const processedPrice=(string)=>{
        return string.replace(/$/g,'').split(',').map(price => Number(price));
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http:/localhost:8964/all-events", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
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
    }, []);


        
        const filteredEvents = events.filter((event) =>
        event.titlee.toLowerCase().includes(searchInput.toLowerCase())
        ).filter((event) =>Math.max(...processedPrice(event.pricee))<maxPrice
        ).sort((a, b) => {
            let aValue, bValue;

            if (category === 'earliestdate') {
                aValue = getEarliestDate(a.date);
                bValue = getEarliestDate(b.date);
            } else if (category === 'latestdate') {
                aValue = getLatestDate(a.date);
                bValue = getLatestDate(b.date);
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
                eventname={event.eventname}
                earliestdate={getEarliestDate(event.date)}
                latestdate={getLatestDate(event.date)}
                price={event.price.toSorted((a, b) => a - b).toString()}
                />
            ))}
        </div>
    );

   
}