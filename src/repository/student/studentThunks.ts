import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/api";

export interface StudentItem {
  id: string;
  schoolId: string;
  gradeId: string;
  admissionNo?: string;
  rollNo?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  fatherName: string;
  fatherPhone: string;
  fatherEmail?: string;
  motherName: string;
  motherPhone: string;
  motherEmail?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  guardianRelation?: string;
  address?: string;
  bloodGroup?: string;
  photoUrl?: string;
  documents?: Array<{ name: string; url: string; type?: string; delete_url?: string; file_key?: string }>;
  status: string;
  joinedAt?: string;
  academicYearId?: string;
  section?: string;
  enrollment?: {
    id: string;
    student_id: string;
    school_id: string;
    academic_year_id: string;
    grade_id: string;
    roll_no?: number;
    section?: string;
    status?: string;
    total_fees?: number;
    fees_paid?: number;
    remaining_fees?: number;
    joined_at?: string;
  };
}

export interface CreateStudentPayload {
  schoolId: string;
  gradeId: string;
  admissionNo?: string;
  rollNo?: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string; // string representation of time
  email?: string;
  phone?: string;
  fatherName: string;
  fatherPhone: string;
  fatherEmail?: string;
  motherName: string;
  motherPhone: string;
  motherEmail?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  guardianRelation?: string;
  address?: string;
  bloodGroup?: string;
  photoUrl?: string;
  status: string; // Active, Inactive, Graduated, Transferred
  joinedAt?: string;
  password?: string;
  academicYearId?: string;
  section?: string;
  totalFees?: number;
  feesPaid?: number;
  remainingFees?: number;
}

export interface FetchStudentsParams {
  schoolId: string;
  gradeId?: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface PaginatedStudentsResponse {
  students: StudentItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (payload: CreateStudentPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/students/create", payload);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Failed to create student";
      return rejectWithValue(message);
    }
  }
);

export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (params: FetchStudentsParams, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/students/school/${params.schoolId}`, {
        params: {
          gradeId: params.gradeId || undefined,
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || undefined,
          status: params.status || undefined,
        },
      });
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Failed to fetch students";
      return rejectWithValue(message);
    }
  }
);

export interface UpdateStudentPayload {
  id: string;
  schoolId?: string;
  gradeId: string;
  admissionNo?: string;
  rollNo?: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  fatherName: string;
  fatherPhone: string;
  fatherEmail?: string;
  motherName: string;
  motherPhone: string;
  motherEmail?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  guardianRelation?: string;
  address?: string;
  bloodGroup?: string;
  photoUrl?: string;
  status: string;
  joinedAt?: string;
  academicYearId?: string;
  section?: string;
  totalFees?: number;
  feesPaid?: number;
  remainingFees?: number;
}

export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async (
    { id, schoolId, ...payload }: UpdateStudentPayload,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/api/v1/students/${id}`, payload, {
        params: { schoolId },
      });
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Failed to update student";
      return rejectWithValue(message);
    }
  }
);

export interface UploadStudentDocumentPayload {
  name: string;
  file: File;
  student: any;
}

