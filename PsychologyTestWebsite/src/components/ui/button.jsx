import React from 'react'

export function Button({ children, className = '', ...props }) {
  return (
    <button 
      className={`
        px-4 py-2 rounded-full font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        bg-custom-secondary text-custom-black hover:bg-black hover:text-white
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
} 