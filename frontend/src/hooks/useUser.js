import { useContext } from "react";

import { AuthContext } from "../context/auth.context";


const useAuthHook = () => {
    return useContext(AuthContext);
}

export default useAuthHook

