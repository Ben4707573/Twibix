"use client";

import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext(null);

export function Tabs({ defaultValue, children, ...props }) {
  const [value, setValue] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div {...props} className="flex flex-col">
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "", ...props }) {
  return (
    <div className={`flex bg-gray-800 rounded-lg p-1 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className = "", ...props }) {
  const context = useContext(TabsContext);
  const isActive = context.value === value;
  
  return (
    <button
      className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
        isActive 
          ? 'bg-gray-700 text-white' 
          : 'text-gray-400 hover:text-gray-200'
      } ${className}`}
      onClick={() => context.setValue(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = "", ...props }) {
  const context = useContext(TabsContext);
  
  if (context.value !== value) {
    return null;
  }
  
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
