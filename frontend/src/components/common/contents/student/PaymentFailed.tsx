import React, { FC, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import { Player } from '@lottiefiles/react-lottie-player';

const PaymentFailed: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract failure reason from state
  const failureReason = location.state?.reason || "Something went wrong with your payment.";

  useEffect(() => {
    // Redirect to the homepage after 5 seconds
    const timer = setTimeout(() => {
      navigate('/courses');
    }, 5000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={100} // Reduced confetti pieces for a subdued "failure" effect
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <Player
          autoplay
          loop
          src="https://lottie.host/a2bf0fa7-4f4a-4562-b6ef-cbdf7a0f0809/kSewQDWslk.json" // Replace with your preferred failure Lottie file
          style={{ height: '300px', width: '300px' }}
        />
        
        <h1 style={{ color: 'red' }}>Payment Failed</h1>
        <p>{failureReason}</p>
        <p>Redirecting to the homepage in 5 seconds...</p>
      </div>
    </div>
  );
};

export default PaymentFailed;
