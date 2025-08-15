import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addReservation, fetchReservations } from '../Redux/Slices/reservationSlice';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

const Modal = ({ setShowModal, service }) => {
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const dispatch = useDispatch();

  const handleConfirm = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (!user || !service) return;
  
    if (!date) {
      toast.error('Please select a date 📅');
      return;
    }
  
    const today = new Date().toISOString().split('T')[0];
  
    if (date <= today) {
      toast.error('The selected date must be in the future ⏳');
      return;
    }  
    const reservationData = {
      userId: user._id,
      serviceId: service._id,
      date,
      note,
    };
  
  
    try {
      const result = await dispatch(addReservation(reservationData));
  
      if (result.meta && result.meta.requestStatus === 'fulfilled') {
        dispatch(fetchReservations(user._id));
        toast.success('Reservation added successfully 🎉');
        setShowModal(false);
      } else {
        if (result.error && result.error.message) {
          toast.error(result.error.message); // Show server error if exists
        } else {
          toast.error('Failed to add reservation ❌');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred ❗');
    } 
  };
  

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-white/15 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4 text-center">Service: {service.title}</h2>

        <label className="block mb-2 text-gray-700">Select a Date</label>
        <input
          type="date"
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={today}  // Set the minimum date to today
        />

        <label className="block mb-2 text-gray-700">Note (optional)</label>
        <textarea
          rows="4"
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Write your note here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>

        <div className="flex justify-end gap-3">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 cursor-pointer py-2 rounded hover:bg-blue-600"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  setShowModal: PropTypes.func.isRequired,
  service: PropTypes.object.isRequired,
};

export default Modal;
