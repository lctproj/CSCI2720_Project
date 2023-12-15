import React, { useEffect, useState } from "react";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/admin/all-users", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                const data = await response.json();
                setUsers(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>User List</h2>
            {users.map((user) => (
                <div key={user._id}>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <p>Hashed Password: {user.email}</p>
                    <hr />
                </div>
            ))}
        </div>
    );
};

export default UserList;
