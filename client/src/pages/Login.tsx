import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const [currState, setCurrState] = useState<"Sign up" | "Login">("Sign up");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currState === "Sign up" && !agreed) return;

    setIsSubmitting(true);
    try {
      if (currState === "Sign up") {
        const success = await register({ fullname, email, password });
        if (success) {
          // no auto-login on the backend, so send them to log in
          setCurrState("Login");
          setPassword("");
        }
      } else {
        const success = await login({ email, password });
        if (success) navigate("/");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden px-4">
      {/* glow background */}
      <div className="absolute top-0 left-1/4 w-1506h-150violet-700/40 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 right-1/4 w-125 h-125 bg-indigo-700/30 rounded-full blur-[120px]"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-16 md:gap-28 w-full max-w-5xl">
        {/* Left branding */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-violet-500 to-purple-700 flex items-center justify-center relative">
            <div className="w-12 h-1.5 flex justify-center gap-1.5 absolute">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="w-2 h-2 rounded-full bg-white"></span>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-10 border-l-transparent border-r-10 border-r-transparent border-t-14 border-t-purple-700"></div>
          </div>
          <h1 className="text-3xl font-semibold text-white mt-3">QuickChat</h1>
        </div>

        {/* Right form */}
        <form
          onSubmit={onSubmitHandler}
          className="bg-[#0d0d12]/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4 shadow-2xl"
        >
          <h2 className="text-xl font-semibold text-white">{currState}</h2>

          {currState === "Sign up" && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              className="bg-transparent border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition-colors"
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-transparent border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition-colors"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="bg-transparent border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition-colors"
          />

          <button
            type="submit"
            disabled={isSubmitting || (currState === "Sign up" && !agreed)}
            className="bg-linear-to-r from-purple-400 to-violet-600 text-white font-medium text-sm py-3 rounded-lg mt-1 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Please wait..."
              : currState === "Sign up"
                ? "Create Account"
                : "Login Now"}
          </button>

          {currState === "Sign up" && (
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="accent-violet-600"
              />
              Agree to the terms of use &amp; privacy policy.
            </label>
          )}

          <div className="text-xs text-gray-500">
            {currState === "Sign up" ? (
              <p>
                Already have an account?{" "}
                <span
                  onClick={() => setCurrState("Login")}
                  className="text-violet-400 font-medium cursor-pointer hover:underline"
                >
                  Login here
                </span>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <span
                  onClick={() => setCurrState("Sign up")}
                  className="text-violet-400 font-medium cursor-pointer hover:underline"
                >
                  Sign up here
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
