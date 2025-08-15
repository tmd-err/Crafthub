import { Link, useNavigate } from 'react-router-dom';
import { FaPaintBrush, FaTools, FaHeadset, FaHandshake } from 'react-icons/fa';
import { Helmet } from "react-helmet";
import { motion } from 'framer-motion';
import Slider from '../components/includes/Slider';
import TestimonialsSlider from '../components/includes/TestimonialSlider';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { refetchAllServices } from '../Redux/Slices/serviceSlice';
function Home() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { services , artisans} = useSelector(
    (state) => state.service
  );
  const artisanServices = artisans.map((artisan) => {
    const artisanServices = services.filter(
      (service) => service.provider === artisan._id // Match the artisan's ID to the service provider
    );
  
    return { ...artisan, services: artisanServices };
  });
  // Fetch initial services when the component mounts
  useEffect(() => {
    dispatch(refetchAllServices());
  }, [dispatch]);

  const handleStartNow = () => {
    if (user) {
      navigate('/services');
    } else {
      navigate('/auth/sign-up');
    }
  };
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-xl ${i <= rating ? 'text-yellow-500' : 'text-gray-400'}`}>
          ★
        </span>
      );
    }
    return stars;
  };
  return (
    <div className="font-sans bg-gray-100 overflow-x-hidden">
      <Helmet>
        <title>Craft Services | Homepage</title>
      </Helmet>

      {/* Hero Section */}
      <motion.section
        className="relative bg-blue-500 text-white text-center md:text-left"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="relative w-full h-[80vh] md:h-[90vh] bg-cover bg-center" style={{ backgroundImage: "url('/assets/artisan1.jpg')" }}>
          <div className="absolute inset-0  flex flex-col justify-center items-center md:items-start px-6">
            <h1 className="text-3xl md:text-6xl font-bold mb-4">Join Now</h1>
            <p className="text-base md:text-xl mb-6 max-w-2xl text-center md:text-left">
              Unlock your potential as an artisan or client. Connect, collaborate, and grow your craft business with CraftHub — the platform built to elevate your skills and opportunities.
            </p>
            <Link
              to="/auth/sign-up"
              className="mt-4 inline-block bg-blue-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Slider Section */}
      <motion.section
        className="py-16 px-4 md:px-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">Featured Products & Services</h2>
        <div className="max-w-7xl mx-auto">
          <Slider />
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="bg-white py-16 px-4 md:px-6 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-semibold mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Features */}
          {[
            { icon: <FaPaintBrush />, title: "Creative Designs", desc: "Our team provides unique and innovative designs to make your crafts stand out." },
            { icon: <FaTools />, title: "Expert Craftsmanship", desc: "We use high-quality tools and materials to ensure the best craftsmanship for your projects." },
            { icon: <FaHeadset />, title: "24/7 Support", desc: "Our team is available around the clock to assist you with any questions or issues." },
            { icon: <FaHandshake />, title: "Trusted Partnerships", desc: "We build long-lasting relationships with clients, ensuring quality and satisfaction." }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 * idx }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <div className="text-4xl text-blue-500 mb-4">{feature.icon}</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm md:text-base">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        className="bg-gray-200 py-16 px-4 md:px-6 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-semibold mb-8">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            { title: "Craft Customization", img: "/assets/service-1.jpg", desc: "Need something unique? We provide customization options for all types of crafts." },
            { title: "Consultation", img: "/assets/service-2.jpg", desc: "Connect with our artisans for expert advice and ideas on how to improve your craft." },
            { title: "Project Management", img: "/assets/service-3.jpg", desc: "Manage your craft projects, set timelines, and ensure quality work by tracking your progress." }
          ].map((service, idx) => (
            <motion.div
              key={idx}
              className="bg-white shadow-md p-8 rounded-lg flex flex-col items-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 * idx }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <h3 className="text-lg md:text-2xl font-semibold text-blue-500">{service.title}</h3>
              <img
                src={service.img}
                alt={service.title}
                className="w-32 h-32 md:w-44 md:h-44 object-cover rounded-full my-4"
              />
              <p className="text-gray-700 text-sm md:text-base">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
       {/* Top Rated Services Section */}
       <div className="max-w-full my-8 px-4 mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Top Rated Available Services
      </h2>
  
      <div className="grid grid-cols-1 max-w-5xl justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {artisanServices
          .flatMap((artisan) => artisan.services)
          .filter((service) => service.availability && service.rating > 3) // Filter only available services
          .sort((a, b) => b.rating - a.rating) // Sort services by rating (highest first)
          .slice(0,4)
          .map((service, index) => (
            <>
              <motion.section
              key={service._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.2 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              className="artisan-card bg-white p-6 min-w-[400px] md:w-full rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-101 transition-all duration-300 ease-in-out"
            >
              <h3 className="text-xl font-semibold">{service.title}</h3>
            
              <p className="text-sm text-gray-500">{service.description}</p>
              <hr className="border-gray-300 my-4" />
            
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category and Price in one column */}
                <div className="min-w-[250px]">
                  <span className="text-gray-500 text-sm">
                    <span className="text-gray-900">Category</span>: {service.category}
                  </span>
                  <div className="text-sm text-gray-500">
                  <p><span className="text-gray-900">City</span>: {service.city}</p>

                  </div>
                </div>
            
                {/* City and Address in another column */}
                <div className="min-w-[400px]">
                  <div className="text-sm text-gray-500">
                  <strong><span className="text-gray-900">Price</span>: ${service.price}</strong>

                  </div>
                </div>
              </div>
              <div className="min-w-[400px]">
                <div className="text-sm text-gray-500">
                  <p><span className="text-gray-900">Address</span>: {service.address}</p>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p className="flex items-center gap-1">
                  <span className="text-gray-900">Rating</span>: {renderStars(service.rating)}
                </p>
              </div>
              </motion.section>
             
            </>
          
          
          ))}
      </div>
        </div>



   


      {/* Testimonials */}
      <TestimonialsSlider />
        <hr className='border-gray-300'/>
      {/* About Section */}
      <motion.section
        className="py-16 px-4 md:px-6 bg-gray-100 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-semibold mb-8">About Us</h2>
        <p className="text-base md:text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
          At CraftHub, we are committed to connecting talented artisans with clients seeking custom and high-quality crafts. Whether you're looking to create something special or share your expertise, we're here to help you succeed.
        </p>
        <Link
          to="/about"
          className="inline-block bg-blue-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-blue-400 transition duration-300"
        >
          Learn More
        </Link>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="bg-blue-500 text-white py-12 px-4 md:px-6 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Ready to Start Crafting?</h2>
        <p className="text-base md:text-lg mb-8">
          Whether you're a client looking for unique crafts or an artisan offering your skills, CraftHub is the platform for you.
        </p>
        <button
          onClick={handleStartNow}
          className="inline-block cursor-pointer bg-white text-blue-500 py-3 px-6 rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
        >
          Get Started
        </button>
      </motion.section>
    </div>
  );
}

export default Home;
