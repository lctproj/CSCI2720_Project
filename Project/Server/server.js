const express = require('express');
const cors = require('cors');
const cleanseData = require('./cleanseData.js')
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
  userId: {
    type: String,
    required: [true, "user ID is required"],
    unqiue: true
  },
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

saveVenueData(Venue, VenueData);
saveEventDateData(EventDate, eventDateData);
saveEventData(Event, Venue, eventsData);
saveUserData(User, userData);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/all-events', async (req, res) => {
  try {
    const events = await Event.find();
    const allEvents =[];
    for(let event of events){
      const eventDates = await EventDate.findOne({ eventId: event.eventId });

      const earliestEventDate = eventDates.indate[0].split('T')[0];
      const latestEventDate = eventDates.indate[eventDates.indate.length - 1].split('T')[0];

      const oneEvent ={
        "id":event.eventId,
        "name":event.title,
        "earliestDate":earliestEventDate,
        "latestDate":latestEventDate,
        "price":(event.prices[0]===null) ? "0" : event.prices.sort((a, b) => a - b).toString() 
      }

      allEvents.push(oneEvent);
    }
    res.json(allEvents);
  } catch (error) {
    console.log('Error retrieving events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('favorite-events',  async(req, res)=> {
  const {id,username} = req.body;

  try{
    //Find user given username
    const user = await User.findOne({username: username}).populate('favEvents');

    //Find event given ID
    const newFavEvent = await Event.find({eventId:id});

    //Add event to list of favorite ID of that particular user
    user.favEvent.push(newFavEvent._id);
  }catch(e){
    console.log('Error adding to favorites:', e);
    res.sendStatus(500);
  }
});

app.delete('favorite-events',  async(req, res)=> {
  const {id,username} = req.body;

  try{
    //Find user given username
    const user = await User.findOne({username: username}).populate('favEvents');

    //Find event given ID
    const deletingEvent = await Event.find({eventId:id});

    //filter out event with the same _id as the deletingEvent
    user.favEvent = user.favEvent.filter(favEvent => !favEvent._id.equals(deletingEvent._id));  
  }catch(e){
    console.log('Error deleting from favorites:', e);
    res.sendStatus(500);
  }
});

app.post('all-favorite-events', async (req, res) => {
    const {username} = req.body;

    try{
      const user = await User.findOne({username: username}).populate('favEvents');

      const favEventsList = user.favEvent;

      const favEventsIdList = favEventsList.map(event => ({
        eventId: event.eventId  // Assuming _id is the property you want to send
    }));

      res.json(favEventsIdList);
    }catch(err){
      console.error("Error fetching list of favorite events",err);
      res.sendStatus(500);
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

app.post('/navbar-events', async (req,res)=>{
  const {name,price,earliestDate,latestDate} = req.body;

  let query={}

  if(name){
    query.title = { $regex: name, $options: 'i' }
  }

  try{
    const events = await Event.find (query);
    let filteredEvents = [];

    for (let event of events) {
      const eventDates = await EventDate.findOne({ eventId: event.eventId });

      const earliestEventDate = eventDates.indate[0].split('T')[0];
      const latestEventDate = eventDates.indate[eventDates.indate.length - 1].split('T')[0];

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

      let eventObj ={
        "eventId":event.eventId,
        "name": event.title,
        "price":event.prices.sort((a, b) => a - b).toString(),
        "earliestDate":earliestEventDate,
        "latestDate":latestEventDate
      };

      filteredEvents.push(eventObj);
    }
      res.json(filteredEvents);
      return;
    
  }catch(err){
    console.error("Error fetching relevant events", err);
    res.status(500).json({ message: "Error fetching relevant events" });
  }

});

app.get('/all-venues', async (req, res) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
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

    const token = jwt.sign({ userId: user._id }, 'secretKey');

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

app.put('/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

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

    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
});

app.post('/add-favourite-venue', async (req, res) => {
  try {
    const { userId, venueId } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add the venueId to the user's favorite venues
    user.favVenue.push(venueId);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Favorite venue added successfully' });
  } catch (error) {
    console.error('Error adding favorite venue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = 8964;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})