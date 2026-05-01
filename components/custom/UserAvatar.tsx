"use client";
import Link from "next/link";
import { signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";

export default function UserAvatar() {
  const handleLogout = async () => {
    signOut({ callbackUrl: "/login" })
    console.log("Logging out...");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none cursor-pointer">
          <ShadcnAvatar className="h-10 w-10">
            <AvatarImage src="/profile.jpg" alt="User avatar" />
            <AvatarFallback>AR</AvatarFallback>
          </ShadcnAvatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 cursor-pointer"
          >
            <User size={16} />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut size={16} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
