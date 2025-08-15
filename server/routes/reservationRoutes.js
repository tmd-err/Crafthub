const express = require('express') ; 
const { getUserReservations, reserveService, deleteReservation, getArtisanReservations, updateReservationStatus } = require('../Controllers/ReservationController');

const router = express.Router() ;


router.post('/reserve-service',reserveService) ; 
router.get('/get-reservations/:userId' , getUserReservations) ;
router.post('/delete-reservation/:id' , deleteReservation) ;
router.get('/get-artisan-reservations/:artisanId' , getArtisanReservations)
router.put('/update-reservation-status/:reservationId', updateReservationStatus);

module.exports = router ; 