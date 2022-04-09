const get = require('axios').get
const host = 'https://hummingbird-staging.podgroup.com'

async function getAssets (token, accountId) {
  if (!token) {
    throw new Error('Token not found')
  }
  if (!accountId) {
    throw new Error('Account id not found')
  }
  const response = await get(`${host}/assets`, { headers: { 'x-access-token': token }, params: { accountId: accountId } })
  return response.data
}

module.exports = {
  getAssets
}
