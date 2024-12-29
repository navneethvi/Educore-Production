import React, { useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../store/store";


interface StudentProtectedProps {
  children: ReactNode;
}

const StudentProtected : React.FC<StudentProtectedProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const  {studentToken}  = useSelector((state: RootState) => state.student);

  useEffect(() => {
    if (!studentToken) {
      navigate("/signin", { replace: true, state: location.state });
      return;
    }
  }, [studentToken]);

  if (studentToken) {
    return children;
  } else {
    return null;
  }
};

export default StudentProtected;
