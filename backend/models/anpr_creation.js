const cuid = require('cuid')
const db = require('../db')
const moment = require('moment')

const User = db.model('npr_creation', {
    _id: { type: String, default: cuid },
    type: { type: String, required: true },
    model: { type: String, required: true },
    plate_number: { type: String, required: true },
    color: { type: String, required: true },
    site_id: { type: String, required: true },
    camera_id: { type: String, required: true },
    client_id: { type: String, required: true },
    time: { type: String, required: true },
    image_url: { type: String, default: 'NONE' },
    plate_url: { type: String, default: 'NONE' },
    date: { type: String, required: true },
})

module.exports = {
    get,
    list,
    create,
    edit,
    remove,
    add_new_column,
    remove_new_column,
    list_by_camera_id_date_time,
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
    const user = await User.find({})
    return user
}

async function list_by_camera_id_date_time(id, startDate, endDate, startTime, endTime) {
    console.log(id, startDate, endDate, startTime, endTime)
    const user = await User.find({ camera_id: id, date: { $gte: startDate, $lte: endDate }, time: { $gte: startTime, $lte: endTime } })
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
    return { status: true, data: product }
}


async function remove(_id) {
    await User.deleteOne({ _id })

} 
