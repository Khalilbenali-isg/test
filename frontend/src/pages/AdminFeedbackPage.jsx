"use client";

import {
  Avatar,
  Button,
  Card,
  HStack,
  Stack,
  Strong,
  Text,
  Alert,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { LuCheck, LuX } from "react-icons/lu";
import { useEffect, useState } from "react";
import useFeedbackStore from "@/store/feedback";
import { toaster, Toaster } from "@/components/ui/toaster"; 

const AdminFeedbackPage = () => {
  const {
    feedbacks,
    loading,
    error,
    fetchFeedbacks,
    approveFeedback,
    deleteFeedback,
    
    setFeedbacks,
  } = useFeedbackStore();

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data.data);
    } catch (err) {
      console.error("Error fetching users");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchUsers();
  }, []);

  const getUserById = (id) => users.find((user) => user._id === id);

  const handleApprove = async (id) => {
    await approveFeedback(id);
    setFeedbacks(feedbacks.filter((fb) => fb._id !== id));
    toaster.create({
      title: "Feedback approuvé avec succès",
      type: "success",
    });
  };

  const handleDelete = async (id) => {
    await deleteFeedback(id);
    setFeedbacks(feedbacks.filter((fb) => fb._id !== id));
    toaster.create({
      title: "Feedback refusé",
      type: "error",
    });
  };

  const pendingFeedbacks = feedbacks.filter((fb) => !fb.Verified);

  return (
    <VStack spacing={6} p={6}>
      <Toaster /> 

      {loading && <Spinner size="xl" />}
      {error && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Erreur</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      {pendingFeedbacks.map((fb) => {
        const user = getUserById(fb.userId);
        return (
          <Card.Root key={fb._id} width="100%" maxW="500px">
            <Card.Body>
              <HStack mb="6" gap="3">
                <Avatar.Root>
                  <Avatar.Image src={user?.image} />
                  <Avatar.Fallback name={user?.name || "Utilisateur"} />
                </Avatar.Root>
                <Stack gap="0">
                  <Text fontWeight="semibold" textStyle="sm">
                    {user?.name || "Utilisateur inconnu"}
                  </Text>
                  <Text color="fg.muted" textStyle="sm">
                    {user?.email || "Email inconnu"}
                  </Text>
                </Stack>
              </HStack>
              <Card.Description>
                <Strong color="fg">{user?.name || "Un utilisateur"}</Strong> a
                laissé un feedback :
                <br />
                <Text mt="2" color="fg.muted">
                  "{fb.message}"
                </Text>
              </Card.Description>
            </Card.Body>

            <Card.Footer>
              <Button
                variant="subtle"
                colorPalette="red"
                flex="1"
                onClick={() => handleDelete(fb._id)}
              >
                <LuX />
                Refuser
              </Button>
              <Button
                variant="subtle"
                colorPalette="blue"
                flex="1"
                onClick={() => handleApprove(fb._id)}
              >
                <LuCheck />
                Approuver
              </Button>
            </Card.Footer>
          </Card.Root>
        );
      })}
    </VStack>
  );
};

export default AdminFeedbackPage;
