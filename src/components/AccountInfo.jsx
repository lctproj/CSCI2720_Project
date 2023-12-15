import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function AccountInfo() {
    const [user, setUser] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkLoggedIn();
        fetchUsernameDetails();
    }, []);

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

    const fetchUsernameDetails = async () => {
        try {
          const cookie = Cookies.get("payload");
          const payload = JSON.parse(cookie);
          const token = Cookies.get("token"); // Retrieve the JWT token
          console.log(token);
      
          const response = await fetch("http://localhost:8964/user-data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`, // Include the JWT token in the Authorization header
            },
            body: JSON.stringify({ username: payload.username }),
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            setUser(data.user); // Assuming the user data is in the "user" property of the response
          } else if (response.status === 401) {
            // Handle unauthorized access
            console.log("Unauthorized access");
          } else {
            // Handle other response errors
            console.log("Error retrieving user:", response.statusText);
          }
        } catch (error) {
          console.log("Error retrieving user:", error);
        }
      };

    return (
        <div>
            <h2>User Details</h2>
            <p>Username: {user.username}</p>
        </div>
    );
}

export default AccountInfo;
