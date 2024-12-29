import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";



interface TutorProtectedProps {
  children: ReactNode;
}


const TutorProtected: React.FC<TutorProtectedProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {tutorToken} = useSelector((state: RootState) => state.tutor);

  useEffect(() => {
    if (!tutorToken) {
      navigate("/tutor/signin", { replace: true, state: location.state });
      return;
    }
  }, [tutorToken]);

  if (tutorToken) {
    return children;
  } else {
    return null;
  }
};

export default TutorProtected;