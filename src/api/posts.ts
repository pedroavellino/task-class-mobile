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

function toPost(p: ApiPost): Post {
  return {
    id: p._id,
    disciplina: p.disciplina,
    turma: p.turma,
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
