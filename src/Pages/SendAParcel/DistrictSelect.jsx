import React, { useState, useEffect, useRef } from "react";

const districts = [
  "Dhaka",
  "Faridpur",
  "Gazipur",
  "Gopalganj",
  "Kishoreganj",
  "Madaripur",
  "Manikganj",
  "Munshiganj",
  "Narayanganj",
  "Narsingdi",
  "Rajbari",
  "Shariatpur",
  "Tangail",
  "Bandarban",
  "Brahmanbaria",
  "Chandpur",
  "Chittagong",
  "Cumilla",
  "Cox's Bazar",
  "Feni",
  "Khagrachari",
  "Lakshmipur",
  "Noakhali",
  "Rangamati",
  "Bogura",
  "Joypurhat",
  "Naogaon",
  "Natore",
  "Chapainawabganj",
  "Pabna",
  "Rajshahi",
  "Sirajganj",
  "Bagerhat",
  "Chuadanga",
  "Jashore",
  "Jhenaidah",
  "Khulna",
  "Kushtia",
  "Magura",
  "Meherpur",
  "Narail",
  "Satkhira",
  "Barguna",
  "Barishal",
  "Bhola",
  "Jhalokathi",
  "Patuakhali",
  "Pirojpur",
  "Habiganj",
  "Moulvibazar",
  "Sunamganj",
  "Sylhet",
  "Dinajpur",
  "Gaibandha",
  "Kurigram",
  "Lalmonirhat",
  "Nilphamari",
  "Panchagarh",
  "Rangpur",
  "Thakurgaon",
  "Jamalpur",
  "Mymensingh",
  "Netrokona",
  "Sherpur",
];

const DistrictSelect = ({ value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = search
    ? districts.filter((d) =>
        d.toLowerCase().includes(search.trim().toLowerCase())
      )
    : districts;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs text-left appearance-none bg-white focus:outline-none focus:border-[#71C5C7] transition-colors cursor-pointer ${
          value ? "text-gray-700 font-medium" : "text-gray-400"
        }`}
      >
        {value || placeholder}
      </button>

      {!value && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      )}

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              type="text"
              placeholder="Search district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#F1F3F6] text-xs text-gray-700 focus:outline-none placeholder-gray-400"
            />
          </div>

          <ul className="max-h-[176px] overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-2.5 text-xs text-gray-400">
                No districts found
              </li>
            ) : (
              filtered.map((district) => (
                <li key={district}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(district);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs hover:bg-[#F1F3F6] transition-colors ${
                      value === district
                        ? "bg-[#C0E75A] text-[#0B252C] font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {district}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DistrictSelect;