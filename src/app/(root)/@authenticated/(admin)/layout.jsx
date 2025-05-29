"use client"

// Import hooks
import { useEffect } from "react";
import { useRouter } from "next/navigation"
import { useAuth }  from "@/context/authContext";

function AdminLayout({ children }) {
  // Destructure isAdmin from authhentication context
  const { isAdmin } = useAuth();
  // Get Next.js router
  const router = useRouter();

  
  useEffect(() => {
    // If the user is not admin, redirect to home page
    if(!isAdmin()) {
      router.replace("/")
    };
  }, [isAdmin, router]); // Run the effect again if isAdmin or router changes

  // Prevent rendering children before admin check is done
  if(!isAdmin()) {
    return null // Prevent showing admin-only content
  }

  // If admin, render children inside layout
  return (
    <>{ children }</>
  )
};
export default AdminLayout