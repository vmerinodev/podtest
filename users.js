const post = require('axios').post
const host = 'https://hummingbird-staging.podgroup.com'

async function addUser (token, payload) {
  if (!token) {
    throw new Error('Token not found')
  }
  if (!validateAddUserPayload(payload)) {
    throw new Error('Payload error')
  }
  try {
    const response = await post(`${host}/users`, payload, { headers: { 'x-access-token': token } })
    return response.data
  } catch (e) {
    throw new Error('User not created')
  }
}

function validateAddUserPayload (payload) {
  // validate all the mandatory fields and stuff before send the request [...]
  if (!payload) {
    return false
  }
  return true
}

module.exports = {
  addUser
}
