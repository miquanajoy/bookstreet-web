import { FC, ReactNode } from "react";
import { useAuth } from "../hooks/userAuth";
import { Role } from "../models/Role";
import { redirect } from "react-router-dom";

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
        <div>Quyền bị từ chối</div>
       <div>Bạn không có quyền truy cập vào trang này</div>
      </div>
    );
  }
  return <>{children}</>;
};
export default RoleBasedGuard;
