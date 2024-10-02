const cuid = require('cuid')
const db = require('../db')
const cameras = require('./camera_creation')

// const AWS = require('aws-sdk');
// const fs = require('fs');


const User = db.model('Tag', {
  _id: { type: String, default: cuid },
  tag_name: { type: String, required: true },
  user_id: { type: String, required: true },
  tags: { type: Array, default: [] },
})

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  get2,
  listbyall_id,
  list_user_id,
  add_new_column,

  model: User
}

async function add_new_column() {
  const user = await User.updateMany({}, { $set: { "tags": [] } })
  return user
}

async function list() {
  const user = await User.find({})
  return user
}

async function list_user_id(id) {
  const user = await User.find({ user_id: id })
  return user
}




async function get(_id) {
  const product = await User.findById(_id)
  return product
}

async function get2(id, user_id) {
  const user = await User.findOne({ $and: [{ tag_name: id }, { user_id: user_id }] })
  if (user == null) {
    return { success: false }
  }
  else {
    return { success: true, data: user }
  }
}


async function create(fields) {



  let temp = await get2(fields.tag_name, fields.user_id)
  if (temp.success == false) {
    const product = await new User(fields).save()

    return product
  }

  else {
    return "tag already exist"
  }
}

async function listbyall_id(tag_id) {
  const id = await get(tag_id)
  const product = await cameras.listbyall_id(id.tags)

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
  const product = await listbyall_id(_id)

  product.map(async (val) => {
    let tags_id = []

    val.camera_tags.map((value) => {
      if (value.id !== _id) {
        tags_id.push(value)
      }
    })

    val.camera_tags = tags_id
    await cameras.edit(val._id, val)

  })
  await User.deleteOne({ _id })
  return true

}





