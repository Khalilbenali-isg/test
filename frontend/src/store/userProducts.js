import { create } from 'zustand';

export const useUserProductStore = create((set) => ({
  userProducts: [],
  loading: false,
  error: null,
  
  fetchUserProducts: async (userId) => {
    if (!userId) {
      set({ error: "User ID is required" });
      return;
    }
    
    try {
      set({ loading: true, error: null });
      //problem localhost ?????????????????????????????????????????????????????????
      const res = await fetch(`http://localhost:5173/api/user-products/user/${userId}`);


      const data = await res.json();
      
      if (!res.ok) {
        set({ 
          loading: false, 
          error: data.message || "Failed to fetch your products" 
        });
        return;
      }
      
      set({ 
        userProducts: data.data || [],
        loading: false
      });
      
      return data.data;
    } catch (error) {
      console.error("Error fetching user products:", error);
      set({ 
        loading: false, 
        error: "Failed to load your products. Please try again later." 
      });
    }
  },
  
  clearUserProducts: () => {
    set({ userProducts: [], loading: false, error: null });
  }
}));