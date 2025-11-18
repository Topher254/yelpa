import React, { useState } from 'react'
import { dummyConnectionsData } from '../assets/assets';
import { Search } from 'lucide-react';
import UserCard from '../components/UserCard';
import Loader from '../components/Loader';

const Discover = () => {
  const [input, setInput] = useState('');
  const [users, setUsers] = useState(dummyConnectionsData);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (e.key === 'Enter') {
      setUsers([]);
      setLoading(true);
      setTimeout(() => {
        setUsers(dummyConnectionsData);
        setLoading(false)
      }, 1000)
    }
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl w-full mx-auto p-6'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-purple-800'>Discover People</h1>
          <p className='text-purple-600'>Connect with amazing people. Save a life</p>
        </div>

        {/* search */}
        <div className='mb-8 shadow-md rounded-full border border-slate-50 bg-white'>
        <div className='p-6'>
        <div className='relative'>


          <Search className='absolute cursor-pointer left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5'/>
          <input
          onChange={(e)=>setInput(e.target.value)} value={input} onKeyUp={handleSearch}
           type='text' placeholder='search people ...' className='pl-10 p-2 sm:pl-12 w-full border border-gray-300 rounded-full outline-none'/>
        </div>

        </div>



        </div>
        <div className='flex  gap-6'>
        <div className='flex gap-6 w-full'>
          {users.map((user)=>(
            <UserCard user={user} key={user._id}/>
          ))}
        </div>
        </div>

        {
          loading &&(<Loader/>)
        }
      </div>
    </div>
  )
}

export default Discover
