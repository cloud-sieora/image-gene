const cuid = require('cuid')
const db = require('../db')
const user_data = require('./client_creation')
const axios = require('axios');
const moment = require('moment')



const User = db.model('Analytics', {
  _id: { type: String, default: cuid },
  device_id: { type: String, required: true },
  user_id: { type: String, required: true },
  site_id: { type: String, required: true },
  camera_id: { type: String, required: true },
  camera_name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  objects: { type: Object, default: [] },
  motion_start_time: { type: String, default: 'NONE' },
  motion_end_time: { type: String, default: 'NONE' },
  video_key: { type: String, default: "NONE" },
  uri: { type: String, default: "NONE" },
  empty: { type: String, default: "NONE" },
  inside: { type: Number, default: true, default: 0 },
  outside: { type: Number, default: true, default: 0 },
  vehicle_inside: { type: Number, default: true, default: 0 },
  vehicle_outside: { type: Number, default: true, default: 0 },
  male: { type: Number, default: true, default: 0 },
  female: { type: Number, default: true, default: 0 },
  heat_url: { type: Array, default: true, default: [] },

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
  get_analytics_data,
  get_analytics_date_time,
  get_analytics_for_playback,
  get_analytics_date_time_playback,
  play_back_trim,
  getAllCameraVideoUrl,
  model: User
}

async function add_new_column() {
  const user = await User.updateMany({}, { $set: { "site_id": '' } })
  return user
}
async function remove_new_column() {
  const user = await User.updateMany({}, { $unset: { "currentcy": 1 } })
  return user
}
async function list() {
  const user = await User.find({ device_id: device_id })
  return user
}

async function accounts_dashboard(startDate, endDate, startTime, endTime, camera_id, camera_name, start_count, end_count, analytic_flag) {

  let data = []
  let count = 0
  for (let index = 0; index < camera_id.length; index++) {
    const obj = await User.find({ date: { $gte: startDate, $lte: endDate }, time: { $gte: startTime, $lte: endTime }, camera_id: camera_id[index], }).sort({ date: -1, time: -1 })
    data = [...data, ...obj]
    count = count + 1

    if (count == camera_id.length) {
      let analytics_obj = []
      let analytics_num = {}

      if (analytic_flag) {
        data.map((val) => {
          if (analytics_obj.length !== 0) {
            Object.keys(val.objects).map((obj) => {
              let count1 = 0

              for (let i = 0; i < analytics_obj.length; i++) {
                if (obj === analytics_obj[i]) {
                  count1 = -1
                  analytics_num[obj] = analytics_num[obj] + 1
                  break
                } else {
                  count1 = 1
                }
              }

              if (count1 === 1) {
                analytics_obj.push(obj)
                analytics_num = { ...analytics_num, [obj]: 1 }
              }

            })
          } else {
            Object.keys(val.objects).map((obj) => {
              analytics_obj.push(obj)
              analytics_num = { ...analytics_num, [obj]: 1 }
            })
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
            return { "data": newdata, ana_length: data.length, analytics: { analytics_obj: analytics_obj, analytics_num: analytics_num, } }
          } else {
            let newdata = []
            for (let index = start_count; index < data.length; index++) {
              newdata.push(data[index])
            }
            return { "data": newdata, ana_length: data.length, analytics: { analytics_obj: analytics_obj, analytics_num: analytics_num } }
          }
        } else {
          if (data.length >= end_count) {
            let newdata = []
            for (let index = start_count - 1; index < end_count; index++) {
              newdata.push(data[index])
            }
            return { "data": newdata, ana_length: data.length, analytics: { analytics_obj: analytics_obj, analytics_num: analytics_num } }
          } else {
            let newdata = []
            for (let index = start_count - 1; index < data.length; index++) {
              newdata.push(data[index])
            }
            return { "data": newdata, ana_length: data.length, analytics: { analytics_obj: analytics_obj, analytics_num: analytics_num } }
          }
        }
      } else {
        return { "data": data, ana_length: data.length, analytics: { analytics_obj: analytics_obj, analytics_num: analytics_num } }
      }
    }
  }

}

async function get_analytics_date_time(startDate, endDate, startTime, endTime, camera_id) {
  const obj = await User.find({ date: { $gte: startDate, $lte: endDate }, time: { $gte: startTime, $lte: endTime }, camera_id: camera_id })
  return obj
}

async function get_analytics_date_time_playback(startDate, endDate, startTime, endTime, camera_id) {
  const obj = await User.find({ date: { $gte: startDate, $lte: endDate }, time: { $gte: startTime, $lte: endTime }, camera_id: camera_id })
  return obj
}

// async function get_analytics_for_playback(startDate, startTime, camera_id) {
//   const parsedTime = moment(startTime, 'HH:mm:ss')
//   const newTime = parsedTime.add(1, 'minutes')
//   let endTime = newTime.format('HH:mm:ss')
//   const obj = await User.find({ date: startDate, time: startTime, camera_id: camera_id })
//   let new_data = obj
//   let user_time = startTime.split(':')

//   if (new_data.length == 0) {
//     const sub_time = moment(startTime, 'HH:mm:ss')
//     const add_time = moment(startTime, 'HH:mm:ss')
//     const sub_two_min = sub_time.subtract(30, 'seconds')
//     // const add_two_min = add_time.add(2, 'minutes')

//     new_data = await User.find({ date: startDate, time: { $gte: sub_two_min.format('HH:mm:ss'), $lte: startTime }, camera_id: camera_id })
//     console.log(new_data, 'if condition');

//     // for (let index = 0; index < newdata.length; index++) {
//     //   let en_time = moment(newdata[index].time, 'HH:mm:ss')
//     //   let en_two_min = en_time.subtract(2, 'minutes')

//     //   if (moment(startTime, 'HH:mm:ss').isBetween(moment(newdata[index].time, 'HH:mm:ss'), moment(en_two_min, 'HH:mm:ss'))) {
//     //     new_data = [newdata[index]]
//     //     break
//     //   }
//     // }
//   }


//   return new_data
// }

async function play_back_trim(startDate, startTime, hour, camera_id) {

  console.log(startDate, startTime, hour, camera_id)
  let time = moment(`${startDate} ${startTime}`, 'YYYY-MM-DD HH:mm:ss')
  const subTime = time.subtract(1, 'minute')


  const combainTime = moment(`${startDate} ${startTime}`, 'YYYY-MM-DD HH:mm:ss')
  const addTime = combainTime.add(hour, 'hour')

  console.log(subTime.format('HH:mm:ss'), addTime.format('HH:mm:ss'), startDate, camera_id)

  let obj = await User.find({ date: startDate, time: { $gte: subTime.format('HH:mm:ss'), $lte: addTime.format('HH:mm:ss') }, camera_id: camera_id }).limit(10)

  return obj

}


async function get_analytics_for_playback(startDate, startTime, camera_id) {
  const parsedTime = moment(startTime, 'HH:mm:ss')
  let new_data = []

  let obj = await User.find({ date: startDate, time: startTime, camera_id: camera_id })

  if (obj.length == 0) {

    let combinedDateTime = moment(`${startDate} ${startTime}`, 'YYYY-MM-DD HH:mm:ss')
    const newDateTime = combinedDateTime.add(1, 'minute')
    let start_newDateTime = newDateTime.format('YYYY-MM-DD HH:mm:ss')
    start_newDateTime = start_newDateTime.split(' ')


    let end_combinedDateTime = moment(`${startDate} ${startTime}`, 'YYYY-MM-DD HH:mm:ss')
    const end_newDateTime = end_combinedDateTime.subtract(1, 'minute')
    let end_new_DateTime = end_newDateTime.format('YYYY-MM-DD HH:mm:ss')
    end_new_DateTime = end_new_DateTime.split(' ')

    let new_data = await User.find({ date: { $gte: end_new_DateTime[0], $lte: start_newDateTime[0] }, time: { $gte: end_new_DateTime[1], $lte: start_newDateTime[1] }, camera_id: camera_id })
    console.log(new_data, 'data');

    if (new_data.length == 0) {
      let data1 = await User.find({ date: end_new_DateTime[0], time: { $gte: end_new_DateTime[1], $lte: '24:00:00' }, camera_id: camera_id })
      let data2 = await User.find({ date: start_newDateTime[0], time: { $gte: '00:00:00', $lte: start_newDateTime[1] }, camera_id: camera_id })
      new_data = [...data1, ...data2]
    }
    obj = new_data
  } else {
    new_data = obj
  }

  if (obj.length !== 0) {
    obj.map((val) => {
      // let video_file_time = val.video_key.split('_')
      // video_file_time = video_file_time[3]
      // video_file_time = video_file_time.split('.')
      // video_file_time = video_file_time[0]
      // video_file_time = video_file_time.split('-')
      // video_file_time = `${video_file_time[0]}:${video_file_time[1]}:${video_file_time[2]}`

      if ((moment(startTime, 'HH:mm:ss').isBetween(moment(val.time, 'HH:mm:ss'), moment(val.empty, 'HH:mm:ss'))) || (startTime == val.empty || startTime == val.time)) {
        new_data = [val]
      }
    })
  }

  // if (new_data.length == 0) {
  //   obj.map((val) => {
  //     let video_file_time = val.video_key.split('_')
  //     video_file_time = video_file_time[3]
  //     video_file_time = video_file_time.split('.')
  //     video_file_time = video_file_time[0]
  //     video_file_time = video_file_time.split('-')
  //     video_file_time = `${video_file_time[0]}:${video_file_time[1]}:${video_file_time[2]}`

  //     const parsedTime = moment(startTime, 'HH:mm:ss')
  //     let newTime = parsedTime.add(30, 'second')
  //     let end_time = newTime.format('HH:mm:ss')

  //     if ((moment(end_time, 'HH:mm:ss').isBetween(moment(video_file_time, 'HH:mm:ss'), moment(val.time, 'HH:mm:ss'))) || (end_time == video_file_time || end_time == val.time)) {
  //       new_data = [{ next_call: video_file_time }]
  //     }
  //   })
  // }

  return new_data

}

async function get_analytics_data(startDate, endDate, startTime, endTime, camera_id, camera_name, start_count, end_count, selectedanalytics) {

  console.log(startDate, endDate, startTime, endTime, camera_id, camera_name, start_count, end_count, selectedanalytics);

  let data = []
  let count = 0
  for (let index = 0; index < camera_id.length; index++) {
    const obj = await User.find({ date: { $gte: startDate, $lte: endDate }, time: { $gte: startTime, $lte: endTime }, camera_id: camera_id[index], }).sort({ date: -1, time: -1 })
    data = [...data, ...obj]
    count = count + 1

    if (count == camera_id.length) {
      let arr = []
      function dup(arr, val_id) {
        let count = -1
        if (arr.length !== 0) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i]._id === val_id) {
              count = 1
              break
            } else {
              count = 0
            }
          }
        } else {
          count = 0
        }
        return count
      }

      data.map((val) => {
        selectedanalytics.map((ana) => {

          if (val.objects.length !== 0 && val.objects[`${ana}`] !== undefined) {
            let duplicate = dup(arr, val._id)
            if (duplicate === 0) {
              arr.push(val)
            }
          }
        })
      })


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

// async function accounts_dashboard(startDate, endDate, camera_id, camera_name, start_count, end_count, analytic_flag) {
//   const data = await User.find({ date: { $gte: startDate, $lte: endDate }, camera_id: camera_id, })

//   let analytics_obj = []
//   let analytics_num = {}

//   if (analytic_flag) {
//     data.map((val) => {
//       if (analytics_obj.length !== 0) {
//         Object.keys(val.objects).map((obj) => {
//           let count1 = 0

//           for (let i = 0; i < analytics_obj.length; i++) {
//             if (obj === analytics_obj[i]) {
//               count1 = -1
//               analytics_num[obj] = analytics_num[obj] + 1
//               break
//             } else {
//               count1 = 1
//             }
//           }

//           if (count1 === 1) {
//             analytics_obj.push(obj)
//             analytics_num = { ...analytics_num, [obj]: 1 }
//           }

//         })
//       } else {
//         Object.keys(val.objects).map((obj) => {
//           analytics_obj.push(obj)
//           analytics_num = { ...analytics_num, [obj]: 1 }
//         })
//       }
//     })
//   }

//   if (data.length !== 0) {
//     if (start_count == 0) {
//       if (data.length >= end_count) {
//         return { "data": data.splice(start_count, end_count), length: data.length, analytics: { analytics_obj: analytics_obj, analytics_num: analytics_num, camera_name: camera_name } }
//       } else {
//         return { "data": data.splice(start_count, data.length), length: data.length, analytics: { analytics_obj: analytics_obj, analytics_num: analytics_num, camera_name: camera_name } }
//       }
//     } else {
//       if (data.length >= end_count) {
//         return { "data": data.splice(start_count, end_count), length: data.length, analytics: { analytics_obj: analytics_obj, analytics_num: analytics_num, camera_name: camera_name } }
//       } else {
//         return { "data": data.splice(start_count, data.length), length: data.length, analytics: { analytics_obj: analytics_obj, analytics_num: analytics_num, camera_name: camera_name } }
//       }
//     }
//   } else {
//     return { "data": data, length: data.length, analytics: { analytics_obj: analytics_obj, analytics_num: analytics_num, camera_name: camera_name } }
//   }

// }

// async function accounts_dashboard(startDate, endDate, camera_id, camera_name,) {
//   const data = await User.find({ date: { $gte: startDate, $lte: endDate }, camera_id: camera_id, })

//   return { "data": data, length: data.length }

// }

async function get_alerts(device_id) {
  const user = await User.find({ device_id: device_id, Active: 1 })
  return user
}

async function get(_id) {
  const product = await User.findById(_id)
  return product
}

async function create(fields) {

  const user = await new User(fields).save()

  // let response = await send_notification(fields.title,fields.msg,fields.dealer_id,fields.mobile_number)
  // console.log(response)

  return user

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







async function getAllCameraVideoUrl(req, res, next) {
  try {
    let { camera_id, start_date, start_time, end_date, selected_hour } = req.body;

    // Add ':00' to start_time
    start_time = `${start_time}:00`; // Now start_time will be in HH:mm:ss format

    // Split start_time and selected_hour into hours, minutes, and seconds
    const [startHour, startMinute, startSecond] = start_time.split(':').map(Number);
    const [selectedHour, selectedMinute, selectedSecond] = selected_hour.split(':').map(Number);

    // Calculate the end time
    let endHour = startHour + selectedHour;
    let endMinute = startMinute + selectedMinute;
    let endSecond = startSecond + selectedSecond;

    // Handle overflow for minutes and seconds
    if (endSecond >= 60) {
      endMinute += Math.floor(endSecond / 60);
      endSecond = endSecond % 60;
    }
    if (endMinute >= 60) {
      endHour += Math.floor(endMinute / 60);
      endMinute = endMinute % 60;
    }

    // Format end_time as HH:mm:ss
    const end_time = [
      String(endHour).padStart(2, '0'),
      String(endMinute).padStart(2, '0'),
      String(endSecond).padStart(2, '0'),
    ].join(':')

    // Find analytics data based on camera_id, date, and the time range
    let findAnalyticsData = await User.find(
      {
        camera_id: camera_id, // Match camera ID
        date: {
          $gte: start_date,
          $lte: end_date, // Ensure end_date is within range
        },
        time: {
          $gte: start_time, // Use the updated start_time
          $lte: end_time, // Use the calculated end_time
        },
      },
      {
        camera_id: 1,
        video_key: 1,
        time: 1,
        date: 1,
        empty: 1,
        _id: 0,
      }
    );

    // Return the found data
    res.send({ status: true, data: findAnalyticsData });

  } catch (err) {
    console.log('Error:', err);
    res.send({ status: false, message: err.message });
  }
}


