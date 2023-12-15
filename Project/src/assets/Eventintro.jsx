import "./eventintro.css";
import React, {useState,useEffect } from "react"; 

export default function Eventintro(){
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
      };
    
      const handleAddComment = () => {
        if (newComment.trim() !== "") {
          setComments((prevComments) => [...prevComments, newComment]);
          setNewComment("");
        }
      };
    return(
        <div class="background">
                <div class="navbar">
                    <div id="website-name">event.com</div>
                    <button class="button-home">
                        <img
                            src="/src/assets/home-icon.svg"
                            alt="Home Icon"
                            id="homeicon"
                        />
                    </button>
                </div>
                <div class="top-bar">
                    <div class="user-details">
                        <span id="username">&lt;username&gt;</span>
                        <img
                            src="/src/assets/user-icon.svg"
                            alt="User Icon"
                            id="usericon"
                        />
                    </div>
                    
                </div>
                <div><h1>Calligraphy Training Course</h1>
                <div>
                    <p>
                    Date: 2 Jul to 31 Dec 2023 (Every Sun) 5:00pm-7:00pm (Except 1/10, 22/10, 5/11, 12/11, 19/11, 26/11, 24/12) <br/>
                    Duration:  The concert will run for about 1 hours 40 minutes without intermission.<br/>
                    Price(s): $380, $280, $180, $120<br/>
                    Tel: 9799 7614<br/>
                    Enquiry Email: swspl@lcsd.gov.hk<br/>
                    URL: http://www.oratorio.org.hk/<br/>
                    Ticket Agent URL: http://www.lcsd.gov.hk/en/ticket/index.html<br/>
                    </p>
                </div>
                <div>
                <hr></hr>
        <h2 class="comment">Add your comment</h2>
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
        <input
          type="text"
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Add a comment"
        />
        <button class= "comment" onClick={handleAddComment}>Add Comment</button>
                </div>
                </div>
                </div>
    );
}