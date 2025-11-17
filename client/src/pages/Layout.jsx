import { List, Menu,  X } from 'lucide-react'
import React, { useState } from 'react'
import { Outlet } from 'react-router'
import { dummyUserData } from '../assets/assets'
import Loader from '../components/Loader'
import Sidebar from '../components/Sidebar'

const Layout = () => {
    const user = dummyUserData

    const [sidebarOPen, setSidebarOpen] = useState(false);
    return user ? (
        <div className='w-full flex h-screen '>
            <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 z-40
          ${sidebarOPen? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:w-64`}
      >
            <Sidebar/>
            </div>
            <div className='flex-1 bg-slate-50'>
                <Outlet />
            </div>
            {
                sidebarOPen ? <X className='absolute top-3 cursor-pointer right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden'
                    onClick={() => setSidebarOpen(false)}
                /> :
                    <Menu className='absolute top-3 right-3 cursor-pointer p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden'
                        onClick={() => setSidebarOpen(true)}
                    />
            }
        </div>
    ) : (
        <Loader />
    )
}

export default Layout