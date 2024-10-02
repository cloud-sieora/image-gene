const cuid = require('cuid')
const db = require('../db')
const user_data = require('./client_creation')
const userModel = require('./users_creation')
const axios = require('axios');
const serviceAccount = require('../resources/notification/notification.json');
const admin = require('firebase-admin');



const User = db.model('Alert_creation', {
  _id: { type: String, default: cuid },
  device_id: { type: String, required: true },
  camera_name: { type: String, required: true },
  camera_id: { type: String, required: true },
  user_id: { type: String, required: true },
  site_id: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  objects: { type: Object, default: [] },
  type: { type: String, default: 'intrusion' },
  class: { type: String, default: 'person' },
  video_key: { type: String, default: "NONE" },
  msg: { type: String, default: "NONE" },
  title: { type: String, default: "ALERT FROM TENTOVISION" },
  Active: { type: Number, default: 0 },
  history_type: { type: Number, default: 0 },
  uri: { type: String, default: "NONE" },
  history: { type: String, default: 'NONE' }
})

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  add_new_column,
  remove_new_column,
  send_notification,
  get_alerts,
  accounts_dashboard,
  getalerts_by_date_time,
  get_analytics_data,
  model: User
}


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function add_new_column() {
  try {
    const user = await User.updateMany({}, { $set: { "history_type": 0 } })
    return user
  } catch (e) {
    console.log(e);
  }

}
async function remove_new_column() {
  const user = await User.updateMany({}, { $unset: { "currentcy": 1 } })
  return user
}
async function list() {
  const user = await User.find({})
  return user
}

async function accounts_dashboard(startDate, endDate, startTime, endTime, camera_id, camera_name, start_count, end_count, analytic_flag, active, history_type) {

  console.log(history_type == 'live' ? 0 : 1);


  let data = []
  let active_in = { active_alert: 0, inactive_alert: 0 }
  let count = 0
  for (let index = 0; index < camera_id.length; index++) {

    const active_alert = await User.find({ date: { $gte: startDate, $lte: endDate }, time: { $gte: startTime, $lte: endTime }, camera_id: camera_id[index], Active: 0, history_type: history_type == 'live' ? 0 : 1 }).sort({ date: -1, time: -1 })
    const inactive_alert = await User.find({ date: { $gte: startDate, $lte: endDate }, time: { $gte: startTime, $lte: endTime }, camera_id: camera_id[index], Active: 1, history_type: history_type == 'live' ? 0 : 1 }).sort({ date: -1, time: -1 })

    active_in.active_alert = active_in.active_alert + active_alert.length
    active_in.inactive_alert = active_in.inactive_alert + inactive_alert.length

    if (active == 0) {
      data = [...data, ...active_alert]
    } else {
      data = [...data, ...inactive_alert]
    }

    count = count + 1

    if (count == camera_id.length) {
      let analytics_obj = []
      let analytics_num = {}

      if (analytic_flag) {
        data.map((val) => {
          if (analytics_obj.length !== 0) {

            let count1 = 0

            for (let i = 0; i < analytics_obj.length; i++) {
              if (val.type === analytics_obj[i]) {
                count1 = -1
                analytics_num[val.type] = analytics_num[val.type] + 1
                break
              } else {
                count1 = 1
              }
            }

            if (count1 === 1) {
              analytics_obj.push(val.type)
              analytics_num = { ...analytics_num, [val.type]: 1 }
            }
          } else {
            analytics_obj.push(val.type)
            analytics_num = { ...analytics_num, [val.type]: 1 }
          }
        })
      }

      if (data.length !== 0) {
        if (start_count == 0) {
          if (data.length >= end_count) {
            let newdata = []
            for (let index = start_count; index < end_count; index++) {
              newdata.push(data[index])
            }
            return { "data": newdata, length: data.length, active_alert: active_in.active_alert, inactive_alert: active_in.inactive_alert, analytics: { analytics_obj: analytics_obj, analytics_num: analytics_num, } }
          } else {
            let newdata = []
            for (let index = start_count; index < data.length; index++) {
              newdata.push(data[index])
            }
            return { "data": newdata, length: data.length, active_alert: active_in.active_alert, inactive_alert: active_in.inactive_alert, analytics: { analytics_obj: analytics_obj, analytics_num: analytics_num, } }
          }
        } else {
          if (data.length >= end_count) {
            let newdata = []
            for (let index = start_count - 1; index < end_count; index++) {
              newdata.push(data[index])
            }
            return { "data": newdata, length: data.length, active_alert: active_in.active_alert, inactive_alert: active_in.inactive_alert, analytics: { analytics_obj: analytics_obj, analytics_num: analytics_num, } }
          } else {
            let newdata = []
            for (let index = start_count - 1; index < data.length; index++) {
              newdata.push(data[index])
            }
            return { "data": newdata, length: data.length, active_alert: active_in.active_alert, inactive_alert: active_in.inactive_alert, analytics: { analytics_obj: analytics_obj, analytics_num: analytics_num, } }
          }
        }
      } else {
        return { "data": data, length: data.length, active_alert: active_in.active_alert, inactive_alert: active_in.inactive_alert, analytics: { analytics_obj: analytics_obj, analytics_num: analytics_num, } }
      }
    }
  }

}

