import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { fakeUsers } from "../../data/fakeAccounts";

export default function Login() {
  const navigate = useNavigate(); // <- add this
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleLogin = () => {
    const user = fakeUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Redirect based on role
      switch (user.role) {
        case "operations":
          navigate("/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "accounting":
          navigate("/accounting/dashboard");
          break;
        case "purchasing":
          navigate("/purchasing/dashboard");
          break;
        default:
          alert("Role not found");
      }
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - IMAGE */}
      <div className="hidden lg:flex w-3/5 relative">
        <img
          src="/images/construction.png"
          alt="Construction"
          className="absolute inset-0 w-full h-full object-cover object-[center_10%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/50 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-16 text-white">
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Let’s turn your
            <br />
            dream into reality.
          </h1>
          <div className="w-20 h-1 bg-[#F7941F] mb-4 rounded-full"></div>
          <p className="text-sm opacity-90 max-w-md">
            Crafting modern excellence in every project we undertake.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="w-full lg:w-2/5 flex items-center justify-center bg-gray-50 px-8">
        <div className="w-full max-w-md">
          {/* Logo + Title */}
          <div className="flex items-center gap-3 mb-10">
            <img
              src="/images/logo.png"
              alt="Padrellos Logo"
              className="w-10 h-10 object-contain"
            />
            <h2 className="text-lg font-semibold tracking-wide">
              <span className="font-bold">PADRELLOS</span>{" "}
              <span className="font-medium text-gray-700">CONSTRUCTION</span>
            </h2>
          </div>

          {/* Welcome Text */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Welcome back!
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Please enter your credentials to access your dashboard.
            </p>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-2">Email</label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F7941F] focus:border-transparent bg-white"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-2">Password</label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F7941F] focus:border-transparent bg-white"
              />
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between mb-6 text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="accent-[#F7941F]"
              />
              Remember Me
            </label>

            <button className="text-[#F7941F] hover:underline">Forgot Password?</button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-[#F7941F] hover:opacity-90 transition text-white py-3 rounded-lg font-semibold shadow-sm"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}