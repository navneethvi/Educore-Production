import React, { useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { RootState } from "../store/store";

interface AdminProtectedProps {
  children: ReactNode;
}

const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { adminToken } = useSelector((state: RootState) => state.admin);

  console.log("adminToken=>", adminToken);

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin/signin", { replace: true, state: location.state });
      return;
    }
  }, [adminToken]);

  if (adminToken) {
    return children;
  } else {
    return null;
  }
};

export default AdminProtected;