// src/api/alunos.ts
// import api from './axios'; // Reservado para integração futura com API

export interface Aluno {
  id: number;
  nome: string;
  email: string;
  turma: string;
  status: 'Ativo' | 'Inativo';
}

// MODO MOCK/DEMO: Substitua por chamadas de API reais posteriormente

let alunosMock: Aluno[] = [
  { id: 1, nome: 'Maria Silva', email: 'maria@escola.com', turma: 'Turma A', status: 'Ativo' },
  { id: 2, nome: 'João Pereira', email: 'joao@escola.com', turma: 'Turma B', status: 'Inativo' },
  { id: 3, nome: 'Carla Souza', email: 'carla@escola.com', turma: 'Turma A', status: 'Ativo' },
];

// Simula atraso de rede
const simulateDelay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const getAlunos = async (): Promise<Aluno[]> => {
  await simulateDelay();
  // return (await api.get('/alunos')).data;
  return alunosMock;
};

export const createAluno = async (novo: Omit<Aluno, 'id'>): Promise<Aluno> => {
  await simulateDelay();
  const aluno: Aluno = { id: Date.now(), ...novo };
  alunosMock.push(aluno);
  return aluno;
};

export const updateAluno = async (id: number, data: Partial<Aluno>): Promise<Aluno> => {
  await simulateDelay();
  const index = alunosMock.findIndex((a) => a.id === id);
  if (index === -1) throw new Error('Aluno não encontrado');
  alunosMock[index] = { ...alunosMock[index], ...data };
  return alunosMock[index];
};

export const deleteAluno = async (id: number): Promise<void> => {
  await simulateDelay();
  alunosMock = alunosMock.filter((a) => a.id !== id);
};
