const Alert = require('../models/alert_creation')
const autoCatch = require('../lib/auto-catch')

module.exports = autoCatch({
  getuserbyid,
  listProducts,
  createProduct,
  editProduct,
  deleteProduct,
  add_new_column,
  remove_new_column,
  get_alerts,
  accounts_dashboard,
  getalerts_by_date_time,
  get_analytics_data
  // send_notification,
})

async function add_new_column(req, res, next) {
  const products1 = await Alert.add_new_column()
  res.json(products1)
}
async function remove_new_column(req, res, next) {
  const products1 = await Alert.remove_new_column()
  res.json(products1)
}

async function getuserbyid(req, res, next) {
  const { id } = req.params
  const user = await Alert.get(id)
  if (!user) return next()
  res.json(user)
}



async function listProducts(req, res, next) {
  const products1 = await Alert.list()
  res.json(products1)
}

async function get_alerts(req, res, next) {
  const products1 = await Alert.get_alerts(req.body.device_id)
  res.json(products1)
}

async function accounts_dashboard(req, res, next) {
  console.log(req.body)
  // if (!req.isAdmin) return forbidden(next)
  const date1 = req.body.start_date
  const date2 = req.body.end_date
  const time1 = req.body.start_time
  const time2 = req.body.end_time
  const camera_id = req.body.camera_id
  const camera_name = req.body.camera_name
  const start_count = req.body.start_count
  const end_count = req.body.end_count
  const analytic_flag = req.body.count_flag
  const active = req.body.Active
  const history_type = req.body.history_type
  const response = await Alert.accounts_dashboard(date1, date2, time1, time2, camera_id, camera_name, start_count, end_count, analytic_flag, active, history_type)
  res.json(response)
}

// async function accounts_dashboard(req, res, next) {
//   // if (!req.isAdmin) return forbidden(next)
//   const date1 = req.body.start_date
//   const date2 = req.body.end_date
//   const camera_id = req.body.camera_id
//   const active = req.body.Active
//   const response = await Alert.accounts_dashboard(date1, date2, camera_id, active)
//   res.json(response)
// }

async function getalerts_by_date_time(req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  const date1 = req.body.start_date
  const date2 = req.body.end_date
  const time1 = req.body.start_time
  const time2 = req.body.end_time
  const camera_id = req.body.camera_id
  const response = await Alert.getalerts_by_date_time(date1, date2, time1, time2, camera_id)
  res.json(response)
}

async function get_analytics_data(req, res, next) {
  // if (!req.isAdmin) return forbidden(next)

  const date1 = req.body.start_date
  const date2 = req.body.end_date
  const time1 = req.body.start_time
  const time2 = req.body.end_time
  const camera_id = req.body.camera_id
  const camera_name = req.body.camera_name
  const start_count = req.body.start_count
  const end_count = req.body.end_count
  const selectedanalytics = req.body.selectedanalytics
  const response = await Alert.get_analytics_data(date1, date2, time1, time2, camera_id, camera_name, start_count, end_count, selectedanalytics)
  res.json(response)
}

async function createProduct(req, res, next) {
  const user = await Alert.create(req.body)
  res.json(user)
}
async function send_notification(req, res, next) {
  const user = await Alert.send_notification(req.body.title, req.body.msg, req.body.dealer_id, req.body.mobile_number)
  res.json(user)
}

async function editProduct(req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  const change = req.body
  const user = await Alert.edit(req.params.id, change)
  res.json(user)
}

async function deleteProduct(req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  await Alert.remove(req.params.id)
  res.json({ success: true })
}

function forbidden(next) {
  const err = new Error('Forbidden')
  err.statusCode = 403
  return next(err)
}
