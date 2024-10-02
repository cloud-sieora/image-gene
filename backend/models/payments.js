const cuid = require('cuid')
const db = require('../db')
 

const User = db.model('Payments', {
  _id: { type: String, default: cuid },  
  plan_name:{ type: String, required: true},
  payment_mode:{ type: String, required: true},
  payment_gateway:{ type: String, required: true},
  amount:{ type: Number, required: true},
  start_date:{ type: String, required: true},
  start_time:{ type: String, required: true},
  end_date:{ type: String, required: true},
  end_time:{ type: String, required: true},
  status:{ type: String, required: true},//COMPLETED,REFUNDED,PENDING
  user_id:{ type: String, required: true},
  dealer_id:{ type: String, required: true},
  payment_gateway_id:{ type: String, default:'NONE'},
})

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  get_payment_user,
  get_payment_all,
  get_payment_dealer,
  model: User
}

async function list () {
  const user = await User.find({})
  return user
}  

async function get_payment_user (id,date1,date2,status1) {
  const user = await User.find({user_id:id,date:{ $gte: date1, $lte: date2},status:status1})
  return user
}  

async function get_payment_all (date1,date2,status1) {
  const user = await User.find({date:{ $gte: date1, $lte: date2},status:status1})
  return user
}  

async function get_payment_dealer (id,date1,date2,status1) {
  const user = await User.find({dealer_id:id,date:{ $gte: date1, $lte: date2},status:status1})
  return user
}




async function get (_id) {
  const product = await User.findById(_id)
  return product
}



async function create (fields) {


      const product = await new User(fields).save()
  
      return product            
  
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




  
