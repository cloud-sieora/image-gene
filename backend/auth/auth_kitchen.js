const jwt = require('jsonwebtoken')
const autoCatch = require('../lib/auto-catch')
const jwtSecret = process.env.JWT_SECRET || 'mark it zero'
const kitchen1 = require('../models/kitchen_users')
const admin2 = require('../models/admin_users')
const manager2 = require('../models/manager_users')

module.exports = {
  ensureUser: autoCatch(ensureUser)
}

async function ensureUser (req, res, next) {
  const jwtString = req.headers.authorization || req.cookies.jwt
  const payload = await verify(jwtString)

  let status = await kitchen1.user_validate(payload.id,payload.password)
  if(status.length >=1)
  {
    req.isAdmin = true
    return next()
  }
  else
  {
    let status2 = await admin2.user_validate(payload.id,payload.password)
    let status3 = await manager2.user_validate(payload.id,payload.password)

    if(status2.length >=1)
    {
      req.isAdmin = true
      return next()
    }
    else if(status3.length >=1)
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
