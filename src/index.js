require('dotenv').config();
const express = require('express');
const app = express();
const port = 5000;
const route = require('./routes/route');
const { errorHandler } = require('./helpers/errorHandler'); 


app.use(express.json()); 
app.use(errorHandler);
app.use("/", route);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });