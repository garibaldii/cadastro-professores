import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Toaster } from '@/components/ui/sonner'

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <main className="font-work-sans bg-gray-200">
            <Navbar />
            {children}
            <Footer />
            <Toaster />
        </main>
    )
}

export default Layout