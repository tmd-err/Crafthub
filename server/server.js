const express = require('express');
const connectToMongoDB = require('./database') ; 
const cookieParser = require("cookie-parser") ;
const authRoute = require('./routes/authRoutes') ;
const serviceRoute = require('./routes/serviceRoutes') ;
const chatRoute = require('./routes/chatRoute') ;
const reservationRoute = require('./routes/reservationRoutes') ; 
const authenticateJWT = require('./Middleware/authentication');
const userRoute = require('./routes/userRoutes') ; 
const http = require('http');
const {Server} = require('socket.io') ;
const cors = require('cors');
const path = require('path');
const axios = require("axios") ;

const {chatSocketHandler} = require("./Controllers/ChatController") ;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust in production
    methods: ['GET', 'POST']
  }
});
//connecting to database
connectToMongoDB() ; 
//CORS middelware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow sending cookies
  })
);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
//middelwares
//cookie middelware
app.use(cookieParser(process.env.JWT_SECRET)) ;
//transforming form data to be readable
app.use(express.urlencoded({extended:false})) 
//transform the data to json
app.use(express.json());
//authentication middelware 
// app.use(authenticateJWT);



app.set('view engine', 'ejs') ;


//route controlling
app.use('/api/auth' , authRoute);
app.use('/api',serviceRoute) ;
app.use('/api/reservation' , reservationRoute) ;
app.use('/api/profile',userRoute);
//returning not found on not controlled pages
app.use('/api/chat' , chatRoute) ;

chatSocketHandler(io) ;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
