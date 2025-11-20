import React, { useState, useEffect } from 'react'
import { userService } from '../services/userService'
import { Search, Users } from 'lucide-react'
import UserCard from '../components/UserCard'
import Loader from '../components/Loader'

const Discover = ({ currentUser }) => {
  const [input, setInput] = useState('')
  const [users, setUsers] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [recentLoading, setRecentLoading] = useState(true)
  const [hasSearched, setHasSearched] = useState(false)

  // Fetch recently registered users on component mount
  const fetchRecentUsers = async () => {
    try {
      setRecentLoading(true)
      const recentUsersData = await userService.getRecentUsers()
      
      // Filter out current user from recent users
      const filteredUsers = recentUsersData.filter(user => 
        currentUser ? user._id !== currentUser._id : true
      )
      
      setRecentUsers(filteredUsers)
    } catch (error) {
      console.error('Error fetching recent users:', error)
      setRecentUsers([])
    } finally {
      setRecentLoading(false)
    }
  }

  useEffect(() => {
    fetchRecentUsers()
  }, [currentUser])

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && input.trim()) {
      try {
        setLoading(true)
        setHasSearched(true)
        const searchResults = await userService.searchUsers(input.trim())
        
        // Filter out current user from search results
        const filteredResults = searchResults.filter(user => 
          currentUser ? user._id !== currentUser._id : true
        )
        
        setUsers(filteredResults)
      } catch (error) {
        console.error('Error searching users:', error)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    if (!e.target.value.trim()) {
      setUsers([])
      setHasSearched(false)
    }
  }

  const clearSearch = () => {
    setInput('')
    setUsers([])
    setHasSearched(false)
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl w-full mx-auto p-6'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-purple-800'>Discover People</h1>
          <p className='text-purple-600'>Connect with amazing people. Save a life</p>
        </div>

        {/* Search Section */}
        <div className='mb-8 shadow-md rounded-2xl border border-slate-100 bg-white'>
          <div className='p-6'>
            <div className='relative'>
              <Search className='absolute cursor-pointer left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5'/>
              <input
                onChange={handleInputChange}
                value={input}
                onKeyUp={handleSearch}
                type='text'
                placeholder='Search people by name or username...'
                className='pl-10 pr-24 p-3 w-full border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-purple-500'
              />
              {hasSearched && (
                <button
                  onClick={clearSearch}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800 text-sm font-medium'
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className='flex flex-col items-center'>
          {loading ? (
            <Loader />
          ) : hasSearched ? (
            // Search Results
            <>
              <div className='w-full mb-6'>
                <h2 className='text-xl font-semibold text-gray-800'>
                  Search Results {users.length > 0 && `(${users.length})`}
                </h2>
              </div>
              
              {users.length === 0 ? (
                <div className="text-center py-12 w-full">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No users found</h3>
                  <p className="text-gray-500">
                    Try searching with different keywords.
                  </p>
                  <button
                    onClick={clearSearch}
                    className='mt-4 bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition'
                  >
                    View All Users
                  </button>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full'>
                  {users.map((user) => (
                    <UserCard key={user._id} user={user} currentUser={currentUser} />
                  ))}
                </div>
              )}
            </>
          ) : (
            // Recent Users Section (Default View)
            <>
              <div className='w-full mb-6'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-xl font-semibold text-gray-800 flex items-center gap-2'>
                    <Users className='w-5 h-5 text-purple-600' />
                    Recently Joined {recentUsers.length > 0 && `(${recentUsers.length})`}
                  </h2>
                  <p className='text-sm text-gray-500'>
                    New members you might want to connect with
                  </p>
                </div>
              </div>

              {recentLoading ? (
                <div className="w-full flex justify-center py-12">
                  <Loader />
                </div>
              ) : recentUsers.length === 0 ? (
                <div className="text-center py-12 w-full">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No users yet</h3>
                  <p className="text-gray-500">
                    Be the first to join and connect with others!
                  </p>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full'>
                  {recentUsers.map((user) => (
                    <UserCard key={user._id} user={user} currentUser={currentUser} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Discover