"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const DialogContext = createContext(null);

export function Dialog({ children, open: controlledOpen, onOpenChange }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  
  // Determine if this is a controlled or uncontrolled component
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  
  const setOpen = (newOpen) => {
    // Update state
    if (!isControlled) {
      setUncontrolledOpen(newOpen);
    }
    
    // Call onOpenChange if provided
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };
  
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children, asChild }) {
  const { setOpen } = useContext(DialogContext);
  
  if (asChild) {
    return React.cloneElement(children, {
      onClick: (e) => {
        children.props.onClick?.(e);
        setOpen(true);
      },
    });
  }
  
  return (
    <button onClick={() => setOpen(true)}>
      {children}
    </button>
  );
}

export function DialogContent({ children, className = "" }) {
  const { open, setOpen } = useContext(DialogContext);
  
  if (!open) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dialog-overlay" onClick={() => setOpen(false)}>
      <div 
        className={`bg-gray-800 p-6 rounded-lg max-w-md w-full ${className}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button 
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
