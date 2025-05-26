// Import shadcn components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Import media
import { FaUser, FaRegUser } from "react-icons/fa";
import { LuSettings } from "react-icons/lu";
import { TbLogout } from "react-icons/tb";

import Link from "next/link";
import { useAuth } from "@/context/authContext";


export const AvatarDropdown = () => {

  const { user } = useAuth();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={user?.photoURL || "" }/>
            <AvatarFallback className="bg-primary p-0 size-13">
                <FaUser className="size-5 text-background"/>  
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-50">
          <DropdownMenuItem asChild className="mb-2"> 
            <Link href="/profile" className="flex items-center">
              <FaRegUser className="text-inherit"/>
              My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="mb-2"> 
            <Link href="/settings" className="flex items-center">
              <LuSettings className="text-inherit"/>
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="bg-accent text-background font-bold hover:underline hover:bg-primary"> 
              <TbLogout className="text-inherit"/>
              Log out
          </DropdownMenuItem>
          
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  )
}

