import { useState } from 'react';

const RatingModal = ({ onClose, onSubmit }) => {
  const [selected, setSelected] = useState(0);

  const handleSubmit = () => {
    onSubmit(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-xl cursor-pointer me-5 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          X
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Rate the Artisan</h2>
        <div className="flex justify-center mb-4">
          <img 
            src="/assets/rateServices.png" 
            alt="Rating" 
            className="w-24 h-24 object-contain"
          />
        </div>
        <div className="flex justify-center mb-4 text-3xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setSelected(star)}
              className={`cursor-pointer transition-transform ${
                star <= selected ? "text-yellow-400 scale-110" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <button
          className="bg-blue-500 w-full text-white py-2 rounded hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
};
export default RatingModal;
