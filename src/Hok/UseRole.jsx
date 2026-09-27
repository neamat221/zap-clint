import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import UseAxiosSecure from "./UseAxiosSecure";
import { getCurrentUser, getRiders } from "./ClientStore";

const UseRole = () => {
  const axiosSecure = UseAxiosSecure();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const email = user?.email;
      if (!email) {
        setRole("");
        setLoading(false);
        return;
      }
      setLoading(true);
      Promise.all([
        axiosSecure.get(`/users/${email}`).catch(() => null),
        axiosSecure.get("/riders").catch(() => null),
      ])
        .then(([userRes, ridersRes]) => {
          const data = userRes?.data;
          const riderList = Array.isArray(ridersRes?.data)
            ? ridersRes.data
            : [];
          // Fall back to the browser store when the API is unreachable so the
          // assign-rider flow still works purely on the frontend.
          const fallbackUser = getCurrentUser();
          const fallbackRiders = getRiders();
          const approvedFrom = riderList.length ? riderList : fallbackRiders;
          const approvedRider = approvedFrom.find(
            (r) =>
              ["approved", "accepted"].includes(
                String(r.status || "").toLowerCase()
              ) &&
              String(r.email || "").toLowerCase() === email.toLowerCase()
          );
          const userRole = data?.role || fallbackUser?.role || "";
          setRole(
            String(userRole).toLowerCase() === "admin"
              ? userRole
              : approvedRider
              ? "Rider"
              : userRole
          );
        })
        .catch(() => {
          setRole("");
        })
        .finally(() => {
          setLoading(false);
        });
    });
    return () => unsubscribe();
  }, [axiosSecure]);

  return { role, loading, isAdmin: role.toLowerCase() === "admin" };
};

export default UseRole;
