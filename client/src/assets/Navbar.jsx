import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { fetchArtisanReservations, fetchReservations } from '../Redux/Slices/reservationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtisanServices, refetchAllServices } from '../Redux/Slices/serviceSlice';
import { fetchUnreadConversationsCount } from '../Redux/Slices/chatSlice';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {unreadConvCount} = useSelector((state)=>state.chat) ;
  const { reservationsCount } = useSelector((state) => state.reservation);
  const { artisanServicesCount } = useSelector((state) => state.service);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;

  useEffect(() => {
    dispatch(refetchAllServices());
    if (userId) {
      dispatch(fetchReservations(userId));
      dispatch(fetchUnreadConversationsCount(userId))
    }

  }, [dispatch, userId]);

  useEffect(() => {
    if (userId && user?.role === "artisan") {
      dispatch(fetchArtisanServices(userId));
      dispatch(fetchArtisanReservations(userId));
    }
  }, [dispatch, userId, user?.role]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const destroyLocalStorage = () => {
    console.log("localStorage destroyed!");
    setDropdownOpen(false);
    navigate("/auth/login");
    localStorage.clear();
  };

  return (
    <>
      <header className="flex w-full justify-between items-center bg-white shadow-md">
        <div>
          <Link to="/">
            <img className="rounded-lg" width={130} src="/assets/logo.png" alt="logo-not-found" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:mt-2 me-5">
          <ul className="flex items-center gap-8">
            <li>
              <Link to="/" className="text-lg text-gray-700 hover:text-blue-500 relative group">
                Home
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link to="/services" className="text-lg text-gray-700 hover:text-blue-500 relative group">
                Services
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
                  <Link to="/contact" className="text-lg text-gray-700 hover:text-blue-500 relative group">
                    Contact
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-lg text-gray-700 hover:text-blue-500 relative group">
                    About
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li>
                  <Link to="/FAQ" className="text-lg text-gray-700 hover:text-blue-500 relative group">
                    FAQ
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
            {!user ? (
              <>
                <li>
                  <Link to="/auth/login" className="text-lg text-gray-700 hover:text-blue-500 relative group">
                    Login
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li>
                  <Link to="/auth/sign-up" className="text-lg text-gray-700 hover:text-blue-500 relative group">
                    Sign up
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              </>
            ) : (
              <>
               
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-10 cursor-pointer h-10 rounded-full overflow-hidden border-2 border-gray-300 focus:outline-none"
                  >
                    <img  src={user.profilePicture ?`http://localhost:5000/uploads/profilePictures/${user.profilePicture}` : `/assets/user.webp`} alt="Profile" className="w-full h-full object-cover" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="text-sm font-semibold text-gray-800">{user.username}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>

                      <Link to={`/profile/${user._id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </Link>
                      <Link to={`/conversations`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Conversations  <span className="text-white bg-red-500 px-1 rounded-full">{unreadConvCount || '0'}</span>
                      </Link>
                      {user.role === "artisan" && (
                        <Link
                          to={`/services/artisan/${user._id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Services <span className="text-white bg-red-500 px-1 rounded-full">{artisanServicesCount || '0'}</span>
                        </Link>
                      )}
                      <Link to="/reservations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Reservations <span className="text-white bg-red-500 px-1 rounded-full">{reservationsCount || '0'}</span>
                      </Link>

                      <hr className="border-gray-300" />
                      <button
                        onClick={destroyLocalStorage}
                        className="w-full flex items-center cursor-pointer gap-2 px-4 py-2 text-sm text-red-500 transition-colors"
                      >
                        <FiLogOut className="text-base" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={toggleMenu}>
          {isMenuOpen ? (
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col gap-4 p-3">
          {user && (
              <li>
                <Link to={`/profile/${user._id}`} className="text-lg flex text-gray-700 hover:text-blue-500">
                  Profile
                </Link>
              </li>
            )}
            <li>
              <Link to="/services" className="text-lg text-gray-700 hover:text-blue-500">
                Services
              </Link>
            </li>
            <li>
                  <Link to="/contact" className="text-lg text-gray-700 hover:text-blue-500">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-lg text-gray-700 hover:text-blue-500">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/FAQ" className="text-lg text-gray-700 hover:text-blue-500">
                    FAQ
                  </Link>
                </li>
            {!user ? (
              <>
                <li>
                  <Link to="/auth/login" className="text-lg text-gray-700 hover:text-blue-500">
                    Login 
                  </Link>
                </li>
                <li>
                  <Link to="/auth/sign-up" className="text-lg text-gray-700 hover:text-blue-500">
                    SignUp 
                  </Link>
                </li>
              </>
            ) : (
              <>
                
                <li>
                  <button onClick={destroyLocalStorage} className="text-lg flex cursor-pointer flex-col justify-center items-center text-center text-gray-700 hover:text-blue-500">
                    Logout <br />
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;
