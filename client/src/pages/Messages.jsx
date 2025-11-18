import React, { useState } from 'react'
import { dummyConnectionsData } from '../assets/assets'
import { Eye, MessagesSquare } from 'lucide-react'
import {useNavigate} from 'react-router'

const Messages = () => {

const navigate = useNavigate()

  return (
    <div className='min-h-screen relative bg-purple-50'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* tittle */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-purple-800'>Yelps</h1>
          <p className='text-purple-600'>Message anyone for help</p>
        </div>
        {/* conncted users */}
        <div className='flex flex-col gap-3'>
          {dummyConnectionsData.map((user, index) => (
            <div key={user._id} className='max-w-xl flex justify-start  gap-5 p-5 bg-white shadow rounded-md'>

              <img src={user.profile_picture} className='rounded-full size-12 mx-auto' />
              <div className='flex-1'>

                <p className='font-medium text-purple-700'>{user.full_name}</p>
                <p className='text-purple-500'>@{user.username}</p>
                <p className='text-sm text-gray-600'>{user.bio}</p>
              </div>
              <div className='flex flex-col gap-2 mt-4'>

                <button onClick={()=>navigate(`/messages/${user._id}`)} className='size-10 flex items-center justify-center text-sm gap-1  rounded bg-purple-100 hover:bg-purple-200 active:scale-95 transition cursor-pointer'>
                  <MessagesSquare className='w-4 h-4'/>
                </button>
                <button onClick={()=>navigate(`/profile/${user._id}`)} className='size-10 flex items-center justify-center text-sm  rounded bg-purple-100 hover:bg-purple-200 active:scale-95 transition cursor-pointer'>
                  <Eye className='w-4 h-4'/>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Messages
