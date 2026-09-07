import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hok/UseAxiosSecure";
import { auth } from "../../firebase";
import agentPending from "../../assets/agent-pending.png";

const districts = [
  "Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur",
  "Manikganj", "Munshiganj", "Narayanganj", "Narsingdi", "Rajbari", "Shariatpur",
  "Tangail", "Jamalpur", "Mymensingh", "Netrokona", "Sherpur", "Bandarban",
  "Brahmanbaria", "Chandpur", "Chattogram", "Cumilla", "Cox's Bazar", "Feni",
  "Khagrachari", "Lakshmipur", "Noakhali", "Rangamati", "Bogra", "Joypurhat",
  "Naogaon", "Natore", "Nawabganj", "Pabna", "Rajshahi", "Sirajganj",
  "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh",
  "Rangpur", "Thakurgaon", "Habiganj", "Moulvibazar", "Sunamganj", "Sylhet",
  "Barishal", "Barguna", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur",
  "Bagerhat", "Chuadanga", "Jashore", "Jhenaidah", "Khulna", "Kushtia",
  "Magura", "Meherpur", "Narail", "Satkhira",
];

const regions = [
  "Dhaka", "Mymensingh", "Chattogram", "Rajshahi",
  "Rangpur", "Sylhet", "Barishal", "Khulna",
];

const BeARider = () => {
  const [search, setSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const axiosSecure = useAxiosSecure();
  const formRef = useRef(null);
  const accountEmail = auth.currentUser?.email || "";

  const filteredDistricts = districts.filter((d) =>
    d.toLowerCase().includes(search.toLowerCase())
  );

  const selectDistrict = (district) => {
    setSelectedDistrict(district);
    setSearch(district);
    setOpen(false);
    setErrors((prev) => ({ ...prev, district: false }));
  };

  const inputClass = (hasError) =>
    `w-full px-4 py-2.5 rounded-lg border text-xs text-gray-700 appearance-none bg-white focus:outline-none focus:border-[#71C5C7] transition-colors ${
      hasError ? "border-red-400" : "border-gray-200"
    }`;

  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const riderData = {
      name: form.name.value.trim(),
      drivingLicense: form.drivingLicense.value.trim(),
      email: accountEmail || form.email.value.trim(),
      region: form.region.value,
      district: selectedDistrict,
      nid: form.nid.value.trim(),
      phone: form.phone.value.trim(),
      bike: form.bike.value.trim(),
      bikeRegistration: form.bikeRegistration.value.trim(),
      about: form.about.value.trim(),
    };

    const requiredFields = [
      "name",
      "drivingLicense",
      "email",
      "region",
      "district",
      "nid",
      "phone",
      "bike",
      "bikeRegistration",
      "about",
    ];

    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!riderData[field]) newErrors[field] = true;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please complete all required fields before submitting.",
        confirmButtonColor: "#C0E75A",
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await axiosSecure.post("/riders", riderData);

      Swal.fire({
        icon: "success",
        title: "Application Submitted!",
        text: "Your application has been submitted, we will react to you within 7 days.",
        confirmButtonColor: "#C0E75A",
        confirmButtonText: "OK",
      }).then(() => {
        formRef.current?.reset();
        setSearch("");
        setSelectedDistrict("");
      });
    } catch (err) {
      console.error("Rider submission failed:", err);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#C0E75A",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#EAEBED] min-h-screen py-5 px-4 md:px-12 flex justify-center items-center">
      <div className="bg-white rounded-[32px] p-8 md:p-14 max-w-6xl w-full shadow-sm">
        {/* Header Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B252C] mb-2">
          Be a Rider
        </h1>
        <p className="text-gray-500 text-xs md:text-sm max-w-2xl mb-8 leading-relaxed">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>

        {/* Form & Illustration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-4 border-t border-gray-100">
          {/* Left Form Column */}
          <div className="lg:col-span-7">
            <h2 className="text-xl font-bold text-[#0B252C] mb-6">
              Tell us about yourself
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit} ref={formRef}>
              {/* Your Name */}
              <div>
                <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  onChange={() => clearError("name")}
                  className={inputClass(errors.name)}
                />
              </div>

              {/* Driving License Number */}
              <div>
                <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                  Driving License Number
                </label>
                <input
                  type="text"
                  name="drivingLicense"
                  placeholder="Driving License Number"
                  required
                  onChange={() => clearError("drivingLicense")}
                  className={inputClass(errors.drivingLicense)}
                />
              </div>

              {/* Your Email */}
              <div>
                <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={accountEmail}
                  readOnly
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors"
                />
              </div>

              {/* Your Region (Dropdown) */}
              <div>
                <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                  Your Region
                </label>
                <div className="relative">
                  <select name="region" required onChange={() => clearError("region")} className={inputClass(errors.region)}>
                    <option value="">Select your Region</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
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
                </div>
              </div>

              {/* Your District (Searchable Dropdown - all 64 districts) */}
              <div>
                <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                  Your District
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="district"
                    value={search}
                    placeholder="Search your District"
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setOpen(true);
                      setSelectedDistrict("");
                      clearError("district");
                    }}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 150)}
                    className={inputClass(errors.district)}
                  />
                  <div
                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400"
                    onClick={() => setOpen(!open)}
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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

                  {open && (
                    <ul className="absolute z-10 top-full mt-1 w-full max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                      {filteredDistricts.length > 0 ? (
                        filteredDistricts.map((district) => (
                          <li
                            key={district}
                            onMouseDown={() => selectDistrict(district)}
                            className={`px-4 py-2.5 text-xs cursor-pointer hover:bg-[#C0E75A]/30 transition-colors ${
                              selectedDistrict === district
                                ? "bg-[#C0E75A]/40"
                                : ""
                            }`}
                          >
                            {district}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2.5 text-xs text-gray-400">
                          No district found
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>

              {/* NID No */}
              <div>
                <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                  NID No
                </label>
                <input
                  type="text"
                  name="nid"
                  placeholder="NID"
                  required
                  onChange={() => clearError("nid")}
                  className={inputClass(errors.nid)}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  required
                  onChange={() => clearError("phone")}
                  className={inputClass(errors.phone)}
                />
              </div>

              {/* Bike Brand Model and Year */}
              <div>
                <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                  Bike Brand Model and Year
                </label>
                <input
                  type="text"
                  name="bike"
                  placeholder="Bike Brand Model and Year"
                  required
                  onChange={() => clearError("bike")}
                  className={inputClass(errors.bike)}
                />
              </div>

              {/* Bike Registration Number */}
              <div>
                <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                  Bike Registration Number
                </label>
                <input
                  type="text"
                  name="bikeRegistration"
                  placeholder="Bike Registration Number"
                  required
                  onChange={() => clearError("bikeRegistration")}
                  className={inputClass(errors.bikeRegistration)}
                />
              </div>

              {/* Tell Us About Yourself */}
              <div>
                <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                  Tell Us About Yourself
                </label>
                <input
                  type="text"
                  name="about"
                  placeholder="Tell Us About Yourself"
                  required
                  onChange={() => clearError("about")}
                  className={inputClass(errors.about)}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold text-xs py-3 rounded-xl transition-colors duration-200 shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>

          {/* Right Illustration Column */}
          <div className="lg:col-span-5 flex justify-center items-center lg:pt-12">
            <img
              src={agentPending}
              alt="Rider Illustration"
              className="w-full max-w-md object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeARider;
