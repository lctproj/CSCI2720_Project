const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
app.use(cors());

const uri = "mongodb+srv://CSCi2720:CSCI2720@csci2720project.nrracpp.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

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
app.get('/all-events', async (req, res) => {
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

app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log(`Server is running on port ${port}`);
});