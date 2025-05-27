import Image from "next/image";
import logo from "../../../../../../public/logo-icon.svg"
import { UserInfoForm } from "./user-info-form";

export const SettingsForm = ({ user, isOwn }) => {
  return (
    <>
      <div className="bg-secondary w-full rounded-xl min-h-1/2 p-4 lg:max-w-3xl mx-auto">
        <div className="flex gap-4 border-b-1 border-backgound py-2">
          <Image 
            priority
            src={logo} 
            alt="Profile picture"
            className="size-10 rounded-full border-3"
            />
          <h2 className="font-abril-fat text-3xl">Username</h2>
        </div>
        <UserInfoForm user={user} />
      </div>
    </>
  )
}
