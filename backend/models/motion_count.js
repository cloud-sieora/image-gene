const cuid = require('cuid')
const db = require('../db')
const moment = require('moment')
const live_occupency = require('./live_occupency')

const User = db.model('motion_count', {
    _id: { type: String, default: cuid },
    device_id: { type: String, required: true },
    site_id: { type: String, required: true },
    camera_id: { type: String, required: true },
    region_id: { type: String, required: true },
    camera_name: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    inside: { type: Number, default: true, default: 0 },
    outside: { type: Number, default: true, default: 0 },
    vehicle_inside: { type: Number, default: true, default: 0 },
    vehicle_outside: { type: Number, default: true, default: 0 },
    male: { type: Number, default: true, default: 0 },
    female: { type: Number, default: true, default: 0 },
    traditional: { type: Number, default: true, default: 0 },
    modern: { type: Number, default: true, default: 0 },
    objects: { type: Object, default: [] },
    heat_url: { type: Array, default: true, default: [] },
})

module.exports = {
    get,
    list,
    create,
    edit,
    remove,
    get_camera_id1,
    get_camera_vehicle,
    add_new_column,
    remove_new_column,
    get_heat_map,
    get_motion_count_raw_data,
    model: User
}

async function add_new_column() {
    const user = await User.updateMany({}, { $set: { "objects": [] } })
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



async function get(_id) {
    const product = await User.findById(_id)
    return product
}

async function get_heat_map(id, startDate, endDate, startTime, endTime) {
    let product = await User.find({ region_id: id, date: { $gte: startDate, $lte: endDate }, time: { $gte: startTime, $lte: endTime } })

    let total = 0
    let x = 0
    let y = 0

    for (let index = 0; index < product.length; index++) {
        if (product[index].heat_url.length != 0 && product[index].heat_url[0] != 0) {
            total = total + product[index].heat_url[0]
            // x = product[index].heat_url[1]
            // y = product[index].heat_url[2]
        }

    }

    total = total / product.length.toString().replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')

    return { total: total, x: x, y: y }
}

async function get_motion_count_raw_data(id, startDate, endDate, startTime, endTime) {
    // console.log(id, startDate, endDate, startTime, endTime)
    let product = await User.find({ region_id: id, date: { $gte: startDate, $lte: endDate }, time: { $gte: startTime, $lte: endTime } })

    return product
}

function analytic_chk(ana_obj, product, time) {
    let analytics_obj = ana_obj


    product.objects.map((val) => {
        if (Object.keys(analytics_obj).length !== 0) {
            Object.keys(val).map((obj) => {
                let count1 = 0



                let obj_arr = Object.keys(analytics_obj)

                for (let index = 0; index < obj_arr.length; index++) {
                    if (obj === obj_arr[index]) {
                        count1 = -1
                        if (analytics_obj[obj]['0-5'] == undefined) {
                            analytics_obj[obj] = {
                                in: analytics_obj[obj].in + val[obj].in, out: analytics_obj[obj].out + val[obj].out, "0-5": 0, "6-10": 0, "11-15": 0, "16-20": 0, "21-25": 0, "26-30": 0,
                                "31-35": 0, "36-40": 0, "41-45": 0, "46-50": 0, "51-55": 0, "56-60": 0,
                                "61-65": 0, "66-70": 0, "71-75": 0, "76-80": 0, "81-85": 0, "86-90": 0
                            }
                        } else {
                            analytics_obj[obj] = {
                                in: analytics_obj[obj].in + val[obj].in, out: analytics_obj[obj].out + val[obj].out, "0-5": analytics_obj[obj]["0-5"] + val[obj]["0-5"], "6-10": analytics_obj[obj]["6-10"] + val[obj]["6-10"], "11-15": analytics_obj[obj]["11-15"] + val[obj]["11-15"], "16-20": analytics_obj[obj]["16-20"] + val[obj]["16-20"], "21-25": analytics_obj[obj]["21-25"] + val[obj]["21-25"], "26-30": analytics_obj[obj]["26-30"] + val[obj]["26-30"],
                                "31-35": analytics_obj[obj]["31-35"] + val[obj]["31-35"], "36-40": analytics_obj[obj]["36-40"] + val[obj]["36-40"], "41-45": analytics_obj[obj]["41-45"] + val[obj]["41-45"], "46-50": analytics_obj[obj]["46-50"] + val[obj]["46-50"], "51-55": analytics_obj[obj]["51-55"] + val[obj]["51-55"], "56-60": analytics_obj[obj]["56-60"] + val[obj]["56-60"],
                                "61-65": analytics_obj[obj]["61-65"] + val[obj]["61-65"], "66-70": analytics_obj[obj]["66-70"] + val[obj]["66-70"], "71-75": analytics_obj[obj]["71-75"] + val[obj]["71-75"], "76-80": analytics_obj[obj]["76-80"] + val[obj]["76-80"], "81-85": analytics_obj[obj]["81-85"] + val[obj]["81-85"], "86-90": analytics_obj[obj]["86-90"] + val[obj]["86-90"]
                            }
                        }
                        break
                    } else {
                        count1 = 1
                    }
                }

                if (count1 === 1) {
                    analytics_obj = { ...analytics_obj, [obj]: val[obj] }

                }

            })
        } else {
            analytics_obj = val
        }
    })

    // if (time == '05:00-05:59') {
    //     console.log(analytics_obj);
    // }
    return analytics_obj
}

function calculate_hour(flag_count_arr, product, obj) {

    let time_obj = obj
    for (let index1 = 0; index1 < flag_count_arr.length - 1; index1++) {

        let end_hr = ''

        let sub_time = moment(flag_count_arr[index1 + 1], 'HH:mm:ss');
        let newTime = sub_time.subtract(1, 'second');
        end_hr = newTime.format('HH:mm:ss')

        // if (flag_count_arr[index1 + 1] == undefined) {
        //   // end_hr = moment(new Date()).format('HH:mm:ss')
        //   end_hr = flag_count_arr[flag_count_arr.length - 1]
        // }

        if (flag_count_arr.length - 1 == index1 + 1) {
            // end_hr = moment(new Date()).format('HH:mm:ss')
            end_hr = flag_count_arr[index1 + 1]
        }

        let str_hr = flag_count_arr[index1].split(':')
        let en_hr = end_hr.split(':')

        if (moment(product.time, 'HH:mm:ss').isBetween(moment(flag_count_arr[index1], 'HH:mm:ss'), moment(end_hr, 'HH:mm:ss'))) {
            let ana = analytic_chk(time_obj[`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`].object, product, [`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`])
            time_obj = {
                ...time_obj, [`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`]: {
                    inside: time_obj[`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`].inside + product.inside,
                    outside: time_obj[`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`].outside + product.outside,
                    male: time_obj[`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`].male + product.male,
                    female: time_obj[`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`].female + product.female,
                    traditional: time_obj[`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`].traditional + (product.traditional == undefined ? 0 : product.traditional),
                    modern: time_obj[`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`].modern + (product.modern == undefined ? 0 : product.modern),
                    vehicle_inside: time_obj[`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`].vehicle_inside + product.vehicle_inside,
                    vehicle_outside: time_obj[`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`].vehicle_outside + product.vehicle_outside,
                    object: ana
                }
            }
        }
        else if (moment(product.time, 'HH:mm:ss') == moment(flag_count_arr[index1], 'HH:mm:ss') || moment(end_hr, 'HH:mm:ss') == moment(product.time, 'HH:mm:ss')) {
            let ana = analytic_chk(time_obj[`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`].object, product)
            time_obj = {
                ...time_obj, [`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`]: {
                    inside: time_obj[`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`].inside + product.inside,
                    outside: time_obj[`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`].outside + product.outside,
                    male: time_obj[`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`].male + product.male,
                    female: time_obj[`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`].female + product.female,
                    traditional: time_obj[`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`].traditional + (product.traditional == undefined ? 0 : product.traditional),
                    modern: time_obj[`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`].modern + (product.modern == undefined ? 0 : product.modern),
                    vehicle_inside: time_obj[`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`].vehicle_inside + product.vehicle_inside,
                    vehicle_outside: time_obj[`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`].vehicle_outside + product.vehicle_outside,
                    object: ana
                }
            }
        }

    }
    return time_obj
}

async function get_camera_id1(id, startDate, endDate, startTime, endTime, field, flag, flag_count_arr) {
    let value = {}
    let image_url = []
    let heat_map = []
    let total = 0
    let x = 0
    let y = 0
    let live_occupenct_count = await live_occupency.list(id)

    for (let index = 0; index < heat_map.length; index++) {
        image_url = [...image_url, ...heat_map[index].heat_url]
    }

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
            time_obj = { ...time_obj, [`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`]: { inside: 0, outside: 0, male: 0, female: 0, vehicle_inside: 0, vehicle_outside: 0, traditional: 0, modern: 0, object: {} } }
        }


        for (let index = 0; index < product.length; index++) {
            if (product[index].heat_url.length != 0 && product[index].heat_url[0] != 0) {
                total = total + product[index].heat_url[0]
                // x = product[index].heat_url[1]
                // y = product[index].heat_url[2]
            }

            if (field[0] == 'vehicle_inside') {
                if (product[index].inside != 0) {
                    let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                    time_obj = obj_data
                }
                if (product[index].outside != 0) {
                    let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                    time_obj = obj_data
                }
                if (product[index].male != 0) {
                    let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                    time_obj = obj_data
                }
                if (product[index].female != 0) {
                    let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                    time_obj = obj_data
                }
                if (product[index].traditional != 0) {
                    let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                    time_obj = obj_data
                }
                if (product[index].modern != 0) {
                    let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                    time_obj = obj_data
                }
                if (product[index].vehicle_inside != 0) {
                    let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                    time_obj = obj_data
                }
                if (product[index].vehicle_outside != 0) {
                    let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                    time_obj = obj_data
                }
            } else {
                if (product[index].inside != 0) {
                    let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                    time_obj = obj_data
                }
                else if (product[index].outside != 0) {
                    let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                    time_obj = obj_data
                }
                else if (product[index].male != 0) {
                    let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                    time_obj = obj_data
                }
                else if (product[index].female != 0) {
                    let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                    time_obj = obj_data
                }
                else if (product[index].traditional != 0) {
                    let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                    time_obj = obj_data
                }
                else if (product[index].modern != 0) {
                    let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                    time_obj = obj_data
                }
                else if (product[index].vehicle_inside != 0) {
                    let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                    time_obj = obj_data
                }
                else if (product[index].vehicle_outside != 0) {
                    let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                    time_obj = obj_data
                }
            }
        }

        if (total != 0) {
            total = total / product.length.toString().replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
        }

        // for (let index = 0; index < flag_count_arr.length; index++) {
        //   let obj = { inside: 0, outside: 0, male: 0, female: 0, vehicle_inside: 0, vehicle_outside: 0 }
        //   let end_hr = ''

        //   let sub_time = moment(flag_count_arr[index + 1], 'HH:mm:ss');
        //   let newTime = sub_time.subtract(1, 'second');
        //   end_hr = newTime.format('HH:mm:ss')

        //   if (flag_count_arr[index + 1] == undefined) {
        //     end_hr = moment(new Date()).format('HH:mm:ss')
        //   }
        //   // const product = await User.find({ camera_id: id, date: { $gte: startDate, $lte: endDate }, time: { $gte: flag_count_arr[index], $lte: end_hr } })

        //   // for (let index1 = 0; index1 < product.length; index1++) {

        //   //   if (product[index1].inside != 0) {
        //   //     obj.inside = obj.inside + 1
        //   //   } else if (product[index1].outside != 0) {
        //   //     obj.outside = obj.outside + 1
        //   //   } else if (product[index1].male != 0) {
        //   //     obj.male = obj.male + 1
        //   //   } else if (product[index1].female != 0) {
        //   //     obj.female = obj.female + 1
        //   //   } else if (product[index1].vehicle_inside != 0) {
        //   //     obj.vehicle_inside = obj.vehicle_inside + 1
        //   //   } else if (product[index1].vehicle_outside != 0) {
        //   //     obj.vehicle_outside = obj.vehicle_outside + 1
        //   //   }

        //   // }
        //   for (let index1 = 0; index1 < field.length; index1++) {
        //     let sub_time = moment(flag_count_arr[index + 1], 'HH:mm:ss');
        //     let newTime = sub_time.subtract(1, 'second');
        //     end_hr = newTime.format('HH:mm:ss')

        //     if (flag_count_arr[index + 1] == undefined) {
        //       end_hr = moment(new Date()).format('HH:mm:ss')
        //     }
        //     const product = await User.find({ camera_id: id, date: { $gte: startDate, $lte: endDate }, time: { $gte: flag_count_arr[index], $lte: end_hr }, [field[index1]]: { $gte: 0, $eq: 0 } })

        //     let total = 0
        //     product.map((val) => {
        //       total = total + val[field[index1]]
        //     })
        //     obj = { ...obj, [field[index1]]: total }
        //   }
        //   let str_hr = flag_count_arr[index].split(':')
        //   let en_hr = end_hr.split(':')
        //   value = {
        let cot = live_occupenct_count.length == 0 ? 0 : live_occupenct_count[0].count
        return { value: time_obj, heat_map: image_url, dwell: total, live_occupenct_count: cot }
    } else if (flag == 'day') {
        let total1 = 0
        for (let index = 0; index < flag_count_arr.length; index++) {
            let obj = { inside: 0, outside: 0, male: 0, female: 0, vehicle_inside: 0, vehicle_outside: 0, traditional: 0, modern: 0, object: [] }
            const product = await User.find({ region_id: id, date: flag_count_arr[index] })
            total1 = total1 + product.length
            for (let index1 = 0; index1 < product.length; index1++) {

                if (product[index1].heat_url.length != 0 && product[index1].heat_url[0] != 0) {
                    total = total + product[index1].heat_url[0]
                    // x = product[index].heat_url[1]
                    // y = product[index].heat_url[2]
                }

                if (product[index1].inside != 0) {
                    obj.inside = obj.inside + product[index1].inside
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].outside != 0) {
                    obj.outside = obj.outside + product[index1].outside
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].male != 0) {
                    obj.male = obj.male + product[index1].male
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].female != 0) {
                    obj.female = obj.female + product[index1].female
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].traditional != 0) {
                    obj.traditional = obj.traditional + product[index1].traditional
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].modern != 0) {
                    obj.modern = obj.modern + product[index1].modern
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].vehicle_inside != 0) {
                    obj.vehicle_inside = obj.vehicle_inside + product[index1].vehicle_inside
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].vehicle_outside != 0) {
                    obj.vehicle_outside = obj.vehicle_outside + product[index1].vehicle_outside
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }

            }

            // for (let index1 = 0; index1 < field.length; index1++) {
            //   const product = await User.find({ camera_id: id, date: flag_count_arr[index], [field[index1]]: { $gte: 0, $eq: 0 } })

            //   let total = 0
            //   product.map((val) => {
            //     total = total + val[field[index1]]
            //   })

            //   obj = { ...obj, [field[index1]]: total }
            // }
            value = { ...value, [flag_count_arr[index]]: obj }
        }

        if (total != 0) {
            total = total / total1.toString().replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
        }
        let cot = live_occupenct_count.length == 0 ? 0 : live_occupenct_count[0].count
        return { value: value, heat_map: image_url, dwell: total, live_occupenct_count: cot }
    } else if (flag == 'monthly') {
        let total1 = 0
        for (let index = 0; index < flag_count_arr.length; index++) {
            let obj = { inside: 0, outside: 0, male: 0, female: 0, vehicle_inside: 0, vehicle_outside: 0, traditional: 0, modern: 0, object: [] }

            const startOfMonth = moment(flag_count_arr[index], "YYYY-MM").startOf('month').toDate();
            const endOfMonth = moment(flag_count_arr[index], "YYYY-MM").endOf('month').toDate();

            const product = await User.find({ region_id: id, date: { $gte: moment(startOfMonth).format('YYYY-MM-DD'), $lte: moment(endOfMonth).format('YYYY-MM-DD') } })
            total1 = total1 + product.length
            for (let index1 = 0; index1 < product.length; index1++) {

                if (product[index1].heat_url.length != 0 && product[index1].heat_url[0] != 0) {
                    total = total + product[index1].heat_url[0]
                    // x = product[index].heat_url[1]
                    // y = product[index].heat_url[2]
                }

                if (product[index1].inside != 0) {
                    obj.inside = obj.inside + product[index1].inside
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].outside != 0) {
                    obj.outside = obj.outside + product[index1].outside
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].male != 0) {
                    obj.male = obj.male + product[index1].male
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].female != 0) {
                    obj.female = obj.female + product[index1].female
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].traditional != 0) {
                    obj.traditional = obj.traditional + product[index1].traditional
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].modern != 0) {
                    obj.modern = obj.modern + product[index1].modern
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].vehicle_inside != 0) {
                    obj.vehicle_inside = obj.vehicle_inside + product[index1].vehicle_inside
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].vehicle_outside != 0) {
                    obj.vehicle_outside = obj.vehicle_outside + product[index1].vehicle_outside
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }

            }
            // for (let index1 = 0; index1 < field.length; index1++) {
            //   const startOfMonth = moment(flag_count_arr[index], "YYYY-MM").startOf('month').toDate();
            //   const endOfMonth = moment(flag_count_arr[index], "YYYY-MM").endOf('month').toDate();
            //   const product = await User.find({ camera_id: id, date: { $gte: startOfMonth, $lte: endOfMonth }, [field[index1]]: { $gte: 0, $eq: 0 } })

            //   let total = 0
            //   product.map((val) => {
            //     total = total + val[field[index1]]
            //   })

            //   obj = { ...obj, [field[index1]]: total }
            // }
            value = { ...value, [flag_count_arr[index]]: obj }
        }
        if (total != 0) {
            total = total / total1.toString().replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
        }
        let cot = live_occupenct_count.length == 0 ? 0 : live_occupenct_count[0].count
        return { value: value, heat_map: image_url, dwell: total, live_occupenct_count: cot }
    } else if (flag == 'yearly') {
        let total1 = 0
        for (let index = 0; index < flag_count_arr.length; index++) {
            let obj = { inside: 0, outside: 0, male: 0, female: 0, vehicle_inside: 0, vehicle_outside: 0, traditional: 0, modern: 0, object: [] }
            const endOfMonth = moment(`${flag_count_arr[index]}-12`, "YYYY-MM").endOf('month').toDate();

            const product = await User.find({ region_id: id, date: { $gte: `${flag_count_arr[index]}-01-01`, $lte: moment(endOfMonth).format('YYYY-MM-DD') } })
            total1 = total1 + product.length
            for (let index1 = 0; index1 < product.length; index1++) {

                if (product[index1].heat_url.length != 0 && product[index1].heat_url[0] != 0) {
                    total = total + product[index1].heat_url[0]
                    // x = product[index].heat_url[1]
                    // y = product[index].heat_url[2]
                }

                if (product[index1].inside != 0) {
                    obj.inside = obj.inside + product[index1].inside
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].outside != 0) {
                    obj.outside = obj.outside + product[index1].outside
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].male != 0) {
                    obj.male = obj.male + product[index1].male
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].female != 0) {
                    obj.female = obj.female + product[index1].female
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].traditional != 0) {
                    obj.traditional = obj.traditional + product[index1].traditional
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].modern != 0) {
                    obj.modern = obj.modern + product[index1].modern
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].vehicle_inside != 0) {
                    obj.vehicle_inside = obj.vehicle_inside + product[index1].vehicle_inside
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }
                if (product[index1].vehicle_outside != 0) {
                    obj.vehicle_outside = obj.vehicle_outside + product[index1].vehicle_outside
                    let ana = analytic_chk(obj.object, product[index1])
                    obj.object = ana
                }

            }
            // for (let index1 = 0; index1 < field.length; index1++) {
            //   const endOfMonth = moment(`${flag_count_arr[index]}-12`, "YYYY-MM").endOf('month').toDate();
            //   const product = await User.find({ camera_id: id, date: { $gte: `${flag_count_arr[index]}-01-01`, $lte: endOfMonth }, [field[index1]]: { $gte: 0, $eq: 0 } })

            //   let total = 0
            //   product.map((val) => {
            //     total = total + val[field[index1]]
            //   })
            //   obj = { ...obj, [field[index1]]: total }
            // }
            value = { ...value, [flag_count_arr[index]]: obj }
        }
        if (total != 0) {
            total = total / total1.toString().replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
        }
        let cot = live_occupenct_count.length == 0 ? 0 : live_occupenct_count[0].count
        return { value: value, heat_map: image_url, dwell: total, live_occupenct_count: cot }
    }
}

