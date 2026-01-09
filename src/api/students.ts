import { http } from "./http";
import axios from "axios";

export type Student = {
  id: string;
  email: string;
  role: "student";
  createdAt?: string;
  updatedAt?: string;
};

type ApiStudent = {
  _id: string;
  email: string;
  role: "student";
  createdAt?: string;
  updatedAt?: string;
};

type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type CreateStudentInput = {
  email: string;
  password: string;
};

type UpdateStudentInput = {
  email?: string;
  password?: string;
};

function toStudent(u: ApiStudent): Student {
  return {
    id: u._id,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

export async function fetchStudents(params: { limit: number; page: number }) {
  const { data } = await axios.get<PaginatedResponse<ApiStudent>>("https://task-class-api-latest.onrender.com/students", { params });
  return { ...data, items: data.items.map(toStudent) };
}

export async function createStudent(input: CreateStudentInput) {
  const { data } = await axios.post<ApiStudent>("https://task-class-api-latest.onrender.com/students", input);
  return toStudent(data);
}

export async function updateStudent(studentId: string, input: UpdateStudentInput) {
  const { data } = await axios.put<ApiStudent>(`https://task-class-api-latest.onrender.com/students/${studentId}`, input);
  return toStudent(data);
}

export async function deleteStudent(studentId: string): Promise<void> {
  await axios.delete(`https://task-class-api-latest.onrender.com/students/${studentId}`);
}
