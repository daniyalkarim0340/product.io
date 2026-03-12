import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthHook from "../../hooks/useUser";

const GoogleAuth = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setAccessToken } = useAuthHook();
    // Use a ref to prevent the effect from running twice in React Strict Mode
    const hasProcessed = useRef(false);

    useEffect(() => {
        if (hasProcessed.current) return;

        const accessToken = searchParams.get("accessToken");
        const success = searchParams.get("success");
        const error = searchParams.get("error");

        if (error) {
            console.error("Auth Error:", error);
            navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
            return;
        }

        if (success === "true" && accessToken) {
            hasProcessed.current = true;
            
            // 1. Store the token
            setAccessToken(accessToken);
            
            // 2. Log and Navigate
            console.log("Google authentication successful");
            
            // replace: true prevents the user from clicking "back" into this loading screen
            navigate("/dashboard", { replace: true }); 
        } else {
            navigate("/login", { replace: true });
        }
    }, [searchParams, navigate, setAccessToken]);

    return (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 font-medium text-gray-600">Completing login, please wait...</p>
        </div>
    );
};

export default GoogleAuth;