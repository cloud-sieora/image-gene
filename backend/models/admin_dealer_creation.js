const cuid = require('cuid')
const db = require('../db')


const User = db.model('admin_dealer_creation', {
    _id: { type: String, default: cuid },
    company_name: { type: String, required: true },
    password: { type: String, required: true },
    User_name: { type: String, required: true },
    mobile_number: { type: String, required: true },
    mail: { type: String, required: true },
    admin_id: { type: String, required: true },
    user_type: { type: String, required: true },
    created_date: { type: String, required: true },
    updated_date: { type: String, required: true },
    created_time: { type: String, required: true },
    updated_time: { type: String, required: true },
    Active: { type: Number, default: 1 },
})

module.exports = {
    get,
    list,
    create,
    edit,
    remove,
    user_validate,
    add_new_column,
    remove_new_column,
    get_common_details,
    get_dealer_admin,
    model: User
}

async function add_new_column() {
    const user = await User.updateMany({}, { $set: { "cashier_sales": 1 } })
    return user
}
async function remove_new_column() {
    const user = await User.updateMany({}, { $unset: { "currentcy": 1 } })
    return user
}
async function list() {
    const user = await User.find({})
    return user
}
async function user_validate(name, pass) {
    const user = await User.findOne({ mail: name, password: pass, Active: 1 })
    console.log(user);
    if (user == null) {
        return { success: false }
    }
    else {
        return { success: true, data: user }
    }
}

async function get_common_details(id1, name) {
    const user = await User.findOne({ mail: id1, client_id: name, Active: 1 })
    // console.log(user)
    if (user == null) {
        return { success: false }
    }
    else {
        return { success: true, data: user }
    }
}



async function get2(id, id1) {
    const user = await User.findOne({ mail: id, client_id: id1 })
    if (user == null) {
        return { success: false }
    }
    else {
        return { success: true, data: user }
    }
}




async function get(_id) {
    const product = await User.findById(_id)
    return product
}

async function get_dealer_admin(admin_id) {
    const user = await User.find({ admin_id: admin_id })
    return user
}

async function create(fields) {

    let temp = await get2(fields.mail, fields.client_id)
    if (temp.success == false) {
        const product = await new User(fields).save()

        return product
    }
    else {
        return "User ID already exist"
    }
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
