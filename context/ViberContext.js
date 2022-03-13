import { useEffect, useState, createContext, useReducer } from 'react'
import { useRouter } from 'next/router'
import Gun from 'gun'

const gun = Gun('viber-clone-gunjs-node.herokuapp.com/gun')

import { client } from '../lib/sanity'

let metamask

if (typeof window !== 'undefined') {
  metamask = window.ethereum
}

export const ViberContext = createContext()

const initialState = []

const reducer = (state, action) => {
  if (action.type === 'clear') {
    return initialState
  }

  switch (action.type) {
    case 'add':
      return [...state, action.data]
  }
}

export const ViberProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [currentUser, setCurrentUser] = useState('')
  const [chatId, setChatId] = useState()
  const [chatName, setChatName] = useState('')
  const [chatActivity, setChatActivity] = useState()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [chatImage, setChatImage] = useState('')
  const [appStatus, setAppStatus] = useState('loading')
  const [time, setTime] = useState(Date.now())

  const router = useRouter()

  const checkIfWalletIsConnected = async () => {
    if (!metamask) return setAppStatus('noMetamask')
    try {
      const accountsArray = await metamask.request({
        method: 'eth_accounts',
      })

      if (accountsArray.length) {
        setCurrentAccount(accountsArray[0])
        await createUser(accountsArray[0])
        setAppStatus('connected')
      } else {
        setAppStatus('notConnected')
      }
    } catch (err) {
      console.error(err)
      setAppStatus('error')
    }
  }

  const connectWallet = async () => {
    if (!metamask) return setAppStatus('noMetamask')
    try {
      const accountsArray = await metamask.request({
        method: 'eth_requestAccounts',
      })

      if (accountsArray.length) {
        setCurrentAccount(accountsArray[0])
        await createUser(accountsArray[0])
        setAppStatus('connected')
      } else {
        setAppStatus('notConnected')
      }
    } catch (err) {
      console.error(err)
      setAppStatus('error')
    }
  }

  const getUserInfo = async (currentAccount) => {
    const response = await fetch('/api/db/getUserInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress: currentAccount,
      }),
    })
    const data = await response.json()
    setCurrentUser(data.data)
  }

  const createUser = async (wallet) => {
    try {
      const file = await fetch('/profilePlaceholder.png')
        .then(function (res) {
          return res.arrayBuffer()
        })
        .then(function (buf) {
          return new File([buf], 'placeholder', { type: 'image/png' })
        })

      const imageAsset = await client.assets.upload('image', file)

      await fetch('/api/db/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: wallet,
          asset: imageAsset._id,
        }),
      })
    } catch (err) {
      console.error(err)
    }
  }

  const getMessages = (id) => {
    let ref = gun.get(id)
    let messages = []

    ref.map().on((data) => {
      messages.push({
        from: data.from,
        content: data.content,
        createdAt: data.createdAt,
      })
    })

    for (let message of messages) {
      dispatch({
        type: 'add',
        data: {
          createdAt: message.createdAt,
          from: message.from,
          content: message.content,
        },
      })
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    setTime(setInterval(() => setTime(Date.now()), 1000))
  }, [])

  useEffect(() => {
    ;(async () => {
      if (currentAccount) await getUserInfo(currentAccount)
    })()
  }, [currentAccount])

  useEffect(() => {
    const { id, name, lastActive, image } = router.query
    setChatId(id)
    setChatName(name)
    setChatActivity(lastActive)
    setChatImage(image)
    dispatch({ type: 'clear', data: {} })
    state = []
    getMessages(id)
  }, [router.query])

  return (
    <ViberContext.Provider
      value={{
        currentAccount,
        appStatus,
        connectWallet,
        currentUser,
        chatId,
        chatName,
        chatActivity,
        chatImage,
        state,
        gun,
        dispatch,
        getUserInfo,
        getMessages,
        dispatch,
        setChatName,
      }}
    >
      {children}
    </ViberContext.Provider>
  )
}
