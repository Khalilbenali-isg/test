import {create} from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  createProduct: async (productData) => {
    if(!productData.name || !productData.price || !productData.age || !productData.Image){
      return {success:false, message:"All fields are required"};
    }
    try {
      
      const token = localStorage.getItem('token');
      
      
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('price', productData.price);
      formData.append('age', productData.age);
      formData.append('stock', productData.stock || 0);
      
      
      formData.append('Image', productData.Image);
      
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await res.json();
      if (!data.success) {
        return {success: false, message: data.message};
      }
      set((state) => ({products:[...state.products, data.data]}));
      return {success: true, message: "Product created successfully"};
    } catch (error) {
      console.error("Error creating product:", error);
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
      
      const token = localStorage.getItem('token');
      
      const res = await fetch(`/api/products/${pid}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      
      set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: "Error deleting product" };
    }
  },
  updateProduct: async (pid, productData) => {
    try {
        const token = localStorage.getItem('token');
        
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('price', productData.price);
        formData.append('age', productData.age);
        formData.append('stock', productData.stock || 0);
        
        
        console.log('FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        if (productData.Image instanceof File) {
            formData.append('Image', productData.Image);
            console.log('Including new image file');
        } else if (productData.existingImagePath) {
            formData.append('existingImagePath', productData.existingImagePath);
            console.log('Using existing image path:', productData.existingImagePath);
        }

        const res = await fetch(`/api/products/${pid}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });
        
       
        console.log('Raw response:', res);
        const data = await res.json();
        console.log('Parsed response:', data);

        if (!data.success) {
            console.error("Update failed:", data.message);
            return { success: false, message: data.message };
        }
        
        
        console.log('Updating state with:', data.data);
        
        set((state) => ({
            products: state.products.map((product) => 
                product._id === pid ? data.data : product
            ),
        }));

        return { success: true, message: "Product updated successfully" };
    } catch (error) {
        console.error("Error updating product:", error);
        return { success: false, message: "Error updating product" };
    }
},
purchaseProduct: async (pid, quantity = 1, userId, subscriptionId) => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/products/${pid}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        quantity,
        userId,
        subscriptionId,
      }),
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // Update local state with the new product
    set((state) => ({
      userProducts: [...state.userProducts, {
        _id: data.userProductId,
        userId,
        productId: pid,
        subscriptionId,
        quantity,
        purchasedAt: new Date(),
        status: 'delivery',
        deliveryStartedAt: new Date(),
        product: state.products.find(p => p._id === pid)
      }],
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