import Image from "next/image";
import logo from "../../../../../../public/logo-icon.svg"
import { UserInfoForm } from "./user-info-form";
import { FaUserCircle } from "react-icons/fa";

export const SettingsForm = ({ user, isOwn }) => {
  return (
    <>
      <div className="border-3 border-primary w-full rounded-xl min-h-1/2 p-4 lg:max-w-3xl mx-auto">
        <div className="flex gap-3 border-b-1 border-accent py-2">
          {user?.photoURL ? (
            <Image 
              priority
              src={user.photoURL || pfp} 
              alt="Profile picture"
              className="size-10 rounded-full border-3 border-accent"
            />
          ) : (
            <FaUserCircle className="size-10 text-accent" />
          )}
          <h2 className="font-abril-fat text-3xl">{user.userName}</h2>
        </div>
        <UserInfoForm user={user} />
      </div>
    </>
  )
}
