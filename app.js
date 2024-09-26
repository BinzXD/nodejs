// require('dotenv').config({ path: `${process.cwd()}/.env` }); 
require('dotenv').config();

const express = require("express");
const app = express();
const router = require('./route/route');



app.use(express.json());

// Middleware untuk parsing data form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Berhasil Connect API",
  });
});

// Auth routes
app.use('/api', router);


app.use('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Route Not Found',
  });
});

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, () => {
  console.log('Server up and running on port', PORT);
});
