import React from "react";

interface LoginBtnProps {
  color?: string;
  textColor?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
}

export const LoginBtn = ({
  color = "bg-blue-500",
  textColor = "text-white",
  icon,
  onClick,
  children,
}: LoginBtnProps) => {
  return (
    <button
      className={`w-80 h-12 ${color} ${textColor} flex items-center justify-center space-x-2 rounded`}
      onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
