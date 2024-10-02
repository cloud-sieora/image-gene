const Site = require('../models/tentovision_encoding_creation')
const autoCatch = require('../lib/auto-catch')

module.exports = autoCatch({
    getuserbyid,
    listProducts,
    createProduct,
    editProduct,
    deleteProduct,
    list_user_id,
    list_site_id
})

async function getuserbyid(req, res, next) {
    // if (!req.isAdmin) return forbidden(next)
    const { id } = req.params
    const user = await Site.get(id)
    if (!user) return next()
    res.json(user)
}

async function listProducts(req, res, next) {
    const products1 = await Site.list(req.body.client_id)
    res.json(products1)
}

async function list_user_id(req, res, next) {
    const products1 = await Site.list_user_id(req.body.user_id)
    res.json(products1)
}

async function list_site_id(req, res, next) {
    const products1 = await Site.list_site_id(req.body.site_id)
    res.json(products1)
}


async function createProduct(req, res, next) {
    const user = await Site.create(req.body)
    res.json(user)
}


async function editProduct(req, res, next) {
    const change = req.body
    const user = await Site.edit(req.params.id, change)
    res.json(user)
}


async function deleteProduct(req, res, next) {
    // if (!req.isAdmin) return forbidden(next)
    await Site.remove(req.params.id)
    res.json({ success: true })
}

function forbidden(next) {
    const err = new Error('Forbidden')
    err.statusCode = 403
    return next(err)
}
