export function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-custom-primary rounded-lg shadow p-6 border border-black ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h2 className={`text-2xl font-bold text-custom-black ${className}`} {...props}>
      {children}
    </h2>
  )
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
} 