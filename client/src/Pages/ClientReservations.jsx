import { useEffect, useRef ,useLayoutEffect, useState} from 'react';
import { useDispatch, useSelector ,  } from 'react-redux';
import { fetchReservations, deleteReservation, updateReservationStatus } from '../Redux/Slices/reservationSlice';
import { FaEdit, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2'; 
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import { Link } from 'react-router-dom';
import UpdateReservationModal from '../components/UpdateReservationModel';
import RatingModal from '../components/RatingModal';
import axios from 'axios';

export default function ClientReservations() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id; // Safely retrieve user ID from localStorage
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [userType, setUserType] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const tableRef = useRef();
  const { clientReservations, loading } = useSelector((state) => state.reservation);
  // Fetch reservations on userId change
  useEffect(() => {
    if (userId) dispatch(fetchReservations(userId));
  }, [dispatch, userId]);

  useLayoutEffect(() => {
    const table = tableRef.current;
  
    if (!table) return;
  
    const $table = $(table);
  
    // Destroy existing instance if it exists
    if ($.fn.DataTable.isDataTable(table)) {
      $table.DataTable().destroy();
    }
  
    // Use setTimeout to ensure DOM has been updated before initializing
    const timer = setTimeout(() => {
      $table.DataTable({
        responsive: true,
        destroy: true,
      });
    }, 0);
    dispatch(fetchReservations(userId));
    // Cleanup on component unmount
    return () => {
      clearTimeout(timer); // Clear any pending initialization
      if ($.fn.DataTable.isDataTable(table)) {
        $table.DataTable().destroy();
      }
    };
    
  }, [dispatch,userId]);

  // Delete reservation handler with SweetAlert2 confirmation
  const handleDelete = (reservationId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this reservation!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(deleteReservation(reservationId)).unwrap();
          // If successful, show success alert
          Swal.fire('Deleted!', 'Your reservation has been deleted.', 'success');
          dispatch(fetchReservations(userId));
        } catch (error) {
          console.error('Delete error:', error); // helpful for debugging
          Swal.fire('Error!', error?.message || 'Failed to delete reservation. Please try again.', 'error');
        }
      }
    });
  };
  const submitRating = async (serviceId, clientId, rating) => {
    try {
      const response = await axios.post('http://localhost:5000/api/services/rate', {
        serviceId,
        clientId,
        rating,
      });
      console.log('Rating updated:', response.data);
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };
  
  

  return (
    <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 my-12">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Reservations</h2>
        {user?.role === 'client' && (
          <div className="bg-yellow-100 text-yellow-800 text-sm p-3 rounded-md mb-4 border border-yellow-300">
            <strong>Note:</strong> You can't update the reservation status until it is <b>confirmed</b> by the artisan.
          </div>
        )}
        <div className="mb-6">
          <Link 
            to="/services" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            <span className="mr-2">+</span>
            Reserve Service
          </Link>
        </div>
        {loading && <p className="text-gray-500">Loading reservations...</p>}

        {!loading && clientReservations.length === 0 && (
          <p className="text-gray-500">
            You have no reservations yet.
            
          </p>
        )}

        {clientReservations.length > 0 && (
          <div className="overflow-x-auto max-w-full">
            <table ref={tableRef} className="stripe hover w-full min-w-max text-left" id="reservationTable">
              <thead className="bg-gray-100 text-sm font-semibold">
                <tr>
                  <th className="py-2 px-4 min-w-[120px]">Service</th>
                  <th className="py-2 px-4 min-w-[120px]">Your Note</th>
                  <th className="py-2 px-4 min-w-[120px]">Artisan</th>
                  <th className="py-2 px-4 min-w-[120px]">Email</th>
                  <th className="py-2 px-4 min-w-[120px]">Phone</th>
                  <th className="py-2 px-4 min-w-[120px]">Paiement</th>
                  <th className="py-2 px-4 min-w-[120px]">Status</th>
                  <th className="py-2 px-4 min-w-[120px]">CreatedAt</th>
                  <th className="py-2 px-4 min-w-[120px]">ReservedAt</th>
                  <th className="py-2 px-4 min-w-[120px] text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clientReservations?.map((res, idx) => (
                  <tr key={idx} className="text-sm">
                    <td className="py-2 px-4 min-w-[120px]">
                    <Link  to={`/services/service/${res?.service?._id}`} className="flex text-blue-500 underline items-center hover:scale-105 transition duration-200  " >
                      {res.service?.title?.length > 40 ? res.service?.title.slice(0, 37) + '...' : res.service?.title}
                    </Link>
                    </td>
                    <td className="py-2 px-4 min-w-[120px]">{
                      res.note ? 
                      (res.note.length > 30 ? res.note.slice(0, 27) + '...' : res.note) : "No notes"
                      }</td>
                    <td className="py-2 px-4 min-w-[120px]">{res.service?.provider?.username}</td>
                    <td className="py-2 px-4 min-w-[120px]">
                      <a target='_blank' className='text-blue-500 underline' href={`mailto:${res.service?.provider?.email}`}>
                        {res.service?.provider?.email}
                      </a>
                    </td>
                    <td className="py-2 px-4 min-w-[120px]">{res.service?.provider?.phone ? res.service?.provider?.phone : 'N/A' }</td>
                    <td className="py-2 px-4 min-w-[120px]">{res.statusPaiement ? 'Paid' : 'Not Paid'}</td>
                    <td className="py-2 px-4 min-w-[120px]">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        res.status === 'Confirmed'
                          ? 'bg-green-100 text-green-700'
                          : res.status === 'Completed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {res.status}
                              </span>
                            </td>
                            <td className="py-2 px-4 min-w-[120px]">{new Date(res.dateCreation).toLocaleDateString()}</td>
                            <td className="py-2 px-4 min-w-[120px]">{new Date(res.date).toLocaleDateString()}</td>

                            <td className="py-2 px-4 text-center flex gap-2 items-center justify-center min-w-[120px]">
                              {/* Edit Button */}
                              <button
                                    className="text-blue-600 py-2 px-3 rounded-lg border border-blue-600 hover:bg-blue-100 hover:text-blue-800 transition-all"
                                    onClick={() => {
                                      if (user.role === 'client' && res.status === 'Confirmed') {
                                        setUserType('client');
                                        setSelectedReservation(res);
                                        setShowModal(true);
                                      } else if (res.status === 'Completed') {
                                        Swal.fire('Transaction Completed', 'This reservation is already completed.', 'info');
                                      } else {
                                        Swal.fire('Not allowed', 'You cannot update this reservation until it\'s confirmed.', 'warning');
                                      }
                                      
                                    }
                                  }
                                    
                                  >
                                    <FaEdit />
                              </button>


                      {/* Delete Button */}
                      <button
                        className="text-red-600 cursor-pointer py-2 px-3 rounded-lg border border-red-600 hover:bg-red-100 hover:text-red-800 transition-all"
                        onClick={() => handleDelete(res._id)} // Call the handleDelete function
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showModal && selectedReservation && (
          <UpdateReservationModal
            userType={userType}
            onClose={() => setShowModal(false)}
            onConfirm={async () => {
              try {
                const newStatus = userType === 'client' && 'Completed' ;
                await dispatch(updateReservationStatus({ id: selectedReservation._id, status: newStatus }));

                setShowModal(false);
                Swal.fire('Success!', `Reservation marked as ${newStatus}.`, 'success');
                dispatch(fetchReservations(userId)); // Refresh list
                setTimeout(() => {
                  setShowRatingModal(true); // You create a modal component for rating
                }, 1000);
              } catch (error) {
                console.error(error);
                Swal.fire('Error!', 'Failed to update reservation.', 'error');
              }
            }}
          />
        )}
        {showRatingModal && (
          <RatingModal
            onClose={() => setShowRatingModal(false)}
            onSubmit={(rating) => submitRating(selectedReservation.service._id, userId, rating)}
          />
        )}
      </div>
    </div>
  );
}