// async function get_camera_id1(id, startDate, endDate, startTime, endTime, field, flag, flag_count_arr) {
//   console.log(id, startDate, endDate, startTime, endTime, field, flag, flag_count_arr);
//   let value = {}
//   let image_url = []
//   let heat_map = []
//   // try {
//   //   heat_map = await User.find({ camera_id: id, date: { $gte: startDate, $lte: endDate }, time: { $gte: flag_count_arr[0], $lte: flag_count_arr[flag_count_arr.length - 1] }, $expr: { $ne: [{ $size: "$heat_url" }, 0] } })
//   // } catch (e) {
//   //   console.log(e);
//   // }

//   for (let index = 0; index < heat_map.length; index++) {
//     image_url = [...image_url, ...heat_map[index].heat_url]
//   }

//   if (flag == 'hour') {
//     // let obj = { inside: 0, outside: 0, male: 0, female: 0, vehicle_inside: 0, vehicle_outside: 0 }
//     // let end_hr = moment(new Date()).format('HH:mm:ss')

//     // const product = await User.find({ camera_id: id, date: { $gte: startDate, $lte: endDate }, time: { $gte: flag_count_arr[0], $lte: end_hr } })

//     // for (let index = 0; index < product.length; index++) {
//     //   if (product[index].inside != 0) {
//     //     obj.inside = obj.inside + 1
//     //   } else if (product[index].outside != 0) {
//     //     obj.outside = obj.outside + 1
//     //   } else if (product[index].male != 0) {
//     //     obj.male = obj.male + 1
//     //   } else if (product[index].female != 0) {
//     //     obj.female = obj.female + 1
//     //   } else if (product[index].vehicle_inside != 0) {
//     //     obj.vehicle_inside = obj.vehicle_inside + 1
//     //   } else if (product[index].vehicle_outside != 0) {
//     //     obj.vehicle_outside = obj.vehicle_outside + 1
//     //   }
//     // }

