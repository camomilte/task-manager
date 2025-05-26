"use client"

// Import media
import logoIcon from "../../public/logo-icon.svg";
import { GoTasklist } from "react-icons/go";
import { FaUser, FaUsers } from "react-icons/fa";
import { BiSolidAddToQueue } from "react-icons/bi";

// Import functions and components
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { AvatarDropdown } from "./avatardropdown";
import { useAuth } from "@/context/authContext";

export const Navbar = () => {

  const { isAdmin } = useAuth();

  return (
    <nav className="flex items-center justify-between py-5">
      {/* ---- DESKTOP LOGO ---- */}
      <Link href="/" className={cn(" hidden md:block font-pacifico text-3xl text-primary")}>
        <span>Task Manager</span>
      </Link>
      {/* ---- MOBILE LOGO ---- */}
      <Link href="/" className={cn("md:hidden")}>
        <Image 
          priority
          src={logoIcon}
          width={48}
          alt="Task Manager logo icon"/>
      </Link>
      
      {/* ---- DESKTOP NAV RIGHT ----- */}
      <div className="hidden md:flex gap-6 items-center">
        <Button asChild className="nav-btn">
            <Link href="/tasks">Tasks</Link>
        </Button>

        {/* ---- ADMIN ONLY ---- */}
        {
          isAdmin() && (
            <>
              <Button asChild className="nav-btn">
                <Link href="/all">Users</Link>
              </Button>
              <Button asChild className="nav-btn">
                <Link href="/add-task">Add task</Link>
              </Button>
            </>
          )
        }

        <AvatarDropdown />
      </div>

      {/* ---- MOBILE NAV RIGHT ---- */}
      <div className="flex gap-4 items-center md:hidden">
        <Button asChild className="nav-btn-mobile">
          <Link href="/tasks"><GoTasklist className="size-5" /></Link>
        </Button>

        {/* ---- ADMIN ONLY ---- */}
        {
          isAdmin() && (
            <>
              <Button asChild className="nav-btn-mobile">
                <Link href="/all"><FaUsers className="size-5"/></Link>
              </Button>
              <Button asChild className="nav-btn-mobile">
                <Link href="/add-task"><BiSolidAddToQueue className="size-5"/></Link>
              </Button>
            </>
          )
        }
        <AvatarDropdown />
      </div>
    </nav>
  )
}

