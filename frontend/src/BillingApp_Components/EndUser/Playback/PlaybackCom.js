import React, { useEffect, useState, useRef } from 'react'
import moment from 'moment'
import { db_type } from '../db_config'
import Replay10RoundedIcon from '@mui/icons-material/Replay10Rounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { PAGE, STARTDATE, STARTTIME, ENDDATE, ENDTIME, APPLY, SELECT, SELECTED_CAMERAS } from '../../../store/actions'
import { useDispatch, useSelector } from 'react-redux';
import * as api from '../../Configurations/Api_Details'
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from 'axios'
import {
    Row,
    Col,
    Card,
    Table,
    Tabs,
    Tab,
    Container,
    Button,
} from "react-bootstrap";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import AWS from "aws-sdk";

import { CreateBucketCommand, S3Client, GetObjectCommand, ListBucketsCommand, DeleteBucketCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

import { ana } from './Dummeey_ana'

let loop_flag = false
let interval = ''
let seconds_color = ''
let call_once = true
let analytics_flag = false
let video_load = -1
let previous_res = -1
let nxt_time = ''
let full_url = []
let time_stamp = {}
let hour = ''
export default function Home({ apply_flag, selected_hour }) {
    console.log(selected_hour);
    const videoRef = useRef(null)
    const dispatch = useDispatch()
    const { page, startdate, starttime, enddate, endtime, apply, select, selected_cameras } = useSelector((state) => state)
    const [cameras, setcameras] = useState([])
    const [time, settime] = useState('')
    let [change_time, setchange_time] = useState('')
    const [time_change, settime_change] = useState('')
    let [time_change_flag, settime_change_flag] = useState(false)
    const [total_time, settotal_time] = useState([])
    const [slider_top, setslider_top] = useState([])
    const [slider_time, setslider_time] = useState('')
    const [motion_time, setmotion_time] = useState('')
    const [data, setdata] = useState([])
    let [current_url, setcurrent_url] = useState([])
    let [nxt_response, setnxt_response] = useState([])
    let [end_time, setend_time] = useState('')
    const [next_call, setnext_call] = useState('')
    const [calling_effect, setcalling_effect] = useState(true)
    let [chk_flag, setchk_flag] = useState(true)

    let [all_motion, setall_motion] = useState([])
    let [camera_motion, setcamera_motion] = useState({})
    let [test, settest] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9])
    let [motion_flag, setmotion_flag] = useState(false)
    const [video_set, setvideo_set] = useState(false)
    const [response_flag, setresponse_flag] = useState(false)
    let [response_progress, setresponse_progress] = useState(false)
    let [play_pause, setplay_pause] = useState(false)
    let [video_play_type, setvideo_play_type] = useState(false)
    let [camera_motion_reset_flag, setcamera_motion_reset_flag] = useState(false)
    let [motion_review_flag, setmotion_review_flag] = useState(false)
    const [motion_margin_left, setmotion_margin_left] = useState(false)
    const [buffering, setbuffering] = useState(false)

    useEffect(() => {
        if (apply_flag) {
            const parsedTime = moment(`${starttime}:00`, 'HH:mm:ss')
            // let newTime = parsedTime.add(1, 'minute')
            let newTime = parsedTime.add(1, 'seconds')
            newTime = newTime.format('HH:mm:ss')

            cameras.map((val) => {
                time_stamp = { ...time_stamp, [val._id]: `${starttime}:00` }
            })

            hour = moment(selected_hour, 'HH:mm:ss').format('HH:mm')
            setvideo_set(true)
            setnext_call(newTime)
            seconds_color = `${starttime}:00`
            settime(starttime)
            setchange_time(`${starttime}:00`)
            nxt_time = `${starttime}:00`
            setcalling_effect(!calling_effect)
            setresponse_progress(true)
            settotal_time([])
            setslider_top([])
            setcamera_motion_reset_flag(!camera_motion_reset_flag)
            setplay_pause(false)
            setresponse_flag(false)
            analytics_motion()
        }
    }, [apply])


    function analytics_motion() {
        let hor = hour.split(':')
        const parsedTime = moment(starttime, 'HH:mm')
        parsedTime.add(Number(hor[0]), 'hour')
        const newTime = parsedTime.add(Number(hor[1]), 'minutes')
        let en_time = newTime.format('HH:mm')

        let count = 0
        let all_data = []

        cameras.map((val) => {
            let data = JSON.stringify({
                "camera_id": val._id,
                "start_date": startdate,
                "start_time": `${starttime}:00`,
                "end_date": startdate,
                "end_time": `${en_time}:00`,
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: api.ANALYTICS_FOR_PLAYBACK_MOTION,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            }

            console.log({
                "camera_id": val._id,
                "start_date": startdate,
                "start_time": `${starttime}:00`,
                "end_date": startdate,
                "end_time": `${en_time}:00`,
            });

            axios.request(config)
                .then((response) => {
                    console.log(response.data);
                    count = count + 1

                    all_data.push(response.data)

                    if (cameras.length == count) {
                        console.log(all_data);
                        loop_flag = true
                        setall_motion(all_data)
                        // setall_motion([ana])
                        // console.log([ana]);
                    }
                    // console.log(response.data.analytics);
                    // response_start_length.total = response.data.length
                    // setdata(response.data.data)
                    // setanalytics(response.data.analytics)
                    // if (response.data.data.length === 0) {
                    //     setres('empty response')
                    // } else {
                    //     setres('')
                    // }
                })
                .catch((error) => {
                    console.log(error);
                })
        })

    }


    function analytics_get() {
        console.log('jhjghghg');
        let res_combain = []
        let count = 0
        let _30_sub_time = moment(nxt_time, 'HH:mm:ss')
        _30_sub_time = _30_sub_time.add(30, 'seconds')

        cameras.map((val, i) => {
            console.log('map');
            let data = JSON.stringify({
                "camera_id": val._id,
                "start_date": startdate,
                "start_time": nxt_time,
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: api.ANALYTICS_FOR_PLAYBACK,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            }

            console.log(data);

            axios.request(config)
                .then((response) => {
                    console.log(response.data);
                    if (response.data.length == 0) {
                        res_combain.push({ camera_id: val._id, video_key: 'empty' })
                    } else {
                        res_combain.push(...response.data)
                    }

                    count = count + 1
                    console.log(cameras.length, count);
                    console.log(chk_flag, video_play_type);
                    if (cameras.length === count) {
                        if (chk_flag || video_play_type) {
                            video_load = 0
                            console.log(video_load);
                            video_keyto_uri(res_combain)
                        } else {
                            video_load = 0
                            console.log(video_load);
                            setnxt_response(res_combain)
                        }
                        console.log(res_combain);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        })
    }

    useEffect(() => {
        let mtn = []
        selected_cameras.map((val) => {
            mtn = {
                ...mtn,
                [val._id]: { camera_name: val.camera_gereral_name, id: val._id, motion: [] }
            }
        })
        setcamera_motion(mtn)
        setcameras(selected_cameras)
    }, [selected_cameras, camera_motion_reset_flag])

    useEffect(() => {
        analytics_get()
    }, [calling_effect])

    function video_keyto_uri(analytics) {
        console.log('video key to url');
        let arr = []
        let tim = ''
        let nex_call = ''
        let count = 0
        let higher_time = 31
        previous_res = current_url.length
        let empty_count = 0
        full_url = []
        analytics.map(async (val) => {
            if (val.video_key != 'empty') {
                empty_count = empty_count + 1
                const s3Client = new S3Client({
                    region: "ap-south-1",
                    credentials: {
                        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
                        secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
                    },
                });

                const image_command = new GetObjectCommand({
                    Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                    Key: val.video_key,
                });

                let image_url = ''

                if (db_type == 'local') {
                    const url = val.video_key.split('localhost');
                    console.log(`${url[0]}10.147.20.214${url[1]}`);
                    image_url = `${url[0]}10.147.20.214${url[1]}`
                } else {
                    image_url = await getSignedUrl(s3Client, image_command)
                }
                arr.push({ ...val, play_url: image_url })

                current_url.push({ ...val, play_url: image_url })
                full_url.push({ ...val, play_url: image_url })
                document.getElementById(val.camera_id).src = image_url

                let val_time = val.time.split(':')

                let video_file_time = val.video_key.split('_')
                video_file_time = video_file_time[3]
                video_file_time = video_file_time.split('.')
                video_file_time = video_file_time[0]
                video_file_time = video_file_time.split('-')
                tim = `${video_file_time[0]}:${video_file_time[1]}:${video_file_time[2]}`

                const time1 = moment(seconds_color, 'HH:mm:ss');
                const time2 = moment(tim, 'HH:mm:ss');
                const difference = time1.diff(time2)
                console.log(difference);
                const duration = moment.duration(difference)
                console.log(duration);
                const duration_time = `${Math.floor(duration.asHours())}:${duration.minutes()}:${duration.seconds()}`
                console.log(`${Math.floor(duration.asHours())}:${duration.minutes()}:${duration.seconds()}`);
                const [hours, minutes, seconds] = duration_time.split(':').map(Number)

                if (moment(duration_time, 'HH:mm:ss').isBefore(moment('00:00:01', 'HH:mm:ss'))) {
                    console.log('leaser 30');
                    let tim = (hours * 3600 + minutes * 60 + seconds) - 1
                    tim = (hours * 3600 + minutes * 60 + seconds) + tim
                    let nxtTime = time1.add(tim, 'seconds')
                    nxtTime = nxtTime.format('HH:mm:ss')
                    nex_call = nxtTime
                } else if (moment(duration_time, 'HH:mm:ss').isBefore(moment('00:00:30', 'HH:mm:ss'))) {
                    console.log('greater 30');
                    let tim = moment(change_time, 'HH:mm:ss')
                    let nxtTime = tim.add(1, 'seconds')
                    nxtTime = nxtTime.format('HH:mm:ss')
                    nex_call = nxtTime
                }


                if ((hours * 3600 + minutes * 60 + seconds) < higher_time) {
                    higher_time = hours * 3600 + minutes * 60 + seconds
                }
                console.log(hours * 3600 + minutes * 60 + seconds);

                // if (time_change_flag) {
                //     tim = `${val.time}:00`
                //     const time1 = moment(`${val.time}:00`, 'HH:mm:ss');
                //     const time2 = moment(change_time, 'HH:mm:ss');
                //     const difference = time2.diff(time1);
                //     const duration = moment.duration(difference)
                //     const duration_time = `${Math.floor(duration.asHours())}:${duration.minutes()}:${duration.seconds()}`
                //     const [hours, minutes, seconds] = duration_time.split(':').map(Number)

                //     if (moment(duration_time, 'HH:mm:ss').isBefore(moment('00:01:30', 'HH:mm:ss'))) {
                //         let nxtTime = time1.add(1, 'minute')
                //         nxtTime = time1.add(30, 'seconds')
                //         nxtTime = nxtTime.format('HH:mm:ss')
                //         nex_call = nxtTime
                //     } else if (moment(duration_time, 'HH:mm:ss').isBefore(moment('00:02:00', 'HH:mm:ss'))) {
                //         nex_call = change_time
                //     }

                //     document.getElementById(val.camera_id).currentTime = hours * 3600 + minutes * 60 + seconds
                // }

                // current_url.push({ ...val, play_url: image_url })
                // console.log(val.camera_id);
                // console.log(image_url);
            } else {
                console.log('empty')
                arr.push(val)
                document.getElementById(val.camera_id).src = 'empty'
            }

            count = count + 1
            if (analytics.length == count) {
                cameras.map((val, i) => {
                    document.getElementById(val._id).currentTime = higher_time
                })

                // console.log(tim);
                // setchange_time(tim)
                // setnext_call(nex_call)
                console.log(current_url);
            }

            if (empty_count == 0) {
                setresponse_flag(true)
                setresponse_progress(false)
            }

            let analytics_count = 0
            analytics.map((val) => {
                if (val.video_key == 'empty') {
                    analytics_count = analytics_count + 1
                }
            })

            if (analytics.length == analytics_count) {
                analytics_flag = true
            }


            if (arr.length == analytics.length) {
                if (!chk_flag) {
                    // setTimeout(() => {
                    //     play_function()
                    // }, 5000);
                }
                setdata([...data, ...arr])
            }

        })
        // if (time_change_flag) {
        //     setchange_time(tim)
        //     setnext_call(nex_call)
        // }
        // settime_change_flag(false)
    }

    if (loop_flag) {
        if (time != '' && hour != '') {
            let hour_split = hour.split(':')
            let total_min = Number(hour_split[0]) * 60
            total_min = total_min + Number(hour_split[1])
            console.log(total_min);
            let flag = 0
            let innerslider_top = []
            let seconds = []
            let sequence = 0
            let time_segment = time

            let width_count = 0
            let space_flag = true
            let space_flag_index = 0

            for (let index = 0; index <= total_min; index++) {
                let innerchk = false
                flag = flag + 1
                if (flag == 16) {
                    innerchk = true
                    flag = 0
                }

                if (index != 0) {
                    const parsedTime = moment(time_segment, 'HH:mm')
                    const newTime = parsedTime.add(1, 'minutes')
                    time_segment = newTime.format('HH:mm')
                } else {
                    const parsedTime = moment(time_segment, 'HH:mm')
                    time_segment = parsedTime.format('HH:mm')
                }

                if (index == total_min) {
                    setend_time(`${time_segment}:00`)
                }

                let initial_loop = index != total_min ? 60 : 1


                for (let index = 0; index < initial_loop; index++) {
                    seconds.push(
                        <div style={{ display: 'flex' }}>
                            <div id={`${time_segment}:${index < 10 ? `0${index}` : index}`} style={{ width: '0.2px', height: '10px', backgroundColor: '#ededed', top: -5 }} name={`${time_segment}:${index < 10 ? `0${index}` : index}`} onMouseEnter={(e) => {
                                e.target.style.top = -5
                                e.target.style.width = '2px'
                                e.target.style.position = 'absolute'
                                e.target.style.height = '20px'
                                e.target.style.backgroundColor = 'black'
                                setslider_time(e.target.getAttribute('name'))
                                // console.log(e.target.getAttribute('name'));
                            }} onMouseLeave={(e) => {
                                e.target.style.height = '10px'
                                e.target.style.width = '0.2px'
                                if (moment(e.target.getAttribute('name'), 'HH:mm:ss').isBefore(moment(seconds_color, 'HH:mm:ss'))) {
                                    e.target.style.backgroundColor = 'red'
                                } else {
                                    e.target.style.backgroundColor = '#ededed'
                                }
                                e.target.style.position = 'relative'
                                e.target.style.top = 0
                            }} onClick={(e) => {
                                slider(e.target.getAttribute('name'), index)
                            }}></div>
                        </div >
                    )
                }

                width_count = width_count + 11.8
                for (let index = 0; index < all_motion.length; index++) {
                    let flag = false
                    let new_array = []
                    let new_id = ''
                    for (let index1 = 0; index1 < all_motion[index].length; index1++) {
                        new_id = all_motion[index][index1].camera_id
                        let ana_time = moment(all_motion[index][index1].motion_start_time, 'HH:mm:ss')
                        ana_time = ana_time.format('HH:mm')
                        if (ana_time == time_segment) {
                            flag = true
                            let motion_tym = all_motion[index][index1].motion_start_time.split(':')
                            // width_count = (Number(motion_tym[2]) * 0.2) + width_count

                            const startTime = moment(all_motion[index][index1].motion_start_time, 'HH:mm:ss');
                            let endTime = ''
                            let inner_index_value = ''

                            for (let inner_index = index1; inner_index < all_motion[index].length; inner_index++) {
                                if (all_motion[index][inner_index].motion_end_time != "" && moment(all_motion[index][index1].motion_start_time, 'HH:mm:ss').isBefore(moment(all_motion[index][inner_index].motion_end_time, 'HH:mm:ss'))) {
                                    endTime = moment(all_motion[index][inner_index].motion_end_time, 'HH:mm:ss')
                                    inner_index_value = inner_index
                                    break
                                }
                            }
                            // const endTime = moment(all_motion[index][index1].motion_end_time, 'HH:mm:ss');

                            let durationInSeconds = ''
                            if (endTime != '') {
                                durationInSeconds = moment.duration(endTime.diff(startTime)).asSeconds();
                                durationInSeconds = durationInSeconds * 0.2
                            } else {
                                let hor = hour.split(':')
                                const parsedTime = moment(starttime, 'HH:mm')
                                parsedTime.add(Number(hor[0]), 'hour')
                                const newTime = parsedTime.add(Number(hor[1]), 'minutes')
                                let en_time = newTime.format('HH:mm')

                                endTime = moment(`${en_time}:00`, 'HH:mm:ss')
                                durationInSeconds = moment.duration(endTime.diff(startTime)).asSeconds();
                                durationInSeconds = durationInSeconds * 0.2
                            }

                            let sub = moment(all_motion[index][index1].motion_start_time, 'HH:mm:ss')
                            sub = sub.subtract(1, seconds)

                            let margin_dur = moment.duration(sub.diff(moment(time_stamp[all_motion[index][index1].camera_id], 'HH:mm:ss'))).asSeconds();
                            margin_dur = margin_dur * 0.2

                            camera_motion[all_motion[index][index1].camera_id].motion.push(
                                <div style={{ width: `${margin_dur}px`, height: '8px', backgroundColor: 'white' }} name={`${moment(time_stamp[all_motion[index][index1].camera_id], 'HH:mm:ss').format('HH:mm:ss')}-${moment(all_motion[index][index1].motion_start_time, 'HH:mm:ss').format('HH:mm:ss')}`} onMouseEnter={(e) => {
                                    setmotion_review_flag(false)
                                    // console.log(e.target.getAttribute('name'));
                                }}></div>
                            )

                            camera_motion[all_motion[index][index1].camera_id].motion.push(
                                <div style={{ width: `${durationInSeconds}px`, height: '8px', backgroundColor: 'red' }} name={`${moment(startTime).format('HH:mm:ss')}-${moment(endTime).format('HH:mm:ss')}`} onMouseEnter={(e) => {
                                    // console.log(e.target.getAttribute('name'));
                                    // setmotion_review_flag(true)
                                    // setmotion_time(e.target.getAttribute('name'))

                                    let slider_top = document.getElementById('motion_top')
                                    slider_top.style.display = 'block'
                                    // slider_top.style.marginLeft = motion_margin_left

                                    document.getElementById('inner_text_motion').innerText = e.target.getAttribute('name')
                                }} onMouseLeave={(e) => {
                                    let slider_top = document.getElementById('motion_top')
                                    slider_top.style.display = 'none'
                                }} onClick={(e) => {
                                    slider(moment(startTime).format('HH:mm:ss'))
                                }}></div>
                            )

                            let slice_arr = all_motion[index].slice(index1, inner_index_value)

                            // all_motion[index] = [...new_array, ...slice_arr]
                            width_count = 0
                            space_flag = false

                            let add = moment(endTime, 'HH:mm:ss')
                            add = add.subtract(1, seconds)
                            time_stamp[all_motion[index][index1].camera_id] = add.format('HH:mm:ss')
                            break
                        } else {
                            new_array.push(all_motion[index][index1])
                        }

                    }

                    // if (!flag && new_id != '') {
                    //     // break
                    //     camera_motion[new_id].motion.push(
                    //         <div style={{ width: '2px', height: '8px', backgroundColor: 'black', marginRight: '9.8px' }} ></div>
                    //     )
                    // }

                }

                innerslider_top.push(
                    < div style={{ position: 'relative' }}>
                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '2px', height: innerchk || index == 0 ? '30px' : '10px', backgroundColor: 'black', marginRight: '9.8px' }} name={time_segment}></div>
                        </div>

                        {
                            innerchk || index == 0 ?
                                <div style={{ position: 'absolute', top: 13, left: 2, color: 'black' }}>
                                    <p style={{ margin: 0 }}>{time_segment}</p>
                                </div>
                                : ''
                        }
                    </div >
                )
            }

            console.log(`${time_segment}:00`);
            loop_flag = false
            settotal_time(seconds)
            setslider_top(innerslider_top)
        }
    }

    function slider(e) {
        setvideo_set(true)
        let total_hrs = hour.split(':')
        let current_time = e

        let hour_split = current_time.split(':')
        let total_min = Number(hour_split[1])
        let min = Number(time.split(':')[1])
        let current_hour = time.split(':')
        current_hour = Number(current_hour[0])

        let current_time1 = seconds_color
        let hour_split1 = current_time1.split(':')
        let total_min1 = Number(total_hrs[0]) * 60
        total_min1 = total_min1 + Number(total_hrs[1])
        let min1 = Number(time.split(':')[1])
        let hour1 = time.split(':')
        hour1 = Number(hour1[0])

        for (let index = 0; index < total_min1; index++) {
            let initial_loop = index + 1 != total_min1 ? 60 : 1

            for (let index1 = 0; index1 < initial_loop; index1++) {
                document.getElementById(`${hour1 < 10 ? `0${hour1}` : hour1}:${min1 < 10 ? `0${Number(min1)}` : Number(min1)}:${index1 < 10 ? `0${index1}` : index1}`).style.backgroundColor = '#ededed'
            }

            min1 = Number(min1) + 1

            // if (index == total_min1 - 1) {
            //     for (let index = 0; index < Number(hour_split1[2]); index++) {
            //         console.log(`${hour1 < 10 ? `0${hour1}` : hour1}:${min1 < 10 ? `0${min1}` : min1}:${index < 10 ? `0${index}` : index}`);
            //         document.getElementById(`${hour1 < 10 ? `0${hour1}` : hour1}:${min1 < 10 ? `0${min1}` : min1}:${index < 10 ? `0${index}` : index}`).style.backgroundColor = '#ededed'
            //     }
            // }

            if (min1 == 60) {
                min1 = 0
                hour1 = hour1 + 1
            }
        }


        const time_diff = moment(time, 'HH:mm');
        const time2_diff = moment(current_time, 'HH:mm');

        // Calculate the difference in minutes
        const differenceInMinutes = time2_diff.diff(time_diff, 'minutes');
        console.log(differenceInMinutes);

        for (let index = 1; index <= differenceInMinutes + 1; index++) {
            let initial_loop = index != differenceInMinutes + 1 ? 60 : Number(hour_split[2]) + 1

            for (let index1 = 0; index1 < initial_loop; index1++) {
                document.getElementById(`${current_hour < 10 ? `0${current_hour}` : current_hour}:${min < 10 ? `0${Number(min)}` : Number(min)}:${index1 < 10 ? `0${index1}` : index1}`).style.backgroundColor = 'red'
            }

            min = Number(min) + 1

            // if (index == total_min - 1) {
            //     for (let index = 0; index < Number(hour_split[2]); index++) {
            //         document.getElementById(`${current_hour < 10 ? `0${current_hour}` : current_hour}:${min < 10 ? `0${Number(min)}` : Number(min)}:${index < 10 ? `0${index}` : index}`).style.backgroundColor = 'red'
            //     }
            // }

            if (min == 60) {
                min = 0
                current_hour = current_hour + 1
            }
        }

        const time1 = moment(change_time, 'HH:mm:ss');
        const time2 = moment(current_time, 'HH:mm:ss');
        const difference = time2.diff(time1);
        const duration = moment.duration(difference)
        const duration_time = `${Math.floor(duration.asHours())}:${duration.minutes()}:${duration.seconds()}`
        seconds_color = current_time



        document.getElementById('play_icon').style.display = 'block'
        document.getElementById('pause_icon').style.display = 'none'
        setplay_pause(false)

        if (moment(duration_time, 'HH:mm:ss').isBefore(moment('00:00:30', 'HH:mm:ss'))) {
            console.log('else if con');
            const [hours, minutes, seconds] = duration_time.split(':').map(Number)
            current_url.map((val) => {
                document.getElementById(val.camera_id).pause()
                document.getElementById(val.camera_id).currentTime = hours * 3600 + minutes * 60 + seconds
            })
            clearInterval(interval)
            setnext_call(`${Number(hour_split[0]) < 10 ? `0${Number(hour_split[0])}` : Number(hour_split[0])}:${Number(hour_split[1]) < 10 ? `0${Number(hour_split[1])}` : Number(hour_split[1])}:${Number(hour_split[2]) < 10 ? `0${Number(hour_split[2])}` : Number(hour_split[2])}`)
        } else {
            console.log('else con');
            const [hours, minutes, seconds] = duration_time.split(':').map(Number)
            current_url.map((val) => {
                document.getElementById(val.camera_id).pause()
                // document.getElementById(val.camera_id).currentTime = hours * 3600 + minutes * 60 + seconds
            })
            console.log(cameras);
            clearInterval(interval)
            change_time = current_time
            // settime_change(0 * 3600 + 0 * 60 + hour_split[2])    
            time_change_flag = true
            nxt_time = `${Number(hour_split[0]) < 10 ? `0${Number(hour_split[0])}` : Number(hour_split[0])}:${Number(hour_split[1]) < 10 ? `0${Number(hour_split[1])}` : Number(hour_split[1])}:${Number(hour_split[2]) < 10 ? `0${Number(hour_split[2])}` : Number(hour_split[2])}`

            setnext_call(`${Number(hour_split[0]) < 10 ? `0${Number(hour_split[0])}` : Number(hour_split[0])}:${Number(hour_split[1]) < 10 ? `0${Number(hour_split[1])}` : Number(hour_split[1])}:${Number(hour_split[2]) < 10 ? `0${Number(hour_split[2]) + 1}` : Number(hour_split[2]) + 1}`)
            setresponse_progress(true)
            setresponse_flag(false)
            analytics_get()
        }
    }

    function play_function() {
        console.log(video_set);
        console.log(full_url);
        full_url.map((val) => {
            document.getElementById(val.camera_id).play()
            console.log('play function')
        })
        interval = setInterval(() => {
            const parsedTime = moment(seconds_color, 'HH:mm:ss')
            let newTime = parsedTime.add(1, 'second')
            let current = newTime.format('HH:mm:ss')

            if (moment(moment(current, 'HH:mm:ss')).isBefore(moment(end_time, 'HH:mm:ss'))) {

                seconds_color = current
                document.getElementById(current).style.backgroundColor = 'red'
                document.getElementById('current_time').innerText = current
                // console.log(current);
                if ((nxt_time == current) && analytics_flag) {
                    setvideo_set(true)
                }

                if (next_call == current) {
                    // const parsedTime = moment(nxt_time, 'HH:mm')
                    // let newTime = parsedTime.add(1, 'minute')
                    // newTime = newTime.format('HH:mm')

                    // let nxt = moment(`${newTime}:00`, 'HH:mm:ss')
                    // let nxtTime = nxt.add(1, 'minute')
                    // nxtTime = nxtTime.add(30, 'seconds')
                    // nxtTime = nxtTime.format('HH:mm:ss')

                    const parsedTime = moment(nxt_time, 'HH:mm:ss')
                    let newTime = parsedTime.add(30, 'second')
                    newTime = newTime.format('HH:mm:ss')

                    let nxt = moment(`${newTime}`, 'HH:mm:ss')
                    let nxtTime = nxt.add(1, 'second')
                    nxtTime = nxtTime.format('HH:mm:ss')

                    console.log(newTime, nxtTime);

                    nxt_time = newTime
                    setnext_call(nxtTime)
                    setchk_flag(false)
                    setcalling_effect(!calling_effect)
                }
            } else {
                clearInterval(interval)
            }
        }, 1000);
        call_once = true
    }

    useEffect(() => {
        if (video_set) {
            if (video_load == 0) {
                console.log('jhjhhjgjh');
                setresponse_flag(false)
                setresponse_progress(true)
                clearInterval(interval)
                video_keyto_uri(nxt_response)
            } else {
                setresponse_flag(false)
                setresponse_progress(true)
            }
        }
    }, [video_set])


    return (
        <div>

            <div style={{ backgroundColor: 'black', height: '58vh', marginBottom: '5px', overflowY: 'scroll', overflowX: 'hidden' }}>
                <Row style={{ padding: 0, margin: 0, display: 'flex', justifyContent: cameras.length == 1 ? 'center' : 'none' }}>
                    {cameras.length !== 0 ?
                        cameras.map((val, i) => {
                            // let url = ''
                            // for (let index = 0; index < current_url.length; index++) {
                            //     if (val._id == current_url[index]._id) {
                            //         url = current_url[index].play_url
                            //     }

                            // }
                            return (
                                <Col xl={cameras.length == 1 ? 6 : cameras.length == 2 ? 6 : 4} lg={cameras.length == 1 ? 6 : cameras.length == 2 ? 6 : 4} md={cameras.length == 1 ? 12 : 6} sm={12} xs={12} style={{ padding: 0, margin: 0 }}>
                                    <div id={`parrent${val._id}`} style={{ position: 'relative' }} onMouseEnter={() => {
                                        document.getElementById(`name${val._id}`).style.display = 'block'
                                        document.getElementById(`parrent${val._id}`).style.border = '1px solid red'
                                    }} onMouseLeave={() => {
                                        document.getElementById(`name${val._id}`).style.display = 'none'
                                        document.getElementById(`parrent${val._id}`).style.border = 'none'
                                    }}>
                                        <div id={`name${val._id}`} className='name_div' style={{ display: 'none', position: 'absolute', padding: '5px', width: '100%', }}>
                                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <p style={{ color: 'red', margin: 0, fontSize: '12px' }}>{val.camera_gereral_name}</p>
                                                <CloseIcon style={{ color: 'red' }} />
                                            </div>
                                        </div>

                                        <video crossorigin="anonymous" ref={videoRef} muted id={val._id} height={'100%'} width={'100%'} style={{ lineHeight: 0, objectFit: 'cover' }} src={''} onLoadedData={(e) => {
                                            if (moment(moment(seconds_color, 'HH:mm:ss')).isBefore(moment(end_time, 'HH:mm:ss'))) {
                                                let blank_div = document.getElementsByClassName('blank_div')
                                                for (let index = 0; index < blank_div.length; index++) {
                                                    blank_div[index].style.height = `${e.target.clientHeight}px`
                                                }

                                                document.getElementById(`blank${val._id}`).style.display = 'none'
                                                document.getElementById(val._id).style.display = 'block'

                                                video_load = video_load + 1

                                                if (video_load == (current_url.length - previous_res)) {

                                                    setresponse_flag(true)
                                                    setresponse_progress(false)
                                                }

                                                console.log(video_load, (current_url.length - previous_res), play_pause);
                                                if (video_load == (current_url.length - previous_res) && play_pause) {
                                                    const parsedTime = moment(seconds_color, 'HH:mm:ss')
                                                    let newTime = parsedTime.add(1, 'second')
                                                    let current = newTime.format('HH:mm:ss')
                                                    seconds_color = current
                                                    document.getElementById(current).style.backgroundColor = 'red'
                                                    document.getElementById('current_time').innerText = current

                                                    play_function()
                                                    setvideo_play_type(false)
                                                    setresponse_progress(false)
                                                }
                                            } else {
                                                clearInterval(interval)
                                            }
                                        }} onError={(e) => {
                                            // if (current_url.length == 0) {
                                            //     video_load = -1
                                            // }
                                            let blank = document.getElementById(`blank${val._id}`)
                                            blank.style.display = 'block'
                                            let vid = document.getElementById(val._id).style.display = 'none'
                                        }} onEnded={() => {
                                            if (moment(moment(seconds_color, 'HH:mm:ss')).isBefore(moment(end_time, 'HH:mm:ss'))) {
                                                console.log('if video');
                                                console.log(call_once, video_set);
                                                if (call_once && video_set) {
                                                    console.log(video_load);
                                                    if (video_load == 0) {
                                                        call_once = false
                                                        console.log('kjhhh');
                                                        video_play_type = true
                                                        setresponse_progress(true)
                                                        setresponse_flag(false)
                                                        clearInterval(interval)
                                                        video_keyto_uri(nxt_response)
                                                    } else {
                                                        console.log('else');
                                                        video_play_type = true
                                                        clearInterval(interval)
                                                        setresponse_progress(true)
                                                        setresponse_flag(false)
                                                    }
                                                }
                                            } else {
                                                console.log('else video');
                                                clearInterval(interval)
                                            }
                                        }} onWaiting={() => {
                                            current_url.map((val) => {
                                                document.getElementById(val.camera_id).pause()
                                            })
                                            clearInterval(interval)
                                            setresponse_progress(true)
                                            setresponse_flag(false)
                                            setbuffering(true)
                                        }} onPlaying={() => {
                                            if (buffering) {
                                                const parsedTime = moment(seconds_color, 'HH:mm:ss')
                                                let newTime = parsedTime.add(1, 'second')
                                                let current = newTime.format('HH:mm:ss')
                                                seconds_color = current
                                                document.getElementById(current).style.backgroundColor = 'red'
                                                document.getElementById('current_time').innerText = current

                                                play_function()
                                                setvideo_play_type(false)
                                                setresponse_progress(false)
                                                setbuffering(false)
                                            }
                                            console.log('playing');
                                        }}></video>

                                        <div id={`blank${val._id}`} className='blank_div' style={{ display: 'none' }}>
                                            <div style={{ width: '100%', height: '130px', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <p style={{ color: 'white', margin: 0 }}>No Motion Found</p>
                                            </div>
                                        </div>

                                        <div id={`progress${val._id}`} style={{ display: response_progress ? 'block' : 'none' }}>
                                            <div style={{ width: '100%', backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                                                <CircularProgress size={15} style={{ color: 'white' }} />
                                                <p style={{ color: 'white', margin: 0, marginLeft: '5px' }}>Loading...</p>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                            )
                        })
                        :
                        <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: 0, margin: 0, }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '58vh' }}>
                                <h5 style={{ color: '#e32747', fontWeight: 'bold', margin: 0 }}>No videos found!</h5>
                            </div>
                        </Col>
                    }
                </Row>
            </div>


            <div>
                <div style={{ backgroundColor: 'white', borderRadius: '15px', display: 'flex', padding: '5px' }}>

                    <div style={{ marginRight: '5px' }}>
                        <PlayArrowRoundedIcon id='play_icon' style={{ color: response_flag ? 'black' : 'lightgray', marginTop: '65px', fontSize: '40px' }} onClick={() => {

                            if (moment(moment(seconds_color, 'HH:mm:ss')).isBefore(moment(end_time, 'HH:mm:ss'))) {
                                if (response_flag) {
                                    play_function()
                                    setplay_pause(true)
                                    document.getElementById('play_icon').style.display = 'none'
                                    document.getElementById('pause_icon').style.display = 'block'
                                }
                            } else {
                                document.getElementById('play_icon').style.display = 'block'
                                document.getElementById('pause_icon').style.display = 'none'
                                clearInterval(interval)
                            }

                        }} />

                        <PauseRoundedIcon id='pause_icon' style={{ color: 'black', marginTop: '65px', fontSize: '40px', display: 'none' }} onClick={() => {
                            current_url.map((val) => {
                                document.getElementById(val.camera_id).pause()
                            })
                            clearInterval(interval)
                            setplay_pause(false)
                            document.getElementById('play_icon').style.display = 'block'
                            document.getElementById('pause_icon').style.display = 'none'
                        }} />
                    </div>

                    <div style={{ marginRight: '5px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Replay10RoundedIcon style={{ color: response_flag ? 'black' : 'lightgray', cursor: 'pointer' }} onClick={() => {
                            if (response_flag) {
                                const parsedTime = moment(seconds_color, 'HH:mm:ss')
                                let newTime = parsedTime.subtract(10, 'second')
                                let current = newTime.format('HH:mm:ss')
                                slider(current)
                            }
                        }} />
                        <p id='current_time' style={{ color: 'black', marginTop: '50px', marginBottom: 0 }}>{seconds_color}</p>
                        <p style={{ color: 'black', margin: 0, fontSize: '12px' }}>All Cameras</p>
                        <div style={{ marginTop: '20px' }}>
                            {
                                cameras.length != 0 ?
                                    !motion_flag ?
                                        <p style={{ color: 'black', margin: 0, fontSize: '12px' }}>{cameras[0].camera_gereral_name}</p>
                                        :
                                        cameras.map((val) => (
                                            <p style={{ color: 'black', margin: 0, fontSize: '12px' }}>{val.camera_gereral_name}</p>
                                        ))
                                    :
                                    <p style={{ color: 'black', margin: 0, fontSize: '12px' }}>No Cameras</p>
                            }
                        </div>
                    </div>


                    <div style={{ backgroundColor: 'white', width: '80%', overflowX: 'scroll', overflowY: 'hidden' }}>
                        <div style={{ backgroundColor: '#ededed', position: 'relative', borderTop: '2px solid black' }}>
                            <div style={{ display: 'flex' }}>

                                {
                                    slider_top
                                }
                            </div>

                        </div>

                        <div id='slider_outer_div' style={{ marginTop: '50px', position: 'relative', backgroundColor: 'orange', cursor: 'pointer' }} onMouseMove={(e) => {
                            let nativeEvent = e.nativeEvent
                            nativeEvent.preventDefault();
                            nativeEvent.stopPropagation();

                            let div = document.getElementById('slider_outer_div')
                            let rect = div.getBoundingClientRect()

                            let slider_top = document.getElementById('slider_top')
                            slider_top.style.display = 'block'
                            slider_top.style.marginLeft = `${(e.clientX - rect.left) - 35}px`
                            // console.log(e.clientX - rect.left);
                        }} onMouseLeave={(e) => {
                            let slider_top = document.getElementById('slider_top')
                            slider_top.style.display = 'none'
                        }}>
                            <div id='slider_top' style={{ position: 'absolute', top: -40, display: 'none' }}>
                                <div style={{ backgroundColor: 'black', borderRadius: '15px', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px', width: '68px' }}>
                                    <p style={{ margin: 0, color: 'white' }}>{slider_time}</p>
                                </div>
                            </div>
                            <div style={{ backgroundColor: '#ededed', display: 'flex', }}>
                                {
                                    total_time
                                }
                            </div>
                        </div>

                        <div id='motion_outer_div' style={{ marginTop: '38px', marginBottom: '10px', position: 'relative', cursor: 'pointer' }} onMouseMove={(e) => {
                            let nativeEvent = e.nativeEvent
                            nativeEvent.preventDefault();
                            nativeEvent.stopPropagation();

                            let div = document.getElementById('motion_outer_div')
                            let rect = div.getBoundingClientRect()

                            let slider_top = document.getElementById('motion_top')
                            // slider_top.style.display = 'block'
                            slider_top.style.marginLeft = `${(e.clientX - rect.left) - 73}px`
                            // slider_top.style.top = `${(e.clientY - rect.top) - 40}px`
                            // setmotion_margin_left(`${(e.clientX - rect.left) - 35}px`)
                            // console.log(e.clientY - rect.top);
                        }} onMouseLeave={(e) => {
                            let slider_top = document.getElementById('motion_top')
                            slider_top.style.display = 'none'
                        }}>
                            <div id='motion_top' style={{ position: 'absolute', top: -40, display: 'none', zIndex: 2 }}>
                                <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                                    <div style={{ backgroundColor: 'black', borderRadius: '15px', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px', width: '145px', display: 'flex', justifyContent: 'center' }}>
                                        <p id='inner_text_motion' style={{ margin: 0, color: 'white' }}>{motion_time}</p>
                                    </div>
                                    <div style={{ position: 'absolute', top: 15 }}>
                                        <ArrowDropDownIcon style={{ color: 'black' }} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '38px', marginBottom: '10px' }}>
                                {
                                    cameras.length != 0 ?
                                        !motion_flag ? ''
                                            //         <div style={{ position: 'relative', display: 'flex' }}>
                                            //             <div style={{ marginTop: '10px', display: 'flex' }}>
                                            //                 {/* <div style={{ width: `2000px`, height: '8px', backgroundColor: 'red', marginLeft: `5px` }}></div>
                                            // <div style={{ width: `1000px`, height: '8px', backgroundColor: 'blue', marginLeft: `5px` }}></div> */}
                                            //                 {
                                            //                     camera_motion[cameras[0]._id].motion.length != 0 ? camera_motion[cameras[0]._id].motion : <div style={{ width: `10px`, height: '8px', backgroundColor: 'orange', marginLeft: `0px` }}></div>
                                            //                 }
                                            //             </div>
                                            //         </div>
                                            :
                                            cameras.map((val) => {
                                                return (
                                                    <div style={{ position: 'relative', display: 'flex' }}>
                                                        <div style={{ marginTop: '10px', display: 'flex' }}>
                                                            {/* <div style={{ width: `2000px`, height: '8px', backgroundColor: 'red', marginLeft: `5px` }}></div>
                                            <div style={{ width: `1000px`, height: '8px', backgroundColor: 'blue', marginLeft: `5px` }}></div> */}
                                                            {
                                                                camera_motion[val._id].motion.length != 0 ? camera_motion[val._id].motion : <div style={{ width: `10px`, height: '8px', backgroundColor: 'orange', marginLeft: `0px` }}></div>
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        :
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <p style={{ color: 'red' }}>No Motions</p>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>

                    <div style={{ marginLeft: '5px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Replay10RoundedIcon style={{ color: response_flag ? 'black' : 'lightgray', cursor: 'pointer' }} onClick={() => {
                            if (response_flag) {
                                const parsedTime = moment(seconds_color, 'HH:mm:ss')
                                let newTime = parsedTime.add(10, 'second')
                                let current = newTime.format('HH:mm:ss')
                                slider(current)
                            }
                        }} />
                        <p style={{ color: 'black', marginTop: '50px', marginBottom: 0 }}>{end_time}</p>
                        <KeyboardArrowDownOutlinedIcon style={{ color: 'black', }} onClick={() => {
                            setmotion_flag(!motion_flag)
                        }} />
                    </div>
                </div>
            </div>
        </div>
    )
}
