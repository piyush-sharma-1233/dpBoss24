"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import logo from "../../public/assets/images/dpboss24-logo.png";
import { useSession } from "next-auth/react";
import { doLogout } from "@/app/actions/action";

const HeaderComponent = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  const logout = async () => {
    await doLogout();
    window.location.reload();
  };
  return (
    <header>
      <nav className=" border-gray-200 px-4 lg:px-6 py-4 bg-black 2xl:container mx-auto">
        <div className="flex flex-wrap justify-between items-center  font-[family-name:var(--font-geist-sans)]">
          <Link href="/" className="flex items-center">
            <Image
              src={logo}
              width={300}
              height={100}
              className="h-16 w-auto object-contain"
              alt="DPBOSS24.IN Logo"
              unoptimized
            />
          </Link>
          <div className="flex items-center lg:order-2">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </button>
          </div>
          <div
            className={`${isMenuOpen ? "flex" : "hidden"
              } justify-between w-full flex-col lg:flex lg:w-auto`}
            id="mobile-menu-2"
          >
            <ul className="w-full flex flex-col gap-4 lg:gap-6 items-center justify-center mt-4 font-medium lg:flex-row lg:mt-0">
              <li>
                <Link
                  href="/"
                  className="py-3 text-white hover:opacity-50 text-lg font-semibold font-sans hover:border-[#FFF3C2] hover:border-b"
                  onClick={closeMenu}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/charts"
                  className="py-3 text-white hover:opacity-50 text-lg font-semibold font-sans hover:border-[#FFF3C2] hover:border-b"
                  onClick={closeMenu}
                >
                  Charts
                </Link>
              </li>
              {session ? (
                <>
                  <li>
                    <Link
                      href="/add-videos"
                      className="py-3 text-white hover:opacity-50 text-lg font-semibold font-sans hover:border-[#FFF3C2] hover:border-b"
                      onClick={closeMenu}
                    >
                      Add Videos
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/add-results"
                      className="py-3  text-white hover:opacity-50 text-lg font-semibold font-sans hover:border-[#FFF3C2] hover:border-b"
                      onClick={closeMenu}
                    >
                      Add Results
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="py-2 px-6 bg-red-500 text-lg font-semibold font-sans text-white rounded-md shadow-[0_0_20px_0_rgba(0,0,0,0.4)]"
                    >
                      Log Out
                    </button>
                  </li>
                </>
              ) : null}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderComponent;
