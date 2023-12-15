import EventFilterBar from "./EventFilterBar.jsx";
import EventCard from "./EventCard.jsx";
import React, {useState,useEffect } from "react";
import { HiArrowsUpDown, HiOutlineArrowSmallUp , HiOutlineArrowSmallDown  } from "react-icons/hi2";


const HeaderBar = ({handleCategory,category, ascending}) =>{
    return(
        //for each element
        //,a click sets the category to its corresponding one
        //,and resets the sorting order to ascending and the arrow
        <div className="bg-gray-200 flex justify-around p-1">
            <div className="flex justify-around w-1/5 items-center hover:cursor-pointer hover:border-black" onClick={() => handleCategory('eventname')}>
                <p id="event-name">Event Name</p>
                <ArrowSign value="eventname" category={category} ascending={ascending} />
            </div>
            <div className="flex justify-around w-1/5 items-center hover:cursor-pointer hover:border-black" onClick={() => handleCategory('earliestdate')}>
                <p id="earliest-date">Earliest Date</p>
                <ArrowSign value="earliestdate" category={category} ascending={ascending} />
            </div>
            <div className="flex justify-around w-1/5 items-center hover:cursor-pointer hover:border-black" onClick={() => handleCategory('latestdate')}>
                <p id="latest-date">Latest Date</p>
                <ArrowSign value="latestdate" category={category} ascending={ascending} />
            </div>
            <div className="flex justify-around w-1/5 items-center hover:cursor-pointer hover:border-black" onClick={() => handleCategory('price')}>
                <p id="price">Price(s) (in HKD)</p>
                <ArrowSign value="price" category={category} ascending={ascending} />
            </div>
            <div className="flex justify-around w-1/5 items-center hover:cursor-pointer hover:border-black">
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
    const [fetched, setFetched] = useState(false);
    const [display, setDisplay] = useState([]);

    //sorting
    const [category ,setCategory] = useState('eventname');
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
          const response = await fetch('http://localhost:8964/all-events', {
            method: 'GET'
          });
          const data = await response.json();
          // console.log('Fetched data:', data);
          setFetched(true);
          setDisplay(data);
        } catch (error) {
          console.error('Failed to fetch events:', error);
        }
      };
    
      if (!fetched) {
        fetchInitial();
      }
    }, [fetched]); 
 
    //change search results
    const handleResults = (results) => {
        setDisplay(results);
      };    
      
    useEffect(() => {
        if (fetched) {
          const sortedResults = [...display].sort((a, b) => {
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
                aValue = parseInt(Math.max(...a.price).eventnum, 10);
                bValue =  parseInt(Math.max(...b.price).eventnum, 10);
                break;
              case 'eventname':
              default:
                aValue = a.name.replace(/^\W+/, '');
                bValue = b.name.replace(/^\W+/, '');
                break;
            }
    
            if (ascending) {
              if (Number(aValue) && Number(bValue)) {
                return Number(aValue) - Number(bValue);
              } else {
                return a.name.localeCompare(b.name);
              }
            } else {
              if (Number(aValue) && Number(bValue)) {
                return Number(bValue) - Number(aValue);
              } else {
                return b.name.localeCompare(a.name);
              }
            }
          });
    
          setDisplay(sortedResults);
        }
      }, [category, ascending]);
    

    return(
        <div className="w-full h-full sticky"  >
            <EventFilterBar onInputChange={handleSearchInput} onPriceChange={handlePriceChange} 
                onEarliestDateChange={handleEarliestDateChange} onLatestDateChange={handleLatestDateChange} 
                searchParams={searchParams} onResult={handleResults}/>
            <HeaderBar handleCategory={handleCategory} category={category} ascending={ascending} />
            {display.length === 0 ? (
            <div className="w-1/5 items-center flex justify-around">No results...</div>
            ) : (
             
              display.map((event) => {
                return(
                  <EventCard
                  key={event.id}
                  eventname={event.name}
                  earliestdate={event.earliestDate}
                  latestdate={event.latestDate}
                  price={event.price}
                  />);
              })
            
        )}
        </div>
    );

   
}
