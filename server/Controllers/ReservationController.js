const Reservation = require("../Models/Schemas/Reservation");
const ServiceCollection = require("../Models/Schemas/Service");
const users = require("../Models/Schemas/User");
const reserveService = async (req, res) => {
    try {
      const reservationData = {
        clientId: req.body.userId,
        serviceId: req.body.serviceId,
        date: req.body.date,
        note: req.body.note || ""
      };
      // Validate required fields
      if (!reservationData.clientId || !reservationData.serviceId || !reservationData.date) {
        return res.status(400).send("Client ID, Service ID, and date are required!");
      }
  
      // Check if service exists
      const service = await ServiceCollection.findById(reservationData.serviceId);
      if (!service) {
        return res.status(404).send("Service not found!");
      }
  
      // Check if service is available
      if (!service.availability) {
        return res.status(400).send("This service is currently unavailable for booking!");
      }
  
      // Create reservation in database
      // Note: You'll need to create a Reservation schema/collection
      const reservation = await Reservation.create({
        user: reservationData.clientId,
        service: reservationData.serviceId,
        date: new Date(reservationData.date),
        note: reservationData.note,
      });
  
      res.status(201).json({
        message: "Service reserved successfully!",
        reservation
      });
    } catch (err) {
      console.error("Reservation error:", err);
      res.status(500).send("Error occurred while reserving service!");
    }
  }

const getUserReservations = async (req, res) => {
  try {
    const userId = req.params.userId ;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find all reservations for the specified user
    const reservations = await Reservation.find({ user: userId })
    .populate({
      path: 'service',
      populate: {
        path: 'provider', // ✅ use 'provider', not 'user'
        select: 'username email phone' // or name/email based on your User schema
      },
      select: 'title provider'
    })
    .sort({ date: -1 })
    .lean();

  
    
    if (!reservations || reservations.length === 0) {
      return res.status(200).json({ message: "No reservations found for this user", reservations: [] });
    }

    res.status(200).json({
      message: "User reservations retrieved successfully",
      count: reservations.length,
      reservations
    });
  } catch (err) {
    console.error("Error fetching user reservations:", err);
    res.status(500).json({ message: "Error occurred while retrieving reservations" });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    
    if (!reservationId) {
      return res.status(400).json({ message: "Reservation ID is required" });
    }

    // Find the reservation to check if it exists
    const reservation = await Reservation.findById(reservationId);
    
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Check if the user making the request is the owner of the reservation
    if (req.user && reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this reservation" });
    }

    // Delete the reservation
    await Reservation.findByIdAndDelete(reservationId);
    
    res.status(200).json({
      message: "Reservation deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting reservation:", err);
    res.status(500).json({ message: "Error occurred while deleting reservation" });
  }
};

const getArtisanReservations = async (req, res) => {
  try {
    const artisanId = req.params.artisanId;

    // Step 1: Find services created by this artisan
    const artisanServices = await ServiceCollection.find({ provider: artisanId }, '_id');
    const serviceIds = artisanServices.map(service => service._id);

    if (serviceIds.length === 0) {
      return res.status(200).json({
        message: "No reservations found for this artisan",
        reservations: [],
        count: 0
      });
    }

    // Step 2: Find reservations for those services
    const reservations = await Reservation.find({ service: { $in: serviceIds } })
      .populate('user', 'username email phone')     // populate client info
      .populate('service', 'title price')     // populate basic service info
      .sort({ date: -1 });

    res.status(200).json({
      reservations,
      count: reservations.length
    });
  } catch (error) {
    console.error("Error fetching artisan reservations:", error);
    res.status(500).json({ error: "Server error while fetching reservations" });
  }
};

// Update Reservation Status
const updateReservationStatus = async (req, res) => {
  const { reservationId } = req.params;
  const { status } = req.body;

  try {
    // Find reservation by ID
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Update the status
    reservation.status = status;
    if(reservation.status == "Completed"){
      reservation.statusPaiement = true ;
    }
    await reservation.save();

    res.status(200).json({ message: 'Reservation status updated successfully', reservation });
  } catch (error) {
    console.error('Error updating reservation status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



module.exports = {
    reserveService,
    getUserReservations ,
    deleteReservation ,
    getArtisanReservations ,
    updateReservationStatus
}