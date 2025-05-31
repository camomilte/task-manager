"use client"

import { db } from "@/lib/firebase";
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
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
    if(!authLoaded || !user) return;

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
      const updatedTasks = querySnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTasks(updatedTasks);
      setLoading(false);
    })
    return () => unsub()

  }, [isAdmin, user])

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

  /// / 
  // Function to complete task
  /// /
  const completeTask = async (taskId) => {
    setLoading(true)
    try {
      const taskRef = doc(db, "tasks", taskId)
      await updateDoc(taskRef, {
        completed: true
      })
    } catch (error) {
      console.error("Error updating task: ", error);
    } finally {
      setLoading(false)
    }
  }

  /// /
  // Function to get user by user and date
  /// /
  const getTaskByUserByDate = (uid, date) => {

    const formatted = format(date, "yyyy-MM-dd"); // Ensure consistent format
    return tasks
      .filter(task =>
        task.ownerId === uid &&
        task.date === formatted
      )
      .sort((a, b) => a.order - b.order);
    }

  // Define value
  const value = {
    tasks,
    addTask,
    getTaskByUserByDate,
    completeTask,
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