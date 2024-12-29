import React from "react";

const FifthRow: React.FC = () => {
  return (
    <>
      <div className="about-us px-6 md:px-20 py-10 flex flex-col md:flex-row justify-between items-center">
        <div className="left text-center md:text-left">
          <h1 className="text-4xl md:text-7xl font-reem-kufi text-gray-700">
            About Us: Journey of Empowerment
          </h1>
        </div>
        <div className="right mt-6 md:mt-0 flex flex-col md:flex-row items-center md:space-x-8">
          <button className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-violet-600">
            How it Works?
          </button>
          <h1 className="font-reem-kufi text-gray-500 w-full text-center md:text-left md:w-80 mt-4 md:mt-0">
            We are passionate about helping students embark on a transformative journey toward achieving their goals.
          </h1>
        </div>
      </div>
    </>
  );
};


export default FifthRow;
