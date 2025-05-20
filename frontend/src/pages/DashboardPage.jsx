"use client"
import { useState, useEffect } from 'react'
import { 
  Box, 
  Flex, 
  Spinner, 
  Button,
  Text,
  Heading
} from '@chakra-ui/react'
import { AdminDashboard } from '../items/AdminDashboard'
import NavbarClient from '@/items/NavbarClient'
import { useColorModeValue } from '@/components/ui/color-mode';
import Sidebar from '@/items/Sidebar'

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const errorBg = useColorModeValue('red.50', 'red.900')
  const errorBorder = useColorModeValue('red.200', 'red.700')

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/stats/dashboard')
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const data = await response.json()
        setDashboardData(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <Box>
        <NavbarClient />
        <Flex>
         
          <Box 
            w={{ base: "70px", md: "250px" }} 
            position="sticky"
            top="0"
            h="calc(100vh - 60px)" 
            borderRight="1px" 
            borderColor="gray.200"
          >
            <Sidebar />
          </Box>
          
         
          <Flex 
            flex="1" 
            justify="center" 
            align="center" 
            minH="calc(100vh - 60px)"
          >
            <Spinner 
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Flex>
        </Flex>
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <NavbarClient />
        <Flex>
         
          <Box 
            w={{ base: "70px", md: "250px" }} 
            position="sticky"
            top="0"
            h="calc(100vh - 60px)" 
            borderRight="1px" 
            borderColor="gray.200"
          >
            <Sidebar />
          </Box>
          
         
          <Flex 
            flex="1" 
            justify="center" 
            align="center" 
            p={4}
          >
            <Box 
              borderWidth="1px"
              borderRadius="md"
              borderColor={errorBorder}
              bg={errorBg}
              p={6}
              maxW="md"
              width="full"
              textAlign="center"
            >
              <Heading size="md" mb={2} color="red.500">
                Error Loading Dashboard
              </Heading>
              <Text mb={4}>{error}</Text>
              <Button 
                colorScheme="red" 
                variant="outline"
                onClick={() => window.location.reload()}
                width="full"
              >
                Try Again
              </Button>
            </Box>
          </Flex>
        </Flex>
      </Box>
    )
  }

  return (
    <Box>
      <NavbarClient />
      <Flex>
        
        <Box 
          w={{ base: "70px", md: "250px" }} 
          position="sticky"
          top="0"
          h="calc(100vh - 60px)" 
          borderRight="1px" 
          borderColor="gray.200"
        >
          <Sidebar />
        </Box>
        
       
        <Box flex="1" p={{ base: 4, md: 8 }}>
          {dashboardData && <AdminDashboard dashboardData={dashboardData} />}
        </Box>
      </Flex>
    </Box>
  )
}