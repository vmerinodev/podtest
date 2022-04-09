const { auth } = require('../auth')
const { addUser } = require('../users')
const { getAssets, activateAsset } = require('../assets')
const assert = require('assert')

const accountId = 'efbc3325-c0db-5fa9-a5e4-4dd3c67e8813'
const productId = '624aaba591bf0b1a16401db6'
const randomUsername = (Math.random() + 1).toString(36).substring(7)
const randomPassword = (Math.random() + 1).toString(36).substring(2)

describe('Auth tests', function () {
  describe('Auth OK', function () {
    it('should get an auth token', async function () {
      const res = await auth({ username: 'victor.merino', password: 'onirem.rotciv' })
      assert.equal(!res, false)
      assert.equal(!res.token, false)
    })
  })
  describe('Auth KO', function () {
    it('should throw error for empty payload', async function () {
      const expected = new Error('Payload must have username and password')
      await assert.rejects(auth(), expected)
    })
    it('should throw error for user not found', async function () {
      const expected = new Error('User not found')
      await assert.rejects(auth({ username: 'foo', password: 'bar' }), expected)
    })
  })
})

describe('Users tests', function () {
  describe('Create OK', function () {
    it('should get a new user', async function () {
      const toAdd = {
        accountId: accountId,
        username: randomUsername,
        password: randomPassword,
        email: `${randomUsername}@email.com`,
        status: 'active',
        permissions: [
          {
            accountId: accountId,
            roles: [
              'admin'
            ]
          }
        ]
      }
      const data = await auth({ username: 'victor.merino', password: 'onirem.rotciv' })
      const res = await addUser(data.token, toAdd)
      assert.equal(!res, false)
      assert.equal(!res._id, false)
    })
  })
  describe('Create KO', function () {
    it('should throw error for empty token', async function () {
      const expected = new Error('Token not found')
      await assert.rejects(addUser(), expected)
    })
    it('should throw error for empty payload', async function () {
      const expected = new Error('Payload error')
      const data = await auth({ username: 'victor.merino', password: 'onirem.rotciv' })
      await assert.rejects(addUser(data.token), expected)
    })
    it('should throw error for user not created', async function () {
      const expected = new Error('User not created')
      const data = await auth({ username: 'victor.merino', password: 'onirem.rotciv' })
      await assert.rejects(addUser(data.token, { username: 'foo', password: 'bar' }), expected)
    })
  })
})

describe('Assets tests', function () {
  describe('Get all assets OK', function () {
    it('should get all assets', async function () {
      const data = await auth({ username: 'victor.merino', password: 'onirem.rotciv' })
      const assets = await getAssets(data.token, accountId)
      assert.equal(!assets, false)
    })
  })
  describe('Get all assets KO', function () {
    it('should throw error for empty token', async function () {
      const expected = new Error('Token not found')
      await assert.rejects(getAssets(), expected)
    })
    it('should throw error for empty account id', async function () {
      const expected = new Error('Account id not found')
      const data = await auth({ username: 'victor.merino', password: 'onirem.rotciv' })
      await assert.rejects(getAssets(data.token), expected)
    })
  })
  describe('Activate asset OK', function () {
    it('should active the asset', async function () {
      const now = new Date()
      const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
      const data = await auth({ username: 'victor.merino', password: 'onirem.rotciv' })
      const assets = await getAssets(data.token, accountId)
      // eventually, when every asset is active, this code will fail,
      // but I'm doing this to keep it simple for the technical test
      const asset = assets.filter(asset => asset.status === 'inactive')[0]
      const payload = {
        accountId: accountId,
        subscription: {
          subscriberAccountId: accountId,
          productId: productId,
          startTime: date,
          ipPools: []
        }
      }
      const response = await activateAsset(data.token, asset.iccid, payload)
      assert.equal(response.status, 'active')
    })
  })
  describe('Activate asset KO', function () {
    it('should throw error for empty token', async function () {
      const expected = new Error('Token not found')
      await assert.rejects(activateAsset(), expected)
    })
    it('should throw error for empty asset id', async function () {
      const expected = new Error('Asset id not found')
      const data = await auth({ username: 'victor.merino', password: 'onirem.rotciv' })
      await assert.rejects(activateAsset(data.token), expected)
    })
    it('should throw error for empty payload', async function () {
      const expected = new Error('Payload error')
      const data = await auth({ username: 'victor.merino', password: 'onirem.rotciv' })
      const iccid = '--';
      await assert.rejects(activateAsset(data.token, iccid), expected)
    })
    it('should throw error for asset not activated', async function () {
      const expected = new Error('Asset not activated')
      const data = await auth({ username: 'victor.merino', password: 'onirem.rotciv' })
      const iccid = '--';
      await assert.rejects(activateAsset(data.token, iccid, { accountId: accountId }), expected)
    })
  })
})
