import React, { useState, useEffect } from 'react'
import { MapPin, MessageCircle, Plus, UserPlus, UserCheck } from 'lucide-react'
import { connectionService } from '../services/connectionService'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

const UserCard = ({ user, currentUser }) => {
    const [isFollowing, setIsFollowing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    // Check if current user is already following this user
    useEffect(() => {
        if (currentUser && user) {
            const following = currentUser.following?.includes(user._id) || false;
            setIsFollowing(following);
        }
    }, [currentUser, user]);

    const handleFollow = async () => {
        if (isLoading || !currentUser) return;
        
        try {
            setIsLoading(true)
            const result = await connectionService.sendConnectionRequest(user._id)
            
            if (result.success) {
                setIsFollowing(true)
                // Update local state
                if (currentUser.following) {
                    currentUser.following.push(user._id);
                }
                toast.success(`You are now following ${user.full_name}`)
            }
        } catch (error) {
            console.error('Error following user:', error)
            toast.error('Failed to follow user')
        } finally {
            setIsLoading(false)
        }
    }

    const handleUnfollow = async () => {
        if (isLoading || !currentUser) return;
        
        try {
            setIsLoading(true)
            const result = await connectionService.removeConnection(user._id)
            
            if (result.success) {
                setIsFollowing(false)
                // Update local state
                if (currentUser.following) {
                    currentUser.following = currentUser.following.filter(id => id !== user._id);
                }
                toast.success(`You unfollowed ${user.full_name}`)
            }
        } catch (error) {
            console.error('Error unfollowing user:', error)
            toast.error('Failed to unfollow user')
        } finally {
            setIsLoading(false)
        }
    }

    const handleMessage = () => {
        if (currentUser) {
            navigate(`/messages/${user._id}`)
        } else {
            toast.error('Please log in to send messages')
        }
    }

    const handleViewProfile = () => {
        navigate(`/profile/${user._id}`)
    }

    if (!user) return null

    return (
        <div className='p-4 pt-6 flex flex-col justify-between w-full shadow border border-purple-200 rounded-md bg-white hover:shadow-lg transition-shadow'>
            <div className='text-center cursor-pointer' onClick={handleViewProfile}>
                <img 
                    src={user.profile_picture} 
                    alt={user.full_name} 
                    className='rounded-full w-16 h-16 shadow mx-auto object-cover'
                />
                <p className='mt-4 font-semibold text-gray-800'>{user.full_name}</p>
                {user.username && (
                    <p className='text-gray-500 font-light text-sm'>@{user.username}</p>
                )}
                {user.bio && (
                    <p className='text-gray-500 font-light text-sm mt-2 line-clamp-2'>{user.bio}</p>
                )}
            </div>
            <div className='flex items-center justify-center gap-4 mt-4 text-xs text-gray-600'>
                {user.location && (
                    <div className='flex items-center gap-1'>
                        <MapPin className='w-3 h-3'/>
                        {user.location}
                    </div>
                )}
                <div className='flex items-center gap-1'>
                    <span>{user.followers?.length || 0} Followers</span>
                </div>
            </div>
            
            {/* Action Buttons */}
            <div className='flex mt-4 gap-2'>
                {/* Follow/Unfollow Button */}
                <button
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                    disabled={isLoading || !currentUser}
                    className={`w-full py-2 rounded-md flex justify-center items-center gap-2 active:scale-95 text-white cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed ${
                        isFollowing 
                            ? 'bg-gray-500 hover:bg-gray-600' 
                            : 'bg-purple-500 hover:bg-purple-600'
                    }`}
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : isFollowing ? (
                        <>
                            <UserCheck className='w-4 h-4'/>
                            Following
                        </>
                    ) : (
                        <>
                            <UserPlus className='w-4 h-4'/>
                            Follow
                        </>
                    )}
                </button>

                {/* Message Button */}
                <button 
                    onClick={handleMessage}
                    disabled={!currentUser}
                    className='flex items-center justify-center w-16 border rounded-md border-purple-200 hover:bg-purple-50 transition disabled:opacity-50'
                    title="Send message"
                >
                    <MessageCircle className='w-5 h-5 text-purple-600'/>
                </button>

                {/* View Profile Button */}
                <button 
                    onClick={handleViewProfile}
                    className='flex items-center justify-center w-16 border rounded-md border-purple-200 hover:bg-purple-50 transition disabled:opacity-50'
                    title="View profile"
                >
                    <Plus className='w-5 h-5 text-purple-600'/>
                </button>
            </div>
        </div>
    )
}

export default UserCard