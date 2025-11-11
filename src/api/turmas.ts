// src/api/turmas.ts
// import api from './axios'; // Reservado para integração futura com API
import { getAlunos } from './alunos';

export interface Turma {
  id: number;
  nome: string;
  capacidade: number;
  alunos: number; // número de alunos associados
}

/**
 * MODO MOCK/DEMO: Substitua por chamadas de API reais posteriormente
 * Ex:
 *   export const getTurmas = async () => (await api.get('/turmas')).data;
 */

let turmasMock: Turma[] = [
  { id: 1, nome: 'Turma A', capacidade: 30, alunos: 0 },
  { id: 2, nome: 'Turma B', capacidade: 25, alunos: 0 },
  { id: 3, nome: 'Turma C', capacidade: 35, alunos: 0 },
];

const simulateDelay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

// Recalcula a contagem de alunos para cada turma
const recalculateAlunos = async () => {
  try {
    const alunos = await getAlunos();
    turmasMock = turmasMock.map(turma => ({
      ...turma,
      alunos: alunos.filter(a => a.turma === turma.nome).length
    }));
  } catch (error) {
    console.error('Erro ao recalcular alunos:', error);
  }
};

export const getTurmas = async (): Promise<Turma[]> => {
  await simulateDelay();
  await recalculateAlunos();
  return turmasMock;
};

export const getTurma = async (id: number): Promise<Turma> => {
  await simulateDelay();
  const turma = turmasMock.find((t) => t.id === id);
  if (!turma) throw new Error('Turma nao encontrada');
  return turma;
};

export const createTurma = async (nova: Omit<Turma, 'id' | 'alunos'>): Promise<Turma> => {
  await simulateDelay();
  const turma: Turma = { id: Date.now(), ...nova, alunos: 0 };
  turmasMock.push(turma);
  return turma;
};

export const updateTurma = async (id: number, data: Partial<Turma>): Promise<Turma> => {
  await simulateDelay();
  const index = turmasMock.findIndex((t) => t.id === id);
  if (index === -1) throw new Error('Turma não encontrada');
  turmasMock[index] = { ...turmasMock[index], ...data };
  return turmasMock[index];
};

export const deleteTurma = async (id: number): Promise<void> => {
  await simulateDelay();
  turmasMock = turmasMock.filter((t) => t.id !== id);
};


