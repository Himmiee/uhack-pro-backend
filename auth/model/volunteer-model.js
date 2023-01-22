const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const vSchema = new Schema({
    firstName : {type : String , required : true},
    lastName : {type : String, required : true},
    phoneNumber : {type : Number, required : true},
    email: {type : String, required : true},
    address: {type : String, required : true},
    gender: {type : String, required : true},
    postalCode: {type : Number, required : true},
    reason: {type : String},
    
})

module.exports = mongoose.model('Volunteer',vSchema,'volunteerDetails')