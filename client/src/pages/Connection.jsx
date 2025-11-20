import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { connectionService } from '../services/connectionService'
import { useUser } from '@clerk/clerk-react'
import { MessageCircle, UserCheck, UserPlus, UserRoundPen, Users } from 'lucide-react'
import Loader from '../components/Loader'

const Connection = () => {
  const [currentTab, setCurrentTab] = useState('Followers')
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [connections, setConnections] = useState([])
  const [pendingConnections, setPendingConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user: clerkUser } = useUser()

  const dataArray = [
    { label: 'Followers', value: followers, icon: Users },
    { label: 'Following', value: following, icon: UserCheck },
    { label: 'Pending', value: pendingConnections, icon: UserRoundPen },
    { label: 'Connections', value: connections, icon: UserPlus }
  ]

  const fetchConnectionData = async () => {
    try {
      setLoading(true)
      if (clerkUser?.id) {
        const [followersData, followingData, connectionsData] = await Promise.all([
          connectionService.getFollowers(clerkUser.id),
          connectionService.getFollowing(clerkUser.id),
          connectionService.getConnections(clerkUser.id)
        ])
        
        setFollowers(followersData)
        setFollowing(followingData)
        setConnections(connectionsData)
        // Note: Pending connections would need a separate endpoint
        setPendingConnections([])
      }
    } catch (error) {
      console.error('Error fetching connection data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async (userId) => {
    try {
      await connectionService.sendConnectionRequest(userId)
      fetchConnectionData() // Refresh data
    } catch (error) {
      console.error('Error following user:', error)
    }
  }

  const handleUnfollow = async (userId) => {
    try {
      await connectionService.removeConnection(userId)
      fetchConnectionData() // Refresh data
    } catch (error) {
      console.error('Error unfollowing user:', error)
    }
  }

  useEffect(() => {
    if (clerkUser) {
      fetchConnectionData()
    }
  }, [clerkUser])

  if (loading) {
    return <Loader />
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-purple-800'>Connections</h1>
          <p className='text-purple-600'>Connect to anyone and discover new helpers.</p>
        </div>
        {/* counts */}
        <div className='mb-8 grid grid-cols-2 md:grid-cols-4 gap-4'>
          {dataArray.map((item, index) => (
            <div key={index} className='flex flex-col w-full items-center justify-center gap-1 border h-20 border-purple-200 bg-white shadow rounded-md p-4'>
              <b className='text-2xl text-purple-600'>{item.value.length}</b>
              <p className='text-slate-600 text-sm'>{item.label}</p>
            </div>
          ))}
        </div>
        {/* tabs */}
        <div className='inline-flex items-center border border-purple-200 rounded-md p-1 bg-white shadow-sm'>
          {dataArray.map((tab, index) => (
            <button 
              onClick={() => setCurrentTab(tab.label)} 
              key={index} 
              className={`flex cursor-pointer items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                currentTab === tab.label 
                  ? 'bg-purple-500 text-white font-medium' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              <tab.icon className='w-4 h-4' />
              <span className='ml-1'>{tab.label}</span>
              {tab.value.length > 0 && (
                <span className='ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full'>
                  {tab.value.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* connections */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
          {dataArray.find((item) => item.label === currentTab).value.map((user) => (
            <div key={user._id} className='w-full flex flex-col p-6 bg-white shadow rounded-md'>
              
              <div className='flex items-center gap-4 mb-4'>
                <img src={user.profile_picture} className='rounded-full w-16 h-16 shadow-md object-cover' alt={user.full_name}/>
                <div className='flex-1'>
                  <p className='font-semibold text-slate-700'>{user.full_name}</p>
                  <p className='text-slate-500 text-sm'>@{user.username}</p>
                  {user.bio && (
                    <p className='text-slate-600 text-sm mt-1 line-clamp-2'>{user.bio}</p>
                  )}
                </div>
              </div>

              <div className='flex gap-2 mt-auto'>
                <button 
                  onClick={() => navigate(`/profile/${user._id}`)} 
                  className='flex-1 p-2 text-sm rounded bg-purple-500 text-white hover:bg-purple-600 transition cursor-pointer'
                >
                  View Profile
                </button>

                {/* Conditional buttons based on current tab */}
                {currentTab === 'Following' && (
                  <button 
                    onClick={() => handleUnfollow(user._id)}
                    className='flex-1 p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black transition cursor-pointer'
                  >
                    Unfollow
                  </button>
                )}
                {currentTab === 'Pending' && (
                  <button className='flex-1 p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black transition cursor-pointer'>
                    Accept
                  </button>
                )}
                {currentTab === 'Connections' && (
                  <button 
                    onClick={() => navigate(`/messages/${user._id}`)} 
                    className='flex-1 p-2 flex justify-center items-center gap-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black transition cursor-pointer'
                  >
                    <MessageCircle className='w-4 h-4' />
                    Message
                  </button>
                )}
                {currentTab === 'Followers' && !following.find(f => f._id === user._id) && (
                  <button 
                    onClick={() => handleFollow(user._id)}
                    className='flex-1 p-2 text-sm rounded bg-purple-500 text-white hover:bg-purple-600 transition cursor-pointer'
                  >
                    Follow Back
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {dataArray.find((item) => item.label === currentTab).value.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {currentTab === 'Followers' && <Users className="w-16 h-16 mx-auto" />}
              {currentTab === 'Following' && <UserCheck className="w-16 h-16 mx-auto" />}
              {currentTab === 'Pending' && <UserRoundPen className="w-16 h-16 mx-auto" />}
              {currentTab === 'Connections' && <UserPlus className="w-16 h-16 mx-auto" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No {currentTab.toLowerCase()} yet
            </h3>
            <p className="text-gray-500">
              {currentTab === 'Followers' && "When people follow you, they'll appear here."}
              {currentTab === 'Following' && "People you follow will appear here."}
              {currentTab === 'Pending' && "Pending connection requests will appear here."}
              {currentTab === 'Connections' && "Your connections will appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Connection