//     for (let index = 0; index < flag_count_arr.length; index++) {
//       let obj = { inside: 0, outside: 0, male: 0, female: 0, vehicle_inside: 0, vehicle_outside: 0 }
//       let end_hr = ''

//       let sub_time = moment(flag_count_arr[index + 1], 'HH:mm:ss');
//       let newTime = sub_time.subtract(1, 'second');
//       end_hr = newTime.format('HH:mm:ss')

//       if (flag_count_arr[index + 1] == undefined) {
//         end_hr = moment(new Date()).format('HH:mm:ss')
//       }
//       // const product = await User.find({ camera_id: id, date: { $gte: startDate, $lte: endDate }, time: { $gte: flag_count_arr[index], $lte: end_hr } })

//       // for (let index1 = 0; index1 < product.length; index1++) {

//       //   if (product[index1].inside != 0) {
//       //     obj.inside = obj.inside + 1
//       //   } else if (product[index1].outside != 0) {
//       //     obj.outside = obj.outside + 1
//       //   } else if (product[index1].male != 0) {
//       //     obj.male = obj.male + 1
//       //   } else if (product[index1].female != 0) {
//       //     obj.female = obj.female + 1
//       //   } else if (product[index1].vehicle_inside != 0) {
//       //     obj.vehicle_inside = obj.vehicle_inside + 1
//       //   } else if (product[index1].vehicle_outside != 0) {
//       //     obj.vehicle_outside = obj.vehicle_outside + 1
//       //   }

