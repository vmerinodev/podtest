const { auth } = require('../auth')
const { addUser } = require('../users')
const assert = require('assert')

const accountId = 'efbc3325-c0db-5fa9-a5e4-4dd3c67e8813'
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
