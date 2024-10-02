const cuid = require('cuid')
const db = require('../db')

// const AWS = require('aws-sdk');
// const fs = require('fs');


const User = db.model('Device_Active', {
    _id: { type: String, default: cuid },
    device_id: { type: String, required: true, },
    Active: { type: Number, default: 0 },

})

module.exports = {
    get,
    list,
    create,
    edit,
    remove,
    get2,
    get_device_id,

    model: User
}

async function list() {
    const user = await User.find({})
    return user
}

async function get_device_id(plan) {
    const user = await User.find({ device_id: device_id })
    return user
}




async function get(_id) {
    const product = await User.findById(_id)
    return product
}

async function get2(id) {
    const user = await User.findOne({ plan_name: id })
    if (user == null) {
        return { success: false }
    }
    else {
        return { success: true, data: user }
    }
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





