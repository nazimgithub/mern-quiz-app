const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL)

const connection = mongoose.connection;

connection.on('connected', () =>{
    console.warn('Mongo DB connection successful!');
});

connection.on('error', (err) =>{
    console.log('Mongo DB connection failed!');
});

module.exports = connection;