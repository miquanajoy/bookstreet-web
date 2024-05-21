import { FC, ReactNode } from "react";
import { useAuth } from "../hooks/userAuth";
import { Role } from "../models/Role";

export interface RoleBasedGuardProps {
    accessibleRoles: Array<string>;
    children: ReactNode;
}
const RoleBasedGuard: FC<RoleBasedGuardProps> = ({
    children,
    accessibleRoles,
}) => {
    const user = useAuth();
    if (!accessibleRoles.includes(user!.role)) {
        return (
            <div>
                <div>Permission Denied</div>
                You do not have permission to access this page
            </div >
        );
    };
    return <>{children}</>;
}
export default RoleBasedGuard;
