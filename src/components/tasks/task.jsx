
export const Task = ({ task, handleComplete }) => {
  return (
    <div className="p-4 shadow-sm bg-background rounded-lg">
      <span>{task.title}</span>
    </div>
  )
}

