import { useState, useEffect } from 'react'
import { useContext } from 'react'
import { AiFillCaretDown, AiOutlineSearch } from 'react-icons/ai'
import { IoMdCreate } from 'react-icons/io'
import Image from 'next/image'

import Chat from './Chat'
import { ViberContext } from '../context/ViberContext'
import { client } from '../lib/sanity'

const LeftSidebar = () => {
  const { currentAccount, connectWallet, currentUser, getUserInfo } =
    useContext(ViberContext)
  const [textUser, setTextUser] = useState('')

  const createConversation = async () => {
    const response = await client.getDocument(textUser.toLowerCase())
    if (!response || response.walletAddress.toLowerCase() == currentAccount)
      return

    const conversationDoc = {
      _id: `${new Date(Date.now()).getMilliseconds()}-${currentAccount}`,
      _type: 'conversations',
      name: 'Unnamed Conversation',
      partipicants: [
        {
          _type: 'users',
          _ref: currentAccount.toLowerCase(),
          _key: `${new Date(Date.now())}-${currentAccount.toLowerCase()}`,
        },
        {
          _type: 'users',
          _ref: textUser.toLowerCase(),
          _key: `${new Date(Date.now())}-${textUser.toLowerCase()}`,
        },
      ],
    }

    await client.createIfNotExists(conversationDoc)
  }

  return (
    <div className="flex-1 flex-row overflow-scroll border-r border-gray-500 bg-primary p-2">
      <div className="sticky top-0 flex items-center bg-primary p-2">
        <div className="mr-2 flex cursor-pointer items-center space-x-1 rounded-full bg-secondary p-1">
          {currentUser ? (
            <>
              <Image
                src={currentUser.profileImage}
                height={30}
                width={30}
                className="rounded-full"
              />
              {currentUser.walletAddress.slice(0, 4)}...
              <AiFillCaretDown color="gray" size={12} />
            </>
          ) : (
            <button className="p-2" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>

        {currentAccount && (
          <>
            <div className="flex flex-1 items-center overflow-hidden rounded-full bg-secondary p-2 hover:border hover:border-gray-600 hover:bg-primary">
              <AiOutlineSearch color="lightgray" size={20} />
              {/* <input
                placeholder="Search..."
                className="ml-2 h-full w-full outline-none"
                style={{ background: 'transparent' }}
              /> */}
              <input
                value={textUser}
                onChange={(e) => setTextUser(e.target.value)}
                placeholder="Search users..."
                className="ml-2 h-full w-full bg-transparent outline-none"
              />
            </div>

            <div
              className="ml-4 flex h-full w-auto cursor-pointer items-center justify-center rounded-full bg-secondary p-2 text-accent"
              onClick={createConversation}
            >
              <IoMdCreate size={20} />
            </div>
          </>
        )}
      </div>

      <div className="mt-4">
        {currentUser?.conversations?.map((c, index) => (
          <Chat
            account={currentAccount}
            redirect={`?name=${c.name}&id=${c._id}&lastActive=${new Date(
              c.partipicants[0].walletAddress === currentAccount
                ? c.partipicants[1].lastActive
                : c.partipicants[0].lastActive
            ).toLocaleTimeString()}&image=${
              c.partipicants[0].walletAddress === currentAccount.toLowerCase()
                ? c.partipicants[1].profileImage
                : c.partipicants[0].profileImage
            }`}
            chat={c}
            key={index}
          />
        ))}
      </div>
    </div>
  )
}

export default LeftSidebar
