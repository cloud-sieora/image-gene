const User_admin = require('../models/users_creation')
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
  list_by_dealer_id,
  get_common_details,
  list_by_client_id,
  list_by_client_admin_id,
  list_by_site_admin_id,
  list_by_user_id,
  user_validate_application,
  list_by_admin_owner_id

})

async function add_new_column(req, res, next) {
  const products1 = await User_admin.add_new_column()
  res.json(products1)
}
async function remove_new_column(req, res, next) {
  const products1 = await User_admin.remove_new_column()
  res.json(products1)
}

async function getuserbyid(req, res, next) {
  const { id } = req.params
  const user = await User_admin.get(id)
  if (!user) return next()
  res.json(user)
}

async function user_validate(req, res, next) {
  const user = await User_admin.user_validate(req.body.username, req.body.password, req.body.user_type)
  res.json(user)
}

async function user_validate_application(req, res, next) {
  const user = await User_admin.user_validate_application(req.body.username, req.body.password, req.body.user_type)
  res.json(user)
}

async function get_common_details(req, res, next) {
  const user = await User_admin.get_common_details(req.body.mail, req.body.client_id)
  res.json(user)
}



async function listProducts(req, res, next) {
  const products1 = await User_admin.list()
  res.json(products1)
}

async function list_by_admin_owner_id(req, res, next) {
  const products1 = await User_admin.list_by_admin_owner_id(req.body.admin_owner_id)
  res.json(products1)
}

async function list_by_dealer_id(req, res, next) {
  const products1 = await User_admin.list_by_dealer_id(req.body.dealer_id)
  res.json(products1)
}

async function list_by_client_id(req, res, next) {
  const products1 = await User_admin.list_by_client_id(req.body.client_id)
  res.json(products1)
}

async function list_by_client_admin_id(req, res, next) {
  const products1 = await User_admin.list_by_client_admin_id(req.body.client_admin_id)
  res.json(products1)
}

async function list_by_site_admin_id(req, res, next) {
  const products1 = await User_admin.list_by_site_admin_id(req.body.site_admin_id)
  res.json(products1)
}

async function list_by_user_id(req, res, next) {
  const products1 = await User_admin.list_by_user_id(req.body.user_id)
  res.json(products1)
}


async function createProduct(req, res, next) {
  const user = await User_admin.create(req.body)
  res.json(user)
}

async function editProduct(req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  console.log('calling')
  const change = req.body
  const user = await User_admin.edit(req.params.id, change)
  console.log('edited data', user)
  res.json(user)
}

async function deleteProduct(req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  await User_admin.remove(req.params.id)
  res.json({ success: true })
}

function forbidden(next) {
  const err = new Error('Forbidden')
  err.statusCode = 403
  return next(err)
}
