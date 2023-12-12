const express = require('express');
const cors = require('cors');
const cleanseData = require('./cleanseData.js')
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/CSCI2720Project');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

const app = express();
app.use(cors());
app.use(bodyParser.json());

db.once('open', () => {
  console.log("Connection is open...");
  cleanseData.initDatabase();

  // DB Schema
  const VenueSchema = new mongoose.Schema({
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    venueId: {
      type: Number,
      required: [true, "Venue ID is required"],
      unique: true,
    },
    venue: {
      type: String,
      required: [true, "Venue name is required"],
    },
  });

  const Venue = mongoose.model("Venue", VenueSchema);

  const DateSchema = new mongoose.Schema({
    indate: {
      type: [String],
    },
    eventId: {
      type: String,
      required: true,
    },
  });
  
  const eventDate = mongoose.model('eventDate', DateSchema);

  const EventSchema = new mongoose.Schema({
    cat1: {
      type: String,
      required: true,
    },
    cat2: {
      type: String,
      required: true,
    },
    venueId: {
      type: String,
      required: true,
    },
    enquiry: {
      type: String,
      required: true,
    },
    fax: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    saleDate: {
      type: Date,
      required: true,
    },
    interbook: {
      type: String,
      required: true,
    },
    eventId: {
      type: String,
      required: true,
    },
    prices: {
      type: [Number],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    predate: {
      type: String,
      required: true,
    },
    progtime: {
      type: String,
      required: true,
    },
    agelimit: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    tagenturl: {
      type: String,
      required: true,
    },
    remark: {
      type: String,
      required: true,
    },
    presenterorg: {
      type: String,
      required: true,
    },
  });

  const Event = mongoose.model("event", EventSchema);
  
});

const server = app.listen(3000);