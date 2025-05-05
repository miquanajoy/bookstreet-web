import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export function useAuth() {
    // const context = useContext(AuthContext)
    const context:any = JSON.parse(localStorage.getItem("userInfo"))
    if(!context) {
        return {
            isInitialized: false,
            isAuthenticated: false,
            role: "no_thing"
        }
    }
    return {
        isInitialized: true,
        isAuthenticated: true,
        ...context
    };
}