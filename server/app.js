const express = require('express');
const app = express();
require('dotenv').config(); // import env file
app.use(express.json()); // destruct json response
const dbConfig = require('./config/dbConfig');

const userRoute = require("./routes/userRoute");
const examRoute = require("./routes/examRoute");
const reportsRoute = require("./routes/reportsRoute");

app.use("/api/users", userRoute);
app.use("/api/exams", examRoute);
app.use("/api/reports", reportsRoute);

const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.warn(`Server listening on port ${port}`);
});