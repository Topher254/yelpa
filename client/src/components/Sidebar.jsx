import React from 'react'
import Logo from './Logo'
import { useNavigate, Link } from 'react-router'
import MenuItems from './MenuItems'
import { CirclePlus, LogOut } from 'lucide-react'
import { UserButton, useClerk } from '@clerk/clerk-react'
import { dummyUserData } from '../assets/assets'

const Sidebar = () => {
  const navigate = useNavigate()
  const user = dummyUserData
  const { signOut } = useClerk()

  return (
    <div className="h-screen w-64 bg-white border-r text-black flex flex-col">
      
      <div className="p-4 flex-1 flex flex-col">
        <Logo onClick={() => navigate('/')} />

        <hr className="text-gray-200 mt-2" />

        <div className="pt-4">
          <MenuItems />
        </div>

        <div className="w-full mt-4">
          <Link
            to="/create-post"
            className="flex cursor-pointer transition-all hover:scale-105 hover:bg-purple-600 duration-300 justify-center items-center gap-2 rounded-lg bg-purple-500 text-white p-2"
          >
            <CirclePlus className="w-5 h-5" />
            Create Post
          </Link>
        </div>
      </div>

      <div className="w-full border-t px-4 py-3 flex items-center justify-between">
        <div className="flex gap-2 items-center cursor-pointer">
          <UserButton />
          <div>
            <h1 className="text-sm font-medium">{user.full_name}</h1>
            <p className="text-xs font-medium text-gray-500">@{user.username}</p>
          </div>
        </div>

        <LogOut
          onClick={signOut}
          className="w-5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        />
      </div>

    </div>
  )
}

export default Sidebar
