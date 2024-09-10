import React from 'react'
import { Button, ButtonProps } from './Button'
import { Loader2 } from 'lucide-react'

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ 
  children, 
  isLoading, 
  disabled,
  ...props 
}) => {
  return (
    <Button {...props} disabled={disabled || isLoading}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  )
}

export default LoadingButton