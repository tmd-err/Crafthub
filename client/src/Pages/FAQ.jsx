import { useState } from 'react';
import { FaQuestionCircle, FaHandshake, FaCalendarCheck, FaUserTie, FaInfoCircle, FaChevronDown } from 'react-icons/fa';

const faqs = [
  {
    icon: <FaInfoCircle className="text-blue-500 text-3xl shrink-0" />,
    question: "What is CraftHub?",
    answer: "CraftHub is a platform that connects users with skilled artisans offering a wide variety of craft services. Whether you're looking for a carpenter, painter, decorator, or any artisan, CraftHub makes finding the right expert simple and fast.",
  },
  {
    icon: <FaHandshake className="text-green-500 text-3xl shrink-0" />,
    question: "How does the matching process work?",
    answer: "After you browse services and book a reservation, CraftHub matches you with the artisan who best fits your needs based on their availability, skills, and location. Our mission is to ensure you get the perfect match for your project.",
  },
  {
    icon: <FaCalendarCheck className="text-purple-500 text-3xl shrink-0" />,
    question: "How does the reservation status system work?",
    answer: `When you reserve a service, it starts with the status "Pending". The artisan must manually review and "Confirm" the reservation. Once confirmed, your project is officially scheduled! If an artisan does not confirm, the reservation remains pending and will not be finalized.`,
  },
  {
    icon: <FaUserTie className="text-yellow-500 text-3xl shrink-0" />,
    question: "How can I become an Artisan on CraftHub?",
    answer: "To join as an artisan, simply create an account, complete your profile, and start offering your services! CraftHub welcomes professionals who are passionate about their craft and delivering great work to clients.",
  },
  {
    icon: <FaQuestionCircle className="text-red-400 text-3xl shrink-0" />,
    question: "Is there any cost to use CraftHub?",
    answer: "Signing up and browsing services on CraftHub is completely free! You only pay for the services you book. We aim to keep our platform accessible and transparent with no hidden fees.",
  },
];

function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-10">Frequently Asked Questions</h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none"
            >
              {/* Icon */}
              {faq.icon}

              {/* Text + Chevron wrapper */}
              <div className="flex flex-1 items-center">
                {/* Text */}
                <span className="text-left text-lg font-semibold text-gray-800 break-words">
                  {faq.question}
                </span>

                {/* Chevron */}
                <FaChevronDown
                  className={`text-gray-400 text-xl ml-2 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {openIndex === index && (
              <div className="p-4 text-gray-600 bg-white">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Faq;
