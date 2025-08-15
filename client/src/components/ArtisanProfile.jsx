// ArtisanProfile.jsx
import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtisanServices } from '../Redux/Slices/serviceSlice';  // adjust if needed
import { useNavigate, useParams } from 'react-router-dom';
import Service from './Service/Service';
import Swal from 'sweetalert2';
import Modal from './Modal';
import ReturnBackButton from './ReturnBackButton';

const ArtisanProfile = () => {
  const { artisanId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate() ; 
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const { services,artisans,  loading, error } = useSelector(state => state.service);
  // Adjust if your artisan is stored differently, maybe just `state.artisan`
    const artisan = artisans.find((artisan)=>artisan._id == artisanId) ; 
  useEffect(() => {
    if (artisanId) {
      dispatch(fetchArtisanServices(artisanId));
    }
  }, [artisanId, dispatch]);
  const handleServiceClick = (service) => {
    if (user) {
      setSelectedService(service);
      setShowModal(true);
    } else {
      Swal.fire({
        title: "Login Required",
        text: "You need to be logged in to view this service.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/auth/login");
        }
      });
    }
  };
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white  rounded-2xl p-8 ">
      <ReturnBackButton/>
        <p className="text-gray-500 mb-8 text-center">Discover the services offered by  
            <span className="text-blue-600">
               {" "} {artisan?.username}
            </span>
        </p>

        {loading && <p className="text-blue-500">Loading services...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        <div className="flex gap-4 items-center mb-6">
          <div>
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse-dot"></span> : Available
          </div>
          <div>
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse-dot"></span> : Not Available
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mt-6">
          {services && services.length > 0 ? (
            services.map((service,index) => (
                <Service 
                key={index}
                profile={true}
                service={service} 
                user={user}
                artisan={artisans.find(a => a._id === service.provider)}  // Assuming artisan is fetched or available in  parent component
                onClick={() => handleServiceClick(service)} 
              />
            ))
          ) : (
            !loading && <p className="col-span-full text-gray-400">No services available.</p>
          )}
        </div>
      </div>
      {/* Modal for Viewing Service Details */}
      {showModal && selectedService && (
        <Modal service={selectedService} setShowModal={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default ArtisanProfile;
