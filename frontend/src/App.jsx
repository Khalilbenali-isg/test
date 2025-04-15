import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'
import { Button, Box } from "@chakra-ui/react"
import Navbar from './items/Navbar.jsx'
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






function App() {
  return (
    <>
    <Toaster />
    
    <Box minH="100vh" bg = {useColorModeValue("gray.100", "gray.800")} >
      <Flex 
        gap={4}
        >
          
        <Sidebar />
       
        
      
        <Container>
          
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/home" element={<HomePageClt />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/store" element={<Store />} />
          <Route path="/front" element={<Front />} />
          <Route path="/UserProductsPage" element={<UserProductsPage />} />
          <Route path="/users" element={<UsersHomePage />} />
          <Route path="/users/create" element={<RegistrationPage />} />
          <Route path="/users/login" element={<LoginPage />} />
          <Route path="/users/ModifyProfile" element={<ModifyProfile />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/subscriptions/create" element={<CreateSub />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />

        </Routes>
        </Container>
        
      </Flex>
        
      
    </Box>
      
      
    </>
  )
}

export default App
