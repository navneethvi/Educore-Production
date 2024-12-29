import React, { FC, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useLocation } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";


export const PaymentSuccess: FC = () => {
  const navigate = useNavigate();



  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update window size dynamically for Confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect to courses after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/courses");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);
   

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* Confetti Animation */}
      <Confetti width={windowSize.width} height={windowSize.height} />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        {/* Lottie Animation */}
        <Player
          autoplay
          loop
          src="https://lottie.host/0a7ef40a-930f-4f2c-bf60-3f3eed1d087c/03xYNJilML.json"
          style={{ height: "400px", width: "400px" }}
        />

        {/* Success Message */}
        <h1>Payment Successful!</h1>
        <p>Redirecting to your courses in 5 seconds...</p>
      </div>
    </div>
  );
};
