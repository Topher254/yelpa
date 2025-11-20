import React from 'react'
import Logo from './Logo'
import { useNavigate, Link } from 'react-router'
import MenuItems from './MenuItems'
import { CirclePlus, LogOut } from 'lucide-react'
import { UserButton, useClerk, useUser } from '@clerk/clerk-react'

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate()
  const { signOut } = useClerk()
  const { user } = useUser()

  // Close sidebar on mobile after navigating
  const safeNavigate = (path) => {
    navigate(path)
    if (onClose) onClose()
  }

  return (
    <div className="h-full w-64 bg-white border-r text-black flex flex-col">

      <div className="p-4 flex-1 flex flex-col">

        {/* Logo */}
        <div onClick={() => safeNavigate('/')} className="cursor-pointer">
          <Logo />
        </div>

        <hr className="text-gray-200 mt-2" />

        {/* Menu Items (Pass onClose so links can auto-close mobile sidebar) */}
        <div className="pt-4">
          <MenuItems onItemClick={onClose} />
        </div>

        {/* Create Post Button */}
        <div className="w-full mt-4">
          <Link
            to="/create-post"
            onClick={onClose}
            className="flex cursor-pointer transition-all hover:scale-105 hover:bg-purple-600 duration-300 justify-center items-center gap-2 rounded-lg bg-purple-500 text-white p-2"
          >
            <CirclePlus className="w-5 h-5" />
            Create Post
          </Link>
        </div>

      </div>

      {/* Footer user section */}
      <div className="w-full border-t px-4 py-3 flex items-center justify-between">

        <div className="flex gap-2 items-center cursor-pointer" onClick={onClose}>
          <UserButton />
          <div>
            <h1 className="text-sm font-medium">{user?.fullName || 'User'}</h1>
            <p className="text-xs font-medium text-gray-500">
              @{user?.username || user?.fullName?.toLowerCase().replace(/\s+/g, '_')}
            </p>
          </div>
        </div>

        <LogOut
          onClick={() => {
            signOut()
            if (onClose) onClose()
          }}
          className="w-5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        />
      </div>

    </div>
  )
}

export default Sidebar
