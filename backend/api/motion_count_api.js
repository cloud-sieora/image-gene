const Site = require('../models/motion_count')
const autoCatch = require('../lib/auto-catch')

module.exports = autoCatch({
    getuserbyid,
    listProducts,
    createProduct,
    editProduct,
    deleteProduct,
    get_camera_id1,
    get_camera_vehicle,
    add_new_column,
    remove_new_column,
    get_heat_map,
    get_motion_count_raw_data
})

async function add_new_column(req, res, next) {
    const products1 = await Site.add_new_column()
    res.json(products1)
  }
  async function remove_new_column(req, res, next) {
    const products1 = await Site.remove_new_column()
    res.json(products1)
  }

async function getuserbyid(req, res, next) {
    // if (!req.isAdmin) return forbidden(next)
    const { id } = req.params
    const user = await Site.get(id)
    if (!user) return next()
    res.json(user)
}

async function listProducts(req, res, next) {
    const products1 = await Site.list()
    res.json(products1)
}

async function get_heat_map(req, res, next) {
    const products1 = await Site.get_heat_map(req.body.region_id, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time,)
    res.json(products1)
}

async function get_camera_id1(req, res, next) {
    const products1 = await Site.get_camera_id1(req.body.camera_id, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time, req.body.option, req.body.flag, req.body.flag_count_arr)
    res.json(products1)
}

async function get_motion_count_raw_data(req, res, next) {
    const products1 = await Site.get_motion_count_raw_data(req.body.camera_id, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time)
    res.json(products1)
}

async function get_camera_vehicle(req, res, next) {
    const products1 = await Site.get_camera_vehicle(req.body.camera_id, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time, req.body.option, req.body.flag, req.body.flag_count_arr)
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