//       // }
//       for (let index1 = 0; index1 < field.length; index1++) {
//         let sub_time = moment(flag_count_arr[index + 1], 'HH:mm:ss');
//         let newTime = sub_time.subtract(1, 'second');
//         end_hr = newTime.format('HH:mm:ss')

//         if (flag_count_arr[index + 1] == undefined) {
//           end_hr = moment(new Date()).format('HH:mm:ss')
//         }

//         console.log(flag_count_arr[index], end_hr);
//         const product = await User.find({ camera_id: id, date: { $gte: startDate, $lte: endDate }, time: { $gte: flag_count_arr[index], $lte: end_hr }, [field[index1]]: { $gte: 0, $eq: 0 } })

//         let total = 0
//         product.map((val) => {
//           total = total + val[field[index1]]
//         })
//         obj = { ...obj, [field[index1]]: total }
//       }
//       let str_hr = flag_count_arr[index].split(':')
//       let en_hr = end_hr.split(':')
//       value = { ...value, [`${str_hr[0]}-${en_hr[0]}`]: obj }
//     }
//     console.log({ value: value, heat_map: image_url })
//     return { value: value, heat_map: image_url }
//   } else if (flag == 'day') {
//     for (let index = 0; index < flag_count_arr.length; index++) {
//       let obj = { inside: 0, outside: 0, male: 0, female: 0, vehicle_inside: 0, vehicle_outside: 0 }
//       const product = await User.find({ camera_id: id, date: flag_count_arr[index] })

