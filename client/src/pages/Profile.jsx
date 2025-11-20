import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useUser } from '@clerk/clerk-react'
import UserProfileInfo from '../components/UserProfileInfo'
import ProfileModal from '../components/ProfileModal'
import PostCard from '../components/PostCard'
import Loader from '../components/Loader'
import { userService } from '../services/userService'
import { postService } from '../services/postService'

const Profile = () => {
  const { profileId } = useParams()
  const { user: clerkUser } = useUser()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEdit, setShowEdit] = useState(false)

  const fetchUserData = async () => {
    try {
      setLoading(true)
      
      // If viewing another user's profile
      if (profileId) {
        console.log('Fetching other user profile by ID:', profileId);
        const userData = await userService.getUserProfileById(profileId);
        setUser(userData);
        
        const userPosts = await postService.getUserPosts(profileId);
        setPosts(userPosts);
      } 
      // If viewing own profile
      else if (clerkUser) {
        console.log('Fetching own profile for Clerk user:', clerkUser.id);
        const userData = await userService.getUserProfile(clerkUser.id);
        setUser(userData);
        
        const userPosts = await postService.getUserPosts(userData._id);
        setPosts(userPosts);
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      // Fallback: Create a user object from Clerk data
      if (clerkUser && !profileId) {
        setUser({
          _id: 'temp_' + clerkUser.id,
          clerkUserId: clerkUser.id,
          full_name: clerkUser.fullName,
          username: clerkUser.username || clerkUser.fullName?.toLowerCase().replace(/\s+/g, '_'),
          email: clerkUser.primaryEmailAddress?.emailAddress,
          profile_picture: clerkUser.imageUrl,
          cover_photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop',
          bio: 'Welcome to my profile!',
          location: 'Unknown',
          followers: [],
          following: [],
          connections: [],
          is_verified: false,
          createdAt: new Date().toISOString()
        });
      }
      setPosts([]);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (clerkUser || profileId) {
      fetchUserData();
    }
  }, [clerkUser, profileId])

  const handleProfileUpdate = () => {
    fetchUserData();
    setShowEdit(false);
  }

  if (loading) {
    return <Loader />
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">User not found</h2>
          <p className="text-gray-600">The user you're looking for doesn't exist.</p>
          <button 
            onClick={fetchUserData}
            className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-4xl mx-auto p-4'>
        {/* Cover Photo */}
        <div className='relative h-64 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-lg'>
          {user.cover_photo && (
            <img
              src={user.cover_photo}
              alt='Cover'
              className='w-full h-full object-cover rounded-t-lg'
            />
          )}
        </div>

        {/* Profile Info */}
        <UserProfileInfo 
          user={user} 
          posts={posts} 
          profileId={profileId}
          setShowEdit={setShowEdit}
        />

        {/* Posts Section */}
        <div className='mt-8'>
          <h2 className='text-2xl font-bold text-purple-800 mb-6'>Posts</h2>
          <div className='space-y-6'>
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <div className='text-center py-8'>
                <p className='text-gray-500'>No posts yet.</p>
                {!profileId && (
                  <p className='text-purple-600 mt-2'>
                    Create your first post to share with the community!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <ProfileModal 
          setShowEdit={setShowEdit} 
          user={user}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  )
}

export default Profile