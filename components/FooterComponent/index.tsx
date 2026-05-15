"use client";
import Link from "next/link";
import React from "react";

const FooterComponent: React.FC = () => {
  return (
    <footer className="relative w-full p-5 bg-primary text-center font-[family-name:var(--font-geist-sans)] mt-auto 2xl:container mx-auto">
      <div>
        <div className="p-[10px] border-2 rounded-[.75em]  border-[#ff0016] shadow-[0_0_20px_0_rgba(0,0,0,0.4)]">
          <div className="w-full border border-white bg-[#1A237E] rounded-[16px] z-10 flex justify-center items-center relative">
            <p className="text-white text-center m-0 font-bold text-[24px] leading-[1.2] font-[family-name:var(--font-geist-sans)] py-[6px] relative">
              -:DISCLAIMER:-
            </p>
          </div>
          <div className=" inset-x-0 left-0 bottom-0 h-[2em] mt-[-12px] w-full z-0 bg-[#ff0016] rounded-b-[16px]"></div>

          {/* <h2 className="text-xl font-bold rounded-[16px] py-[6px] justify-center items-center bg-[#1A237E] text-white">
            -:DISCLAIMER:-
          </h2> */}
        </div>
        <p className="mt-4 text-sm text-black font-semibold font-[family-name:var(--font-geist-sans)]">
          Visiting this site and browsing it is strictly recommended at your own
          risk. Every information available here is only according to
          informational purpose and based on astrology and number calculations.
          We are no associated or affiliated with any illegal Matka business. We
          make sure we follow all rules and regulations of the regions where you
          are accessing the website. There are also chances that the website may
          be banned in your area and after that if you are using it, you are
          solely dependable and responsible for any damage, loss or legal action
          taken.
        </p>
        <p className="mt-5 text-sm text-black font-semibold font-[family-name:var(--font-geist-sans)]">
          If you are the one who does not like our disclaimer it is advised that
          you leave our website immediately. Copying of any information/contents
          posted on the website is strictly prohibited and against the law.
        </p>
      </div>
      <div className="flex flex-col relative mt-5 ">
        <div className="w-full border border-white bg-[#1A237E] rounded-[16px] z-10 flex justify-center items-center relative shadow-[0_0_20px_0_rgba(0,0,0,0.4)]">
          <p className="text-white text-center m-0 font-bold text-[24px] leading-[1.1] font-[family-name:var(--font-geist-sans)] py-[6px]  relative">
            POWERED BY{" "}
            <Link href="https://dpboss24.in" rel="noopener noreferrer">
              dpboss24
            </Link>
          </p>
        </div>
        <div className="inset-x-0 left-0 bottom-0 h-[2em] mt-[-12px] w-full z-0 bg-[#ff0016] rounded-b-[16px] shadow-[0_0_20px_0_rgba(0,0,0,0.4)]"></div>

        {/* <h2 className="text-xl font-bold rounded-[16px] py-[6px] justify-center items-center bg-[#1A237E] text-white">
            -:DISCLAIMER:-
          </h2> */}
      </div>
    </footer>
  );
};

export default FooterComponent;
