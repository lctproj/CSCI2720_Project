const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/CSCI2720Project');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

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
      type: [String],
      default: [],
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
      type: String,
      required: [true, "eventId is required"],
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
      type: String,
      required: [true, "venueId is required"],
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
        "eventId": event.eventId,
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

app.get('/event/:eventId', async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const event = await Event.findOne({ eventId: eventId });
    console.log(event);
    const eventDate = await EventDate.findOne({ eventId: event.eventId });
    console.log(eventDate);
    event.eventDates = eventDate;
    const venue = await Venue.findOne({ venueId: event.venueId });
    console.log(venue);
    event.venueId = venue.venue;

    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    console.log('Error retrieving event:', error);
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

// Middleware function to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1]; // Extract the token from the "Bearer <token>" format

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'SECRET', (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const payload = { email: user.email, username: user.username, time: Date.now() };
    console.log(payload);

    const token = jwt.sign(payload, "SECRET", { expiresIn: '1h' });

    res.cookie('token', token, {
      path: '/',
      maxAge: 1 * 60 * 60 * 1000,
    });
    res.cookie('payload', JSON.stringify(payload), {
      path: '/',
      maxAge: 1 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'Login successful', username: username });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// Auto-login endpoint
app.get('/autoLogin', authenticateToken, (req, res) => {
  return res.sendStatus(200);
});

// Logout endpoint
app.get('/logout', authenticateToken, (req, res) => {
  res.clearCookie('token');
  res.clearCookie('payload');
  return res.sendStatus(200);
});

// Change password endpoint
app.put('/change-password', authenticateToken, async (req, res) => {
  try {
    // Code for changing password goes here
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'An error occurred while changing the password' });
  }
});

// Create user endpoint
app.post('/create-user', async (req, res) => {
  try {
    // Code for creating a new user goes here
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
});

// User data endpoint
app.post('/user-data', authenticateToken, async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'An error occurred while fetching user data' });
  }
});

app.get('/get-event-comments/:eventId', async (req, res) => {
  const eventId = req.params.eventId;
  try {
    const comment = await EventComment.find({ eventId: eventId });
    console.log(comment);
    if (comment) {
      res.json(comment);
    } else {
      res.status(404).json({ error: 'comment not found' });
    }
  } catch (error) {
    console.log('Error retrieving comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/get-venue-comments/:venueId', async (req, res) => {
  const venueId = req.params.venueId;
  try {
    const comment = await VenueComment.find({ venueId: venueId });
    console.log(comment);
    if (comment) {
      res.json(comment);
    } else {
      res.status(404).json({ error: 'comment not found' });
    }
  } catch (error) {
    console.log('Error retrieving comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = 8964;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})