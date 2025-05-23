// Allow client-side rendering
"use client"

// Import components and context
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext"

export const LogOut = () => {
  // Access log out logic
  const { logout } = useAuth();

  return (
    <Button onClick={logout}>Log out</Button>
  )
};