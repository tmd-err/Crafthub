import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServicesAsync, refetchAllServices } from "../Redux/Slices/serviceSlice";
import { FaChevronDown, FaChevronUp, FaCogs, FaFilter, FaPlusCircle } from "react-icons/fa";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Service from "../components/Service/Service";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

const Services = () => {
  const navigate = useNavigate();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const { services, artisans, loading, error, hasMore } = useSelector(
    (state) => state.service
  );
  const user = JSON.parse(localStorage.getItem("user"));
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch initial services when the component mounts
  useEffect(() => {
    dispatch(refetchAllServices());
  }, [dispatch]);
  useEffect(() => {
    const savedScrollY = localStorage.getItem("servicesScrollY");
    if (savedScrollY) {
      window.scrollTo(0, parseInt(savedScrollY));
      sessionStorage.removeItem("servicesScrollY");
    }
  }, []);

  useEffect(() => {
    return () => {
      sessionStorage.setItem("servicesScrollY", window.scrollY);
    };
  }, []);
  // Handle the Fetch More button click
  const handleFetchMore = () => {
    setLoadingMore(true);
    dispatch(fetchServicesAsync());
  };

  // Reset loadingMore state when services are updated
  useEffect(() => {
    if (services.length > 0) {
      setLoadingMore(false);
    }
  }, [services]);

  // Filter services based on search query and advanced filters
  const filteredServices = services
    .filter((service) => {
      const title = service.title || '';
      const description = service.description || '';
      const provider = service.provider || '';
      const address = service.address || '' ;
      const city = service.city || '' ;
      const artisanUsername = (artisans.find(a => a._id === provider)?.username || '');

      return (
        title.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
        description.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
        provider.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
        address.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
        city.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
        artisanUsername.toLowerCase().includes(searchQuery?.toLowerCase() || '')
      );
    })
    .filter((service) => {
      if (category && service.category !== category) return false;
      if ((minPrice && service.price < minPrice) || (maxPrice && service.price > maxPrice)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      if (sortOption === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  const handleServiceClick = (service) => {
    if (user) {
      setSelectedService(service);
      setShowModal(true);
    } else {
      Swal.fire({
        title: "Login Required",
        text: "You need to be logged in to view this service.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/auth/login");
        }
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar with Filters */}
      <aside className="lg:w-1/5 p-4 lg:border-r border-gray-300">
        <h2 className="text-xl flex justify-center items-center gap-2 font-semibold mb-3 text-center">Filters <FaFilter className="text-sm"/> </h2>

        {/* Normal search */}
        <div className="mb-3">
          <label className="block text-sm text-gray-700">Search Services</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 text-sm border px-1 border-gray-300 rounded outline-0    "
            placeholder="by title, description ,location..."
            style={{ maxWidth: '100%' }}
          />
        </div>

        {/* Advanced Filter Button */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="w-full text-left cursor-pointer mb-2 rounded flex items-center gap-2 text-sm"
        >
          Advanced Filter{" "}
          {showAdvancedFilters ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {/* Advanced Filter Options (Toggleable) */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            showAdvancedFilters ? "max-h-full pe-5" : "max-h-0 p-0"
          } overflow-hidden rounded-md`}
        >
          {/* Category Filter */}
          <div className="mb-3">
            <label className="block text-sm text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded outline-0    "
            >
              <option value="">Select a Category</option>
              <option value="plumbing">Plumbing</option>
              <option value="carpentry">Carpentry</option>
              <option value="electrical">Electrical</option>
              <option value="painting">Painting</option>
            </select>
          </div>

          {/* Price Range Filters */}
          <div className="mb-3">
            <label className="block text-sm text-gray-700">Price Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded outline-0    "
                placeholder="Min Price"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded outline-0    "
                placeholder="Max Price"
              />
            </div>
          </div>

          {/* Sorting Options */}
          <div className="mb-3">
            <label className="block text-sm text-gray-700">Sort By</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded outline-0    "
            >
              <option value="">Select Sorting</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-4 text-center mb-6">
          Services <FaCogs />
        </h1>

        <div className="flex gap-4 items-center mb-6">
          <div>
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse-dot"></span> : Available
          </div>
          <div>
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse-dot"></span> : Not Available
          </div>
        </div>

        {user?.role === "artisan" && (
          <div className="mb-6 text-center">
            <Link to="/add-service">
              <button className="px-4 flex text-center cursor-pointer items-center gap-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Add a Service <FaPlusCircle />
              </button>
            </Link>
          </div>
        )}
{loading ? (
  <div className="text-center text-lg">
    <img src="/assets/loader.gif" alt="Loading..." className="w-16 mx-auto" />
  </div>
) : filteredServices.length === 0 ? (
  <div className="text-center text-lg">No services found.</div>
) : (
  <TransitionGroup component="div" className="grid lg:grid-cols-2 gap-5">
    {filteredServices.map((service) => (
      <CSSTransition key={service._id} timeout={500} classNames="fade">
        <Service 
          key={service._id}
          service={service} 
          artisan={artisans.find(a => a._id === service.provider)}  // Assuming artisan is fetched or available in your parent component
          user={user}  // Similarly assuming user is available here
          onClick={() => handleServiceClick(service)} 
        />
      </CSSTransition>
    ))}
  </TransitionGroup>
)}


        {hasMore && (
          <div className="mt-6 text-center">
            <button
              onClick={handleFetchMore}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              disabled={loadingMore}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </main>

      {/* Modal for Viewing Service Details */}
      {showModal && selectedService && (
        <Modal service={selectedService} setShowModal={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Services;
