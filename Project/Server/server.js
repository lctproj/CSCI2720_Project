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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
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

  const Event = mongoose.model("Event", EventSchema);

  const DateSchema = new mongoose.Schema({
    indate: {
      type: [String],
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
  });
  
  const EventDate = mongoose.model('EventDate', DateSchema);

  const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Password is required"],
    },
    favVenue: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Venue',
    },
    favEvent: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Event',
    }
  });

  const User = mongoose.model("User", UserSchema);

  const EventCommentSchema = new mongoose.Schema({
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
    },
  });

  const EventComment = mongoose.model("EventComment", EventCommentSchema);

  const VenueCommentSchema = new mongoose.Schema({
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
    },
  });

  const VenueComment = mongoose.model("VenueComment", VenueCommentSchema);
  
  const readJsonFromFile = (filePath) => {
    try {
      const jsonData = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(jsonData);
    } catch (error) {
      console.error('Error reading JSON file:', error);
      return null;
    }
  };

  const eventsDataPath = './Data/events.json';
  const eventsData = readJsonFromFile(eventsDataPath);
  const VenueDataPath = './Data/venues.json';
  const VenueData = readJsonFromFile(VenueDataPath);
  const eventDateDataPath = './Data/eventDate.json';
  const eventDateData = readJsonFromFile(eventDateDataPath);


});

const server = app.listen(3000);