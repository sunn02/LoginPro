require('dotenv').config();
const express = require('express');
const session = require('express-session');
const https = require('https');
const fs = require('fs');
const config = require('./config/config');
const path = require('path');
const app = express();
const port = 5000;
const route = require('./routes/route');

const options = {
  key: fs.readFileSync(path.resolve(__dirname, config.ssl.keyPath)),
  cert: fs.readFileSync(path.resolve(__dirname, config.ssl.certPath))
};


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // Ensures cookies are only sent over HTTPS
    httpOnly: true, // Reduces client-side script control over the cookie
    maxAge: 3600000 // session timeout of 60 seconds
  }
}));

app.use(express.json()); 
app.use("/", route);


https.createServer(options, app).listen(port, () => {
  console.log(`Servidor HTTPS en ejecución en https://localhost:${port}`);
});