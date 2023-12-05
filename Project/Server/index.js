
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Create an Express server
const app = express();
app.use(cors());


// Connect to MongoDB
mongoose.connect('mongodb://localhost/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define routes and middleware here

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
