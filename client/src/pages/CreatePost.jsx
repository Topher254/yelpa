import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Image, X } from 'lucide-react'
import toast from 'react-hot-toast'

const CreatePost = () => {
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const user = dummyUserData;
  const handleSubmit = async()=>{

  }

  return (
    <div className='min-h-screen bg-purple-50'>
      <div className='max-w-6xl mx-auto p-6'>

        {/* Title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-purple-800'>Create Yelp</h1>
          <p className='text-purple-600'>Share everything with the world</p>
        </div>

        {/* Form Container */}
        <div className='max-w-xl bg-white rounded-xl shadow-md p-5 space-y-4'>

          <div className='flex items-center gap-3'>
            <img
              src={user.profile_picture}
              className='w-12 h-12 rounded-full shadow object-cover'
            />
            <div className='flex flex-col'>
              <h2 className='font-semibold text-gray-800'>{user.full_name}</h2>
              <p className='text-gray-500 text-sm'>@{user.username}</p>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            className='w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400'
            placeholder='What is happening?'
            onChange={(e) => setContent(e.target.value)}
            value={content}
          ></textarea>

          {/* Images Preview */}
          {images.length > 0 && (
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              {images.map((image, i) => (
                <div key={i} className='relative group rounded-lg overflow-hidden border'>

                  <img
                    src={URL.createObjectURL(image)}
                    className='w-full h-40 object-cover'
                  />

                  <div
                    onClick={() =>
                      setImages(images.filter((_, index) => index !== i))
                    }
                    className='absolute top-2 right-2 bg-black/60 p-1 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition'
                  >
                    <X className='w-4 h-4 text-white' />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Bar */}
          <div className='flex items-center justify-between border-t border-gray-300 pt-3'>

            <label
              htmlFor='images'
              className='flex items-center gap-2 text-purple-600 cursor-pointer hover:text-purple-800 transition'
            >
              <Image className='size-6' />
              <span className='text-sm'>Add images</span>
            </label>

            {/* image */}
            <input
              type='file'
              id='images'
              accept='image/*'
              hidden
              multiple
              onChange={(e) =>
                setImages([...images, ...Array.from(e.target.files)])
              }
            />

            <button disabled={loading} onClick={()=>toast.promise(handleSubmit(),
            {
              loading:'Uploading ...',
              success:<p>Yelp added</p>,
              error:<p>Yelp not added</p>
            }
            
            )} className='bg-purple-500 text-white px-4 py-2 cursor-pointer rounded-full hover:bg-purple-600 transition'>
              Publish Yelp
            </button>

          </div>

        </div>

      </div>
    </div>
  )
}

export default CreatePost
