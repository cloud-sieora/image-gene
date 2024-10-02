const cuid = require('cuid')
const db = require('../db')
const moment = require('moment')

const User = db.model('queue', {
    _id: { type: String, default: cuid },
    camera_id: { type: String, required: true },
    region_id: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    count: { type: Number, required: true },
    wait_time: { type: Number, required: true },
})

module.exports = {
    get,
    list,
    create,         
    edit,
    remove,
    get_camera_id1,
    list_all,
    model: User
}

async function list(id) {
    const user = await User.find({ region_id: id })
    return user
}


async function list_all(id) {
    let time = 0
    let count = 0
    for (let index = 0; index < id.length; index++) {
        const user = await User.find({ region_id: id[index].id }).sort({ _id: -1 }).limit(1)

        if (user.length != 0) {
            if (user[0].wait_time > time) {
                time = user[0].wait_time
            }

            if (user[0].count > count) {
                time = user[0].count
            }
        }
    }
    return { time, count }
}

async function get(_id) {
    const product = await User.findById(_id)
    return product
}


async function create(fields) {
    const product = await new User(fields).save()
    return product
}

async function get_camera_id1(id, startDate, endDate, startTime, endTime, field, flag, flag_count_arr) {
    let value = {}

    if (flag == 'hour') {
        let time_obj = {}
        let end_hr = moment(new Date()).format('HH:mm:ss')

        let product = await User.find({ region_id: id, date: { $gte: startDate, $lte: endDate }, time: { $gte: flag_count_arr[0], $lte: flag_count_arr[flag_count_arr.length - 1] } })

        for (let index = 0; index < flag_count_arr.length - 1; index++) {
            let end_hr = ''
            let sub_time = moment(flag_count_arr[index + 1], 'HH:mm:ss');
            let newTime = sub_time.subtract(1, 'second');
            end_hr = newTime.format('HH:mm:ss')

            // if (flag_count_arr[index + 1] == undefined) {
            //   end_hr = flag_count_arr[flag_count_arr.length - 1]
            // }

            if (flag_count_arr.length - 1 == index + 1) {
                // end_hr = moment(new Date()).format('HH:mm:ss')
                end_hr = flag_count_arr[index + 1]
            }

            let str_hr = flag_count_arr[index].split(':')
            let en_hr = end_hr.split(':')
            time_obj = { ...time_obj, [`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`]: { high_count: 0, high_time: 0, total_count: 0, total_time: 0, average_count: 0, average_time: 0 } }
        }


        for (let index = 0; index < product.length; index++) {

            const timeString = product[index].time;
            const timeArray = timeString.split(':');

            const last_time = flag_count_arr[flag_count_arr.length - 1].split(':')

            if (timeArray[0] == last_time[0]) {
                time_obj[`${timeArray[0]}:00-${timeArray[0]}:${last_time[1]}`].total_count = time_obj[`${timeArray[0]}:00-${timeArray[0]}:${last_time[1]}`].total_count + product[index].total_count

                time_obj[`${timeArray[0]}:00-${timeArray[0]}:${last_time[1]}`].total_time = time_obj[`${timeArray[0]}:00-${timeArray[0]}:${last_time[1]}`].total_time + product[index].total_time

                time_obj[`${timeArray[0]}:00-${timeArray[0]}:${last_time[1]}`].average_count = time_obj[`${timeArray[0]}:00-${timeArray[0]}:${last_time[1]}`].total_count / product.length

                time_obj[`${timeArray[0]}:00-${timeArray[0]}:${last_time[1]}`].average_time = time_obj[`${timeArray[0]}:00-${timeArray[0]}:${last_time[1]}`].total_time / product.length

                if (product[index].count > time_obj[`${timeArray[0]}:00-${timeArray[0]}:${last_time[1]}`].high_count) {
                    time_obj[`${timeArray[0]}:00-${timeArray[0]}:${last_time[1]}`].high_count = product[index].count
                }

                if (product[index].wait_time > time_obj[`${timeArray[0]}:00-${last_time[1]}`].high_time) {
                    time_obj[`${timeArray[0]}:00-${timeArray[0]}:${last_time[1]}`].high_time = product[index].wait_time
                }
            } else {
                time_obj[`${timeArray[0]}:00-${timeArray[0]}:${timeArray[0]}:59`].total_count = time_obj[`${timeArray[0]}:00-${timeArray[0]}:${timeArray[0]}:59`].total_count + product[index].total_count

                time_obj[`${timeArray[0]}:00-${timeArray[0]}:${timeArray[0]}:59`].total_time = time_obj[`${timeArray[0]}:00-${timeArray[0]}:${timeArray[0]}:59`].total_time + product[index].total_time

                time_obj[`${timeArray[0]}:00-${timeArray[0]}:${timeArray[0]}:59`].average_count = time_obj[`${timeArray[0]}:00-${timeArray[0]}:${timeArray[0]}:59`].total_count / product.length

                time_obj[`${timeArray[0]}:00-${timeArray[0]}:${timeArray[0]}:59`].average_time = time_obj[`${timeArray[0]}:00-${timeArray[0]}:${timeArray[0]}:59`].total_time / product.length

                if (product[index].count > time_obj[`${timeArray[0]}:00-${timeArray[0]}:59`].high_count) {
                    time_obj[`${timeArray[0]}:00-${timeArray[0]}:${timeArray[0]}:59`].high_count = product[index].count
                }

                if (product[index].wait_time > time_obj[`${timeArray[0]}:00-${timeArray[0]}:59`].high_time) {
                    time_obj[`${timeArray[0]}:00-${timeArray[0]}:${timeArray[0]}:59`].high_time = product[index].wait_time
                }
            }
        }

        return { value: time_obj }
    } else if (flag == 'day') {
        let total1 = 0
        for (let index = 0; index < flag_count_arr.length; index++) {
            let obj = { high_count: 0, high_time: 0, total_count: 0, total_time: 0, average_count: 0, average_time: 0 }
            const product = await User.find({ region_id: id, date: flag_count_arr[index] })

            for (let index1 = 0; index1 < product.length; index1++) {

                obj.total_count = obj.total_count + product[index].total_count

                obj.total_time = obj.total_time + product[index].total_time

                obj.average_count = obj.total_count / product.length

                obj.average_time = obj.total_time / product.length

                if (product[index].count > obj.high_count) {
                    obj.high_count = product[index].count
                }

                if (product[index].wait_time > obj.high_time) {
                    obj.high_time = product[index].wait_time
                }

            }

            value = { ...value, [flag_count_arr[index]]: obj }
        }
        return { value: value }
    } else if (flag == 'monthly') {

        for (let index = 0; index < flag_count_arr.length; index++) {
            let obj = { high_count: 0, high_time: 0, total_count: 0, total_time: 0, average_count: 0, average_time: 0 }

            const startOfMonth = moment(flag_count_arr[index], "YYYY-MM").startOf('month').toDate();
            const endOfMonth = moment(flag_count_arr[index], "YYYY-MM").endOf('month').toDate();

            const product = await User.find({ region_id: id, date: { $gte: moment(startOfMonth).format('YYYY-MM-DD'), $lte: moment(endOfMonth).format('YYYY-MM-DD') } })

            for (let index1 = 0; index1 < product.length; index1++) {

                obj.total_count = obj.total_count + product[index].total_count

                obj.total_time = obj.total_time + product[index].total_time

                obj.average_count = obj.total_count / product.length

                obj.average_time = obj.total_time / product.length

                if (product[index].count > obj.high_count) {
                    obj.high_count = product[index].count
                }

                if (product[index].wait_time > obj.high_time) {
                    obj.high_time = product[index].wait_time
                }

            }
            value = { ...value, [flag_count_arr[index]]: obj }
        }
        return { value: value }
    } else if (flag == 'yearly') {
        for (let index = 0; index < flag_count_arr.length; index++) {
            let obj = { high_count: 0, high_time: 0, total_count: 0, total_time: 0, average_count: 0, average_time: 0 }
            const endOfMonth = moment(`${flag_count_arr[index]}-12`, "YYYY-MM").endOf('month').toDate();

            const product = await User.find({ region_id: id, date: { $gte: `${flag_count_arr[index]}-01-01`, $lte: moment(endOfMonth).format('YYYY-MM-DD') } })

            for (let index1 = 0; index1 < product.length; index1++) {

                obj.total_count = obj.total_count + product[index].total_count

                obj.total_time = obj.total_time + product[index].total_time

                obj.average_count = obj.total_count / product.length

                obj.average_time = obj.total_time / product.length

                if (product[index].count > obj.high_count) {
                    obj.high_count = product[index].count
                }

                if (product[index].wait_time > obj.high_time) {
                    obj.high_time = product[index].wait_time
                }

            }
            value = { ...value, [flag_count_arr[index]]: obj }
        }
        return { value: value }
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
