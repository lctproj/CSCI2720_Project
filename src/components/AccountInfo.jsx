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
        <div className="p-8 bg-gray-300">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-3xl font-bold mb-6">User Details</h2>
                <p className="mb-4">
                    <span className="font-bold">Username:</span> {user.username}
                </p>
                <p className="mb-6">
                    <span className="font-bold">Email:</span> {user.email}
                </p>
                {isLoggedIn && (
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={handleLogout}
                            className="bg-darkBlue-500 hover:bg-darkBlue-500 text-white rounded-md px-6 py-3 transition duration-200"
                        >
                            Logout
                        </button>
                        <button
                            onClick={() => {
                                window.location.href = "/changepassword";
                            }}
                            className="bg-blue-500 hover:bg-blue-500 text-white rounded-md px-6 py-3 transition duration-200"
                        >
                            Change Password
                        </button>
                    </div>
                )}
                <div className="mb-8">
                    <button
                        onClick={() =>
                            setShowFavoriteEvents(!showFavoriteEvents)
                        }
                        className="bg-blue-500 hover:bg-blue-500 text-white rounded-md px-6 py-3 transition duration-200 flex items-center justify-between"
                    >
                        <h3 className="text-lg font-bold mr-2">
                            Favorite Events
                        </h3>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 transform ${
                                showFavoriteEvents ? "rotate-90" : "rotate-0"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                    {user.favEvent !== undefined && user.favEvent.length > 0 ? (
                        <>
                            {showFavoriteEvents && (
                                <ul className="mt-4">
                                    {user.favEvent.map((event) => (
                                        <li key={event} className="mb-2">
                                            {event}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    ) : (
                        <p className="mt-4">No favorite events found.</p>
                    )}
                </div>
                <div>
                    <button
                        onClick={() =>
                            setShowFavoriteVenues(!showFavoriteVenues)
                        }
                        className="bg-blue-500 hover:bg-blue-500 text-white rounded-md px-6 py-3 transition duration-200 flex items-center justify-between"
                    >
                        <h3 className="text-lg font-bold mr-2">
                            Favorite Venues
                        </h3>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 transform ${
                                showFavoriteVenues ? "rotate-90" : "rotate-0"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                    {user.favVenue !== undefined && user.favVenue.length > 0 ? (
                        <>
                            {showFavoriteVenues && (
                                <ul className="mt-4">
                                    {user.favVenue.map((venue) => (
                                        <li key={venue} className="mb-2">
                                            {venue}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    ) : (
                        <p className="mt-4">No favorite venues found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AccountInfo;
