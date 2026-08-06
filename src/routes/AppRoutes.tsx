import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../pages/Login/Login";
import { SchoolLayout } from "../pages/Layout/Layout";
import { SchoolDashboard } from "../pages/Dashboard/Dashboard";
import { SchoolOnboarding } from "../pages/Onboarding/Onboarding";
import { SchoolClasses } from "../pages/Classes/Classes";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { TeachersList } from "../pages/Teachers/TeachersList";
import { SchoolGrades } from "../pages/Grades/Grades";
import { GradesPage } from "../pages/Grades/GradesPage";
import { StudentsList } from "../pages/Students/StudentsList";
import { AcademicExams } from "../pages/Academic/Exams";
import { ExamResults } from "../pages/Academic/ExamResults";
import { SchoolFees } from "../pages/Fees/Fees";
import { StudentPortal } from "../pages/Student/StudentPortal";
import { SchoolEvents } from "../pages/Events/Events";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main login page (redirects to dashboard if already authenticated) */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

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
            <Route path="events" element={<SchoolEvents />} />
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

            {/* Student Specific Routes */}
            <Route path="profile" element={<StudentPortal />} />
            <Route path="documents" element={<StudentPortal />} />
            <Route path="results" element={<StudentPortal />} />
            <Route path="awards" element={<StudentPortal />} />
            <Route path="permissions" element={<StudentPortal />} />
            <Route path="attendance" element={<StudentPortal />} />
            <Route path="payments" element={<StudentPortal />} />
            <Route path="feedback" element={<StudentPortal />} />
            <Route path="student/:studentId" element={<StudentPortal />} />
            <Route path="student/:studentId/:tab" element={<StudentPortal />} />
          </Route>
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
