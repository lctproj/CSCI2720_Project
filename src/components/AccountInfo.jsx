import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function AccountInfo() {
    const [user, setUser] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showFavoriteEvents, setShowFavoriteEvents] = useState(false);
    const [showFavoriteVenues, setShowFavoriteVenues] = useState(false);

    useEffect(() => {
        checkLoggedIn();
        fetchUsernameDetails();
    }, []);

    const checkLoggedIn = () => {
        const cookie = Cookies.get("payload");
        if (cookie) {
            const payload = JSON.parse(cookie);
            setIsLoggedIn(true);
        } else {
            console.log('The "payload" cookie does not exist');
        }
    };

    const fetchUsernameDetails = async () => {
        try {
            const cookie = Cookies.get("payload");
            const payload = JSON.parse(cookie);
            const token = Cookies.get("token");

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
                setUser(data.user);
                console.log(data.user);
            } else if (response.status === 401) {
                console.log("Unauthorized access");
            } else {
                console.log("Error retrieving user:", response.statusText);
            }
        } catch (error) {
            console.log("Error retrieving user:", error);
        }
    };

    const handleLogout = async () => {
        try {
            const token = Cookies.get("token");
            const response = await fetch("http://localhost:8964/logout", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setIsLoggedIn(false);
                setUser({});
                Cookies.remove("token");
                Cookies.remove("payload");
                console.log("Logged out successfully");
                window.location.href = "/";
            } else {
                console.log("Error logging out:", response.statusText);
            }
        } catch (error) {
            console.log("Error logging out:", error);
        }
    };
    return (
        <div>
            <h2>User Details</h2>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            {isLoggedIn && (
                <div>
                    <button onClick={handleLogout}>Logout</button>
                    <button onClick={() => {window.location.href = "/changepassword";}}>Change Password</button>
                </div>
            )}
            <div>
                <button
                    onClick={() => setShowFavoriteEvents(!showFavoriteEvents)}
                >
                    <h3>Favorite Events</h3>
                </button>
                {user.favEvent !== undefined && user.favEvent.length > 0 ? (
                    <>
                        {showFavoriteEvents && (
                            <ul>
                                {user.favEvent.map((event) => (
                                    <li key={event}>{event}</li>
                                ))}
                            </ul>
                        )}
                    </>
                ) : (
                    <p>No favorite events found.</p>
                )}
            </div>
            <div>
                <button
                    onClick={() => setShowFavoriteVenues(!showFavoriteVenues)}
                >
                    <h3>Favorite Venues</h3>
                </button>
                {user.favVenue !== undefined && user.favVenue.length > 0 ? (
                    <>
                        {showFavoriteVenues && (
                            <ul>
                                {user.favVenue.map((venue) => (
                                    <li key={venue}>{venue}</li>
                                ))}
                            </ul>
                        )}
                    </>
                ) : (
                    <p>No favorite venues found.</p>
                )}
            </div>
        </div>
    );
}

export default AccountInfo;
