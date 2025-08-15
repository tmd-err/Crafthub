import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { MdHome, MdInfo, MdContactMail, MdLogin, MdBuild } from "react-icons/md";
import { useState } from "react";

function Footer() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const [msgSent, setMsgSent] = useState() ; 

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsgSent("Message sent succefully !");
    setTimeout(()=>{
      setMsgSent(null);
    },3000)
  };

  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center md:items-start px-6 space-y-8 md:space-y-0">
        {/* Sitemap Section */}
        <div className="w-full md:w-1/3 text-center md:text-left">
          <h4 className="text-lg font-semibold mb-4">Site Map</h4>
          <hr className="mb-5 w-52  mx-auto md:mx-0" />
          <ul className="space-y-2">
            <li><Link to="/" className="flex items-center justify-center md:justify-start gap-2 hover:text-gray-400"><MdHome /> Homepage</Link></li>
            <li><Link to="/about" className="flex items-center justify-center md:justify-start gap-2 hover:text-gray-400"><MdInfo /> About Us</Link></li>
            <li><Link to="/services" className="flex items-center justify-center md:justify-start gap-2 hover:text-gray-400"><MdBuild /> Services</Link></li>
            <li><Link to="/contact" className="flex items-center justify-center md:justify-start gap-2 hover:text-gray-400"><MdContactMail /> Contact</Link></li>
            <li><Link to="/auth/login" className="flex items-center justify-center md:justify-start gap-2 hover:text-gray-400"><MdLogin /> Login | Sign Up</Link></li>
          </ul>
        </div>

        {/* Contact Form Section */}
        <div className="w-full md:w-1/3 text-center">
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <hr className="mb-5 w-52 text-center mx-auto" />

          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className="w-full p-2 rounded  text-white border border-gray-600 focus:ring-2 focus:ring-green-500" required />
            <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} className="w-full p-2 rounded  text-white border border-gray-600 focus:ring-2 focus:ring-green-500" required />
            <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} className="w-full p-2 rounded  text-white border border-gray-600 focus:ring-2 focus:ring-green-500" required></textarea>
            {
              msgSent && <p className="text-green-500">
                {msgSent}
              </p>
            }
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white w-full py-2 px-4 rounded">Send</button>
          </form>
        </div>

        {/* Social Media Section */}
        <div className="w-full flex flex-col items-center md:w-1/3 text-center md:text-right">
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <hr className="mb-5 w-52 text-center mx-auto" />

          <div className="flex justify-center md:justify-end space-x-4 text-2xl">
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400"><FaFacebook /></a>
            <a href="https://www.instagram.com/michiaveel/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400"><FaInstagram /></a>
            <a href="https://www.linkedin.com/in/yahya-tamda-0660352a7/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400"><FaLinkedin /></a>
            <a href="https://wa.me/+212681533815" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400"><FaWhatsapp /></a>
          </div>
          <div className="text-center mt-5">
            <h4 className="text-lg font-semibold mb-4">Find Us</h4>
            <hr className="mb-5 w-52 text-center mx-auto" />
            <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2514.9674027166434!2d-87.7701069246963!3d41.95806206040513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880fcc0d48f3cc99%3A0x704359713c904362!2scraft%20service%20truck!5e1!3m2!1sen!2sma!4v1742039992112!5m2!1sen!2sma"
            width="300"
            height="300"
            className="border rounded-2xl"
            style={{ border: "0" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
        

      </div>

      {/* Copyright */}
      <p className="text-center text-sm mt-6">© 2025 CraftHub. All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;
