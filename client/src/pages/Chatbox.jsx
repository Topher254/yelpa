import React, { useEffect, useState, useRef } from 'react'
import { dummyMessagesData, dummyUserData } from '../assets/assets'
import { Image, SendHorizonal } from 'lucide-react';

const Chatbox = () => {
  const messages = dummyMessagesData;
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(dummyUserData);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {}

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return user && (
    <div className='flex flex-col h-screen bg-gray-50'>

      {/* Header */}
      <div className='flex items-center gap-3 bg-purple-50 p-4 shadow-sm'>
        <img src={user.profile_picture} className='size-10 rounded-full shadow' />
        <div className='leading-tight'>
          <p className='font-semibold text-gray-800'>{user.full_name}</p>
          <p className='text-sm text-gray-500'>@{user.username}</p>
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-scroll px-4 py-2'>
        <div className='max-w-2xl mx-auto space-y-4'>

          {[...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((message, index) => (
            <div
              key={index}
              className={`flex flex-col ${message.to_user_id !== user.id ? 'items-start' : 'items-end'}`}
            >
              <div className={`
                p-3 rounded-xl max-w-xs shadow 
                ${message.to_user_id !== user.id
                  ? 'bg-white text-gray-800 rounded-bl-none'
                  : 'bg-purple-600 text-white rounded-br-none'}
              `}>
                {message.media_type === 'image' && (
                  <img
                    src={message.media_url}
                    className='w-40 h-auto rounded-md mb-2'
                  />
                )}
                <p className='text-sm'>{message.text}</p>
              </div>
            </div>
          ))}

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
          />

          <label htmlFor='image' className='cursor-pointer'>
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                className='h-10 w-10 object-cover rounded-full border'
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
            />
          </label>
          <button onClick={sendMessage} className='bg-purple-500 text-white p-2 rounded-full cursor-pointer'>
            <SendHorizonal className='' size={18}/>
          </button>

        </div>
      </div>

    </div>
  );
};

export default Chatbox;
