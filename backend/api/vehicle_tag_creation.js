const Plan = require('../models/vehicle_tag')
const autoCatch = require('../lib/auto-catch')

module.exports = autoCatch({
    getuserbyid,
    listProducts,
    createProduct,
    editProduct,
    deleteProduct,
    listbyall_id,
    listProducts_user_id,
    add_new_column
})

async function add_new_column (req, res, next) {
    const products1 = await Plan.add_new_column()
    res.json(products1)
  }

async function getuserbyid(req, res, next) {
    // if (!req.isAdmin) return forbidden(next)
    const { id } = req.params
    const user = await Plan.get(id)
    if (!user) return next()
    res.json(user)
}

async function listProducts(req, res, next) {
    const products1 = await Plan.list()
    res.json(products1)
}

async function listProducts_user_id(req, res, next) {
    const products1 = await Plan.list_user_id(req.body.user_id)
    res.json(products1)
}


async function createProduct(req, res, next) {
    const user = await Plan.create(req.body)
    res.json(user)
}

async function listbyall_id(req, res, next) {
    const user = await Plan.listbyall_id(req.body.tag_id)
    res.json(user)
}


async function editProduct(req, res, next) {
    const change = req.body
    const user = await Plan.edit(req.params.id, change)
    res.json(user)
}


async function deleteProduct(req, res, next) {
    // if (!req.isAdmin) return forbidden(next)
    await Plan.remove(req.params.id)
    res.json({ success: true })
}

function forbidden(next) {
    const err = new Error('Forbidden')
    err.statusCode = 403
    return next(err)
}

