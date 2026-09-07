import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const PrivateRouter = () => {
  const location = useLocation();
  const [status, setStatus] = useState(() =>
    localStorage.getItem("zapshift_current_user") ? "authenticated" : "checking"
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setStatus(user ? "authenticated" : "unauthenticated");
    });
    return () => unsubscribe();
  }, []);

  if (status === "authenticated") return <Outlet />;
  if (status === "checking") return null;
  return <Navigate to="/login" replace state={{ from: location.pathname }} />;
};

export default PrivateRouter;