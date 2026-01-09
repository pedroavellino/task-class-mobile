import type { Post } from "../types/post";
import axios from "axios";

type ApiPost = {
  _id: string;
  disciplina: string;
  turma: string;
  titulo: string;
  conteudo: string;
  autor: string;
  createdAt?: string;
};

type CreatePostInput = {
  titulo: string;
  conteudo: string;
  autor: string;
  disciplina?: string;
  turma?: string;
};

type UpdatePostInput = {
  titulo?: string;
  conteudo?: string;
  autor?: string;
  disciplina?: string;
  turma?: string;
};

function toPost(p: ApiPost): Post {
  return {
    id: p._id,
    disciplina: p.disciplina ?? undefined,
    turma: p.turma ?? undefined,
    titulo: p.titulo,
    conteudo: p.conteudo,
    autor: p.autor,
    createdAt: p.createdAt,
  };
}

export async function fetchPosts(params: { limit: number; page: number }): Promise<Post[]> {
  const { data } = await axios.get<ApiPost[]>("https://task-class-api-latest.onrender.com/posts", { params });
  return data.map(toPost);
}

export async function searchPosts(search: string): Promise<Post[]> {
  const { data } = await axios.get<ApiPost[]>("https://task-class-api-latest.onrender.com/posts/search", { params: { search } });
  return data.map(toPost);
}

export async function fetchPostById(postId: string): Promise<Post> {
  const { data } = await axios.get<ApiPost>(`https://task-class-api-latest.onrender.com/posts/${postId}`);
  return toPost(data);
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const { data } = await axios.post<ApiPost>("https://task-class-api-latest.onrender.com/posts", input);
  return toPost(data);
}

export async function updatePost(postId: string, input: UpdatePostInput): Promise<Post> {
  const { data } = await axios.put<ApiPost>(`https://task-class-api-latest.onrender.com/posts/${postId}`, input);
  return toPost(data);
}

export async function deletePost(postId: string): Promise<void> {
  await axios.delete(`https://task-class-api-latest.onrender.com/posts/${postId}`);
}

