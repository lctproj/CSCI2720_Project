import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const Comments = ({ eventId }) => {
    const [comments, setComments] = useState([]);
    const [username, setUsername] = useState("");
    const [comment, setComment] = useState("");
    const [cookies] = useCookies(["data"]);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/api/comments/${eventId}`);
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`/api/comments/${eventId}`, {
                username,
                comment,
            });
            setComments([...comments, response.data]);
            setUsername("");
            setComment("");
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    return (
        <div>
            <h2>Comments</h2>
            {comments.map((comment) => (
                <div key={comment._id}>
                    <p>
                        {comment.username}: {comment.comment}
                    </p>
                </div>
            ))}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Your username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
                <br />
                <textarea
                    placeholder="Leave a comment"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                ></textarea>
                <br />
                <button type="submit">Submit</button>
            </form>
            {cookies.data && <p>Cookie Data: {cookies.data}</p>}
        </div>
    );
};

export default Comments;
