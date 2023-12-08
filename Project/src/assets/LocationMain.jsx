import "./locationmain.css";
import LocationFilterBar from "./LocationFilterBar.jsx";
import mockLocations from "./mockLocations.json"
import LocationCard from "./LocationCard.jsx";
import React, {useState} from "react";
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

   const filteredLocations = mockLocations.filter((location) =>
        location.locationname.toLowerCase().includes(searchInput.toLowerCase())
         ).filter((location) =>location.events.length<maxNumber
        ).sort((a, b) => {
            let aValue, bValue;

            if (category === 'locationname') {
                aValue = a.locationname;
                bValue = b.locationname;  
            } else {
                aValue = a.events.length;
                bValue = b.events.length;
            }

            if (typeof aValue === 'string') {
                return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            return ascending ? aValue - bValue : bValue - aValue;
        });

    

    return(
        <div className="location-main">
            <LocationFilterBar onInputChange={handleSearchInput} onNumberChange={handleNumberChange} />
            <HeaderBar handleCategory={handleCategory} category={category} ascending={ascending} />
            {filteredLocations.map((location, index) => (
                <LocationCard
                key={index}
                locationname={location.locationname}
                number={location.events.length}
                />
            ))}
        </div>
    );
}