import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const Comments = ({ Id, isEvent }) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const token = Cookies.get("token");
            console.log(token);

            const url = isEvent
                ? `http://localhost:8964/get-event-comments/${Id}`
                : `http://localhost:8964/get-venue-comments/${Id}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
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
                ? `http://localhost:8964/add-event-comment/${Id}`
                : `http://localhost:8964/add-venue-comment/${Id}`;

            const token = Cookies.get("token");
            console.log(token);
            const cookie = Cookies.get("payload");
            console.log(cookie);
            const payload = JSON.parse(cookie);
            console.log(payload);
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: payload.username,
                    commentText: comment,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setComments([...comments, data]);
                setComment("");
            } else {
                console.error("Error submitting comment:", response.statusText);
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(event);
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
                    onKeyDown={handleKeyDown} // Bind Enter key to handleSubmit
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
