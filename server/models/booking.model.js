const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true },  
  bookingDate: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking;
