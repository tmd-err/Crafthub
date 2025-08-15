const express =require("express") ;
const { getAllServices, createService, deleteService, updateService, getService, getArtisanServices, updateServiceRating } = require("../Controllers/ServicesController");
const upload = require('../Middleware/upload') ;

const router = express.Router() ;

router.post('/delete/service/:id' , deleteService) ;
router.post('/create/service',upload.array("images",3) ,createService) ;
router.get('/services' ,getAllServices) ;
router.post('/update-service/:id' , updateService) ;
router.get('/get-service/:id' , getService) ;
router.get('/get-artisan-services/:artisanId' , getArtisanServices) ;
// Route to handle rating a service
router.post('/services/rate', updateServiceRating); // Endpoint to update rating

module.exports = router ; 