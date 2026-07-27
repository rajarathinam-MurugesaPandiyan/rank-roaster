import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../pages/Login/Login";
import { SchoolLayout } from "../pages/Layout/Layout";
import { SchoolDashboard } from "../pages/Dashboard/Dashboard";
import { SchoolOnboarding } from "../pages/Onboarding/Onboarding";
import { SchoolClasses } from "../pages/Classes/Classes";
import { ProtectedRoute } from "./ProtectedRoute";
import { TeachersList } from "../pages/Teachers/TeachersList";
import { SchoolGrades } from "../pages/Grades/Grades";
import { GradesPage } from "../pages/Grades/GradesPage";
import { StudentsList } from "../pages/Students/StudentsList";
import { AcademicExams } from "../pages/Academic/Exams";
import { ExamResults } from "../pages/Academic/ExamResults";
import { SchoolFees } from "../pages/Fees/Fees";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main login page */}
        <Route path="/" element={<Login />} />

        {/* Protected school dashboard layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/:schoolId" element={<SchoolLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SchoolDashboard />} />
            <Route path="onboarding" element={<SchoolOnboarding />} />
            <Route path="classes" element={<SchoolClasses />} />
            <Route path="teachers" element={<TeachersList />} />
            <Route path="students" element={<StudentsList />} />
            <Route path="fees" element={<SchoolFees />} />
            <Route path="academic" element={<SchoolGrades />} />
            <Route
              path="academic/:academicYearId/exams"
              element={<AcademicExams />}
            />
            <Route
              path="academic/:academicYearId/exams/:examId/results"
              element={<ExamResults />}
            />
            <Route path="grades" element={<GradesPage />} />
          </Route>
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
