import React from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "../helpers/cookies";
import { useAppSelector } from "../redux/store";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const token = getCookie("token");
  const { currentUser, currentSchool } = useAppSelector(
    (state) => state.roaster,
  );

  if (token) {
    const user = currentUser || currentSchool;
    const schoolSlug =
      user?.school_id ||
      user?.schoolId ||
      user?.company_id ||
      user?.id ||
      "greenwood-high";

    if (user?.role === "school") {
      return <Navigate to={`/${schoolSlug}/teachers`} replace />;
    }
    if (user?.role === "student") {
      const studentId = user?.id || "me";
      return (
        <Navigate to={`/${schoolSlug}/student/${studentId}/profile`} replace />
      );
    }
    return <Navigate to={`/${schoolSlug}/dashboard`} replace />;
  }

  return <>{children}</>;
};
