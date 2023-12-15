import React from "react";
import { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Range } from "react-range";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
function Home() {
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchVenueQuery, setSearchVenueQuery] = useState("");
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [venues, setVenues] = useState([]);
    const [filteredVenues, setFilteredVenues] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [tolPriceRange, setTolPriceRange] = useState([0, 100]);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    });
    const [isEvent, setIsEvent] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleDateRangeClick = () => {
        setDatePickerVisible(!datePickerVisible);
    };

    const handleDateRangeChange = (ranges) => {
        setDateRange(ranges.selection);
    };

    const handlePriceRangeChange = (range) => {
        setPriceRange(range);
    };

    const handleIsEvent = () => {
        setIsEvent(!isEvent);
    };

    const listCookies = () => {
        const cookies = document.cookie.split(";");
      
        if (cookies.length === 0) {
          console.log("No cookies found.");
          return;
        }
      
        console.log("List of cookies:");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          console.log(cookie);
        }
      };
      

    const checkLoggedIn = () => {
        const cookie = Cookies.get("payload");
        console.log(cookie);
        if (cookie) {
            const payload = JSON.parse(cookie);
            console.log(payload);
            setIsLoggedIn(true);
            // Use the payload as needed
        } else {
            console.log('The "payload" cookie does not exist');
        }
    };

    useEffect(() => {
        listCookies();
        checkLoggedIn();
        initEventData();
        initVenueData();
    }, []);

    const initEventData = async () => {
        try {
            const response = await fetch("http://localhost:8964/all-events", {
                method: "GET",
            });
            const data = await response.json();
            console.log(data);
            setEvents(data);
            setFilteredEvents(data);

            // Calculate min and max prices from the events data
            let prices = [];
            data.map((event) => {
                let numericArray = event.price.split(",").map(Number);
                prices = prices.concat(numericArray);
            });
            console.log("prices: ", prices);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            setTolPriceRange([minPrice, maxPrice]);
            setPriceRange([minPrice, maxPrice]);
        } catch (error) {
            console.error("Error fetching event data:", error);
        }
    };

    const initVenueData = async () => {
        try {
            const response = await fetch("http://localhost:8964/all-venues", {
                method: "GET",
            });
            const data = await response.json();
            setVenues(data);
            setFilteredVenues(data);
        } catch (error) {
            console.error("Error fetching venue data:", error);
        }
    };

    const fetchEventData = async () => {
        try {
            const response = await fetch(
                "http://localhost:8964/navbar-events",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: searchQuery,
                        priceRange: priceRange,
                        earliestDate: dateRange.startDate,
                        latestDate: dateRange.endDate,
                    }),
                }
            );
            const data = await response.json();
            setVenues(data);
            setFilteredEvents(data);
        } catch (error) {
            console.error("Error fetching event data:", error);
        }
    };

    const handleSearch = async () => {
        const filtered = events.filter(
            (event) =>
                event.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                event.price >= Math.min(...priceRange) &&
                event.price <= Math.max(...priceRange) &&
                event.date >= dateRange.startDate &&
                event.date <= dateRange.endDate
        );
        setFilteredEvents(filtered);

        // Call fetchEventData to fetch data with the updated search criteria
        await fetchEventData();
    };

    const handleVenueSearch = async () => {
        const filtered = venues.filter((venue) =>
            venue.name.toLowerCase().includes(searchVenueQuery.toLowerCase())
        );
        setFilteredVenues(filtered);
    };

    // Event
    if (isEvent) {
        return (
            <div className="p-4">
                <div className="flex items-center justify-between w-full gap-4 mb-16">
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search events..."
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="relative">
                            <button
                                onClick={handleDateRangeClick}
                                className="px-4 py-2 text-black bg-gray-200 rounded-lg focus:outline-none"
                            >
                                {dateRange.startDate.toDateString()} -{" "}
                                {dateRange.endDate.toDateString()}
                            </button>
                            {datePickerVisible && (
                                <div className="absolute z-10 mt-2">
                                    <DateRangePicker
                                        ranges={[dateRange]}
                                        onChange={handleDateRangeChange}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            <label htmlFor="priceRange" className="text-black">
                                Price Range:
                            </label>
                            <div className="flex items-center">
                                <Range
                                    step={1}
                                    min={tolPriceRange[0]}
                                    max={tolPriceRange[1]}
                                    values={priceRange}
                                    onChange={handlePriceRangeChange}
                                    renderTrack={({ props, children }) => (
                                        <div
                                            {...props}
                                            className="h-2 bg-gray-300 w-64"
                                        >
                                            {children}
                                        </div>
                                    )}
                                    renderThumb={({ props }) => (
                                        <div
                                            {...props}
                                            className="h-6 w-6 rounded-full bg-white shadow-md"
                                        />
                                    )}
                                />
                                <output className="ml-2 text-black">
                                    {priceRange[0]} - {priceRange[1]}
                                </output>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 text-white bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600"
                        >
                            Search
                        </button>
                        <button
                            onClick={handleIsEvent}
                            className="px-4 py-2 text-white bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600"
                        >
                            Find by Venue
                        </button>
                        {isLoggedIn ? (
                            <button className="px-4 py-2 text-white bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600">
                                <Link to={`/info/`}>My Account</Link>
                            </button>
                        ) : (
                            <button className="px-4 py-2 text-white bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600">
                                <Link to={`/account`}>Login</Link>
                            </button>
                        )}
                    </div>
                </div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="text-black">Event Name</th>
                            <th className="text-black">Price</th>
                            <th className="text-black">Earliest Date</th>
                            <th className="text-black">Latest Date</th>
                        </tr>
                    </thead>
                    {filteredEvents.length !== 0 ? (
                        <tbody>
                            {filteredEvents.map((event) => (
                                <tr key={event.eventId}>
                                    <td className="text-black">
                                        <Link to={`/event/${event.eventId}`}>
                                            {event.name}
                                        </Link>
                                    </td>
                                    <td className="text-black">
                                        {event.price}
                                    </td>
                                    <td className="text-black">
                                        {event.earliestDate}
                                    </td>
                                    <td className="text-black">
                                        {event.latestDate}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td className="text-black">No events found</td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>
        );
    }

    // Venue
    return (
        <div className="p-4">
            <div className="flex items-center justify-between w-full gap-4 mb-16">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        value={searchVenueQuery}
                        onChange={(e) => setSearchVenueQuery(e.target.value)}
                        placeholder="Search venues..."
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleVenueSearch}
                        className="px-4 py-2 text-white bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600"
                    >
                        Search
                    </button>
                    <button
                        onClick={handleIsEvent}
                        className="px-4 py-2 text-white bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600"
                    >
                        Find by Event
                    </button>
                    <button className="px-4 py-2 text-white bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600">
                        <Link to={`/account`}>Login</Link>
                    </button>
                </div>
            </div>
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="text-black">Venue Name</th>
                        <th className="text-black">Number of Events</th>
                    </tr>
                </thead>
                {filteredVenues.length !== 0 ? (
                    <tbody>
                        {filteredVenues.map((venue) => (
                            <tr key={venue.venueId}>
                                <td className="text-black">
                                    <Link to={`/venue/${venue.venueId}`}>
                                        {venue.name}
                                    </Link>
                                </td>
                                <td className="text-black">{venue.eventnum}</td>
                            </tr>
                        ))}
                    </tbody>
                ) : (
                    <tbody>
                        <tr>
                            <td className="text-black">No events found</td>
                        </tr>
                    </tbody>
                )}
            </table>
        </div>
    );
}

export default Home;
