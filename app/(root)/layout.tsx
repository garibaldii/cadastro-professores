import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <main className="font-work-sans">
            <Navbar />
            {children}
            <Footer />
        </main>
    )
}

export default Layout