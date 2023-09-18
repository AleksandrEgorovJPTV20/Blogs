//Mongoose - это библиотека для Node.js, которая предоставляет средства для работы с MongoDB, одной из популярных NoSQL баз данных.

const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://admin:Password@dbblogid.h1zf0oa.mongodb.net/Blogs');
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(err);
    }
}

module.exports = connectDB;