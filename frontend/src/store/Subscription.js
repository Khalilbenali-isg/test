import { create } from "zustand";

export const useSubscriptionStore = create((set, get) => ({
  subscriptions: [],

  fetchSubscriptions: async () => {
    try {
      const res = await fetch("/api/subscriptions");
      const data = await res.json();
      set({ subscriptions: data.data });
    } catch (error) {
      console.error("Error fetching subscriptions", error);
    }
  },

  createSubscription: async (newSubscription) => {
    try {
      
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: "Authentication required" };
      }
      
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newSubscription),
      });
      const data = await res.json();
      if (data.success) {
        set((state) => ({ subscriptions: [...state.subscriptions, data.data] }));
      }
      return data;
    } catch (error) {
      return { success: false, message: "Error creating subscription" };
    }
  },

  deleteSubscription: async (id) => {
    try {
      
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: "Authentication required" };
      }
      
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        set((state) => ({
          subscriptions: state.subscriptions.filter((sub) => sub._id !== id),
        }));
      }
      return data;
    } catch (error) {
      return { success: false, message: "Error deleting subscription" };
    }
  },

  updateSubscription: async (id, updatedSubscription) => {
    try {
      
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: "Authentication required" };
      }
      
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedSubscription),
      });
      const data = await res.json();
      if (data.success) {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub._id === id ? data.data : sub
          ),
        }));
      }
      return data;
    } catch (error) {
      return { success: false, message: "Error updating subscription" };
    }
  },
}));