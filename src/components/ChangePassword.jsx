import { useState } from "react";
import Cookies from "js-cookie";
import '../../dist/output.css';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("New password and confirm password do not match.");
            return;
        }

        try {
            const cookie = Cookies.get("payload");
            const payload = JSON.parse(cookie);
            const token = Cookies.get("token");

            const response = await fetch("http://localhost:8964/change-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ username: payload.username, password: currentPassword, newPassword: confirmPassword }),
            });

            if (response.status === 401) {
                alert("Invalid current password."); // Display an alert for invalid current password
            } else if (response.ok) {
                alert("Password changed successfully."); // Display a success message
                window.location.reload(); // Reload the page to update components with new credentials
                window.location.href = "/info";
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (error) {
            console.error("Error during password change:", error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded shadow w-80">
                <h2 className="text-2xl mb-4">Change Password</h2>
                <form onSubmit={handleChangePassword}>
                    <div className="mb-4">
                        <label className="block">Current Password:</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">Confirm Password:</label>
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
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
