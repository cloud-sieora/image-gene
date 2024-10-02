const cuid = require('cuid')
const db = require('../db')
// const device_creation_1 = require('./device_creation')

const User = db.model("holiday_management", {

    user_id: {
        type: String,
        required: true
    },

    data: [
        {

            date: {
                type: String,
                required: false
            },
            holiday_name: {
                type: String,
                required: false
            },
            description: {
                type: String,
                required: false
            }

        }


    ]

})

module.exports = {
    get,
    list,
    create,
    edit,
    remove,
    list_by_client_id,
    model: User
}

async function list() {
    const user = await User.find({})
    return user
}

async function list_by_client_id(id) {
    const user = await User.findOne({ user_id: id })
    return user
}

async function get(_id) {
    const product = await User.findById(_id)
    return product
}

async function create(fields) {
    let exist_data = await list_by_client_id(fields.user_id)

    if (exist_data == null) {
        const product = await new User({ user_id: fields.user_id, data: [{ date: fields.date, holiday_name: fields.holiday_name, description: fields.description }] }).save()
        return product
    } else {
        exist_data.data.push({ date: fields.date, holiday_name: fields.holiday_name, description: fields.description })
        let edit_data = await edit(fields.user_id, exist_data)
        return edit_data
    }
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
