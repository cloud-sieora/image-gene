const Site = require('../models/attendance_list')
const autoCatch = require('../lib/auto-catch')

module.exports = autoCatch({
    getuserbyid,
    listProducts,
    createProduct,
    editProduct,
    deleteProduct,
    list_by_user_id,
    list_by_site_id,
    list_by_user_id_date,
    list_by_site_id_date,
    list_by_user_id_date_time,
    list_by_user_id_date_time_present,
    createMobile
})

async function getuserbyid(req, res, next) {
    // if (!req.isAdmin) return forbidden(next)
    const { id } = req.params
    const user = await Site.get(id)
    if (!user) return next()
    res.json(user)
}

async function listProducts(req, res, next) {
    const products1 = await Site.list(req.body.user_id)
    res.json(products1)
}

async function list_by_user_id(req, res, next) {
    const products1 = await Site.list_by_user_id(req.body.user_id)
    res.json(products1)
}

async function list_by_user_id_date(req, res, next) {
    const products1 = await Site.list_by_user_id_date(req.body.user_id, req.body.date)
    res.json(products1)
}

async function list_by_site_id(req, res, next) {
    const products1 = await Site.list_by_site_id(req.body.site_id)
    res.json(products1)
}

async function list_by_site_id_date(req, res, next) {
    const products1 = await Site.list_by_site_id_date(req.body.site_id, req.body.start_date, req.body.end_date)
    res.json(products1)
}

async function list_by_user_id_date_time(req, res, next) {
    const products1 = await Site.list_by_user_id_date_time(req.body.user_id, req.body.start_date, req.body.end_date)
    res.json(products1)
}

async function list_by_user_id_date_time_present(req, res, next) {
    const products1 = await Site.list_by_user_id_date_time_present(req.body.user_id, req.body.start_date, req.body.end_date)
    res.json(products1)
}


async function createProduct(req, res, next) {
    const user = await Site.create(req.body)
    res.json(user)
}

async function createMobile(req, res, next) {
    const user = await Site.create_mobile(req.body)
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
