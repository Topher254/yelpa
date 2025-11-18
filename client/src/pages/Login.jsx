import React from 'react'
import { assets } from '../assets/assets'
import { Star } from 'lucide-react'
import Logo from '../components/Logo'
import {SignIn} from '@clerk/clerk-react'

const Login = () => {
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <img src={assets.bgImage} alt='bg-image' className='absolute top-0 left-0 -z-1 w-full h-full object-cover' />


      <div className='flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:p-40'>
        <Logo />
        <div>
          <div className='flex items-center gap-3 mb-4 max-md:mt-10'>
            <img src={assets.group_users} alt='users' className='h-8 md:h-10' />
            <div>
              <div className='flex'>
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} className='size-4 text-transparent fill-amber-500' />
                ))}
              </div>
              <p className='text-sm'>Used by All people</p>
            </div>
          </div>
          <h1 className='text-3xl md:text-6xl font-bold text-purple-600'>Take a deep breath. You’re home now.</h1>
          <p className='text-xl text-purple-900'>The place where your emotions can breath</p>
        </div>
        <div className='md:h-10'></div>
      </div>


      <div className='flex-1 flex items-center justify-center p-6 sm:p-10'>
        <SignIn/>
      </div>
    </div>
  )
}

export default Login
