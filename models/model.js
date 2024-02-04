const mongoose = require('mongoose')

const Schema = mongoose.Schema

const  appointmentSchema = new Schema({
    title : {
        type : String,
        required : true
    },

    date : {
        type : Date,
        required : true
    },

    time : {
        type : String,
        required : true,
        trim : true
    }
})

module.exports = mongoose.model('Appointment',appointmentSchema)