import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import useAxiosSecure from "../../Hok/UseAxiosSecure";
import logo from "../../assets/logo.png";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      localStorage.setItem(
        "zapshift_current_user",
        JSON.stringify({
          name: userCredential.user.displayName || "",
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL || null,
        })
      );

      let existingUser = null;
      try {
        const { data } = await axiosSecure.get(
          `/users/${userCredential.user.email}`
        );
        if (data && !data.error) existingUser = data;
      } catch {
        existingUser = null;
      }

      if (!existingUser) {
        try {
          const { data: created } = await axiosSecure.post("/users", {
            name: userCredential.user.displayName || "",
            email: userCredential.user.email,
            photoURL: userCredential.user.photoURL || null,
          });
          existingUser = created;
        } catch {
          existingUser = null;
        }
      }

      localStorage.setItem(
        "zapshift_current_user",
        JSON.stringify({
          name: existingUser?.name || userCredential.user.displayName || "",
          email: userCredential.user.email,
          photoURL:
            existingUser?.photoURL || userCredential.user.photoURL || null,
          role: existingUser?.role || "User",
          _id: existingUser?._id || "",
        })
      );

      navigate("/dashboard");
    } catch (err) {
      let message = "Sign-in failed. Please try again.";
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password"
      ) {
        message =
          "No account found with these credentials. Please register first before logging in.";
      } else if (err.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (err.code === "auth/too-many-requests") {
        message = "Too many attempts. Please try again later.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

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

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors placeholder-gray-300";

  return (
    <div className="bg-[#EAEBED] min-h-screen py-5 px-4 md:px-12 flex justify-center items-center">
      <div className="bg-white rounded-[32px] p-8 md:p-12 w-full max-w-md shadow-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src={logo} alt="ZapShift logo" className="h-8 w-auto" />
          <span className="text-xl font-bold tracking-tight text-slate-900">
            ZapShift
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-extrabold text-[#0B252C] mb-1">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-xs md:text-sm mb-6">
          Sign in to continue to ZapShift
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-xs text-red-500 font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
                className={`${inputClass} pr-10`}
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

          <div className="text-right">
            <button
              type="button"
              className="text-[11px] text-[#71C5C7] hover:underline font-semibold"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold text-sm py-2.5 rounded-xl transition-colors duration-200 shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-center text-xs text-gray-400">Or</div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#0B252C] font-semibold text-sm py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Sign in with Google
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#71C5C7] hover:underline font-bold"
          >
            Register first
          </Link>
        </p>

        <p className="text-xs text-gray-500 text-center mt-3">
          <Link to="/" className="text-[#71C5C7] hover:underline font-bold">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
