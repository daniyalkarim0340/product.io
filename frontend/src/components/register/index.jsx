import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import authApi from "../../Api/authApi";
import useAuthHook from "../../hooks/useUser";
import Registerschema from "../../schema/register.schema.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  Loader2, 
  Eye, 
  EyeOff 
} from "lucide-react";

const RegisterPage = () => {
  const { isAuthenticated, setUser, setAccessToken } = useAuthHook();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(Registerschema),
    defaultValues: { role: "user" },
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      const res = await authApi.register(data);
      setUser(res.data.user || res.data.data || null);
      setAccessToken(res.data.accessToken || res.data.token || null);
      navigate("/dashboard");
    } catch (error) {
      console.error(error.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-12 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[480px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 rounded-[2.5rem] p-10"
      >
        {/* Navigation */}
        <button
          onClick={() => navigate("/")}
          className="group flex items-center text-gray-400 hover:text-blue-600 transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Create Account
          </h2>
          <p className="text-gray-500 mt-2 text-balance">
            Join us today! It only takes a minute to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={19} />
              <input
                type="text"
                {...register("name")}
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-2xl outline-none transition-all
                ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"}`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs font-medium ml-1">{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={19} />
              <input
                type="email"
                {...register("email")}
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-2xl outline-none transition-all
                ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"}`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs font-medium ml-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={19} />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`w-full pl-12 pr-12 py-3 bg-gray-50 border rounded-2xl outline-none transition-all
                ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"}`}
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs font-medium ml-1">{errors.password.message}</p>}
          </div>

          {/* Role Selector */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Account Type</label>
            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={19} />
              <select
                {...register("role")}
                className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none appearance-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer font-medium text-gray-700"
              >
                <option value="user">Individual (User)</option>
                <option value="business">Business Entity</option>
                <option value="admin">Administrator</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l5 5 5-5"/></svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 
            hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-3 mt-4"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              "Get Started"
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 pt-4">
            Already have an account?{" "}
            <button 
              type="button" 
              onClick={() => navigate("/login")}
              className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
            >
              Log in
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;