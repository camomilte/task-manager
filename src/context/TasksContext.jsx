"use client"

import { serverTimestamp } from "firebase/firestore";

// Import React hooks and functions
const { createContext, useContext, useState } = require("react");

// Create context for task data
const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  // Store tasks in local state
  const [tasks, setTasks] = useState(null);
  // Tracks the loading state of an async operation 
  const [loading, setLoading] = useState(false);

  /// / 
  // Function to add tasks
  /// /
  const addTask = async (taskData) => {
    /* const newTask = {
      title: ,
      ownerId: ,
      date: ,
      order: ,
      deadline: ,
      completed: false,
      completedAt: null,
      createdAt: serverTimestamp()
    } */
  }

  // Define value
  const value = {
    tasks,
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