import { Task } from "./task"


export const TaskList = ({ tasks, handleComplete }) => {
  return (
    <div className="space-y-3 w-full">
      {tasks.length === 0 ? (
        <p className="text-center text-background/60 font-semibold p-5">No tasks on this date</p>
      ) : (
        tasks.map(task => (
          <Task key={task.id} task={task} handleComplete={handleComplete} />
        ))
      )}
    </div>
  )
}

