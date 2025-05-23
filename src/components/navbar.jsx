"use client"

import Image from "next/image";
import Link from "next/link";
import logoIcon from "../../public/logo-icon.svg";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { GoTasklist } from "react-icons/go";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-5">
      <Link href="/" className={cn(" hidden sm:block font-pacifico text-5xl text-primary")}>
        <h1>Task Manager</h1>
      </Link>
      <Link href="/" className={cn("sm:hidden")}>
        <Image 
          priority
          src={logoIcon}
          width={48}
          alt="Task Manager logo icon"/>
      </Link>

      <div>
        <Button asChild size="lg" className="hidden sm:flex">
          <Link href="/tasks">Tasks</Link>
        </Button>
        <Button className="sm:hidden rounded-full h-15 w-15">
          <Link href="/tasks"><GoTasklist size={48} /></Link>
        </Button>
        
      </div>
    </nav>
  )
}

