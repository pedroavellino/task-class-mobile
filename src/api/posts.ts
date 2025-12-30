import { http } from "./http";
import { ApiPost, normalizePost, Post } from "../types/post";

export async function fetchPosts(params: { limit: number; page: number }): Promise<Post[]> {
  const res = await http.get<ApiPost[]>("/posts", { params });
  return res.data.map(normalizePost).filter(p => p.id);
}

export async function searchPosts(search: string): Promise<Post[]> {
  const res = await http.get<ApiPost[]>("/posts/search", { params: { search } });
  return res.data.map(normalizePost).filter(p => p.id);
}

export async function fetchPostById(id: string): Promise<Post> {
  const res = await http.get<ApiPost>(`/posts/${id}`);
  return normalizePost(res.data);
}
