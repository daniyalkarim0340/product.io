import  { useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import  useAuthHook  from "../../hooks/useUser";

const GoogleAuth = () => {
    const navigate = useNavigate(); // Fixed spelling
    const [searchParams] = useSearchParams();
    const { setaccessToken } = useAuthHook();

    useEffect(() => {
        const accessToken = searchParams.get("accessToken");
        const error = searchParams.get("error");

        if (error) {
            // Fixed the template literal syntax
            navigate(`/login?error=${encodeURIComponent(error)}`);
            return;
        }

        if (accessToken) {
            setaccessToken(accessToken);
            navigate("/dashboard");
        } else {
            // Optional: If there's no token, redirect to login
            setaccessToken(null);
            navigate("/login");
        }
    }, [searchParams, navigate, setaccessToken]); // Added dependency array

    return (
        <div className="flex h-screen items-center justify-center">
            <p>Authenticating, please wait...</p>
        </div>
    );
};

export default GoogleAuth;