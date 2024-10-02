const jwt = require('jsonwebtoken')
const autoCatch = require('../lib/auto-catch')
const jwtSecret = process.env.JWT_SECRET || 'mark it zero'
const admin1 = require('../models/admin_users')
const manager1 = require('../models/manager_users')
module.exports = {
  ensureUser: autoCatch(ensureUser)
}

async function ensureUser (req, res, next) {
  const jwtString = req.headers.authorization || req.cookies.jwt
  const payload = await verify(jwtString)

  let status = await manager1.user_validate(payload.id,payload.password)
  if(status.length >=1)
  {
    req.isAdmin = true
    return next()
  }
  else
  {
    let status2 = await admin1.user_validate(payload.id,payload.password)
    if(status2.length >=1)
    {
      req.isAdmin = true
      return next()
    }
    else
    {
    const err = new Error('Unauthorized')
    err.statusCode = 401
    next(err)
    }
  }

}

async function verify (jwtString = '') {
  jwtString = jwtString.replace(/^Bearer /i, '')
  try {
    const payload = await jwt.verify(jwtString, jwtSecret)
    return payload
  } catch (err) {
    err.statusCode = 401
    throw err
  }
}
