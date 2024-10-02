const cuid = require('cuid')
const db = require('../db')
const moment = require('moment')

// const AWS = require('aws-sdk');
// const fs = require('fs');


const User = db.model('subscription', {
    _id: { type: String, default: cuid },
    cameras: {
        type: [
            {
                '_2mp': {
                    'motion': {
                        motion: { type: Number, require: true },
                        plan_id: { type: String, require: true },
                        payment_id: { type: String, require: true },
                    },
                    'continues': {
                        continues: { type: Number, require: true },
                        plan_id: { type: String, require: true },
                        payment_id: { type: String, require: true },
                    }
                },
                '_4mp': {
                    'motion': {
                        motion: { type: Number, require: true },
                        plan_id: { type: String, require: true },
                        payment_id: { type: String, require: true },
                    },
                    'continues': {
                        continues: { type: Number, require: true },
                        plan_id: { type: String, require: true },
                        payment_id: { type: String, require: true },
                    }
                },
                '_8mp': {
                    'motion': {
                        motion: { type: Number, require: true },
                        plan_id: { type: String, require: true },
                        payment_id: { type: String, require: true },
                    },
                    'continues': {
                        continues: { type: Number, require: true },
                        plan_id: { type: String, require: true },
                        payment_id: { type: String, require: true },
                    }
                },
                device: { type: Array, default: [] },
                options: { type: Object, default: { alert: 0, analytics: 0, cloud: 0, local: 0, face_dedaction: 0, motion: 0, live: 0 } },
                start_date: { type: String, require: true },
                start_time: { type: String, require: true },
                end_date: { type: String, require: true },
                end_time: { type: String, require: true },
            }
        ], require: true
    },
    client_id: { type: String, require: true },
})

module.exports = {
    get,
    list,
    create,
    edit,
    remove,
    get2,
    get_subscribe_client,
    list_date_time,
    subscription_explain,

    model: User
}

async function list() {
    const user = await User.find({})
    return user
}

async function get_subscribe_client(id) {
    const user = await User.findOne({ client_id: id })
    return user
}

async function list_date_time(id) {
    const user = await User.findOne({ client_id: id })
    let total_cam_count = 0
    let camera_length = 0

    if (user !== null) {
        let cameras = user.cameras
        for (let index = 0; index < cameras.length; index++) {
            if (moment(moment(new Date(), "HH:mm:ss YYYY-MM-DD")).isBetween(moment(`${cameras[index].start_time} ${cameras[index].start_date}`, "HH:mm:ss YYYY-MM-DD"), moment(`${cameras[index].end_time} ${cameras[index].end_date}`, "HH:mm:ss YYYY-MM-DD"))) {
                total_cam_count = total_cam_count + (cameras[index]._2mp.motion.motion + cameras[index]._2mp.continues.continues)
                total_cam_count = total_cam_count + (cameras[index]._4mp.motion.motion + cameras[index]._4mp.continues.continues)
                total_cam_count = total_cam_count + (cameras[index]._8mp.motion.motion + cameras[index]._8mp.continues.continues)

                let camera_data = await require('./camera_creation').list_camera_date_time(id, cameras[index].id, cameras[index].start_date, cameras[index].end_date, cameras[index].start_time, cameras[index].end_time)

                if (camera_data.length != 0) {
                    camera_length = camera_length + camera_data.length
                }
            }

        }

        // console.log(camera_length);
        // console.log(total_cam_count);

        if (camera_length < total_cam_count) {
            return { success: true }
        } else {
            return { success: false }
        }
    } else {
        return { success: false }
    }
}

