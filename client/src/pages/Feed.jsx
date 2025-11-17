import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../assets/assets';
import Loader from '../components/Loader';
import StoriesBar from '../components/StoriesBar';

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchFeeds = async () => {
    setFeeds(dummyPostsData);
    setLoading(false)
  };


  useEffect(() => {
    fetchFeeds()
  }, [])


  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 flex items-start justify-center xl:gap-8 '>
      {/* stories */}
      <div>
        <StoriesBar/>
        <div className='p-4 space-y-6'>list o fposts</div>
        <div>

        </div>
      </div>
      {/* right sidebar */}
      <div>
<div>
  <h1>Sponsored</h1>
</div>
<h1>recent messaged</h1>
      </div>
    </div>
  ) :
    <Loader />
}

export default Feed
