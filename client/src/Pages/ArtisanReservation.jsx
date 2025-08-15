import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtisanReservations, updateReservationStatus } from '../Redux/Slices/reservationSlice';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import { FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import UpdateReservationModal from '../components/UpdateReservationModel';
import { Link } from 'react-router-dom';

export default function ArtisanReservations() {
  const user = JSON.parse(localStorage.getItem('user'));
  const artisanId = user?._id;
  const dispatch = useDispatch();
  const tableRef = useRef();
  const { artisanReservations, loading } = useSelector((state) => state.reservation);
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    if (artisanId) dispatch(fetchArtisanReservations(artisanId));
  }, [dispatch, artisanId]);

  useLayoutEffect(() => {
    if (!tableRef.current) return;

    const $table = $(tableRef.current);

    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $table.DataTable().destroy();
    }

    const timer = setTimeout(() => {
      $table.DataTable({
        responsive: true,
        destroy: true,
      });
    }, 0);

    return () => {
      clearTimeout(timer);
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $table.DataTable().destroy();
      }
    };
  }, [artisanReservations]);

  return (
    <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 my-12">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Reservations on My Services</h2>

        {loading && <p className="text-gray-500">Loading reservations...</p>}

        {!loading && artisanReservations.length === 0 && (
          <p className="text-gray-500">No reservations have been made on your services.</p>
        )}

        {artisanReservations.length > 0 && (
          <div className="overflow-x-auto max-w-full">
            <table ref={tableRef} className="stripe hover w-full min-w-max text-left" id="artisanReservationTable">
              <thead className="bg-gray-100 text-sm font-semibold">
                <tr>
                  <th className="py-2 px-4">Service</th>
                  <th className="py-2 px-4">Client</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Phone</th>
                  <th className="py-2 px-4">Note</th>
                  <th className="py-2 px-4">Payment</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Created At</th>
                  <th className="py-2 px-4">Reserved For</th>
                  <th className="py-2 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {artisanReservations.map((res, idx) => (
                  <tr key={idx} className="text-sm">
                   <td className="py-2 px-4">
                   <Link  to={`/services/service/${res?.service?._id}`} className="flex text-blue-500 underline items-center hover:scale-105 transition duration-200  " >
                      {res.service?.title?.length > 40 ? res.service?.title.slice(0, 37) + '...' : res.service?.title}
                    </Link>
                   </td>
                    <td className="py-2 px-4">{res.user?.username}</td>
                    <td className="py-2 px-4">
                      <a target='_blank' className='text-blue-500 underline' href={`mailto:${res.service?.provider?.email}`}>
                        {res?.user?.email}
                      </a>
                    </td>
                    <td className="py-2 px-4">{res.user?.phone ?res.user?.phone  : 'N/A' }</td>
                    <td className="py-2 px-4">{res.note || 'No note'}</td>
                    <td className="py-2 px-4">{res.statusPaiement ? 'Paid' : 'Not Paid'}</td>
                    <td className="py-2 px-4">
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
                    <td className="py-2 px-4">{new Date(res.dateCreation).toLocaleDateString()}</td>
                    <td className="py-2 px-4">{new Date(res.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 text-center flex gap-2 items-center justify-center min-w-[120px]">
                      {/* Edit Button */}
                      <button
                        className="text-blue-600 py-2 px-3 rounded-lg border border-blue-600 hover:bg-blue-100 hover:text-blue-800 transition-all"
                        onClick={() => {
                          if (user?.role === 'artisan' && res.status === 'Pending') {
                            setUserType('artisan');
                            setSelectedReservation(res);
                            setShowModal(true);
                          } else if (res.status === 'Completed') {
                            Swal.fire('Transaction Completed', 'This reservation has already been completed.', 'info');
                          }                     
                        }}
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Update Reservation Modal */}
        {showModal && selectedReservation && (
          <UpdateReservationModal
            userType={userType}
            onClose={() => setShowModal(false)}
            onConfirm={async () => {
              try {
                const newStatus = userType === 'artisan' && 'Confirmed' ;
                await dispatch(updateReservationStatus({ id: selectedReservation._id, status: newStatus }));

                setShowModal(false);
                Swal.fire('Success!', `Reservation marked as ${newStatus}.`, 'success');
                dispatch(fetchArtisanReservations(artisanId)); // Refresh list
              } catch (error) {
                console.error(error);
                Swal.fire('Error!', 'Failed to update reservation.', 'error');
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
