const mongoose = require('mongoose');
const { DB_URL } = require('../config');

module.exports = async() =>{
    try {
        await mongoose.connect(DB_URL)
        console.log("DB connected");
        
    } catch (error) {
        console.log("Error in DB Connection");
        console.log(error);
        
        
    }
}