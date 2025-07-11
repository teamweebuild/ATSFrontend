import React, { useState } from 'react';
import pattern from '../assets/Pattern 01.png';
import {useAuthStore} from '../store/useAuthStore.js';
import { useNavigate } from 'react-router-dom';
import axios from '../services/axiosInstance';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('/auth/login', formData);
      const { token, user } = res.data;
      login({ token, user });
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="w-full flex h-screen">
      {/* Left Side Image */}
      <div className="w-1/3 hidden md:block">
        <img
          src={pattern}
          alt="Pattern background"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right Side Form */}
      <div className="flex flex-col justify-center flex-1 px-8 md:px-24 items-center">
        <div className="mb-8 flex flex-col mr-11 space-y-5">
          <p className="font-bold text-[#082777] text-[18px] text-start">
            Welcome to ATS Management System
          </p>
          <h1 className="text-3xl  text-[#2E4C98] text-[36px] font-light">
            Start Tracking. Stay Ahead.
          </h1>
        </div>

        <div className="flex w-full justify-center">
          <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
            <div className="relative">
              <label
                htmlFor="email"
                className="absolute font-semibold text-[12px] text-[#082777] bg-white px-1 left-3 -top-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="border border-gray-300 w-full px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-[16px] text-[#082777]"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="absolute font-semibold text-[12px] text-[#082777] bg-white px-1 left-3 -top-2"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="border border-gray-300 w-full px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-[16px] text-[#082777]"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end">
              <button type="button" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-72 bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
