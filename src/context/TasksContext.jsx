"use client"

import { db } from "@/lib/firebase";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useAuth } from "./authContext";
import { format } from "date-fns";

// Import React hooks and functions
const { createContext, useContext, useState, useEffect } = require("react");

// Create context for task data
const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  // Store tasks in local state
  const [tasks, setTasks] = useState([]);
  // Tracks the loading state of an async operation 
  const [loading, setLoading] = useState(false);
  // Get authentication logic
  const { isAdmin, authLoaded, user } = useAuth();

  useEffect(() => {
    if(!authLoaded || user) return;

    setLoading(true);
    
    let q

    if(isAdmin()) {
      q = query(collection(db, "tasks"), orderBy("date"), orderBy("order"))
    } else {
      q = query(
        collection(db, "tasks"), 
        where("ownerId", "==", user.uid),
        orderBy("date"),
        orderBy("order")
      )
    }

    const unsub = onSnapshot(q, querySnap => {
      const updatedTasks = querySnap.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTasks(updatedTasks);
      setLoading(false);
    })
  }, [isAdmin])

  const getNextOrder = () => {
    return Math.max(...tasks.map(task => task.order ?? 0), 0) + 1000
  }

  /// / 
  // Function to add tasks
  /// /
  const addTask = async (taskData) => {
    if(!isAdmin()) return
    
    setLoading(true)

    try {
      const newTask = {
        ...taskData,
        date: format(taskData.date, "yyyy-MM-dd"),
        order: getNextOrder(),
        completed: false,
        createdAt: serverTimestamp()
      }

      await addDoc(collection(db, "tasks"), newTask)
    } catch (error) {
      console.log(error);
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Define value
  const value = {
    tasks,
    addTask,
    loading
  }

  // Provide context value to children components
  return (
    <TasksContext.Provider value={value}>
      { children }
    </TasksContext.Provider>
  )
};

// Custom hook to consume TasksContext
export const useTasks = () => {
  const context = useContext(TasksContext)

  // Ensure hook is used within TaskProvider
  if(!context) {
      throw new Error("useTasks must be inside TasksProvider");
  };
  return context
}