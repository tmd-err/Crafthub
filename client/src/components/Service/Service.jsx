import { motion } from "framer-motion";
import { FaEdit, FaInfo, FaRegCalendarCheck, FaTrash ,FaPaperPlane} from "react-icons/fa";
import Swal from 'sweetalert2'; 
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { deleteServiceAsync, refetchAllServices, updateServiceAsync } from '../../Redux/Slices/serviceSlice';
import PropTypes from "prop-types";
import { useState } from "react";
import { Link} from "react-router-dom" ;

const Service = ({ service, index, artisan,profile , user, onClick }) => {
  const dispatch = useDispatch();
  const userId = user?._id ;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedService, setEditedService] = useState({
    title: service.title,
    description: service.description,
    price: service.price,
    city : service.title ,
    address : service.address ,
    category: service.category,
    provider : userId , 
    available: service.availability
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateServiceAsync({
        serviceId: service._id,
        updatedData: editedService
      })).unwrap();
      dispatch(refetchAllServices());
      toast.success("Service updated successfully!");
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error(err || "Failed to update service.");
    }
  };
  

  const handleDelete = async (serviceId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteServiceAsync(serviceId)).unwrap();
        toast.success("Service deleted successfully");
        dispatch(refetchAllServices());
        Swal.fire('Deleted!', 'Your service has been deleted.', 'success');
      } catch (err) {
        Swal.fire('Error!', err.message || 'Something went wrong.');
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-lg ${i <= rating ? 'text-yellow-500' : 'text-gray-400'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <>
      <motion.div
        key={service._id}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.2 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        className="bg-white p-6 min-w-[400px] rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-101 transition-all duration-300 ease-in-out flex justify-between flex-col h-[350px] max-h-[300px]"
      >
        {/* content... */}
        <div className={`${profile && 'flex gap-2 items-center'}`}>
          <div className="flex justify-evenly">
            <div className={`text-sm ${!profile && "w-full" }  text-gray-500 mb-2 flex items-center gap-2`}>
              {service.availability ? (
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse-dot"></span>
              ) : (
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            {!profile && <strong>
                Artisan:{" "}
                {artisan ? (
                  <Link to={`/profile/artisan/${artisan._id}`} className="artisan-username underline text-blue-600 hover:no-underline">{artisan.username}</Link>
                ) : (
                  "Unknown"
                )}
              </strong>}
            </div>
            {
              userId !== artisan?._id &&
              <div>
             <Link to ={`/conversations/${artisan?._id}`} >
                <FaPaperPlane className="text-blue-500"/>
              </Link>
            </div>
            }
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{service.title}</h2>
        </div>

        <div>
          <span className="block text-gray-500 font-semibold">
           {service.description}
          </span>
        </div>
          <hr className="border-gray-300" />
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Category and Price in one column */}
            <div>
              <span className="text-gray-500 text-sm">
                <span className="text-gray-900">Category</span>: {service.category}
              </span>
              <div className="text-sm text-gray-500">
                <strong><span className="text-gray-900">Price</span>: ${service.price}</strong>
              </div>
            </div>

            {/* City and Address in another column */}
            <div>
              <div className="text-sm text-gray-500">
                <p><span className="text-gray-900">City</span>: {service.city}</p>
                <p><span className="text-gray-900">Address</span>: {service.address}</p>
              </div>
            </div>

            {/* Rating in a new column */}
            <div>
              <div className="text-sm text-gray-500">
                <p className="flex items-center">
                  <span className="text-gray-900">Rating</span>: {renderStars(service.rating)}
                </p>
              </div>
            </div>

            {/* Published In in another column */}
            <div>
              <div className="text-sm text-gray-500">
                <p>
                  <span className="text-gray-900">Published In</span>:{" "}
                  <span className="tracking-wider">
                    {new Date(service.createdAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
          </div>



        {user?._id === service.provider ? (
          <div className="flex gap-4 items-center mt-4">
            <button
              onClick={() => handleDelete(service._id)}
              className="bg-red-500 text-white py-3 px-6 rounded-lg flex items-center gap-2 hover:bg-red-600 transition duration-200 transform hover:scale-105"
            >
              <FaTrash /> Delete
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-blue-500 text-white py-3 px-6 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition duration-200 transform hover:scale-105"
            >
              <FaEdit /> Edit
            </button>
          </div>
        ) : user?.role !== "artisan" && (
          <div className="flex gap-4 items-center mt-4">
            <button
              onClick={service.availability ? onClick : null}
              disabled={!service.availability}
              className={`${
                service.availability ? "bg-green-500 hover:bg-green-600" : "bg-green-300 cursor-not-allowed"
              } text-white py-2 px-6 cursor-pointer rounded-lg flex items-center gap-2 transition duration-200 ${
                service.availability ? "hover:scale-105" : ""
              }`}
            >
              <FaRegCalendarCheck /> Reserve Now
            </button>
            <Link  to={`/services/service/${service._id}`} className="flex items-center hover:scale-105 transition duration-200 hover:bg-blue-700 justify-center   py-2 rounded-lg px-4 bg-blue-600 text-white " >
               <FaInfo/> Details
            </Link>
          </div>
        )}
      </motion.div>

      {/* Move the Modal OUTSIDE motion.div */}
      {isEditModalOpen && (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Service</h2>
    
        <form onSubmit={handleUpdate}>
    
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 mb-1">Service Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={editedService.title}
              onChange={(e) => setEditedService({ ...editedService, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md outline-0 focus:border-blue-500"
            />
          </div>
    
          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={editedService.description}
              onChange={(e) => setEditedService({ ...editedService, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md outline-0 focus:border-blue-500"
              rows="4"
            />
          </div>
    
          {/* Price & City (2 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="price" className="block text-gray-700 mb-1">Price</label>
              <input
                type="number"
                min="0"
                id="price"
                name="price"
                value={editedService.price}
                onChange={(e) => setEditedService({ ...editedService, price: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md outline-0 focus:border-blue-500"
              />
            </div>
    
            <div>
              <label htmlFor="city" className="block text-gray-700 mb-1">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={editedService.city}
                onChange={(e) => setEditedService({ ...editedService, city: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md outline-0 focus:border-blue-500"
              />
            </div>
          </div>
    
          {/* Address & Category (2 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="address" className="block text-gray-700 mb-1">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={editedService.address}
                onChange={(e) => setEditedService({ ...editedService, address: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md outline-0 focus:border-blue-500"
              />
            </div>
    
            <div>
              <label htmlFor="category" className="block text-gray-700 mb-1">Category</label>
              <select
                id="category"
                name="category"
                value={editedService.category}
                onChange={(e) => setEditedService({ ...editedService, category: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md outline-0 focus:border-blue-500"
              >
                <option value="">Select a Category</option>
                <option value="plumbing">Plumbing</option>
                <option value="carpentry">Carpentry</option>
                <option value="electrical">Electrical</option>
                <option value="painting">Painting</option>
              </select>
            </div>
          </div>
    
          {/* Available Checkbox */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="available"
              checked={editedService.available}
              onChange={(e) => setEditedService({ ...editedService, available: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="available" className="text-gray-700">Available</label>
          </div>
    
          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg w-full"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg w-full"
            >
              Cancel
            </button>
          </div>
    
        </form>
      </div>
    </div>
    
      
      )}
    </>
  );
};

Service.propTypes = {
  service: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  artisan: PropTypes.object,
  user: PropTypes.object,
  onClick: PropTypes.func,
};

export default Service;