//       for (let index1 = 0; index1 < product.length; index1++) {

//         if (product[index1].inside != 0) {
//           obj.inside = obj.inside + 1
//         } else if (product[index1].outside != 0) {
//           obj.outside = obj.outside + 1
//         } else if (product[index1].male != 0) {
//           obj.male = obj.male + 1
//         } else if (product[index1].female != 0) {
//           obj.female = obj.female + 1
//         } else if (product[index1].vehicle_inside != 0) {
//           obj.vehicle_inside = obj.vehicle_inside + 1
//         } else if (product[index1].vehicle_outside != 0) {
//           obj.vehicle_outside = obj.vehicle_outside + 1
//         }

//       }

//       // for (let index1 = 0; index1 < field.length; index1++) {
//       //   const product = await User.find({ camera_id: id, date: flag_count_arr[index], [field[index1]]: { $gte: 0, $eq: 0 } })

//       //   let total = 0
//       //   product.map((val) => {
//       //     total = total + val[field[index1]]
//       //   })

//       //   obj = { ...obj, [field[index1]]: total }
//       // }
//       value = { ...value, [flag_count_arr[index]]: obj }
//     }
//     return { value: value, heat_map: image_url }
//   } else if (flag == 'monthly') {
//     for (let index = 0; index < flag_count_arr.length; index++) {
//       let obj = { inside: 0, outside: 0, male: 0, female: 0, vehicle_inside: 0, vehicle_outside: 0 }

