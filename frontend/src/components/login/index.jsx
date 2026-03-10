
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import authApi from "../../Api/authApi";
import useAuthHook from "../../hooks/useUser";
import Loginschema from "../../schema/login.schema.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { isAuthenticated,setUser, setAccessToken } = useAuthHook();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(Loginschema),
  });

  useEffect(() => {

  
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])
  

  const onSubmit = async (data) => {
    try {
      const res = await authApi.login(data);
      setUser(res.data.user || null);
      setAccessToken(res.data.accessToken || res.data.token || null);
      navigate("/dashboard");

      console.log("Login Success fullly and thathh for login in and thejhsjhsj");
    } catch (error) {
      console.log(error.response?.data?.message || "Login failed  and there i an isssauisajkfsajfakj");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        
        <h2 className="text-2xl font-bold text-center mb-6">
          Login Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
              ${errors.email ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-300"}`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
              ${errors.password ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-300"}`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg 
            hover:bg-blue-700 transition duration-200"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;
