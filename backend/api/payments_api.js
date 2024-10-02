const Payments = require('../models/payments')
const autoCatch = require('../lib/auto-catch')

module.exports = autoCatch({
  getuserbyid,
  listProducts,
  createProduct,
  editProduct,
  deleteProduct,
  get_payment_user,
  get_payment_all,
  get_payment_dealer,
})


async function getuserbyid (req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  const { id } = req.params
  const user = await Payments.get(id)
  if (!user) return next()
  res.json(user)
}
async function get_payment_user (req, res, next) {
  const products1 = await Payments.get_payment_user(req.body.user_id,req.body.startdate,req.body.enddate,req.body.status)
  res.json(products1)
}

async function get_payment_all (req, res, next) {
  const products1 = await Payments.get_payment_all(req.body.startdate,req.body.enddate,req.body.status)
  res.json(products1)
}
async function get_payment_dealer (req, res, next) {
  const products1 = await Payments.get_payment_dealer(req.body.dealer_id,req.body.startdate,req.body.enddate,req.body.status)
  res.json(products1)
}


async function listProducts (req, res, next) {
  const products1 = await Payments.list()
  res.json(products1)
}


async function createProduct (req, res, next) {
  const user = await Payments.create(req.body)
  res.json(user)
}


async function editProduct (req, res, next) {
  const change = req.body
  const user = await Payments.edit(req.params.id, change)
  res.json(user)
}


async function deleteProduct (req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  await Payments.remove(req.params.id)
  res.json({ success: true })
}

function forbidden (next) {
  const err = new Error('Forbidden')
  err.statusCode = 403
  return next(err)
}

