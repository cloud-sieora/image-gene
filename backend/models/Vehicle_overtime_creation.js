const cuid = require('cuid')
const db = require('../db')

const User = db.model('vehicle_overtime_creation', {
    _id: { type: String, default: cuid },
    time: { type: String, required: true },
    client_id: { type: String, required: true },
    site_id: { type: String, required: true },
    tag_enable: { type: Boolean, required: true, default: false },
    tags: { type: Array, required: true },
})

module.exports = {
    get,
    list,
    create,
    edit,
    remove,
    list_site_id,
    model: User
}

async function list(id) {
    console.log(id);
    const user = await User.find({ client_id: id })
    console.log(user);
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

    const user = await User.findOne({ site_id: fields.site_id })

    if (user == null) {
        const product = await new User(fields).save()
        return { success: true, data: product }
    } else {
        return { success: false }
    }
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
