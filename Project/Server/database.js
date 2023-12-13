const fs = require('fs');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/CSCI2720Project');

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
const madeupEventsDataPath = './Data/madeupEvents.json';
const madeupEventsData = readJsonFromFile(madeupEventsDataPath);
console.log(madeupEventsData);
const VenueDataPath = './Data/venues.json';
const VenueData = readJsonFromFile(VenueDataPath);
console.log(VenueData);
const eventDateDataPath = './Data/eventDates.json';
const eventDateData = readJsonFromFile(eventDateDataPath);
console.log(eventDateData);
const madeupEventDateDataPath = './Data/madeupEventDates.json';
const madeupEventDateData = readJsonFromFile(madeupEventDateDataPath);
console.log(madeupEventDateData);
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
for (const element of madeupEventDateData) {
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
for (const element of madeupEventsData) {
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

const saveUserData = async (User, UserData) => {
try {
for (const element of UserData) {
    element.password = await bcrypt.hash(element.password, 10);
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