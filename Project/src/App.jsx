import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';



class App extends React.Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/create-account" element={<CreateAccount/>} />
          <Route path="/signin" element={<SignIn/>} />
          <Route path="/adminsignin" element={<AdminSignIn/>} />
        </Routes>
      </Router>
    );
  }
}
class Home extends React.Component {
  render() {
    return (
      <button class = "button-home">
        <Link to="/signin">
        Login to start your account
        </Link>
      </button>

    );
  }
}

class CreateAccount extends React.Component {
  render() {
    return (
        
        <form class = "form">
        <Header header = "Create Account"/>
        <FlexColumn label = "Username" placeholder = "Enter your username"/>
        <FlexColumn label = "Email" placeholder = "Enter your email"/>
        <FlexColumn label = "Password" placeholder = "Enter your password"/>
        <FlexColumn label = "Confirmed Password" placeholder = "Enter your password again"/>
        <div class="flex-row">
        
        <Link to="/signin" class = "span">
        Sign In
        </Link>
        
        <button class="button-submit">Next</button>
        </div>
        <div class="flex-row">
        <Link to="/adminsignin" class = "span">
        Admin Sign In
        </Link>
        </div>
        </form>
    );
  }
}
class SignIn extends React.Component {
  render() {
    return(
      <form class = "form">
        <Header header = "Sign In"/>
        <FlexColumn label = "Username" placeholder = "Enter your username"/>
        <br></br>
        <FlexColumn label = "Password" placeholder = "Enter your password"/>
        <div class="flex-row">
        
        <Link to="/create-account" class = "span">
        Create Account
        </Link>
        
        <button class="button-submit">Next</button>
        </div>
        <div class="flex-row">
        <Link to="/adminsignin" class = "span">
        Admin Sign In
        </Link>
        </div>
      </form>
    );
  }
}

class AdminSignIn extends React.Component {
  render() {
    return(
      <form class = "form">
        <Header header = "Admin Sign In"/>
        <FlexColumn label = "Email" placeholder = "Enter your email"/>
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
      <label>{this.props.label} </label></div>
      <div class="inputForm">
        <input type="text" class="input" onKeyDown = {this.handleKeyDown} placeholder={this.props.placeholder}></input>
      </div>
      </>
      
    );
  }
}

class Header extends React.Component {
  render() {
    return (
      <h1 class="header">{this.props.header}</h1>
    );
  }
}
export default App;
