const mongoose = require('mongoose')

const Schema = mongoose.Schema



function validateYear(year) {
    const currentYear = new Date().getFullYear();
    return /^\d{4}$/.test(year); 
}


function parseDateString(date) {

    const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
        return new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00Z`);
    } else {
        return null;
    }
}

const appointmentSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },

    date: {
        type: Date,
        required: true,
        validate: {
            validator: function(date) {
    
                if (!(date instanceof Date && !isNaN(date))) {
                    return false;
                }
                const year = date.getFullYear().toString();
                return validateYear(year);
            },
            message: props => `Entered date is not a valid date format (YYYY-MM-DD)`
        },
        min: [new Date(), 'Date must be before today']
    },

    time: {
        type: String,
        required: true,
        trim: true,
        match: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
    }
});


appointmentSchema.pre('validate', function(next) {
    if (typeof this.date === 'string') {
        const parsedDate = parseDateString(this.date);
        if (parsedDate) {
            this.date = parsedDate;
        } else {
            return next(new Error(`Entered date is not a valid date format (YYYY-MM-DD)`));
        }
    }
    next();
});



module.exports = mongoose.model('Appointment',appointmentSchema)