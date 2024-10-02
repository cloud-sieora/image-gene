const cuid = require('cuid')
const db = require('../db')
const cameras = require('./camera_creation')

// const AWS = require('aws-sdk');
// const fs = require('fs');


const User = db.model('vehicle_tag_creation', {
    _id: { type: String, default: cuid },
    tag_name: { type: String, required: true },
    user_id: { type: String, required: true },
    tag_enable: { type: Boolean, required: true, default: false },
    first: {
        time: { type: String, required: true },
        rate: { type: String, required: true }
    },
    next: {
        time: { type: String, required: true },
        rate: { type: String, required: true }
    },
})

module.exports = {
    get,
    list,
    create,
    edit,
    remove,
    get2,
    list_user_id,
    listbyall_id,
    list_tag_name,
    add_new_column,
    list_enable_tag,
    model: User
}

async function add_new_column() {
    const user = await User.updateMany({}, { $set: { "tags": [] } })
    return user
}

async function list() {
    const user = await User.find({})
    return user
}

async function list_enable_tag(user_id) {
    const user = await User.find({ user_id: user_id, tag_enable: true })
    return user
}

async function list_tag_name(user_id, name) {
    const user = await User.findOne({ user_id: user_id, tag_name: name })
    return user
}

async function list_user_id(id) {
    const user = await User.find({ user_id: id })
    return user
}


async function listbyall_id(tag_id) {
    const id = await get(tag_id)
    const product = await cameras.listbyall_id(id.tags)

    return product
}

async function get(_id) {
    const product = await User.findById(_id)
    return product
}

async function get2(id, user_id) {
    const user = await User.findOne({ $and: [{ tag_name: id }, { user_id: user_id }] })
    if (user == null) {
        return { success: false }
    }
    else {
        return { success: true, data: user }
    }
}


async function create(fields) {



    let temp = await get2(fields.tag_name, fields.user_id)
    if (temp.success == false) {
        const product = await new User(fields).save()

        return { success: true, data: product }
    }

    else {
        return "tag already exist"
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





