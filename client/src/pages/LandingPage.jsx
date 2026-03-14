// client/pages/LandingPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

// --- Placeholder images ---
const heroImageUrl = "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974&auto=format&fit=crop";
const featureHyperlocal = "https://images.unsplash.com/photo-1504711331083-9c895941bf81?q=80&w=1770&auto=format&fit=crop";
const featureChat = "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1760&auto=format&fit=crop";
const featureSecure = "https://images.unsplash.com/photo-1556742518-a6b1c06248a3?q=80&w=1770&auto=format&fit=crop";
// ---

const LandingPage = () => {
  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section 
        className="relative flex items-center justify-center h-screen bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 flex flex-col items-center text-center p-4">
          <h1 
            className="text-5xl md:text-7xl font-extrabold mb-4 animate-in fade-in slide-in-from-top-4 duration-1000"
          >
            Connect Sphere
          </h1>
          <p 
            className="text-xl md:text-2xl text-gray-200 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200"
          >
            Your Hyperlocal, Cost-Free Marketplace for the University Community.
          </p>
          <Link
            to="/market"
            className="px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-full 
                       hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 
                       shadow-lg animate-in fade-in scale-95 duration-1000 delay-300"
          >
            Start Browsing
          </Link>
        </div>
      </section>

      {/* 2. "WHY CONNECT SPHERE" SECTION (Corrected) */}
      <section className="py-24 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 space-y-24">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white">
            Why Connect Sphere?
          </h2>

          {/* Feature 1: Hyperlocal (Text Left, Image Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="animate-in fade-in slide-in-from-left duration-500">
              <span className="text-4xl">🎓</span>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 mb-4">Truly Hyperlocal</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Forget the noise and the scams. Every listing is from a student at your university. Buy, sell, and trade with the people you see on campus every day.
              </p>
            </div>
            <img 
              src={featureHyperlocal} 
              alt="University Campus" 
              className="rounded-xl shadow-2xl w-full h-80 object-cover animate-in fade-in slide-in-from-right duration-500" 
            />
          </div>

          {/* Feature 2: Real-Time Chat (Image Left, Text Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="animate-in fade-in slide-in-from-right duration-500 md:order-last">
              <span className="text-4xl">💬</span>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 mb-4">Instant Private Chat</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Secure, persistent, and private one-on-one chats with sellers. No need to give out your phone number or social media. All your conversations live right here.
              </p>
            </div>
            <img 
              src={featureChat} 
              alt="Students chatting" 
              className="rounded-xl shadow-2xl w-full h-80 object-cover animate-in fade-in slide-in-from-left duration-500" 
            />
          </div>
          
          {/* Feature 3: Secure & Free (Text Left, Image Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="animate-in fade-in slide-in-from-left duration-500">
              <span className="text-4xl">🛡️</span>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 mb-4">Secure, Free, & Built for You</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                With a user review system and a platform built on modern, secure technology, you can trade with confidence. And it's 100% free. No listing fees, no commissions.
              </p>
            </div>
            <img 
              src={featureSecure} 
              alt="Secure transaction" 
              className="rounded-xl shadow-2xl w-full h-80 object-cover animate-in fade-in slide-in-from-right duration-500" 
            />
          </div>
          
        </div>
      </section>
      
      {/* 3. "GET STARTED" & "JOIN" SECTION */}
      <section 
        className="min-h-screen py-24 flex flex-col justify-center bg-gray-100 dark:bg-gray-900 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Column 1: Get Started in 3 Clicks */}
            <div className="animate-in fade-in slide-in-from-left duration-500">
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
                Get Started
              </h2>
              <div className="flex flex-col space-y-8">
                {/* Step 1 */}
                <div className="flex items-start p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl">
                  <span className="text-5xl font-extrabold text-blue-300 dark:text-blue-600 w-12 text-left">1</span>
                  <div className="ml-4">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Create Your Account</h3>
                    <p className="text-gray-600 dark:text-gray-300">Sign up in seconds with your university email.</p>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="flex items-start p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl">
                  <span className="text-5xl font-extrabold text-blue-400 dark:text-blue-500 w-12 text-left">2</span>
                  <div className="ml-4">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Post or Browse</h3>
                    <p className="text-gray-600 dark:text-gray-300">List your item with multiple photos or browse what's for sale.</p>
                  </div>
                </div>
                {/* Step 3 */}
                <div className="flex items-start p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl">
                  <span className="text-5xl font-extrabold text-blue-500 dark:text-blue-400 w-12 text-left">3</span>
                  <div className="ml-4">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Connect & Chat</h3>
                    <p className="text-gray-600 dark:text-gray-300">Start a private chat instantly to make a deal.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Join Your University's Marketplace Today */}
            <div 
              className="p-10 flex flex-col items-center justify-center text-center bg-blue-600 text-white rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-500"
              style={{backgroundImage: `linear-gradient(rgba(29, 78, 216, 0.8), rgba(29, 78, 216, 0.8)), url(${featureChat})`, backgroundSize: 'cover'}}
            >
              <h2 className="text-4xl font-bold mb-6">
                Join Your University's Marketplace Today
              </h2>
              <p className="text-lg text-blue-100 mb-8">
                Become part of a trusted community of students.
              </p>
              <Link
                to="/register"
                className="px-10 py-4 bg-white text-blue-600 font-bold text-lg rounded-full hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Sign Up Now
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;