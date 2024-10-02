const User_admin = require('../models/enrollment_user_creation')
const autoCatch = require('../lib/auto-catch')

module.exports = autoCatch({
    getuserbyid,
    getuserbyid_static,
    listProducts,
    createProduct,
    editProduct,
    deleteProduct,
    add_new_column,
    remove_new_column,
    list_by_user_id,
    list_by_site_id,
    list_user_id,
    editProduct_orginal,
    update_embeding_count,
    list_client_id,

})

async function add_new_column(req, res, next) {
    const products1 = await User_admin.add_new_column()
    res.json(products1)
}
async function remove_new_column(req, res, next) {
    const products1 = await User_admin.remove_new_column()
    res.json(products1)
}

async function getuserbyid(req, res, next) {
    const { id } = req.params
    const user = await User_admin.get(id)
    if (!user) return next()
    res.json(user)
}

async function getuserbyid_static(id) {
    const user = await User_admin.get(id)
    return user
}

async function listProducts(req, res, next) {
    const products1 = await User_admin.list()
    res.json(products1)
}

async function list_by_site_id(req, res, next) {
    const products1 = await User_admin.list_by_site_id(req.body.site_id)
    res.json(products1)
}

async function list_user_id(req, res, next) {
    const products1 = await User_admin.list_user_id(req.body.client_id, req.body.user_id)
    res.json(products1)
}

async function list_client_id(req, res, next) {
    const products1 = await User_admin.list_client_id(req.body.client_id)
    res.json(products1)
}

async function update_embeding_count(req, res, next) {
    const products1 = await User_admin.update_embeding_count(req.body.emp_id, req.body.embedding_count )
    res.json(products1)
}

async function list_by_user_id(req, res, next) {
    const products1 = await User_admin.list_by_user_id(req.body.user_id)
    res.json(products1)
}


async function createProduct(req, res, next) {
    const user = await User_admin.create(req.body)
    res.json(user)
}

async function editProduct_orginal(req, res, next) {
    // if (!req.isAdmin) return forbidden(next)
    const change = req.body
    const user = await User_admin.edit_orginal(req.params.id, change)
    res.json(user)
}

async function editProduct(req, res, next) {
    // if (!req.isAdmin) return forbidden(next)
    const change = req.body
    const user = await User_admin.edit(req.params.id, change)
    res.json(user)
}

async function deleteProduct(req, res, next) {
    // if (!req.isAdmin) return forbidden(next)
    await User_admin.remove(req.params.id)
    res.json({ success: true })
}

function forbidden(next) {
    const err = new Error('Forbidden')
    err.statusCode = 403
    return next(err)
}
