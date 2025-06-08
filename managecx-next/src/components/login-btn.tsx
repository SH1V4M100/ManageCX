"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import React from "react";
import Button from "./ui/button"; // adjust import path as needed

interface LoginButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
}) => {
  const { data: session } = useSession();

  const handleClick = () => {
    session ? signOut() : signIn();
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
    >
      {children}
    </Button>
  );
};

export default LoginButton;
