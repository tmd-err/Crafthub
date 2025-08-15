const express = require('express') ; 
const { 
    createUserController,
    findUserController,
    updatePasswordController
} = require('../Controllers/UserController');

const route = express.Router() ;


route.get('/create' , createUserController ) ;
route.get('/:id' ,findUserController) ;
route.post('/:id/update-password', updatePasswordController);




module.exports = route ; 