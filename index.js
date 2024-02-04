const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
require('dotenv').config();
const appointmentRoutes = require('./routes/routes');

const app = express();

const PORT = process.env.PORT;
const dbURI = process.env.MONGO_URL;

app.use(express.json());


app.use(cors());

app.use('/api', appointmentRoutes);

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    console.log('Connected to Database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
