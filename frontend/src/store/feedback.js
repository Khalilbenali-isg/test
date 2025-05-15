// src/store/feedbackStore.js
import { create } from 'zustand';

const useFeedbackStore = create((set) => ({
  feedbacks: [],
  loading: false,
  error: null,
  
  
  fetchFeedbacks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/feedback');
      const data = await response.json();
      
      if (data.success) {
        set({ 
          feedbacks: data.data,
          loading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch feedback',
        loading: false 
      });
    }
  },
  
  
  createFeedback: async (userId, message) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/feedback/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, message })
      });
      
      const data = await response.json();
      
      if (data.success) {
        set((state) => ({
          feedbacks: [...state.feedbacks, data.data],
          loading: false
        }));
        return true;
      }
    } catch (error) {
      set({ 
        error: error.message || 'Failed to create feedback',
        loading: false 
      });
      return false;
    }
  },
  
  
  deleteFeedback: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        set((state) => ({
          feedbacks: state.feedbacks.filter(feedback => feedback._id !== id),
          loading: false
        }));
        return true;
      }
    } catch (error) {
      set({ 
        error: error.message || 'Failed to delete feedback',
        loading: false 
      });
      return false;
    }
  },
  
  
  approveFeedback: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: 'PUT'
      });
      
      const data = await response.json();
      
      if (data.success) {
        set((state) => ({
          feedbacks: state.feedbacks.map(feedback => 
            feedback._id === id 
              ? { ...feedback, Verified: true } 
              : feedback
          ),
          loading: false
        }));
        return true;
      }
    } catch (error) {
      set({ 
        error: error.message || 'Failed to approve feedback',
        loading: false 
      });
      return false;
    }
  },
  setFeedbacks: (newFeedbacks) => set({ feedbacks: newFeedbacks }),
  
 
  clearError: () => set({ error: null })
  
}));

export default useFeedbackStore;