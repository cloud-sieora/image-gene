const cuid = require('cuid')
const db = require('../db')

const User = db.model('live_occupencies', {
  _id: { type: String, default: cuid },
  camera_id: { type: String, required: true },
  region_id: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  count: { type: Number, required: true },
})

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  model: User
}

async function list (id) {
  const user = await User.find({region_id:id})
  return user
}


async function get (_id) {
  const product = await User.findById(_id)
  return product
}


async function create (fields) {

    let temp = await User.find({region_id:fields.region_id})
    if(temp.length == 0)
      {
      const product = await new User(fields).save()
      return product            
      }

    else
      {
        const product = await edit(temp[0]._id,fields)
         return product 
      }
  }
  


async function edit (_id, change) {
  const product = await get({ _id })

  Object.keys(change).forEach(function (key) {
    product[key] = change[key]
  })
  await product.save()
  return product
}


async function remove (_id) {
  await User.deleteOne({ _id })

}
