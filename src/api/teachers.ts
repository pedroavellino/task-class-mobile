import axios from "axios"

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
  const { data } = await axios.get<PaginatedResponse<ApiTeacher>>("https://task-class-api-latest.onrender.com/teachers", { params });
  return {
    ...data,
    items: data.items.map(toTeacher),
  };
}

export async function createTeacher(input: CreateTeacherInput) {
  const { data } = await axios.post<ApiTeacher>("https://task-class-api-latest.onrender.com/teachers", input);
  return toTeacher(data);
}

export async function updateTeacher(teacherId: string, input: UpdateTeacherInput) {
  const { data } = await axios.put<ApiTeacher>(`https://task-class-api-latest.onrender.com/teachers/${teacherId}`, input);
  return toTeacher(data);
}

export async function deleteTeacher(teacherId: string): Promise<void> {
  await axios.delete(`https://task-class-api-latest.onrender.com/teachers/${teacherId}`);
}