// async function accounts_dashboard(startDate, endDate, startTime, endTime, camera_id, camera_name, start_count, end_count, analytic_flag, active) {

//   let data = []
//   let active_in = { active_alert: 0, inactive_alert: 0 }
//   let count = 0
//   for (let index = 0; index < camera_id.length; index++) {
//     const active_alert = await User.find({ date: { $gte: startDate, $lte: endDate }, time: { $gte: startTime, $lte: endTime }, camera_id: camera_id[index], Active: 0 })
//     const inactive_alert = await User.find({ date: { $gte: startDate, $lte: endDate }, time: { $gte: startTime, $lte: endTime }, camera_id: camera_id[index], Active: 1 })

//     active_in.active_alert = active_in.active_alert + active_alert.length
//     active_in.inactive_alert = active_in.inactive_alert + inactive_alert.length

//     if (active == 0) {
//       data = [...data, ...active_alert]
//     } else {
//       data = [...data, ...inactive_alert]
//     }
//     count = count + 1

//     if (count == camera_id.length) {
//       if (data.length !== 0) {
//         if (start_count == 0) {
//           if (data.length >= end_count) {
//             let newdata = []
//             for (let index = start_count; index < end_count; index++) {
//               newdata.push(data[index])
//             }
//             return { "data": newdata, length: data.length, active_alert: active_in.active_alert, inactive_alert: active_in.inactive_alert }
//           } else {
//             let newdata = []
//             for (let index = start_count; index < data.length; index++) {
//               newdata.push(data[index])
//             }
//             return { "data": newdata, length: data.length, active_alert: active_in.active_alert, inactive_alert: active_in.inactive_alert }
//           }
//         } else {
//           if (data.length >= end_count) {
//             let newdata = []
//             for (let index = start_count; index < end_count; index++) {
//               newdata.push(data[index])
//             }
//             return { "data": newdata, length: data.length, active_alert: active_in.active_alert, inactive_alert: active_in.inactive_alert }
//           } else {
//             let newdata = []
//             for (let index = start_count; index < data.length; index++) {
//               newdata.push(data[index])
//             }
//             return { "data": newdata, length: data.length, active_alert: active_in.active_alert, inactive_alert: active_in.inactive_alert }
//           }
//         }
//       } else {
//         return { "data": data, length: data.length, active_alert: active_in.active_alert, inactive_alert: active_in.inactive_alert }
//       }
//     }
//   }

// }

// async function accounts_dashboard(startDate, endDate, camera_id, active) {

//   const active_alert = await User.find({ date: { $gte: startDate, $lte: endDate }, camera_id: camera_id, Active: 0 })
//   const inactive_alert = await User.find({ date: { $gte: startDate, $lte: endDate }, camera_id: camera_id, Active: 1 })

//   if (active == 0) {
//     return { "data": active_alert, active_alert: active_alert.length, inactive_alert: inactive_alert.length }
//   } else {
//     return { "data": inactive_alert, active_alert: active_alert.length, inactive_alert: inactive_alert.length }
//   }
// }

async function getalerts_by_date_time(startDate, endDate, startTime, endTime, camera_id) {

  const data = await User.find({ date: { $gte: startDate, $lte: endDate }, time: { $gte: startTime, $lte: endTime }, camera_id: camera_id })

  return { "data": data }
}

async function get_alerts(device_id) {
  const user = await User.find({ device_id: device_id, Active: 1 })
  return user
}