//       const product = await User.find({ camera_id: id, date: { $gte: startOfMonth, $lte: endOfMonth } })
//       for (let index1 = 0; index1 < product.length; index1++) {

//         if (product[index1].inside != 0) {
//           obj.inside = obj.inside + 1
//         } else if (product[index1].outside != 0) {
//           obj.outside = obj.outside + 1
//         } else if (product[index1].male != 0) {
//           obj.male = obj.male + 1
//         } else if (product[index1].female != 0) {
//           obj.female = obj.female + 1
//         } else if (product[index1].vehicle_inside != 0) {
//           obj.vehicle_inside = obj.vehicle_inside + 1
//         } else if (product[index1].vehicle_outside != 0) {
//           obj.vehicle_outside = obj.vehicle_outside + 1
//         }

//       }
//       // for (let index1 = 0; index1 < field.length; index1++) {
//       //   const startOfMonth = moment(flag_count_arr[index], "YYYY-MM").startOf('month').toDate();
//       //   const endOfMonth = moment(flag_count_arr[index], "YYYY-MM").endOf('month').toDate();
//       //   const product = await User.find({ camera_id: id, date: { $gte: startOfMonth, $lte: endOfMonth }, [field[index1]]: { $gte: 0, $eq: 0 } })

//       //   let total = 0
//       //   product.map((val) => {
//       //     total = total + val[field[index1]]
//       //   })

