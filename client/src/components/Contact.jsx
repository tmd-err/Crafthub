import { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setContactData, submitContactForm, setError, resetForm } from "../Redux/Slices/contactSlice"; // Assuming you have a redux slice for contact form handling
import {Helmet} from "react-helmet" ; 

const Contact = () => {
  const dispatch = useDispatch();
  const contactData = useSelector((state) => state.contact);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setContactData({ field: name, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setError(''));
    
    // Validation
    if (!contactData.name || !contactData.email || !contactData.message) {
      dispatch(setError('All fields are required.'));
      return;
    }

    setLoading(true);
    
    try {
      const response = await dispatch(submitContactForm(contactData));
      if (response.success) {
        dispatch(resetForm());
        alert('Message sent successfully!');
      }
    } catch (error) {
      dispatch(setError('Failed to send message. Please try again.',error));
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-gray-100 py-12 px-6 sm:px-16">
      <Helmet>
        <title>
          Craft Services | Contact
        </title>
      </Helmet>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">Contact Us</h2>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div className="flex items-center space-x-4">
            <FaPhoneAlt className="text-2xl text-blue-500" />
            <span className="text-lg">+212 681 533 121</span>
          </div>
          <div className="flex items-center space-x-4">
            <FaEnvelope className="text-2xl text-blue-500" />
            <span className="text-lg">contact@crafthub.com</span>
          </div>
          <div className="flex items-center space-x-4">
            <FaMapMarkerAlt className="text-2xl text-blue-500" />
            <span className="text-lg">123 CraftHub St, City, Country</span>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={contactData.name}
              onChange={handleChange}
              id="name"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={contactData.email}
              onChange={handleChange}
              id="email"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email address"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-gray-700">Your Message</label>
            <textarea
              name="message"
              value={contactData.message}
              onChange={handleChange}
              id="message"
              rows="5"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Write your message here"
            ></textarea>
          </div>

          {/* Error Message */}
          {contactData.error && <p className="text-red-500 text-sm">{contactData.error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
