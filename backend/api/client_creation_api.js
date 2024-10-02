const Client = require('../models/client_creation')
const autoCatch = require('../lib/auto-catch')

module.exports = autoCatch({
  getuserbyid,
  listProducts,
  createProduct,
  editProduct,
  deleteProduct,
  // get_data_device,
  user_validate,
  // edit_device,
  // get_device_user_data,
})

async function getuserbyid (req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  console.log('coming')
  const { id } = req.params
  console.log('req.body', id)
  const user = await Client.get(id)
  console.log('user data', user)
  if (!user) return next()
  res.json(user)
}
async function user_validate (req, res, next) {
  const user = await Client.user_validate(req.body.username,req.body.password,req.body.dealer_id)
  res.json(user)
}

async function listProducts (req, res, next) {
  const products1 = await Client.list(req.body.dealer_id)
  res.json(products1)
}


async function createProduct (req, res, next) {
  const user = await Client.create(req.body)
  res.json(user)
}

// async function edit_device (req, res, next) {
//   const change = req.body
//   const user = await Client.edit_device(change)
//   res.json(user)
// }
async function editProduct (req, res, next) {
  const change = req.body
  const user = await Client.edit(req.params.id, change)
  res.json(user)
}


async function deleteProduct (req, res, next) {
  // if (!req.isAdmin) return forbidden(next)
  await Client.remove(req.params.id)
  res.json({ success: true })
}

function forbidden (next) {
  const err = new Error('Forbidden')
  err.statusCode = 403
  return next(err)
}

// async function get_data_device (req, res, next) {
//   // if (!req.isAdmin) return forbidden(next)

//   const  group  = req.body.device_id

//   const end_user = await Client.get_data_device(group)
//   res.json(end_user)
// }

// async function get_device_user_data (req, res, next) {
//   // if (!req.isAdmin) return forbidden(next)

//   const  id1  = req.body.dealer_id
//   const  id2  = req.body.user_id


//   const end_user = await Client.get2(id1,id2)
//   res.json(end_user)
// }


