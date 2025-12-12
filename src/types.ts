export interface UserData {
  tgId: number;
  username?: string;
  coins: number;
  premium: boolean;
  inventory: number[]; // Block IDs
  clanId?: string;
  streak: number;
  lastDaily: number;
}

export interface Block {
  id: number;
  name: string;
  color: string;
  isPremium: boolean;
  type: 'solid' | 'fluid' | 'light';
}

export interface ChunkData {
  x: number;
  z: number;
  blocks: { x: number; y: number; z: number; type: number }[];
}

export interface Clan {
  id: string;
  name: string;
  members: number[];
  flagPos?: { x: number; y: number; z: number };
}

export interface AuctionItem {
  id: string;
  sellerId: number;
  blockId: number;
  price: number;
}

export enum GameState {
  LOADING,
  MENU,
  PLOT_BUILDER,
  WORLD_EXPLORER,
  GALLERY,
  ADMIN,
  CLAN,
  MAP
}

// Исправление: Добавление типов для Telegram WebApp в глобальный интерфейс Window
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        ready: () => void;
        expand: () => void;
        enableClosingConfirmation: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
      };
    };
  }
}