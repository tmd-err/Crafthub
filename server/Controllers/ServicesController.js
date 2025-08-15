const Reservation = require("../Models/Schemas/Reservation");
const ServiceCollection = require("../Models/Schemas/Service");
const UserCollection = require("../Models/Schemas/User") ;
const createService = async (req, res) => {
  try {
    const files = req.files; // multer populates this
    const imagePaths = files.map((file) => file.filename); // store filenames 
    const serviceData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      city: req.body.city,
      address: req.body.address,
      availability: req.body.availability || true,
      provider: req.body.provider,
      images: imagePaths, 
    };
    console.log(serviceData)
    if (
      serviceData.title !== "" &&
      serviceData.description !== "" &&
      serviceData.price !== "" &&
      serviceData.category !== ""
    ) {
      const dbData = await ServiceCollection.create(serviceData);
      console.log("Created in server");
      res.status(200).send("Service created successfully!");
    } else if (!serviceData.provider) {
      res.status(400).send("Must be authenticated for this action!");
    } else {
      res.status(400).send("All fields are required!");
    }
  } catch (err) {
    console.log("Error adding service", err);
    res.status(400).send("Error occurred while adding service");
  }
};


const getAllServices = async(req,res)=>{
 const { start = 0, limit = 4 } = req.query;

try {
  const startIndex = parseInt(start);
  const limitIndex = parseInt(limit);

  // Get total count of services
  const totalServices = await ServiceCollection.countDocuments();

  // Fetch paginated services
  const services = await ServiceCollection.find()
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limitIndex)
    .exec();

  // Check if more services are available
  const hasMore = startIndex + services.length < totalServices;

  // Get artisans
  const artisans = await UserCollection.find({ role: "artisan" });

  res.json({
    services,
    hasMore,
    artisans
  });

} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to fetch services' });
}

} ;

const deleteService = async (req, res) => {
    try {
      const id = req.params.id; // Or use req.body.id if you're sending it in body
      const result = await ServiceCollection.deleteOne({ _id: id });
  
      if (result.deletedCount === 1) {
        res.status(200).send("Service deleted successfully!");
      } else {
        res.status(404).send("Service not found or already deleted.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      res.status(500).send("Error occurred while deleting service!");
    }
  };
  

  const updateService = async (req, res) => {
    try {
      const updateData = {
        id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        available: req.body.available,
        city: req.body.city,
        address: req.body.address,
        provider: req.body.provider,
      };
  
      console.log(updateData);
  
      // Validate required fields
      if (
        !updateData.title?.trim() ||
        !updateData.description?.trim() ||
        !updateData.price?.toString().trim() ||
        !updateData.city?.trim() ||
        !updateData.address?.trim()
      ) {
        return res.status(400).send("All fields are required!");
      }
  
      // Find the service
      const findService = await ServiceCollection.findOne({ _id: updateData.id });
  
      if (!findService) {
        return res.status(404).send("Service not found!");
      }
  
      // Check ownership
      if (findService.provider.toString() !== updateData.provider) {
        return res.status(403).send("You don't have permission to update this service!");
      }
  
      // Update the service
      await ServiceCollection.updateOne(
        { _id: updateData.id },
        {
          $set: {
            title: updateData.title || findService.title,
            description: updateData.description || findService.description,
            price: updateData.price || findService.price,
            category: updateData.category || findService.category,
            availability: updateData.available ?? findService.availability,
            city: updateData.city || findService.city,
            address: updateData.address || findService.address,
          },
        }
      );
  
      res.status(200).send("Service updated successfully!");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  };
  
  


const getService = async(req,res)=>{
    try {
        const id = req.params.id;
        const service = await ServiceCollection.findById(id);
        
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        
        res.status(200).json({ 
            message: "Service retrieved successfully",
            service 
        });
    } catch (err) {
        console.error("Error fetching service:", err);
        res.status(500).json({ message: "Error occurred while retrieving service details" });
    }
};

const getArtisanServices = async (req, res) => {
    try {
        const artisanId = req.params.artisanId;
        
        // Find the user to verify they are an artisan
        const user = await UserCollection.findById(artisanId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (user.role !== "artisan") {
            return res.status(403).json({ message: "This user is not an artisan" });
        }
        
        // Find all services provided by this artisan
        const services = await ServiceCollection.find({ provider: artisanId });
        
        res.status(200).json({
            message: "Artisan services retrieved successfully",
            count: services.length,
            services
        });
    } catch (err) {
        console.error("Error fetching artisan services:", err);
        res.status(500).json({ message: "Error occurred while retrieving artisan services" });
    }
  };
const updateServiceRating = async (req, res) => {
  try {
    const { serviceId, clientId, rating } = req.body;

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5' });
    }

    const service = await ServiceCollection.findById(serviceId).populate('provider'); // <-- populate artisan

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Update the service rating
    service.ratings.push({ clientId, rating });

    const totalRating = service.ratings.reduce((acc, { rating }) => acc + rating, 0);
    const averageRating = totalRating / service.ratings.length;

    service.rating = averageRating;
    await service.save();

    // Update the artisan rating based on ALL their services
    if (service.provider && service.provider.role === 'artisan') {
      const artisanId = service.provider._id;

      // Find all services by this artisan
      const artisanServices = await ServiceCollection.find({ 'provider': artisanId });

      let totalServiceRatings = 0;
      let numberOfRatings = 0;

      artisanServices.forEach((srv) => {
        totalServiceRatings += srv.rating; // use service average ratings
        numberOfRatings++;
      });

      const artisanAverageRating = numberOfRatings > 0 ? (totalServiceRatings / numberOfRatings) : 0;

      // Update artisan user document
      const artisan = await UserCollection.findById(artisanId);

      if (artisan) {
        artisan.rating = artisanAverageRating;
        await artisan.save();
      }
    }

    res.status(200).json({ message: 'Service rating updated successfully', service });

  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ message: 'Server error while updating rating.' });
  }
};



  
  




module.exports = {
    createService ,
    getAllServices ,
    deleteService , 
    updateService ,
    getService ,
    getArtisanServices ,
    updateServiceRating

}