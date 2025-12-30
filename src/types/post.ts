export type Post = {
  id: string;   
  disciplina: string;
  turma?: string;
  titulo: string;
  conteudo: string;
  autor: string;
  createdAt?: string;
};

export type ApiPost = {
  id?: string;
  _id?: string;
  disciplina: string;
  turma?: string;
  titulo: string;
  conteudo: string;
  autor: string;
  createdAt?: string;
};

export function normalizePost(p: ApiPost): Post {
  const id = p.id ?? p._id ?? "";
  return {
    id,
    disciplina: p.disciplina,
    turma: p.turma,
    titulo: p.titulo,
    conteudo: p.conteudo,
    autor: p.autor,
    createdAt: p.createdAt,
  };
}
