import { useState, useEffect } from "react";
import '../../dist/output.css';


const SignIn = ({ setToggle }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        async function autoLogin() {
          try {
            const response = await fetch("http://localhost:8964/autoLogin", {
              method: "GET",
              credentials: "include",
            });
    
            if (response.ok) {
              window.location.href = "/";
            }
          } catch (error) {
            console.error("Error during auto-login:", error);
          }
        }
        autoLogin();
      }, []);

      const handleSignIn = async (e) => {
        e.preventDefault();
      
        try {
          const response = await fetch("http://localhost:8964/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Include credentials for sending cookies
            body: JSON.stringify({ username, password }),
          });
      
          if (response.status === 404 || response.status === 401) {
            alert("Invalid username or password."); // Display an alert for failed login
            window.location.href = "/signin";
          } else if (response.ok) {
              console.log("Login successful");
              window.location.href = "/";
          }
        } catch (error) {
          console.error("Error during sign-in:", error);
        }
      
        setUsername("");
        setPassword("");
      };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded shadow w-80">
                <h2 className="text-2xl mb-4">Sign In</h2>
                <form onSubmit={handleSignIn}>
                    <div className="mb-4">
                        <label className="block">Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => {window.location.href = "/createaccount";}}
                        className="text-blue-500 mt-2 underline"
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignIn;