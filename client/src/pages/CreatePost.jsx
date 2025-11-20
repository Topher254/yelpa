import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Image, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { postService } from '../services/postService'
import { useNavigate } from 'react-router'

const CreatePost = () => {
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useUser()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) {
      toast.error('Please add some content or images to your post')
      return
    }

    try {
      setLoading(true)
      
      const postData = {
        content: content.trim(),
        image_urls: images.map(img => URL.createObjectURL(img)), // In real app, upload to cloud first
        post_type: images.length > 0 ? (content ? 'text_with_image' : 'image') : 'text'
      }

      await postService.createPost(postData)
      toast.success('Post created successfully!')
      
      // Reset form and redirect
      setContent('')
      setImages([])
      navigate('/') // Redirect to feed
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error(error.response?.data?.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    // Validate file types and size
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        return false
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} is too large. Maximum size is 5MB`)
        return false
      }
      return true
    })
    
    setImages(prev => [...prev, ...validFiles])
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Please log in to create a post</h2>
        </div>
      </div>
    )
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
              src={user.imageUrl}
              className='w-12 h-12 rounded-full shadow object-cover'
              alt="Profile"
            />
            <div className='flex flex-col'>
              <h2 className='font-semibold text-gray-800'>{user.fullName}</h2>
              <p className='text-gray-500 text-sm'>@{user.username || user.fullName?.toLowerCase().replace(/\s+/g, '_')}</p>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            className='w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none min-h-[120px]'
            placeholder='What is happening? Share your thoughts...'
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
                    alt={`Preview ${i + 1}`}
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className='absolute top-2 right-2 bg-black/60 p-1 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition'
                  >
                    <X className='w-4 h-4 text-white' />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Bar */}
          <div className='flex items-center justify-between border-t border-gray-300 pt-3'>

            <label
              htmlFor='images'
              className='flex items-center gap-2 text-purple-600 cursor-pointer hover:text-purple-800 transition disabled:opacity-50'
            >
              <Image className='size-6' />
              <span className='text-sm'>Add images</span>
            </label>

            <input
              type='file'
              id='images'
              accept='image/*'
              hidden
              multiple
              onChange={handleImageUpload}
              disabled={loading}
            />

            <div className='flex items-center gap-3'>
              <span className='text-sm text-gray-500'>
                {content.length}/500
              </span>
              <button 
                disabled={loading || (!content.trim() && images.length === 0)}
                onClick={() => toast.promise(handleSubmit(), {
                  loading: 'Creating post...',
                  success: <p>Post created successfully!</p>,
                  error: <p>Failed to create post</p>
                })}
                className='bg-purple-500 text-white px-6 py-2 cursor-pointer rounded-full hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? 'Publishing...' : 'Publish Yelp'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default CreatePost