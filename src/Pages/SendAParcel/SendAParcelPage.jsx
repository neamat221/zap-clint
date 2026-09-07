import React, { useEffect, useState } from "react";
import SendAParcelForm from "./SendAParcel";
import MyParcels from "./MyParcels";
import PriceCalcForm from "../PricingCalculator/PriceCalcForm";
import TrackConsignment from "../TrackConsignment/TrackConsignment";
import UseAxiosSecure from "../../Hok/UseAxiosSecure";
import { auth } from "../../firebase";

const tabs = [
  { id: "send", label: "Send A Parcel" },
  { id: "my", label: "My Parcels" },
  { id: "track", label: "Track Consignment" },
];

const STORAGE_KEY = "zap_my_parcels";

const generateTrackingCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "01JWJVEXWZ";
  for (let i = 0; i < 9; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

const SendAParcelPage = () => {
  const axiosecure = UseAxiosSecure();
  const [activeTab, setActiveTab] = useState("send");
  const [activeView, setActiveView] = useState("form");
  const [draft, setDraft] = useState(null);
  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid || "";
    const fetchParcels = async () => {
      try {
        const { data } = await axiosecure.get("/parceals");
        if (Array.isArray(data)) {
          const scoped = uid ? data.filter((p) => !p.userId || p.userId === uid) : data;
          setParcels(scoped);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(scoped));
          return;
        }
      } catch (error) {
        console.error("Failed to fetch parcels:", error);
      }
      try {
        const cached = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const scoped = uid ? cached.filter((p) => !p.userId || p.userId === uid) : cached;
        setParcels(scoped);
      } catch {
        setParcels([]);
      }
    };
    fetchParcels();
  }, [axiosecure]);

  const handleParcelCreated = async (parcel) => {
    const saveLocal = (nextParcels) => {
      setParcels(nextParcels);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextParcels));
      setActiveTab("my");
    };

    const saved = { ...parcel };
    try {
      const { data } = await axiosecure.post("/parceals", parcel);
      if (data && typeof data === "object") {
        Object.assign(saved, data);
      }
    } catch (error) {
      console.error("Failed to create parcel:", error);
      alert("Booking saved locally. Could not sync with server!");
    }
    saveLocal([saved, ...parcels]);
  };

  const handleParcelRemove = async (parcel) => {
    const id = parcel._id || parcel.id;
    try {
      if (id) await axiosecure.delete(`/parceals/${id}`);
    } catch (error) {
      console.error("Failed to delete parcel:", error);
    }
    const nextParcels = parcels.filter(
      (p) => (p._id || p.id) !== id
    );
    setParcels(nextParcels);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextParcels));
  };

  const renderTab = () => {
    switch (activeTab) {
      case "send":
        if (activeView === "pricing" && draft) {
          const destination =
            draft.senderDistrict === draft.receiverDistrict
              ? "within"
              : "outside";
          return (
            <PriceCalcForm
              prefill={{
                parcelType: draft.parcelType === "document" ? "document" : "non-document",
                weight: draft.parcelWeight,
                destination,
              }}
              onBack={() => setActiveView("form")}
              onConfirm={({ cost }) => {
                const parcel = {
                  id: Date.now(),
                  trackingCode: generateTrackingCode(),
                  userId: auth.currentUser?.uid || "",
                  ...draft,
                  parcelType:
                    draft.parcelType === "document" ? "document" : "non-document",
                  deliveryCost: cost,
                  createdAt: new Date().toISOString(),
                  status: "Pending",
                };
                handleParcelCreated(parcel);
              }}
              confirmLabel="Proceed to Confirm Booking"
            />
          );
        }
        return (
          <SendAParcelForm
            onProceed={(formData) => {
              setDraft(formData);
              setActiveView("pricing");
            }}
          />
        );
      case "track":
        return <TrackConsignment />;
      case "my":
        return <MyParcels parcels={parcels} onRemove={handleParcelRemove} />;
      default:
        return null;
    }
  };

  return (
    <section>
      <div className="bg-[#EAEBED] py-5 px-4 md:px-12 flex justify-center">
        <div className="max-w-6xl w-full">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B252C] mb-1">
            Send A Parcel
          </h1>
          <p className="text-gray-500 text-xs md:text-sm mb-6">
            Book and manage your parcel deliveries from one place
          </p>

          {/* Inner Tab Navbar */}
          <nav className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-sm border border-gray-100 overflow-x-auto">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === "send") setActiveView("form");
                  }}
                  className={`px-5 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
                    active
                      ? "bg-[#C0E75A] text-slate-900"
                      : "text-gray-600 hover:text-slate-900 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="bg-[#EAEBED] py-5 px-4 md:px-12 flex justify-center items-start min-h-screen">
        <div className="w-full max-w-6xl">{renderTab()}</div>
      </div>
    </section>
  );
};

export default SendAParcelPage;