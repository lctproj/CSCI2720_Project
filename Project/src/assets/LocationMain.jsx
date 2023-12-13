import "./locationmain.css";
import LocationFilterBar from "./LocationFilterBar.jsx";
import LocationCard from "./LocationCard.jsx";
import React, {useState, useEffect} from "react";
import { HiArrowsUpDown, HiOutlineArrowSmallUp , HiOutlineArrowSmallDown  } from "react-icons/hi2";

 


const HeaderBar = ({handleCategory,category, ascending}) =>{
    return(
        <div className="header-bar">
            <div className="header-element" onClick={() => handleCategory('locationname')}>
                <p id="location-name">Location Name</p>
                <ArrowSign value="locationname" category={category} ascending={ascending} />
            </div>
            <div className="header-element" onClick={() => handleCategory('number')}>
                <p id="number">Number</p>
                <ArrowSign value="number" category={category} ascending={ascending} />
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


export default function LocationMain (){
    const [searchInput,setInput]=useState('');
    const [maxNumber,setMaxNumber] = useState(50);

    //search results
    const [fetched, setFetched] = useState(false);
    const [display, setDisplay] = useState([]);

    const [category ,setCategory] = useState('');
    const [ascending,setAscending] = useState(true);

    const handleSearchInput = (value) => {
        setInput(value);
    };

    const handleNumberChange = (value) => {
        setMaxNumber(value);
    }

    const handleCategory = (value) => {
        if (value === category) {
            setAscending(!ascending);
        } else {
            setCategory(value);
            setAscending(true);
        }
    }

    const searchParams = {
        "name" : searchInput,
        "maxnum" : maxNumber
    }

    //change search results
    const handleResults = (results) => {
        setDisplay(results);
      };

      const fetchInitial = async () => {
        try {
          const response = await fetch('http://localhost:8964/all-venues',{
              method:'GET'
          }); 
          const data = await response.json();
         // console.log('Fetched data:', data); 
          setFetched(true); 
          setDisplay(data);
        } catch (error) {
          console.error('Failed to fetch venue:', error);
        }
      };
  
      if(!fetched){
        fetchInitial();
      }

      
  useEffect(() => {
      if (fetched) {
        const sortedResults = [...display].sort((a, b) => {
          let aValue, bValue;
  
          switch (category) {
            case 'eventnum':
              aValue = a.eventnum; 
              bValue = b.eventnum; 
              break;
            case 'name':
            default:
              aValue = a.name || '';
              bValue = b.name || '';
              break;
          }
  
          if (ascending) {
            if(typeof aValue !== 'number'){
              return aValue.localeCompare(bValue);
            }
            return aValue - bValue;
          } else {
            if(typeof aValue !== 'number'){
              return bValue.localeCompare(aValue);
            }
            return bValue - aValue;
          }
        });
  
        setDisplay(sortedResults);
      }
    }, [category, ascending,fetched,display]);
  
    

    return(
        <div className="location-main">
            <LocationFilterBar onInputChange={handleSearchInput} onNumberChange={handleNumberChange} 
             searchParams={searchParams} onResult={handleResults}/>
            <HeaderBar handleCategory={handleCategory} category={category} ascending={ascending} />
            {display.length === 0 ? (
            <div className="location-element">No results...</div>
            ) : (
            display.map((location) => {
              console.log('LocationCard props:', location.eventnum);
            return (
                <LocationCard
                key={location.venueId}
                locationname={location.name}
                number={location.eventnum}
                />);
            })
            )}
        </div>
    );
}