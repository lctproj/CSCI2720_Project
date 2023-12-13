import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import EventMain from './assets/EventMain';
import LocationMain from './assets/LocationMain';
//import { getLocationTitle, getEventTitle } from './api';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/create-account" element={<CreateAccount/>} />
          <Route path="/signin" element={<SignIn/>} />
          <Route path="/adminsignin" element={<AdminSignIn/>} />
          <Route path="/userhome" element={<UserHome/>} />
          <Route path="/changepw" element={<ChangePassword/>}/>
          <Route path="/eventmain" element={<EventMain/>} />
          <Route path="/locationmain" element={<LocationMain/>} />
        </Routes>
      </Router>
    );
  }
}
class Home extends React.Component {
    render() {
        return (
            <button class="text-white">
                <Link to="/signin">Login to start your account</Link>
            </button>
        );
    }
}
class CreateAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        };
      }
    

    handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    };
    
    handleSubmit = (event) => {
        event.preventDefault();
        
        const { username, email, password, confirmPassword } = this.state;
    
        if (password !== confirmPassword) {
          alert("Passwords do not match");
          return;
        }
        
        if (!this.validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        const userData = { username, email, password };
    
        fetch('http://localhost:8964/create-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
          .then((response) => {
            if (response.status == 409) {
                alert("Username already used");
            } else if (response.status == 200) {
                alert("User created successfully");
                window.location.href = "/signin";
            } else {
                alert("An error occurred while creating the user");
            }
          })
          .then(data => {
            console.log(data);
          })
          .catch(error => {
            console.log('Error creating user:', error);
            // Handle the error
          });


      };

    validateEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
    };

      
    render() {
        return (
            <>
            <form class="form" onSubmit={this.handleSubmit}>
                <Header header="Create Account" />
                <FlexColumn
                    label="Username"
                    placeholder="Enter your username"
                    name = "username"
                    handleChange={this.handleChange}
                    type = "text"
                />
                <FlexColumn
                    label="Email"
                    placeholder="Enter your email"
                    name = "email"
                    handleChange={this.handleChange}
                    type = "text"
                />
                <FlexColumn
                    label="Password"
                    placeholder="Enter your password"
                    name = "password"
                    handleChange={this.handleChange}
                    type = "password"
                />
                <FlexColumn
                    label="Confirmed Password"
                    placeholder="Enter your password again"
                    name = "confirmPassword"
                    handleChange={this.handleChange}
                    type = "password"
                />
                <div class="flex-row">
                    <Link to="/signin" class="span">
                        Sign In
                    </Link>

                    <button class="button-submit" type = "submit">Next</button>
                </div>
                <div class="flex-row">
                    <Link to="/adminsignin" class="span">
                        Admin Sign In
                    </Link>
                </div>
            </form>
            </>
        );
    }
}
class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username: '',
          password: '',
        };
      }
    

    handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    };
    
    handleSubmit = (event) => {
        event.preventDefault();
        
        const { username, password } = this.state;
    
        const userData = { username, password };
    
        fetch('http://localhost:8964/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
          .then((response)=> {

            if (response.status == 401 || response.status == 404) {
                alert("Invalid username or password");
            } else if (response.status == 200) {
                alert("Login successfully");
                return response.json();
            } else {
                alert("Unknown error");
            }
          })
          .then(data => {
            const user = data.username;
            localStorage.setItem('user', user);
            window.location.href = "/eventmain";
          })
          .catch(error => {
            console.error('Error login in:', error);
            // Handle the error
          });

          
      };
    render() {
        return (
            <>
            <form class="form" onSubmit = {this.handleSubmit}>
                <Header header="Sign In" />
                <FlexColumn
                    label="Username"
                    placeholder="Enter your username"
                    handleChange={this.handleChange}
                    type = "text"
                    name = "username"
                />
                <br></br>
                <FlexColumn
                    label="Password"
                    placeholder="Enter your password"
                    handleChange={this.handleChange}
                    type = "password"
                    name = "password"
                />
                <div class="flex-row">
                    <Link to="/create-account" class="span">
                        Create Account
                    </Link>

                    <button class="button-submit" type = "submit">Next</button>
                </div>
                <div class="flex-row">
                    <Link to="/adminsignin" class="span">
                        Admin Sign In
                    </Link>
                </div>
            </form>
            </>
        );
    }
}
class AdminSignIn extends React.Component {
  render() {
    return(
      <form className = "form">
        <Header header = "Admin Sign In"/>
        <FlexColumn label = "Username" placeholder = "Enter your username"/>
        <br></br>
        <FlexColumn label = "Password" placeholder = "Enter your password"/>
        <div class="flex-row">
        
        <Link to="/signin" class = "span">
        User Sign In
        </Link>
        <button class="button-submit">Next</button>
        </div>
      </form>
    );
  }
}
class FlexColumn extends React.Component {
    render() {
        return (
            <>
                <div class="flex-column">
                    <label>{this.props.label} </label>
                </div>
                <div class="inputForm">
                    <input
                        type={this.props.type}
                        class="input"
                        onKeyDown={this.handleKeyDown}
                        placeholder={this.props.placeholder}
                        onChange = {this.props.handleChange}
                        name = {this.props.name}
                    ></input>
                </div>
            </>
        );
    }
}
class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedLocation: false,
            expandedEvent: false,
        };
    }

    toggleLocation = () => {
        this.setState((prevState) => ({
            expandedLocation: !prevState.expandedLocation,
        }));
    };

    toggleEvent = () => {
        this.setState((prevState) => ({
            expandedEvent: !prevState.expandedEvent,
        }));
    };
    render() {
        const { expandedLocation, expandedEvent,userEmail } = this.state;

        const locationBoxClass = expandedLocation
            ? "location-box expanded"
            : "location-box";
        const eventBoxClass = expandedEvent
            ? "event-box expanded"
            : "event-box";
        return <h1 class="header">{this.props.header}</h1>;
    }
}
class UserHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedLocation: false,
            expandedEvent: false,
            userEmail: null,
            favVenue: null,
            favEvent: null,
        };
    }
    componentDidMount() {
        if (!this.state.userEmail) {
          this.fetchUserData();
        }
      }
      
      fetchUserData = async () => {
        try {
          const username = localStorage.getItem('user');
          const response = await fetch('http://localhost:8964/user-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
          });
      
          const data = await response.json();
          console.log(data);
      
          if (response.ok) {
            const { user } = data;
      
            if (user) {
              this.setState({
                userEmail: user.email,
                favVenue: user.favVenue,
                favEvent: user.favEvent,
              });
      
              this.fetchTitles();
            } else {
              console.error('Error fetching user data:', data.error);
            }
          } else {
            console.error('Error fetching user data:', data.error);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      
      fetchTitles = async () => {
        try {
          const { favVenue, favEvent } = this.state;
      
          const eventResponse = await fetch('http://localhost:8964/all-events');
          const eventData = await eventResponse.json();
          const venueResponse = await fetch('http://localhost:8964/all-venues');
          const venueData = await venueResponse.json();  
          if (eventResponse) {
           // const filteredEvents = eventData.filter((event) =>
        //favEvent.includes(event._id)
     // );
            //const eventTitles = filteredEvents.map((event) => event.name);
            const eventTitles = eventData.map((event) => event.name);
            this.setState({
              favEvent: eventTitles,
            });
          } else {
            console.error('Error fetching event data:', eventData.error);
          }
          if (venueResponse) {
        
            const venueTitles = venueData.map((venue) => venue.name);
            this.setState({
              favVenue: venueTitles,
            });
          } else {
            console.error('Error fetching venue data:', venueData.error);
        } }catch (error) {
          console.error('Error fetching event data:', error);
      };}
      componentDidMount() {
        this.fetchUserData(); 
      }

    toggleLocation = () => {
        this.setState((prevState) => ({
            expandedLocation: !prevState.expandedLocation,
        }));
    };

    toggleEvent = () => {
        this.setState((prevState) => ({
            expandedEvent: !prevState.expandedEvent,
        }));
    };

    handleHomeClick = () => {
        window.location.href = "/";
    };
    handleLogout = () => {
        window.location.href = "/signin";
    };
    handleChangepw = () => {
        window.location.href = "/changepw";
    };
    render() {
        const { expandedLocation, expandedEvent, userEmail, favVenue, favEvent } = this.state;

        const locationBoxClass = expandedLocation
            ? "location-box expanded"
            : "location-box";
        const eventBoxClass = expandedEvent
            ? "event-box expanded"
            : "event-box";

        return (
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
                        <span id="username">{localStorage.getItem('user')}</span>
                        <img
                            src="/src/assets/user-icon.svg"
                            alt="User Icon"
                            id="usericon"
                        />
                    </div>
                </div>
                <div class="backgruond">
                    <div class="content">
                        <h1 className="profile-heading">My Profile</h1>
                        <br></br>
                        <FlexColumn1
                            label="Email"
                            placeholder={ userEmail || "Loading..."}
                        />
                        <br></br>
                        <h2 className="profile-subheading">My Favorites</h2>
                        <div className={locationBoxClass}>
                            <div onClick={this.toggleLocation}>
                                <FlexColumn1
                                    label="Location"
                                    placeholder="Your favourite locations"
                                />
                            </div>
                            {expandedLocation && (
                                <div className="location-list">
                                   {favVenue.map((favVenue, index) => (
                                <FlexColumn2
                                key={index}
                                label={`Location ${index + 1}`}
                                placeholder={favVenue}
                                className="location-item"
                            
                                />
                            ))}
                            </div>
                        )}

                            <img
                                src="/src/assets/down-arrow.png"
                                alt="Down Arrow"
                                className={`arrow-icon ${
                                    expandedLocation ? "expanded" : ""
                                }`}
                            />
                        </div>
                        <br></br>
                        <div className={eventBoxClass}>
                            <div onClick={this.toggleEvent}>
                                <FlexColumn1
                                    label="Events"
                                    placeholder="Your favourite events"
                                />
                            </div>
                            {expandedEvent && (
                                <div className="event-list">
                                    {favEvent.map((favEvent, index) => (
                                <FlexColumn2
                                key={index}
                                label={`Event ${index + 1}`}
                                placeholder={favEvent}
                                className="event-item"
                                />
                            ))}
                            </div>
                        )}

                            <img
                                src="/src/assets/down-arrow.png"
                                alt="Down Arrow"
                                className={`arrow-icon ${
                                    expandedEvent ? "expanded" : ""
                                }`}
                            />
                        </div>
                        <button
                            class="button-submit1"
                            onClick={this.handleChangepw}
                        >
                            Change Password
                        </button>
                        <button
                            class="button-submit2"
                            onClick={this.handleLogout}
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
class FlexColumn1 extends React.Component {
    render() {
        return (
            <>
                <div className="flex-column1">
                    <label>{this.props.label}</label>
                </div>
                <div className="inputForm1">
                    <output
                        className={`input ${
                            this.props.placeholder ? "placeholder" : ""
                        }`}
                    >
                        {this.props.placeholder}
                    </output>
                </div>
            </>
        );
    }
}

class FlexColumn2 extends React.Component {
    render() {
        return (
            <>
                <div className="flex-column"></div>
                <div className="inputForm1">
                    <output
                        className={`input ${
                            this.props.placeholder ? "placeholder" : ""
                        }`}
                    >
                        {this.props.placeholder}
                    </output>
                </div>
            </>
        );
    }
}
class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username: localStorage.getItem('user'),
          password: '',
          newPassword: '',
          confirmPassword: '',
        };
      }
    

    handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    };
    
    handleSubmit = (event) => {
        event.preventDefault();
        
        const { username, password, newPassword, confirmPassword} = this.state;
    
        const userData = { username, password, newPassword};
        console.log(userData);
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
          }

        fetch('http://localhost:8964/change-password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
          .then((response)=> {

            if (response.status == 404) {
                alert("User not found");
            } else if (response.status == 200) {
                alert("Password changed successfully");
                window.location.href = "/eventmain";
            } else if (response.status == 401) {
                alert("Invalid current password");
            } else {
                alert("Unknown error");
            }
          })
          .then(data => {
     
          })
          .catch(error => {
            console.error('Error in changing password:', error);
            // Handle the error
          });

          
      };
    render() {
        return (
            <>
            <form class="form" onSubmit = {this.handleSubmit}>
                <Header header="Change Password" />
                <FlexColumn
                    label="Old Password"
                    placeholder="Enter your old password"
                    handleChange={this.handleChange}
                    name = "password"
                    type = "password"
                />
                <FlexColumn
                    label="New Password"
                    placeholder="Enter your new password"
                    handleChange={this.handleChange}
                    name = "newPassword"
                    type = "password"
                />
                <FlexColumn
                    label="Confirm New Password"
                    placeholder="Enter your new password again"
                    handleChange={this.handleChange}
                    name = "confirmPassword"
                    type = "password"
                />
                <div class="flex-row">
                    <Link to="/userhome" class="span">
                        back
                    </Link>
                    <button class="button-submit" type="submit">Confirm</button>
                </div>
                <div class="flex-row"></div>
            </form>
            </>
        );
    }
}
export default App;
