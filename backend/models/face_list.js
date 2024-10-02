const cuid = require('cuid')
const db = require('../db')
const moment = require('moment')

const User = db.model('face_list', {
    _id: { type: String, default: cuid },
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    site_id: { type: String, required: true },
    camera_id: { type: String, required: true },
    client_id: { type: String, required: true },
    time: { type: String, required: true },
    image_url: { type: String, default: 'NONE' },
    list_type: { type: String, default: 'NONE' },
    date: { type: String, required: true },
})

module.exports = {
    get,
    list,
    create,
    edit,
    remove,
    get2,
    list_by_user_id,
    list_by_site_id,
    list_by_user_id_date,
    list_by_site_id_date,
    list_by_user_id_date,
    list_by_user_id_date_time,
    add_new_column,
    remove_new_column,
    list_by_user_site_date_time,
    model: User
}

async function add_new_column() {
    const user = await User.updateMany({}, { $set: { "in_image": 'NONE', "out_image": 'NONE' } })
    return user
}
async function remove_new_column() {
    const user = await User.updateMany({}, { $unset: { "currentcy": 1 } })
    return user
}

async function list(id) {
    const user = await User.find({ user_id: id })
    return user
}

async function list_by_user_id(id) {
    const user = await User.find({ user_id: id })
    return user
}

async function list_by_user_id_date(id, date) {
    const user = await User.find({ user_id: id, date: date })
    return user
}

async function list_by_site_id(id) {
    const user = await User.find({ site_id: id })
    return user
}

async function list_by_site_id_date(id, startDate, endDate) {
    const user = await User.find({ site_id: id, date: { $gte: startDate, $lte: endDate } })
    return user
}

async function list_by_user_id_date(id, startDate, endDate) {
    const user = await User.find({ site_id: id, date: { $gte: startDate, $lte: endDate } })
    return user
}

async function list_by_user_site_date_time(id, site_id, startDate, endDate) {
    console.log(id, site_id, startDate, endDate)
    const user = await User.find({ user_id: id, site_id: site_id, date: { $gte: startDate, $lte: endDate } })
    return user
}

async function list_by_user_id_date_time(id, startDate, endDate) {
    const user = await User.find({ user_id: id, date: { $gte: startDate, $lte: endDate } })
    return user
}



async function get(_id) {
    const product = await User.findById(_id)
    return product
}

async function get2(id2) {
    const user = await User.find({ site_name: id2 })
    if (user.length == 0) {
        return { success: false }
    }
    else {
        return { success: true, data: user }
    }
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
    return { status: true, data: product }
}


async function remove(_id) {
    await User.deleteOne({ _id })

} 
