const post = require('axios').post
const host = 'https://hummingbird-staging.podgroup.com'

async function auth (payload) {
  if (!payload || !payload.username || !payload.password) {
    throw new Error('Payload must have username and password')
  }
  try {
    const response = await post(`${host}/auth/token`, payload)
    return response.data
  } catch (e) {
    throw new Error('User not found')
  }
}

module.exports = {
  auth
}
