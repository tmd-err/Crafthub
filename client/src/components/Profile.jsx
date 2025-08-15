import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import { getProfile, updatePassword } from '../Redux/Slices/profileSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Profile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.profile);

  const [currentPassword, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  // State for showing/hiding passwords
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    if (id) dispatch(getProfile(id));
  }, [dispatch, id]);

  const handlePasswordUpdate = () => {
    setFormErrors({});

    const errors = {};
    if (!currentPassword) errors.currentPassword = 'Current password is required';
    if (!newPassword) errors.newPassword = 'New password is required';
    if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    // If there are errors, show them as toast notifications
    if (Object.keys(errors).length > 0) {
      for (const error in errors) {
        toast.error(errors[error]); // Show each error as a toast
      }
      setFormErrors(errors);
      return;
    }

    dispatch(updatePassword({ id, currentPassword, newPassword }))
      .unwrap()
      .then(() => {
        toast.success('Password updated successfully');
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to update password');
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-10 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 font-medium mb-1">Username</label>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                  <FaUser className="text-gray-400" />
                  <span className="text-gray-800">{user?.username}</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">Email</label>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                  <FaEnvelope className="text-gray-400" />
                  <span className="text-gray-800">{user?.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">Role</label>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                  <span className="text-gray-800">{user?.role}</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">Account Created</label>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                  <span className="text-gray-800">
                    {user?.createdAt ? new Date(user.createdAt).toISOString().split("T")[0] : ''}
                  </span>
                </div>
              </div>
            </div>

            <hr className="my-4" />

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Update Password</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Current Password</label>
                  <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
                    <FaLock className="text-gray-400 mr-2" />
                    <input
                      type={currentPasswordVisible ? "text" : "password"}
                      className="bg-transparent w-full focus:outline-none"
                      value={currentPassword}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="text-gray-500"
                      onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}
                    >
                      {currentPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1">New Password</label>
                  <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
                    <FaLock className="text-gray-400 mr-2" />
                    <input
                      type={newPasswordVisible ? "text" : "password"}
                      className="bg-transparent w-full focus:outline-none"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="text-gray-500"
                      onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                    >
                      {newPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-600 font-medium mb-1">Confirm New Password</label>
                  <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
                    <FaLock className="text-gray-400 mr-2" />
                    <input
                      type={confirmPasswordVisible ? "text" : "password"}
                      className="bg-transparent w-full focus:outline-none"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="text-gray-500"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    >
                      {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handlePasswordUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition"
                >
                  <FaSave /> Update Password
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
