const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());


const uri = "mongodb+srv://CSCi2720:CSCI2720@csci2720project.nrracpp.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

/*
const mongoose = require('mongoose');
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB with Mongoose');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

//can delete client and connectToDatabase and  require(mongodb) line
*/

async function connectToDatabase() {
  try {
    await client.connect();
    const database = client.db('CSCI2720Project'); // Specify the database name
    return database;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

const port = 8964;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/*
//Defining schemas

const dateSchema =new MongooseSchema({
  _id:{
    type:String,
    required:true
  },
  indate:{
    type:String,
    required:true
  }
});

}

const eventDate = mongoose.model('eventDates',dateSchema);

const eventSchema = new MongooseSchema({
  _id:{
    type:String;
    required:true
  },
  titlee:{
    type:String;
    required:true
  },
  prices:{
    type:Array[Number],
    required:true
  }
});

const event = mongoose.model('events',eventSchema);

//define UserSchema lah

const locationSchema = new MongooseSchema({
  _id:{
    type:String;
    required:true
  },
  venuee:{
    type:String;
    required:true
  },
  latitude:{
    type:String,
    required:true
  },
  longtitude:{
    type:String,
    required:true
  }
});

*/

// Handling user
app.post('/create-account', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // // Generate a unique verification token
    // const verificationToken = uuidv4();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user data to the database
    const database = await connectToDatabase();
    const collection = database.collection('users');
    await collection.insertOne({
      username: username,
      email: email,
      password: hashedPassword,
    });
    // await collection.insertOne({
    //   email: email,
    //   password: hashedPassword,
    //   verified: false,
    //   verificationToken: verificationToken
    // });

    //   // Send an email with the verification link
    //   const transporter = nodemailer.createTransport({
    //     // Configure your email transport options here
    //   });

    //   const mailOptions = {
    //     from: '1155157783@link.cuhk.edu.hk',
    //     to: email,
    //     subject: 'Account Verification',
    //     text: `Please click on the following link to verify your accoun on events.com :)\n Code: ${verificationToken}`
    //   };

    //   transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //       console.error('Error sending verification email:', error);
    //       res.status(500).json({ error: 'An error occurred while sending the verification email' });
    //     } else {
    //       console.log('Verification email sent:', info.response);
    //       res.json({ message: 'Account created successfully. Please check your email for verification.' });
    //     }
    //   });
    // } catch (error) {
    //   console.error('Error creating account:', error);
    //   res.status(500).json({ error: 'An error occurred while creating the account' });
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).json({ error: 'An error occurred while retrieving items' });
  }
});

app.post('/change-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    // Fetch the user from the database based on the email
    const database = await connectToDatabase();
    const collection = database.collection('users');
    const user = await collection.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the current password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await collection.updateOne(
      { email },
      { $set: { password: hashedNewPassword } }
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'An error occurred while changing the password' });
  }
});

app.post('/delete-account', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch the user from the database based on the email
    const database = await connectToDatabase();
    const collection = database.collection('users');
    const user = await collection.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Delete the user account from the database
    await collection.deleteOne({ email });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'An error occurred while deleting the account' });
  }
});

// Handling Event Queries
app.post('/all-events', async (req, res) => {
  try {
    const database = await connectToDatabase(); // Connect to the database
    const collection = database.collection('events'); // Get the collection
    const items = await collection.find().toArray(); // Fetch all items in the collection
    res.json(items); // Send the items as a JSON response
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).json({ error: 'An error occurred while retrieving items' });
  }
});

app.post('/navbar-events', async (req, res) => {
  try {
    const database = await connectToDatabase(); // Connect to the database
    const collection = database.collection('events'); // Get the collection

    // Extract the price range, date range, and name prefix from the request body
    const { minPrice, maxPrice, startDate, endDate, namePrefix } = req.body;

    // Build the query based on the provided criteria
    const query = {
      price: { $gte: minPrice, $lte: maxPrice },
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      name: { $regex: `^${namePrefix}`, $options: 'i' }
    };

    // Fetch the matching events from the collection
    const events = await collection.find(query).toArray();

    res.json(events); // Send the events as a JSON response
  } catch (error) {
    console.error('Error retrieving events:', error);
    res.status(500).json({ error: 'An error occurred while retrieving events' });
  }
});
app.post('/event-dates', async (req, res) => {
  try {
    const database = await connectToDatabase(); // Connect to the database
    const collection = database.collection('eventDates'); // Get the collection

    // Extract the event ID from the request body
    const { eventId } = req.body;

    // Build the query based on the provided event ID
    const query = { eventId: eventId };

    // Fetch the matching event dates from the collection
    const eventDates = await collection.find(query).toArray();

    res.json(eventDates); // Send the event dates as a JSON response
  } catch (error) {
    console.error('Error retrieving event dates:', error);
    res.status(500).json({ error: 'An error occurred while retrieving event dates' });
  }
});

// Handling Venues Querise
app.post('/all-venues', async (req, res) => {
  try {
    const database = await connectToDatabase(); // Connect to the database
    const collection = database.collection('venues'); // Get the collection
    const items = await collection.find().toArray(); // Fetch all items in the collection
    res.json(items); // Send the items as a JSON response
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).json({ error: 'An error occurred while retrieving items' });
  }
});

app.post('/navbar-venue', async (req, res) => {
  try {
    const database = await connectToDatabase(); // Connect to the database
    const collection = database.collection('venues'); // Get the collection

    // Extract the date range and name part from the request body
    const { startDate, endDate, namePrefix } = req.body;

    // Build the query based on the provided criteria
    const query = {
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      name: { $regex: namePrefix, $options: 'i' }
    };

    // Fetch the matching venues from the collection
    const venues = await collection.find(query).toArray();

    res.json(venues); // Send the venues as a JSON response
  } catch (error) {
    console.error('Error retrieving venues:', error);
    res.status(500).json({ error: 'An error occurred while retrieving venues' });
  }
});

/*
app.post('/favorite-events', (req,res)=>{
  const {id, name, earliestdate, latestdate} = req.body;
})

*/
app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log(`Server is running on port ${port}`);
});