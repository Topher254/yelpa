import React, { useEffect, useState } from 'react'
import { Link } from 'react-router';
import moment from 'moment';
import { messageService } from '../services/messageService';
import Loader from './Loader';

const RecentMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRecentMessages = async () => {
        try {
            setLoading(true);
            const conversations = await messageService.getRecentConversations();
            setMessages(conversations);
        } catch (error) {
            console.error('Error fetching recent messages:', error);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRecentMessages();
    }, [])

    if (loading) {
        return (
            <div className='bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800'>
                <Loader height="50px" />
            </div>
        );
    }

    return (
        <div className='bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800'>
            <h3 className='font-semibold text-slate-800 mb-4'>
                Recent Yelps
            </h3>
            <div className='flex flex-col max-h-56 overflow-y-scroll no-scrollbar'>
                {messages.length === 0 ? (
                    <p className='text-gray-500 text-center py-4'>No recent messages</p>
                ) : (
                    messages.map((conversation) => (
                        <Link 
                            to={`/messages/${conversation._id}`} 
                            key={conversation._id} 
                            className='flex items-start gap-2 py-2 hover:bg-slate-100 rounded px-2'
                        >
                            <img 
                                src={conversation.profile_picture} 
                                className='w-8 h-8 rounded-full' 
                                alt={conversation.full_name}
                            />
                            <div className='w-full'>
                                <div className='flex justify-between'>
                                    <p className='font-medium'>{conversation.full_name}</p>
                                    <p className='text-slate-400 text-xs'>
                                        {moment(conversation.lastMessage?.createdAt).fromNow()}
                                    </p>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <p className='text-gray-500 truncate max-w-[120px]'>
                                        {conversation.lastMessage?.text || 'Media'}
                                    </p>
                                    {conversation.unreadCount > 0 && (
                                        <span className='bg-purple-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full'>
                                            {conversation.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}

export default RecentMessages