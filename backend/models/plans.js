const cuid = require('cuid')
const db = require('../db')
const device_creation_1 = require('./device_creation')

// const AWS = require('aws-sdk');
// const fs = require('fs');


const User = db.model('Plans', {
  _id: { type: String, default: cuid },
  plan_name: { type: String, required: true },
  price_yearly: { type: Number, required: true },
  price_monthly: { type: Number, required: true },
  plan_duration_days: { type: Number, required: true },
  // price_one_time:{ type: Number, required: true},// 3 years ku free after than AMC per year. 
  product_warranty: { type: Number, required: true },
  AMC: { type: Number, default: 0 },
  Active: { type: Number, default: 1 },
  plan_revision_details: { type: Object, default: [] },
  plan_details: { type: Object, default: {} },
  dealer_discount: { type: Array, default: [{ day: '7day', discount: 5 }] },
  empty: { type: String, default: "NONE" },
  prize: { type: Object, default: { motion: [{ day: '7day', rate: 80 }], live: [{ day: '7day', rate: 80 }] } },
  discount: { type: Array, default: [] },
  ai_price: { type: Object, default: { client: 0, dealer: 0 } },
  Active: { type: Number, default: 1 },
})

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  get2,
  get_plan,
  add_new_column,

  model: User
}

async function add_new_column() {
  const user = await User.updateMany({}, { $set: { "ai_price": { client: 0, dealer: 0 } } })
  return user
}

async function list() {
  const user = await User.find({})
  return user
}

async function get_plan(plan) {
  const user = await User.findOne({ plan_name: plan })
  return user
}




async function get(_id) {
  const product = await User.findById(_id)
  return product
}

async function get2(id) {
  const user = await User.findOne({ plan_name: id })
  if (user == null) {
    return { success: false }
  }
  else {
    return { success: true, data: user }
  }
}


async function create(fields) {



  let temp = await get2(fields.plan_name)
  if (temp.success == false) {
    const product = await new User(fields).save()

    return product
  }

  else {
    return "plan already exist"
  }
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





