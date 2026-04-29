"use client"
import React from "react";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  return (
    <div>
      <button type="button" onClick={() => signOut({ callbackUrl: "/login" })}>
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
