"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsOpen(true);
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for the fade-out animation to complete before unmounting
    setTimeout(() => setIsOpen(false), 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative">
        {/* Animated background elements */}
        <div className="absolute -inset-4 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-2xl opacity-70 blur-xl animate-pulse"></div>
          <div className="absolute inset-0.5 bg-white dark:bg-gray-900 rounded-xl"></div>
        </div>

        <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-500 ease-out hover:scale-[1.02] border border-gray-100 dark:border-gray-700">
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" />
          </button>

          <div className="relative z-10 text-center">
            {/* Lottery ticket icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-500">
                <svg 
                  className="w-14 h-14 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15 3a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-2a2 2 0 0 0-2-2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2a2 2 0 0 0 2-2V5a2 2 0 0 1 2-2h6zm-6 2H9v10h10V5H9zm2 2h6v6h-6V7zm-8 4H3v6h6v-2H5v-2h2v-2H5v-2z" />
                </svg>
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-pink-500">
              Welcome to Raj Lottery
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              Thank you for visiting our website. We hope you have a fantastic
              experience!
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(10px, -10px) scale(1.1);
          }
          66% {
            transform: translate(-10px, 10px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
