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
    const event = await Event.findOne({ eventId: eventId });

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
      if (maxnum && eventnum > maxnum) {
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

    const user = await User.findOne({ username: username });

    const venue = await Venue.findOne({ venueId: venueId });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    if (IsAdd) {
      const isFavorite = user.favVenue.includes(venue.venueId);

      if (isFavorite) {
        return res.status(400).json({ error: 'Venue already in favorites' });
      }

      user.favVenue.push(venue.venueId);
    } else {
      // Remove the venue from the user's favorites
      user.favVenue.pull(venue.venueId);
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
      const isFavorite = user.favEvent.includes(event.eventId);

      if (isFavorite) {
        return res.status(400).json({ error: 'Venue already in favorites' });
      }

      user.favEvent.push(event.eventId);
    } else {
      user.favEvent.pull(event.eventId);
    }

    await user.save();

    res.status(200).json({ message: 'Favorite venue updated successfully' });
  } catch (error) {
    console.error('Error updating favorite venue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/admin/change-user', async (req, res) => {
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

app.post('/admin/create-user', async (req, res) => {
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

app.put('/admin/delete-user', async (req, res) => {
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

app.post('/admin/create-event', async (req, res) => {
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

app.post('/admin/change-event', async (req, res) => {
  try {
    const { username, eventId, updatedEvent } = req.body;

    if (username != 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const event = await Event.updateOne({ eventId: eventId }, updatedEvent, { new: true });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error('Error changing event:', error);
    res.status(500).json({ error: 'An error occurred while changing the event' });
  }
});
app.post('/admin/delete-event', async (req, res) => {
  try {
    const { username, eventId } = req.body;
    
    if (username != 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.log("Deleting event ID: ", eventId);
    // Find and delete the event by ID
    const deletedEvent = await Event.findOneAndDelete({ eventId: eventId });
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'An error occurred while deleting the event' });
  }
});

const port = 8964;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})