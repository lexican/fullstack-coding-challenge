require("dotenv").config();
require("./config/database").connect();
const path = require("path");
const express = require('express');
const cors = require("cors");

const port = process.env.PORT || 4000;


const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../client/build')));

//Configure Route
require('./routes/index')(app);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// server listening 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});