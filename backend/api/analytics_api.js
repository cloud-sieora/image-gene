const Analytics = require('../models/analytics')
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
  get_analytics_data,
  get_analytics_date_time,
  get_analytics_for_playback,
  get_analytics_date_time_playback,
  play_back_trim,
  getAllCameraVideoUrlApi
  // send_notification,
})

async function add_new_column(req, res, next) {
  const products1 = await Analytics.add_new_column()
  res.json(products1)
}
async function remove_new_column(req, res, next) {
  const products1 = await Analytics.remove_new_column()
  res.json(products1)
}

async function getuserbyid(req, res, next) {
  const { id } = req.params
  const user = await Analytics.get(id)
  if (!user) return next()
  res.json(user)
}



async function listProducts(req, res, next) {
  const products1 = await Analytics.list(req.body.device_id)
  res.json(products1)
}

async function get_alerts(req, res, next) {
  const products1 = await Analytics.get_alerts(req.body.device_id)
  res.json(products1)
}

async function accounts_dashboard(req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  const date1 = req.body.start_date
  const date2 = req.body.end_date
  const time1 = req.body.start_time
  const time2 = req.body.end_time
  const camera_id = req.body.camera_id
  const camera_name = req.body.camera_name
  const start_count = req.body.start_count
  const end_count = req.body.end_count
  const analytic_flag = req.body.analytic_flag
  const response = await Analytics.accounts_dashboard(date1, date2, time1, time2, camera_id, camera_name, start_count, end_count, analytic_flag)
  res.json(response)
}

async function get_analytics_date_time(req, res, next) {
  const date1 = req.body.start_date
  const date2 = req.body.end_date
  const time1 = req.body.start_time
  const time2 = req.body.end_time
  const camera_id = req.body.camera_id
  const response = await Analytics.get_analytics_date_time(date1, date2, time1, time2, camera_id,)
  res.json(response)
}

async function get_analytics_date_time_playback(req, res, next) {
  const date1 = req.body.start_date
  const date2 = req.body.end_date
  const time1 = req.body.start_time
  const time2 = req.body.end_time
  const camera_id = req.body.camera_id
  const response = await Analytics.get_analytics_date_time_playback(date1, date2, time1, time2, camera_id,)
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
  const response = await Analytics.get_analytics_data(date1, date2, time1, time2, camera_id, camera_name, start_count, end_count, selectedanalytics)
  res.json(response)
}

async function play_back_trim(req, res, next) {
  const date1 = req.body.start_date
  const time1 = req.body.start_time
  const hour = req.body.hour
  const camera_id = req.body.camera_id
  const response = await Analytics.play_back_trim(date1, time1, hour, camera_id,)
  res.json(response)
}

async function get_analytics_for_playback(req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  const date1 = req.body.start_date
  const time1 = req.body.start_time
  const camera_id = req.body.camera_id
  const response = await Analytics.get_analytics_for_playback(date1, time1, camera_id,)
  res.json(response)
}


// async function accounts_dashboard(req, res, next) {
//   // if (!req.isAdmin) return forbidden(next)
//   const date1 = req.body.start_date
//   const date2 = req.body.end_date
//   const camera_id = req.body.camera_id
//   const camera_name = req.body.camera_name
//   const response = await Analytics.accounts_dashboard(date1, date2, camera_id, camera_name)
//   res.json(response)
// }

async function createProduct(req, res, next) {
  const user = await Analytics.create(req.body)
  res.json(user)
}
async function send_notification(req, res, next) {
  const user = await Analytics.send_notification(req.body.title, req.body.msg, req.body.dealer_id, req.body.mobile_number)
  res.json(user)
}

async function editProduct(req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  const change = req.body
  const user = await Analytics.edit(req.params.id, change)
  res.json(user)
}

async function deleteProduct(req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  await Analytics.remove(req.params.id)
  res.json({ success: true })
}

function forbidden(next) {
  const err = new Error('Forbidden')
  err.statusCode = 403
  return next(err)
}


async function getAllCameraVideoUrlApi(req, res, next){
  let data = await Analytics.getAllCameraVideoUrl(req, res, next)
}