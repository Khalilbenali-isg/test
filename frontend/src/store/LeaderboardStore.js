// src/stores/leaderboardStore.js
import { create } from "zustand";
import { useUserStore } from "./user";

export const useLeaderboardStore = create((set, get) => ({
  scores: [],
  loading: false,
  error: null,

  
  addScore: async (game, score, timeTaken) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      set({ loading: true, error: null });
      
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ game, score, timeTaken })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add score');
      }

      
      set(state => ({
        scores: [...state.scores, data],
        loading: false
      }));

      return { success: true, data };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  
  getTopScores: async (game) => {
    try {
      set({ loading: true, error: null });
      
      const response = await fetch(`/api/leaderboard/${game}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch scores');
      }

      set({ scores: data, loading: false });
      return { success: true, data };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  
  getUserBestScore: async (game) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      set({ loading: true, error: null });
      
      const response = await fetch(`/api/leaderboard/${game}/personal-best`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch personal best');
      }

      set({ loading: false });
      return { success: true, data };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  }
}));