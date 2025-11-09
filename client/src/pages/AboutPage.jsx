    // client/pages/AboutPage.jsx

import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-900 mb-6 border-b pb-4">About Connect Sphere</h1>
      
      <p className="text-lg text-gray-700 mb-6">
        Connect Sphere was founded on the simple idea that trading within the university community should be easy, trustworthy, and free. We recognized the frustration of navigating external marketplaces when all you need is a reliable peer on your campus.
      </p>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Our Mission</h2>
        <p className="text-gray-600">
          To provide a seamless, secure, and hyperlocal platform where students can manage all their buying and selling needs, fostering a closed-loop economy that benefits the entire campus community.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Why We Are Different</h2>
        <ul className="list-disc list-inside text-gray-600 ml-4 space-y-2">
          <li>**Hyperlocal Focus:** Only deals within your university community.</li>
          <li>**Real-Time Trust:** Instant chat and user rating systems built to protect both buyer and seller.</li>
          <li>**Cost-Free:** No listing fees, no commissions. 100% peer-to-peer.</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;