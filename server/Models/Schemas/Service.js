const mongoose = require("mongoose") ;

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  availability: { type: Boolean, default: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  ratings: [
    {
      clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
      rating: { type: Number, min: 0, max: 5 }
    }
  ],
  images: [{ type: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 }, // Current average rating
  createdAt: { type: Date, default: Date.now },
});



const ServiceCollection = new mongoose.model("services" , serviceSchema) ;

  
module.exports = ServiceCollection ; 

