const cuid = require('cuid')
const db = require('../db')
const plan = require('./plans')
const subscription = require('./subscription')
const Device2 = require('./device_creation')
const moment = require('moment')

const User = db.model('Camera_creation', {
  _id: { type: String, default: cuid },
  device_id: { type: String, required: true },
  camera_id: { type: String, required: true },
  dealer_id: { type: String, required: true },
  user_id: { type: String, required: true },
  clientt_id: { type: String, default: 'None' },
  client_admin_id: { type: String, default: 'None' },
  site_admin_id: { type: String, default: 'None' },
  site_id: { type: String, required: true },
  camera_gereral_name: { type: String, required: true },
  from: { type: String, default: "12:00" },
  to: { type: String, default: "12:00" },
  camera_tags: { type: Array, default: [] },
  camera_groups: { type: Array, default: [] },
  camera_username: { type: String, required: true },
  password: { type: String, required: true },
  camera_url: { type: String, default: "NONE" },
  channel: { type: String, default: "NONE" },
  vendor: { type: String, default: "NONE" },
  type: { type: String, default: "NONE" },
  created_date: { type: String, default: "NONE" },
  updated_date: { type: String, default: "NONE" },
  created_time: { type: String, default: "NONE" },
  updated_time: { type: String, default: "NONE" },
  notification_alert: { type: String, default: '' },
  analytics_alert: { type: Number, default: 0 },
  cloud_recording: { type: Number, default: 0 },
  recording_mode: { type: Number, default: 0 },
  ip_address: { type: String, default: 'NONE' },
  image_uri: { type: String, default: 'NONE' },
  stream_id: { type: String, default: 'NONE' },
  last_active: { type: String, default: 'NONE' },
  last_active_date: { type: String, default: 'NONE' },
  live_uri: { type: String, default: 'NONE' },
  image_edited: [
    {
      name: { type: String, default: 'None' },
      direction: { type: String, default: 'LeftToRight' },
      sequence: { type: String, default: 'In' },
      id: { type: Number, default: Date.now() },
      url: { type: String, default: 'NONE' },
      from_time: { type: String, default: '00:00' },
      to_time: { type: String, default: '23:59' },
      type: { type: String, default: 'Intrution' },
      class: { type: String, default: 'People' },
      threshold: { type: Number, default: 0 },
    }
  ],
  image_edited_people: [
    {
      name: { type: String, default: 'None' },
      direction: { type: String, default: 'None' },
      sequence: { type: String, default: 'None' },
      id: { type: Number, default: Date.now() },
      url: { type: String, default: 'NONE' },
      from_time: { type: String, default: '00:00' },
      to_time: { type: String, default: '23:59' },
      type: { type: String, default: 'Intrution' },
      class: { type: String, default: 'People' },
      threshold: { type: Number, default: 0 },
    }
  ],
  image_edited_vehicle: [
    {
      name: { type: String, default: 'None' },
      direction: { type: String, default: 'None' },
      sequence: { type: String, default: 'None' },
      id: { type: Number, default: Date.now() },
      url: { type: String, default: 'NONE' },
      from_time: { type: String, default: '00:00' },
      to_time: { type: String, default: '23:59' },
      type: { type: String, default: 'Intrution' },
      class: { type: String, default: 'People' },
      threshold: { type: Number, default: 0 },
    }
  ],
  image_edited_face: [
    {
      name: { type: String, default: 'None' },
      direction: { type: String, default: 'None' },
      sequence: { type: String, default: 'None' },
      id: { type: Number, default: Date.now() },
      url: { type: String, default: 'NONE' },
      from_time: { type: String, default: '00:00' },
      to_time: { type: String, default: '23:59' },
      type: { type: String, default: 'Intrution' },
      class: { type: String, default: 'People' },
      threshold: { type: Number, default: 0 },
    }
  ],
  image_edited_anpr: [
    {
      name: { type: String, default: 'None' },
      direction: { type: String, default: 'None' },
      sequence: { type: String, default: 'None' },
      id: { type: Number, default: Date.now() },
      url: { type: String, default: 'NONE' },
      from_time: { type: String, default: '00:00' },
      to_time: { type: String, default: '23:59' },
      type: { type: String, default: 'Intrution' },
      class: { type: String, default: 'People' },
      threshold: { type: Number, default: 0 },
    }
  ],
  people_direction: { type: String, default: 'NONE' },

  intrusion_alert: { type: Number, default: 0 },
  crowd_alert: { type: Number, default: 0 },
  loitering_alert: { type: Number, default: 0 },
  smoke_alert: { type: Number, default: 0 },
  fire_alert: { type: Number, default: 0 },
  ppe_alert: { type: Number, default: 0 },
  intrusion_type: { type: Object, default: { people: 0, vehicle: 0, animal: 0 } },
  loitering_type: { type: Array, default: { people: 0, vehicle: 0, animal: 0, people_threshold: 30, vehicle_threshold: 30, animal_threshold: 30 } },
  crowd_threshold: { type: Number, default: 0 },

  vehicle_direction: { type: String, default: 'NONE' },
  people_in_out: { type: String, default: 'NONE' },
  vehicle_in_out: { type: String, default: 'NONE' },
  mask: { type: String, default: 'NONE' },
  main_type: { type: String, default: 'NONE' },
  overall_count: { type: String, default: 'NONE' },
  Active: { type: Number, default: 1 },
  camera_mp: { type: Number, default: 2 },
  camera_option: { type: Object, default: { alert: 0, analytics: 0, cloud: 0, local: 0, face_dedaction: 0, live_stream: 0, motion: 0, live: 0, vehicle_analytics: 0, people_analytics: 0 } },
  subscribe_id: { type: String, default: 'NONE' },
  plan_start_date: { type: String, default: 'NONE' },
  plan_start_time: { type: String, default: 'NONE' },
  plan_end_date: { type: String, default: 'NONE' },
  plan_end_time: { type: String, default: 'NONE' },
  publish_mode: { type: Number, default: 1 },
  motion_type : {type : String, default: 'motion_end' },
})

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  add_new_column,
  remove_new_column,
  device_validate,
  update_device,
  edit_device,
  get2,
  list_camera_user_id,
  list_camer_device_id,
  listbyall_id,
  list_by_client_id,
  list_by_client_admin_id,
  list_by_site_admin_id,
  list_by_user_id,
  list_camera_id,
  list_camera_date_time,
  list_camera_device_id,
  model: User
}

