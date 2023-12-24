
const cors = require('cors');
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3001; // Choose a port for your Node.js server
const corsOptions = { origin: '*', optionSuccessStatus: 200 };
app.use(cors(corsOptions))
app.use(express.json());

// app.use("*",(res,req) => res.status(404).json({error:"not found"}))
// Your custom authentication token
const customToken = '12345678w';

// Middleware for token authentication
app.all(("/auth"), async (req, res, next) => {
  try {
    const userToken = req.header('Authorization');
    console.log("UserToken: ", userToken)
    if (userToken == customToken || userToken == `Bearer ${customToken}`) {
      const spaceXApiUrl = `https://api.spacexdata.com/v3/capsules`;
      const response = await axios.get(spaceXApiUrl);
      res.send(response.data);
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  } catch (error) {
    console.log("An error occurred: ", error);
    res.status(error.response ? error.response.status : 500).send(error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
