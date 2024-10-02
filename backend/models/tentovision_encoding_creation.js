const cuid = require('cuid')
const db = require('../db')

const User = db.model('encoding_creation', {
    _id: { type: String, default: cuid },
    user_id: { type: String, required: true },
    client_id: { type: String, required: true },
    site_id: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    encoding_data: { type: Array, required: true },
})

module.exports = {
    get,
    list,
    create,
    edit,
    remove,
    list_user_id,
    list_site_id,
    model: User
}

async function list(id) {
    const user = await User.find({ client_id: id })
    return user
}

async function list_user_id(id) {
    const user = await User.findOne({ user_id: id })
    return user
}

async function list_site_id(id) {
    const user = await User.find({ site_id: id })
    return user
}


async function get(_id) {
    const product = await User.findById(_id)
    return product
}

async function create(fields) {
    const product = await new User(fields).save()
    return { success: true, data: product }
}



async function edit(_id, change) {
    const product = await get({ _id })

    Object.keys(change).forEach(function (key) {
        product[key] = change[key]
    })
    await product.save()
    return { success: true, data: product }
}


async function remove(_id) {
    await User.deleteOne({ _id })

} 
