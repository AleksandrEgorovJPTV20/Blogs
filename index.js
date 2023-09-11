const express = require('express');
const app = express();
const path = require('path')
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const corsOptions = require('./backend/config/corsOptions');
const connectDB = require('./backend/config/database');
connectDB();

const PORT = process.env.PORT || 8080;

app.use(cors(corsOptions)); //Cors security, users cannot send requests to not allowed cors options.
app.use(express.json());
app.use(cookieParser()); //cookie handler in http requests and responses

mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
  });
});

mongoose.connection.on('error', err => {
  console.log(err);
})

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

module.exports = app;