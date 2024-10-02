const cuid = require('cuid')
const db = require('../db')

const User = db.model('face_id_search_creation', {
    _id: { type: String, default: cuid },
    face_id: { type: String, required: true },
    search_id: { type: String, required: true },
})

module.exports = {
    get,
    list,
    create,
    edit,
    remove,
    model: User
}

async function list(id) {
    console.log(id);
    const user = await User.find({ search_id: id })
    console.log(user);
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
