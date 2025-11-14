import React from 'react'
import { Route, Routes } from 'react-router'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import Chatbox from './pages/Chatbox'
import Connection from './pages/Connection'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import {useUser} from '@clerk/clerk-react'
import Layout from './pages/Layout'

const App = () => {
  const {user}=useUser();

  return (
    <>
      <Routes>
        <Route path='/' element={!user ?<Login />:<Layout/>}>
          <Route index element={<Feed />} />
          <Route path='/messages' element={<Messages />} />
          <Route path='/messages/:userId' element={<Chatbox />} />
          <Route path='/connections' element={<Connection />} />
          <Route path='/dicover' element={<Discover />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/messages' element={<Messages />} />
          <Route path='/profile/:profileId' element={<Profile />} />
          <Route path='/create-post' element={<CreatePost />} />



        </Route>
      </Routes>
    </>
  )
}

export default App
