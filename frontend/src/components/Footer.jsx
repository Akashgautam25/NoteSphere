import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white text-black border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Section - Logo & Description */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-black">NoteSphere</h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              At NoteSphere, we aim to simplify the way you create, organize, and access your notes. 
              From seamless note-taking to powerful organization tools, we're here to make your learning 
              experience smarter, more productive, and effortlessly accessible — anytime, anywhere.
            </p>
          </div>

          {/* Middle Section - Explore Links */}
          <div className='ml-28'>
            <h4 className="text-base sm:text-lg font-semibold text-black mb-4 sm:mb-6">
              Explore NoteSphere
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-black transition-colors duration-200 text-sm sm:text-base"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-700 hover:text-black transition-colors duration-200 text-sm sm:text-base"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/features" 
                  className="text-gray-700 hover:text-black transition-colors duration-200 text-sm sm:text-base"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-700 hover:text-black transition-colors duration-200 text-sm sm:text-base"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Section - Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-black mb-4 sm:mb-6">
              Get in Touch
            </h4>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <a 
                  href="tel:+918077554658" 
                  className="text-gray-700 hover:text-black transition-colors duration-200 text-sm sm:text-base break-all"
                >
                  +91 8077554658
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mt-0.5" />
                <a 
                  href="mailto:akashgautamm22@gmail.com" 
                  className="text-gray-700 hover:text-black transition-colors duration-200 text-sm sm:text-base break-all"
                >
                  akashgautamm22@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-6 sm:mt-8 pt-4 sm:pt-6">
          <p className="text-center text-gray-500 text-xs sm:text-sm">
            © 2025 <span className="font-medium text-black">NoteSphere.com</span> — All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
