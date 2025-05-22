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
  fetchAllBoughtProducts: async () => {
    try {
      set({ adminLoading: true, adminError: null });
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        set({ adminLoading: false, adminError: "Authentication required" });
        return { success: false, message: "Authentication required" };
      }
      
      const res = await fetch('/api/user-products/admin/all', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        set({ 
          adminLoading: false, 
          adminError: data.message || "Failed to fetch bought products" 
        });
        return { success: false, message: data.message };
      }
      
      set({ 
        allBoughtProducts: data.data || [],
        adminLoading: false
      });
      
      return { success: true, data: data.data };
    } catch (error) {
      console.error("Error fetching all bought products:", error);
      set({ 
        adminLoading: false, 
        adminError: "Failed to load bought products. Please try again later." 
      });
      return { success: false, message: error.message };
    }
  },

  // Admin function: Fetch bought products with pagination
  fetchBoughtProductsPaginated: async (page = 1, limit = 10, filters = {}) => {
    console.log("📤 Sending request with filters:", filters);
    try {
      set({ adminLoading: true, adminError: null });
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        set({ adminLoading: false, adminError: "Authentication required" });
        return { success: false, message: "Authentication required" };
      }

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });
      
      const res = await fetch(`/api/user-products/admin/paginated?${queryParams}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        set({ 
          adminLoading: false, 
          adminError: data.message || "Failed to fetch bought products" 
        });
        return { success: false, message: data.message };
      }
      
      set({ 
        allBoughtProducts: data.data || [],
        pagination: data.pagination,
        adminLoading: false
      });
      
      return { success: true, data: data.data, pagination: data.pagination };
    } catch (error) {
      console.error("Error fetching paginated bought products:", error);
      set({ 
        adminLoading: false, 
        adminError: "Failed to load bought products. Please try again later." 
      });
      return { success: false, message: error.message };
    }
  },
  
  clearUserProducts: () => {
    set({ userProducts: [], loading: false, error: null });
  }
}))