// Components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4  w-full">
      <p>
        Data source:{" "}
        <a
          href="http://14.139.252.116:8080/appangr/openagr.htm"  
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Animal Genetic Resources of India
        </a>
      </p>
    </footer>
  );
};

export default Footer;
