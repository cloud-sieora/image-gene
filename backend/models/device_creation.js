const cuid = require('cuid')
const db = require('../db')
const camera_api = require('./camera_creation')
const device_alert = require('./device_active')


const User = db.model('Device_creation', {
  _id: { type: String, default: cuid },
  device_id: { type: String, required: true },
  dealer_id: { type: String, required: true },
  user_id: { type: String, required: false, default: 'NONE' },
  device_name: { type: String, required: false, default: 'NONE' },
  password: { type: String, required: false, default: 'NONE' },
  site_id: { type: String, required: false, default: 'NONE' },
  created_date: { type: String, required: true },
  created_time: { type: String, required: true },
  updated_date: { type: String, required: true },
  updated_time: { type: String, required: true },
  clientt_id: { type: String, default: 'NONE' },
  client_admin_id: { type: String, default: 'NONE' },
  site_admin_id: { type: String, default: 'NONE' },
  // activation_date: { type: String, default: "NONE"},
  // expiry_date: { type: String, default: "NONE"},
  // plan_name: { type: String, default: "NONE"},
  // plan_current_price: { type: String, default: "NONE"},//per month
  // plan_updated_price: { type: String, default: "NONE"},
  // plan_updated_flag: { type: Number, default: 0},
  camera_limit: { type: Number, default: 8 },
  Active: { type: Number, default: 1 },
  device_off_alert: { type: Number, default: 0 },
  last_active: { type: String, default: 'NONE' },
  last_active_date: { type: String, default: 'NONE' },
  camera_ip: { type: Array, default: [] },
  local_ip: { type: String, default: "NONE" },
  local_alarm: { type: Number, default: 0 },
  from: { type: String, default: "12:00" },
  to: { type: String, default: "12:00" },

})

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  create_orginal,
  edit_orginal,
  remove_orginal,
  add_new_column,
  remove_new_column,
  device_validate,
  update_device,
  edit_device,
  get2,
  list_dealer,
  list_device_camera,
  user_get_device,
  list_by_client_id,
  list_by_client_admin_id,
  list_by_site_admin_id,
  list_by_user_id,
  list_by_client_id_status,
  list_by_client_admin_id_status,
  list_by_site_admin_id_status,
  list_by_user_id_status,
  list_device_site_id,
  // list_slave_device_id,
  model: User
}

async function add_new_column() {
  const user = await User.updateMany({}, { $set: { "last_active_date": 'NONE' } })
  return user
}
async function remove_new_column() {
  const user = await User.updateMany({}, { $unset: { "currentcy": 1 } })
  return user
}
async function list(id) {
  const user = await User.find({ client: id })
  return user
}
async function list_dealer(id) {
  const user = await User.find({ dealer_id: id })
  return user
}

async function list_device_site_id(id) {
  const user = await User.find({ site_id: id })
  let count = 0
  const data = []
  if (user.length !== 0) {
    for (let index = 0; index < user.length; index++) {
      let result = await edit_orginal(user[index]._id, { camera_ip: [] })
      count = count + 1
      data.push(result.data)
      if (count == user.length) {
        return data
      }
    }
  } else {
    return data
  }
}

