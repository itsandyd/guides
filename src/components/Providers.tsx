'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { FC, ReactNode } from 'react'
import { TooltipProvider } from './ui/tooltip'

interface LayoutProps {
  children: ReactNode
}

const queryClient = new QueryClient()

const Providers: FC<LayoutProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}

export default Providers