//       //   obj = { ...obj, [field[index1]]: total }
//       // }
//       value = { ...value, [flag_count_arr[index]]: obj }
//     }
//     return { value: value, heat_map: image_url }
//   } else if (flag == 'yearly') {
//     for (let index = 0; index < flag_count_arr.length; index++) {
//       let obj = { inside: 0, outside: 0, male: 0, female: 0, vehicle_inside: 0, vehicle_outside: 0 }

//       const product = await User.find({ camera_id: id, date: { $gte: `${flag_count_arr[index]}-01-01`, $lte: endOfMonth } })
//       for (let index1 = 0; index1 < product.length; index1++) {

//         if (product[index1].inside != 0) {
//           obj.inside = obj.inside + 1
//         } else if (product[index1].outside != 0) {
//           obj.outside = obj.outside + 1
//         } else if (product[index1].male != 0) {
//           obj.male = obj.male + 1
//         } else if (product[index1].female != 0) {
//           obj.female = obj.female + 1
//         } else if (product[index1].vehicle_inside != 0) {
//           obj.vehicle_inside = obj.vehicle_inside + 1
//         } else if (product[index1].vehicle_outside != 0) {
//           obj.vehicle_outside = obj.vehicle_outside + 1
//         }

//       }
//       // for (let index1 = 0; index1 < field.length; index1++) {
//       //   const endOfMonth = moment(`${flag_count_arr[index]}-12`, "YYYY-MM").endOf('month').toDate();
//       //   const product = await User.find({ camera_id: id, date: { $gte: `${flag_count_arr[index]}-01-01`, $lte: endOfMonth }, [field[index1]]: { $gte: 0, $eq: 0 } })

//       //   let total = 0
//       //   product.map((val) => {
//       //     total = total + val[field[index1]]
//       //   })
//       //   obj = { ...obj, [field[index1]]: total }
//       // }
//       value = { ...value, [flag_count_arr[index]]: obj }
//     }
//     return { value: value, heat_map: image_url }
//   }
// }

