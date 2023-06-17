const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const StudentModel = require('./schema/studentschema');
 
// Connecting to database
const query = 'mongodb+srv://Username:<password>'
    + '@student.tuufn.mongodb.net/College?'
    + 'retryWrites=true&w=majority'
 
const db = (query);
mongoose.Promise = global.Promise;
 
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (error) {
    if (error) {
        console.log("Error!" + error);
    }
});
 
module.exports = router;