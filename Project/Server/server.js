const express = require('express');
const cors = require('cors');
const fs = require('fs')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/CSCI2720Project');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log("Connection is open...");

// DB Schema
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venues',
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
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Venue',
  },
  favEvent: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Event',
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
const userDataPath = './Data/users.json';
const userData = readJsonFromFile(userDataPath);
console.log(userData);

const saveVenueData = (Venue, VenueData) => {
  try {
    for (const element of VenueData) {
      const venue = new Venue(element);
      venue.save();
    }
  } catch (error) {
    console.log("Failed to save new venue", error);
  }
};

const saveEventDateData = (EventDate, eventDateData) => {
  try {
    for (const element of eventDateData) {
      const eventDate = new EventDate(element);
      eventDate.save();
    }
  } catch (error) {
    console.log("Failed to save new event date", error);
  }
};

const saveEventData = async (Event, Venue, eventsData) => {
  try {
    for (const element of eventsData) {
      let venuetype = await Venue.findOne({ venueId: element.venueid })
      let eventDate = await EventDate.findOne({ eventId: element.eventId })
      element.venueId = venuetype._id;
      element.eventDates = eventDate._id;
      const event = new Event(element);
      event.save();
    }
  } catch (error) {
    console.log("Failed to save new event data", error);
  }
};

const saveUserData = (User, UserData) => {
  try {
    for (const element of UserData) {
      const user = new User(element);
      user.save();
    }
  } catch (error) {
    console.log("Failed to save new user", error);
  }
};

const selectTop10Location = async () => {
  const venueResults = await Venue.aggregate([
    {
      $lookup: {
        from: "Events",
        localField: "venueId",
        foreignField: "venueid",
        as: "events"
      }
    },
    {
      $addFields: {
        eventCount: { $size: "$events" }
      }
    },
    {
      $sort: { eventCount: -1, venue: 1 }
    },
    {
      $limit: 10
    },
    {
      $project: {
        _id: 1,
        latitude: 0,
        longitude: 0,
        venueId: 0,
        venue: 0,
        events: 0
      }
    }
  ]);

  const Top10LocationId = venueResults.map((venue) => venue._id);
  await Venue.deleteMany({ _id: { $nin: Top10LocationId } });
  await Event.deleteMany({ venueId: { $nin: Top10LocationId } });

  const eventResults = await Event.find({});
  const selectedEvent = eventResults.map((event) => event.eventId);
  await EventDate.deleteMany({ eventId: { $nin: selectedEvent } });
};

const preprocessing = async () => {
  await saveVenueData(Venue, VenueData);
  await saveEventDateData(EventDate, eventDateData);
  await saveEventData(Event, Venue, eventsData);
  await saveUserData(User, userData);
  await selectTop10Location();
};

preprocessing();
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/all-events', async (req, res) => {
  try {
    const events = await Event.find();
    const allEvents = [];
    for (let event of events) {
      const eventDates = await EventDate.findOne({ eventId: event.eventId });

      const earliestEventDate =  eventDates.indate[0].split('T')[0];

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

app.get('/event/:eventId', async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const event = await Event.find({ eventId: eventId });

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
  const { name, price, earliestDate, latestDate } = req.body;

  let query = {}

  if (name) {
    query.title = { $regex: name, $options: 'i' }
  }

  try {
    const events = await Event.find(query);
    let filteredEvents = [];

    for (let event of events) {
     const eventdates = await EventDate.findOne({ eventId: event.eventId });
      const earliestEventDate = eventdates.indate[0].split('T')[0];
      const latestEventDate = eventdates.indate[eventdates.indate.length - 1].split('T')[0];

      if (earliestDate && earliestDate > earliestEventDate) {
        continue;
      }

      if (latestDate && latestDate < latestEventDate) {
        continue;
      }
 
      const maxPrice = Math.max(...event.prices);
      if (price && maxPrice >= price) {
        continue;
      }

      let eventObj = {
        "eventId": event.eventId,
        "name": event.title,
        "price": (!event.prices || event.prices.length === 0 || event.prices[0] === null) ? [0] : event.prices.sort((a, b) => a - b),
      "earliestDate": earliestEventDate,
        "latestDate": latestEventDate
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
      const events = await Event.find({ venueId: venue._id });

      const oneVenue = {
        "id": venue.venueId,
        "name": venue.venue,
        "eventnum": (events===null?0:events.length)
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
    const venue = await Venue.find({ venueId: venueId });

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
app.post('/navbar-venues', async (req, res) => {
  const { name, maxnum } = req.body;
  console.log(req.body);
  let query = {}

  if (name) {
    query.venue = { $regex: name, $options: 'i' }
  }

  try {
    const venues = await Venue.find(query);
    let filteredVenues = [];

    for (let venue of venues) {
      const events = await Event.find({ venue: venue._id });

      const eventnum = events.length;
      if (maxnum && eventnum < maxnum) {
        continue;
      }

      let venueObj = {
        "venueId": venue.venueId,
        "name": venue.venue,
        "eventnum": Number(eventnum)
      };

      filteredVenues.push(venueObj);
    }
    res.json(filteredVenues);
    return;

  } catch (err) {
    console.error("Error fetching relevant venues", err);
    res.status(500).json({ message: "Error fetching relevant venues" });
  }

});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;


    const user = await User.findOne({ username: username });
    console.log(user);
    username_to_front = user.username;
    console.log(username_to_front);
    if (Array.isArray(user) && array.length) {
      return res.status(404).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }


    res.status(200).json({ username: username_to_front });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

app.put('/change-password', async (req, res) => {
  try {
    const { username, password, newPassword } = req.body;
    console.log(req.body);
    const existingUser = await User.findOne({ username: username });
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    existingUser.password = hashedPassword;
    await existingUser.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'An error occurred while changing the password' });
  }
});

app.post('/create-user', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
});

app.post('/user-data', async (req, res) => {
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

app.post('/favourite-venue', async (req, res) => {
  try {
    const { username, venueId, IsAdd } = req.body;

    // Find the user by username
    const user = await User.findOne({ username: username });

    const venue = await Venue.findOne({ venueId: venueId });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    if (IsAdd) {
      const isFavorite = user.favVenue.includes(venue._id);

      if (isFavorite) {
        return res.status(400).json({ error: 'Venue already in favorites' });
      }

      user.favVenue.push(venue._id);
    } else {
      // Remove the venue from the user's favorites
      user.favVenue.pull(venue._id);
    }

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Favorite venue updated successfully' });
  } catch (error) {
    console.error('Error updating favorite venue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/favourite-event', async (req, res) => {
  try {
    const { username, eventId, IsAdd } = req.body;

    const user = await User.findOne({ username: username });

    const event = await Event.findOne({ eventId: eventId });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (IsAdd) {
      const isFavorite = user.favEvent.includes(event._id);

      if (isFavorite) {
        return res.status(400).json({ error: 'Venue already in favorites' });
      }

      user.favEvent.push(event._id);
    } else {
      user.favEvent.pull(event._id);
    }

    await user.save();

    res.status(200).json({ message: 'Favorite venue updated successfully' });
  } catch (error) {
    console.error('Error updating favorite venue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = 8964;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})