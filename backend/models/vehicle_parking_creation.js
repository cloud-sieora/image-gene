const cuid = require('cuid')
const db = require('../db')
const vehicle_database = require('./vehicle_database_creation')
const vehicle_tag = require('./vehicle_tag')
const vehicle_overtime = require('./Vehicle_overtime_creation')

const User = db.model('vehicle_parking_creation', {
    _id: { type: String, default: cuid },
    vehicle_type: { type: String, required: true },
    plate_number: { type: String, required: true },
    in_time: { type: String, required: true },
    out_time: { type: String, required: false, default: 'NONE' },
    date: { type: String, required: true },
    payment_status: { type: String, default: false },
    alert: { type: Number, default: 0 },
    tag_id: { type: String, default: 'NONE' },
    amount: { type: String, default: 0 },
    client_id: { type: String, required: true },
    site_id: { type: String, required: true },
})

module.exports = {
    get,
    list,
    create,
    edit,
    remove,
    list_vehicle_in_out,
    list_vehicle_payment_status,
    list_vehicle_alert,
    model: User
}

async function list(id) {
    console.log(id);
    const user = await User.find()
    console.log(user);
    return user
}

async function list_vehicle_in_out(client_id, site_id, startDate, endDate, type, page) {
    if (type == 'In') {
        const product = await User.find({ client_id: client_id, site_id: site_id, date: { $gte: startDate, $lte: endDate }, payment_status: false, in_time: { $ne: "NONE" } }).sort({ _id: -1 })
            .skip((page - 1) * 10)
            .limit(10)
            .exec();
        return product
    } else {
        const product1 = await User.find({ client_id: client_id, site_id: site_id, date: { $gte: startDate, $lte: endDate }, payment_status: false, out_time: { $ne: "NONE" } }).sort({ _id: -1 })
            .skip((page - 1) * 10)
            .limit(10)
            .exec();
        return product1
    }
}

async function list_vehicle_payment_status(client_id, site_id, startDate, endDate, page) {
    const product = await User.find({ client_id: client_id, site_id: site_id, date: { $gte: startDate, $lte: endDate }, payment_status: true })
        .sort({ _id: -1 })
        .skip((page - 1) * 10)
        .limit(10)
        .exec();
    return product
}

async function list_vehicle_alert(client_id, site_id, startDate, endDate, page) {

    let data = []
    let total_tag = []
    let total_datadase = []
    let true_datadase = []
    let tag = await vehicle_tag.list_tag_name(client_id, 'Block List')
    let true_total_tag = await vehicle_tag.list_enable_tag(client_id)
    let over_time = await vehicle_overtime.list_site_id(site_id)

    for (let index = 0; index < over_time.length; index++) {
        if (over_time.tag_enable == true) {
            total_tag = [...total_tag, ...over_time[index].tags]
        }
    }

    if (total_tag.length != 0) {
        for (let index = 0; index < total_tag.length; index++) {
            let database = await vehicle_database.list_tag_id(total_tag[index])
            total_datadase = [...total_datadase, ...database]
        }
    }

    if (true_total_tag.length != 0) {
        for (let index = 0; index < true_total_tag.length; index++) {
            let database = await vehicle_database.list_tag_id(true_total_tag[index]._id)
            true_datadase = [...true_datadase, ...database]
        }
    }

    if (tag != null) {
        let database = await vehicle_database.list_tag_id(tag._id)

        for (let index = 0; index < database.length; index++) {
            try {
                const product = await User.find({ client_id: client_id, site_id: site_id, date: { $gte: startDate, $lte: endDate }, plate_number: database[index].plate_number })
                    .sort({ _id: -1 })
                    .skip((page - 1) * 10)
                    .limit(10)
                    .exec();

                data.push({ plate_number: database[index].plate_number, data: product })
            } catch (err) {
                console.error(err);
            }

        }
    }

    let ot_alert = []
    for (let index = 0; index < over_time.length; index++) {
        const time_data = await User.find({ client_id: client_id, site_id: site_id, date: { $gte: startDate, $lte: endDate }, time: { $gt: over_time[index].time } })
            .sort({ _id: -1 })
            .skip((page - 1) * 10)
            .limit(10)
            .exec();
        ot_alert = time_data
    }

    for (let index = 0; index < total_datadase.length; index++) {
        let newdata = []
        for (let index1 = 0; index1 < ot_alert.length; index1++) {
            if (total_datadase[index].plate_number != ot_alert[index1].plate_number) {
                newdata.push(ot_alert[index1])
            }
        }
        ot_alert = newdata
    }

    let total_data = await User.find({ client_id: client_id, site_id: site_id, date: { $gte: startDate, $lte: endDate }, })
        .sort({ _id: -1 })
        .skip((page - 1) * 10)
        .limit(10)
        .exec();

    for (let index = 0; index < true_datadase.length; index++) {
        let newdata = []
        for (let index1 = 0; index1 < total_data.length; index1++) {
            if (true_datadase[index].plate_number != total_data[index1].plate_number) {
                newdata.push(total_data[index1])
            }
        }
        total_data = newdata
    }

    return { 'block_list': data, 'overtime': ot_alert, 'unknow': total_data }
}

async function get(_id) {
    const product = await User.findById(_id)
    return product
}

async function create(fields) {

    const user = await User.findOne({ client_id: fields.client_id, plate_number: fields.plate_number, date: { $gte: fields.date, $lte: fields.date } })
    console.log(user)

    if (user == null) {
        const product = await new User(fields).save()
        return product
    } else {
        const product = await edit(user._id, { ...user, out_time: fields.in_time })
        return { success: true, data: product }
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
