import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editableUser, setEditableUser] = useState(null);
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = Cookies.get("token");
                const response = await fetch(
                    "http://localhost:8964/admin/all-users",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                setUsers(data);
                console.log(users);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleEditUser = (user) => {
        setEditableUser(user);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditableUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleExitEdit = () => {
        setEditableUser(null);
    };

    const handleSaveUser = async () => {
        try {
            const token = Cookies.get("token");
            const response = await fetch(
                `http://localhost:8964/admin/update-user/`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editableUser),
                }
            );
            if (response.ok) {
                const updatedUser = await response.json();
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === updatedUser._id ? updatedUser : user
                    )
                );
                setEditableUser(null);
            } else {
                throw new Error("Failed to update user");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const token = Cookies.get("token");
            const response = await fetch(
                `http://localhost:8964/admin/delete-user/${userId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                setUsers((prevUsers) =>
                    prevUsers.filter((user) => user._id !== userId)
                );
            } else {
                throw new Error("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleNewUserChange = (event) => {
        const { name, value } = event.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleCreateUser = async () => {
        try {
            const token = Cookies.get("token");
            const response = await fetch(
                "http://localhost:8964/admin/create-user",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(newUser),
                }
            );
            if (response.ok) {
                const createdUser = await response.json();
                setUsers((prevUsers) => [...prevUsers, createdUser]);
                setNewUser({
                    username: "",
                    email: "",
                    password: "",
                });
            } else {
                throw new Error("Failed to create user");
            }
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">User List</h2>
            {users.map((user) => (
                <div key={user._id} className="mb-4">
                    {editableUser && editableUser._id === user._id ? (
                        <div className="mb-2">
                            <input
                                type="text"
                                name="username"
                                value={editableUser.username}
                                onChange={handleInputChange}
                                className="border rounded px-2 py-1 mr-2"
                            />
                            <input
                                type="email"
                                name="email"
                                value={editableUser.email}
                                onChange={handleInputChange}
                                className="border rounded px-2 py-1 mr-2"
                            />
                            <input
                                type="text"
                                name="password"
                                value={editableUser.password}
                                onChange={handleInputChange}
                                className="border rounded px-2 py-1 mr-2"
                            />
                            <button
                                onClick={handleSaveUser}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Save
                            </button>
                            <button
                                onClick={handleExitEdit}
                                className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div>
                            <p>
                                <span className="font-bold">Username: </span>
                                {user.username}
                            </p>
                            <p>
                                <span className="font-bold">Email: </span>
                                {user.email}
                            </p>
                            <p>
                                <span className="font-bold">
                                    Hashed Password:{" "}
                                </span>
                                {user.password}
                            </p>
                            <button
                                onClick={() => handleEditUser(user)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded mt-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                    <hr className="my-4" />
                </div>
            ))}
            <div>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={handleNewUserChange}
                    className="border rounded px-2 py-1 mr-2"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    className="border rounded px-2 py-1 mr-2"
                />
                <input
                    type="text"
                    name="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    className="border rounded px-2 py-1 mr-2"
                />
                <button
                    onClick={handleCreateUser}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Create User
                </button>
            </div>
        </div>
    );
};

export default UserList;