async function get_analytics_data(startDate, endDate, startTime, endTime, camera_id, camera_name, start_count, end_count, selectedanalytics,) {

  console.log(startDate, endDate, startTime, endTime, camera_id, camera_name, start_count, end_count, selectedanalytics, 'analytics');

  let data = []
  let count = 0
  for (let index = 0; index < camera_id.length; index++) {
    const obj = await User.find({ date: { $gte: startDate, $lte: endDate }, time: { $gte: startTime, $lte: endTime }, camera_id: camera_id[index], }).sort({ date: -1, time: -1 })
    data = [...data, ...obj]
    count = count + 1

    if (count == camera_id.length) {
      let arr = []

      data.map((val) => {
        selectedanalytics.map((ana) => {

          if (val.type == ana) {
            arr.push(val)
          }
        })
      })

      console.log(arr);


      if (arr.length !== 0) {
        if (start_count == 0) {
          if (arr.length >= end_count) {
            let newdata = []
            for (let index = start_count; index < end_count; index++) {
              newdata.push(arr[index])
            }

            return { "data": newdata, length: arr.length }
          } else {
            let newdata = []
            for (let index = start_count; index < arr.length; index++) {
              newdata.push(arr[index])
            }
            return { "data": newdata, length: arr.length }
          }
        } else {
          if (arr.length >= end_count) {
            let newdata = []
            for (let index = start_count; index < end_count; index++) {
              newdata.push(arr[index])
            }
            return { "data": newdata, length: arr.length }
          } else {
            let newdata = []
            for (let index = start_count; index < arr.length; index++) {
              newdata.push(arr[index])
            }
            return { "data": newdata, length: arr.length }
          }
        }
      } else {
        return { "data": arr, length: arr.length }
      }
    }
  }

}



async function get(_id) {
  const product = await User.findById(_id)
  return product
}

async function create(fields) {

  const data = await new User(fields).save()

  console.log('data', data)
  //console.log("a")

  // let response = await send_notification(fields.title, fields.msg, fields.dealer_id, fields.mobile_number)
  // console.log(response)

if(data){
  const payload = fields

  let findUser = await userModel.get(payload.user_id)

  console.log('notification id', findUser.notification_firebase_id)



  if (findUser && findUser.notification_firebase_id !== 'NONE') {
    // Send a notification to the buyer
    const message = {
        notification: {
            title: data.title,
            body: `Camera Name : ${payload.camera_name}, Alert Type : ${payload.type}, Message : ${payload.msg}`,
        },
        token: findUser.notification_firebase_id,  // Assuming `notification_id` is the correct field for the device token
    };

    try {
        let response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}
} else {
    console.error('User or notification ID not found');
}



  return data
  //return {"success":"true"}
  //return response            

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




async function send_notification(tit, msg, dealer_id, mobile_number) {

  let response = await user_data.get3(dealer_id, mobile_number)

  //  console.log(response[0].notification_id)
  const serverToken = 'AAAAov7CjKM:APA91bGrTcqgOy1FcJGYsbjdy3nkXSRDuyHU9zGkdWzFRtbI0h25RpzbnGOYOq4gbR5iZ_K1mrvNKfrw_a1y23nyFGgH1V6VWcZbVoNfY9YkCRDck638Vk47Wh1W5lzeeKOoXkYNoxCm'
  //  console.log(response)
  let notis = response.data.notification_id
  // let notis = ['fp_Zs02eRWyFfYJnFRHO57:APA91bG4YS5h9ItnAp2mevtSDA3eehG2judjn7e2umvcUtVCp7k9U0vDBvwnW88HKw6zZtx7hkIFnNM7c-AhFkH1ZX4lMOLPbA947m07TCmf4-kQGakkewodgrvKY_NQ_c7iH1AwOIA6']
  let status = "dkcbdc"

  for (i = 0; i <= notis.length - 1; i++) {
    const deviceToken = notis[i]

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key=' + serverToken
      }
    }
    const data = JSON.stringify({
      'notification': {
        'title': tit,
        'body': msg,
        "sound": "my_sound",
        "android_channel_id": "sound_channel"
        // 'image':img
      },
      'to':
        deviceToken,
      'priority': 'high',

    })

    status = await axios.post('https://fcm.googleapis.com/fcm/send', data, config)
      .then((res) => {
        console.log(`Status: ${res.status}`);
        console.log('Body: ', res.data);
        console.log('Body: ', res.data.success);
        if (res.status == "200" && res.data.success == "1") {
          return { "success": "true" }

        }
        else if (res.status == "200" && res.data.success == "0") {
          //  console.log("djjdsb")
          return { "success": "false" }

        }
        else {
          // console.log("djj22222222dsb")

          return { "success": "false" }
        }

      }).catch((err) => {
        console.error(err);
        //  console.log("djjds33333b")

        return { "success": "false" }
      })


  }
  return status



}

