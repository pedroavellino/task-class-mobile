import { http } from "./http";
import type { Post } from "../types/post";

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
  const { data } = await http.get<ApiPost[]>("/posts", { params });
  return data.map(toPost);
}

export async function searchPosts(search: string): Promise<Post[]> {
  const { data } = await http.get<ApiPost[]>("/posts/search", { params: { search } });
  return data.map(toPost);
}

export async function fetchPostById(postId: string): Promise<Post> {
  const { data } = await http.get<ApiPost>(`/posts/${postId}`);
  return toPost(data);
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const { data } = await http.post<ApiPost>("/posts", input);
  return toPost(data);
}

export async function updatePost(postId: string, input: UpdatePostInput): Promise<Post> {
  const { data } = await http.put<ApiPost>(`/posts/${postId}`, input);
  return toPost(data);
}

export async function deletePost(postId: string): Promise<void> {
  await http.delete(`/posts/${postId}`);
}

