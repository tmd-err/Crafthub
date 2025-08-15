import PropTypes from "prop-types";

export default function UpdateReservationModal({ onClose, onConfirm, userType }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bzold mb-4">
          {userType === 'artisan' ? 'Confirm Reservation' : 'Complete Reservation'}
        </h2>

        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              className="form-checkbox h-5 w-5 text-blue-600" 
              checked 
              readOnly 
            />
            <span className="text-gray-700">
              {userType === 'artisan' ? 'Confirmed' : 'Completed'}
            </span>
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Confirm
          </button>
        </div>

        {/* Close (X) Button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
      </div>
    </div>
  );
  
}
UpdateReservationModal.propTypes = {
    onClose: PropTypes.func,  
    onConfirm: PropTypes.func,   
    userType: PropTypes.string,  
  };

