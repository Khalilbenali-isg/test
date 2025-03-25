import { create } from "zustand";

export const useUserStore = create((set, get) => ({
  users: [],
  loggedInUser: null, // Track the logged-in user
  setUsers: (users) => set({ users }),

  createUser: async (newUser) => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.image) {
      return { success: false, message: "All fields are required" };
    }
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({ users: [...state.users, data.data] }));
      return { success: true, message: "User created successfully" };
    } catch (error) {
      return { success: false, message: "Error creating user" };
    }
  },

  fetchUsers: async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      set({ users: data.data });
      return { success: true };
    } catch (error) {
      return { success: false, message: "Error fetching users" };
    }
  },

  loginUser: async (email, password) => {
    try {
      // Get current users state
      const { users } = get();
      
      // Find the user with matching email and password
      const user = users.find((u) => u.email === email && u.password === password);
      
      if (user) {
        set({ loggedInUser: user }); // Set the logged-in user
        return { success: true, message: "Login successful" };
      } else {
        return { success: false, message: "Invalid email or password" };
      }
    } catch (error) {
      return { success: false, message: "Error during login" };
    }
  },

  deleteUser: async (userId) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        users: state.users.filter((user) => user._id !== userId),
      }));
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: "Error deleting user" };
    }
  },

  updateUser: async (userId, updatedUser) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? data.data : user
        ),
      }));

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: "Error updating user" };
    }
  },

  logout: () => {
    set({ loggedInUser: null });
  }
}));