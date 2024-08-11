const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WishlistSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true },  
});

const Wishlist = mongoose.model('Wishlist', WishlistSchema);
module.exports = Wishlist;
