import { useRouter } from 'next/router'
import CryptoJS from 'crypto-js'
import Image from 'next/image'

const Chat = ({ chat, redirect, account }) => {
  const router = useRouter()
  let encrypted

  if (chat.lastMessage) {
    encrypted = CryptoJS.AES.decrypt(
      chat.lastMessage,
      process.env.NEXT_PUBLIC_SECRET_ENCODING_MESSAGE
    ).toString(CryptoJS.enc.Utf8)
  }

  return (
    <div
      className="mb-2 flex max-h-24 overflow-hidden rounded-full bg-secondary p-3"
      onClick={() => router.replace(redirect)}
    >
      <div className="flex flex-1 items-center">
        <Image
          src={
            chat.partipicants[0].walletAddress === account.toLowerCase()
              ? chat.partipicants[1].profileImage
              : chat.partipicants[0].profileImage
          }
          height={45}
          width={45}
          className="mr-2 max-h-[45px] max-w-[45px] rounded-full object-cover"
        />
        <div className="ml-2 flex flex-col">
          <p className="font-bold">{chat.name}</p>
          <p className="text-slate-500">
            {encrypted?.length > 10
              ? `${encrypted?.slice(0, 10)}...`
              : encrypted}
          </p>
        </div>
      </div>

      <p className="text-gray-500">
        {new Date(
          chat.partipicants[0].walletAddress === account
            ? chat.partipicants[1].lastActive
            : chat.partipicants[0].lastActive
        ).toLocaleTimeString()}
      </p>
    </div>
  )
}

export default Chat
