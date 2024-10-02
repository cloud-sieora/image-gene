const cuid = require('cuid')
const db = require('../db')

const User = db.model('vehicle_database_creation', {
    _id: { type: String, default: cuid },
    plate_number: { type: String, required: true },
    client_id: { type: String, required: true },
    tag_id: { type: String, required: true },
})

module.exports = {
    get,
    list,
    create,
    edit,
    remove,
    list_client_id,
    list_tag_id,
    model: User
}

async function list(id) {
    const user = await User.find()
    return user
}

async function list_client_id(id) {
    const user = await User.find({ client_id: id })
    return user
}

async function list_tag_id(id) {
    const user = await User.find({ tag_id: id })
    return user
}


async function get(_id) {
    const product = await User.findById(_id)
    return product
}

async function create(fields) {

    const user = await User.findOne({ plate_number: fields.plate_number })

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
