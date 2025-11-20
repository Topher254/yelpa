import React, { useEffect, useState, useRef } from 'react'
import { Image, SendHorizonal } from 'lucide-react';
import { messageService } from '../services/messageService';
import { userService } from '../services/userService';
import { useParams } from 'react-router';
import moment from 'moment';
import Loader from '../components/Loader';

const Chatbox = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { userId } = useParams();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const messagesData = await messageService.getMessages(userId);
      setMessages(messagesData);
      
      // Mark messages as seen
      if (currentUser) {
        await messageService.markAsSeen(userId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTargetUser = async () => {
    try {
      const userData = await userService.getUserProfile(userId);
      setTargetUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      // Fallback user data
      setTargetUser({
        _id: userId,
        full_name: 'User',
        username: 'user',
        profile_picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      });
    }
  };

  const sendMessage = async () => {
    if (!text.trim() && !image) return;
    if (!currentUser || !targetUser) return;

    try {
      const messageData = {
        from_user_id: currentUser._id,
        to_user_id: targetUser._id,
        text: text.trim(),
        message_type: image ? 'image' : 'text',
        media_url: image ? URL.createObjectURL(image) : ''
      };

      const response = await messageService.sendMessage(messageData);
      
      // Add the new message to the list
      setMessages(prev => [...prev, response.data]);
      setText('');
      setImage(null);
    } catch (error) {
      console.error('Error sending message:', error);
      // Create a temporary message for UI feedback
      const tempMessage = {
        _id: 'temp_' + Date.now(),
        from_user_id: currentUser,
        to_user_id: targetUser,
        text: text.trim(),
        message_type: 'text',
        createdAt: new Date(),
        isSending: true
      };
      setMessages(prev => [...prev, tempMessage]);
      setText('');
      setImage(null);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTargetUser();
      fetchMessages();
    }
  }, [userId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading && !targetUser) {
    return <Loader />;
  }

  if (!targetUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-screen bg-gray-50'>
      {/* Header */}
      <div className='flex items-center gap-3 bg-purple-50 p-4 shadow-sm'>
        <img src={targetUser.profile_picture} className='size-10 rounded-full shadow object-cover' alt={targetUser.full_name} />
        <div className='leading-tight'>
          <p className='font-semibold text-gray-800'>{targetUser.full_name}</p>
          <p className='text-sm text-gray-500'>@{targetUser.username}</p>
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-scroll px-4 py-2'>
        <div className='max-w-2xl mx-auto space-y-4'>
          {messages.length === 0 && !loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`flex flex-col ${
                  message.from_user_id._id === currentUser?._id ? 'items-end' : 'items-start'
                }`}
              >
                <div className={`
                  p-3 rounded-xl max-w-xs shadow 
                  ${message.from_user_id._id === currentUser?._id
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none'}
                  ${message.isSending ? 'opacity-70' : ''}
                `}>
                  {message.media_type === 'image' && message.media_url && (
                    <img
                      src={message.media_url}
                      className='w-40 h-auto rounded-md mb-2'
                      alt="Message attachment"
                    />
                  )}
                  <p className='text-sm'>{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.from_user_id._id === currentUser?._id ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {moment(message.createdAt).format('HH:mm')}
                    {message.isSending && ' • Sending...'}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Section */}
      <div className='p-4 border-t border-purple-200 bg-white'>
        <div className='flex items-center gap-3 max-w-2xl mx-auto'>
          <input
            type='text'
            className='flex-1 px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
            placeholder='Type a message...'
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            onChange={(e) => setText(e.target.value)}
            value={text}
            disabled={!currentUser}
          />

          <label htmlFor='image' className='cursor-pointer'>
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                className='h-10 w-10 object-cover rounded-full border'
                alt="Selected image"
              />
            ) : (
              <Image className='text-purple-600 w-6 h-6' />
            )}
            <input
              type='file'
              id='image'
              accept='image/*'
              hidden
              onChange={(e) => setImage(e.target.files[0])}
              disabled={!currentUser}
            />
          </label>
          <button 
            onClick={sendMessage} 
            disabled={!text.trim() && !image || !currentUser}
            className='bg-purple-500 text-white p-2 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <SendHorizonal size={18}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;