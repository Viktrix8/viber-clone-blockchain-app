import type { NextPage } from 'next'

import LeftSidebar from '../components/LeftSidebar'
import ChatView from '../components/ChatView'
import RightSidebar from '../components/RightSidebar'

const Home: NextPage = () => {
  return (
    <div className="flex h-screen w-screen">
      <LeftSidebar />
      <ChatView />
      <RightSidebar />
    </div>
  )
}

export default Home
