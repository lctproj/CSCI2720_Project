const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/CSCI2720Project');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

const VenueSchema = new mongoose.Schema({
  latitude: {
      type: String,
  },
  longitude: {
      type: String,
  },
  venueId: {
      type: String,
      required: [true, "Venue ID is required"],
      unique: true,
  },
  venue: {
      type: String,
      required: [true, "Venue name is required"],
  },
});

const Venue = mongoose.model("Venues", VenueSchema);

const DateSchema = new mongoose.Schema({
  indate: {
      type: [String],
  },
  eventId: {
      type: String,
      required: [true, "eventId is required"],
      unique: true
  },
});

const EventDate = mongoose.model('EventDates', DateSchema);

const EventSchema = new mongoose.Schema({
  cat1: {
      type: String,
      default: '',
  },
  cat2: {
      type: String,
      default: '',
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
      required: [true, "eventId is required"],
      unique: true
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
  eventDates: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EventDates',
  },
  venueId: {
      type: String,
      required: [true, "venueId is required"]
  },
});

const Event = mongoose.model("Events", EventSchema);

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
      required: [true, "Email is required"],
  },
  favVenue: {
      type: [String],
      required: true
  },
  favEvent: {
      type: [String],
      required: true
  }
});

const User = mongoose.model("Users", UserSchema);

const EventCommentSchema = new mongoose.Schema({
  eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Events',
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

const EventComment = mongoose.model("EventComments", EventCommentSchema);

const VenueCommentSchema = new mongoose.Schema({
  venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venues',
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

const VenueComment = mongoose.model("VenueComments", VenueCommentSchema);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/all-events', async (req, res) => {
  try {
    const events = await Event.find();
    const allEvents = [];
    for (let event of events) {
      const eventDates = await EventDate.findOne({ eventId: event.eventId });

      const earliestEventDate = eventDates.indate[0].split('T')[0];

      const latestEventDate = eventDates.indate[eventDates.indate.length - 1].split('T')[0];

      const oneEvent = {
        "id": event.eventId,
        "name": event.title,
        "earliestDate": earliestEventDate,
        "latestDate": latestEventDate,
        "price": (event.prices[0] === null) ? "0" : event.prices.sort((a, b) => a - b).toString()
      }

      allEvents.push(oneEvent);
    }
    res.json(allEvents);
  } catch (error) {
    console.log('Error retrieving events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/navbar-events', async (req, res) => {
  const { name, priceRange, earliestDate, latestDate } = req.body;
  console.log(req.body);

  let query = {};

  if (name) {
    query.title = { $regex: name, $options: 'i' };
  }

  try {
    const events = await Event.find(query);
    let filteredEvents = [];

    for (let event of events) {
      const eventdates = await EventDate.findOne({ eventId: event.eventId });
      const earliestEventDate = eventdates.indate[0].split('T')[0];
      const latestEventDate = eventdates.indate[eventdates.indate.length - 1].split('T')[0];

      if (earliestDate && earliestDate >= earliestEventDate) {
        continue;
      }

      if (latestDate && latestDate <= latestEventDate) {
        continue;
      }

      if (priceRange && (Math.min(...event.prices) > Number(Math.max(...priceRange)) || Math.max(...event.prices) < Number(Math.min(...priceRange)))) {
        continue;
      }

      let eventObj = {
        eventId: event.eventId,
        name: event.title,
        price: (event.prices[0] === null) ? "0" : event.prices.sort((a, b) => a - b).toString(),
        earliestDate: earliestEventDate,
        latestDate: latestEventDate,
      };

      filteredEvents.push(eventObj);
    }

    res.json(filteredEvents);
    console.log(filteredEvents);
    return;
  } catch (err) {
    console.error("Error fetching relevant events", err);
    res.sendStatus(500);
  }
});

app.get('/all-venues', async (req, res) => {
  try {
    const venues = await Venue.find();
    const allVenues = [];
    for (let venue of venues) {
      const events = await Event.find({ venueId: venue.venueId });

      const oneVenue = {
        "venueId": venue.venueId,
        "name": venue.venue,
        "eventnum": (events === null ? 0 : events.length)
      }

      allVenues.push(oneVenue);
    }
    res.json(allVenues);
  } catch (error) {
    console.log('Error retrieving venues:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/venue/:venueId', async (req, res) => {
  const venueId = req.params.venueId;
  try {
    const venue = await Venue.findOne({ venueId: venueId });
    console.log(venue);
    if (venue) {
      res.json(venue);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    console.log('Error retrieving event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const port = 8964;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})