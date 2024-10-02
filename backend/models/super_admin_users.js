const cuid = require('cuid')
const db = require('../db')



const User = db.model('Super_Admin_users', {
  _id: { type: String, default: cuid },
  username: { type: String, required: true },
  password: { type: String, required: true},
  company_name: { type: String, required: true},
  contact_number: { type: String, required: true},
  email: { type: String, required: true},

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
  model: User
}

async function add_new_column () {
  const user = await User.updateMany({}, {$set:{"plan_type": "ADVANCED","super_admin_id":"1"}})
  return user
}  
async function remove_new_column () {
  const user = await User.updateMany({}, {$unset:{"currentcy": 1}})
  return user
}  
async function list () {
  const user = await User.find({})
  return user
} 
async function user_validate (name,pass) {
  const user = await User.findOne({ username:name,password:pass})
  console.log(user)
  if(user==null)
  {
  return { success:false}
  }
  else
  {
    return { success:true,data:user}
  }
} 

async function get_common_details (name) {
  const user = await User.findOne({ username:name})
  console.log(user)
  if(user==null)
  {
  return { success:false}
  }
  else
  {
    return { success:true,data:user}
  }
}  

async function get2 (id) {
  const user = await User.findOne({  username:id })
  if(user==null)
  {
  return { success:false}
  }
  else
  {
    return { success:true,data:user}
  }
}




async function get (_id) {
  const product = await User.findById(_id)
  return product
}

async function create (fields) {

  let temp = await get2(fields.username)
  
  if(temp.success == false)
    {
    const product = await new User(fields).save()

    return product            
    }
  else
    {
      return "admin ID already exist"
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
