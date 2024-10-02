const User_admin2 = require('../models/super_admin_users')
const autoCatch = require('../lib/auto-catch')

module.exports = autoCatch({
  getuserbyid,
  listProducts,
  createProduct,
  editProduct,
  deleteProduct,
  user_validate,
  add_new_column,
  remove_new_column,
  get_common_details
  

})

async function add_new_column (req, res, next) {
  const products1 = await User_admin2.add_new_column()
  res.json(products1)
}
async function remove_new_column (req, res, next) {
  const products1 = await User_admin2.remove_new_column()
  res.json(products1)
}

async function getuserbyid (req, res, next) {
  const { id } = req.params
  const user = await User_admin2.get(id)
  if (!user) return next()
  res.json(user)
}

async function user_validate (req, res, next) {
  const user = await User_admin2.user_validate(req.body.username,req.body.password)
  res.json(user)
}
async function get_common_details (req, res, next) {
  const user = await User_admin2.get_common_details(req.body.client_id)
  res.json(user)
}


async function listProducts (req, res, next) {
  const products1 = await User_admin2.list()
  res.json(products1)
}


async function createProduct (req, res, next) {
  const user = await User_admin2.create(req.body)
  res.json(user)
}

async function editProduct (req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  const change = req.body
  const user = await User_admin2.edit(req.params.id, change)
  res.json(user)
}

async function deleteProduct (req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  await User_admin2.remove(req.params.id)
  res.json({ success: true })
}

function forbidden (next) {
  const err = new Error('Forbidden')
  err.statusCode = 403
  return next(err)
}
