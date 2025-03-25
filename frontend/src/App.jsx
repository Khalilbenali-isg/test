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
          <Route path="/users" element={<UsersHomePage />} />
          <Route path="/users/create" element={<RegistrationPage />} />
          <Route path="/users/login" element={<LoginPage />} />
          <Route path="/users/ModifyProfile" element={<ModifyProfile />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/subscriptions/create" element={<CreateSub />} />
          

        </Routes>
        </Container>
        
      </Flex>
        
      
    </Box>
      
      
    </>
  )
}

export default App
