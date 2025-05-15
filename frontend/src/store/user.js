import { create } from "zustand";
import { jwtDecode } from "jwt-decode"; // Make sure to import jwtDecode

export const useUserStore = create((set, get) => ({
  users: [],
  loggedInUser: null, 
  setUsers: (users) => set({ users }),

  loadUserFromToken: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // First decode the token to get the basic user info
        const decoded = jwtDecode(token);
        
        // Check if we have an ID (could be either id or _id in the token)
        const userId = decoded.id || decoded._id;
        
        if (!userId) {
          console.error("No user ID found in token");
          return;
        }
        
        // Now fetch the complete user profile using the ID from the token
        const res = await fetch(`/api/users/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const userData = await res.json();
          if (userData.success && userData.data) {
            // Set the complete user data including the image, name, etc.
            set({ loggedInUser: userData.data });
           
          } else {
            // If we can't get the complete profile, at least set the basic info
            // Make sure we maintain a consistent structure
            set({ 
              loggedInUser: {
                _id: userId,
                id: userId, // Include both formats to be safe
                email: decoded.email,
                role: decoded.role,
                // Add placeholder for other fields so UI won't break
                name: decoded.name || "User",
                image: decoded.image || "",
                Verified: decoded.Verified || true
              } 
            });
          }
        } else {
          console.error("Error fetching complete user profile:", res.status);
          // Fallback to just the decoded token info with consistent structure
          set({ 
            loggedInUser: {
              _id: userId,
              id: userId,
              email: decoded.email,
              role: decoded.role,
              name: decoded.name || "User",
              image: decoded.image || "",
              Verified: decoded.Verified || true
            } 
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    }
  },

  createUser: async (newUser) => {
    const { name, email, password, image, role } = newUser;
  
    if (!name || !email || !password || !image) {
      return { success: false, message: "All fields are required" };
    }
  
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role || "client");
      formData.append("image", image); // image should be a File object
  
      const res = await fetch("/api/users", {
        method: "POST",
        body: formData, // Let browser set Content-Type automatically
      });
  
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };
  
      set((state) => ({ users: [...state.users, data.data] }));
  
      return {
        success: true,
        message: "Registration successful! Please check your email for verification code.",
        email: email,
        data: data.data
      };
    } catch (error) {
      console.error("Create user error:", error);
      return { success: false, message: "Error creating user" };
    }
  },
  

  verifyUserEmail: async (email, verificationCode) => {
    try {
      const res = await fetch("/api/users/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, verificationCode }),
      });
      const data = await res.json();
      
      if (!data.success) {
        return { success: false, message: data.message };
      }
      
     
      set((state) => ({
        users: state.users.map((user) => 
          user.email === email ? { ...user, Verified: true } : user
        )
      }));
      
      return { success: true, message: "Email verified successfully! You can now log in." };
    } catch (error) {
      return { success: false, message: "Error verifying email" };
    }
  },

  fetchUsers: async () => {
    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');
      
      // Make the request - token is required now that we added checkAuth
      const res = await fetch("/api/users", {
        headers: {
          "Authorization": token ? `Bearer ${token}` : ''
        }
      });
      
      // Handle authentication errors
      if (res.status === 401) {
        console.log("Authentication required to fetch users");
        set({ users: [] }); // Clear users on auth error
        return { success: false, message: "Authentication required" };
      }
      
      if (res.status === 403) {
        console.log("Access denied when fetching users");
        return { success: false, message: "Access denied. Insufficient permissions." };
      }
      
      // Parse response
      if (res.ok) {
        const data = await res.json();
        set({ users: data.data });
        return { success: true };
      } else {
        return { success: false, message: "Error fetching users" };
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return { success: false, message: "Error fetching users" };
    }
  },
  
  loginUser: async (email, password) => {
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      console.log("Backend response:", data); // Log the full response for debugging
  
      if (!data.success) {
        return { success: false, message: data.message };
      }
  
      // Ensure that user data exists and Verified field is available
      if (!data.data || typeof data.data.Verified === 'undefined') {
        console.error("User data is missing or verification status is undefined.");
        return { success: false, message: "Error: User data is missing or verification status is undefined." };
      }
  
      // Check if user is verified
      if (!data.data.Verified) {
        return { 
          success: false, 
          message: "Please verify your email before logging in",
          requiresVerification: true,
          email: data.data.email
        };
      }
  
      // Store the token and set logged-in user in the store
      localStorage.setItem('token', data.data.token); // Store the token in localStorage
      set({ loggedInUser: data.data }); // Store user data in the store
  
      return { success: true, message: "Login successful", role: data.data.role };
  
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Error during login" };
    }
  },
  
  isAdmin: () => {
    const { loggedInUser } = get();
    return loggedInUser?.role === 'admin';
  },

  isClient: () => {
    const { loggedInUser } = get();
    return loggedInUser?.role === 'client';
  },

  deleteUser: async (userId) => {
    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        return { success: false, message: "Authentication required" };
      }
      
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}` // Include the token in the Authorization header
        }
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
  
  resendVerification: async (email) => {
    try {
      const res = await fetch("/api/users/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!data.success) {
        return { success: false, message: data.message };
      }
      
      return { 
        success: true, 
        message: "New verification code sent. Please check your email."
      };
    } catch (error) {
      return { 
        success: false, 
        message: "Error resending verification code" 
      };
    }
  },

  updateUser: async (userId, updatedUser) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return { success: false, message: "Authentication required" };
  
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: updatedUser, // FormData is passed directly
      });
  
      const data = await res.json();
      console.log("Backend response:", data); // Add this line
  
      if (!data.success) return { success: false, message: data.message };
  
      set((state) => ({
        users: state.users.map((user) => 
          user._id === userId ? data.data : user
        ),
        loggedInUser: state.loggedInUser?._id === userId ? data.data : state.loggedInUser,
      }));
  
      return { 
        success: true, 
        message: data.message,
        data: data.data
      };
    } catch (error) {
      console.error("Update error:", error);
      return { success: false, message: "Error updating user" };
    }
  },
  

  
  requestPasswordReset: async (email) => {
    try {
      const res = await fetch("/api/users/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      return { 
        success: data.success, 
        message: data.message 
      };
    } catch (error) {
      console.error("Error requesting password reset:", error);
      return { 
        success: false, 
        message: "Error requesting password reset. Please try again." 
      };
    }
  },
  
  
  resetPassword: async (token, password) => {
    try {
      const res = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await res.json();
      
      return { 
        success: data.success, 
        message: data.message 
      };
    } catch (error) {
      console.error("Error resetting password:", error);
      return { 
        success: false, 
        message: "Error resetting password. Please try again." 
      };
    }
  },
  
changePassword: async (currentPassword, newPassword, confirmPassword) => {
  
  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, message: "All fields are required" };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "New passwords don't match" };
  }

  if (newPassword.length < 6) {
    return { 
      success: false, 
      message: "Password must be at least 6 characters long" 
    };
  }

  if (newPassword === currentPassword) {
    return { 
      success: false, 
      message: "New password must be different from current password" 
    };
  }

  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(newPassword)) {
    return {
      success: false,
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    };
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, message: "Authentication required" };
    }

    const res = await fetch('/api/users/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        currentPassword, 
        newPassword 
      }),
    });

    const data = await res.json();
    
    if (!data.success) {
      return { 
        success: false, 
        message: data.message || "Failed to change password" 
      };
    }

    
    return { 
      success: true, 
      message: data.message || "Password changed successfully" 
    };

  } catch (error) {
    console.error("Error changing password:", error);
    return { 
      success: false, 
      message: "An error occurred while changing password" 
    };
  }
},

  logout: () => {
    localStorage.removeItem('token');  // Remove the JWT token
    set({ loggedInUser: null });
  }
}));