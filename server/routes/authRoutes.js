const express = require('express') ; 
const { createUserController, loginUserController, logoutUserController } = require('../Controllers/UserController');
const upload = require('../Middleware/uploadProfile');

const router = express.Router() ;

router.post('/login' , loginUserController) ;
router.post('/signup' , upload.single('profilePicture') ,createUserController) ;
router.post('/logout' ,logoutUserController) ;

module.exports = router ;