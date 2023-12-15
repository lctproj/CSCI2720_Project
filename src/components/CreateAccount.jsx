import { useState, useEffect } from "react";

const CreateAccount = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        
        console.log("Creating account...");
        try {
            const response = await fetch("http://localhost:8964/create-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    email: email,
                }),
            });

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error creating account:", error);
        }

        // Reset form fields
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        window.location.href = "/signin";
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded shadow w-80">
                <h2 className="text-2xl mb-4">Create Account</h2>
                <form onSubmit={handleCreateAccount}>
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
                        <label className="block">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    <div className="mb-4">
                        <label className="block">Confirmed Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Create Account
                    </button>
                    <button
                        onClick={() => {window.location.href = "/signin";}}
                        className="text-blue-500 mt-2 underline"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;