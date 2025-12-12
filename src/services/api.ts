import { API_BASE } from '../constants';

const getAuth = () => window.Telegram.WebApp.initData;

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_BASE}?endpoint=${endpoint}&auth=${encodeURIComponent(getAuth())}`);
    return res.json();
  },
  post: async (endpoint: string, body: any) => {
    const res = await fetch(`${API_BASE}?endpoint=${endpoint}&auth=${encodeURIComponent(getAuth())}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  }
};