export const uploadStudentDocument = createAsyncThunk(
  "students/uploadDocument",
  async (
    { name, file, student }: UploadStudentDocumentPayload,
    { rejectWithValue }
  ) => {
    try {
      const studentId = student.id || student._id;
      const schoolId = student.schoolId || student.school_id;

      if (!studentId) {
        return rejectWithValue("Student ID is required to upload document");
      }

      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await api.post("/public/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const fileUrl = uploadRes.data?.url || "";
      const fileKey = uploadRes.data?.key || uploadRes.data?.file_key || "";
      const fileType = file.type || uploadRes.data?.type || "";

      const newDoc = {
        name: name || file.name,
        url: fileUrl || fileKey,
        type: fileType,
      };

      const existingDocs = student.documents || [];
      const updatedDocs = [...existingDocs, newDoc];

      const payload: any = {
        gradeId: student.gradeId || student.grade_id || "",
        admissionNo: student.admissionNo || student.admission_no || "",
        rollNo: student.rollNo || student.roll_no || "",
        firstName: student.firstName || student.first_name || "",
        lastName: student.lastName || student.last_name || "",
        gender: student.gender || "Other",
        dateOfBirth: student.dateOfBirth || student.dob || new Date().toISOString(),
        email: student.email || undefined,
        phone: student.phone || undefined,
        fatherName: student.fatherName || student.father_name || "",
        fatherPhone: student.fatherPhone || student.father_phone || "",
        motherName: student.motherName || student.mother_name || "",
        motherPhone: student.motherPhone || student.mother_phone || "",
        status: student.status || "Active",
        documents: updatedDocs,
      };

      const updateRes = await api.put(`/api/v1/students/${studentId}`, payload, {
        params: { schoolId },
      });

      return {
        updatedStudent: updateRes.data,
      };
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Failed to upload document";
      return rejectWithValue(message);
    }
  }
);

export interface DeleteStudentDocumentPayload {
  indexToDelete: number;
  student: any;
}

export const deleteStudentDocument = createAsyncThunk(
  "students/deleteDocument",
  async (
    { indexToDelete, student }: DeleteStudentDocumentPayload,
    { rejectWithValue }
  ) => {
    try {
      const studentId = student.id || student._id;
      const schoolId = student.schoolId || student.school_id;

      if (!studentId) {
        return rejectWithValue("Student ID is required to remove document");
      }

      const existingDocs = student.documents || [];
      const updatedDocs = existingDocs.filter(
        (_: any, idx: number) => idx !== indexToDelete
      );

      const payload: any = {
        gradeId: student.gradeId || student.grade_id || "",
        admissionNo: student.admissionNo || student.admission_no || "",
        rollNo: student.rollNo || student.roll_no || "",
        firstName: student.firstName || student.first_name || "",
        lastName: student.lastName || student.last_name || "",
        gender: student.gender || "Other",
        dateOfBirth: student.dateOfBirth || student.dob || new Date().toISOString(),
        email: student.email || undefined,
        phone: student.phone || undefined,
        fatherName: student.fatherName || student.father_name || "",
        fatherPhone: student.fatherPhone || student.father_phone || "",
        motherName: student.motherName || student.mother_name || "",
        motherPhone: student.motherPhone || student.mother_phone || "",
        status: student.status || "Active",
        documents: updatedDocs,
      };

      const updateRes = await api.put(`/api/v1/students/${studentId}`, payload, {
        params: { schoolId },
      });

      return {
        updatedStudent: updateRes.data,
      };
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Failed to delete document";
      return rejectWithValue(message);
    }
  }
);

export const fetchStudentById = createAsyncThunk(
  "students/fetchStudentById",
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/students/${studentId}`);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Failed to fetch student profile";
      return rejectWithValue(message);
    }
  }
);

export const fetchStudentByEmail = createAsyncThunk(
  "students/fetchStudentByEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/public/students/by-email`, {
        params: { email },
      });
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Failed to fetch student by email";
      return rejectWithValue(message);
    }
  }
);

export interface FetchPortalDataPayload {
  studentId?: string;
  email?: string;
}

export const fetchStudentPortalData = createAsyncThunk(
  "students/fetchPortalData",
  async (
    payload: FetchPortalDataPayload,
    { rejectWithValue }
  ) => {
    try {
      let fetchedStudent: any = null;

      // 1. Try by studentId if provided and valid hex ID
      if (
        payload.studentId &&
        payload.studentId !== "profile" &&
        /^[0-9a-fA-F]{24}$/.test(payload.studentId)
      ) {
        try {
          const res = await api.get(`/api/v1/students/${payload.studentId}`);
          if (res.data && res.data.id) {
            fetchedStudent = res.data;
          }
        } catch (e) {
          // fallback to email
        }
      }

      // 2. Fallback to email
      if (!fetchedStudent && payload.email) {
        try {
          const res = await api.get(`/public/students/by-email`, {
            params: { email: payload.email },
          });
          if (res.data && res.data.id) {
            fetchedStudent = res.data;
          }
        } catch (e) {
          // ignore error
        }
      }

      if (!fetchedStudent) {
        return rejectWithValue("Student profile details not found");
      }

      // 3. Fetch school if present
      const schoolId = fetchedStudent.school_id || fetchedStudent.schoolId;
      let fetchedSchool: any = null;
      if (schoolId) {
        try {
          const schoolRes = await api.get(`/public/schools/${schoolId}`);
          if (schoolRes.data && schoolRes.data.name) {
            fetchedSchool = schoolRes.data;
          }
        } catch (e) {
          // ignore school fetch error
        }
      }

      return {
        student: fetchedStudent,
        school: fetchedSchool,
      };
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Failed to fetch student portal data";
      return rejectWithValue(message);
    }
  }
);


