const cuid = require('cuid')
const db = require('../db')
const device_api = require('./device_creation')
const payment_api = require('./payments')


const User = db.model('Users_creation', {
  _id: { type: String, default: cuid },
  client_id: { type: String, required: true },
  password: { type: String, required: true },
  User_name: { type: String, required: true },
  mobile_number: { type: String, required: true },
  mail: { type: String, required: true },
  Active: { type: Number, default: 1 },
  Read: { type: Number, default: 0 },
  edit: { type: Number, default: 0 },
  create: { type: Number, default: 0 },
  site_id: { type: Array, default: [] },
  camera_id: { type: Array, default: [] },
  created_date: { type: String, required: true },
  created_time: { type: String, required: true },
  updated_date: { type: String, required: true },
  updated_time: { type: String, required: true },
  dealer_id: { type: String, required: true },
  admin_owner_id: { type: String, required: true },
  clientt_id: { type: String, default: 'None' },
  client_admin_id: { type: String, default: 'None' },
  site_admin_id: { type: String, default: 'None' },
  alert_noti: { type: Number, default: 0 },
  gender: { type: String, required: true },
  operation_type: { type: Array, required: true },
  user_type: { type: String, required: true },
  position_type: { type: String, required: true },
  notification_id: { type: Object, default: [] },
  notification_active: { type: Number, default: 1 },
  company_name: { type: String, required: true },
  notification_firebase_id : {type : String, default : 'NONE'},
  tax: { type: Number, default: 0 },
  address: {
    line1: { type: String, default: 'None' },
    postal_code: { type: String, default: 'None' },
    city: { type: String, default: 'None' },
    state: { type: String, default: 'None' },
    country: { type: String, default: 'None' },
  },

})

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  user_validate,
  add_new_column,
  remove_new_column,
  get_common_details,
  list_by_dealer_id,
  list_by_client_id,
  list_by_client_admin_id,
  list_by_site_admin_id,
  list_by_user_id,
  user_validate_application,
  list_by_admin_owner_id,
  model: User
}

async function add_new_column() {
  const user = await User.updateMany({}, {
    $set: {
      tax: 0
    }
  })
  return user
}
async function remove_new_column() {
  const user = await User.updateMany({}, { $unset: { "currentcy": 1 } })
  return user
}
async function list() {
  const user = await User.find({})
  return user
}

async function list_by_admin_owner_id(id) {
  console.log(id);
  const user = await User.find({ admin_owner_id: id, position_type: "Client" })
  return user
}

async function list_by_dealer_id(id) {
  const user = await User.find({ dealer_id: id })
  return user
}

async function list_by_client_id(id) {
  const user = await User.find({ clientt_id: id })
  return user
}

async function list_by_client_admin_id(id) {
  const user = await User.find({ client_admin_id: id })
  return user
}

async function list_by_site_admin_id(id) {
  const user = await User.find({ site_admin_id: id })
  return user
}

async function list_by_user_id(id) {
  const user = await User.find({ user_id: id })
  return user
}

async function user_validate(name, pass, usertype) {
  const user = await User.findOne({ mail: name, password: pass, Active: 1, })
  if (user == null) {
    return { success: false }
  }
  else {
    return { success: true, data: user }
  }
}

async function user_validate_application(name, pass, usertype) {
  const user = await User.findOne({ mail: name, password: pass, Active: 1, })
  console.log(user)
  if (user == null) {
    return { success: false }
  }
  else {
    const payment = await payment_api.model.find({ user_id: user._id })
    if (payment == null) {
      return { success: false }
    } else {
      return { success: true, data: user }
    }
  }
}

async function get_common_details(id1, name) {
  const user = await User.findOne({ mail: id1, client_id: name, Active: 1 })
  // console.log(user)
  if (user == null) {
    return { success: false }
  }
  else {
    return { success: true, data: user }
  }
}



async function get2(id, id1) {
  const user = await User.findOne({ mail: id, client_id: id1 })
  if (user == null) {
    return { success: false }
  }
  else {
    return { success: true, data: user }
  }
}




async function get(_id) {
  const product = await User.findById(_id)
  return product
}

async function create(fields) {

  let temp = await get2(fields.mail)    
  if (temp.success == false) {
    try {
      const product = await new User(fields).save()

      return product
    } catch (e) {
      console.log(e);
    }
  }
  else {
    return "User ID already exist"
  }
}
async function edit(_id, change) {
  const product = await get({ _id })

  Object.keys(change).forEach(function (key) {
    product[key] = change[key]
  })

  console.log(product)
  await product.save()
  return { status: true, data: product }
  // let data = await User.find({ mail: change.mail, client_id: change.client_id })
  // let filter = data.filter((val) => product._id === val._id)

  // if (filter.length !== 0) {
  //   Object.keys(change).forEach(function (key) {
  //     product[key] = change[key]
  //   })
  //   await product.save()
  //   return { status: true, data: product }
  // } else {
  //   return { status: false }
  // }
}

async function remove(_id) {
  await User.deleteOne({ _id })
}
