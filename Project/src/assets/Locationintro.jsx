import "./locationintro.css";
import React, {useState,useEffect } from "react"; 



export default function Locationintro(){
    const [slideIndex, setSlideIndex] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const images = [
    "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80",
    "https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    ];
    const handlePrevSlide = () => {
        setSlideIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
      };
    
      const handleNextSlide = () => {
        setSlideIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
      };
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
            <div>
                <h1>Hong Kong Cultural Centre (Foyer Exhibition Areas)</h1>
            </div>
            <div class = "intro">
                <p>There are 3 designated exhibition sites in the main foyer with spotlights and multi-configurations display panels for holding arts exhibitions*.
* If exhibition contains live demonstration, workshop, award ceremony and other activities, please hire the Exhibition Gallery.</p>
            </div>
            <div>
            <img src={images[slideIndex]} alt="Slideshow" />
         </div>
            <div>
            <button className="buttonleft" onClick={handlePrevSlide}>&#10094;</button>
        <button className="buttonright" onClick={handleNextSlide}>&#10095;</button>
            </div>
            <div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/150px-Google_Maps_Logo_2020.svg.png"/>
            </div>
            <div>
            <div className="header-bar">
            <div className="header-element" >
                <p id="event-name">Event Name</p>
                
            </div>
            <div className="header-element" >
                <p id="earliest-date">Earliest Date</p>
                
            </div>
            <div className="header-element" >
                <p id="latest-date">Latest Date</p>
                
            </div>
            <div className="header-element">
                <p id="price">Price(s) (in HKD)</p>
            </div>
        </div>
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
        
    );
}