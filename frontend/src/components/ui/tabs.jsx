import React from 'react'

export function Tabs({ value, onValueChange, children }) {
  return <div>{children}</div>
}

export function TabsList({ children, className = '' }) {
  return <div className={`flex space-x-2 ${className}`}>{children}</div>
}

export function TabsTrigger({ value, children, className = '', ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children }) {
  return <div>{children}</div>
} 