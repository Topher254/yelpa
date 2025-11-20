import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react'
import React, { useState } from 'react'
import moment from 'moment'
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router';
import { postService } from '../services/postService';
import toast from 'react-hot-toast';

const PostCard = ({ post }) => {
    const [likes, setLikes] = useState(post.likes || []);
    const [isLiked, setIsLiked] = useState(false);
    const { user } = useUser();
    const navigate = useNavigate()

    // Check if current user liked the post
    React.useEffect(() => {
        if (user && post.likes) {
            setIsLiked(post.likes.includes(user.id));
        }
    }, [user, post.likes]);

    const handleLike = async () => {
        try {
            const response = await postService.likePost(post._id);
            setLikes(response.likesCount);
            setIsLiked(!isLiked);
        } catch (error) {
            toast.error('Failed to like post');
            console.error('Like error:', error);
        }
    }

    return (
        <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
            {/* userinfo */}
            <div onClick={() => navigate(`/profile/${post.user._id}`)} className='inline-flex items-center gap-3 cursor-pointer'>
                <img src={post.user.profile_picture} alt='profile' className='w-10 h-10 rounded-full shadow' />
                <div className='flex flex-col justify-start'>
                    <div className='flex gap-2 items-center'>
                        <span className='font-medium'>{post.user.full_name}</span>
                        {post.user.is_verified && <BadgeCheck className='w-4 h-4 text-purple-500' />}
                    </div>
                    <div className='text-gray-500 text-sm'>
                        @{post.user.username} • {moment(post.createdAt).fromNow()}
                    </div>
                </div>
            </div>

            {/* content */}
            {post.content && (
                <div className='text-gray-800 text-sm whitespace-pre-line'>
                    {post.content}
                </div>
            )}
            
            {/* images */}
            {post.image_urls && post.image_urls.length > 0 && (
                <div className='grid grid-cols-2 gap-2'>
                    {post.image_urls.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            className={`w-full h-48 object-cover rounded-lg ${post.image_urls.length === 1 && 'col-span-2 h-auto'}`}
                            alt='post image'
                        />
                    ))}
                </div>
            )}

            {/* likes and interactions */}
            <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
                <div className='flex items-center gap-1'>
                    <Heart
                        className={`w-4 h-4 cursor-pointer ${isLiked ? 'text-red-500 fill-red-500' : ''}`}
                        onClick={handleLike}
                    />
                    <span>{likes.length}</span>
                </div>
                <div className='flex items-center gap-1'>
                    <MessageCircle className='w-4 h-4 cursor-pointer' />
                    <span>0</span> {/* Comments not implemented yet */}
                </div>
                <div className='flex items-center gap-1'>
                    <Share2 className='w-4 h-4 cursor-pointer' />
                    <span>0</span> {/* Shares not implemented yet */}
                </div>
            </div>
        </div>
    )
}

export default PostCard