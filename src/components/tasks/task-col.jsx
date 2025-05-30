"use client"

import { cn } from "@/lib/utils"
import { TaskList } from "./task-list"
import { useTasks } from "@/context/tasksContext"

// Component to display tasks for given user and date
export const TaskCol = ({ user, date, className }) => {

  const { getTaskByUserByDate, completeTask } = useTasks();

  const tasks = getTaskByUserByDate(user.uid, date);

  const notComlpeted = tasks.filter(task => !task.completed)
  
  const handleComplete = async (task) => {
    completeTask(task.id)
  };


  return (
    <div className={cn("bg-primary p-10 rounded-lg", className )}>
      {/* Task Progress */}
      {/* Admin switch */}
      <div className="flex-1">
        <TaskList tasks={notComlpeted} handleComplete={handleComplete} />

      </div>
      {/* ADMIN add button */}
    </div>
  )
}