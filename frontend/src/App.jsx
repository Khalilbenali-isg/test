
import { Button, Box } from "@chakra-ui/react"
import Sidebar from './items/Sidebar.jsx'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SubscriptionsPage from './pages/SubscriptionsPage'
import UsersHomePage from './pages/UsersHomePage'
import CreatePage from './pages/CreatePage.jsx'
import CreateSub from './pages/CreateSub.jsx'
import LoginPage from './pages/LoginPage'
import { useColorModeValue } from "@/components/ui/color-mode"
import { Toaster } from "@/components/ui/toaster"
import { Flex , Container} from "@chakra-ui/react"
import RegistrationPage from './pages/RegistrationPage '
import ModifyProfile from './pages/ModifyProfile'

import HomePageClt from './pages/HomePageClt'
import Cart from './pages/Cart'
import ProductDetailsPage from './pages/ProductDetailsPage'
import Checkout from './pages/Checkout'
import Store from './pages/Store'
import Front from './pages/Front'
import UserProductsPage from './pages/UserProductsPage'
import Feedback from './pages/Feedback'
import RestrictedPage from './pages/RestrictedPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import AdminFeedbackPage from './pages/AdminFeedbackPage'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

//import { BrowserRouter as Router, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStore } from './store/user';

import { ProtectedRoute, RoleProtectedRoute } from './pages/ProtectedRoute';
import DashboardPage from "./pages/DashboardPage.jsx"
import CrosswordGame from './games/CrosswordGame.jsx'
import QuizGame from "./games/QuizGame.jsx"
import GamePage from "./games/GamePage.jsx"
import TestPlantRecognition from "./AI/TestPlantRecognition.jsx"
import LeaderboardPage from "./pages/LeaderboardPage.jsx"
import AdminBoughtProductsPage from "./pages/AdminBoughtProductsPage.jsx"






function App() {
  const { loadUserFromToken } = useUserStore();

  useEffect(() => {
  
    loadUserFromToken();
  }, [loadUserFromToken]);

  return (
    <>
    <Toaster />
    
    <Box minH="100vh" bg = {useColorModeValue("gray.100", "gray.800")} >
      <Flex 
        gap={4}
        >
          
        
       
        
      
        <Container>
          
          <Routes>
          
          <Route path="/cart" element={<Cart />} />
          <Route path="/home" element={<HomePageClt />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/store" element={<Store />} />
          <Route path="/admindashboard" element={<DashboardPage />} />
          <Route path="/crossword/level-1" element={<CrosswordGame />} />
          <Route path="/quiz" element={<QuizGame />} />
          <Route path="/games" element={<GamePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/allproducts" element={<AdminBoughtProductsPage />} />

          
          
          
          <Route path="/verify" element={<VerifyEmailPage />} />
          <Route path="/UserProductsPage" element={<UserProductsPage />} />
          <Route path="/Feedback" element={<Feedback />} />
          <Route path="/restricted" element={<RestrictedPage />} />
          
          <Route path="/users/create" element={<RegistrationPage />} />
          <Route path="/users/login" element={<LoginPage />} />
          <Route path="/users/ModifyProfile" element={<ModifyProfile />} />
          <Route path="/ai" element={<TestPlantRecognition />} />
          
         
         
          <Route path="/product/:productId" element={<ProductDetailsPage />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            
            
          </Route>
          <Route element={<RoleProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/feedbacks" element={<AdminFeedbackPage />} />
            <Route path="/subscriptions/create" element={<CreateSub />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/front" element={<Front />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/users" element={<UsersHomePage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
          </Route>

        </Routes>
        </Container>
        
      </Flex>
        
      
    </Box>
      
      
    </>
  )
}

export default App
