import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { messageService } from '../services/messageService'
import { useUser } from '@clerk/clerk-react'
import { MessageCircle, Eye, Users } from 'lucide-react'
import Loader from '../components/Loader'
import moment from 'moment'

const Messages = () => {
    const [conversations, setConversations] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const { user: clerkUser } = useUser()

    const fetchRecentConversations = async () => {
        try {
            setLoading(true)
            const recentConversations = await messageService.getRecentConversations()
            console.log('Fetched conversations:', recentConversations)
            setConversations(recentConversations)
        } catch (error) {
            console.error('Error fetching recent conversations:', error)
            
            // For development, create sample conversations
            const sampleConversations = [
                {
                    _id: 'user_1',
                    username: 'john_doe',
                    full_name: 'John Doe',
                    profile_picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                    lastMessage: {
                        text: 'Hey, how are you doing?',
                        createdAt: new Date(Date.now() - 3600000),
                        message_type: 'text'
                    },
                    unreadCount: 1
                },
                {
                    _id: 'user_2',
                    username: 'jane_smith',
                    full_name: 'Jane Smith',
                    profile_picture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
                    lastMessage: {
                        text: 'Thanks for your help!',
                        createdAt: new Date(Date.now() - 7200000),
                        message_type: 'text'
                    },
                    unreadCount: 0
                }
            ]
            setConversations(sampleConversations)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (clerkUser) {
            fetchRecentConversations()
        }
    }, [clerkUser])

    if (loading) {
        return <Loader />
    }

    return (
        <div className='min-h-screen relative bg-purple-50'>
            <div className='max-w-6xl mx-auto p-6'>
                {/* title */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-purple-800'>Yelps</h1>
                    <p className='text-purple-600'>Your recent conversations</p>
                </div>

                {/* conversations */}
                <div className='flex flex-col gap-3'>
                    {conversations.length === 0 ? (
                        <div className='text-center py-12 bg-white rounded-lg shadow-sm'>
                            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No conversations yet</h3>
                            <p className="text-gray-500 mb-4">
                                Start a conversation by messaging someone from the Discover page!
                            </p>
                            <button
                                onClick={() => navigate('/discover')}
                                className='bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600 transition'
                            >
                                Discover People
                            </button>
                        </div>
                    ) : (
                        conversations.map((conversation) => (
                            <div 
                                key={conversation._id} 
                                className='max-w-xl flex justify-between items-center gap-5 p-5 bg-white shadow rounded-md hover:shadow-md transition-shadow cursor-pointer'
                                onClick={() => navigate(`/messages/${conversation._id}`)}
                            >
                                <div className='flex items-center gap-4 flex-1'>
                                    <img 
                                        src={conversation.profile_picture} 
                                        className='rounded-full size-12 object-cover border-2 border-purple-200' 
                                        alt={conversation.full_name}
                                    />
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center justify-between'>
                                            <p className='font-medium text-purple-700 truncate'>{conversation.full_name}</p>
                                            {conversation.lastMessage && (
                                                <p className='text-xs text-gray-500 whitespace-nowrap ml-2'>
                                                    {moment(conversation.lastMessage.createdAt).fromNow()}
                                                </p>
                                            )}
                                        </div>
                                        <p className='text-purple-500 text-sm truncate'>@{conversation.username}</p>
                                        {conversation.lastMessage && (
                                            <p className='text-sm text-gray-600 truncate mt-1'>
                                                {conversation.lastMessage.text || 
                                                 (conversation.lastMessage.media_type === 'image' ? '📷 Image' : 
                                                  conversation.lastMessage.media_type === 'video' ? '🎥 Video' : 'Media')}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className='flex items-center gap-2'>
                                    {conversation.unreadCount > 0 && (
                                        <span className='bg-purple-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full'>
                                            {conversation.unreadCount}
                                        </span>
                                    )}
                                    <div className='flex gap-2'>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/messages/${conversation._id}`);
                                            }}
                                            className='size-10 flex items-center justify-center text-sm gap-1 rounded bg-purple-100 hover:bg-purple-200 active:scale-95 transition cursor-pointer'
                                            title="Open conversation"
                                        >
                                            <MessageCircle className='w-4 h-4 text-purple-600'/>
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/profile/${conversation._id}`);
                                            }}
                                            className='size-10 flex items-center justify-center text-sm rounded bg-purple-100 hover:bg-purple-200 active:scale-95 transition cursor-pointer'
                                            title="View profile"
                                        >
                                            <Eye className='w-4 h-4 text-purple-600'/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Help text */}
                {conversations.length > 0 && (
                    <div className='mt-8 text-center'>
                        <p className='text-gray-500 text-sm'>
                            Click on any conversation to continue chatting
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Messages