import { FaTrashCan } from "react-icons/fa6";
import { Button } from "../ui/button";

export const Task = ({ task, handleComplete }) => {
  return (
    <div className="p-4 ps-6 shadow-sm flex justify-between items-center bg-background rounded-lg" onClick={() => handleComplete(task)}>
      <span className="text-lg">{task.title}</span>
      <Button className="rounded-full size-12 bg-transparent border-2 border-accent hover:bg-accent-200 cursor-pointer"><FaTrashCan className="text-accent" onClick={() => handleComplete(task)}/></Button>
    </div>
    
  )
}

