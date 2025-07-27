const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  location: String,
  country: String,
  amenities: [String],
  
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

// ✅ Add 2dsphere index for geospatial features
listingSchema.index({ geometry: "2dsphere" });

module.exports = mongoose.model("Listing", listingSchema);
