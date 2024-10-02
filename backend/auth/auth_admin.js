const jwt = require('jsonwebtoken')
const autoCatch = require('../lib/auto-catch')
const admin = require('../models/admin_users')
const kitchen = require('../models/kitchen_users')
const manager = require('../models/manager_users')

const jwtSecret = process.env.JWT_SECRET || 'mark it zero'
const jwtOpts = { algorithm: 'HS256', expiresIn: '360d' }


module.exports = {
  // authenticate,
  login: autoCatch(login),
  ensureUser: autoCatch(ensureUser)
}
async function login (req, res, next) {
  if(req.body.type == "ADMIN")
  {
    let status = await admin.user_validate(req.body.id,req.body.password )
    if(status.length >=1)
    {
      const token = await sign({ id: req.body.id,password:req.body.password })
      res.cookie('jwt', token, { httpOnly: true })
      res.json({ success: true, token: token })
    }
    else
    {
      res.json({ success: false})

    }
  }
  else if(req.body.type == "KITCHEN")
  {
    let status = await kitchen.user_validate(req.body.id,req.body.password )
    if(status.length >=1)
    {
      const token = await sign({ id: req.body.id,password:req.body.password })
      res.cookie('jwt', token, { httpOnly: true })
      res.json({ success: true, token: token })
    }
    else
    {
      res.json({ success: false})

    }
  }
  else if(req.body.type == "MANAGER")
  {
    let status = await manager.user_validate(req.body.id,req.body.password )
    if(status.length >=1)
    {
      const token = await sign({ id: req.body.id,password:req.body.password })
      res.cookie('jwt', token, { httpOnly: true })
      res.json({ success: true, token: token })
    }
    else
    {
      res.json({ success: false})

    }
  }
  else
  {
    res.json({ success: false})

  }
}

async function ensureUser (req, res, next) {
  const jwtString = req.headers.authorization || req.cookies.jwt
  const payload = await verify(jwtString)
  // if (payload) {
  //   if ((payload.id == "admin") && (payload.password=="dhopokie")) req.isAdmin = true
  //   return next()
  // }

  // const err = new Error('Unauthorized')
  // err.statusCode = 401
  // next(err)

  let status = await admin.user_validate(payload.id,payload.password)
  if(status.length >=1)
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

async function sign (payload) {
  const token = await jwt.sign(payload, jwtSecret, jwtOpts)
  return token
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

