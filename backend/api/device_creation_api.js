const Device = require('../models/device_creation')
const autoCatch = require('../lib/auto-catch')

module.exports = autoCatch({
  getuserbyid,
  listProducts,
  createProduct,
  editProduct,
  deleteProduct,
  createProduct_orginal,
  editProduct_orginal,
  deleteProduct_orginal,
  add_new_column,
  remove_new_column,
  device_validate,
  edit_device,
  device_get,
  list_device_camera,
  user_get_device,
  listdealer,
  list_by_client_id,
  list_by_client_admin_id,
  list_by_site_admin_id,
  list_by_user_id,
  list_by_client_id_status,
  list_by_client_admin_id_status,
  list_by_site_admin_id_status,
  list_by_user_id_status,
  list_device_site_id

})

async function add_new_column(req, res, next) {
  const products1 = await Device.add_new_column()
  res.json(products1)
}
async function remove_new_column(req, res, next) {
  const products1 = await Device.remove_new_column()
  res.json(products1)
}

async function edit_device(req, res, next) {
  const change = req.body
  const user = await Device.edit_device(change)
  res.json(user)
}
async function getuserbyid(req, res, next) {
  const { id } = req.params
  const user = await Device.get(id)
  if (!user) return next()
  res.json(user)
}

async function list_device_status(req, res, next) {
  const { id } = req.params
  const user = await Device.list_device_status(id)
  if (!user) return next()
  res.json(user)
}


async function device_validate(req, res, next) {
  const user = await Device.device_validate(req.body.device_id)
  res.json(user)
}

async function list_device_site_id(req, res, next) {
  const user = await Device.list_device_site_id(req.body.site_id)
  res.json(user)
}

async function device_get(req, res, next) {
  const user = await Device.get2(req.body.device_id)
  res.json(user)
}

async function list_device_camera(req, res, next) {
  const user = await Device.list_device_camera(req.body.device_id)
  res.json(user)
}

async function list_by_client_id(req, res, next) {
  const products1 = await Device.list_by_client_id(req.body.client_id)
  res.json(products1)
}

async function list_by_client_admin_id(req, res, next) {
  const products1 = await Device.list_by_client_admin_id(req.body.client_admin_id)
  res.json(products1)
}

async function list_by_site_admin_id(req, res, next) {
  const products1 = await Device.list_by_site_admin_id(req.body.site_admin_id)
  res.json(products1)
}

async function list_by_user_id(req, res, next) {
  const products1 = await Device.list_by_user_id(req.body.user_id)
  res.json(products1)
}

async function list_by_client_id_status(req, res, next) {
  const products1 = await Device.list_by_client_id_status(req.body.client_id)
  console.log(products1)
  res.json(products1)
}

async function list_by_client_admin_id_status(req, res, next) {
  const products1 = await Device.list_by_client_admin_id_status(req.body.client_admin_id)
  res.json(products1)
}

async function list_by_site_admin_id_status(req, res, next) {
  const products1 = await Device.list_by_site_admin_id_status(req.body.site_admin_id)
  res.json(products1)
}

async function list_by_user_id_status(req, res, next) {
  const products1 = await Device.list_by_user_id_status(req.body.user_id)
  res.json(products1)
}


async function listProducts(req, res, next) {
  const products1 = await Device.list(req.body.user_id)
  res.json(products1)
}
async function listdealer(req, res, next) {
  const products1 = await Device.list_dealer(req.body.dealer_id)
  res.json(products1)
}

async function user_get_device(req, res, next) {
  const products1 = await Device.user_get_device(req.body.dealer_id, req.body.user_id, req.body.device_name)
  res.json(products1)
}


async function createProduct(req, res, next) {
  const user = await Device.create(req.body)
  res.json(user)
}

async function editProduct(req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  const change = req.body
  const user = await Device.edit(req.params.id, change)
  res.json(user)
}

async function deleteProduct(req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  await Device.remove(req.params.id)
  res.json({ success: true })
}

async function createProduct_orginal(req, res, next) {
  const user = await Device.create_orginal(req.body)
  res.json(user)
}

async function editProduct_orginal(req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  const change = req.body
  const user = await Device.edit_orginal(req.params.id, change)
  res.json(user)
}

async function deleteProduct_orginal(req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  await Device.remove_orginal(req.params.id)
  res.json({ success: true })
}

function forbidden(next) {
  const err = new Error('Forbidden')
  err.statusCode = 403
  return next(err)
}