async function list_device_camera(id) {
  const user = await User.find({ device_id: id })
  const camera = await camera_api.list_camer_device_id(id)
  console.log({ device: user, cameras: camera });
  return { device: user, cameras: camera }
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

// async function list_slave_device_id(master_id) {
//   const user = await User.find({which_master:master_id})
//   return user
// } 


async function update_device(list) {
  const user = await User.find({})
  let bucket = []
  for (i = 0; i <= list.length - 1; i++) {
    user.map((a1) => {
      if (a1.device_id == list[i]) {
        bucket.push(a1._id)
      }
    })

  }
  for (i = 0; i <= bucket.length - 1; i++) {
    await edit(bucket[i], change = { Active: 0 })
  }

  return user
}

async function user_get_device(name, user_id, device_name) {
  const user = await User.findOne({ device_id: name, Active: 1 })
  if (user == null) {
    return { success: false }
  }
  else {
    let change = { _id: user_id, device_name: device_name }
    let data = await edit_device(change)
    return { success: true, data: data }
  }
}

async function device_validate(name) {
  const user = await User.findOne({ device_id: name, Active: 1 })
  if (user == null) {
    return { success: false }
  }
  else {
    return { success: true, data: user }
  }
}


async function edit_device(change) {
  let id = change._id

  const product = await get(id)

  Object.keys(change).forEach(function (key) {
    product[key] = change[key]
  })
  await product.save()
  return product
}


async function get2(id) {
  const user = await User.findOne({ device_id: id })
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

async function list_by_client_id_status(id) {
  const user = await User.find({ clientt_id: id })
  let count = 0
  const data = []
  if (user.length !== 0) {
    for (let index = 0; index < user.length; index++) {
      let result = await edit(user[index]._id, { camera_ip: [] })
      count = count + 1
      data.push(result.data)
      if (count == user.length) {
        return data
      }
    }
  } else {
    return data
  }
}

async function list_by_client_admin_id_status(id) {
  const user = await User.find({ client_admin_id: id })
  let count = 0
  const data = []
  if (user.length !== 0) {
    for (let index = 0; index < user.length; index++) {
      let result = await edit(user[index]._id, { camera_ip: [] })
      count = count + 1
      data.push(result.data)
      if (count == user.length) {
        return data
      }
    }
  } else {
    return data
  }
}

async function list_by_site_admin_id_status(id) {
  const user = await User.find({ site_admin_id: id })
  let count = 0
  const data = []
  if (user.length !== 0) {
    for (let index = 0; index < user.length; index++) {
      let result = await edit(user[index]._id, { camera_ip: [] })
      count = count + 1
      data.push(result.data)
      if (count == user.length) {
        return data
      }
    }
  } else {
    return data
  }
}

async function list_by_user_id_status(id) {
  const user = await User.find({ user_id: id })
  let count = 0
  const data = []
  if (user.length !== 0) {
    for (let index = 0; index < user.length; index++) {
      let result = await edit(user[index]._id, { camera_ip: [] })
      count = count + 1
      data.push(result.data)
      if (count == user.length) {
        return data
      }
    }
  } else {
    return data
  }
}

async function create(fields) {

  let temp = await User.find({ device_id: fields.device_id })

  if (temp.length != 0) {
    console.log(temp[0]);

    if (temp[0].user_id == 'NONE' && temp[0].clientt_id == 'NONE' && temp[0].client_admin_id == 'NONE' && temp[0].site_admin_id == 'NONE') {
      const product = await edit_orginal(temp[0]._id, {
        user_id: fields.user_id,
        clientt_id: fields.clientt_id,
        client_admin_id: fields.client_admin_id,
        site_admin_id: fields.site_admin_id,
        device_name: fields.device_name,
        password: fields.password,
        site_id: fields.site_id,
        updated_date: fields.updated_date,
        updated_time: fields.updated_time,
        Active: fields.Active,
      })

      return product
    }else{
      return "this id already in use"
    }
  }
  else {
    return "No device"
  }
}


async function edit(_id, fields) {
  let temp = await User.find({ device_id: fields.device_id })

  if (temp.length != 0) {

    const product = await edit_orginal(temp[0]._id, {
      user_id: fields.user_id,
      clientt_id: fields.clientt_id,
      client_admin_id: fields.client_admin_id,
      site_admin_id: fields.site_admin_id,
      device_name: fields.device_name,
      password: fields.password,
      site_id: fields.site_id,
      updated_date: fields.updated_date,
      updated_time: fields.updated_time,
      Active: fields.Active,
    })

    return product
  }
  else {
    return "No device"
  }
}

async function remove(_id) {
  const product = await edit_orginal(_id, {
    user_id: "NONE",
    clientt_id: "NONE",
    client_admin_id: "NONE",
    site_admin_id: "NONE",
    device_name: "NONE",
    password: "NONE",
    site_id: "NONE",
    Active: 1,
  })

  return product
}

async function create_orginal(fields) {
  let temp = await get2(fields.device_id)
  if (temp.success == false) {
    const product = await new User(fields).save()

    return product
  }
  else {
    return "Device ID already exist"
  }
}

async function edit_orginal(_id, change) {
  const product = await get({ _id })
  Object.keys(change).forEach(function (key) {
    product[key] = change[key]
  })
  await product.save()
  return { status: true, data: product }
  // let data = await User.find({ device_id: change.device_id })
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

async function remove_orginal(_id) {
  await User.deleteOne({ _id })
}
