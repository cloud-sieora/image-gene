const Site = require('../models/vehicle_parking_creation')
const autoCatch = require('../lib/auto-catch')

module.exports = autoCatch({
    getuserbyid,
    listProducts,
    createProduct,
    editProduct,
    deleteProduct,
    list_vehicle_in_out,
    list_vehicle_payment_status,
    list_vehicle_alert
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

async function list_vehicle_in_out(req, res, next) {
    const products1 = await Site.list_vehicle_in_out(req.body.client_id, req.body.site_id, req.body.start_date, req.body.end_date, req.body.type, req.body.page)
    res.json(products1)
}

async function list_vehicle_payment_status(req, res, next) {
    const products1 = await Site.list_vehicle_payment_status(req.body.client_id, req.body.site_id, req.body.start_date, req.body.end_date, req.body.page)
    res.json(products1)
}

async function list_vehicle_alert(req, res, next) {
    const products1 = await Site.list_vehicle_alert(req.body.client_id, req.body.site_id, req.body.start_date, req.body.end_date, req.body.page)
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
