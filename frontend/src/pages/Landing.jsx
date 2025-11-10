import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Search, Cloud } from 'lucide-react';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white mt-2">
      {/* Navigation */}
      <nav className="border-b border-border-light bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl sm:text-2xl font-bold text-text-primary">NoteSphere</div>
            <div className="flex space-x-2 sm:space-x-4">
              <Link 
                to="/login" 
                className="px-3 sm:px-6 py-2 text-sm sm:text-base text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-3 sm:px-6 py-2 text-sm sm:text-base bg-primary-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 mt-14">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4 sm:mb-6 leading-tight">
            Organize Your Ideas, Notes & Docs —<br className="hidden sm:block" />
            <span className="text-primary-blue">All in One Place.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-text-secondary mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            A smart workspace to capture, categorize and sync your notes effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 lg:mb-20 px-4">
            <Link 
              to="/signup"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-primary-blue text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
            >
              Get Started
            </Link>
            <Link 
              to="/login"
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-border-light text-text-primary rounded-lg font-semibold hover:border-primary-blue hover:text-primary-blue transition-all duration-200 text-center"
            >
              Login
            </Link>
          </div>

          {/* Ambient Workspace Illustration */}
          <div className="relative max-w-4xl mx-auto px-4">
            <div className="bg-surface-light rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-border-light shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white rounded-lg p-4 sm:p-6 border border-border-light shadow-sm">
                  <div className="w-full h-24 sm:h-32 bg-gradient-to-br from-primary-blue/10 to-secondary-purple/10 rounded-lg mb-3 sm:mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-2 sm:h-3 bg-text-secondary/20 rounded w-3/4"></div>
                    <div className="h-2 sm:h-3 bg-text-secondary/20 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 sm:p-6 border border-border-light shadow-sm">
                  <div className="w-full h-24 sm:h-32 bg-gradient-to-br from-secondary-purple/10 to-primary-blue/10 rounded-lg mb-3 sm:mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-2 sm:h-3 bg-text-secondary/20 rounded w-2/3"></div>
                    <div className="h-2 sm:h-3 bg-text-secondary/20 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 sm:p-6 border border-border-light shadow-sm sm:col-span-2 lg:col-span-1">
                  <div className="w-full h-24 sm:h-32 bg-gradient-to-br from-primary-blue/10 to-secondary-purple/10 rounded-lg mb-3 sm:mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-2 sm:h-3 bg-text-secondary/20 rounded w-1/2"></div>
                    <div className="h-2 sm:h-3 bg-text-secondary/20 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-surface-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-3 sm:mb-4">Everything you need to stay organized</h2>
            <p className="text-lg sm:text-xl text-text-secondary px-4">Powerful features designed for modern productivity</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-border-light shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-blue/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary-blue" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2 sm:mb-3">Authentication & Authorization</h3>
              <p className="text-sm sm:text-base text-text-secondary">Secure login with JWT tokens and role-based access control</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-border-light shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary-purple/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-purple" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2 sm:mb-3">Notes Management</h3>
              <p className="text-sm sm:text-base text-text-secondary">Create, edit, and organize your notes with rich text formatting</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-border-light shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-blue/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-primary-blue" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2 sm:mb-3">Search & Filter</h3>
              <p className="text-sm sm:text-base text-text-secondary">Find any note instantly with powerful search and filtering</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-border-light shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary-purple/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <Cloud className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-purple" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2 sm:mb-3">Cloud Sync</h3>
              <p className="text-sm sm:text-base text-text-secondary">Access your notes from anywhere with real-time synchronization</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;