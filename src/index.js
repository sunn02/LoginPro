require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();
const port = 5000;
const route = require('./routes/route');
const { errorHandler } = require('./helpers/errorHandler'); 

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Ensures cookies are only sent over HTTP
    httpOnly: true, // Reduces client-side script control over the cookie
    maxAge: 3600000 // session timeout of 60 seconds
  }
}));

app.use(express.json()); 
app.use(errorHandler);
app.use("/", route);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });