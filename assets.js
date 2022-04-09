const { get, put } = require('axios')
const host = 'https://hummingbird-staging.podgroup.com'
const api = `${host}/assets`

async function getAssets (token, accountId) {
  if (!token) {
    throw new Error('Token not found')
  }
  if (!accountId) {
    throw new Error('Account id not found')
  }
  const response = await get(api, { headers: { 'x-access-token': token }, params: { accountId: accountId } })
  return response.data
}

async function activateAsset (token, iccid, payload) {
  if (!token) {
    throw new Error('Token not found')
  }
  if (!iccid) {
    throw new Error('Asset id not found')
  }
  if (!validateActivateAssetPayload(payload)) {
    throw new Error('Payload error')
  }
  try {
    const response = await put(`${api}/${iccid}/subscribe`, payload, { headers: { 'x-access-token': token } })
    return response.data
  } catch (e) {
    throw new Error('Asset not activated')
  }
}

function validateActivateAssetPayload (payload) {
  // validate all the mandatory fields and stuff before send the request [...]
  if (!payload) {
    return false
  }
  return true
}

module.exports = {
  getAssets,
  activateAsset
}
