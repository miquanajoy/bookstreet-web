import { FC } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/userAuth";

const GuestGuard: FC<any> = (children) => {
    const { isInitialized, isAuthenticated } = useAuth();
    if(!isInitialized) return <>Loading</>;
    if(isAuthenticated) return <Navigate to="/books" />;
    return <>{children}</>
}

export default GuestGuard