import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import {
  fetchStudentPortalData,
  setStudentDataState,
} from "../../redux/roaster/roasterSlice";

import { StudentHeaderBanner } from "./components/StudentHeaderBanner";
import { StudentProfileSection } from "./components/StudentProfileSection";
import { StudentDocumentsSection } from "./components/StudentDocumentsSection";
import { StudentResultsSection } from "./components/StudentResultsSection";
import { StudentAwardsSection } from "./components/StudentAwardsSection";
import { StudentPermissionsSection } from "./components/StudentPermissionsSection";
import { StudentAttendanceSection } from "./components/StudentAttendanceSection";
import { StudentPaymentsSection } from "./components/StudentPaymentsSection";
import { StudentFeedbackSection } from "./components/StudentFeedbackSection";

export const StudentPortal: React.FC = () => {
  const { studentId, tab: routeTab } = useParams<{
    schoolId: string;
    studentId: string;
    tab?: string;
  }>();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { currentUser, studentData } = useAppSelector(
    (state) => state.roaster,
  );

  // Determine active sub-tab from route path
  const currentPath = location.pathname;
  let activeTab = "profile";
  if (currentPath.includes("/documents")) activeTab = "documents";
  else if (currentPath.includes("/results")) activeTab = "results";
  else if (currentPath.includes("/awards")) activeTab = "awards";
  else if (currentPath.includes("/permissions")) activeTab = "permissions";
  else if (currentPath.includes("/attendance")) activeTab = "attendance";
  else if (currentPath.includes("/payments")) activeTab = "payments";
  else if (currentPath.includes("/feedback")) activeTab = "feedback";
  else if (routeTab) activeTab = routeTab;

  useEffect(() => {
    dispatch(
      fetchStudentPortalData({
        studentId,
        email: currentUser?.email,
      }),
    );
  }, [currentUser?.email, studentId, dispatch]);

  const updateStudentState = (data: any) => {
    dispatch(setStudentDataState(data));
  };

  const student = studentData || currentUser || {};
  const studentName =
    student.fullName ||
    (student.firstName
      ? `${student.firstName} ${student.lastName || ""}`
      : student.name) ||
    "Student Profile";

  const renderDocuments = () => (
    <StudentDocumentsSection
      student={student}
      setStudentData={updateStudentState}
      activeTab={activeTab}
    />
  );

  return (
    <div style={{ padding: "8px 0" }}>
      <StudentHeaderBanner
        student={student}
        studentName={studentName}
        currentUser={currentUser}
      />

      {activeTab === "profile" && (
        <StudentProfileSection
          student={student}
          studentName={studentName}
          currentUser={currentUser}
          renderDocumentsSection={renderDocuments}
        />
      )}

      {activeTab === "documents" && renderDocuments()}
      {activeTab === "results" && <StudentResultsSection />}
      {activeTab === "awards" && <StudentAwardsSection />}
      {activeTab === "permissions" && <StudentPermissionsSection />}
      {activeTab === "attendance" && <StudentAttendanceSection />}
      {activeTab === "payments" && <StudentPaymentsSection student={student} />}
      {activeTab === "feedback" && <StudentFeedbackSection />}
    </div>
  );
};

export default StudentPortal;
