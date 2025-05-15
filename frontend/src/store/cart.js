import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cart: [],

  setCart: (cart) => set({ cart }),

  fetchCart: async (userId) => {
    try {
      const res = await fetch(`/api/cart/${userId || ""}`);
      if (!res.ok) {
        set({ cart: [] });
        return;
      }

      const data = await res.json();
      if (data.success && data.data && data.data.products) {
        set({ cart: data.data.products });
      } else {
        set({ cart: [] });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      set({ cart: [] });
    }
  },

  addToCart: async (userId, productId, quantity = 1) => {
    try {
      
      console.log("Store received quantity:", quantity);
      
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity }),
      });
  
      const data = await res.json();
      
      
      console.log("Server response:", data);
      
      if (data.success && data.data && data.data.products) {
        
        set({ cart: data.data.products });
        
       
        console.log("Updated cart:", get().cart);
      }
      
      return { success: data.success, message: data.message };
    } catch (error) {
      console.error("Error adding to cart:", error);
      return { success: false, message: "Network error" };
    }
  },
 

  
  removeFromCart: async (userId, productId) => {
    try {
      const res = await fetch(`/api/cart/remove/${userId}/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success && data.data && data.data.products) {
        set({ cart: data.data.products });
      } else {
        
        set((state) => ({
          cart: state.cart.filter(item => item.productId._id !== productId),
        }));
      }
      return { success: data.success, message: data.message };
    } catch (error) {
      console.error("Error removing from cart:", error);
      return { success: false, message: "Network error" };
    }
  },

  clearCart: async (userId) => {
    try {
      const res = await fetch(`/api/cart/clear/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        set({ cart: [] });
      }
      return { success: data.success, message: data.message };
    } catch (error) {
      console.error("Error clearing cart:", error);
      return { success: false, message: "Network error" };
    }
  },
}));
