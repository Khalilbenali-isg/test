import { useColorModeValue } from '@/components/ui/color-mode'
import { Box, Image, Heading, Text, HStack, IconButton, Button, Input, Stack } from '@chakra-ui/react'
import { MdDelete } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'
import React, { useState } from 'react'
import { useUserStore } from '@/store/user'
import { toaster } from '@/components/ui/toaster'
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogRoot,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'

const UserCard = ({ user }) => {
  const [updatedUser, setUpdatedUser] = useState(user)
  const textColor = useColorModeValue('gray.800', 'gray.200')
  const bg = useColorModeValue('white', 'gray.700')
  const { deleteUser, updateUser } = useUserStore()

  const handleDeleteUser = async (uid) => {
    const { success, message } = await deleteUser(uid)
    if (!success) {
      toaster.create({
        title: 'Error',
        description: message,
        status: 'error',
        type: 'error',
        isClosable: true,
      })
    } else {
      toaster.create({
        title: 'Success',
        description: message,
        type: 'success',
        isClosable: true,
      })
    }
  }

  const handleUpdateUser = async (uid, updatedUser) => {
    const { success, message } = await updateUser(uid, updatedUser)
    console.log(success, message)
  }

  return (
    <Box
      overflow={'hidden'}
      bg={bg}
      p={6}
      rounded={'lg'}
      shadow={'lg'}
      _hover={{ transform: 'scale(1.05)' }}
    >
      <Image
        src={user.image}
        alt={user.name}
        h={48}
        w="full"
        objectFit="cover"
      />
      <Box p={4} textAlign="center">
        <Heading as="h3" size="md" mb={2}>
          {user.name}
        </Heading>
        <Text fontWeight="bold" fontSize="lg" color={textColor} mb={2}>
          {user.email}
        </Text>
        <HStack justifyContent="center">
          <IconButton aria-label="Delete User" onClick={() => handleDeleteUser(user._id)}>
            <MdDelete />
          </IconButton>
          <DialogRoot>
            <DialogTrigger asChild>
              <Button><FaEdit /></Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>
              <DialogBody pb="4">
                <Stack gap="4">
                  <Field label="Name">
                    <Input
                      placeholder="Name"
                      name="name"
                      value={updatedUser.name}
                      onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                    />
                  </Field>
                  <Field label="Email">
                    <Input
                      placeholder="Email"
                      name="email"
                      value={updatedUser.email}
                      onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                    />
                  </Field>
                  <Field label="Password">
                    <Input
                      placeholder="Password"
                      name="password"
                      type="password"
                      value={updatedUser.password}
                      onChange={(e) => setUpdatedUser({ ...updatedUser, password: e.target.value })}
                    />
                  </Field>
                  <Field label="Image URL">
                    <Input
                      placeholder="Image URL"
                      name="image"
                      value={updatedUser.image}
                      onChange={(e) => setUpdatedUser({ ...updatedUser, image: e.target.value })}
                    />
                  </Field>
                </Stack>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <Button onClick={() => handleUpdateUser(user._id, updatedUser)}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </HStack>
      </Box>
    </Box>
  )
}

export default UserCard