async function subscription_explain(id) {
    const user = await User.findOne({ client_id: id })
    // console.log(user.cameras);
    let plans = []

    if (user !== null) {
        let cameras = user.cameras
        for (let index = 0; index < cameras.length; index++) {
            if (moment(moment(new Date(), "HH:mm:ss YYYY-MM-DD")).isBetween(moment(`${cameras[index].start_time} ${cameras[index].start_date}`, "HH:mm:ss YYYY-MM-DD"), moment(`${cameras[index].end_time} ${cameras[index].end_date}`, "HH:mm:ss YYYY-MM-DD"))) {
                let total_cam_count = 0
                total_cam_count = total_cam_count + (cameras[index]._2mp.motion.motion + cameras[index]._2mp.continues.continues)
                total_cam_count = total_cam_count + (cameras[index]._4mp.motion.motion + cameras[index]._4mp.continues.continues)
                total_cam_count = total_cam_count + (cameras[index]._8mp.motion.motion + cameras[index]._8mp.continues.continues)


                let camera_data = await require('./camera_creation').list_camera_date_time(id, cameras[index].id, cameras[index].start_date, cameras[index].end_date, cameras[index].start_time, cameras[index].end_time)

                // console.log(camera_data);
                // console.log(camera_data.length);

                let full_camera_data = { _2mp: cameras[index]._2mp.motion.motion + cameras[index]._2mp.continues.continues, _4mp: cameras[index]._4mp.motion.motion + cameras[index]._4mp.continues.continues, _8mp: cameras[index]._8mp.motion.motion + cameras[index]._8mp.continues.continues }
                if (camera_data.length == 0) {
                    plans.push({ sub: cameras[index], camera_add: total_cam_count, cameras_options: { ...cameras[index].options, _2mp: { motion: cameras[index]._2mp.motion.motion, continues: cameras[index]._2mp.continues.continues }, _4mp: { motion: cameras[index]._4mp.motion.motion, continues: cameras[index]._4mp.continues.continues }, _8mp: { motion: cameras[index]._8mp.motion.motion, continues: cameras[index]._8mp.continues.continues } }, cameras_for_add: full_camera_data })
                } else {
                    let option_obj = { alert: 0, analytics: 0, cloud: 0, local: 0, face_dedaction: 0, people_analytics: 0, vehicle_analytics: 0, _2mp: { motion: 0, continues: 0 }, _4mp: { motion: 0, continues: 0 }, _8mp: { motion: 0, continues: 0 } }

                    for (let index1 = 0; index1 < camera_data.length; index1++) {
                        option_obj.alert = option_obj.alert + (camera_data[index1].camera_option.alert != undefined ? camera_data[index1].camera_option.alert : 0)
                        option_obj.analytics = option_obj.analytics + (camera_data[index1].camera_option.analytics != undefined ? camera_data[index1].camera_option.analytics : 0)
                        option_obj.cloud = option_obj.cloud + (camera_data[index1].camera_option.cloud != undefined ? camera_data[index1].camera_option.cloud : 0)
                        option_obj.local = option_obj.local + (camera_data[index1].camera_option.local != undefined ? camera_data[index1].camera_option.local : 0)

                        option_obj.face_dedaction = option_obj.face_dedaction + (camera_data[index1].camera_option.face_dedaction != undefined ? camera_data[index1].camera_option.face_dedaction : 0)

                        option_obj.people_analytics = option_obj.people_analytics + (camera_data[index1].camera_option.people_analytics != undefined ? camera_data[index1].camera_option.people_analytics : 0)

                        option_obj.vehicle_analytics = option_obj.vehicle_analytics + (camera_data[index1].camera_option.vehicle_analytics != undefined ? camera_data[index1].camera_option.vehicle_analytics : 0)

                        if (camera_data[index1].camera_mp == 2) {
                            option_obj._2mp.motion = option_obj._2mp.motion + camera_data[index1].camera_option.motion
                            option_obj._2mp.continues = option_obj._2mp.continues + camera_data[index1].camera_option.live
                            full_camera_data._2mp = full_camera_data._2mp - 1
                        } else if (camera_data[index1].camera_mp == 4) {
                            option_obj._4mp.motion = option_obj._4mp.motion + camera_data[index1].camera_option.motion
                            option_obj._4mp.continues = option_obj._4mp.continues + camera_data[index1].camera_option.live
                            full_camera_data._4mp = full_camera_data._4mp - 1
                        } else if (camera_data[index1].camera_mp == 8) {
                            option_obj._8mp.motion = option_obj._8mp.motion + camera_data[index1].camera_option.motion
                            option_obj._8mp.continues = option_obj._8mp.continues + camera_data[index1].camera_option.live
                            full_camera_data._8mp = full_camera_data._8mp - 1
                        }
                    }

                    plans.push({
                        sub: cameras[index], camera_add: total_cam_count - camera_data.length, cameras_options: {

                            alert: cameras[index].options.alert != undefined ? cameras[index].options.alert - option_obj.alert : 0 - option_obj.alert,

                            analytics: cameras[index].options.analytics != undefined ? cameras[index].options.analytics - option_obj.analytics : option_obj.analytics,

                            cloud: cameras[index].options.cloud != undefined ? cameras[index].options.cloud - option_obj.cloud : 0 - option_obj.cloud,

                            local: cameras[index].options.local != undefined ? (cameras[index].options.local - option_obj.local) : 0 - option_obj.local,

                            face_dedaction: cameras[index].options.face_dedaction != undefined ? (cameras[index].options.face_dedaction - option_obj.face_dedaction) : 0 - option_obj.face_dedaction,


                            people_analytics: cameras[index].options.people_analytics != undefined ? (cameras[index].options.people_analytics - option_obj.people_analytics) : 0 - option_obj.people_analytics,

                            vehicle_analytics: cameras[index].options.vehicle_analytics != undefined ? (cameras[index].options.vehicle_analytics - option_obj.vehicle_analytics) : 0 - option_obj.vehicle_analytics,

                            _2mp: { motion: cameras[index]._2mp.motion.motion - option_obj._2mp.motion, continues: cameras[index]._2mp.continues.continues - option_obj._2mp.continues }, _4mp: { motion: cameras[index]._4mp.motion.motion - option_obj._4mp.motion, continues: cameras[index]._4mp.continues.continues - option_obj._4mp.continues }, _8mp: { motion: cameras[index]._8mp.motion.motion - option_obj._8mp.motion, continues: cameras[index]._8mp.continues.continues - option_obj._8mp.continues }
                        }, cameras_for_add: full_camera_data
                    })
                }
            }

        }

        return { success: true, sub: plans }
    } else {
        return { success: false, data: 'no more plans' }
    }
}

// async function get_page_plan_validate(id) {
//     const user = await User.findOne({ client_id: id })
//     let new_value={}
//     user.cameras.map((val)=>{

//     })
//     return user
// }




async function get(_id) {
    const product = await User.findById(_id)
    return product
}

async function get2(id) {
    const user = await User.findOne({ client_id: id })
    if (user == null) {
        return { success: false }
    }
    else {
        return { success: true, data: user }
    }
}


async function create(fields) {
    let temp = await get2(fields.client_id)
    if (temp.success == false) {

        let newData = []

        for (let index = 0; index < fields.cameras.length; index++) {
            newData.push({ ...fields.cameras[index], id: Date.now() })
        }
        fields.cameras = newData
        const product = await new User(fields).save()
        return product
    }

    else {
        let subscribe_data = temp.data._doc
        let newData = []

        for (let index = 0; index < fields.cameras.length; index++) {
            newData.push({ ...fields.cameras[index], id: Date.now() })
        }


        subscribe_data = { ...subscribe_data, cameras: [...subscribe_data.cameras, ...newData] }
        await edit(subscribe_data._id, subscribe_data)
        return 'saved successfully'
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





