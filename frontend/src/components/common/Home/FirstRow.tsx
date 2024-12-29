import "../../../style.css";

import React from "react";

import { Link } from "react-router-dom";

const FirstRow: React.FC = () => {
  return (
    <>
      <div className="first-row-container flex flex-col-reverse md:flex-row justify-between overflow-hidden items-center md:items-start md:pl-20 md:mt-28 mt-16">
        <div className="left-side text-center md:text-left">
          <h1 className="text-4xl md:text-8xl">
            <span className="block font-reem-kufi text-gray-700">
              Embark on a
            </span>
            <span className="block font-reem-kufi text-gray-700 mt-4 md:mt-6">
              Journey of
            </span>
            <span className="font-reem-kufi text-gray-300 mt-4 md:mt-6 bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 rounded-br-3xl inline-block">
              Knowledge
            </span>
          </h1>
          <p className="w-full md:w-96 mt-6 md:mt-10 text-gray-600 font-medium">
            Join us and discover the limitless possibilities that await as you
            embark on a transformative quest for learning and personal growth.
          </p>
          <div className="flex justify-center md:justify-start mt-6 space-x-4">
            <Link to={'/signup'}>
              <button className="bg-gradient-to-r from-blue-500 to-blue-800 text-white px-4 py-2 rounded-lg hover:from-blue-800 hover:to-blue-500">
                START EDUCORE
              </button>
            </Link>
            <Link to={'/tutor/signup'}>
              <button className="bg-gradient-to-r from-blue-500 to-blue-800 text-white px-4 py-2 rounded-lg hover:from-blue-800 hover:to-blue-500">
                START TEACHING
              </button>
            </Link>
          </div>
        </div>
        <div className="right-side mt-6 md:mt-0 md:w-1/2 animate-move flex justify-center">
          <img
            src="/home-right.png"
            alt="Description of the image"
            className="w-3/4 sm:w-2/3 md:w-full lg:w-[90%] h-auto rounded-lg"
          />
        </div>
      </div>
    </>
  );
};

export default FirstRow;
