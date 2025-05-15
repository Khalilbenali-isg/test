'use client'

import React from 'react';
import { Box, Flex, Icon, VStack, Text } from '@chakra-ui/react';
import { FiHome, FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const LinkItems = [
  { name: 'Products', icon: FiHome, to: '/' },
  { name: 'users', icon: FiSettings, to: '/users' },
  { name: 'register', icon: FiSettings, to: '/users/create' },
  { name: 'login', icon: FiSettings, to: '/users/login' },
  { name: 'subscriptions', icon: FiSettings, to: '/subscriptions' },
  { name: 'modify', icon: FiSettings, to: '/users/ModifyProfile' },
  { name: 'home', icon: FiSettings, to: '/home' },
  { name: 'cart', icon: FiSettings, to: '/cart' },
  { name: 'product', icon: FiSettings, to: '/productdetails' },
  { name: 'store', icon: FiSettings, to: '/store' },
  { name: 'front', icon: FiSettings, to: '/front' },
  { name: 'UserProductsPage', icon: FiSettings, to: '/UserProductsPage' },
  { name: 'Feedbacks', icon: FiSettings, to: '/feedbacks' },
  { name: 'stats', icon: FiSettings, to: '/admindashboard' },
];

const Sidebar = () => {
  return (
    <Box
      
      borderRight='1px'
      borderRightColor='gray.300'
      w={60}
      h='full'
      
      p={4}>
      <Text fontSize='2xl' fontWeight='bold' mb={6}>Logo</Text>
      <VStack align='stretch' spacing={4}>
        {LinkItems.map((link) => (
          <Link to={link.to} key={link.name}>
            <Flex
              align='center'
              p='4'
              borderRadius='lg'
              transition='0.3s'
              _hover={{ bg: 'cyan.400', color: 'white', transform: 'scale(1.05)' }}>
              <Icon as={link.icon} mr='4' />
              {link.name}
            </Flex>
          </Link>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;
