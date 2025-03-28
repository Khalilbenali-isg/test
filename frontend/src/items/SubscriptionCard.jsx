import { useColorModeValue } from '@/components/ui/color-mode';
import { Box, Heading, Text, HStack, IconButton, Button, Input, Stack, Badge } from '@chakra-ui/react';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import React, { useState } from 'react';
import { useSubscriptionStore } from '@/store/Subscription';
import { toaster } from '@/components/ui/toaster';
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogRoot,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";

const SubscriptionCard = ({ subscription }) => {
  const [updatedSubscription, setUpdatedSubscription] = useState(subscription);
  const textColor = useColorModeValue("gray.800", "gray.200");
  const bg = useColorModeValue("gray.100", "gray.700");
  const { deleteSubscription, updateSubscription } = useSubscriptionStore();

  const handleDeleteSubscription = async (id) => {
    const { success, message } = await deleteSubscription(id);
    toaster.create({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      type: success ? "success" : "error",
      isClosable: true,
    });
  };

  const handleUpdateSubscription = async (id, updatedData) => {
    const { success, message } = await updateSubscription(id, updatedData);
    toaster.create({
      title: success ? "Updated" : "Error",
      description: message,
      status: success ? "success" : "error",
      type: success ? "success" : "error",
      isClosable: true,
    });
  };

  return (
    <Box
      overflow={"hidden"}
      bg={bg}
      p={6}
      rounded={"lg"}
      shadow={"lg"}
      _hover={{ transform: "scale(1.05)" }}
    >
      <Box p={4}>
        <Heading as="h3" size="md" mb={2}>
          {subscription.name}
        </Heading>
        <Text fontWeight="bold" fontSize="xl" color={textColor} mb={2}>
          Price: ${subscription.price}
        </Text>
        <HStack spacing={2} mb={4} flexWrap="wrap">
          {Object.entries(subscription.options).map(([key, value]) => (
            <Badge key={key} colorScheme={value ? "green" : "red"}>
              {key}: {value ? "Enabled" : "Disabled"}
            </Badge>
          ))}
        </HStack>
        <HStack>
          <IconButton aria-label="delete" onClick={() => handleDeleteSubscription(subscription._id)}>
            <MdDelete />
          </IconButton>
          <DialogRoot>
            <DialogTrigger asChild>
              <Button>
                <FaEdit />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Subscription</DialogTitle>
              </DialogHeader>
              <DialogBody pb="4">
                <Stack gap="4">
                  <Field label="Name">
                    <Input
                      placeholder="Name"
                      value={updatedSubscription.name}
                      onChange={(e) =>
                        setUpdatedSubscription({ ...updatedSubscription, name: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Price">
                    <Input
                      placeholder="Price"
                      type="number"
                      value={updatedSubscription.price}
                      onChange={(e) =>
                        setUpdatedSubscription({ ...updatedSubscription, price: e.target.value })
                      }
                    />
                  </Field>
                  {Object.entries(updatedSubscription.options).map(([key, value]) => (
                    <Field label={`Option: ${key}`} key={key}>
                      <Button
                        onClick={() =>
                          setUpdatedSubscription({
                            ...updatedSubscription,
                            options: {
                              ...updatedSubscription.options,
                              [key]: !value,
                            },
                          })
                        }
                      >
                        {value ? "Disable" : "Enable"}
                      </Button>
                    </Field>
                  ))}
                </Stack>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <Button
                  onClick={() => handleUpdateSubscription(subscription._id, updatedSubscription)}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </HStack>
      </Box>
    </Box>
  );
};

export default SubscriptionCard;
