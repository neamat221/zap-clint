import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase";
import useAxiosSecure from "../../Hok/UseAxiosSecure";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      localStorage.setItem(
        "zapshift_current_user",
        JSON.stringify({
          name: formData.name || userCredential.user.displayName,
          email: userCredential.user.email,
        })
      );

      let createdUser = null;
      try {
        const { data } = await axiosSecure.post("/users", {
          name: formData.name || userCredential.user.displayName,
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL || null,
        });
        createdUser = data;
      } catch {
        createdUser = null;
      }

      localStorage.setItem(
        "zapshift_current_user",
        JSON.stringify({
          name: createdUser?.name || formData.name || userCredential.user.displayName,
          email: userCredential.user.email,
          photoURL: createdUser?.photoURL || userCredential.user.photoURL || null,
          role: createdUser?.role || "User",
          _id: createdUser?._id || "",
        })
      );

      navigate("/dashboard");
    } catch (err) {
      let message = "Registration failed. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        message = "An account with this email already exists. Please login.";
      } else if (err.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      } else if (err.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      localStorage.setItem(
        "zapshift_current_user",
        JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        })
      );

      let existingUser = null;
      try {
        const { data } = await axiosSecure.get(`/users/${result.user.email}`);
        if (data && !data.error) existingUser = data;
      } catch {
        existingUser = null;
      }

      if (!existingUser) {
        try {
          const { data: created } = await axiosSecure.post("/users", {
            name: result.user.displayName || "",
            email: result.user.email,
            photoURL: result.user.photoURL || null,
          });
          existingUser = created;
        } catch {
          existingUser = null;
        }
      }

      localStorage.setItem(
        "zapshift_current_user",
        JSON.stringify({
          name: existingUser?.name || result.user.displayName || "",
          email: result.user.email,
          photoURL:
            existingUser?.photoURL || result.user.photoURL || null,
          role: existingUser?.role || "User",
          _id: existingUser?._id || "",
        })
      );

      navigate("/dashboard");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center p-4 md:p-8">
      <div className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
        {/* Left Form Section */}
        <div className="p-8 md:p-12 flex flex-col justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#C0E75A] rounded-md flex items-center justify-center font-black text-xs text-[#0B252C] transform -skew-x-12">
              Z
            </div>
            <span className="text-xl font-extrabold text-[#0B252C] tracking-tight">
              ZapShift
            </span>
          </div>

          {/* Form Content */}
          <div className="my-auto py-4 max-w-sm w-full mx-auto">
            <h1 className="text-3xl font-extrabold text-[#0B252C] mb-1">
              Create an Account
            </h1>
            <p className="text-xs text-gray-500 mb-4 font-medium">
              Register with ZapShift
            </p>

            {/* Profile Image Upload Circle */}
            <div className="mb-4">
              <label className="relative cursor-pointer inline-block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden relative group">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="relative">
                      <svg
                        className="w-6 h-6 text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      <div className="absolute -bottom-1 -right-1 bg-[#C0E75A] rounded-full p-0.5 border border-white">
                        <svg
                          className="w-2.5 h-2.5 text-[#0B252C]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors placeholder-gray-300"
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors placeholder-gray-300"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors placeholder-gray-300 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              {error && (
                <p className="text-xs text-red-500 font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold text-xs py-2.5 rounded-lg transition-colors duration-200 shadow-xs mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Please wait..." : "Register"}
              </button>

              {/* Login Link */}
              <p className="text-xs text-center text-gray-500 pt-1">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#84A927] font-semibold hover:underline"
                >
                  Login
                </Link>
              </p>

              {/* Divider */}
              <div className="text-center text-xs text-gray-400 my-2">Or</div>

              {/* Google Register Button */}
              <button
                type="button"
                onClick={handleGoogleRegister}
                className="w-full bg-[#EBEEF2] hover:bg-[#e0e4ea] text-[#0B252C] font-semibold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path
                    fill="#FFC107"
                    d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                  />
                </svg>
                Register with google
              </button>
            </form>
          </div>

          <div />
        </div>

        {/* Right Illustration Section */}
        <div className="bg-[#F5FAEE] hidden md:flex items-center justify-center p-8 relative">
          <div className="w-full max-w-sm aspect-square relative flex items-center justify-center">
            <div className="w-72 h-72 rounded-full bg-[#A3C86A]/30 absolute blur-2xl -z-0" />

            <svg
              viewBox="0 0 300 300"
              className="w-full h-full relative z-10 drop-shadow-sm"
              fill="none"
            >
              <path
                d="M150 30 C220 30 270 80 270 150 C270 220 210 270 150 270 C80 270 30 220 30 150 C30 80 80 30 150 30 Z"
                fill="#94BD4B"
                opacity="0.8"
              />
              <rect x="190" y="100" width="60" height="130" rx="20" fill="#2D2B6B" />
              <circle cx="220" cy="80" r="20" fill="#E8B08D" />
              <path d="M200 65 Q220 50 240 65" fill="#1A184B" />
              <rect x="80" y="120" width="55" height="110" rx="15" fill="#2F70D8" />
              <circle cx="107" cy="98" r="18" fill="#E8B08D" />
              <path d="M90 90 Q107 75 125 90" fill="#522C1B" />
              <rect
                x="130"
                y="135"
                width="60"
                height="45"
                rx="6"
                fill="#C5EE61"
                stroke="#2D2B6B"
                strokeWidth="3"
              />
              <line
                x1="160"
                y1="135"
                x2="160"
                y2="180"
                stroke="#2D2B6B"
                strokeWidth="3"
              />
              <path
                d="M150 50 C140 50 132 58 132 68 C132 80 150 95 150 95 C150 95 168 80 168 68 C168 58 160 50 150 50 Z"
                fill="#FFFFFF"
              />
              <circle cx="150" cy="66" r="6" fill="#94BD4B" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