async function get_camera_vehicle(id, startDate, endDate, startTime, endTime, field, flag, flag_count_arr) {
    let value = {}
    let image_url = []
    let heat_map = []
    // try {
    //   heat_map = await User.find({ camera_id: id, date: { $gte: startDate, $lte: endDate }, time: { $gte: flag_count_arr[0], $lte: flag_count_arr[flag_count_arr.length - 1] }, $expr: { $ne: [{ $size: "$heat_url" }, 0] } })
    // } catch (e) {
    //   console.log(e);
    // }

    for (let index = 0; index < heat_map.length; index++) {
        image_url = [...image_url, ...heat_map[index].heat_url]
    }

    if (flag == 'hour') {
        let time_obj = {}
        let end_hr = moment(new Date()).format('HH:mm:ss')

        let product = await User.find({ camera_id: id, date: { $gte: startDate, $lte: endDate }, time: { $gte: flag_count_arr[0], $lte: end_hr } })
        console.log('count1');


        for (let index = 0; index < flag_count_arr.length; index++) {
            let end_hr = ''
            let sub_time = moment(flag_count_arr[index + 1], 'HH:mm:ss');
            let newTime = sub_time.subtract(1, 'second');
            end_hr = newTime.format('HH:mm:ss')

            if (flag_count_arr[index + 1] == undefined) {
                end_hr = flag_count_arr[flag_count_arr.length - 1]
            }

            let str_hr = flag_count_arr[index].split(':')
            let en_hr = end_hr.split(':')
            time_obj = { ...time_obj, [`${str_hr[0]}:${str_hr[1]}-${en_hr[0]}:${en_hr[1]}`]: { inside: 0, outside: 0, male: 0, female: 0, vehicle_inside: 0, vehicle_outside: 0 } }
        }

        for (let index = 0; index < product.length; index++) {
            if (product[index].inside != 0) {
                let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                time_obj = obj_data
            } else if (product[index].outside != 0) {
                let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                time_obj = obj_data
            } else if (product[index].male != 0) {
                let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                time_obj = obj_data
            } else if (product[index].female != 0) {
                let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                time_obj = obj_data
            } else if (product[index].vehicle_inside != 0) {
                let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                time_obj = obj_data
            } else if (product[index].vehicle_outside != 0) {
                let obj_data = calculate_hour(flag_count_arr, product[index], time_obj)
                time_obj = obj_data
            }
        }
        return { value: time_obj, heat_map: image_url }
    } else if (flag == 'day') {
        for (let index = 0; index < flag_count_arr.length; index++) {
            let obj = { inside: 0, outside: 0, male: 0, female: 0, vehicle_inside: 0, vehicle_outside: 0 }
            const product = await User.find({ camera_id: id, date: flag_count_arr[index] })

            for (let index1 = 0; index1 < product.length; index1++) {

                if (product[index1].inside != 0) {
                    obj.inside = obj.inside + product[index1].inside
                } else if (product[index1].outside != 0) {
                    obj.outside = obj.outside + product[index1].outside
                } else if (product[index1].male != 0) {
                    obj.male = obj.male + product[index1].male
                } else if (product[index1].female != 0) {
                    obj.female = obj.female + product[index1].female
                } else if (product[index1].vehicle_inside != 0) {
                    obj.vehicle_inside = obj.vehicle_inside + product[index1].vehicle_inside
                } else if (product[index1].vehicle_outside != 0) {
                    obj.vehicle_outside = obj.vehicle_outside + product[index1].vehicle_outside
                }

            }
            value = { ...value, [flag_count_arr[index]]: obj }
        }
        return { value: value, heat_map: image_url }
    } else if (flag == 'monthly') {
        for (let index = 0; index < flag_count_arr.length; index++) {
            let obj = { inside: 0, outside: 0, male: 0, female: 0, vehicle_inside: 0, vehicle_outside: 0 }

            const product = await User.find({ camera_id: id, date: { $gte: startOfMonth, $lte: endOfMonth } })
            for (let index1 = 0; index1 < product.length; index1++) {

                if (product[index1].inside != 0) {
                    obj.inside = obj.inside + product[index1].inside
                } else if (product[index1].outside != 0) {
                    obj.outside = obj.outside + product[index1].outside
                } else if (product[index1].male != 0) {
                    obj.male = obj.male + product[index1].male
                } else if (product[index1].female != 0) {
                    obj.female = obj.female + product[index1].female
                } else if (product[index1].vehicle_inside != 0) {
                    obj.vehicle_inside = obj.vehicle_inside + product[index1].vehicle_inside
                } else if (product[index1].vehicle_outside != 0) {
                    obj.vehicle_outside = obj.vehicle_outside + product[index1].vehicle_outside
                }

            }
            value = { ...value, [flag_count_arr[index]]: obj }
        }
        return { value: value, heat_map: image_url }
    } else if (flag == 'yearly') {
        for (let index = 0; index < flag_count_arr.length; index++) {
            let obj = { inside: 0, outside: 0, male: 0, female: 0, vehicle_inside: 0, vehicle_outside: 0 }

            const product = await User.find({ camera_id: id, date: { $gte: `${flag_count_arr[index]}-01-01`, $lte: endOfMonth } })
            for (let index1 = 0; index1 < product.length; index1++) {

                if (product[index1].inside != 0) {
                    obj.inside = obj.inside + product[index1].inside
                } else if (product[index1].outside != 0) {
                    obj.outside = obj.outside + product[index1].outside
                } else if (product[index1].male != 0) {
                    obj.male = obj.male + product[index1].male
                } else if (product[index1].female != 0) {
                    obj.female = obj.female + product[index1].female
                } else if (product[index1].vehicle_inside != 0) {
                    obj.vehicle_inside = obj.vehicle_inside + product[index1].vehicle_inside
                } else if (product[index1].vehicle_outside != 0) {
                    obj.vehicle_outside = obj.vehicle_outside + product[index1].vehicle_outside
                }

            }
            value = { ...value, [flag_count_arr[index]]: obj }
        }
        return { value: value, heat_map: image_url }
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
    return { status: true, data: product }
}


async function remove(_id) {
    await User.deleteOne({ _id })

} 
