const { auth } = require('../auth')
const assert = require('assert')

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
