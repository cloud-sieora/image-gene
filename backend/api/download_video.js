// const Analytics = require('../models/analytics')
const autoCatch = require('../lib/auto-catch')

module.exports = autoCatch({
  
})

async function download_video(req, res, next) {
  const products1 = await Analytics.add_new_column()
  res.json(products1)
}

function forbidden(next) {
  const err = new Error('Forbidden')
  err.statusCode = 403
  return next(err)
}
