import { Settings } from "./_components/settings"

function SettingsPage() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="font-pacifico text-4xl text-primary my-10">User Settings</h1>
      <Settings />
    </div>
  )
}

export default SettingsPage
