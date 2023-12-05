import "./eventmain.css";
import EventFilterBar from "./EventFilterBar.jsx";

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
    return(
        <div className="event-main">
            <EventFilterBar />
            <HeaderBar/>
        </div>
    );
}