import { useContext, useState } from 'react'
import Image from 'next/image'

import { ViberContext } from '../context/ViberContext'
import { client } from '../lib/sanity'

const RightSidebar = () => {
  const { chatImage, chatName, chatActivity, chatId, setChatName } =
    useContext(ViberContext)
  const [conversationNameText, setConversationNameText] = useState('')

  const changeConversationName = async () => {
    if (conversationNameText.trim().length <= 0) return
    setConversationNameText('')
    await client.patch(chatId).set({ name: conversationNameText }).commit()
    setChatName(conversationNameText)
  }

  return (
    <div className="flex-[1] bg-primary">
      <div className="flex h-1/2 flex-col items-center justify-center">
        {chatImage && chatName && (
          <>
            <Image
              className="h-42 rounded-full"
              src={chatImage}
              height={300}
              width={300}
              objectFit="cover"
            />
            <p className="mt-2 text-lg font-bold">{chatName}</p>
            <p className="text-gray-400">{chatActivity}</p>
            <div className="flex flex-col justify-center space-y-2">
              <input
                placeholder="An Awesome Conversation..."
                className="w-full border border-gray-400 bg-transparent p-2 outline-none"
                value={conversationNameText}
                onChange={(e) => setConversationNameText(e.target.value)}
              />
              <button
                className="rounded-lg bg-secondary p-2 font-bold"
                onClick={changeConversationName}
              >
                Change Conversation Name
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default RightSidebar
