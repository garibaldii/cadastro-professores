import React from 'react'
import { Toaster } from "@/components/ui/sonner"


const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main className='flex items-center justify-center min-h-screen bg-gray-50'>
      {children}
      <Toaster />
    </main>
  )
}

export default Layout