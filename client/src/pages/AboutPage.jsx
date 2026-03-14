// client/pages/AboutPage.jsx

import React from 'react';

const AboutPage = () => {
  return (
    // Add pt-24 (padding-top) and container classes
    <div className="max-w-4xl mx-auto p-4 pt-24">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-200
                      dark:bg-gray-800 dark:border-gray-700">
        
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 pb-4 border-b dark:border-gray-700">
          About Connect Sphere
        </h1>
        
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Connect Sphere was founded on the simple idea that trading within the university community should be easy, trustworthy, and free. We recognized the frustration of navigating external marketplaces when all you need is a reliable peer on your campus.
        </p>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 border-b dark:border-gray-700 pb-2">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300">
            To provide a seamless, secure, and hyperlocal platform where students can manage all their buying and selling needs, fostering a closed-loop economy that benefits the entire campus community.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 border-b dark:border-gray-700 pb-2">Why We Are Different</h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 ml-4 space-y-2">
            <li>**Full MERN Stack:** Built on a robust, modern, and scalable architecture.</li>
            <li>**Real-Time Trust:** Instant chat and user rating systems built to protect both buyer and seller.</li>
            <li>**Cost-Free:** No listing fees, no commissions. 100% peer-to-peer.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;