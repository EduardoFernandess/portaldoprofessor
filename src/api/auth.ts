// src/api/auth.ts
// import api from './axios'; // Reservado para (hipotética) integração futura com API

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

// Autenticação mockada - aceita qualquer e-mail/senha para demonstração
const simulateDelay = (ms = 800) => new Promise((r) => setTimeout(r, ms));

export const loginRequest = async (data: LoginCredentials): Promise<LoginResponse> => {
  await simulateDelay();
  
  // Validação mockada - aceita qualquer credencial
  if (!data.email || !data.password) {
    throw new Error('E-mail e senha são obrigatórios');
  }

  // Gera um token JWT mockado
  const mockToken = `mock-jwt-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    token: mockToken,
    user: {
      id: 1,
      name: data.email.split('@')[0] || 'Professor',
      email: data.email,
    },
  };
};

export const validateToken = async (token: string): Promise<boolean> => {
  await simulateDelay();
  // Em uma aplicação real, isso validaria o token com o backend
  return !!token && token.startsWith('mock-jwt-token-');
};
