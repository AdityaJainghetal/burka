import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../components/auth/authSlice'; // Adjust the import path as necessary
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select loading and error states from the Redux store
  const { isLoading, isError, message } = useSelector((state) => state.auth);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      dispatch(login(values)); // Dispatch the login action with form values
    },
  });

  // Effect to handle error messages and redirect on success
  useEffect(() => {
    if (isError) {
      toast.error(message); // Show error message using toast
      console.error(message); // Log error message to console
    }
  }, [isError, message]);

  useEffect(() => {
    if (!isError && message) {
      // Assuming a successful login returns a message or user data
      toast.success("Login successful!");
      navigate('/dashboard'); // Redirect to dashboard or another page
    }
  }, [message, isError, navigate]);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Login to Your Account</h2>

        {isError && (
          <div className="alert alert-danger py-2 text-center text-red-500" role="alert" aria-live="assertive">
            {message}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              required
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-500">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              required
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red -500">{formik.errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" className="form-checkbox rounded" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-500 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="#" className ="text-blue-500 hover:underline">Sign up</a>
        </p>
      </div>
      <ToastContainer /> {/* Toast container for notifications */}
    </div>
  );
};

export default Login;