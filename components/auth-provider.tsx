"use client"

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider 
      session={null}
      refetchInterval={0} 
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  )
} 