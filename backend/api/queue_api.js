const Site = require('../models/queue')
const autoCatch = require('../lib/auto-catch')

module.exports = autoCatch({
    getuserbyid,
    listProducts,
    createProduct,
    editProduct,
    deleteProduct,
    get_camera_id1,
    list_all
})

async function getuserbyid(req, res, next) {
    // if (!req.isAdmin) return forbidden(next)
    const { id } = req.params
    const user = await Site.get(id)
    if (!user) return next()
    res.json(user)
}

async function listProducts(req, res, next) {
    const products1 = await Site.list(req.body.region_id)
    res.json(products1)
}

async function list_all(req, res, next) {
    const products1 = await Site.list_all(req.body.region_id)
    res.json(products1)
}


async function createProduct(req, res, next) {
    const user = await Site.create(req.body)
    res.json(user)
}
async function get_camera_id1(req, res, next) {
    const products1 = await Site.get_camera_id1(req.body.camera_id, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time, req.body.option, req.body.flag, req.body.flag_count_arr)
    res.json(products1)
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