# Portal do Professor

Sistema de gestão acadêmica desenvolvido em React com TypeScript para gerenciar alunos, turmas e avaliações.

## Descrição

O Portal do Professor é uma aplicação web que permite aos professores:

- **Gerenciar Alunos**: Criar, editar, remover e buscar alunos do sistema
- **Gerenciar Turmas**: Criar turmas, definir capacidade e associar alunos
- **Configurar Avaliações**: Definir critérios de avaliação com pesos percentuais
- **Dashboard**: Visualizar resumo de alunos, turmas e próximas avaliações

A aplicação utiliza autenticação JWT (mockada para demonstração) e possui interface responsiva e moderna.

## Tecnologias

- React 19.2.0
- TypeScript
- React Router DOM
- Axios
- CSS3 (com animações e design moderno)

## Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

## Como Executar Localmente

### 1. Instalar Dependências

```bash
npm install
```

### 2. Iniciar o Servidor de Desenvolvimento

```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

### 3. Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `build/`.

### 4. Executar Testes

```bash
npm test
```

## Estrutura do Projeto

```
src/
├── api/          # Serviços de API (mockados)
├── components/   # Componentes reutilizáveis
├── contexts/     # Context API (autenticação)
├── hooks/        # Custom hooks
├── layouts/      # Layouts da aplicação
├── pages/        # Páginas principais
├── routes/       # Configuração de rotas
└── services/     # Serviços utilitários
```

## Funcionalidades

### Autenticação
- Login com e-mail e senha (qualquer credencial funciona no modo mock)
- Proteção de rotas
- Gerenciamento de token JWT

### Dashboard
- Resumo de alunos e turmas
- Lista de próximas avaliações

### Alunos
- Listagem com busca e filtros
- Criação, edição e remoção
- Filtros por turma e status

### Turmas
- Criação e gerenciamento de turmas
- Controle de capacidade
- Associação de alunos
- Visualização de ocupação

### Avaliações
- Configuração de critérios de avaliação
- Validação de pesos (soma deve ser 100%)
- Edição inline de pesos

## Notas

- A aplicação utiliza APIs mockadas para demonstração
- Os dados são armazenados em memória (não persistem após recarregar a página)
- Para produção, substitua as funções mock em `src/api/` por chamadas reais de API

## Licença

Este projeto foi desenvolvido como parte de um desafio técnico.
