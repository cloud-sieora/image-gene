const cuid = require('cuid')
const db = require('../db')
const moment = require('moment')

const User = db.model('heat_map', {
    _id: { type: String, default: cuid },
    camera_id: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    image_uri: { type: String, required: true },
    top_data: { type: Array, required: true },
    day_type: { type: String, required: true, default: 'day' },
})

module.exports = {
    get,
    list,
    create,
    edit,
    remove,
    list_heat_map,
    model: User
}

async function list(id) {
    const user = await User.find({ camera_id: id })
    return user
}

async function list_heat_map(id, startDate, endDate, day_type) {
    console.log(id, startDate, endDate, day_type)
    if (day_type == 'day') {
        const user = await User.find({ camera_id: id, date: { $gte: startDate, $lte: endDate }, day_type: day_type })
        return user
    } else if ('weekly') {
        const user = await User.find({ camera_id: id, date: startDate, day_type: day_type })
        return user
    } else if ('monthly') {
        const startOfMonth = moment(startDate, "YYYY-MM").startOf('month').toDate();
        const endOfMonth = moment(endDate, "YYYY-MM").endOf('month').toDate();
        const user = await User.find({ camera_id: id, date: { $gte: moment(startOfMonth).format('YYYY-MM-DD'), $lte: moment(endOfMonth).format('YYYY-MM-DD') }, day_type: day_type })
        return user
    }
}


async function get(_id) {
    const product = await User.findById(_id)
    return product
}


async function create(fields) {
    const product = await new User(fields).save()
    return product
}



async function edit(_id, change) {
    const product = await get({ _id })

    Object.keys(change).forEach(function (key) {
        product[key] = change[key]
    })
    await product.save()
    return product
}


async function remove(_id) {
    await User.deleteOne({ _id })

}
