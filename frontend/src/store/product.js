import {create} from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  createProduct: async (newProduct) => {
    if(!newProduct.name || !newProduct.price || !newProduct.age || !newProduct.Image){
      return {success:false, message:"All fields are required"};
    }
    try {
      const res = await fetch("/api/products",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(newProduct)
      });
      const data = await res.json();
      if (!data.success) {
        return {success: false, message: data.message};
      }
      set((state) => ({products:[...state.products, data.data]}));
      return {success: true, message: "Product created successfully"};
    } catch (error) {
      return {success: false, message: "Error creating product"};
    }
  },
  fetchProducts: async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        set({ products: data.data });
      } else {
        console.error("Failed to fetch products", data.message);
      }
    } catch (error) {
      console.error("Error fetching products", error);
    }
  },
  fetchProductById: async (productId) => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      
      if (!res.ok) {
        console.error("API error:", res.status, res.statusText);
        return null;
      }
      
      if (data.success && data.data) {
        return data.data;
      } else {
        console.error("Product fetch unexpected format:", data);
        return null;
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },
  deleteProduct: async (pid) => {
    try {
      const res = await fetch(`/api/products/${pid}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      // update the ui immediately, without needing a refresh
      set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: "Error deleting product" };
    }
  },
  updateProduct: async (pid, updatedProduct) => {
    try {
      const res = await fetch(`/api/products/${pid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      
      set((state) => ({
        products: state.products.map((product) => (product._id === pid ? data.data : product)),
      }));

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: "Error updating product" };
    }
  },
  purchaseProduct: async (pid, quantity = 1, userId, subscriptionId) => {
    try {
      const res = await fetch(`/api/products/purchase/${pid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity,
          userId,
          subscriptionId,
        }),
      });
  
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };
  
      // Update the stock in the state
      set((state) => ({
        products: state.products.map((product) =>
          product._id === pid ? { ...product, stock: data.newStock } : product
        ),
      }));
  
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: "Error purchasing product" };
    }
  },
}));