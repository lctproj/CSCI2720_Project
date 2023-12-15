import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const Comments = ({ Id, isEvent }) => {
    const [comments, setComments] = useState([]);
    const [username, setUsername] = useState("");
    const [comment, setComment] = useState("");

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const token = Cookies.get("token"); // Retrieve the JWT token
            console.log(token);

            const url = isEvent
                ? `/get-event-comments/${Id}` // Call event comments API
                : `/get-venue-comments/${Id}`; // Call venue comments API

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
                },
            });

            if (response) {
                const data = await response.json();
                console.log(data);
                setComments(data);
            } else {
                console.error("Error fetching comments:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const url = isEvent
                ? `http://localhost:8964/add-event-comment/${Id}` // Call add event comment API
                : `http://localhost:8964/add-venue-comment/${Id}`; // Call add venue comment API

            const cookie = Cookies.get("payload");
            const payload = JSON.parse(cookie);
            const token = Cookies.get("token"); // Retrieve the JWT token
            console.log(token);

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
                },
                body: JSON.stringify({
                    username: payload.username,
                    commentText: comment,
                }),
            });

            if (response) {
                const data = await response.json();
                setComments([...comments, data]);
                setUsername("");
                setComment("");
            } else {
                console.error("Error submitting comment:", response.statusText);
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    return (
        <div>
            <h2>Comments</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Leave a comment"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                ></textarea>
                <br />
                <button type="submit">Submit</button>
            </form>
            {comments.map((comment) => (
                <div key={comment._id}>
                    <p>
                        {comment.username}: {comment.comment}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Comments;
