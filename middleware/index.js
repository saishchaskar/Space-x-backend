
const cors = require('cors');
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3001; // Choose a port for your Node.js server
app.use(cors())
app.use(express.json());

app.use("*",(res,req) => res.status(404).json({error:"not found"}))
// Your custom authentication token
const customToken = '12345678w';

// Middleware for token authentication
app.all(("/auth"), (req, res, next) => {
  const userToken = req.header('Authorization');
  console.log("UserToken: ", userToken)
  // Check if the provided token matches the expected custom token
  if (userToken == customToken || userToken == `Bearer ${customToken}`) {
    // Token is valid, forward the request to the SpaceX API

    // Extract the URL from the request
    const url = req.query.url;

    // Build the full URL for the SpaceX API
    const spaceXApiUrl = `https://api.spacexdata.com/v3/capsules`;

    // Forward the request to the SpaceX API
    axios.get(spaceXApiUrl)
      .then(response => {
        // Forward the SpaceX API response to the React app
        res.send(response.data);
      })
      .catch(error => {
        // Handle errors from the SpaceX API
        console.log("Hello")
        res.status(error.response ? error.response.status : 500).send(error.message);

      });
  } else {
    // Token is invalid, return an authentication error
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
