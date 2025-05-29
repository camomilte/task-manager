import { AddTaskForm } from "./_components/add-task-form"

function AddTaskPage( { user }) {
  console.log("Current UID:", user?.uid);

  return (
    <div className="bg-secondary-100 rounded-xl min-h-1/2 p-4 lg:max-w-3xl mx-auto mb-10 py-10">
      <h1 className="text-primary text-3xl text-center font-abril-fat pb-6 border-b border-primary">Create Task</h1>
      <AddTaskForm />
    </div>
  )
}

export default AddTaskPage
