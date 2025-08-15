import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-semibold text-center mb-12">About Us</h1>

      {/* First Section: Image on the left, text on the right */}
      <div className="flex flex-col-reverse md:flex-row items-center mb-12">
        <div className="md:w-1/2">
          <img
            src="/assets/service1.jpg"
            alt="Service 1"
            className="rounded-xl shadow-xl w-full"
          />
        </div>
        <div className="md:w-1/2 md:ml-12 text-center md:text-left">
          <h2 className="text-3xl font-semibold mb-4">Our Craft Services</h2>
          <p className="text-lg md:text-xl text-gray-700">
            At CraftHub, we offer a wide range of services tailored to both clients and artisans. Whether you are looking for expert craftsmanship or a trusted service provider, we are here to help. Our platform connects professionals with businesses in various crafts.
          </p>
        </div>
      </div>

      {/* Second Section: Image on the right, text on the left */}
      <div className="flex flex-col md:flex-row items-center mb-12">
        <div className="md:w-1/2 md:mr-12 text-center md:text-left">
          <h2 className="text-3xl font-semibold mb-4">Why Choose Us?</h2>
          <p className="text-lg md:text-xl text-gray-700">
            Our platform is designed to provide convenience, transparency, and reliability. Whether you are a client looking for quality services or an artisan seeking new opportunities, CraftHub makes it easy to connect with the right people for the job.
          </p>
        </div>
        <div className="md:w-1/2">
          <img
            src="/assets/service2.jpg"
            alt="Service 2"
            className="rounded-xl shadow-xl w-full"
          />
        </div>
      </div>

      {/* Third Section: Image on the left, text on the right */}
      <div className="flex flex-col-reverse md:flex-row items-center mb-12">
        <div className="md:w-1/2">
          <img
            src="/assets/service3.jpg"
            alt="Service 3"
            className="rounded-xl shadow-xl w-full"
          />
        </div>
        <div className="md:w-1/2 md:ml-12 text-center md:text-left">
          <h2 className="text-3xl font-semibold mb-4">Get Started with CraftHub</h2>
          <p className="text-lg md:text-xl text-gray-700">
            Join CraftHub today and become part of a growing community of artisans and clients. Whether you're here to showcase your services or find the perfect artisan for your project, CraftHub is the place to be. Get started now and take your craft business to the next level!
          </p>
        </div>
      </div>
    {/* CTA Section */}
        <div className="text-center mt-12">
        <h3 className="text-2xl font-semibold mb-4">Ready to Get Started?</h3>
        <p className="text-lg text-gray-700 mb-6">
            Join CraftHub today and connect with top artisans or clients. Let's build something amazing together!
        </p>
        <Link
            to="/auth/sign-up"
            className="inline-block bg-blue-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
        >
            Join Now
        </Link>
        </div>
    </div>
  );
};

export default About;
