"use client"

import { cn } from "@/lib/utils"
import { TaskList } from "./task-list"
import { useTasks } from "@/context/tasksContext"

// Component to display tasks for given user and date
export const TaskCol = ({ user, date, className }) => {

  const { getTaskByUserByDate, completeTask } = useTasks();

  const tasks = getTaskByUserByDate(user.uid, date);

  const notCompleted = tasks.filter(task => !task.completed)
  
  const handleComplete = async (task) => {
    await completeTask(task.id)
  };


  return (
    <div className={cn("bg-primary rounded-xl min-h-1/2 p-4 lg:max-w-3xl mx-auto", className )}>
      {/* Task Progress */}
      {/* Admin switch */}
      <div className="flex-1">
        <TaskList tasks={notCompleted} handleComplete={handleComplete} />

      </div>
      {/* ADMIN add button */}
    </div>
  )
}