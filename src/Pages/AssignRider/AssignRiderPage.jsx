import React from "react";
import Navbar from "../Sherd/Navbar/Navbar";
import Footer from "../Sherd/Footer/Footer";
import AssignRiders from "../Dashboard/AllDeliveries/AssignRiders";

const AssignRiderPage = () => {
  return (
    <>
      <Navbar />
      <div className="bg-[#EAEBED] min-h-screen flex flex-col text-[#0B252C]">
        <main className="flex-1 p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-black text-[#0B252C]">
              Assign Riders
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Assign approved riders to delivery parcels and manage accepted /
              rejected assignments.
            </p>
          </div>
          <AssignRiders />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AssignRiderPage;