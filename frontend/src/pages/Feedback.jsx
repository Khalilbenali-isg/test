"use client"

import { Input, InputGroup, Span } from "@chakra-ui/react"
import { useState } from "react"
import { useUserStore } from "../store/user";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


const MAX_CHARACTERS = 20

const Feedback = () => {
  const [value, setValue] = useState("")
  const { loggedInUser } = useUserStore();
  const navigate = useNavigate();
  
  console.log(loggedInUser)

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/users/login'); 
    }
  }, [loggedInUser, navigate]);
    
  return (
    <InputGroup
      endElement={
        <Span color="fg.muted" textStyle="xs">
          {value.length} / {MAX_CHARACTERS}
        </Span>
      }
    >
      <Input
        placeholder="Enter your message"
        value={value}
        maxLength={MAX_CHARACTERS}
        onChange={(e) => {
          setValue(e.currentTarget.value.slice(0, MAX_CHARACTERS))
        }}
      />
    </InputGroup>
  )
}

export default Feedback;