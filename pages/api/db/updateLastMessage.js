import { client } from '../../../lib/sanity'

const updateLastMessage = async (req, res) => {
  try {
    const { message, id } = req.body

    await client.patch(id).set({ lastMessage: message }).commit()

    res.status(200).send({ message: 'success' })
  } catch (err) {
    res.status(500).send({ message: 'error', data: err.message })
  }
}

export default updateLastMessage
