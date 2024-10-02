const cuid = require('cuid')
const db = require('../db')
// const device_creation_1 = require('./device_creation')

const User = db.model('Site_Creation', {
  _id: { type: String, default: cuid },
  site_name: { type: String, required: true },
  user_id: { type: String, required: true },
  device_id: { type: Array, default:[] },
  clientt_id: { type: String, default: 'None' },
  client_admin_id: { type: String, default: 'None' },
  site_admin_id: { type: String, default: 'None' },
  created_date: { type: String, required: true},
  created_time: { type: String, required: true},
  updated_date: { type: String, required: true},
  updated_time: { type: String, required: true},
  Active: { type: Number, default: 0},
})

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  get2,
  list_by_client_id,
  list_by_client_admin_id,
  list_by_site_admin_id,
  list_by_user_id,
  //get_data_device,
  // user_validate,
  //edit_device,
  // get3,
  model: User
}

async function list (id) {
  const user = await User.find({user_id:id})
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



async function get (_id) {
  const product = await User.findById(_id)
  return product
}

  async function get2 (clientt_id,id2) {
    const user = await User.find({clientt_id:clientt_id,site_name:id2 })
    if(user.length==0)
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

 
  // async function user_validate (name,pass) {
  //   const user = await User.findOne({ mail_id:name,password:pass,Active:1})
  //   if(user==null)
  //   {
  //   return { success:false}
  //   }
  //   else
  //   {
  //     return { success:true,data:user}
  //   }
  // } 

async function create (fields) {

    let temp = await get2(fields.clientt_id,fields.site_name)//this is mail id value , mail id is just variable name
    if(temp.success == false)
      {
      const product = await new User(fields).save()
  
      return product            
      }

    else
      {
        return "Site ID already exist"
      }
  }
  


async function edit (_id, change) {
  const product = await get({ _id })

  Object.keys(change).forEach(function (key) {
    product[key] = change[key]
  })
  await product.save()
  return { status: true, data: product }
  // let data = await User.find({ site_id: change.site_id })
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


