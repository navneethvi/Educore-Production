import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";

import React from "react";

const Footer: React.FC = () => {
  return (
    <>
      <div className="footer-container px-6 md:px-20 py-10 flex flex-col md:flex-row justify-between items-start">
        <div className="left mb-6 md:mb-0">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            EDUCORE
          </h2>
          <p className="mt-2 text-gray-600 font-medium max-w-lg">
            Educore aims to revolutionize the way educators and learners
            interact and engage in the digital learning environment.
          </p>
          <div className="socials flex space-x-4 mt-5">
            <InstagramIcon className="text-gray-400 gradient-hover cursor-pointer" />
            <LinkedInIcon className="text-gray-400 gradient-hover cursor-pointer" />
            <FacebookIcon className="text-gray-400 gradient-hover cursor-pointer" />
            <XIcon className="text-gray-400 gradient-hover cursor-pointer" />
          </div>
        </div>
        <div className="right flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-20 text-left">
          <h2 className="font-bold">Services</h2>
          <h2 className="font-bold">About</h2>
          <h2 className="font-bold">Help</h2>
        </div>
      </div>
    </>
  );
};

export default Footer;
