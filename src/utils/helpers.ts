import type { User } from '../types';

export const generateHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

export const generateColor = (name: string): string => {
  const hash = generateHash(name);
  const h = Math.abs(hash) % 360;
  // Pastel-ish colors for readability over dark background
  return `hsl(${h}, 70%, 60%)`;
};

export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Generate initial users with IDs and Colors
const INITIAL_NAMES = [
  'Bitencourt',
  'Gaybriel',
  'Luzia Loba',
  'Rose',
  'Jose',
  'Ysa',
  'Jaq',
  'Drydry'
];

export const generateInitialUsers = () => {
  const users: User[] = INITIAL_NAMES.map((name) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    email: `${name.toLowerCase().replace(/\s+/g, '')}@divideuber.com`,
    password: '123',
    role: 'user',
    color: generateColor(name),
  }));

  // Add the admin
  users.unshift({
    id: 'admin',
    name: 'Admin Master',
    email: 'admin@admin.com',
    password: '123', // standard MVP password
    role: 'admin' as const,
    color: '#7C3AED',
  });

  return users;
};
