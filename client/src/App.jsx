import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import Chatbox from './pages/Chatbox'
import Connection from './pages/Connection'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import { useUser, useClerk } from '@clerk/clerk-react'
import Layout from './pages/Layout'
import { Toaster } from 'react-hot-toast'
import Emergency from './pages/Emergency'
import { authService } from './services/authService'

const App = () => {
  const { user, isLoaded } = useUser();
  const { session } = useClerk();
  const [currentUser, setCurrentUser] = useState(null);

  // Sync user with backend when they log in
  useEffect(() => {
    const syncUser = async () => {
      if (user && session) {
        try {
          console.log('Syncing user with backend:', user.id);
          
          const userData = {
            clerkUserId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            full_name: user.fullName,
            username: user.username || user.fullName?.toLowerCase().replace(/\s+/g, '_'),
            profile_picture: user.imageUrl,
          };

          const syncedUser = await authService.syncUser(userData);
          setCurrentUser(syncedUser);
          console.log('User synced successfully:', syncedUser);
          
          // Store user ID in localStorage for persistence
          localStorage.setItem('currentUserId', syncedUser._id);
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      }
    };

    if (isLoaded && user) {
      syncUser();
    }
  }, [user, isLoaded, session]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={!user ? <Login /> : <Layout currentUser={currentUser} />}>
          <Route index element={<Feed currentUser={currentUser} />} />
          <Route path='/messages' element={<Messages currentUser={currentUser} />} />
          <Route path='/messages/:userId' element={<Chatbox currentUser={currentUser} />} />
          <Route path='/connections' element={<Connection currentUser={currentUser} />} />
          <Route path='/discover' element={<Discover currentUser={currentUser} />} />
          <Route path='/profile' element={<Profile currentUser={currentUser} />} />
          <Route path='/messages' element={<Messages currentUser={currentUser} />} />
          <Route path='/emergency' element={<Emergency currentUser={currentUser} />} />
          <Route path='/profile/:profileId' element={<Profile currentUser={currentUser} />} />
          <Route path='/create-post' element={<CreatePost currentUser={currentUser} />} />
        </Route>
      </Routes>
    </>
  )
}

export default App