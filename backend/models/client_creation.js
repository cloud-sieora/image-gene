const cuid = require('cuid')
const db = require('../db')
// const device_creation_1 = require('./device_creation')

const User = db.model('Client_Creation', {
  _id: { type: String, default: cuid },
  customer_name: { type: String, required: true },
  mobile_number: { type: String, required: true},
  mail_id: { type: String, default: "NONE"},
  password: { type: String, default: "NONE"},
  dealer_id: { type: String, required: true},
  user_type: { type: String, required: true}, //B2C, B2B,B2CH
  Active: { type: Number, default: 1 },
  created_date: { type: String, required: true},
  created_time: { type: String, required: true},
  updated_date: { type: String, required: true},
  updated_time: { type: String, required: true},
  gender: { type: String, required: true},
  status: { type: String, default: "ACTIVE"}, //CANCELLED 
  flag: { type: Number, default: 0},
  notification_id : {type : String, default : 'NONE'},
  notification_active: { type: Number, default: 1},
})

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  get2,
  //get_data_device,
  user_validate,
  //edit_device,
  // get3,
  model: User
}

async function list (id) {
  const user = await User.find({dealer_id:id})
  return user
}  



async function get (_id) {
  const product = await User.findById(_id)
  return product
}

  async function get2 (id,id1) {
    const user = await User.findOne({ dealer_id:id,mail_id:id1 })
    if(user==null)
    {
    return { success:false}
    }
    else
    {
      return { success:true,data:user}
    }
  }
  // async function get3 (id,id1) {
  //   const user = await User.findOne({ dealer_id:id,mobile_number:id1 })
  //   if(user==null)
  //   {
  //   return { success:false}
  //   }
  //   else
  //   {
  //     return { success:true,data:user}
  //   }
  // }

 
  async function user_validate (name,pass,dealer_id) {
    const user = await User.findOne({ mail_id:name,password:pass,dealer_id:dealer_id,Active:1})
    if(user==null)
    {
    return { success:false}
    }
    else
    {
      return { success:true,data:user}
    }
  } 

async function create (fields) {



    let temp = await get2(fields.dealer_id,fields.mail_id)//this is mail id value , mail id is just variable name
    if(temp.success == false)
      {
      const product = await new User(fields).save()
  
      return product            
      }

    else
      {
        return "Client ID already exist"
      }
  }
  


async function edit (_id, change) {

  console.log('callinf');
  

  const product = await get({ _id })
  Object.keys(change).forEach(function (key) {
    product[key] = change[key]
  })
  await product.save()
//   let bucket =[]
//   // console.log(change.devices)
//   if(change.devices != undefined && change.devices.length > 0 )
//   {
//     // console.log("dsk")
//   change.devices.map((a1)=>
//   {
//     bucket.push(a1.id)
//   })
//   await device_creation_1.update_device(bucket)
// }
  return product
}

// async function edit_device (change) {
//   let id = change._id

//   const product = await get( id )

//   Object.keys(change).forEach(function (key) {
//     product[key] = change[key]
//   })
//   await product.save()
//   return product
// }


async function remove (_id) {
  await User.deleteOne({ _id })

}



// async function get_data_device (value) {
//   const user = await User.find({ })
// let bucket =[]
//   user.map((a1)=> a1.devices.map((a2)=>
//   {
//     if(a2.id == value)
//     {
//       bucket.push(a1)
//     }

//   }))

  

//   return bucket
// }


