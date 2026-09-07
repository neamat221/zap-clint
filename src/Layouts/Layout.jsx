import React from "react";
import { Outlet } from "react-router";
import Footer from "../Pages/Sherd/Footer/Footer";
import Navbar from "../Pages/Sherd/Navbar/Navbar";

const Layout = () => {
  return (
    <div className="py-5">
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default Layout;
