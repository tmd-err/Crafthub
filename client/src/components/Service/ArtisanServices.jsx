import { useEffect, useRef, useCallback ,useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtisanServices, deleteServiceAsync } from '../../Redux/Slices/serviceSlice';
import { FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2'; 
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import { Link } from 'react-router-dom';

export default function ArtisanServices() {
  // Import useState at the top level
  
  
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;
  const dispatch = useDispatch();
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);
  const { artisanServices, loading } = useSelector((state) => state.service);
  
  // Fetch services when userId changes
  useEffect(() => {
    if (userId) dispatch(fetchArtisanServices(userId));
  }, [dispatch, userId]);

  // Initialize/Cleanup DataTable
  useLayoutEffect(() => {
    const $table = $(tableRef.current);
  
    // Cleanup previous DataTable instance if exists
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $table.DataTable().clear().destroy();
    }
  
    // Wait for DOM update then initialize DataTable
    const timer = setTimeout(() => {
      dataTableRef.current = $table.DataTable({
        responsive: true,
        destroy: true
      });
    }, 100); // Give time for DOM to render
  
    return () => {
      clearTimeout(timer);
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      }
    };
  }, [artisanServices]);

  // Delete service handler with SweetAlert2 confirmation
  const handleDelete = useCallback(async (serviceId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this service!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteServiceAsync(serviceId)).unwrap();
          // Refetch services after deletion
          dispatch(fetchArtisanServices(userId));
          Swal.fire('Deleted!', 'Your service has been deleted.', 'success');
        } catch (error) {
          console.log(error);
          Swal.fire('Error!', 'Failed to delete service. Please try again.', 'error');
        }
      }
    });
  }, [dispatch, userId]);
  return (
    <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 my-12">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Services</h2>
        <div className="mb-6">
          <Link 
            to="/add-service" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            <span className="mr-2">+</span>
            Add New Service
          </Link>
        </div>
        {loading && <p className="text-gray-500">Loading services...</p>}

        {!loading && artisanServices.length === 0 && (
          <p className="text-gray-500">You have no services yet.</p>
        )}

        {!loading && artisanServices.length > 0 && (
          <div className="overflow-x-auto max-w-full">
            <table ref={tableRef} className="stripe hover w-full min-w-max text-left" id="serviceTable">
              <thead className="bg-gray-100 text-sm font-semibold">
                <tr>
                  <th className="py-2 px-4 min-w-[120px]">Service</th>
                  <th className="py-2 px-4 min-w-[120px]">Description</th>
                  <th className="py-2 px-4 min-w-[120px]">Category</th>
                  <th className="py-2 px-4 min-w-[120px]">Price</th>
                  <th className="py-2 px-4 min-w-[120px]">Availability</th>
                  <th className="py-2 px-4 min-w-[120px] text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {artisanServices.map((service) => (
                  <tr key={service._id} className="text-sm">
                    <td className="py-2 px-4 min-w-[120px]">{service.title}</td>
                    <td className="py-2 px-4 min-w-[120px]">{service.description.slice(0, 40)}...</td>
                    <td className="py-2 px-4 min-w-[120px]">{service.category}</td>
                    <td className="py-2 px-4 min-w-[120px]">${service.price}</td>
                    <td className="py-2 px-4 min-w-[120px]">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.availability
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-red-700'
                        }`}
                      >
                        {service.availability ? "Available" : "Not Available"}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-center flex gap-2 items-center justify-center min-w-[120px]">
                      <button
                        className="text-red-600 cursor-pointer py-2 px-3 rounded-lg border border-red-600 hover:bg-red-100 hover:text-red-800 transition-all"
                        onClick={() => handleDelete(service._id)}
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
      </div>
    </div>
  );
}