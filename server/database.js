
const mongoose = require('mongoose') ; 

function connectToMongoDB() {
  try{
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
      console.log('Connected to MongoDB successfully!');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
  }catch(error){
    console.log("Error occured while connecting to mongoDB")
  }
} ;

module.exports = connectToMongoDB ;