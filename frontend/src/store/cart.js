import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cart: [],
  
  setCart: (cart) => set({ cart }),
  
  fetchCart: async (userId) => {
    console.log("Fetching cart for user:", userId);
    try {
      
      const userIdToUse = userId || "";
      
      const res = await fetch(`/api/cart/${userIdToUse}`);
      if (!res.ok) {
        console.error("API error:", res.status, res.statusText);
        set({ cart: [] });
        return;
      }
      
      const data = await res.json();
      console.log("Cart data received:", data);
      
      if (data.success && data.data && data.data.products) {
        
        set({ cart: data.data.products });
        console.log("Cart updated with:", data.data.products);
      } else {
        console.error("Cart fetch unexpected format:", data);
        set({ cart: [] });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      set({ cart: [] });
    }
  },
  
  addToCart: async (userId, productId, quantity = 1) => {
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity }),
      });
      
      const data = await res.json();
      console.log("Add to cart response:", data);
      
      if (data.success && data.data && data.data.products) {
        
        set({ cart: data.data.products || [] });
      }
      return { success: data.success, message: data.message };
    } catch (error) {
      console.error("Error adding to cart:", error);
      return { success: false, message: "Network error" };
    }
  },
  
  removeFromCart: async (userId, productId) => {
    console.log("Removing product:", productId, "for user:", userId);
    try {
      const res = await fetch(`/api/cart/remove/${userId}/${productId}`, {
        method: "DELETE",
      });
      
      const data = await res.json();
      console.log("Remove from cart response:", data);
      
      if (data.success && data.data && data.data.products) {
        // Update cart with the products array from the response
        set({ cart: data.data.products || [] });
      } else {
        // Fallback to manual filtering if response doesn't include products
        set((state) => ({
          cart: state.cart.filter(item => 
            item.productId._id !== productId
          ),
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
      console.log("Clear cart response:", data);
      
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