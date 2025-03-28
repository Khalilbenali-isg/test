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

      // update the ui immediately, without needing a refresh
      set((state) => ({
        products: state.products.map((product) => (product._id === pid ? data.data : product)),
      }));

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: "Error updating product" };
    }
  },
  purchaseProduct: async (pid) => {
    try {
      const res = await fetch(`/api/products/purchase/${pid}`, {
        method: "PUT", // Changed to PUT to match backend route
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      // Update the UI immediately
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