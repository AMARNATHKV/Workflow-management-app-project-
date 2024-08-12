import React from "react";
import { Link } from "react-router-dom";
import Logo from '../assets/images/home.webp'
const HomePage = () => {
  return (
    <div className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-100 min-h-screen flex items-center justify-center">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-4">
        <div className="md:w-1/2 md:pr-8 text-center md:text-left animate__animated animate__fadeInLeft">
          <h1 className="font-bold text-3xl md:text-4xl font-sans text-black hover:text-blue-500 mt-4 md:mt-8 transition duration-300">
            Integrate Teams, Tasks, and Projects Seamlessly with TaskNest
          </h1>
          <p className="font-bold text-lg md:text-xl font-sans text-gray-700 mb-4">
            Visually map workflows, track progress, and ensure nothing gets lost in the shuffle.
          </p>
          <Link to="/login" target="_blank">
            <button className="inline-block bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 md:px-10 py-3 md:py-4 rounded-full focus:outline-none hover:shadow-xl transition duration-300 transform hover:scale-105">
              Get Started
            </button>
          </Link>
        </div>
        <div className="mt-4 md:mt-0 flex justify-center animate__animated animate__fadeInRight">
          <img src={Logo} alt="TaskNest" className="rounded-lg  transition duration-300 transform hover:scale-105" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
