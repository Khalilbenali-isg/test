import { create } from 'zustand';

export const useUserProductStore = create((set) => ({
  userProducts: [],
  loading: false,
  error: null,
  
  fetchUserProducts: async (userId) => {
    if (!userId) {
      set({ error: "User ID is required", loading: false });
      return { success: false, message: "User ID is required" };
    }
    
    try {
      set({ loading: true, error: null });
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        set({ loading: false, error: "Authentication required" });
        return { success: false, message: "Authentication required" };
      }
      
      const res = await fetch(`/api/user-products/user/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        set({ 
          loading: false, 
          error: `Server error: ${res.status} ${res.statusText}` 
        });
        return { success: false, message: "Invalid server response format" };
      }
      
      const data = await res.json();
      
      if (!res.ok) {
        set({ 
          loading: false, 
          error: data.message || `Failed to fetch products (${res.status})` 
        });
        return { success: false, message: data.message || "Failed to fetch products" };
      }
      
      set({ 
        userProducts: data.data || [],
        loading: false
      });
      
      return { success: true, data: data.data };
    } catch (error) {
      console.error("Error fetching user products:", error);
      set({ 
        loading: false, 
        error: "Failed to load your products. Please try again later." 
      });
      return { success: false, message: error.message };
    }
  },
  
  clearUserProducts: () => {
    set({ userProducts: [], loading: false, error: null });
  }
}))