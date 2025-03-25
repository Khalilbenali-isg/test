import { useColorMode, useColorModeValue } from "@/components/ui/color-mode"
import { Container } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";
import { HStack, Button } from "@chakra-ui/react";
import { FaSquarePlus } from "react-icons/fa6";
import { Link } from "react-router-dom";


import { Tabs } from "@chakra-ui/react"





const Navbar = () => {
  const { toggleColorMode } = useColorMode()

  const bg = useColorModeValue("white", "gray.800")
  const color = useColorModeValue("white", "gray.800")
  
  return (
    
    <Container maxW="1140px"  px={4} > 
    
      <Flex 
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{
        base:"column",
        sm:"row",
        }}
      >
        <Text textStyle="3xl" >
        <Link to={"/subscriptions"}>Subscriptions</Link>
        </Text>
        <HStack spacing={2} alignItems={"center"}>
          <Link to={"/subscriptions/create"}>
            <Button>
              <FaSquarePlus />


            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={toggleColorMode}>
            Toggle Mode
          </Button>
        </HStack>
      </Flex>
    </Container>
  )
};

export default Navbar;

