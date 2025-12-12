import { Block } from './types';

export const BLOCK_SIZE = 1; // Babylon units (mapped to 2.5cm logically)
export const CHUNK_SIZE = 32;
export const WORLD_HEIGHT = 128;

export const BLOCKS: Record<number, Block> = {
  1: { id: 1, name: 'Dirt', color: '#5D4037', isPremium: false, type: 'solid' },
  2: { id: 2, name: 'Grass', color: '#7CB342', isPremium: false, type: 'solid' },
  3: { id: 3, name: 'Stone', color: '#9E9E9E', isPremium: false, type: 'solid' },
  4: { id: 4, name: 'Wood', color: '#795548', isPremium: false, type: 'solid' },
  5: { id: 5, name: 'Leaves', color: '#2E7D32', isPremium: false, type: 'solid' },
  31: { id: 31, name: 'Neon Blue', color: '#00D1FF', isPremium: true, type: 'light' },
  32: { id: 32, name: 'Lava', color: '#FF5722', isPremium: true, type: 'light' },
  33: { id: 33, name: 'Gold', color: '#FFD700', isPremium: true, type: 'solid' },
  34: { id: 34, name: 'Diamond', color: '#00E5FF', isPremium: true, type: 'solid' },
  35: { id: 35, name: 'TNT', color: '#D50000', isPremium: true, type: 'solid' },
};

export const API_BASE = '/api';