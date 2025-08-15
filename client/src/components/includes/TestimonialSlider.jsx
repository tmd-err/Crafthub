import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "CraftHub helped us find the perfect artisan for our custom project. The process was seamless and the result exceeded our expectations!",
    name: "Sarah Johnson",
    role: "Client",
  },
  {
    quote: "The craftsmanship was impeccable. I felt supported throughout the entire process, and my ideas were brought to life perfectly.",
    name: "Mark Allen",
    role: "Artisan",
  },
  {
    quote: "Absolutely wonderful experience! The team at CraftHub was professional, and the final product was exactly what I envisioned.",
    name: "Emily Clark",
    role: "Client",
  },
  {
    quote: "A great platform for artisans like me to showcase our skills. CraftHub provides excellent support and helps us reach the right clients.",
    name: "James Lee",
    role: "Artisan",
  },
  {
    quote: "Very happy with my purchase! CraftHub made it easy to communicate with artisans and manage the project.",
    name: "Alice Harris",
    role: "Client",
  },
  {
    quote: "Working with CraftHub is a game-changer. The quality of the work was top-notch, and the service was great.",
    name: "Brian Smith",
    role: "Artisan",
  },
];

const TestimonialsSlider = () => {
  return (
    <motion.section
      className="py-16 px-6 bg-gray-100 text-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true, amount: 0.5 }}
    >
      <h2 className="text-3xl font-semibold mb-8">What Our Clients Say</h2>
      <div className="w-full mx-auto overflow-hidden relative">
        <motion.div
          className="flex gap-8 py-4 slider-container"
          animate={{ x: ["100%", "-100%"] }} 
          transition={{
            x: {
              repeat: Infinity, 
              repeatType: "loop", 
              duration: 20, 
              ease: "linear",
            },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg w-1/3"
              style={{ minHeight: "160px" }} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
              <p className="font-semibold text-blue-500">
                {testimonial.name}, {testimonial.role}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSlider;
