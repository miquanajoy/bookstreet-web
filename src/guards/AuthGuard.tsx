import { FC, PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/userAuth";
type ProtectedRouteProps = PropsWithChildren;

export default function AuthGuard({ children }: ProtectedRouteProps) {
    const user = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.isInitialized) {
            navigate('/', { replace: true });
        }
    }, [navigate, user]);
    if (!user.isInitialized) return <>You dont have permission</>;

    return (<>{children}</>);
}