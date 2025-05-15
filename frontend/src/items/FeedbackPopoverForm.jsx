
import { Box, Button, Text, Portal, Textarea, Popover } from "@chakra-ui/react";
import { useState } from "react";
import useFeedbackStore from "@/store/feedback";
import { useUserStore } from "@/store/user";
import { useNavigate } from "react-router-dom";
import { Toaster, toaster } from "@/components/ui/toaster"
import { useEffect } from "react";


const FeedbackPopoverForm = () => {
  const [newFeedback, setNewFeedback] = useState("");
  const { createFeedback } = useFeedbackStore();
  const { loggedInUser, loadUserFromToken } = useUserStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);


   const [isLoading, setIsLoading] = useState(true); 
    
      useEffect(() => {
        const loadUser = async () => {
          await loadUserFromToken();
          setIsLoading(false); 
        };
        loadUser();
      }, [loadUserFromToken]);
    
      useEffect(() => {
        
        if (!isLoading && !loggedInUser) {
          navigate("/users/login");
          return;
        } else  {
          
        }
        
      }, [loggedInUser, isLoading]);
    



  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!newFeedback.trim()) {
        toaster.create({
            title: "please enter a message to submit",
            type: "warning",
          });
      return;
    }

    if (!loggedInUser) {
        toaster.create({
            title: "you must be logged in ",
            type: "warning",
          });
      return;
    }

    setIsSubmitting(true);
    const success = await createFeedback(loggedInUser._id, newFeedback);
    setIsSubmitting(false);
    
    if (success) {
        toaster.create({
            title: "feedback submitted successfully",
            type: "success",
          });
      setNewFeedback("");
    } else {
        toaster.create({
            title: "Failed to submit feedback",
            type: "error",
          });
    }
  };

  return (
    <Box>
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button colorScheme="teal" size="lg">
            Share Your Experience
          </Button>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content width="350px">
              <Popover.Arrow />
              <Popover.Body p={4}>
                <Popover.Title fontWeight="medium" fontSize="lg">Share Your Feedback</Popover.Title>
                
                {loggedInUser ? (
                  <form onSubmit={handleSubmitFeedback}>
                    <Text my="4">
                      We value your thoughts! Tell us about your experience with our products and services.
                    </Text>
                    <Box mb={4}>
                      <Box 
                        as="textarea" 
                        placeholder="Your feedback..." 
                        value={newFeedback}
                        onChange={(e) => setNewFeedback(e.target.value)}
                        resize="vertical"
                        p={2}
                        borderWidth="1px"
                        borderRadius="md"
                        width="full"
                        height="100px"
                      />
                    </Box>
                    <Button 
                      type="submit" 
                      colorScheme="teal" 
                      width="full"
                      isLoading={isSubmitting}
                      loadingText="Submitting"
                    >
                      Submit
                    </Button>
                  </form>
                ) : (
                  <Box py={2}>
                    <Text mb={3}>Please log in to leave feedback</Text>
                    <Button colorScheme="teal" onClick={() => navigate("/users/login")} width="full">
                      Log In
                    </Button>
                  </Box>
                )}
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </Box>
  );
};

export default FeedbackPopoverForm;