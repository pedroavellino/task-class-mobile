# TaskClass — Aplicação Mobile

Aplicação mobile desenvolvida em React Native (Expo) como parte do 4º Tech Challenge da Pós-Graduação em Full Stack Development.
O app consome um backend em Node.js + NestJS, permitindo a gestão e visualização de postagens educacionais, professores e alunos.

# Objetivo do Projeto

Desenvolver uma interface mobile robusta, intuitiva e eficiente para uma plataforma de blogging educacional, permitindo:

- Alunos visualizarem postagens
- Professores criarem, editarem e excluírem conteúdos
- Administração completa de posts, professores e alunos
- Controle de acesso por autenticação e papéis (roles)

# Arquitetura Geral

O sistema é dividido em dois grandes blocos:

- Mobile (React Native + Expo) — este repositório
- Backend (Node.js + NestJS + MongoDB) — API REST consumida pelo app

   Mobile App (React Native)   ─────HTTP/JSON─────▶   Backend API (NestJS + MongoDB)

# Tecnologias Utilizadas

1 - Mobile

- React Native
- Expo
- TypeScript
- React Navigation
- Axios
- Context API (AuthContext)

2 - Backend (consumido)

- Node.js
- NestJS
- MongoDB
- JWT para autenticação

# Autenticação e Autorização

O sistema trabalha com dois perfis:

1 - Aluno (student)

Pode:

- Visualizar lista de posts
- Ler posts completos

Não pode:

- Criar, editar ou excluir conteúdo
- Acessar área administrativa

2 - Professor (admin)

Pode:

- Criar, editar e excluir posts
- Gerenciar professores
- Gerenciar alunos
- Acessar área administrativa

O controle de acesso é feito via:

- JWT (token retornado no login)
- Context API no mobile
- Verificação de role nas telas

# Principais Funcionalidades

1 - Login

- Autenticação via e-mail e senha
- Redirecionamento automático após login
- Botão “Sair” disponível no app

2 - Postagens

- Listagem paginada de posts
- Busca por palavras-chave
- Visualização completa do post
- CRUD completo para professores

3 - Área Administrativa

- Home administrativa centralizada
- Gerenciamento de:
- Postagens
- Professores
- Alunos

# Como Executar o Projeto

1 - Pré-requisitos

- Node.js 18+
- Expo CLI
- Backend rodando localmente

2 - Passos

npm install

npx expo start

8.3 Por padrão, o app consome o backend em:

http://localhost:3000

# Estilo e UI

O app utiliza um tema centralizado (src/ui/theme.ts) para garantir:

- Consistência visual
- Facilidade de manutenção
- Identidade moderna e “tech”

Cores escuras foram escolhidas para melhor legibilidade e apresentação em vídeo.

# Usuários de Teste

1 - Professor (admin)

email: admin@taskclass.com
senha: 123456

2 - Aluno (student)

email: aluno@taskclass.com
senha: 123456

# Considerações Finais

Este projeto consolidou conhecimentos de:

- Mobile Development
- Integração frontend/backend
- Autenticação
- Arquitetura de aplicações
- Organização e boas práticas em React Native
