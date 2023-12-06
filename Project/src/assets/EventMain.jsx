import "./eventmain.css";
import EventFilterBar from "./EventFilterBar.jsx";
import mockEventData from "./mockeventdata.json"
import EventCard from "./EventCard.jsx";

const HeaderBar = () =>{
    return(
        <div className="header-bar">
            <div className="header-element"><p id="event-name">Event Name</p></div>
            <div className="header-element"><p id="earliest-date">Earliest Date</p></div>
            <div className="header-element"><p id="latest-date">Latest Date</p></div>
            <div className="header-element"><p id="price">Price</p></div>
            <div className="header-element"><p id="favorite">Favorite</p></div>
        </div>
    );
}



export default function EventMain (){
    const getEarliestDate = (dates) => {
        return Math.min(...dates);
    };
    
    const getLatestDate = (dates) => {
        return Math.max(...dates);
    };

    return(
        <div className="event-main">
            <EventFilterBar />
            <HeaderBar/>
            {mockEventData.map((event, index) => (
                <EventCard
                key={index}
                eventname={event.eventname}
                earliestdate={getEarliestDate(event.date)}
                latestdate={getLatestDate(event.date)}
                price={event.price}
                />
            ))}
        </div>
    );
}