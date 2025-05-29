"use client"

import { db } from "@/lib/firebase";
import { useAuth } from "./authContext";
import { collection, onSnapshot, query } from "firebase/firestore";

// Import React hooks and functions
import { createContext, useContext, useEffect, useState } from "react";



// Create context for users data
const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  // Store users in local state
  const [users, setUsers] = useState([]);
  // Tracks the loading state of an async operation 
  const [loading, setLoading] = useState(false);

  const { isAdmin } = useAuth();

  useEffect(() => {
    if(!isAdmin()) return;


    const q = query(collection(db, "users"))
    const unsub = onSnapshot(q, querySnapshot => {
      const usersData = []

      querySnapshot.forEach(doc => {
        usersData.push({ ...doc.data(), id: doc.id })
      })
      setUsers(usersData)
    })

    return () => unsub()

  }, [isAdmin])

  // Define value
  const value = {
    users,
    loading
  }

  // Provide context value to children components
  return (
    <UsersContext.Provider value={value}>
      { children }
    </UsersContext.Provider>
  )
};

// Custom hook to consume UsersContext
export const useUsers = () => {
  const context = useContext(UsersContext)

  // Ensure hook is used within AuthProvider
  if(!context) {
      throw new Error("useUsers must be inside UsersProvider");
  };
  return context
}