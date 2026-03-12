import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import authApi from "../../Api/authApi";
import useAuthHook from "../../hooks/useUser";
import Loginschema from "../../schema/login.schema.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Add for smooth feel
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react"; // Modern Icons

const LoginPage = () => {
  const { isAuthenticated, setUser, setAccessToken } = useAuthHook();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(Loginschema),
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      const res = await authApi.login(data);
      setUser(res.data.user || null);
      setAccessToken(res.data.accessToken || res.data.token || null);
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 rounded-3xl p-10"
      >
        {/* Navigation */}
        <button
          onClick={() => navigate("/")}
          className="group flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to website
        </button>

        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome back
          </h2>
          <p className="text-gray-500 mt-2">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="email"
                {...register("email")}
                className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all
                ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"}`}
                placeholder="name@company.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs font-medium ml-1">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Forgot?</a>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`w-full pl-11 pr-12 py-3 bg-gray-50 border rounded-xl outline-none transition-all
                ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs font-medium ml-1">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-gray-200 
            hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "login"
            )}
          </button>
      <button
  type="button"
  onClick={() => window.location.href = "http://localhost:8080/api/v1/google"}
  // This tells the browser it's okay to send the origin info to your backend
  referrerPolicy="no-referrer-when-downgrade" 
  className="..." 
>
  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
  Continue with Google
</button>
          {/* Footer Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-600 font-bold hover:underline"
            >
              Sign up
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;