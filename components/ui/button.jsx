"use client";

import React from 'react';

export function Button({ 
  children, 
  onClick, 
  className = "", 
  variant = "default",
  size = "default",
  asChild,
  ...props 
}) {
  const baseStyle = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-600 dark:hover:bg-gray-800 hover:bg-gray-100",
    secondary: "dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 bg-gray-200 text-gray-800 hover:bg-gray-300",
  };
  
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8 text-lg",
  };

  const Comp = asChild ? React.Children.only(children).type : "button";
  
  return (
    <Comp
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {asChild ? React.Children.only(children).props.children : children}
    </Comp>
  );
}
