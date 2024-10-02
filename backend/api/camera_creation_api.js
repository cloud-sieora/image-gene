const Camera = require('../models/camera_creation')
const autoCatch = require('../lib/auto-catch')

module.exports = autoCatch({
  getuserbyid,
  listProducts,
  createProduct,
  editProduct,
  deleteProduct,
  add_new_column,
  remove_new_column,
  device_validate,
  edit_device,
  list_camer_device_id,
  list_camera_user_id,
  device_get,
  list_by_client_id,
  list_by_client_admin_id,
  list_by_site_admin_id,
  list_by_user_id,
  list_camera_id,
  list_camera_device_id
})

async function add_new_column (req, res, next) {
  const products1 = await Camera.add_new_column()
  res.json(products1)
}
async function remove_new_column (req, res, next) {
  const products1 = await Camera.remove_new_column()
  res.json(products1)
}

async function list_by_client_id(req, res, next) {
  const products1 = await Camera.list_by_client_id(req.body.client_id)
  res.json(products1)
}

async function list_by_client_admin_id(req, res, next) {
  const products1 = await Camera.list_by_client_admin_id(req.body.client_admin_id)
  res.json(products1)
}

async function list_by_site_admin_id(req, res, next) {
  const products1 = await Camera.list_by_site_admin_id(req.body.site_admin_id)
  res.json(products1)
}

async function list_by_user_id(req, res, next) {
  const products1 = await Camera.list_by_user_id(req.body.user_id)
  res.json(products1)
}

async function list_camera_id(req, res, next) {
  const products1 = await Camera.list_by_user_id(req.body.id)
  res.json(products1)
}

async function list_camera_device_id(req, res, next) {
  const products1 = await Camera.list_camera_device_id(req.body.device_id)
  res.json(products1)
}

async function edit_device (req, res, next) {
  const change = req.body
  const user = await Camera.edit_device(change)
  res.json(user)
}
async function getuserbyid (req, res, next) {
  const { id } = req.params
  const user = await Camera.get(id)
  if (!user) return next()
  res.json(user)
}


async function device_validate (req, res, next) {
  const user = await Camera.device_validate(req.body.device_id)
  res.json(user)
}

async function device_get (req, res, next) {
  const user = await Camera.get2(req.body.device_id)
  res.json(user)
}
async function listProducts (req, res, next) {
  const products1 = await Camera.list(req.body.site_id)
  res.json(products1)
}

async function list_camer_device_id (req, res, next) {
  const user = await Camera.list_camer_device_id(req.body.device_id)
  res.json(user)
}
async function list_camera_user_id (req, res, next) {
  const user = await Camera.list_camera_user_id(req.body.user_id)
  res.json(user)
}


async function createProduct (req, res, next) {
  const user = await Camera.create(req.body)
  res.json(user)
}

async function editProduct (req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  const change = req.body
  const user = await Camera.edit(req.params.id, change)
  res.json(user)
}

async function deleteProduct (req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  await Camera.remove(req.params.id)
  res.json({ success: true })
}

function forbidden (next) {
  const err = new Error('Forbidden')
  err.statusCode = 403
  return next(err)
}
