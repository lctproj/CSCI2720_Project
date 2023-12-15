import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Comments from "./Comments";
import Map from "./Map";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Cookies from "js-cookie";
import '../../dist/output.css';
import { Link } from "react-router-dom";

function VenueDetails() {
    const { venueId } = useParams();
    const [venue, setVenue] = useState({});
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        fetchVenueDetails();
        checkFavoriteStatus();
    }, []);

    const fetchVenueDetails = async () => {
        try {
            const response = await fetch(
                `http://localhost:8964/venue/${venueId}`,
                { method: "GET" }
            );
            const data = await response.json();
            setVenue(data);
        } catch (error) {
            console.log("Error retrieving venue:", error);
        }
    };

    const addToFavorites = async (isAdd) => {
        try {
            console.log(Cookies.get("token"));
            const token = Cookies.get("token");
            const cookie = Cookies.get("payload");
            const payload = JSON.parse(cookie);

            const response = await fetch(
                "http://localhost:8964/favourite-venue",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        username: payload.username,
                        venueId: venueId,
                        IsAdd: isAdd,
                    }),
                }
            );

            if (response.status === 200) {
                setIsFavorite(isAdd);
                console.log(
                    `Venue ${isAdd ? "added to" : "removed from"} favorites`
                );
            } else {
                console.log(
                    `Error ${
                        isAdd ? "adding venue to" : "removing venue from"
                    } favorites:`,
                    response.statusText
                );
            }
        } catch (error) {
            console.log("Error adding venue to favorites:", error);
        }
    };

    const checkFavoriteStatus = async () => {
        try {
            const cookie = Cookies.get("payload");
            const payload = JSON.parse(cookie);
            const token = Cookies.get("token");
            console.log(payload);

            const response = await fetch("http://localhost:8964/user-data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ username: payload.username }),
            });

            if (response.ok) {
                const data = await response.json();
                const favVenue = data.favVenueId;
                console.log(favVenue);
                setIsFavorite(favVenue.includes(venueId) || favVenue != []);
                console.log(isFavorite);
            } else if (response.status === 401) {
                console.log("Unauthorized access");
            } else {
                console.log("Error retrieving user:", response.statusText);
            }
        } catch (error) {
            console.log("Error checking favorite status:", error);
        }
    };

    return (
        <div>
            <div className="flex items-center bg-blue-500 justify-between w-full gap-4 p-4 space-x-4">
            <button className="px-4 py-2 text-white bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600">
            <Link to={`/`}>Home</Link>
            </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <div className="lg:grid-cols-2">
            <h2 className="text-2xl font-bold mb-4">Venue Details</h2>
                <div>
                    <p className="text-black">Venue Name: {venue.venue}</p>
                </div>
                <div>
                    {isFavorite ? (
                        <button
                            onClick={() => addToFavorites(false)}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                        >
                            <Favorite className="text-white" />
                        </button>
                    ) : (
                        <button
                            onClick={() => addToFavorites(true)}
                            className="border border-blue-500 text-blue-500 px-4 py-2 rounded mt-4"
                        >
                            <FavoriteBorder className="text-blue-500" />
                        </button>
                    )}
                </div>

                <Map jsonData={venue} />
            </div>
            <div>
                <Comments Id={venue.venueId} isEvent={false} />
            </div>
        </div>
        </div>
    );
}

export default VenueDetails;
