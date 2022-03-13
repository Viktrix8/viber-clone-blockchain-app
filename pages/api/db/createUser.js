import { client } from '../../../lib/sanity'

const createUser = async (req, res) => {
  try {
    const { walletAddress, asset } = req.body

    const userDoc = {
      _type: 'users',
      _id: walletAddress,
      walletAddress,
      name: 'Unnamed',
      lastActive: new Date(Date.now()).toISOString(),
      profileImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset,
        },
      },
    }

    const user = await client.createIfNotExists(userDoc)
    await client
      .patch(walletAddress)
      .set({ lastActive: new Date(Date.now()).toISOString() })
      .commit()

    res.status(200).send({ message: 'success', data: user })
  } catch (err) {
    res.status(500).send({ message: 'error', data: err.message })
  }
  client
}

export default createUser