async function add_new_column() {
  const user = await User.updateMany({}, {
    $set: {
      publish_mode: 0
    }
  })
  return user
}
async function remove_new_column() {
  const user = await User.updateMany({}, { $unset: { "currentcy": 1 } })
  return user
}
async function list(id) {
  // let data = await Device2.list_slave_device_id(id)
  // let bucket =[]
  // for(i=0;i<=data.length-1;i++)
  // {
  //   const user = await User.find({"device_id":data[i].device_id})
  //   bucket.push(user)
  // }
  const user = await User.find({ "site_id": id })
  return user
}

async function list_camer_device_id(id) {
  const user = await User.find({ "device_id": id })
  const new_arr = []
  for (let index = 0; index < user.length; index++) {
    let data = await plan.get(user[index].plan_id)
    new_arr.push({ ...user[index]._doc, plan_details: data })
  }
  return new_arr
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

async function list_camera_user_id(id) {
  const user = await User.find({ user_id: id })
  return user
}

async function list_camera_device_id(id) {
  const user = await User.find({ device_id: id })
  return user
}

async function list_camera_date_time(id, sub_id, startDate, endDate, startTime, endTime) {
  const user = await User.find({ clientt_id: id, subscribe_id: sub_id, created_date: { $gte: startDate, $lte: endDate } })
  return user
}

async function list_online_tag_group(online, user_id) {
  const user = await list_camera_user_id(user_id)

  let tag = []
  let group = []
  let camera = []
  if (online === 'true') {
    user.map((val) => {
      if (val.Active === 1) {
        camera.push(val)
        if (tag.length !== 0) {
          for (let index = 0; index < tag.length; index++) {
            let flag = true
            let obj = {}
            for (let index1 = 0; index1 < val.camera_tags.length; index1++) {
              if (tag[index].id === val.camera_tags[index1].id) {
                flag = true
                tag[index].count = tag[index].count + 1
                break
              } else {
                flag = false
                obj = { name: val.camera_tags[index1].name, id: val.camera_tags[index1].id, count: 1 }
              }
            }

            if (flag === false) {
              tag.push(obj)
            }

          }

        } else {
          val.camera_tags.map((tag_info) => {
            tag.push({ name: tag_info.name, id: tag_info.id, count: 1 })
          })
        }

        if (group.length !== 0) {
          for (let index = 0; index < group.length; index++) {
            let flag = true
            let obj = {}
            for (let index1 = 0; index1 < val.camera_group.length; index1++) {
              if (group[index].id === val.camera_group[index1].id) {
                flag = true
                group[index].count = group[index].count + 1
                break
              } else {
                flag = false
                obj = { name: val.camera_group[index1].name, id: val.camera_group[index1].id, count: 1 }
              }
            }

            if (flag === false) {
              group.push(obj)
            }

          }

        } else {
          val.camera_group.map((tag_info) => {
            group.push({ name: tag_info.name, id: tag_info.id, count: 1 })
          })
        }
      }
    })
  }
  return { camera: camera, tag: tag, group: group }
}

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

async function device_validate(name) {
  const user = await User.findOne({ device_id: name, Active: 1 })
  // console.log(user)
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
  const user = await User.findOne({ camera_id: id })
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
  let sub = await subscription.list_date_time(fields.clientt_id)
  console.log(sub);
  if (sub.success) {
    fields.camera_id = Date.now()
    const product = await new User(fields).save()
    return product
  } else {
    return 'no more plans'
  }
  // const camera = await list_by_client_id(fields.clientt_id)

  // if (camera.length < 5) {
  //   const product = await new User(fields).save()
  //   return product
  // } else {
  //   return 'reached more then 5'
  // }

}

async function listbyall_id(id) {

  let value = []
  id.map((val) => {
    value.push(String(val))
  })

  const product = await User.find({ _id: { $in: value } })

  return product
}

async function list_camera_id(id) {

  let value = []
  id.map((val) => {
    value.push(String(val))
  })

  const product = await User.find({ _id: { $in: value } })

  return product
}


async function edit(_id, change) {
  const product = await get({ _id })
  Object.keys(change).forEach(function (key) {
    product[key] = change[key]
  })

  await product.save()
  return product
}

async function remove(_id) {
  await User.deleteOne({ _id })
}
