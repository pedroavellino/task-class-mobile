export type Post = {
  id: string;
  titulo: string;
  autor: string;
  conteudo: string;
  createdAt?: string;

  // Mantemos opcionais porque o backend ainda pode enviar
  disciplina?: string;
  turma?: string;
};
