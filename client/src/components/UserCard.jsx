import React, { use } from 'react'
import { dummyUserData } from '../assets/assets'
import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react';

const UserCard = ({user}) => {
    const currentUser = dummyUserData;

const handleFollow= async()=>{
    
}
const handleConnectionRequest= async()=>{

}

  return (
    <div key={user._id} className='p-4 pt-6 flex flex-col justify-between w-72 shadow border border-purple-200 rounded-md'>
    <div className='text-center'>
        <img src={user.profile_picture} alt='' className='rounded-full w-16 shadow mx-auto'/>
        <p className='mt-4 font-semibold'>{user.full_name}</p>
        {
            user.username&&<p className='text-gray-500 font-light'>@{user.username}</p>
        }
        {
            user.bio&&<p className='text-gray-500 font-light text-sm'>{user.bio}</p>
        }
    </div>
    <div className='flex items-center justify-center gap-2 mt-4 text-xs text-gray-600'>
        <div className='flex items-center gap-1'>
            <MapPin className='w-4 h-4'/>{user.location}
        </div>
        <div className='flex items-center gap-1'>
        <span> 
        { user.followers.length} Followers</span>
        </div>
    </div>
    {/* butts */}
    <div className='flex mt-4 gap-2'>
    <button
    onClick={handleFollow}
     disabled={currentUser?.following.includes(user._id)} className='w-full py-2 rounded-md flex justify-center items-center gap-2 bg-purple-500 active:scale-95 text-white cursor-pointer hover:bg-purple-600'>
        <UserPlus className='w-4 h-4'/>{currentUser?.following.includes(user._id)?'Following':'Follow'}
    </button>
    {/* connection request */}
    <button className='flex items-center justify-center w-16 border rounded-md border-purple-200'>

        {currentUser?.connections.includes(user._id)?
        <MessageCircle className='w-5 h-5 group-hover:scale-105 transition cursor-pointer'/>:
        <Plus className='w-5 h-5 group-hover:scale-105 transition cursor-pointer'/>}
    </button>

    </div>
      
    </div>
  )
}

export default UserCard
