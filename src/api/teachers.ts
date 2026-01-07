import { http } from "./http";

export type Teacher = {
  id: string;
  email: string;
  role: "admin";
  createdAt?: string;
  updatedAt?: string;
};

type ApiTeacher = {
  _id: string;
  email: string;
  role: "admin";
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

type CreateTeacherInput = {
  email: string;
  password: string;
};

type UpdateTeacherInput = {
  email?: string;
  password?: string;
};

function toTeacher(u: ApiTeacher): Teacher {
  return {
    id: u._id,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

export async function fetchTeachers(params: { limit: number; page: number }) {
  const { data } = await http.get<PaginatedResponse<ApiTeacher>>("/teachers", { params });
  return {
    ...data,
    items: data.items.map(toTeacher),
  };
}

export async function createTeacher(input: CreateTeacherInput) {
  const { data } = await http.post<ApiTeacher>("/teachers", input);
  return toTeacher(data);
}

export async function updateTeacher(teacherId: string, input: UpdateTeacherInput) {
  const { data } = await http.put<ApiTeacher>(`/teachers/${teacherId}`, input);
  return toTeacher(data);
}

export async function deleteTeacher(teacherId: string): Promise<void> {
  await http.delete(`/teachers/${teacherId}`);
}
