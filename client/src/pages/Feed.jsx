import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import Loader from '../components/Loader';
import StoriesBar from '../components/StoriesBar';
import PostCard from '../components/PostCard';
import RecentMessages from '../components/RecentMessages';
import { postService } from '../services/postService';

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeeds = async () => {
    try {
      setLoading(true);
      const response = await postService.getPosts();
      setFeeds(response.posts || response);
    } catch (error) {
      console.error('Error fetching feeds:', error);
      // Fallback to empty array if API fails
      setFeeds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 flex items-start justify-center xl:gap-8 '>
      {/* stories */}
      <div>
        <StoriesBar />
        <div className='p-4 space-y-6'>
          {/* postcard */}
          {feeds.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
          {feeds.length === 0 && (
            <div className='text-center text-gray-500 py-8'>
              No posts yet. Be the first to create a post!
            </div>
          )}
        </div>
        <div>

        </div>
      </div>
      {/* right sidebar */}
      <div className='max-xl:hidden sticky top-0'>
        <div className='max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow'>
          <h3 className='text-slate-800 font-semibold'>Sponsored Listener</h3>
          <img src={assets.sponsored_img} className='w-75 h-50 rounded-md' />
          <p className='text-slate-600'>Qualified Listeners</p>
          <p className='text-slate-400'>Be a listener with an easy to use platform. Listen to a life and earn</p>
        </div>
        <div>
          <RecentMessages />
        </div>
      </div>
    </div>
  ) :
    <Loader />
}

export default Feed