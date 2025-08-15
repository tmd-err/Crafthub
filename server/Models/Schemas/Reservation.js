const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'services',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed','Rejected','Expired'],
        default: 'Pending'
    },
    statusPaiement: {
        type: Boolean ,
        default : false ,
        required: true
    },
    dateCreation: {
        type: Date,
        default: Date.now
    },
    note: { 
        type: String,
        trim: true,
        maxlength: [500, 'Note cannot be longer than 500 characters'] ,
        default: null,
    }
});
module.exports = mongoose.model('Reservation', reservationSchema);