import { client } from '../../../lib/sanity'

const getUserInfo = async (req, res) => {
  const query = `*[_type == "users" && _id == "${req.body.walletAddress}"] {
    name, 
    "profileImage": profileImage.asset -> url,
    lastActive,
    walletAddress,
   "conversations": *[_type == 'conversations' && references('${req.body.walletAddress}')] {
name,
"image": conversationImage.asset -> url,
_id,
lastMessage,
"partipicants": partipicants[] -> {
name,
walletAddress,
"profileImage": profileImage.asset -> url,
 lastActive
}
}
}`
  try {
    const sanityResponse = await client.fetch(query)
    res.status(200).send({ message: 'success', data: sanityResponse[0] })
  } catch (err) {
    res.status(500).send({ message: 'error', data: err.message })
  }
}

export default getUserInfo
