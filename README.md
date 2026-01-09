# TaskClass — Aplicação Mobile

Aplicação mobile desenvolvida em React Native (Expo) como parte do 4º Tech Challenge da Pós-Graduação em Full Stack Development.
O aplicativo consome uma API REST hospedada, desenvolvida em Node.js + NestJS, permitindo a gestão e visualização de postagens educacionais, além do gerenciamento de professores e alunos.

# Objetivo do Projeto

Desenvolver uma interface mobile robusta, intuitiva e funcional para uma plataforma de blogging educacional, permitindo:

- Alunos visualizarem postagens educacionais
- Professores criarem, editarem e excluírem conteúdos
- Administração completa de posts, professores e alunos
- Controle de acesso por autenticação e papéis (roles)

# Arquitetura Geral

O sistema é dividido em dois grandes blocos:

- Mobile (React Native + Expo) — este repositório
- Backend: API REST desenvolvida em Node.js + NestJS, com MongoDB

   Mobile App (React Native)
        │
        │  HTTP / JSON
        ▼
Backend API (NestJS + MongoDB)

O mobile é responsável pela interface e experiência do usuário, enquanto o backend centraliza regras de negócio, persistência de dados e autenticação.

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
- Ler postagens completas

Não pode:

- Criar, editar ou excluir conteúdos
- Acessar área administrativa

2 - Professor (admin)

Pode:

- Criar, editar e excluir posts
- Gerenciar professores
- Gerenciar alunos
- Acessar área administrativa do aplicativo

O controle de acesso é feito via:

- Token JWT retornado no login
- Context API no mobile (AuthContext)
- Verificação de papel (role) nas telas e fluxos de navegação

# Principais Funcionalidades

1 - Autenticação

- Login via e-mail e senha
- Controle de sessão no mobile
- Botão “Sair”, permitindo retorno à tela de login

2 - Postagens

- Listagem paginada de posts
- Busca por palavras-chave
- Visualização completa do conteúdo
- CRUD completo de postagens para professores

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

2 - Passos

npm install
npx expo start

O aplicativo consome uma API hospedada, não sendo necessário executar o backend localmente para testes ou avaliação.

3 Backend / API

A API utilizada pelo aplicativo está disponível em ambiente cloud:

https://task-class-api-latest.onrender.com

Todas as requisições do mobile são realizadas diretamente para esse endpoint, utilizando axios.

# Estilo e Interface

O aplicativo utiliza estilos centralizados para garantir:

- Consistência visual
- Facilidade de manutenção
- Identidade moderna e profissional

O design prioriza simplicidade, legibilidade e clareza na navegação, especialmente pensando na apresentação em vídeo do projeto.

# Usuários de Teste

1 - Professor (admin)

email: admin@taskclass.com
senha: admin123

2 - Aluno (student)

email: aluno@taskclass.com
senha: aluno123

# Considerações Finais

Este projeto consolidou conhecimentos fundamentais em:

- Desenvolvimento mobile com React Native
- Integração frontend/backend
- Autenticação e controle de acesso
- Arquitetura de aplicações
- Organização e boas práticas de desenvolvimento de software
