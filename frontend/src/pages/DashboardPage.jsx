"use client"
import { useState, useEffect } from 'react'
import { 
  Box, 
  Container, 
  Flex, 
  Spinner, 
  Button,
  Text,
  Heading
} from '@chakra-ui/react'
import { AdminDashboard } from '../items/AdminDashboard'
import NavbarClient from '@/items/NavbarClient'
import { useColorModeValue } from '@/components/ui/color-mode';


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
      <Flex justify="center" align="center" minH="100vh">
        <Spinner 
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Flex>
    )
  }

  if (error) {
    return (
      <Flex justify="center" align="center" minH="100vh" px={4}>
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
    )
  }

  return (
    <Container maxW="container.xl" px={4} py={8}>
      <NavbarClient />
      {dashboardData && <AdminDashboard dashboardData={dashboardData} />}
    </Container>
  )
}