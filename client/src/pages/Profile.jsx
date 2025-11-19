import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { dummyPostsData, dummyUserData } from '../assets/assets';
import Loader from '../components/Loader';
import UserProfileInfo from '../components/UserProfileInfo';
import PostCard from '../components/PostCard';
import moment from 'moment';
import ProfileModal from '../components/ProfileModal';

const Profile = () => {
  const {profileId} = useParams();
  const [user,setUser]= useState(null);
  const [posts,setPosts] = useState([]);
  const [activeTab,setActiveTab]= useState('posts')
  const [showEdit,setShowEdit]= useState(false)

  // fetch userd sta
  const fetchUser=async()=>{
    setUser(dummyUserData);
    setPosts(dummyPostsData)
  }

useEffect(()=>{
  fetchUser();
},[])

  return user ? (
    <div className='relative h-full overflow-y-scroll bg-gray-50 p-5'>
    <div className='max-w-3xl mx-auto'>
    {/* profile card */}
    <div className='bg-white rounded-2xl shadow overflow-hidden'>
    {/* cover pic */}
    <div className='h-40 md:h-56 bg-purple-400'>
    {user.cover_photo && <img src={user.cover_photo} className='w-full h-full object-cover'/>
    
    
    }

    </div>
    {/* user ingo */}
    <UserProfileInfo user={user} posts={posts} profileId={profileId} setShowEdit={setShowEdit}/>

    </div>

    {/* tabs */}
    <div className='mt-6'>
    <div className='bg-white rounded-full shadow p-1 flex max-w-md mx-auto'>

{
  ['posts','media','likes'].map((tab)=>(
    <button
    onClick={()=>setActiveTab(tab)}
     key={tab} className={`flex-1 px-4 py-2 text-sm font-medium rounded-full transition-colors cursor-pointer
    ${activeTab===tab?"bg-purple-500 text-white":'text-gray-600 hover:text-gray-900'}`}>{tab.charAt(0).toLocaleUpperCase()+tab.slice(1)}</button>
  ))
}

    </div>

    {/* posts */}
    {
      activeTab==='posts'&&(
        <div className='mt-6 flex flex-col items-center gap-6'>
        {posts.map((post)=>(
          <PostCard key={post._id} post={post}/>
        ))}</div>
      )
    }
    {/* media */}
      {
  activeTab === 'media' && (
    <div className='mt-6 flex flex- items-center gap-6'>
      {
        posts
          .filter((post) => Array.isArray(post.image_urls) && post.image_urls.length > 0)
          .map((post) => (
            <div key={post._id} className='w-full shadow rounded-lg p-2 flex flex-col items-center gap-4'>
              {post.image_urls.map((image, index) => (
                <Link
                  to={image}
                  target='_blank'
                  key={index}
                  className='relative group'
                >
                  <img
                    src={image}
                    alt='Media'
                    className='w-64 aspect-video object-cover rounded-lg'
                  />
                  <p>posted {moment(post.createdAt).fromNow()}</p>
                </Link>
              ))}
            </div>
          ))
      }
    </div>
  )
}


    </div>

    </div>
    {/* edit prifle modal */}
{
  showEdit&&<ProfileModal setShowEdit={setShowEdit}/>
}

    </div>
  ):(
    <Loader/>
  )
}

export default Profile
