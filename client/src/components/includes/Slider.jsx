import React from "react";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight, FaInfoCircle, FaCogs, FaChartLine, FaLightbulb } from "react-icons/fa"; // Importing additional icons
import "slick-carousel/slick/slick.css"; // Importing slick carousel CSS
import "slick-carousel/slick/slick-theme.css"; // Importing slick carousel theme CSS

// Slider settings with autoplay
const settings = {
  dots: true, // Show dots for navigation
  infinite: true, // Allow infinite loop
  speed: 500, // Transition speed
  slidesToShow: 1, // Show 1 slide at a time
  slidesToScroll: 1, // Scroll 1 slide at a time
  autoplay: true, // Enable autoplay
  autoplaySpeed: 3000, // 3 seconds interval
  pauseOnHover: true, // Pause autoplay when hovered over
  nextArrow: (
    <FaArrowRight className="text-white absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-xl z-10" />
  ), // Custom right arrow
  prevArrow: (
    <FaArrowLeft className="text-white absolute top-1/2 left-4 transform -translate-y-1/2 cursor-pointer text-xl z-10" />
  ), // Custom left arrow
  responsive: [
    {
      breakpoint: 1024, // Medium screens (like tablets)
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768, // Small screens (like mobile phones)
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const SimpleSlider = () => {
  return (
    <Slider {...settings}>
      {/* Slide 1 */}
      <div className="relative h-64 sm:h-96">
        <img
          src="/assets/sliderImg2.jpg" // Your image path here
          alt="Slide 1"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex justify-center items-center text-center text-white p-6">
          <div className="max-w-lg">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
              Discover Our Premium Services
            </h3>
            <p className="text-sm sm:text-base md:text-lg font-light text-justify">
              Our premium services provide exceptional value to clients who
              seek quality and reliability. Whether you're looking for a creative
              solution or tailored service, our team of experts is ready to
              deliver unparalleled results.
            </p>
            {/* Service Icon */}
            <div className="mt-4 flex justify-center">
              <FaCogs className="text-3xl sm:text-4xl md:text-5xl text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Slide 2 */}
      <div className="relative h-64 sm:h-96">
        <img
          src="/assets/sliderImg1.jpg" // Your image path here
          alt="Slide 2"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex justify-center items-center text-center text-white p-6">
          <div className="max-w-lg">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
              Elevate Your Business with Us
            </h3>
            <p className="text-sm sm:text-base md:text-lg font-light text-justify">
              Our solutions are crafted to help businesses grow. From strategic
              planning to implementation, we provide everything you need to
              succeed in a competitive environment.
            </p>
            {/* Growth Icon */}
            <div className="mt-4 flex justify-center">
              <FaChartLine className="text-3xl sm:text-4xl md:text-5xl text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Slide 3 */}
      <div className="relative h-64 sm:h-96">
        <img
          src="/assets/sliderImg3.jpg" // Your image path here
          alt="Slide 3"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex justify-center items-center text-center text-white p-6">
          <div className="max-w-lg">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
              Innovative Solutions for Modern Challenges
            </h3>
            <p className="text-sm sm:text-base md:text-lg font-light text-justify">
              As a forward-thinking company, we design and implement innovative
              solutions to address your most pressing challenges. Our approach
              is rooted in creativity, ensuring that your needs are met with
              cutting-edge strategies.
            </p>
            {/* Creativity Icon */}
            <div className="mt-4 flex justify-center">
              <FaLightbulb className="text-3xl sm:text-4xl md:text-5xl text-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </Slider>
  );
};

export default SimpleSlider;
