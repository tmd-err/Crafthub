import  { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setLoginData, loginAsync, setError, resetForm } from "../../Redux/slices/loginSlice"; 
import {useNavigate ,Link} from "react-router-dom" ;
import {Helmet} from "react-helmet" ; 

function Login() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.login);
  const navigate = useNavigate() ;

  const [showPassword, setShowPassword] = useState(false); //show - hide password

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    // For checkbox, we check if it's checked or unchecked
    if (name === "stayConnected") {
      dispatch(setLoginData({ field: name, value: checked }));
    } else {
      dispatch(setLoginData({ field: name, value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear previous errors
    dispatch(setError(''));

    // Check for empty fields
    if (!formData.email || !formData.pswd) {
      dispatch(setError("Both email and password are required!"));
      return;
    }

    // Prepare data to match server's field names
    const requestData = {
      email: formData.email.toLowerCase(),
      pswd: formData.pswd.toLowerCase(),  // 'pswd' as per the server
      stayConnected: formData.stayConnected, // 'stayConnected' for stay connected option
    };

    // Dispatch the login request
    dispatch(loginAsync(requestData)).then((action) => {
      if (action.type === "login/loginAsync/fulfilled" && (action.payload != null || undefined) ) {
        // Reset form on successful login
        dispatch(resetForm());
        //set localStorage values , for authentication 
        localStorage.user = JSON.stringify(action.payload.find) ; 
        localStorage.token = action.payload.token ;
        navigate("/") ;
      }
    });
  };

  return (
    <div className=" md:p-10 flex items-center justify-center bg-gray-100">
  <Helmet>
    <title>Craft Services | Login</title>
  </Helmet>
  <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg w-full max-w-md">
    <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded outline-0 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-gray-700">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="pswd" // 'pswd' as per your server
            value={formData.pswd}
            onChange={handleChange}
            className="w-full p-2 border outline-0 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
          </span>
        </div>
      </div>

      {/* Stay Connected Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="stayConnected"
          name="stayConnected" // 'stayConnected' as per your requirement
          checked={formData.stayConnected}
          onChange={handleChange}
          className="mr-2"
        />
        <label htmlFor="stayConnected" className="text-gray-700">Stay connected</label>
      </div>
      
      {/* Error Message */}
      {formData.error && <p className="text-red-500 text-sm">{formData.error}</p>}

      {/* Submit Button */}
      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
        {formData.loading ? (
          <div className="flex items-center justify-center text-center">
            <p>Logging In </p>
            <img width={20} src="/assets/loader.gif" alt="" />
          </div>
        ) : "Login"}
      </button>
    </form>
    <div className="text-center">
     {"Don't "}have an account?{" "}
      <Link to="/auth/sign-up" className="text-blue-500">
        Sign-up
      </Link>
    </div>
  </div>

  {/* Image with animation */}
  <div className="w-1/2 hidden lg:block">
    <img
      src="/assets/signup.png"
      alt="Service Image"
      className="animate-move-up-down w-full h-full ms-20 rounded-4xl w"
    />
  </div>
</div>

  );
}

export default Login;
