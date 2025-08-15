const mongoose = require('mongoose') ;

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String, enum: ['client', 'artisan', 'admin'], default: 'client' },
    rating: { type: Number, default: 0 }, 
    profilePicture: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },{
    collection : 'users'
  });

  
const userCollection = new mongoose.model("users",userSchema) ;
module.exports = userCollection ;