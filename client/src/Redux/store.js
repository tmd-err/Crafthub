import { configureStore } from '@reduxjs/toolkit';
import signUpReducer from './Slices/SignUpSlice'; 
import loginSlice from './Slices/loginSlice';
import contactSlice from './Slices/contactSlice';
import serviceSlice from './Slices/serviceSlice';
import profileSlice from './Slices/profileSlice' ;
import reservationSlice from './Slices/reservationSlice' ;
import chatSlice from './Slices/chatSlice' ;
export const store = configureStore({
  reducer: {
    signUp: signUpReducer,
    login : loginSlice,
    contact : contactSlice ,
    service : serviceSlice ,
    profile : profileSlice ,
    reservation : reservationSlice ,
    chat : chatSlice
  },
});
