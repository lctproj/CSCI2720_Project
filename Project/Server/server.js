const express = require('express');
const cors = require('cors');
const cleanseData = require('./cleanseData.js')
const fs = require('fs')
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
      required: [true, "eventId is required"],
    },
  });

  const EventDate = mongoose.model('EventDate', DateSchema);

  const EventSchema = new mongoose.Schema({
    cat1: {
      type: String,
      required: '',
    },
    cat2: {
      type: String,
      required: '',
    },
    eventDate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EventDate',
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
    },
    enquiry: {
      type: String,
      default: '',
    },
    fax: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    saledate: {
      type: String,
      default: '',
    },
    interbook: {
      type: String,
      default: '',
    },
    eventId: {
      type: String,
      required: true,
    },
    prices: {
      type: [Number],
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    predate: {
      type: String,
      default: '',
    },
    progtime: {
      type: String,
      default: '',
    },
    progtime: {
      type: String,
      default: '',
    },
    agelimit: {
      type: String,
      default: '',
    },
    price: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    tagenturl: {
      type: String,
      default: '',
    },
    remark: {
      type: String,
      default: '',
    },
    presenterorg: {
      type: String,
      default: '',
    },
  });

  const Event = mongoose.model("Event", EventSchema);

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
  console.log(eventsData);
  const VenueDataPath = './Data/venues.json';
  const VenueData = readJsonFromFile(VenueDataPath);
  console.log(VenueData);
  const eventDateDataPath = './Data/eventDates.json';
  const eventDateData = readJsonFromFile(eventDateDataPath);
  console.log(eventDateData);

  const saveVenueData = async (Venue, VenueData) => {
    try {
      for (const element of VenueData) {
        const venue = new Venue(element);
        await venue.save();
      }
    } catch (error) {
      console.log("Failed to save new venue", error);
    }
  };
  
  const saveEventDateData = async (EventDate, eventDateData) => {
    try {
      for (const element of eventDateData) {
        const eventDate = new EventDate(element);
        await eventDate.save();
      }
    } catch (error) {
      console.log("Failed to save new event date", error);
    }
  };
  
  const saveEventData = async (Event, EventDate, Venue, eventsData) => {
    try {
      for (const element of eventsData) {
        const event = new Event(element);
  
        const venue = await Venue.findOne({ venueId: event.venueId });
        if (venue) {
          event.venueId = venue._id;
        }
  
        const dates = await EventDate.find({ eventId: event.eventId });
        if (dates.length > 0) {
          event.eventDate = dates[0]._id;
        }
  
        await event.save();
      }
    } catch (error) {
      console.log("Failed to save new event", error);
    }
  };
  
  // Usage example
  saveVenueData(Venue, VenueData);
  saveEventDateData(EventDate, eventDateData);
  saveEventData(Event, EventDate, Venue, eventsData);

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

});

const server = app.listen(3000);