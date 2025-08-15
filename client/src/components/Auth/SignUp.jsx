import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  setSignUpData,
  signUpAsync,
  setError,
  resetForm,
} from "../../Redux/slices/signUpSlice";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";

function SignUp() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.signUp);
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setSignUpData({ field: name, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.username) errors.username = "Username is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.phone) errors.phone = "Phone number is required";
    if (!profilePicture) errors.profilePicture = "Profile picture is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.passwordConfirmation) {
      errors.passwordConfirmation = "Confirmation is required";
    } else if (formData.password !== formData.passwordConfirmation) {
      errors.passwordConfirmation = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      dispatch(setError(errors));
      return;
    }

    const formPayload = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        if (["username", "email", "role"].includes(key)) {
          formPayload.append(key, formData[key].toLowerCase());
        } else {
          formPayload.append(key, formData[key]);
        }
      }
    }
    if (profilePicture) {
      formPayload.append("profilePicture", profilePicture);
    }

    try {
      const result = await dispatch(signUpAsync(formPayload)).unwrap();
      dispatch(resetForm());
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: result.message || "You have successfully signed up.",
        confirmButtonText: "OK",
      });
      navigate("/auth/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Sign-up Failed",
        text: err?.message || "Something went wrong. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen md:py-2 flex items-center justify-center bg-gray-100 px-4">
      <Helmet>
        <title>Craft Services | Sign-up</title>
      </Helmet>

      <div className="flex flex-col-reverse lg:flex-row items-center w-full max-w-6xl pe-4 md:pe-0 gap-8">
        <div className="w-full lg:w-1/2 hidden lg:flex">
          <img
            src="/assets/signup.png"
            alt="Service Image"
            className="w-full h-full object-cover rounded-lg animate-move-up-down"
          />
        </div>

        <div className="w-full lg:w-1/2 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Create an account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username and Email */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <label className="block text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {formData.errors.username}
                  </p>
                )}
              </div>

              <div className="w-full md:w-1/2">
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formData.errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Phone and Profile Picture */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <label className="block text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+212 0-000-00-000"
                  className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {formData.errors.phone}
                  </p>
                )}
              </div>

              <div className="w-full md:w-1/2">
                <label className="block text-gray-700 mb-1">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.size > 2 * 1024 * 1024) {
                      dispatch(
                        setError({ ...formData.errors, profilePicture: "Image must be < 2MB" })
                      );
                      return;
                    }
                    if (!file?.type.startsWith("image/")) {
                      dispatch(
                        setError({ ...formData.errors, profilePicture: "Only image files allowed" })
                      );
                      return;
                    }
                    setProfilePicture(file);
                    dispatch(setError({ ...formData.errors, profilePicture: "" }));
                  }}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                {formData.errors.profilePicture && (
                  <p className="text-red-500 text-sm mt-1">
                    {formData.errors.profilePicture}
                  </p>
                )}
              </div>
            </div>

            {/* Password and Confirm Password */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <label className="block text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    placeholder="Enter your password"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-500" />
                    ) : (
                      <FaEye className="text-gray-500" />
                    )}
                  </span>
                </div>
                {formData.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {formData.errors.password}
                  </p>
                )}
              </div>

              <div className="w-full md:w-1/2">
                <label className="block text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="passwordConfirmation"
                    value={formData.passwordConfirmation}
                    placeholder="Confirm your password"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-gray-500" />
                    ) : (
                      <FaEye className="text-gray-500" />
                    )}
                  </span>
                </div>
                {formData.errors.passwordConfirmation && (
                  <p className="text-red-500 text-sm mt-1">
                    {formData.errors.passwordConfirmation}
                  </p>
                )}
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-700 mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="client">Client</option>
                <option value="artisan">Artisan</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition-colors"
            >
              {formData.loading ? (
                <div className="flex items-center justify-center">
                  <p>Signing Up</p>
                  <img
                    width={20}
                    src="/assets/loader.gif"
                    alt="Loading..."
                    className="ml-2"
                  />
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
