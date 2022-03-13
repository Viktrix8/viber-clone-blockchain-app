import { useState, useContext, useEffect } from 'react'
import CryptoJS from 'crypto-js'
import {
  AiOutlinePlus,
  AiOutlineSend,
  AiFillInfoCircle,
  AiOutlineUserAdd,
} from 'react-icons/ai'
import { MdOutlineGif } from 'react-icons/md'
import { BsEmojiSmile, BsCameraVideo } from 'react-icons/bs'
import { RiTimer2Line } from 'react-icons/ri'
import { BiPhoneCall } from 'react-icons/bi'
import { ViberContext } from '../context/ViberContext'
import Image from 'next/image'

const ChatView = () => {
  const {
    chatId,
    chatName,
    chatActivity,
    chatImage,
    state,
    gun,
    currentAccount,
    dispatch,
  } = useContext(ViberContext)
  const [messageText, setMessageText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (messageText.trim().length <= 0) return
    setMessageText('')

    const ref = gun.get(chatId)

    const message = {
      content: messageText,
      from: currentAccount,
      createdAt: new Date(Date.now()).toISOString(),
    }

    ref.set(message)

    dispatch({
      type: 'add',
      data: message,
    })

    const encrypted = CryptoJS.AES.encrypt(
      messageText,
      process.env.NEXT_PUBLIC_SECRET_ENCODING_MESSAGE
    ).toString()

    const response = await fetch('/api/db/updateLastMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: encrypted,
        id: chatId,
      }),
    })
  }

  return (
    <div className="chat-view flex flex-[3] flex-col overflow-scroll border-r border-gray-500 bg-primary">
      {chatName && chatActivity && chatImage && (
        <div className="sticky top-0 flex flex-[0.04] items-center border-b border-gray-500 bg-primary px-2 py-4">
          <div className="flex flex-1">
            <Image
              className="mr-6 rounded-full"
              src={chatImage}
              height="50"
              width="50"
              objectFit="cover"
            />
            <div className="ml-2">
              <p className="font-semibold">{chatName}</p>
              <p className="text-gray-400">Last seen at {chatActivity}</p>
            </div>
          </div>
          <div className="flex cursor-pointer items-stretch space-x-4 text-accent">
            <AiOutlineUserAdd size={23} />
            <BiPhoneCall size={23} />
            <BsCameraVideo size={23} />
            <AiFillInfoCircle size={23} />
          </div>
        </div>
      )}

      <div className="flex flex-[6] flex-col p-2">
        {state.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.from === currentAccount
                ? 'mb-1 ml-auto w-auto rounded-lg bg-[#324aa9] p-2 text-right'
                : 'mb-1 mr-auto w-auto rounded-lg bg-gray-600 p-2 text-left'
            }`}
          >
            <div className="flex flex-col">
              <p>{msg.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 flex flex-[0.2] items-center border-t border-gray-500 bg-primary px-4 py-3">
        <div className="flex cursor-pointer items-center space-x-2">
          <AiOutlinePlus size={25} color="lightgray" />
          <MdOutlineGif size={25} color="lightgray" />
          <BsEmojiSmile size={25} color="lightgray" />
          <RiTimer2Line size={25} color="lightgray" />
        </div>
        <form className="flex w-full" onSubmit={(e) => handleSubmit(e)}>
          <input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="ml-3 flex-1 bg-transparent outline-none placeholder:text-gray-500"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            disabled={!chatId}
            className={`${'flex items-center justify-center rounded-full bg-accent p-2'} ${
              !chatId && 'bg-gray-400'
            }`}
          >
            <AiOutlineSend size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatView
