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
        </Routes>
      </Router>
    );
  }
}
class Home extends React.Component {
  render() {
    return (

      <p>Hello world</p>
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
        <span class="span">Sign In</span>
        <button class="button-submit">Next</button>
        </div>
        <div class="flex-row">
        <span class="span">Admin Sign In</span>
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
        <input type="text" class="input" placeholder={this.props.placeholder}></input>
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
