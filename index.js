const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const corsOptions = require('./backend/config/corsOptions');
const connectDB = require('./backend/config/database');
connectDB();


app.use(cors(corsOptions)); //Cors security, users cannot send requests to not allowed cors options.
app.use(express.json());
app.use(cookieParser()); //cookie handler in http requests and responses
const PORT = process.env.PORT || 3000
// api/users and /api/user
app.use('/api', require('./backend/routes/userRoutes'));
// api/subscription
app.use('/api', require('./backend/routes/subscriptionRoutes'));

// user routes profiles
app.use('/api/profiles', require('./backend/routes/profileRoutes'));

// article routes
app.use('/api/articles', require('./backend/routes/articleRoutes'));

// comment routes
app.use('/api/articles', require('./backend/routes/commentRoutes'));

// tag routes
app.use('/api/tags', require('./backend/routes/tagRoutes'));

const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const options = {
  definition: {
      openapi: "3.0.0",
    info: {
      title: "LogRocket Express API with Swagger",
      version: "1.5670.345.0.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
      servers: [
          {
          url: "http://localhost:3000",
          },
      ],
      },
      apis: ["./backend/routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true }, )
);
// http://localhost:3000/api-docs
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})
mongoose.connection.on('error', err => {
  console.log(err);
})


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

module.exports = app;