import { useEffect, useState } from 'react';
import { useParams , useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { findServiceAsync } from '../../Redux/Slices/serviceSlice';
import Swal from 'sweetalert2';
import Slider from 'react-slick';

import {
  FaMapMarkerAlt,
  FaHome,
  FaTags,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaStar,
} from 'react-icons/fa';
import ReturnBackButton from '../ReturnBackButton';
import InfoRow from '../../assets/InfoRow';
import Modal from '../Modal';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate() ;
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const { serviceToFind, loading, error } = useSelector((state) => state.service);
  const service = serviceToFind?.service;

  useEffect(() => {
    dispatch(findServiceAsync(id));
  }, [dispatch, id]);
  const handleServiceClick = () => {
    if (user) {
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
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`text-xl ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <div className="text-white text-3xl z-10">›</div>,
    prevArrow: <div className="text-white text-3xl z-10">‹</div>,
  };

  if (loading) return <div className="text-center text-xl mt-20">Loading...</div>;

  if (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error,
      confirmButtonText: 'OK',
    });
    return null;
  }

  if (!service) {
    return <div className="text-center text-xl mt-20">No service found</div>;
  }

  return (
<div className="max-w-6xl mx-auto px-4 py-12">
  <ReturnBackButton />

  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10">
    
    {/* Left Column: Image Slider - appears first on mobile, left on desktop */}
    <div className="order-1 md:order-1 md:col-span-5">
      <div className="rounded-xl overflow-hidden shadow-md">
        {service.images.length > 1 ? (
          <Slider {...sliderSettings}>
            {service.images.map((image, index) => (
              <div key={index} className="flex justify-center items-center">
                <img
                  src={`http://localhost:5000/uploads/${image}`}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-[250px] sm:h-[300px] object-cover"
                />
              </div>
            ))}
          </Slider>
        ) : (
          <img
            src={`http://localhost:5000/uploads/${service.images[0]}`}
            alt="Service"
            className="w-full h-[250px] sm:h-[300px] object-cover"
          />
        )}
      </div>
    </div>

    {/* Right Column: Info Section - appears below on mobile, right on desktop */}
    <div className="order-2 md:order-2 md:col-span-7 space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-indigo-700 break-words">
        {service.title}
      </h1>
      <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
        {service.description}
      </p>

      <hr className="border-gray-200" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InfoRow icon={<FaMapMarkerAlt />} label="City" value={service.city} />
        <InfoRow icon={<FaHome />} label="Address" value={service.address} />
        <InfoRow icon={<FaTags />} label="Category" value={service.category} />
        <InfoRow icon={<FaMoneyBillWave />} label="Price" value={`$${service.price}`} />
        <InfoRow icon={<FaPhoneAlt />} label="Phone" value={service.phone || 'Not provided'} />
        <InfoRow
          icon={<FaCalendarAlt />}
          label="Published"
          value={new Date(service.createdAt).toLocaleDateString()}
        />
        <InfoRow
          icon={<FaCheckCircle />}
          label="Available"
          value={service.availability ? 'Yes' : 'No'}
        />
        <div className="flex items-start gap-2 col-span-1 sm:col-span-2">
          <div className="text-indigo-500 mt-1"><FaStar /></div>
          <div>
            <p className="font-semibold">Rating</p>
            <div className="flex mt-1">{renderStars(service.rating || 0)}</div>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      <button
      onClick={handleServiceClick}
      className="w-96 sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200">
        Book Now
      </button>
    </div>
  </div>
  {showModal  && (
        <Modal service={serviceToFind} setShowModal={() => setShowModal(false)} />
      )}
</div>

  );
};

export default ServiceDetails;
