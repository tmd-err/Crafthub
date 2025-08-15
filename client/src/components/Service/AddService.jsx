import  { useRef, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addServiceAsync } from "../../Redux/Slices/serviceSlice";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AddService = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user")) || null; // Safe parsing
  const form = useRef();
  const [images, setImages] = useState([]);
  const [serviceData, setServiceData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    city: "",
    address: "",
    provider: user?._id || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!serviceData.title) newErrors.title = "Title is required";
    if (!serviceData.description) newErrors.description = "Description is required";
    if (!serviceData.price) newErrors.price = "Price is required";
    if (!serviceData.price<0) newErrors.price = "Price can't be negative";
    if (!serviceData.category) newErrors.category = "Category is required";
    if (!serviceData.city) newErrors.city = "City is required";
    if (!serviceData.address) newErrors.address = "Address is required";
    if (!serviceData.provider) newErrors.provider = "Must be authenticated to add a service";
    if (images.length === 0) {
      newErrors.images = "At least one image is required.";
    } else if (images.length > 3) {
      newErrors.images = "You can upload up to 3 images.";
    }
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    const formData = new FormData();
  
    // Add non-file fields to formData
    for (const key in serviceData) {
      if (serviceData[key]) {
        formData.append(key, serviceData[key]);
      }
    }
  
    // Ensure that images are appended to FormData correctly
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image); // Correct way to append files
      });
    }
    try {
      const result = await dispatch(addServiceAsync(formData)).unwrap();
  
      // Success
      setServiceData({
        title: "",
        description: "",
        price: "",
        category: "",
        city: "",
        address: "",
        provider: user?._id || "",
      });
      setImages([]);
      setErrors({});
  
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: result.message || "Service added successfully!",
        confirmButtonText: "OK",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.message || "Failed to add service. Try again!",
        confirmButtonText: "OK",
      });
    }
  };
  
  return (
    <div className="flex items-center justify-center p-5">
      <div className="w-full max-w-6xl p-8 rounded-lg md:shadow-lg ">
        <h1 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-3">
          <FaPlusCircle />
          Add a Service
        </h1>
        <form encType="multipart/form-data" ref={form} onSubmit={handleSubmit}  className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            {[
              { label: "Service Title", name: "title", type: "text" },
              { label: "Description", name: "description", type: "textarea" },
              { label: "Price", name: "price", type: "number" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                {type === "textarea" ? (
                  <textarea
                    id={name}
                    name={name}
                    value={serviceData[name]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                ) : (
                  <input
                    type={type}
                    {...(type === "number" ? { min: 0 } : {})}
                    id={name}
                    name={name}
                    value={serviceData[name]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
                {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]}</p>}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {[
              { label: "City", name: "city", type: "text" },
              { label: "Address", name: "address", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={serviceData[name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]}</p>}
              </div>
            ))}

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="category"
                name="category"
                value={serviceData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a Category</option>
                <option value="plumbing">Plumbing</option>
                <option value="carpentry">Carpentry</option>
                <option value="electrical">Electrical</option>
                <option value="painting">Painting</option>
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            {errors.provider && (
              <div className="text-red-600 text-sm">
                {errors.provider}
                <br />
                <Link to="/auth/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </div>
            )}
          </div>
          {/*Images field */}
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Images (1–3)
            </label>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                if (files.length > 3) {
                  Swal.fire("Limit Exceeded", "You can upload a maximum of 3 images.", "warning");
                  e.target.value = ""; // clear selection
                  setImages([]);
                  return;
                }
                setImages(files);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Add Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddService;