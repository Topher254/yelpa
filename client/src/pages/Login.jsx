import React from 'react'
import { assets } from '../assets/assets'
import { Star } from 'lucide-react'
import Logo from '../components/Logo'
import { SignIn } from '@clerk/clerk-react'

const Login = () => {
  return (
    <div className='min-h-screen flex flex-col md:flex-row relative'>
      {/* Background Image */}
      <div className='absolute inset-0 -z-10'>
        <img 
          src={assets.bgImage} 
          alt='background' 
          className='w-full h-full object-cover'
        />
       
      </div>

      {/* Left Section */}
      <div className='flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:p-40  relative z-10'>
        <Logo />
        <div className='w-full max-w-lg'>
          <div className='flex items-center gap-3 mb-6 max-md:mt-10'>
            <img 
              src={assets.group_users} 
              alt='users' 
              className='h-8 w-8 rounded-full md:h-10 md:w-10' 
            />
            <div>
              <div className='flex'>
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i} 
                    className='size-4 text-transparent fill-amber-500' 
                  />
                ))}
              </div>
              <p className='text-sm text-gray-600'>Anyone can use it.</p>
            </div>
          </div>
          <h1 className='text-3xl text-purple-500 md:text-6xl font-bold mb-4'>
            Take a deep breath. You're home now.
          </h1>
          <p className='text-xl text-gray-600 '>
            The place where your emotions can breathe
          </p>
        </div>
        <div className='md:h-10'></div>
      </div>

      {/* Right Section - Sign In */}
      <div className='flex-1 flex items-center justify-center p-6 sm:p-10 relative z-10'>
        <div className='w-full max-w-md'>
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl",
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Login