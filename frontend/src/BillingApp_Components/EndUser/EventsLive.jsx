import React, { useEffect, useState, useContext, useRef } from 'react'
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
import './style.css'
import { db_type } from './db_config'
import CircularProgress from '@mui/material/CircularProgress';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';

import AnalyticsIcon from '@mui/icons-material/Analytics';
import BarChartIcon from '@mui/icons-material/BarChart';
import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import Modal from '@mui/material/Modal';

import CloseIcon from '@mui/icons-material/Close';
import VideocamIcon from '@mui/icons-material/Videocam';
import PlayCircleFilledOutlinedIcon from '@mui/icons-material/PlayCircleFilledOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Skeleton from 'react-loading-skeleton';

import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import VideoCameraBackOutlinedIcon from '@mui/icons-material/VideoCameraBackOutlined';
import { Context } from './CameraLiveView'
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import CloudOffRoundedIcon from '@mui/icons-material/CloudOffRounded';
import { PAGE, STARTDATE, STARTTIME, ENDDATE, ENDTIME, APPLY, SELECT, SELECTED_CAMERAS } from '../../store/actions'
import { useDispatch, useSelector } from 'react-redux';
import * as api from '../Configurations/Api_Details'
import DateComponent from './DateComponent';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import axios from 'axios';
import DownloadIcon from '@mui/icons-material/Download';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import EventMenu from './EventMenu';
import TuneIcon from '@mui/icons-material/Tune';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import AlarmIcon from '@mui/icons-material/Alarm';
import CardSkeleton from './Cartskeleton';


import { S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import AWS from "aws-sdk";

import { CreateBucketCommand, S3Client, GetObjectCommand, ListBucketsCommand, DeleteBucketCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import TableSkeleton from './Tableskeleton';
import tento from './tento.jpeg'


var moment = require("moment");
let adjbtn = false;
let analytics_obj = []
let analytics_num = {}
let finalflag = false
let listflag = false
let colflag = true
let delete_length = 0
let analytics_mouse = true
let date_mouse = true
export default function EventsLive({ data1, res, aditional_info, type, alarm_status, all_alert_count, res1, analytics1, res_next_data, call_next_data, list_type }) {
    const userData = JSON.parse(localStorage.getItem("userData"))
    console.log(all_alert_count);
    const digitalOceanSpaces = 'https://tentovision.sgp1.digitaloceanspaces.com'
    const bucketName = process.env.REACT_APP_AWS_BUCKET_NAME

    const [loading, setloading] = useState(false)
    let data = []
    const [data2, setdata2] = useState([])
    let [ana, setana] = useState(false)
    const [first_data, setfirst_data] = useState(data1)
    console.log(first_data)
    console.log(data1)
    const { page, startdate, starttime, enddate, endtime, apply, select, selected_cameras } = useSelector((state) => state)
    const dispatch = useDispatch()
    const [viewstart_date, setviewstart_date] = useState(false);
    const [viewend_date, setviewend_date] = useState(false);
    let split_start_date = startdate.split('-')
    let split_end_date = enddate.split('-')
    const [imguri, setimguri] = useState('');
    const [start_dateFullYear, setstart_dateFullYear] = useState(split_start_date[0]);
    const [start_dateMonth, setstart_dateMonth] = useState(split_start_date[1]);
    const [start_dateDate, setstart_dateDate] = useState(split_start_date[2]);
    const [end_dateFullYear, setend_dateFullYear] = useState(split_end_date[0]);
    const [end_dateMonth, setend_dateMonth] = useState(split_end_date[1]);
    const [end_dateDate, setend_dateDate] = useState(split_end_date[2]);
    // const { value, dispatch } = useContext(Context)
    const [smallVideo, setsmallVideo] = useState('')
    const [smallVideo_index, setsmallVideo_index] = useState(0)
    const [date, setdate] = useState('')
    const [iv, setiv] = useState(false)
    const [colcount, setcolcount] = useState(40)
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    let [finaldata, setfinaldata] = useState([])
    let [finaldate, setfinaldate] = useState('')
    const [clickbtn1, setclickbtn1] = useState(false)
    const [clickbtn2, setclickbtn2] = useState(false)
    const [clickbtn3, setclickbtn3] = useState(false)
    const [btn1, setbtn1] = useState('')
    const [ready, setready] = useState(false)
    const [url, seturl] = useState('')
    const [progress, setprogress] = useState(0)
    const [size, setSize] = useState({ left: 20, right: 50, width: 300 });
    const [moved, setmoved] = useState({ left: 10, top: 10 });
    const [outerdiv, setouterdiv] = useState({ width: '100%', height: '700px' });
    const [count, setcount] = useState(false);
    const [cameras, setcameras] = useState([]);
    const [cameras1, setcameras1] = useState([]);
    const [cameras_view, setcameras_view] = useState([]);
    const [cameras_view1, setcameras_view1] = useState([]);
    const [cameras_view2, setcameras_view2] = useState([]);
    const [selectedcameras, setselectedcameras] = useState([]);
    const [selectedcameras_orginal, setselectedcameras_orginal] = useState([]);
    let [selected_video, setselected_video] = useState([])
    let [selectedanalytics, setselectedanalytics] = useState([])
    let [selectedanalytics_original, setselectedanalytics_original] = useState([])
    let [newres, setnewres] = useState(false)
    const [toggle, settoggle] = useState(true)
    const [online_status, setonline_status] = useState(false)
    const [camera_tag, setcamera_tag] = useState(false)
    const [camera_group, setcamera_group] = useState(false)
    const [camera_box, setcamera_box] = useState(false)
    const [filter, setfilter] = useState(false)
    const [get_group_full_data, setget_group_full_data] = useState([])
    const [get_group_full_data_sort, setget_group_full_data_sort] = useState([])
    const [get_group_full_data_sort1, setget_group_full_data_sort1] = useState([])
    const [get_tag_full_data, setget_tag_full_data] = useState([])
    const [get_tag_full_data_sort, setget_tag_full_data_sort] = useState([])
    const [get_tag_full_data_sort1, setget_tag_full_data_sort1] = useState([])
    const [camera_serach, setcamera_serach] = useState([])
    const [camera_serach1, setcamera_serach1] = useState([])
    const [tag_serach, settag_serach] = useState([])
    const [group_serach, setgroup_serach] = useState([])
    let numToggle = []

    const [camera_checkbox, setcamera_checkbox] = useState([])
    const [tag_checkbox, settag_checkbox] = useState([])
    const [group_checkbox, setgroup_checkbox] = useState([])
    const [full_camera_search, setfull_camera_search] = useState('')
    const [camera_search, setcamera_search] = useState('')
    const [tag_search, settag_search] = useState('')
    const [group_search, setgroup_search] = useState('')
    const [video_uri, setvideo_uri] = useState('')
    const [image_uri, setimage_uri] = useState('')
    const [alert_text, setalert_text] = useState('')
    const [delete_download_heading, setdelete_download_heading] = useState('')
    const [delete_download_text, setdelete_download_text] = useState('')
    const [image_arr, setimage_arr] = useState([])
    const [model_image_uri, setmodel_image_uri] = useState('')

    const [scroll, setscroll] = useState(false)
    const [alert_box, setalert_box] = useState(false)
    const [alarm_type, setalarm_type] = useState('Active')
    const [date_section, setdate_section] = useState('single')
    const [delete_download_box, setdelete_download_box] = useState(false)
    const [filter_btn, setfilter_btn] = useState(false)
    const [type_btn, settype_btn] = useState(false)
    const [skeleton, setskeleton] = useState(false)
    const [t_f_alarm, sett_f_alert] = useState(0)
    const [res2, setres2] = useState('')
    const alertClose = () => setalert_box(false)
    const [duplicateData, setDuplicateData] = useState([])
    const [online_cam, setonline_cam] = useState(0)
    const [offline_cam, setoffline_cam] = useState(0)
    const [response_start_length, setresponse_end_length] = useState({ start_count: 0, end_count: 30, total: 0 })
    const delete_downloadClose = () => setdelete_download_box(false)



    useEffect(() => {
        let check = document.getElementsByClassName('analyticCheckbox')
        for (let i = 0; i < check.length; i++) {
            check[i].checked = false
        }
        setselectedanalytics([])
        finalflag = false
        analytics_mouse = true
        date_mouse = true
    }, [apply])

    function apply_can_fun() {
        setviewstart_date(false)
        setviewend_date(false)
    }

    let overview = false

    if (select === false) {
        selected_video = []
    }

    if (selectedanalytics.length === 0) {
        data = first_data
        newres = false
    } else {
        // let arr = []
        // function dup(arr, val_id) {
        //     let count = -1
        //     if (arr.length !== 0) {
        //         for (let i = 0; i < arr.length; i++) {
        //             if (arr[i]._id === val_id) {
        //                 count = 1
        //                 break
        //             } else {
        //                 count = 0
        //             }
        //         }
        //     } else {
        //         count = 0
        //     }
        //     return count
        // }

        // first_data.map((val) => {
        //     selectedanalytics.map((ana) => {

        //         if (val.objects.length !== 0 && val.objects[`${ana}`] !== undefined) {
        //             let duplicate = dup(arr, val._id)
        //             if (duplicate === 0) {
        //                 arr.push(val)
        //             }
        //         }
        //     })
        // })



        data = first_data
        // if (first_data.length === 0) {
        //     newres = true
        // } else {
        //     newres = true
        // }
        // console.log(arr);
    }


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (camera_box && !event.target.closest('.cameras-div')) {
                setcamera_box(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [camera_box]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (camera_group && !event.target.closest('.groupCheckBox-div')) {
                setcamera_group(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [camera_group]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (camera_tag && !event.target.closest('.tagCheckBox-div')) {
                setcamera_tag(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [camera_tag]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (online_status && !event.target.closest('.status-div')) {
                setonline_status(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [online_status]);


    function get_ana(analytics) {
        console.log(selected_cameras);
        newres = false
        setfirst_data([])
        setres2('')

        if (selected_cameras.length !== 0) {

            let ids = []
            selected_cameras.map((val) => {
                ids.push(val._id)
            })
            let data = JSON.stringify({
                "camera_id": ids,
                "camera_name": '',
                // startdate
                "start_date": startdate,
                "start_time": starttime,
                // enddate
                "end_date": enddate,
                "end_time": endtime,
                "start_count": response_start_length.start_count,
                "end_count": response_start_length.end_count,
                "selectedanalytics": analytics
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: type == 'motion_events' ? api.ANALYTICS_GET : api.ANALYTICS_ALERT_GET,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            }

            console.log({
                "camera_id": ids,
                "camera_name": '',
                // startdate
                "start_date": startdate,
                // enddate
                "end_date": enddate,
                "start_count": response_start_length.start_count,
                "end_count": response_start_length.end_count,
                "selectedanalytics": analytics
            });

            axios.request(config)
                .then((response) => {
                    console.log(response.data.data);
                    response_start_length.total = response.data.length
                    setfirst_data(response.data.data)
                    setfinaldata([])
                    setimage_arr([])
                    setfinaldate('')
                    colflag = true
                    setcolcount(30)
                    if (response.data.data.length === 0) {
                        setres2('empty response')
                    } else {
                        setres2('')
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        } else {
            setres2('empty response')
        }
    }

    const [image, setimage] = useState('')
    // const [startdate, setstartdate] = useState(value)
    // const [starttime, setstarttime] = useState('00:00')
    // const [endtime, setendtime] = useState(`${date1[2]}:${date1[3]}`)
    // const [enddate, setenddate] = useState(date1[1])


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: 24,
    };

    useEffect(() => {
        if (open1) {
            cameras_view.map((val, i) => {
                getimageurifunction1(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, val, i)
            })
        }
    }, [open1])



    useEffect(() => {
        setfirst_data([])
        if (type == 'motion_events') {


            analytics_obj = analytics1.analytics_obj
            analytics_num = analytics1.analytics_num



            // first_data.map((val) => {
            //     if (analytics_obj.length !== 0) {
            //         Object.keys(val.objects).map((obj) => {
            //             let count1 = 0

            //             for (let i = 0; i < analytics_obj.length; i++) {
            //                 if (obj === analytics_obj[i]) {
            //                     count1 = -1
            //                     analytics_num[obj] = analytics_num[obj] + 1
            //                     break
            //                 } else {
            //                     count1 = 1
            //                 }
            //             }

            //             if (count1 === 1) {
            //                 analytics_obj.push(obj)
            //                 analytics_num = { ...analytics_num, [obj]: 1 }
            //             }

            //         })
            //     } else {
            //         Object.keys(val.objects).map((obj) => {
            //             analytics_obj.push(obj)
            //             analytics_num = { ...analytics_num, [obj]: 1 }
            //         })
            //     }
            // })


            // Object.keys(smallVideo.objects).map((data, i) => (
            //     <Col xl={2} lg={2} md={2} sm={6} xs={6}>
            //         <div style={{ marginRight: '40px' }}>
            //             <p style={{ color: 'black', fontWeight: 'bolder', fontSize: '20px', marginBottom: '3px' }}>{data}</p>
            //             <p style={{ color: 'gray', fontSize: '18px', }}>{Math.round(smallVideo.objects[`${data}`] * 100)}%</p>
            //         </div>
            //     </Col>
            // ))
        } else {
            document.getElementById('true_alarm').disabled = false
            document.getElementById('false_alarm').disabled = false
        }

        if (data1.length !== 0) {
            finalflag = true
            listflag = true
            colflag = true
            setfirst_data(data1)
            setfinaldata([])
            setimage_arr([])
            setfinaldate('')
            setcolcount(30)
            setselectedanalytics([])
        }

    }, [data1])

    useEffect(() => {
        setres2(res1)
    }, [res1])

    useEffect(() => {
        if (res_next_data.length !== 0) {
            console.log(res_next_data);
            colflag = true
            setfirst_data([...first_data, ...res_next_data])
            setcolcount(colcount + 30)
            // setscroll(false)
        }
    }, [res_next_data])




    useEffect(() => {

        if (list_type != 'inside') {
            dispatch({ type: SELECTED_CAMERAS, value: [] })
            let data = []
            let count = 0

            let data1 = []
            let online = 0
            let offline = 0


            if (userData.position_type == 'Client' || userData.position_type == 'Client Admin') {
                const getStocksData = {
                    url: userData.position_type == 'Client' ? api.LIST_CAMERA_DATA_CLIENT_ID : userData.position_type == 'Client Admin' ? api.LIST_CAMERA_DATA_CLIENT_ADMIN_ID : api.LIST_CAMERA_DATA_USER_ID,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: userData.position_type == 'Client' ? JSON.stringify({

                        "client_id": (JSON.parse(localStorage.getItem("userData")))._id

                    }) : userData.position_type == 'Client Admin' ? JSON.stringify({

                        "client_admin_id": (JSON.parse(localStorage.getItem("userData")))._id

                    }) : JSON.stringify({

                        "site_id": (JSON.parse(localStorage.getItem("userData")))._id

                    })
                }
                axios(getStocksData)
                    .then(response => {

                        console.log(response.data);
                        setcameras(response.data)
                        setcameras1(response.data)
                        setcameras_view(response.data)
                        setDuplicateData(response.data)
                        setcameras_view1(response.data)
                        setcameras_view2(response.data)


                        let time = moment(new Date(), 'HH:mm:ss');
                        time.subtract(2, 'minutes');
                        let newTime1 = time.format('HH:mm:ss');
                        let newTime = moment(new Date()).format('HH:mm:ss');
                        response.data.map((val) => {
                            if ((moment(val.last_active_date).format('YYYY-MM-DD') == moment(new Date()).format('YYYY-MM-DD')) && (moment(val.last_active, 'HH:mm:ss').isBetween(moment(newTime1, 'HH:mm:ss'), moment(newTime, 'HH:mm:ss')))) {
                                data1.push({ ...val, camera_health: 'Online' })
                                online = online + 1
                            } else {
                                data1.push({ ...val, camera_health: 'Offline' })
                                offline = offline + 1
                            }
                        })

                        if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                            let access = userData.operation_type.filter((val) => { return val == 'Read' || val == 'All' || val == 'Edit' || val == 'Delete' })
                            if (access[0] == 'All' || access[1] == 'All' || access[2] == 'All' || access[2] == 'All') {
                                data1.map((cam, i) => {
                                    data1[i] = { ...data1[i], permission_level: 'All' }
                                })
                            } else {
                                data1.map((cam, i) => {
                                    data1[i] = { ...data1[i], permission_level: 'Read, Edit, Delete' }
                                })
                            }
                        } else {
                            userData.site_id.map((value) => {
                                let access = value.type.filter((val) => { return val == 'Read' || val == 'All' || val == 'Edit' || val == 'Delete' })
                                if (access[0] == 'All' || access[1] == 'All' || access[2] == 'All' || access[2] == 'All') {
                                    data1.map((cam, i) => {
                                        data1[i] = { ...data1[i], permission_level: 'All' }
                                    })
                                } else {
                                    data1.map((cam, i) => {
                                        data1[i] = { ...data1[i], permission_level: 'Read, Edit, Delete' }
                                    })
                                }
                            })
                        }


                        // setdata(data1)
                        setcameras(data1)
                        // setcameras1(data1)
                        console.log(data1)
                        setcameras_view(data1)
                        console.log("data 1", data1)
                        setcameras_view1(data1)
                        // setcameras_search(data1)
                        setonline_cam(online)
                        setoffline_cam(offline)
                        // setvid(true)
                        // setcamera_res(true)

                        if (data1.length == 0) {
                            setcameras_view('no_res')
                            setcameras_view1('no_res')
                        }
                        // get_camera_health(response.data)
                        if (response.data.length != 0) {
                            setselectedcameras([response.data[0]])
                            setselectedcameras_orginal([response.data[0]])
                            dispatch({ type: SELECTED_CAMERAS, value: [response.data[0]] })
                        } else {
                            setselectedcameras([])
                            setselectedcameras_orginal([])
                            dispatch({ type: SELECTED_CAMERAS, value: [] })
                        }

                        dispatch({ type: APPLY, value: !apply })
                    })
                    .catch(function (e) {
                        if (e.message === 'Network Error') {
                            alert("No Internet Found. Please check your internet connection")
                        }
                        else {
                            alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                        }

                    });

            } else if (userData.position_type == 'Site Admin') {
                (JSON.parse(localStorage.getItem("userData"))).site_id.map((val) => {
                    const getStocksData = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: api.CAMERA_LIST_BY_SITE_ID,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: { 'site_id': val.id }
                    }
                    axios(getStocksData)
                        .then(response => {
                            console.log(response.data);
                            count = count + 1
                            data.push(response.data)
                            if (count == (JSON.parse(localStorage.getItem("userData"))).site_id.length) {
                                setcameras(data)
                                setcameras1(data)
                                setcameras_view(data)
                                setcameras_view1(data)
                                setcameras_view2(data)

                                let time = moment(new Date(), 'HH:mm:ss');
                                time.subtract(2, 'minutes');
                                let newTime1 = time.format('HH:mm:ss');
                                let newTime = moment(new Date()).format('HH:mm:ss');
                                data.map((val) => {
                                    if ((moment(val.last_active_date).format('YYYY-MM-DD') == moment(new Date()).format('YYYY-MM-DD')) && (moment(val.last_active, 'HH:mm:ss').isBetween(moment(newTime1, 'HH:mm:ss'), moment(newTime, 'HH:mm:ss')))) {
                                        data1.push({ ...val, camera_health: 'Online' })
                                        online = online + 1
                                    } else {
                                        data1.push({ ...val, camera_health: 'Offline' })
                                        offline = offline + 1
                                    }
                                })

                                if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                                    let access = userData.operation_type.filter((val) => { return val == 'Read' || val == 'All' || val == 'Edit' || val == 'Delete' })
                                    if (access[0] == 'All' || access[1] == 'All' || access[2] == 'All' || access[2] == 'All') {
                                        data1.map((cam, i) => {
                                            data1[i] = { ...data1[i], permission_level: 'All' }
                                        })
                                    } else {
                                        data1.map((cam, i) => {
                                            data1[i] = { ...data1[i], permission_level: 'Read, Edit, Delete' }
                                        })
                                    }
                                } else {
                                    userData.site_id.map((value) => {
                                        let access = value.type.filter((val) => { return val == 'Read' || val == 'All' || val == 'Edit' || val == 'Delete' })
                                        if (access[0] == 'All' || access[1] == 'All' || access[2] == 'All' || access[2] == 'All') {
                                            data1.map((cam, i) => {
                                                data1[i] = { ...data1[i], permission_level: 'All' }
                                            })
                                        } else {
                                            data1.map((cam, i) => {
                                                data1[i] = { ...data1[i], permission_level: 'Read, Edit, Delete' }
                                            })
                                        }
                                    })
                                }


                                // setdata(data1)
                                setcameras(data1)
                                // setcameras1(data1)
                                console.log(data1)
                                setcameras_view(data1)
                                console.log("data 1", data1)
                                setcameras_view1(data1)
                                // setcameras_search(data1)
                                setonline_cam(online)
                                setoffline_cam(offline)
                                // setvid(true)
                                // setcamera_res(true)

                                if (data1.length == 0) {
                                    setcameras_view('no_res')
                                    setcameras_view1('no_res')
                                }
                                // get_camera_health(data)
                                if (data.length != 0) {
                                    setselectedcameras([data[0]])
                                    setselectedcameras_orginal([data[0]])
                                    dispatch({ type: SELECTED_CAMERAS, value: [data[0]] })
                                } else {
                                    setselectedcameras([])
                                    setselectedcameras_orginal([])
                                    dispatch({ type: SELECTED_CAMERAS, value: [] })
                                }
                                dispatch({ type: APPLY, value: !apply })
                            }
                        })
                        .catch(function (e) {
                            if (e.message === 'Network Error') {
                                alert("No Internet Found. Please check your internet connection")
                            }
                            else {
                                alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                            }

                        });
                })
            } else {

                let id = []
                userData.camera_id.map((val) => {
                    id.push(val.id)
                })

                const getStocksData = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: api.LIST_CAMERA_ID,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: { 'id': id }
                }
                axios(getStocksData)
                    .then(response => {
                        console.log(response.data);
                        setcameras(response.data)
                        setcameras1(response.data)
                        setcameras_view(response.data)
                        setcameras_view1(response.data)
                        setcameras_view2(response.data)

                        let time = moment(new Date(), 'HH:mm:ss');
                        time.subtract(2, 'minutes');
                        let newTime1 = time.format('HH:mm:ss');
                        let newTime = moment(new Date()).format('HH:mm:ss');
                        response.data.map((val) => {
                            if ((moment(val.last_active_date).format('YYYY-MM-DD') == moment(new Date()).format('YYYY-MM-DD')) && (moment(val.last_active, 'HH:mm:ss').isBetween(moment(newTime1, 'HH:mm:ss'), moment(newTime, 'HH:mm:ss')))) {
                                data1.push({ ...val, camera_health: 'Online' })
                                online = online + 1
                            } else {
                                data1.push({ ...val, camera_health: 'Offline' })
                                offline = offline + 1
                            }
                        })

                        if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                            let access = userData.operation_type.filter((val) => { return val == 'Read' || val == 'All' || val == 'Edit' || val == 'Delete' })
                            if (access[0] == 'All' || access[1] == 'All' || access[2] == 'All' || access[2] == 'All') {
                                data1.map((cam, i) => {
                                    data1[i] = { ...data1[i], permission_level: 'All' }
                                })
                            } else {
                                data1.map((cam, i) => {
                                    data1[i] = { ...data1[i], permission_level: 'Read, Edit, Delete' }
                                })
                            }
                        } else {
                            userData.site_id.map((value) => {
                                let access = value.type.filter((val) => { return val == 'Read' || val == 'All' || val == 'Edit' || val == 'Delete' })
                                if (access[0] == 'All' || access[1] == 'All' || access[2] == 'All' || access[2] == 'All') {
                                    data1.map((cam, i) => {
                                        data1[i] = { ...data1[i], permission_level: 'All' }
                                    })
                                } else {
                                    data1.map((cam, i) => {
                                        data1[i] = { ...data1[i], permission_level: 'Read, Edit, Delete' }
                                    })
                                }
                            })
                        }


                        // setdata(data1)
                        setcameras(data1)
                        // setcameras1(data1)
                        console.log(data1)
                        setcameras_view(data1)
                        console.log("data 1", data1)
                        setcameras_view1(data1)
                        // setcameras_search(data1)
                        setonline_cam(online)
                        setoffline_cam(offline)
                        // setvid(true)
                        // setcamera_res(true)

                        if (data1.length == 0) {
                            setcameras_view('no_res')
                            setcameras_view1('no_res')
                        }

                        // get_camera_health(response.data)
                        if (response.data.length != 0) {
                            setselectedcameras([response.data[0]])
                            setselectedcameras_orginal([response.data[0]])
                            dispatch({ type: SELECTED_CAMERAS, value: [response.data[0]] })
                        } else {
                            setselectedcameras([])
                            setselectedcameras_orginal([])
                            dispatch({ type: SELECTED_CAMERAS, value: [] })
                        }
                        dispatch({ type: APPLY, value: !apply })
                    })
                    .catch(function (e) {
                        if (e.message === 'Network Error') {
                            alert("No Internet Found. Please check your internet connection")
                        }
                        else {
                            alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                        }

                    });
            }
        } else {
            const camera_details = JSON.parse(localStorage.getItem('cameraDetails'))
            dispatch({ type: SELECTED_CAMERAS, value: [camera_details] })
        }
    }, [])



    function get_camera_health(cameras_res) {
        let data1 = []
        let count = 0
        let online = 0
        let offline = 0

        if (db_type == 'local') {
            // setdata(data1)
            setcameras(cameras_res)
            // setcameras1(data1)
            console.log(cameras_res)
            setcameras_view(cameras_res)
            console.log("data 1", cameras_res)
            setcameras_view1(cameras_res)
            // setcameras_search(data1)
            setonline_cam(online)
            setoffline_cam(offline)
            // setvid(true)
            // setcamera_res(true)

            if (cameras_res.length == 0) {
                setcameras_view('no_res')
                setcameras_view1('no_res')
            }
        } else {
            cameras_res.map((val) => {
                setskeleton(false)
                const getStocksData = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `${api.CAMERAS_HEALTH}${val.stream_id}/stream-info`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }

                console.log(getStocksData)
                axios(getStocksData)
                    .then(response => {
                        console.log(response.data);
                        setskeleton(true)
                        count = count + 1
                        data1.push({ ...val, camera_health: response.data.length !== 0 ? 'Online' : 'Offline' })
                        if (response.data.length !== 0) {
                            online = online + 1
                        } else {
                            offline = offline + 1
                        }

                        if (count == cameras_res.length) {

                            if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                                let access = userData.operation_type.filter((val) => { return val == 'Read' || val == 'All' || val == 'Edit' || val == 'Delete' })
                                if (access[0] == 'All' || access[1] == 'All' || access[2] == 'All' || access[2] == 'All') {
                                    data1.map((cam, i) => {
                                        data1[i] = { ...data1[i], permission_level: 'All' }
                                    })
                                } else {
                                    data1.map((cam, i) => {
                                        data1[i] = { ...data1[i], permission_level: 'Read, Edit, Delete' }
                                    })
                                }
                            } else {
                                userData.site_id.map((value) => {
                                    let access = value.type.filter((val) => { return val == 'Read' || val == 'All' || val == 'Edit' || val == 'Delete' })
                                    if (access[0] == 'All' || access[1] == 'All' || access[2] == 'All' || access[2] == 'All') {
                                        data1.map((cam, i) => {
                                            data1[i] = { ...data1[i], permission_level: 'All' }
                                        })
                                    } else {
                                        data1.map((cam, i) => {
                                            data1[i] = { ...data1[i], permission_level: 'Read, Edit, Delete' }
                                        })
                                    }
                                })
                            }


                            // setdata(data1)
                            setcameras(data1)
                            // setcameras1(data1)
                            console.log(data1)
                            setcameras_view(data1)
                            console.log("data 1", data1)
                            setcameras_view1(data1)
                            // setcameras_search(data1)
                            setonline_cam(online)
                            setoffline_cam(offline)
                            // setvid(true)
                            // setcamera_res(true)

                            if (data1.length == 0) {
                                setcameras_view('no_res')
                                setcameras_view1('no_res')
                            }
                        }
                    })
                    .catch(function (e) {

                        if (e.message === 'Network Error') {
                            alert("No Internet Found. Please check your internet connection")
                        }
                        else {
                            alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                        }

                    });
            })
        }
    }


    // const convertvideo = async (uri) => {
    //     if (ready === true) {
    //         ffmpeg.FS('writeFile', 'test.avi', await fetchFile(uri));
    //         await ffmpeg.run('-i', 'test.avi', '-vcodec', 'h264', 'test.mp4');
    //         const data = ffmpeg.FS('readFile', 'test.mp4');
    //         const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    //         console.log(url);
    //         seturl(url)
    //         setsmallVideo({ ...smallVideo, video_url: url })
    //         setready(false)
    //     }
    //     // console.log(uri);
    // }

    // useEffect(() => {
    //     getdata(startdate,enddate)

    //     window.addEventListener('scroll', handleScrollToElement)

    //     return () => {
    //         window.removeEventListener("scroll", handleScrollToElement);
    //     };

    // }, [apply])

    // function getdata(startdate,enddate) {
    //     let pathName = window.location.pathname;
    //     let arr = pathName.split('/')

    //     setdata([])

    //     const axios = require('axios');
    //     let data = JSON.stringify({
    //         "device_id": "T0001",
    //         "camera_name": `${arr[arr.length - 1]}`,
    //         "start_date": startdate,
    //         "end_date": enddate
    //     });

    //     let config = {
    //         method: 'post',
    //         maxBodyLength: Infinity,
    //         url: 'http://tentovision.cloudjiffy.net/analytics_api_list_by_date/',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         data: data
    //     };

    //     axios.request(config)
    //         .then((response) => {
    //             // console.log(JSON.stringify(response.data.data));
    //             console.log(JSON.stringify(response.data.data));
    //             // let arr1 = []
    //             // let arr = []

    //             setfinaldata([])
    //             setfinaldate('')
    //             setdata(response.data.data)
    //             colflag=false
    //             // response.data.data.map((data, j) => {

    //             //   if (arr.length != 0) {
    //             //     arr.map((val) => {
    //             //       let count = 0
    //             //       if (data.date != val) {
    //             //         count = count + 1
    //             //       } else {
    //             //         count = count - 1
    //             //       }

    //             //       if (count === arr.length) {
    //             //         arr.push(data.date)
    //             //       }
    //             //     })

    //             //   } else {
    //             //     arr.push(data.date)
    //             //   }


    //             // })

    //             // response.data.data.map((data, j) => {
    //             //   arr.map((val, i) => {
    //             //     if (data.date === val) {

    //             //       if (arr1[i] === undefined) {
    //             //         let arr = []
    //             //         arr.push(data)
    //             //         arr1[i] = arr
    //             //       } else {
    //             //         arr1[i].push(data)
    //             //       }
    //             //     }
    //             //   })
    //             // })
    //             // setdata(arr1)
    //             // setarr(arr1)
    //         })
    //         .catch((error) => {
    //             // let div = document.getElementById('videotech')
    //             // div.style.display = 'block'
    //             console.log(error);
    //         })
    // }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOpen1 = () => setOpen1(true);
    const handleClose1 = () => {
        setOpen1(false)
        setcamera_box(false)
        setcamera_tag(false)
        setcamera_group(false)
        setonline_status(false)

    };

    const handleScrollToElement = (event) => {
        // console.log(window.pageYOffset);
        // console.log(window.innerHeight);
        // console.log(main.clientHeight);
        let main = document.getElementById('main')


        // console.log(document.documentElement.scrollWidth);
        // console.log(window.pageYOffset);
        // console.log(document.documentElement.clientWidth);


        const { scrollWidth, scrollLeft, clientWidth } = event.target;
        const isBottomReached = ((document.documentElement.clientWidth - Math.round(window.pageYOffset)) < (document.documentElement.clientWidth - 1200));
        // console.log((document.documentElement.clientWidth - Math.round(window.pageYOffset)) < (document.documentElement.clientWidth -1200));
        // console.log(clientWidth);

        if (isBottomReached && scroll) {
            // You have reached the bottom of the container
            console.log('kjjhghgf');
            colflag = true
            setcolcount(colcount + 30)
            setscroll(false)
        }
        getOffset()
        // console.log(main.scrollHeight);
    }

    // (colcount <= data.length ? colcount : data.length)
    // (colcount === 40 ? 0 : colcount - 40)

    async function final_datafunction() {
        let finaldate1 = finaldate
        let datearr = []
        let image_array = image_arr
        console.log(image_array);
        colflag = false

        for (let index = 0; index < data.length; index++) {
            if (datearr.length != 0) {
                let flag = false
                for (let index1 = 0; index1 < datearr.length; index1++) {
                    if (datearr[index1].date == data[index].date) {
                        flag = false
                        datearr[index1].value = [...datearr[index1].value, data[index]]
                        break
                    } else {
                        flag = true
                    }
                }

                if (flag) {
                    datearr.push({ date: data[index].date, value: [data[index]] })
                }
            } else {
                datearr.push({ date: data[index].date, value: [data[index]] })
            }

        }

        let first_data = []
        datearr.map((val) => {
            first_data = [...first_data, ...val.value]
        })



        // for (let i = (colcount === 30 ? 0 : colcount - 30); i < (colcount <= first_data.length ? colcount : first_data.length); i++) {
        //     let image_uri = await getimageurifunction(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, first_data[i])
        //     image_array.push(image_uri)
        // }



        for (let i = (colcount === 30 ? 0 : colcount - 30); i < (colcount <= first_data.length ? colcount : first_data.length); i++) {

            if (finaldata.length > 1 && i > 1) {

                if (first_data[i].date != first_data[i - 1].date) {
                    finaldata.push(
                        <Col xl={12} lg={12} md={12} sm={12} xs={12} key={i}>
                            <h2 style={{ color: 'grey', fontFamily: 'Poppins-SemiBold', fontSize: 20 }}>{moment(first_data[i].date).format('dddd, MMMM D YYYY')}</h2>
                        </Col>
                    )
                }
            } else if (finaldata.length == 1 || finaldata.length == 0) {
                finaldata.push(
                    <Col xl={12} lg={12} md={12} sm={12} xs={12} key={i}>
                        <h2 style={{ color: 'grey', fontFamily: 'Poppins-SemiBold', fontSize: 20 }}>{moment(first_data[i].date).format('dddd, MMMM D YYYY')}</h2>
                    </Col>
                )
            }


            if (true) {
                finaldata.push(type == 'motion_events' ?
                    <Col xl={3} lg={6} md={6} sm={12} xs={12} key={first_data[i]._id} style={{ backgroundColor: 'white', paddingLeft: '5px', paddingTop: '5px', paddingRight: 0, minHeight: '100px' }} >



                        <div style={{ backgroundColor: 'black', position: 'relative', width: '100%', height: '100%', cursor: 'pointer', }}
                            onMouseEnter={(e) => {

                                if (document.getElementById(`tech${i}`).style.display != 'block') {
                                    // document.getElementById(`vid_outer`).width = document.getElementById(`img${i}`).width
                                    // document.getElementById(`vid_outer`).style.height = '50px'

                                    // getinstanturifunction(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, first_data[i].video_key, i)
                                    document.getElementById(`vid_outer${i}`).style.maxHeight = `${document.getElementById(`img${i}`).height}px`
                                    let hoverImg = document.getElementById(`img${i}`)
                                    hoverImg.style.transform = 'scale(1.02)'

                                }


                            }} onMouseLeave={() => {
                                let img = document.getElementById(`img${i}`)
                                img.style.display = 'block'
                                img.style.transform = 'scale(1)'

                                let vid = document.getElementById(`vid${i}`)
                                vid.style.display = 'none'

                            }} onClick={() => {
                                //    window.history.replaceState(null, null, "/Home/Home/"+data)
                                //    window.location.reload();
                                console.log(first_data[i]);
                                if (select != true) {
                                    setsmallVideo(first_data[i])
                                    setmodel_image_uri(document.getElementById(`img${i}`).src)
                                    console.log(first_data[i])
                                    console.log({ ...first_data[i], video_url: '' });
                                    const moment = require('moment')
                                    let now = moment(first_data[i].date)
                                    setdate(now.format('dddd, MMMM D YYYY'))
                                    geturifunction(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, first_data[i].video_key, first_data[i]
                                    )
                                    handleOpen()
                                    // load(data[i])
                                } else {
                                    let count = 0
                                    for (let j = 0; j < selected_video.length; j++) {
                                        if (selected_video[j]._id === first_data[i]._id) {
                                            let div = document.getElementById(`blur${i}`)
                                            div.style.display = 'block'

                                            let div1 = document.getElementById(`blurdiv${i}`)
                                            div1.style.display = 'none'

                                            selected_video.splice(j, 1)
                                            setcount((old) => !old)
                                            count = count - 1
                                        } else {
                                            count = count + 1
                                        }
                                    }

                                    if (count === selected_video.length) {
                                        let div = document.getElementById(`blur${i}`)
                                        div.style.display = 'none'

                                        let div1 = document.getElementById(`blurdiv${i}`)
                                        div1.style.display = 'block'

                                        selected_video.push(first_data[i])
                                        setsmallVideo(first_data[i])
                                    }
                                }
                                console.log(selected_video);

                            }}>

                            <div style={{ display: select === true ? 'block' : 'none' }}>
                                <div id={`blur${i}`} style={{ display: select === true ? 'block' : 'none', position: 'absolute', backgroundColor: '#c9cbcb', top: 0, left: 0, right: 0, bottom: 0, height: '100%', width: '100%', opacity: 0.8, zIndex: 1 }}>
                                </div>
                            </div>

                            <div style={{ display: select === true ? 'block' : 'none' }}>
                                <div id={`blurdiv${i}`} style={{ display: select === true ? 'none' : 'block', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, }}>
                                    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <p style={{ backgroundColor: 'black', color: 'white', padding: '5px', fontWeight: 'bold', borderRadius: '5px' }}><DoneOutlinedIcon />Selected</p>
                                    </div>
                                </div>
                            </div>

                            <div id={`vid_outer${i}`}>
                                <video crossorigin="anonymous" id={`vid${i}`} loop style={{ lineHeight: 0, display: 'none', width: '100%', height: '100%' }} onPlay={() => {

                                    let div3 = document.getElementById(`div2${i}`)
                                    div3.style.display = 'none'

                                }}

                                    onWaiting={() => {

                                        let div3 = document.getElementById(`div2${i}`)
                                        div3.style.display = 'block'
                                    }}

                                    onPlaying={() => {

                                        let div3 = document.getElementById(`div2${i}`)
                                        div3.style.display = 'none'
                                    }}

                                    onPause={() => {

                                        let div3 = document.getElementById(`div2${i}`)
                                        div3.style.display = 'none'
                                    }}

                                    onError={() => {

                                        let div3 = document.getElementById(`div2${i}`)
                                        div3.style.display = 'none'

                                    }}></video>
                            </div>


                            <div id={`div2${i}`} style={{ display: 'none', position: 'absolute', top: '83%', width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', width: '100%', padding: '5px' }}>
                                    <CircularProgress size={'15px'} style={{ color: 'white' }} />
                                    <p style={{ color: 'white', marginLeft: '10px', marginBottom: 0 }}>Loading</p>
                                </div>
                            </div>

                            <img crossorigin="anonymous" id={`img${i}`} src={first_data[i].uri} width={'100%'} style={{ lineHeight: 0, display: 'none', }}
                                onError={() => {
                                    console.log(document.getElementById(`img${i}`).src, 'imagepath');
                                    console.log(image_array[i]);
                                    let tech = document.getElementById(`tech${i}`)
                                    tech.style.display = 'block'
                                }}
                                onLoad={() => {

                                    let loadimg = document.getElementById(`img${i}`)
                                    loadimg.style.display = 'block'

                                    let tech = document.getElementById(`tech${i}`)
                                    tech.style.display = 'none'
                                }}
                            ></img>


                            {/* <div id={`loadimg${i}`} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: '100%px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                <CircularProgress size={'30px'} style={{ color: 'white' }} />
                            </div> */}

                            <div id={`tech${i}`} style={{ display: 'block' }}>
                                <div style={{ position: 'absolute', bottom: 0, top: 0, left: 0, right: 0, width: '100%', height: '100%', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                    <HideImageOutlinedIcon style={{ color: 'gray' }} />
                                    <p style={{ color: 'white', margin: '0px' }}>No thumbnail</p>
                                    <p style={{ color: 'white', margin: '0px', fontSize: '10px' }}>Try again later!</p>
                                </div>
                            </div>

                            <div style={{ position: 'absolute', backgroundColor: 'rgba(0,0,0,0.7)', top: 5, left: 5, right: 0, bottom: 0, height: '28px', width: '80px', padding: '5px', borderRadius: '5px' }}>
                                <p id={`date${i}`} style={{ color: 'white', fontWeight: 'bolder' }}>{first_data[i].time}</p>
                            </div>


                        </div>

                        {/* {videoFlag === 0 ?
                  <div style={{ position: 'absolute', bottom: 0, top: 0, left: 0, right: 0, width: '100%', height: '100%', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <VideocamOffOutlinedIcon style={{ color: 'gray' }} />
                    <p style={{ color: 'white' }}>No internet</p>
                  </div> : ''} */}
                    </Col >
                    :
                    <Col xl={12} lg={12} md={12} sm={12} key={first_data[i]._id} style={{ backgroundColor: 'white', paddingLeft: '5px', paddingTop: '5px', paddingRight: '20px' }}   >
                        <div style={{ border: '1px solid grey', borderRadius: '5px', padding: '5px', marginBottom: '10px' }}
                            id={`parentDiv${i}`}
                            onMouseEnter={() => {
                                // if(document.getElementById(`tech${i}`).style.display != 'block'){
                                let hoverElement = document.getElementById(`parentDiv${i}`)
                                hoverElement.style.transform = 'scale(1.01)'
                                hoverElement.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                                // }
                            }}
                            onMouseLeave={() => {
                                let hoverElement = document.getElementById(`parentDiv${i}`)
                                hoverElement.style.transform = 'scale(1)'
                                hoverElement.style.boxShadow = '0 0 0'
                            }}

                        >
                            <div style={{ display: 'flex' }}  >
                                <div style={{ position: 'relative' }}>
                                    <div
                                    // onLoad={() => {
                                    //     let loadimg = document.getElementById(`loadimg${i}`)
                                    //     loadimg.style.display = 'none'
                                    // }}
                                    >
                                        <img crossorigin="anonymous" id={`img${i}`} src={first_data[i]} style={{ lineHeight: 0, display: 'none', height: '110px', cursor: 'pointer', width: '170px', objectFit: 'cover' }} onMouseEnter={() => {

                                            if (document.getElementById(`tech${i}`).style.display != 'block') {
                                                document.getElementById(`vid${i}`).width = document.getElementById(`img${i}`).width
                                                document.getElementById(`div2${i}`).width = `${document.getElementById(`img${i}`).width}px`

                                                let hoverItem = document.getElementById(`div2${i}`)
                                                hoverItem.style.border = '3px solid red'

                                                // getinstanturifunction(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, first_data[i].video_key, i)

                                            }


                                        }}
                                            onError={() => {
                                                let tech = document.getElementById(`tech${i}`)
                                                tech.style.display = 'block'
                                            }} onLoad={() => {

                                                let img = document.getElementById(`img${i}`)
                                                img.style.display = 'block'

                                                let tech = document.getElementById(`tech${i}`)
                                                tech.style.display = 'none'
                                            }}
                                        ></img>
                                    </div>

                                    {/* <div id={`loadimg${i}`} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: '100%px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                <CircularProgress size={'30px'} style={{ color: 'white' }} />
                            </div> */}

                                    <video crossorigin="anonymous" loop id={`vid${i}`} height={'110px'} style={{ lineHeight: 0, display: 'none', objectFit: 'cover' }} onPlay={() => {

                                        let div3 = document.getElementById(`div2${i}`)
                                        div3.style.display = 'none'

                                    }}
                                        onMouseLeave={() => {
                                            let img = document.getElementById(`img${i}`)
                                            img.style.display = 'block'

                                            let vid = document.getElementById(`vid${i}`)
                                            vid.style.display = 'none'

                                        }}

                                        onWaiting={() => {

                                            let div3 = document.getElementById(`div2${i}`)
                                            div3.style.display = 'block'
                                        }}

                                        onPlaying={() => {

                                            let div3 = document.getElementById(`div2${i}`)
                                            div3.style.display = 'none'
                                        }}

                                        onPause={() => {

                                            let div3 = document.getElementById(`div2${i}`)
                                            div3.style.display = 'none'
                                        }}

                                        onError={() => {

                                            let div3 = document.getElementById(`div2${i}`)
                                            div3.style.display = 'none'

                                        }}></video>

                                    <div id={`div2${i}`} style={{ display: 'none', position: 'absolute', top: '66%', width: '170px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', width: '100%', padding: '5px' }}>
                                            <CircularProgress size={'15px'} style={{ color: 'white' }} />
                                            <p style={{ color: 'white', marginLeft: '10px', marginBottom: 0 }}>Loading</p>
                                        </div>
                                    </div>

                                    <div id={`tech${i}`} style={{ display: 'block', width: '170px', height: '110px' }}>
                                        <div style={{ position: 'absolute', bottom: 0, top: 0, left: 0, right: 0, height: '110px', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                                            <Skeleton width={170} height={120} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ color: 'black', marginLeft: '20px', display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>

                                    {/* <div>
                                        <p>ALERT FROM TENTOVISION</p>
                                        <p style={{ marginBottom: '0px' }}>Camera 1</p>
                                        <p style={{ marginBottom: '0px' }}>{moment('01-01-2023').format("DD-MM-YYYY")} at {moment('01:05:28').format("hh:mm:ss")}</p>
                                        <p style={{ marginBottom: '0px', color: '#11df11' }}>Person Detected</p>
                                    </div> */}
                                    <div>
                                        <p>{first_data[i].title}</p>
                                        <p style={{ marginBottom: '0px' }}>{first_data[i].camera_name}</p>
                                        <p style={{ marginBottom: '0px' }}>{moment(first_data[i].date).format("DD-MM-YYYY")} at {first_data[i].time}</p>
                                        <p style={{ marginBottom: '0px' }}>{first_data[i].type.charAt(0).toUpperCase() + first_data[i].type.slice(1)}, {first_data[i].class.charAt(0).toUpperCase() + first_data[i].class.slice(1)}</p>
                                        <p style={{ marginBottom: '0px', color: '#11df11' }}>{first_data[i].msg}</p>
                                    </div>

                                    <div style={{ display: 'flex' }}>
                                        <button id={`download${i}`} style={{ colour: 'white', backgroundColor: '#e32747', color: 'white', border: '1px solid grey', borderRadius: '5px', padding: '10px', display: 'flex', alignItems: 'center', marginBottom: '5px', marginRight: '5px', marginLeft: '5px' }} onClick={() => {
                                            if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                                                let access = userData.operation_type.filter((val) => { return val == 'Read' || val == 'All' })
                                                if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Read' || access[1] == 'Read') {
                                                    generate_urifor_download(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, first_data[i])
                                                } else {
                                                    setalert_box(true)
                                                    setalert_text('Your access level does not allow you to download videos.')

                                                }
                                            } else {
                                                let cam_name = ''

                                                userData.site_id.map((value) => {
                                                    let access = value.type.filter((val) => { return val == 'Read' || val == 'All' })
                                                    if (value.id == smallVideo.site_id) {
                                                        if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Read' || access[1] == 'Read') {
                                                            generate_urifor_download(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, first_data[i])
                                                        } else {
                                                            cam_name = `${cam_name} ${smallVideo.camera_name}`
                                                        }
                                                    }
                                                })

                                                if (cam_name !== '') {
                                                    setalert_box(true)
                                                    setalert_text(`Your access level does not allow you to download these (${cam_name}) videos.`)

                                                }
                                            }
                                        }}><DownloadIcon /></button>

                                        <button id={`eye${i}`} style={{ colour: 'white', backgroundColor: '#e32747', color: 'white', border: '1px solid grey', borderRadius: '5px', padding: '10px', display: 'flex', alignItems: 'center', marginBottom: '5px', marginRight: '5px', marginLeft: '5px' }} onClick={() => {
                                            //    window.history.replaceState(null, null, "/Home/Home/"+data)
                                            //    window.location.reload();
                                            console.log(first_data[i]);
                                            setsmallVideo_index(i)
                                            if (select != true) {
                                                setsmallVideo(first_data[i])
                                                setmodel_image_uri(document.getElementById(`img${i}`).src)
                                                const moment = require('moment')
                                                let now = moment(first_data[i].date)
                                                setdate(now.format('dddd, MMMM D YYYY'))
                                                let str_time = moment(first_data[i].time, 'HH:mm:ss')
                                                str_time = str_time.add(30, 'seconds')

                                                let en_time = moment(first_data[i].time, 'HH:mm:ss')
                                                en_time = en_time.subtract(30, 'seconds')

                                                let data = JSON.stringify({
                                                    "camera_id": first_data[i].camera_id,
                                                    "start_date": startdate,
                                                    "end_date": enddate,
                                                    "start_time": en_time.format('HH:mm:ss'),
                                                    "end_time": str_time.format('HH:mm:ss')
                                                });

                                                let config = {
                                                    method: 'post',
                                                    maxBodyLength: Infinity,
                                                    url: api.ANALYTICS_GET_DATE_TIME,
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    data: data
                                                }

                                                axios.request(config)
                                                    .then((response) => {
                                                        console.log(response.data);
                                                        let data = ''

                                                        for (let index = 0; index < response.data.length; index++) {
                                                            if (moment(first_data[i].time, 'HH:mm:ss').isBetween(moment(response.data[index].time, 'HH:mm:ss'), moment(response.data[index].empty
                                                                , 'HH:mm:ss'))) {
                                                                data = response.data[index].video_key
                                                                break
                                                            }
                                                        }
                                                        geturifunction(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, data, first_data[i])
                                                        handleOpen()
                                                    })
                                                    .catch((error) => {
                                                        console.log(error);
                                                    })

                                                // load(data[i])
                                            } else {
                                                let count = 0
                                                for (let j = 0; j < selected_video.length; j++) {
                                                    if (selected_video[j]._id === first_data[i]._id) {
                                                        let div = document.getElementById(`blur${i}`)
                                                        div.style.display = 'block'

                                                        let div1 = document.getElementById(`blurdiv${i}`)
                                                        div1.style.display = 'none'

                                                        selected_video.splice(j, 1)
                                                        setcount((old) => !old)
                                                        count = count - 1
                                                    } else {
                                                        count = count + 1
                                                    }
                                                }

                                                if (count === selected_video.length) {
                                                    let div = document.getElementById(`blur${i}`)
                                                    div.style.display = 'none'

                                                    let div1 = document.getElementById(`blurdiv${i}`)
                                                    div1.style.display = 'block'

                                                    selected_video.push(first_data[i])
                                                    setsmallVideo(first_data[i])
                                                }
                                            }
                                            console.log(selected_video);

                                        }}><RemoveRedEyeIcon /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col >
                )
                getimageurifunction(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, first_data[i], i)
            }
            finaldate1 = first_data[i].date
        }

        overview = true
        setimage_arr(image_array)
        setscroll(true)
        setfinaldate(finaldate1)
    }


    console.log(first_data.length, colflag, listflag);

    if (first_data.length != 0 && colflag == true && listflag == true) {
        console.log('kjhjhghhgh');
        final_datafunction()
    }



    if (clickbtn1 === true) {
        if (btn1 === 'day') {
            setbtn1('')
            let btn = document.getElementById('day')
            btn.style.backgroundColor = '#f0f0f0'
            btn.style.color = 'black'
            let btn1 = document.getElementById('analytics')
            btn1.style.backgroundColor = '#f0f0f0'
            btn1.style.color = 'black'
        } else if (btn1 === '' || btn1 === 'analytics') {
            setbtn1('day')
            let btn = document.getElementById('day')
            btn.style.backgroundColor = '#e32747'
            btn.style.color = 'white'

            let btn1 = document.getElementById('analytics')
            btn1.style.backgroundColor = '#f0f0f0'
            btn1.style.color = 'black'
        }
        setclickbtn1(false)
    } else if (clickbtn2 === true) {

        if (btn1 === 'analytics') {
            setbtn1('')
            let btn = document.getElementById('day')
            btn.style.backgroundColor = '#f0f0f0'
            btn.style.color = 'black'
            let btn1 = document.getElementById('analytics')
            btn1.style.backgroundColor = '#f0f0f0'
            btn1.style.color = 'black'

        } else if (btn1 === '' || btn1 === 'day') {
            // alert('coming')
            setbtn1('analytics')
            let btn = document.getElementById('day')
            btn.style.backgroundColor = '#f0f0f0'
            btn.style.color = 'black'

            let btn1 = document.getElementById('analytics')
            btn1.style.backgroundColor = '#e32747'
            btn1.style.color = 'white'
        }
        setclickbtn2(false)
    }


    function bulk_download_delete() {
        return (
            <div id='downdel' style={{ display: 'flex', alignItems: 'center' }}>
                <button id='analytics' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '50%', border: '1px solid gray', marginRight: '20px' }}><ArrowCircleDownIcon style={{ fontSize: '30px' }} onClick={async () => {
                    if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                        let access = userData.operation_type.filter((val) => { return val == 'Read' || val == 'All' })
                        if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Read' || access[1] == 'Read') {

                            for (let index = 0; index < selected_video.length; index++) {
                                await generate_urifor_download(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, selected_video[index])

                            }
                        } else {
                            setalert_box(true)
                            setalert_text('Your access level does not allow you to download videos.')

                        }
                    } else {
                        let cam_name = ''
                        selected_video.map((val) => {
                            userData.site_id.map((value) => {
                                let access = value.type.filter((val) => { return val == 'Read' || val == 'All' })
                                if (val.site_id == value.id) {
                                    if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Read' || access[1] == 'Read') {
                                        generate_urifor_download(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, val)
                                    } else {
                                        cam_name = `${cam_name} ${val.camera_name}`
                                    }
                                }
                            })

                        })

                        if (cam_name !== '') {
                            setalert_box(true)
                            setalert_text(`Your access level does not allow you to download these (${cam_name}) videos.`)

                        }
                    }
                }} /></button>

                <button id='analytics' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '50%', border: '1px solid gray', marginRight: '20px' }}><DeleteOutlineOutlinedIcon style={{ fontSize: '30px', cursor: 'pointer' }} onClick={() => {
                    const spacesEndpoint = new AWS.Endpoint('sgp1.digitaloceanspaces.com/');
                    const s3 = new AWS.S3({
                        endpoint: spacesEndpoint,
                        accessKeyId: "7GNWRGQS5347V5X7O4LV",
                        secretAccessKey: 'RNMZe1dhsFiOOA6uNa8y684V+u9ZgIbL3ENfd6Lzt8M'
                    });

                    if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                        let access = userData.operation_type.filter((val) => { return val == 'Delete' || val == 'All' })
                        if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Delete' || access[1] == 'Delete') {

                            if (selected_video.length !== 0) {
                                setdelete_download_box(true)
                                selected_video.map((val) => {
                                    delete_bulkS3Object(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, val)
                                })
                            } else {
                                alert('select video to delete')
                            }




                            // const blob = dataURItoBlob(drawing1);
                            // blob.name = JSON.stringify(Date.now())
                            // console.log(blob);
                            // const params = {
                            //     Body: blob,
                            //     Bucket: bucketName,
                            //     Key: blob.name
                            // };
                        } else {
                            setalert_box(true)
                            setalert_text('Your access level does not allow you to delete videos.')

                        }
                    } else {
                        let access = userData.site_id.filter((val) => { return val == 'Read' || val == 'All' })
                        let cam_name = ''
                        selected_video.map((val) => {
                            userData.site_id.map((value) => {
                                let access = value.type.filter((val) => { return val == 'Delete' || val == 'All' })
                                if (val.site_id == value.id) {
                                    if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Delete' || access[1] == 'Delete') {
                                        if (selected_video.length !== 0) {
                                            setdelete_download_box(true)
                                            selected_video.map((val) => {
                                                delete_bulkS3Object(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, val)
                                            })
                                        } else {
                                            alert('select video to delete')
                                        }
                                    } else {
                                        cam_name = `${cam_name} ${val.camera_name}`
                                    }
                                }
                            })

                        })

                        // const blob = dataURItoBlob(drawing1);
                        // blob.name = JSON.stringify(Date.now())
                        // console.log(blob);
                        // const params = {
                        //     Body: blob,
                        //     Bucket: bucketName,
                        //     Key: blob.name
                        // };

                        if (cam_name !== '') {
                            setalert_box(true)
                            setalert_text(`Your access level does not allow you to delete these (${cam_name}) videos.`)

                        }
                    }


                }} /></button>

                {
                    type == 'alert' ?

                        <button id='analytics' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '50%', border: '1px solid gray' }}><ToggleOnIcon style={{ fontSize: '30px' }} onClick={() => {
                            let count = 0
                            if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                                let access = userData.operation_type.filter((val) => { return val == 'Edit' || val == 'All' })
                                if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Edit' || access[1] == 'Edit') {
                                    selected_video.map((val) => {
                                        const getStocksData = {
                                            method: 'put',
                                            maxBodyLength: Infinity,
                                            url: api.ALERT_CREATION + val._id,
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            data: { 'Active': t_f_alarm == 0 ? 1 : 0 }
                                        }
                                        axios(getStocksData)
                                            .then(response => {
                                                console.log(response.data);
                                                count = count + 1
                                                if (selected_video == count) {
                                                    dispatch({ type: APPLY, value: !apply })
                                                }
                                            })
                                            .catch(function (e) {
                                                if (e.message === 'Network Error') {
                                                    alert("No Internet Found. Please check your internet connection")
                                                }
                                                else {
                                                    alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                                                }

                                            });
                                    })
                                } else {
                                    setalert_box(true)
                                    setalert_text('Your access level does not allow you to download videos.')

                                }
                            } else {
                                let cam_name = ''
                                selected_video.map((val) => {
                                    userData.site_id.map((value) => {
                                        let access = value.type.filter((val) => { return val == 'Edit' || val == 'All' })
                                        if (val.site_id == value.id) {
                                            if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Edit' || access[1] == 'Edit') {
                                                const getStocksData = {
                                                    method: 'put',
                                                    maxBodyLength: Infinity,
                                                    url: api.ALERT_CREATION + val._id,
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    data: { 'Active': t_f_alarm == 0 ? 1 : 0 }
                                                }
                                                axios(getStocksData)
                                                    .then(response => {
                                                        console.log(response.data);
                                                        count = count + 1
                                                        if (selected_video == count) {
                                                            dispatch({ type: APPLY, value: !apply })
                                                        }
                                                    })
                                                    .catch(function (e) {
                                                        if (e.message === 'Network Error') {
                                                            alert("No Internet Found. Please check your internet connection")
                                                        }
                                                        else {
                                                            alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                                                        }

                                                    });
                                            } else {
                                                cam_name = `${cam_name} ${val.camera_name}`
                                            }
                                        }
                                    })

                                })

                                if (cam_name !== '') {
                                    setalert_box(true)
                                    setalert_text(`Your access level does not allow you to download these (${cam_name}) videos.`)

                                }
                            }
                        }} /></button>
                        : ''
                }
            </div>
        )
    }

    function getOffset() {
        let el = document.getElementById('events')
        let ele = document.getElementById('filter')
        const rect = el.getBoundingClientRect();
        const rect2 = ele.getBoundingClientRect();

        if (rect.top === 0) {
            el.style.boxShadow = 'rgba(0, 0, 0, 0.45) 0px 25px 20px -20px'
            el.style.backgroundColor = '#1b0182'
        } else if (rect.top != 0) {
            el.style.boxShadow = 'none'
            el.style.backgroundColor = '#e6e8eb'
        }

        if (rect2.top === 0) {
            ele.style.boxShadow = 'rgba(0, 0, 0, 0.45) 0px 25px 20px -20px'
            ele.style.backgroundColor = '#1b0182'
        } else if (rect2.top != 0) {
            ele.style.boxShadow = 'none'
            ele.style.backgroundColor = '#e6e8eb'
        }
    }


    const handlerLeft = (mouseDownEvent) => {

        const startSize = size;
        const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };
        function onMouseMove(mouseMoveEvent) {
            let left1 = startSize.left - startPosition.x + mouseMoveEvent.pageX

            if (left1 > startSize.left) {
                setSize(currentSize => ({
                    left: left1,
                    right: currentSize.right,
                    width: startSize.width - (mouseMoveEvent.x - startPosition.x)
                }));
            }
            else {
                console.log('kjkjhjk');
                console.log(startPosition.x - mouseMoveEvent.x);
                setSize(currentSize => ({
                    left: left1,
                    right: currentSize.right,
                    width: startPosition.x - mouseMoveEvent.x + startSize.width
                }));
            }
        }
        function onMouseUp() {
            document.body.removeEventListener("mousemove", onMouseMove);
            // uncomment the following line if not using `{ once: true }`
            // document.body.removeEventListener("mouseup", onMouseUp);
        }

        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp, { once: true });
    };

    const handlerRight = (mouseDownEvent) => {

        const startSize = size;
        const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };
        function onMouseMove(mouseMoveEvent) {
            let right1 = startSize.right - startPosition.x + mouseMoveEvent.pageX
            setSize(currentSize => ({
                left: currentSize.left,
                right: right1,
                width: mouseMoveEvent.x - startPosition.x + startSize.width
            }));
        }
        function onMouseUp() {
            document.body.removeEventListener("mousemove", onMouseMove);
            // uncomment the following line if not using `{ once: true }`
            // document.body.removeEventListener("mouseup", onMouseUp);
        }

        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp, { once: true });
    };

    const movediv = (mouseDownEvent) => {
        const startPosition = { left: mouseDownEvent.pageX, top: mouseDownEvent.pageY };

        function onMouseMove(mouseMoveEvent) {
            const startSize = moved;
            // console.log(mouseMoveEvent.pageX - startPosition.left + moved.left,);
            // console.log(mouseMoveEvent.pageY - startPosition.top + moved.top);

            let val = {
                left: mouseMoveEvent.pageX - startPosition.left + moved.left,
                top: mouseMoveEvent.pageY - startPosition.top + moved.top
            }
            // console.log(upperdivWidth, size.x , (val.left + size.x)+3 );
            // console.log(mouseMoveEvent.pageY - startPosition.top + moved.top);
            var boun = document.getElementById("upperdiv").offsetWidth - document.getElementById("elem").offsetWidth;
            var boun1 = document.getElementById("upperdiv").offsetHeight - document.getElementById("elem").offsetHeight;
            if (val.left < boun && val.top < boun1)
                setmoved(currentSize => ({
                    left: val.left > 0 ? val.left : 0,
                    top: val.top > 0 ? val.top : 0
                }));

        }
        function onMouseUp() {
            document.body.removeEventListener("mousemove", onMouseMove);
            // uncomment the following line if not using `{ once: true }`
            // document.body.removeEventListener("mouseup", onMouseUp);
        }

        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp, { once: true });

    };


    function initialdate(year, month, date, start_time, end_time, type) {
        console.log(date_section);
        if (date_section == 'single') {
            if (type === 'start_date') {
                dispatch({ type: STARTDATE, value: `${year}-${month < 10 ? `0${month + 1}` : month + 1}-${date < 10 ? `0${date}` : date}` })
                setstart_dateFullYear(year)
                setstart_dateMonth(month < 10 ? `0${month + 1}` : month + 1)
                setstart_dateDate(date < 10 ? `0${date}` : date)
                setviewstart_date(!viewstart_date)

                dispatch({ type: ENDDATE, value: `${year}-${month < 10 ? `0${month + 1}` : month + 1}-${date < 10 ? `0${date}` : date}` })
                setend_dateFullYear(year)
                setend_dateMonth(month < 10 ? `0${month}` : month)
                setend_dateDate(date < 10 ? `0${date}` : date)
                setviewend_date(!viewend_date)
            } else if (type === 'time') {
                dispatch({ type: STARTTIME, value: start_time })
                dispatch({ type: ENDTIME, value: end_time })
            }
        } else {
            console.log(year, month, date, start_time, end_time, type);
            if (type === 'start_date') {
                dispatch({ type: STARTDATE, value: `${year}-${month < 10 ? `0${month + 1}` : month + 1}-${date < 10 ? `0${date}` : date}` })
                setstart_dateFullYear(year)
                setstart_dateMonth(month < 10 ? `0${month + 1}` : month + 1)
                setstart_dateDate(date < 10 ? `0${date}` : date)
                setviewstart_date(!viewstart_date)
            } else if (type === 'end_date') {
                dispatch({ type: ENDDATE, value: `${year}-${month < 10 ? `0${month + 1}` : month + 1}-${date < 10 ? `0${date}` : date}` })
                setend_dateFullYear(year)
                setend_dateMonth(month < 10 ? `0${month + 1}` : month + 1)
                setend_dateDate(date < 10 ? `0${date}` : date)
                setviewend_date(!viewend_date)
            } else if (type === 'time') {
                dispatch({ type: STARTTIME, value: start_time })
                dispatch({ type: ENDTIME, value: end_time })
            }
        }
    }

    function get_tag_full_list() {
        const axios = require('axios');
        let data = JSON.stringify({
            "user_id": userData._id
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: api.TAG_API_LIST,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(response.data)
                setget_tag_full_data(response.data)
                setget_tag_full_data_sort(response.data)
                setget_tag_full_data_sort1(response.data)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function get_group_full_list() {
        const axios = require('axios');
        let data = JSON.stringify({
            "user_id": userData._id
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: api.GROUP_API_LIST,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };


        axios.request(config)
            .then((response) => {
                console.log(response.data)
                setget_group_full_data(response.data)
                setget_group_full_data_sort(response.data)
                setget_group_full_data_sort1(response.data)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function tagelsefunction(val, type) {
        let new_camera_list = cameras_view
        let flagcount = 0
        let flagcount1 = 0
        let flagcount2 = 0

        let group_value = []
        let camera_value = []

        let check = document.getElementsByClassName('tagCheckbox')
        for (let i = 0; i < check.length; i++) {
            if (check[i].checked === false) {
                flagcount = flagcount + 1
            }
        }

        let check1 = document.getElementsByClassName('groupCheckbox')
        for (let i = 0; i < check1.length; i++) {
            if (check1[i].checked === false) {
                flagcount1 = flagcount1 + 1
            } else {
                group_value.push({ name: get_group_full_data_sort[i].group_name, ind: i })
            }
        }

        let check2 = document.getElementsByClassName('cameraCheckbox')
        for (let i = 0; i < check2.length; i++) {
            if (check2[i].checked === false) {
                flagcount2 = flagcount2 + 1
            } else {
                camera_value.push({ name: cameras[i].camera_gereral_name, ind: i })
            }
        }

        if (check.length != flagcount) {

            if (val.tags.length !== 0) {
                for (let index = 0; index < val.tags.length; index++) {
                    let flag = false
                    let obj = []
                    for (let index1 = 0; index1 < new_camera_list.length; index1++) {
                        if (new_camera_list[index1]._id === val.tags[index]) {
                            if (check1.length != flagcount1) {
                                group_value.map((group) => {
                                    get_group_full_data_sort[group.ind].groups.map((groupdata) => {
                                        cameras_view.map((cameradata) => {
                                            if (groupdata === cameradata._id) {
                                                obj.push(cameradata)
                                            }
                                        })
                                    })
                                })
                            } else {
                                flag = false
                            }
                        } else {
                            flag = true
                            obj.push(new_camera_list[index1])

                        }
                    }

                    console.log(obj);
                    new_camera_list = obj

                }
                for (let index = 0; index < cameras_view.length; index++) {

                    if (cameras_view[index].camera_tags.length > 1) {
                        new_camera_list = [...new_camera_list, cameras_view[index]]
                    }

                }
            } else {
                new_camera_list = cameras_view
            }
        } else {
            if (check1.length != flagcount1 || check2.length != flagcount2) {
                if (val.tags.length !== 0) {

                    if (check.length == flagcount) {
                        let arr = []
                        let arr1 = []
                        for (let index = 0; index < cameras_view.length; index++) {
                            let flag = true
                            let obj = {}
                            for (let index1 = 0; index1 < val.tags.length; index1++) {
                                if (cameras_view[index]._id == val.tags[index1]) {
                                    flag = false
                                    break
                                } else {
                                    flag = true
                                    obj = cameras_view[index]
                                }
                            }

                            if (flag == true) {
                                arr.push(obj)
                                arr1.push(obj._id)
                            }

                        }

                        group_value.map((group) => {
                            get_group_full_data_sort[group.ind].groups.map((groupdata) => {
                                cameras.map((cameradata) => {
                                    if (groupdata === cameradata._id) {
                                        arr.push(cameradata)
                                        arr1.push(cameradata._id)
                                    }
                                })
                            })
                        })


                        camera_value.map((group, i) => {
                            if (group.name == cameras[group.ind].camera_gereral_name) {
                                arr.push(cameras[group.ind])
                                arr1.push(data[group.ind]._id)
                            }
                        })

                        const uniqueArray = [...new Set(arr1)];
                        const new_camera_list1 = []

                        for (let index = 0; index < uniqueArray.length; index++) {
                            for (let index1 = 0; index1 < arr.length; index1++) {
                                if (uniqueArray[index] == arr[index1]._id) {
                                    new_camera_list1.push(arr[index1])
                                    break
                                }

                            }

                        }
                        new_camera_list = new_camera_list1


                    } else {
                        for (let index = 0; index < val.tags.length; index++) {
                            let flag = false
                            let obj = []
                            for (let index1 = 0; index1 < new_camera_list.length; index1++) {

                                if (new_camera_list[index1]._id === val.tags[index]) {
                                    if (check1.length != flagcount1) {
                                        group_value.map((group) => {
                                            get_group_full_data_sort[group.ind].groups.map((groupdata) => {
                                                cameras_view.map((cameradata) => {
                                                    if (groupdata === cameradata._id) {
                                                        obj.push(cameradata)
                                                    }
                                                })
                                            })
                                        })
                                    } else {
                                        flag = false
                                    }

                                    if (check2.length != flagcount2) {
                                        camera_value.map((group, i) => {
                                            obj.push(cameras_view[group.ind])
                                        })
                                    } else {
                                        flag = false
                                    }
                                } else {
                                    flag = true
                                    obj.push(new_camera_list[index1])

                                }
                            }


                            new_camera_list = obj

                        }
                    }

                    const uniqueArray = [...new Set(new_camera_list)];
                    new_camera_list = uniqueArray
                    console.log(new_camera_list);


                } else {

                    new_camera_list = cameras_view
                }
            } else {
                setget_tag_full_data_sort(get_tag_full_data)
                setget_tag_full_data_sort1(get_tag_full_data)
                setget_group_full_data_sort(get_group_full_data)
                setget_group_full_data_sort1(get_group_full_data)
                new_camera_list = cameras
            }

        }

        let camcnk = []
        tag_checkbox.map((cam) => {
            if (cam !== val._id) {
                camcnk.push(cam)
            }
        })

        settag_checkbox(camcnk)

        if (true) {

            let online = 0
            let offline = 0
            let online_list = []
            let offline_list = []

            new_camera_list.map((val) => {
                if (val.camera_health == 'Online') {
                    online = online + 1
                    online_list.push(val)
                } else {
                    offline = offline + 1
                    offline_list.push(val)
                }

            })

            const on = [...new Set(online_list)];
            const of = [...new Set(offline_list)];
            const newcam = [...new Set(new_camera_list)];

            let check3 = document.getElementsByClassName('status')
            if (check3[0].checked == true) {
                setcameras_view(on)
                // setcameras_search(on)
            } else if (check3[1].checked == true) {
                setcameras_view(of)
                // setcameras_search(of)
            } else {
                setcameras_view(newcam)
                // setcameras_search(newcam)
            }

            setcameras_view(new_camera_list)
            setcameras_view2(new_camera_list)
            setselectedcameras(new_camera_list)
            dispatch({ type: SELECTED_CAMERAS, value: new_camera_list })
            dispatch({ type: APPLY, value: !apply })
            setfinaldata([])
            setimage_arr([])
            setfinaldate('')
            colflag = true
            setcolcount(30)
            // setclickbtn2(true)
            setonline_cam(online)
            setoffline_cam(offline)
        }
    }

    function groupelsefunction(val, type) {
        let new_camera_list = cameras_view
        let flagcount = 0
        let flagcount1 = 0
        let flagcount2 = 0

        let group_value = []
        let camera_value = []

        let check = document.getElementsByClassName('groupCheckbox')
        for (let i = 0; i < check.length; i++) {
            if (check[i].checked === false) {
                flagcount = flagcount + 1
            }
        }

        let check1 = document.getElementsByClassName('tagCheckbox')
        for (let i = 0; i < check1.length; i++) {
            if (check1[i].checked === false) {
                flagcount1 = flagcount1 + 1
            } else {
                group_value.push({ name: get_tag_full_data_sort[i].tag_name, ind: i })
            }
        }

        let check2 = document.getElementsByClassName('cameraCheckbox')
        for (let i = 0; i < check2.length; i++) {
            if (check2[i].checked === false) {
                flagcount2 = flagcount2 + 1
            } else {
                camera_value.push({ name: cameras[i].camera_gereral_name, ind: i })
            }
        }

        console.log(check.length != flagcount);

        if (check.length != flagcount) {
            if (val.groups.length !== 0) {
                for (let index = 0; index < val.groups.length; index++) {
                    let flag = false
                    let obj = []
                    for (let index1 = 0; index1 < new_camera_list.length; index1++) {
                        if (new_camera_list[index1]._id === val.groups[index]) {
                            if (check1.length != flagcount1) {
                                group_value.map((group) => {
                                    get_tag_full_data_sort[group].groups.map((groupdata) => {
                                        cameras_view.map((cameradata) => {
                                            if (groupdata === cameradata._id) {
                                                obj.push(cameradata)
                                            }
                                        })
                                    })
                                })
                            } else {
                                flag = false
                            }
                        } else {
                            flag = true
                            obj.push(new_camera_list[index1])

                        }
                    }


                    new_camera_list = obj

                }
                for (let index = 0; index < cameras_view.length; index++) {

                    if (cameras_view[index].camera_groups.length > 1) {
                        new_camera_list = [...new_camera_list, cameras_view[index]]
                    }

                }

            } else {
                new_camera_list = cameras_view
            }
        } else {
            if (check1.length != flagcount1 || check2.length != flagcount2) {
                if (val.groups.length !== 0) {
                    if (check.length == flagcount) {
                        let arr = []
                        let arr1 = []
                        for (let index = 0; index < cameras_view.length; index++) {
                            let flag = true
                            let obj = {}
                            for (let index1 = 0; index1 < val.groups.length; index1++) {
                                if (cameras_view[index]._id == val.groups[index1]) {
                                    flag = false
                                    break
                                } else {
                                    flag = true
                                    obj = cameras_view[index]
                                }
                            }

                            if (flag == true) {
                                arr.push(obj)
                                arr1.push(obj._id)
                            }

                        }

                        group_value.map((group) => {
                            get_tag_full_data_sort[group.ind].tags.map((groupdata) => {
                                cameras.map((cameradata) => {
                                    if (groupdata === cameradata._id) {
                                        arr.push(cameradata)
                                        arr1.push(cameradata._id)
                                    }
                                })
                            })
                        })


                        camera_value.map((group, i) => {
                            if (group.name == cameras[group.ind].camera_gereral_name) {
                                arr.push(cameras[group.ind])
                                arr1.push(data[group.ind]._id)
                            }
                        })

                        const uniqueArray = [...new Set(arr1)];
                        const new_camera_list1 = []

                        for (let index = 0; index < uniqueArray.length; index++) {
                            for (let index1 = 0; index1 < arr.length; index1++) {
                                if (uniqueArray[index] == arr[index1]._id) {
                                    new_camera_list1.push(arr[index1])
                                    break
                                }

                            }

                        }
                        new_camera_list = new_camera_list1


                    } else {
                        for (let index = 0; index < val.groups.length; index++) {
                            let flag = false
                            let obj = []
                            for (let index1 = 0; index1 < new_camera_list.length; index1++) {
                                if (new_camera_list[index1]._id === val.groups[index]) {
                                    if (check1.length != flagcount1) {
                                        group_value.map((group) => {
                                            get_tag_full_data_sort[group].groups.map((groupdata) => {
                                                cameras_view.map((cameradata) => {
                                                    if (groupdata === cameradata._id) {
                                                        obj.push(cameradata)
                                                    }
                                                })
                                            })
                                        })
                                    } else {
                                        flag = false
                                    }

                                    if (check2.length != flagcount2) {
                                        camera_value.map((group) => {
                                            obj.push(cameras_view[group])
                                        })
                                    } else {
                                        flag = false
                                    }
                                } else {
                                    flag = true
                                    obj.push(new_camera_list[index1])

                                }
                            }


                            new_camera_list = obj

                        }
                    }
                    const uniqueArray = [...new Set(new_camera_list)];
                    new_camera_list = uniqueArray
                } else {
                    new_camera_list = cameras_view
                }
            } else {
                setget_tag_full_data_sort(get_tag_full_data)
                setget_tag_full_data_sort1(get_tag_full_data)
                setget_group_full_data_sort(get_group_full_data)
                setget_group_full_data_sort1(get_group_full_data)
                new_camera_list = cameras
            }
        }

        let camcnk = []
        group_checkbox.map((cam) => {
            if (cam !== val._id) {
                camcnk.push(cam)
            }
        })

        setgroup_checkbox(camcnk)

        if (true) {

            let online = 0
            let offline = 0
            let online_list = []
            let offline_list = []

            new_camera_list.map((val) => {
                if (val.camera_health == 'Online') {
                    online = online + 1
                    online_list.push(val)
                } else {
                    offline = offline + 1
                    offline_list.push(val)
                }

            })

            const on = [...new Set(online_list)];
            const of = [...new Set(offline_list)];
            const newcam = [...new Set(new_camera_list)];


            let check3 = document.getElementsByClassName('status')
            if (check3[0].checked == true) {
                setcameras_view(on)
                // setcameras_search(on)
            } else if (check3[1].checked == true) {
                setcameras_view(of)
                // setcameras_search(of)
            } else {
                setcameras_view(newcam)
                // setcameras_search(newcam)
            }

            setcameras_view(new_camera_list)
            setcameras_view2(new_camera_list)
            setselectedcameras(new_camera_list)
            dispatch({ type: SELECTED_CAMERAS, value: new_camera_list })
            dispatch({ type: APPLY, value: !apply })
            setfinaldata([])
            setimage_arr([])
            setfinaldate('')
            colflag = true
            setcolcount(30)
            // setclickbtn2(true)
            setonline_cam(online)
            setoffline_cam(offline)
        }
    }

    function searchfunction(event, data, type) {
        let str = event
        let arr = []

        if (event != '') {
            for (let i = 0; i < data.length; i++) {
                let username = type == 'camera_search' ? data[i].camera_gereral_name : type == 'camera_search1' ? data[i].camera_gereral_name : type == 'tag_search' ? data[i].tag_name : type == 'group_search' ? data[i].group_name : ''
                for (let j = 0; j < str.length; j++) {

                    for (let k = 0; k < username.length; k++) {
                        if (str[j].toUpperCase() === username[k].toUpperCase()) {
                            let wrd = ''
                            for (let l = k; l < k + str.length; l++) {
                                wrd = wrd + username[l]
                            }
                            if (str.toUpperCase() === wrd.toUpperCase()) {
                                arr.push(data[i])
                                break
                            }
                        }
                    }

                }
            }
        }

        if (arr.length != 0) {
            if (type == 'camera_search') {
                setcameras_view(arr)
            } else if (type == 'camera_search1') {
                setcameras(arr)
            } else if (type == 'tag_search') {
                setget_tag_full_data_sort(arr)
            } else if (type == 'group_search') {
                setget_group_full_data_sort(arr)
            }

        } else {
            if (type == 'camera_search') {
                setcameras_view([])
            } else if (type == 'camera_search1') {
                setcameras([])
            } else if (type == 'tag_search') {
                setget_tag_full_data_sort([])
            } else if (type == 'group_search') {
                setget_group_full_data_sort([])
            }
        }
    }


    async function geturifunction(accessKeyId, secretAccessKey, Bucket, Key, data) {
        console.log(Key);
        const s3Client = new S3Client({
            region: "ap-south-1",
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        });

        if (Key != "None" && Key != "") {

            const video_command = new GetObjectCommand({
                Bucket: Bucket,
                Key: Key,
            });

            const image_command = new GetObjectCommand({
                Bucket: Bucket,
                Key: data.uri,
            });

            if (db_type == 'local') {
                const url = Key
                const image_url = data.uri
                setvideo_uri(url)
                setimage_uri(image_url)
                console.log(url);
            } else {
                const url = await getSignedUrl(s3Client, video_command, { expiresIn: 3600 })
                const image_url = await getSignedUrl(s3Client, image_command)
                setvideo_uri(url)
                setimage_uri(image_url)
                console.log(url);
            }

        } else {
            const image_command = new GetObjectCommand({
                Bucket: Bucket,
                Key: data.uri,
            });

            if (db_type == 'local') {
                const image_url = data.uri
                setimage_uri(image_url)
                setiv(true)
            } else {
                const image_url = await getSignedUrl(s3Client, image_command)
                setimage_uri(image_url)
                setiv(true)
            }
        }
    }

    async function getimageurifunction(accessKeyId, secretAccessKey, Bucket, data, i) {
        const s3Client = new S3Client({
            region: "ap-south-1",
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        });

        const image_command = new GetObjectCommand({
            Bucket: Bucket,
            Key: data.uri,
        });

        let image_url = ''

        if (db_type == 'local') {
            image_url = data.uri
            console.log(data.uri);
            // document.getElementById(`img${i}`).src = image_url
            return image_url
        } else {
            image_url = await getSignedUrl(s3Client, image_command)
            document.getElementById(`img${i}`).src = image_url
            return image_url
        }
    }

    async function getinstanturifunction(accessKeyId, secretAccessKey, Bucket, Key, i) {

        if (finalflag) {
            const s3Client = new S3Client({
                region: "ap-south-1",
                credentials: {
                    accessKeyId: accessKeyId,
                    secretAccessKey: secretAccessKey,
                },
            });

            const video_command = new GetObjectCommand({
                Bucket: Bucket,
                Key: Key,
            });

            const url = await getSignedUrl(s3Client, video_command, { expiresIn: 3600 })


            try {
                let vid = document.getElementById(`vid${i}`)
                vid.src = url;
                vid.play();
                vid.style.display = 'block'

                let img = document.getElementById(`img${i}`)
                img.style.display = 'none'
            } catch (e) {
                console.log(e);
            }
        }
    }

    async function generate_urifor_download(accessKeyId, secretAccessKey, Bucket, Key, i) {
        console.log(Key);
        const s3Client = new S3Client({
            region: "ap-south-1",
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        });

        const video_command = new GetObjectCommand({
            Bucket: Bucket,
            Key: Key.video_key,
        });

        if (db_type == 'local') {
            const url = Key.video_key
            axios({
                url,
                method: 'GET',
                responseType: 'blob',
            }).then((response) => {
                const urlObject = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = urlObject;
                link.setAttribute('download', `${Key.camera_name}/${Key.device_id}/${Key.date}_${Key.time}.mp4`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        } else {
            console.log(Key);
            const url = await getSignedUrl(s3Client, video_command, { expiresIn: 3600 })

            axios({
                url,
                method: 'GET',
                responseType: 'blob',
            }).then((response) => {
                const urlObject = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = urlObject;
                link.setAttribute('download', `${Key.camera_name}/${Key.device_id}/${Key.date}_${Key.time}.mp4`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
            // const blob = new Blob([url], { type: 'video/mp4' })
            // const link = document.createElement('a')
            // link.href = URL.createObjectURL(blob)
            // link.download = `${Key.camera_name}/${Key.device_id}/${Key.date}_${Key.time}`
            // link.click()
            // URL.revokeObjectURL(link.href)
        }

    }

    async function getimageurifunction1(accessKeyId, secretAccessKey, Bucket, data, i) {
        console.log('kjhjhh');
        const s3Client = new S3Client({
            region: "ap-south-1",
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        });

        const image_command = new GetObjectCommand({
            Bucket: Bucket,
            Key: data.image_uri,
        });

        setloading(true)
        let image_uri = ''

        if (db_type == 'local') {
            image_uri = data.image_uri
        } else {
            image_uri = await getSignedUrl(s3Client, image_command)
        }
        // document.getElementById(`dash_image${i}`).src = image_uri

        setimguri(prevImgUri => {
            const updatedImgUri = [...prevImgUri];
            updatedImgUri[i] = image_uri;

            return updatedImgUri;
        });
        setTimeout(() => {
            setloading(false)
        }, 2000);
        return image_uri
    }

    const deleteS3Object = async (accessKeyId, secretAccessKey, Bucket, Key,) => {
        let s3bucket = new AWS.S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            Bucket: Bucket,
        });
        var params = { Bucket: Bucket, Key: Key.video_key };
        s3bucket.deleteObject(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                const options = {
                    url: type == 'motion_events' ? `${api.ANALYTICS_CREATION}${Key._id}` : `${api.ALERT_CREATION}${Key._id}`,
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer ' + window.localStorage.getItem('codeofauth')
                    }
                };

                axios(options)
                    .then(response => {
                        handleClose()
                        setdelete_download_box(false)
                        dispatch({ type: APPLY, value: !apply })
                    })
                    .catch(function (e) {
                        if (e.message === 'Network Error') {
                            alert("No Internet Found. Please check your internet connection")
                        }

                        else {

                            alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                        }


                    });
                console.log(data);
            }
        });
    };

    const delete_bulkS3Object = async (accessKeyId, secretAccessKey, Bucket, Key) => {
        let s3bucket = new AWS.S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            Bucket: Bucket,
        });
        var params = { Bucket: Bucket, Key: Key.video_key };
        s3bucket.deleteObject(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                const options = {
                    url: type == 'motion_events' ? `${api.ANALYTICS_CREATION}${Key._id}` : `${api.ALERT_CREATION}${Key._id}`,
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer ' + window.localStorage.getItem('codeofauth')
                    }
                };

                axios(options)
                    .then(response => {
                        delete_length = delete_length + 1
                        setdelete_download_heading('Deleting Videos')
                        setdelete_download_text(`${delete_length}/${selected_video.length} Please wait...`)

                        if (delete_length == selected_video.length) {
                            dispatch({ type: APPLY, value: !apply })
                            setdelete_download_box(false)
                        }
                    })
                    .catch(function (e) {
                        if (e.message === 'Network Error') {
                            alert("No Internet Found. Please check your internet connection")
                        }

                        else {

                            alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                        }


                    });
                console.log(data);
            }
        });
    };


    return (
        <div onClick={(event) => {
            console.log(analytics_mouse);
            if (!analytics_mouse) {
                setselectedanalytics(selectedanalytics_original)
                analytics_mouse = true
                setclickbtn2(true)
            }

            if (!date_mouse) {
                date_mouse = true
                setclickbtn1(true)
            }
        }} style={{ width: '100%' }}>

            {/* <div>
                <video style={{ width: '100%', height: '100%' }} crossorigin="anonymous" src="https://sgp1.digitaloceanspaces.com/tentovision/JN-01/2023-07-10/Conference_Room/17:37:11.mp4" width={'100%'} height={'100%'} controls></video>
            </div>

            <div style={{ position: 'relative', width: '100%', height: '40px', backgroundColor: 'red' }}>
                <div style={{ position: 'absolute', height: '40px', backgroundColor: 'green', left: `${size.left}px`, width: `${size.width}px` }}>
                    <button style={{ position: 'absolute', height: '40px', right: '100%' }} onMouseDown={handlerLeft}></button>
                    <button style={{ position: 'absolute', height: '40px', left: '100%' }} onMouseDown={handlerRight}></button>
                </div>
            </div> */}

            <div>

                <Modal
                    open={delete_download_box}
                    onClose={() => { }}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    style={{ marginLeft: 'auto', marginRight: 'auto', top: '40%', width: '50%', }}
                >
                    <div style={{ backgroundColor: '#181828', padding: '15px', borderRadius: '5px' }}>
                        <Row style={{ padding: '0px', alignItems: 'center', }}>
                            <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <CloseIcon style={{ fontSize: '15px', color: 'red', cursor: 'pointer' }} onClick={() => {
                                    delete window.delete_bulkS3Object
                                    dispatch({ type: APPLY, value: !apply })
                                    delete_downloadClose()
                                }} />
                            </Col>

                            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                <p style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: '18px' }}>{delete_download_heading}</p>
                                <p id='alert_text' style={{ color: 'white', margin: 0, textAlign: 'center' }}>{delete_download_text}</p>
                            </Col>
                        </Row>
                    </div>
                </Modal>

                <Modal
                    open={alert_box}
                    onClose={alertClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    style={{ marginLeft: 'auto', marginRight: 'auto', top: '40%', width: '50%', }}
                >
                    <div style={{ backgroundColor: '#181828', padding: '15px', borderRadius: '5px' }}>
                        <Row style={{ padding: '0px', alignItems: 'center', }}>
                            <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <CloseIcon style={{ fontSize: '15px', color: 'red', cursor: 'pointer' }} onClick={() => {
                                    alertClose()
                                }} />
                            </Col>

                            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                <p style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: '18px' }}>Access denied</p>
                                <p id='alert_text' style={{ color: 'white', margin: 0, textAlign: 'center' }}>{alert_text}</p>
                            </Col>
                        </Row>
                    </div>
                </Modal>

                <Modal
                    open={open1}
                    onClose={() => {
                        console.log(selectedcameras_orginal);
                        handleClose1()
                        setselectedcameras(selectedcameras_orginal)
                    }}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    style={{ marginLeft: 'auto', marginRight: 'auto', height: 550, width: '90%', top: 20 }}
                >
                    <div>
                        <Row>
                            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                <div >

                                    <div style={{ backgroundColor: 'white', borderRadius: '5px', paddingTop: '10px', height: 550, maxHeight: 550, overflowY: 'scroll' }}>
                                        <Row style={{ padding: '10px', alignItems: 'center' }}>

                                            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <CloseIcon style={{ color: 'black', cursor: 'pointer' }} onClick={() => {
                                                        handleClose1()
                                                        setselectedcameras(selectedcameras_orginal)
                                                    }} />
                                                </div>
                                            </Col>

                                        </Row>
                                        <Row style={{ padding: '10px', alignItems: 'center' }}>

                                            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <div>
                                                        <input type='text' placeholder='Search' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginRight: '20px' }} onChange={(e) => {
                                                            if (e.target.value !== '') {
                                                                if (full_camera_search == '') {
                                                                    setcameras_view2(cameras_view2)
                                                                }
                                                                searchfunction(e.target.value, cameras_view2, 'camera_search')
                                                                setfull_camera_search(e.target.value)
                                                            } else {
                                                                setcameras_view(cameras_view2)
                                                            }
                                                        }}></input>

                                                        <button style={{ marginTop: page === 1 ? '10px' : '', backgroundColor: filter ? '#e22747' : '#e6e8eb', color: filter ? 'white' : 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginRight: '20px' }} onClick={() => {
                                                            setfilter(!filter)
                                                            get_tag_full_list()
                                                            get_group_full_list()
                                                        }}> <TuneOutlinedIcon style={{ marginRight: '10px' }} />Filter</button>

                                                        <button style={{ marginTop: page === 1 ? '10px' : '', backgroundColor: '#e22747', color: 'white', padding: '10px', borderRadius: '20px', border: '1px solid gray', }} onClick={() => {
                                                            setselectedcameras_orginal(selectedcameras)
                                                            dispatch({ type: SELECTED_CAMERAS, value: selectedcameras })
                                                            dispatch({ type: APPLY, value: !apply })
                                                            handleClose1()
                                                        }}>Apply</button>
                                                    </div>

                                                    <div>
                                                        <p style={{ color: 'black', fontSize: '20px', margin: 0 }}><span style={{ color: 'white', backgroundColor: '#1b0182', borderRadius: '50%', paddingLeft: '10px', paddingRight: '10px', paddingTop: '3px', paddingBottom: '3px' }}>{selectedcameras.length}</span> / {cameras.length} Cameras Selected</p>
                                                    </div>
                                                </div>
                                            </Col>

                                        </Row>

                                        {
                                            filter ?
                                                <Row style={{ padding: '10px' }}>
                                                    <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex' }}>
                                                        <div style={{ position: 'relative' }} className='cameras-div' >
                                                            <button className='eventbtn' id='cameras' onClick={() => {
                                                                setcamera_box(!camera_box)
                                                                setcamera_tag(false)
                                                                setcamera_group(false)
                                                                setonline_status(false)

                                                            }} style={{ display: 'flex', backgroundColor: camera_box ? '#e22747' : '#e6e8eb', color: camera_box ? 'white' : 'black' }}> <CameraAltOutlinedIcon style={{ marginRight: '10px' }} />Cameras </button>

                                                            <div id='status' style={{ borderRadius: '5px', backgroundColor: '#181828', padding: '10px', position: 'absolute', top: '60px', zIndex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', display: camera_box ? 'block' : 'none' }}>
                                                                <div style={{ position: 'relative' }}>

                                                                    <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: '-37px' }} />
                                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                        <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                                                            <CloseIcon style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }} onClick={() => {
                                                                                setcamera_box(!camera_box)
                                                                                setcamera_tag(false)
                                                                                setcamera_group(false)
                                                                                setonline_status(false)
                                                                            }} />
                                                                        </div>
                                                                        <div>
                                                                            <input type='text' placeholder='Search' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginBottom: '5px', width: '100%', height: '40px' }} onChange={(e) => {
                                                                                if (e.target.value !== '') {
                                                                                    searchfunction(e.target.value, cameras1, 'camera_search1')
                                                                                    setcamera_search(e.target.value)
                                                                                } else {
                                                                                    setcameras(cameras1)
                                                                                }
                                                                            }}></input>
                                                                        </div>

                                                                        {
                                                                            cameras.length !== 0 ?
                                                                                <p style={{ margin: 0, color: 'white', cursor: 'pointer' }} onClick={() => {
                                                                                    let check = document.getElementsByClassName('tagCheckbox')
                                                                                    for (let i = 0; i < check.length; i++) {
                                                                                        check[i].checked = false
                                                                                    }

                                                                                    let group = document.getElementsByClassName('groupCheckbox')
                                                                                    for (let i = 0; i < group.length; i++) {
                                                                                        group[i].checked = false
                                                                                    }

                                                                                    let camera = document.getElementsByClassName('cameraCheckbox')
                                                                                    for (let i = 0; i < camera.length; i++) {
                                                                                        camera[i].checked = false
                                                                                    }
                                                                                    setget_tag_full_data_sort(get_tag_full_data)
                                                                                    setget_tag_full_data_sort1(get_tag_full_data)
                                                                                    setget_group_full_data_sort(get_group_full_data)
                                                                                    setget_group_full_data_sort1(get_group_full_data)
                                                                                    setcameras_view(cameras)
                                                                                    setcameras_view2(cameras)
                                                                                    setselectedcameras(cameras)
                                                                                    dispatch({ type: SELECTED_CAMERAS, value: cameras })
                                                                                    dispatch({ type: APPLY, value: !apply })
                                                                                    setfinaldata([])
                                                                                    setimage_arr([])
                                                                                    setfinaldate('')
                                                                                    colflag = true
                                                                                    setcolcount(30)
                                                                                    setclickbtn2(true)
                                                                                    setcamera_box(!camera_box)
                                                                                }}>Clear all</p>
                                                                                : ''
                                                                        }
                                                                    </div>

                                                                    <div className='lower_alerts' style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                                                                        {
                                                                            cameras.length !== 0 ?
                                                                                cameras.map((val, k) => {
                                                                                    let typ = false
                                                                                    camera_checkbox.map((id) => {
                                                                                        if (id == val._id) {
                                                                                            typ = true
                                                                                        }
                                                                                    })
                                                                                    return (
                                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                                                                            <p style={{ margin: 0, color: 'white', width: '200px' }}>{val.camera_gereral_name}<span style={{ color: 'white', borderRadius: '50%', backgroundColor: '#a8a4a4', marginLeft: '10px', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px' }}>{1}</span></p>
                                                                                            <input className='cameraCheckbox' checked={typ ? true : false} type="checkbox" onClick={(e) => {

                                                                                                let flagcount = 0
                                                                                                let flagcount1 = 0
                                                                                                let flagcount2 = 0

                                                                                                let group_value = []
                                                                                                let tag_value = []

                                                                                                let check = document.getElementsByClassName('tagCheckbox')
                                                                                                for (let i = 0; i < check.length; i++) {
                                                                                                    if (check[i].checked === false) {
                                                                                                        flagcount = flagcount + 1
                                                                                                    } else {
                                                                                                        tag_value.push(i)
                                                                                                    }
                                                                                                }

                                                                                                let check1 = document.getElementsByClassName('groupCheckbox')
                                                                                                for (let i = 0; i < check1.length; i++) {
                                                                                                    if (check1[i].checked === false) {
                                                                                                        flagcount1 = flagcount1 + 1
                                                                                                    } else {
                                                                                                        group_value.push(i)
                                                                                                    }
                                                                                                }


                                                                                                let check2 = []

                                                                                                if (camera_search == '') {
                                                                                                    check2 = document.getElementsByClassName('cameraCheckbox')
                                                                                                    for (let i = 0; i < check2.length; i++) {
                                                                                                        if (i != k && check2[i].checked === false) {
                                                                                                            flagcount2 = flagcount2 + 1
                                                                                                        }
                                                                                                    }
                                                                                                } else {
                                                                                                    check2 = camera_checkbox
                                                                                                    check2.push(1)
                                                                                                }



                                                                                                if (e.target.checked === true) {
                                                                                                    let new_camera_tag = []
                                                                                                    let new_camera_group = []
                                                                                                    let newcamera = []


                                                                                                    if (check2.length > flagcount2) {
                                                                                                        if (val.camera_tags.length !== 0) {

                                                                                                            for (let index = 0; index < val.camera_tags.length; index++) {
                                                                                                                let flag = false
                                                                                                                let obj = ''

                                                                                                                for (let index1 = 0; index1 < get_tag_full_data.length; index1++) {


                                                                                                                    if (get_tag_full_data[index1]._id === val.camera_tags[index].id) {
                                                                                                                        flag = true
                                                                                                                        obj = get_tag_full_data[index1]
                                                                                                                        break
                                                                                                                    } else {
                                                                                                                        flag = false
                                                                                                                    }
                                                                                                                }

                                                                                                                if (flag === true) {
                                                                                                                    new_camera_tag.push(obj)
                                                                                                                }
                                                                                                            }



                                                                                                            if (flagcount2 <= check2.length - 2) {
                                                                                                                new_camera_tag = [...get_tag_full_data_sort, ...new_camera_tag]
                                                                                                            }

                                                                                                            const uniqueArray = [...new Set(new_camera_tag)];
                                                                                                            new_camera_tag = uniqueArray


                                                                                                        } else {
                                                                                                            if (check2.length == flagcount2) {
                                                                                                                new_camera_tag = []
                                                                                                            } else {
                                                                                                                if (check.length == flagcount) {
                                                                                                                    new_camera_tag = []
                                                                                                                } else {
                                                                                                                    new_camera_tag = get_tag_full_data_sort
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    } else {
                                                                                                        new_camera_tag = get_tag_full_data
                                                                                                    }

                                                                                                    if (check2.length > flagcount2) {
                                                                                                        if (val.camera_groups.length !== 0) {
                                                                                                            for (let index = 0; index < val.camera_groups.length; index++) {
                                                                                                                let flag = false
                                                                                                                let obj = ''

                                                                                                                for (let index1 = 0; index1 < get_group_full_data.length; index1++) {

                                                                                                                    if (get_group_full_data[index1]._id === val.camera_groups[index].id) {
                                                                                                                        flag = true
                                                                                                                        obj = get_group_full_data[index1]
                                                                                                                        break
                                                                                                                    } else {
                                                                                                                        flag = false
                                                                                                                    }
                                                                                                                }

                                                                                                                if (flag === true) {
                                                                                                                    new_camera_group.push(obj)
                                                                                                                }


                                                                                                            }

                                                                                                            if (flagcount2 <= check2.length - 2) {
                                                                                                                new_camera_group = [...get_group_full_data_sort, ...new_camera_group]
                                                                                                            }
                                                                                                            const uniqueArray = [...new Set(new_camera_group)];
                                                                                                            new_camera_group = uniqueArray

                                                                                                        } else {
                                                                                                            if (check2.length == flagcount2) {
                                                                                                                new_camera_group = []
                                                                                                            } else {
                                                                                                                if (check.length == flagcount) {
                                                                                                                    new_camera_group = []
                                                                                                                } else {
                                                                                                                    new_camera_group = get_group_full_data_sort
                                                                                                                }

                                                                                                            }

                                                                                                        }
                                                                                                    } else {
                                                                                                        new_camera_group = get_group_full_data
                                                                                                    }


                                                                                                    if (check2.length - 1 != flagcount2) {
                                                                                                        for (let index1 = 0; index1 < cameras_view.length; index1++) {

                                                                                                            if (cameras_view[index1]._id === val._id) {
                                                                                                                break
                                                                                                            } else {
                                                                                                                newcamera.push(val)
                                                                                                            }
                                                                                                        }


                                                                                                        newcamera = [...cameras_view, ...newcamera]
                                                                                                        const uniqueArray = [...new Set(newcamera)];
                                                                                                        newcamera = uniqueArray
                                                                                                    } else {
                                                                                                        newcamera = [val]
                                                                                                    }

                                                                                                    let online = 0
                                                                                                    let offline = 0

                                                                                                    newcamera.map((val) => {
                                                                                                        if (val.camera_health == 'Online') {
                                                                                                            online = online + 1
                                                                                                        } else {
                                                                                                            offline = offline + 1
                                                                                                        }

                                                                                                    })


                                                                                                    setcamera_checkbox([...camera_checkbox, val._id])
                                                                                                    setget_tag_full_data_sort(new_camera_tag)
                                                                                                    setget_tag_full_data_sort1(new_camera_tag)
                                                                                                    setget_group_full_data_sort(new_camera_group)
                                                                                                    setget_group_full_data_sort1(new_camera_group)
                                                                                                    setcameras_view(newcamera)
                                                                                                    setcameras_view2(newcamera)
                                                                                                    setselectedcameras(newcamera)
                                                                                                    dispatch({ type: SELECTED_CAMERAS, value: newcamera })
                                                                                                    dispatch({ type: APPLY, value: !apply })
                                                                                                    setfinaldata([])
                                                                                                    setimage_arr([])
                                                                                                    setfinaldate('')
                                                                                                    colflag = true
                                                                                                    setcolcount(30)
                                                                                                    // setclickbtn2(true)
                                                                                                    setonline_cam(online)
                                                                                                    setoffline_cam(offline)
                                                                                                } else {

                                                                                                    alert('coming')

                                                                                                    let chkbox = document.getElementsByClassName('cameraCheckbox')
                                                                                                    let calculate = 0
                                                                                                    for (let i = 0; i < chkbox.length; i++) {
                                                                                                        if (chkbox[i].checked === false) {
                                                                                                            calculate = calculate + 1
                                                                                                        }
                                                                                                    }

                                                                                                    if (calculate == chkbox.length) {
                                                                                                        let camcnk = []
                                                                                                        camera_checkbox.map((cam) => {
                                                                                                            if (cam !== val._id) {
                                                                                                                camcnk.push(cam)
                                                                                                            }
                                                                                                        })

                                                                                                        let online = 0
                                                                                                        let offline = 0

                                                                                                        data.map((val) => {
                                                                                                            if (val.camera_health == 'Online') {
                                                                                                                online = online + 1
                                                                                                            } else {
                                                                                                                offline = offline + 1
                                                                                                            }

                                                                                                        })

                                                                                                        setcamera_checkbox(camcnk)
                                                                                                        setcameras_view(data)
                                                                                                        setcameras_view1(data)
                                                                                                        setonline_cam(online)
                                                                                                        setoffline_cam(offline)

                                                                                                    } else {
                                                                                                        let new_camera_list = cameras_view


                                                                                                        if (check2.length != flagcount2) {

                                                                                                            let arr = []
                                                                                                            let tag = []
                                                                                                            let group = []
                                                                                                            cameras_view.map((cam) => {
                                                                                                                if (cam._id !== val._id) {
                                                                                                                    arr.push(cam)
                                                                                                                }
                                                                                                            })

                                                                                                            new_camera_list = arr


                                                                                                            if (check1.length == flagcount1) {
                                                                                                                arr.map((ele) => {
                                                                                                                    get_group_full_data_sort.map((ele3) => {
                                                                                                                        ele3.groups.map((ele4, i) => {
                                                                                                                            if (ele._id == ele4) {
                                                                                                                                group.push(ele3)
                                                                                                                            }
                                                                                                                        })
                                                                                                                    })
                                                                                                                })

                                                                                                                const groups = [...new Set(group)];
                                                                                                                setget_group_full_data_sort(groups)
                                                                                                                setget_group_full_data_sort1(groups)
                                                                                                            }

                                                                                                            if (check1.length != flagcount1) {
                                                                                                                new_camera_list = cameras_view
                                                                                                            }

                                                                                                            if (check.length == flagcount) {
                                                                                                                arr.map((ele) => {
                                                                                                                    get_tag_full_data_sort.map((ele3) => {
                                                                                                                        ele3.tags.map((ele4, i) => {
                                                                                                                            if (ele._id == ele4) {
                                                                                                                                console.log();
                                                                                                                                tag.push(ele3)
                                                                                                                            }
                                                                                                                        })
                                                                                                                    })
                                                                                                                })

                                                                                                                const tags = [...new Set(tag)];

                                                                                                                setget_tag_full_data_sort(tags)
                                                                                                                setget_tag_full_data_sort1(tags)
                                                                                                            }

                                                                                                            if (check.length != flagcount) {
                                                                                                                new_camera_list = cameras_view
                                                                                                            }

                                                                                                        } else {
                                                                                                            if (check1.length != flagcount1 || check.length != flagcount) {

                                                                                                                let flag = false
                                                                                                                let obj = []
                                                                                                                if (check1.length != flagcount1) {
                                                                                                                    group_value.map((group) => {
                                                                                                                        get_group_full_data_sort[group].groups.map((groupdata) => {
                                                                                                                            cameras_view.map((cameradata) => {
                                                                                                                                if (groupdata === cameradata._id) {
                                                                                                                                    obj.push(cameradata)
                                                                                                                                }
                                                                                                                            })
                                                                                                                        })
                                                                                                                    })
                                                                                                                } else {
                                                                                                                    flag = false
                                                                                                                }

                                                                                                                if (check.length != flagcount) {
                                                                                                                    tag_value.map((group) => {
                                                                                                                        get_tag_full_data_sort[group].tags.map((groupdata) => {
                                                                                                                            cameras_view.map((cameradata) => {
                                                                                                                                if (groupdata === cameradata._id) {
                                                                                                                                    obj.push(cameradata)
                                                                                                                                }
                                                                                                                            })
                                                                                                                        })
                                                                                                                    })
                                                                                                                } else {
                                                                                                                    flag = false
                                                                                                                }


                                                                                                                new_camera_list = obj
                                                                                                                const uniqueArray = [...new Set(new_camera_list)];
                                                                                                                new_camera_list = uniqueArray
                                                                                                            } else {

                                                                                                                new_camera_list = cameras
                                                                                                                setget_tag_full_data_sort(get_tag_full_data)
                                                                                                                setget_tag_full_data_sort1(get_tag_full_data)
                                                                                                                setget_group_full_data_sort(get_group_full_data)
                                                                                                                setget_group_full_data_sort1(get_group_full_data)
                                                                                                            }

                                                                                                        }

                                                                                                        let camcnk = []
                                                                                                        camera_checkbox.map((cam) => {
                                                                                                            if (cam !== val._id) {
                                                                                                                camcnk.push(cam)
                                                                                                            }
                                                                                                        })

                                                                                                        let online = 0
                                                                                                        let offline = 0

                                                                                                        new_camera_list.map((val) => {
                                                                                                            if (val.camera_health == 'Online') {
                                                                                                                online = online + 1
                                                                                                            } else {
                                                                                                                offline = offline + 1
                                                                                                            }

                                                                                                        })

                                                                                                        setcamera_checkbox(camcnk)
                                                                                                        setcameras_view(new_camera_list)
                                                                                                        setcameras_view2(new_camera_list)
                                                                                                        setselectedcameras(new_camera_list)
                                                                                                        dispatch({ type: SELECTED_CAMERAS, value: new_camera_list })
                                                                                                        dispatch({ type: APPLY, value: !apply })
                                                                                                        setfinaldata([])
                                                                                                        setimage_arr([])
                                                                                                        setfinaldate('')
                                                                                                        colflag = true
                                                                                                        setcolcount(30)
                                                                                                        // setclickbtn2(true)
                                                                                                        setonline_cam(online)
                                                                                                        setoffline_cam(offline)
                                                                                                    }
                                                                                                }
                                                                                            }}></input>
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                                :
                                                                                <p style={{ margin: 0, color: 'grey', width: '200px', textAlign: 'center' }}>No Cameras</p>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div style={{ position: 'relative' }} className='status-div' >
                                                            <button className='eventbtn' id='cameras' onClick={() => {
                                                                setonline_status(!online_status)
                                                                setcamera_box(false)
                                                                setcamera_tag(false)
                                                                setcamera_group(false)


                                                            }} style={{ display: 'flex', backgroundColor: online_status ? '#e22747' : '#e6e8eb', color: online_status ? 'white' : 'black' }}> <VideoCameraBackOutlinedIcon style={{ marginRight: '10px' }} />Status </button>

                                                            <div id='status' style={{ borderRadius: '5px', backgroundColor: '#181828', padding: '10px', position: 'absolute', top: '60px', zIndex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', display: online_status ? 'block' : 'none' }}>
                                                                <div style={{ position: 'relative' }}>

                                                                    <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: '-37px' }} />
                                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                        <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                                                            <CloseIcon style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }} onClick={() => {
                                                                                setonline_status(!online_status)
                                                                                setcamera_box(false)
                                                                                setcamera_tag(false)
                                                                                setcamera_group(false)
                                                                            }} />
                                                                        </div>
                                                                    </div>

                                                                    <div>

                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                                                            <p style={{ margin: 0, color: 'white', width: '200px' }}>Online<span style={{ color: 'white', borderRadius: '50%', backgroundColor: '#a8a4a4', marginLeft: '10px', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px' }}>{online_cam}</span></p>
                                                                            <input id='online_status' className='status' type="checkbox" onClick={(e) => {
                                                                                let flagcount = 0
                                                                                let flagcount1 = 0
                                                                                let flagcount2 = 0



                                                                                let check = document.getElementsByClassName('tagCheckbox')
                                                                                for (let i = 0; i < check.length; i++) {
                                                                                    if (check[i].checked === false) {
                                                                                        flagcount = flagcount + 1
                                                                                    }
                                                                                }

                                                                                let check1 = document.getElementsByClassName('groupCheckbox')
                                                                                for (let i = 0; i < check1.length; i++) {
                                                                                    if (check1[i].checked === false) {
                                                                                        flagcount1 = flagcount1 + 1
                                                                                    }
                                                                                }

                                                                                let check2 = document.getElementsByClassName('cameraCheckbox')
                                                                                for (let i = 0; i < check2.length; i++) {
                                                                                    if (check2[i].checked === false) {
                                                                                        flagcount2 = flagcount2 + 1
                                                                                    }
                                                                                }

                                                                                if (document.getElementById('offline_status').checked && e.target.checked) {
                                                                                    setcameras_view(cameras_view1)
                                                                                    // setcameras_search(cameras_view1)
                                                                                } else {
                                                                                    if (e.target.checked === true) {
                                                                                        let new_date = []
                                                                                        cameras_view.map((val) => {
                                                                                            if (val.camera_health == 'Online') {
                                                                                                new_date.push(val)
                                                                                            }
                                                                                        })

                                                                                        setcameras_view(new_date)
                                                                                        // setcameras_search(new_date)
                                                                                    } else {
                                                                                        if (!document.getElementById('offline_status').checked && !e.target.checked) {
                                                                                            setcameras_view(cameras_view1)
                                                                                            // setcameras_search(cameras_view1)
                                                                                        } else {
                                                                                            let new_date = []
                                                                                            cameras_view.map((val) => {
                                                                                                if (val.camera_health != 'Online') {
                                                                                                    new_date.push(val)
                                                                                                }
                                                                                            })

                                                                                            setcameras_view(new_date)
                                                                                            // setcameras_search(new_date)
                                                                                        }

                                                                                    }
                                                                                }
                                                                            }}
                                                                            ></input>
                                                                        </div>

                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                                                            <p style={{ margin: 0, color: 'white', width: '200px' }}>Offline<span style={{ color: 'white', borderRadius: '50%', backgroundColor: '#a8a4a4', marginLeft: '10px', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px' }}>{offline_cam}</span></p>
                                                                            <input id='offline_status' className='status' type="checkbox" onClick={(e) => {

                                                                                let flagcount = 0
                                                                                let flagcount1 = 0
                                                                                let flagcount2 = 0



                                                                                let check = document.getElementsByClassName('tagCheckbox')
                                                                                for (let i = 0; i < check.length; i++) {
                                                                                    if (check[i].checked === false) {
                                                                                        flagcount = flagcount + 1
                                                                                    }
                                                                                }

                                                                                let check1 = document.getElementsByClassName('groupCheckbox')
                                                                                for (let i = 0; i < check1.length; i++) {
                                                                                    if (check1[i].checked === false) {
                                                                                        flagcount1 = flagcount1 + 1
                                                                                    }
                                                                                }

                                                                                let check2 = document.getElementsByClassName('cameraCheckbox')
                                                                                for (let i = 0; i < check2.length; i++) {
                                                                                    if (check2[i].checked === false) {
                                                                                        flagcount2 = flagcount2 + 1
                                                                                    }
                                                                                }

                                                                                if (document.getElementById('online_status').checked && e.target.checked) {
                                                                                    setcameras_view(cameras_view1)
                                                                                    // setcameras_search(cameras_view1)
                                                                                } else {
                                                                                    if (e.target.checked === true) {
                                                                                        let new_date = []
                                                                                        cameras_view.map((val) => {
                                                                                            if (val.camera_health == 'Offline') {
                                                                                                new_date.push(val)
                                                                                            }
                                                                                        })

                                                                                        setcameras_view(new_date)
                                                                                        // setcameras_search(new_date)
                                                                                    } else {
                                                                                        if (!document.getElementById('online_status').checked && !e.target.checked) {
                                                                                            setcameras_view(cameras_view1)
                                                                                            // setcameras_search(cameras_view1)
                                                                                        } else {
                                                                                            let new_date = []
                                                                                            cameras_view.map((val) => {
                                                                                                if (val.camera_health != 'Offline') {
                                                                                                    new_date.push(val)
                                                                                                }
                                                                                            })

                                                                                            setcameras_view(new_date)
                                                                                            // setcameras_search(new_date)
                                                                                        }

                                                                                    }
                                                                                }
                                                                            }}></input>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div style={{ position: 'relative' }} className='tagCheckBox-div' >
                                                            <button className='eventbtn' id='cameras' onClick={() => {
                                                                setcamera_tag(!camera_tag)
                                                                setonline_status(false)
                                                                setcamera_box(false)
                                                                setcamera_group(false)

                                                            }} style={{ display: 'flex', backgroundColor: camera_tag ? '#e22747' : '#e6e8eb', color: camera_tag ? 'white' : 'black' }}> <SellOutlinedIcon style={{ marginRight: '10px' }} />Tags <div style={{ backgroundColor: '#e32747', padding: '3px', borderRadius: '50%', height: '25px', width: '25px', marginLeft: '10px' }}><p style={{ color: 'white' }}>{get_tag_full_data_sort.length}</p></div> <ArrowDropDownIcon style={{ marginLeft: '0px' }} /></button>

                                                            <div>
                                                                <div style={{ borderRadius: '5px', backgroundColor: '#181828', padding: '10px', position: 'absolute', top: '60px', zIndex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', display: camera_tag ? 'block' : 'none' }}>
                                                                    <div style={{ position: 'relative' }}>

                                                                        <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: '-37px' }} />
                                                                        <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                            <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                                                                <CloseIcon style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }} onClick={() => {
                                                                                    setcamera_tag(!camera_tag)
                                                                                    setonline_status(false)
                                                                                    setcamera_box(false)
                                                                                    setcamera_group(false)
                                                                                }} />
                                                                            </div>

                                                                            <div>
                                                                                <input type='text' placeholder='Search' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginBottom: '5px', width: '100%', height: '40px' }} onChange={(e) => {
                                                                                    if (e.target.value !== '') {
                                                                                        if (tag_search == '') {
                                                                                            setget_tag_full_data_sort1(get_tag_full_data_sort)
                                                                                        }
                                                                                        searchfunction(e.target.value, get_tag_full_data_sort1, 'tag_search')
                                                                                        settag_search(e.target.value)
                                                                                    } else {
                                                                                        setget_tag_full_data_sort(get_tag_full_data_sort1)
                                                                                    }
                                                                                }}></input>
                                                                            </div>


                                                                            {
                                                                                get_tag_full_data_sort.length !== 0 ?
                                                                                    <p style={{ margin: 0, color: 'white', cursor: 'pointer' }} onClick={() => {
                                                                                        let tag_value = []
                                                                                        let check = document.getElementsByClassName('tagCheckbox')
                                                                                        for (let i = 0; i < check.length; i++) {
                                                                                            if (check[i].checked == true) {
                                                                                                tag_value.push(get_tag_full_data_sort[i])
                                                                                            }
                                                                                            check[i].checked = false
                                                                                        }

                                                                                        tag_value.map((val) => {
                                                                                            tagelsefunction(val, 'once')
                                                                                        })

                                                                                        dispatch({ type: APPLY, value: !apply })
                                                                                        setcamera_tag(!camera_tag)
                                                                                        settag_checkbox([])
                                                                                        // setcameras_view(duplicateData)

                                                                                    }}>Clear all</p>
                                                                                    : ''
                                                                            }

                                                                        </div>

                                                                        <div className='lower_alerts' style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                                                                            {
                                                                                get_tag_full_data_sort.length !== 0 ?
                                                                                    get_tag_full_data_sort.map((value, k) => {
                                                                                        let typ = false
                                                                                        tag_checkbox.map((id) => {
                                                                                            if (id == value._id) {
                                                                                                typ = true
                                                                                            }
                                                                                        })
                                                                                        return (
                                                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                                                                                <p style={{ margin: 0, color: 'white', width: '200px' }}>{value.tag_name.charAt(0).toUpperCase() + value.tag_name.slice(1)}<span style={{ color: 'white', borderRadius: '50%', backgroundColor: '#a8a4a4', marginLeft: '10px', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px' }}>{value.tags.length}</span></p>
                                                                                                <input className='tagCheckbox' checked={typ ? true : false} type="checkbox" onClick={(e) => {


                                                                                                    if (e.target.checked === true) {

                                                                                                        const axios = require('axios');
                                                                                                        let data = JSON.stringify({
                                                                                                            "tag_id": value._id
                                                                                                        });

                                                                                                        let config = {
                                                                                                            method: 'post',
                                                                                                            maxBodyLength: Infinity,
                                                                                                            url: api.TAG_API_LIST_ALL_ID,
                                                                                                            headers: {
                                                                                                                'Content-Type': 'application/json'
                                                                                                            },
                                                                                                            data: data
                                                                                                        };


                                                                                                        axios.request(config)

                                                                                                            .then((response) => {
                                                                                                                let count = 0
                                                                                                                let data1 = []

                                                                                                                response.data.map((val) => {
                                                                                                                    count = count + 1
                                                                                                                    let findPermissionLevel = cameras.find((d) => d._id === response.data[k]._id).permission_level

                                                                                                                    let time = moment(new Date(), 'HH:mm:ss');
                                                                                                                    time.subtract(2, 'minutes');
                                                                                                                    let newTime1 = time.format('HH:mm:ss');
                                                                                                                    let newTime = moment(new Date()).format('HH:mm:ss');
                                                                                                                    if ((moment(val.last_active_date).format('YYYY-MM-DD') == moment(new Date()).format('YYYY-MM-DD')) && (moment(val.last_active, 'HH:mm:ss').isBetween(moment(newTime1, 'HH:mm:ss'), moment(newTime, 'HH:mm:ss')))) {
                                                                                                                        data1.push({ ...val, camera_health: 'Online' })
                                                                                                                    } else {
                                                                                                                        data1.push({ ...val, camera_health: 'Offline' })
                                                                                                                    }


                                                                                                                    if (count == response.data.length) {

                                                                                                                        let new_camera_list = []
                                                                                                                        let flagcount = 0
                                                                                                                        let flagcount1 = 0
                                                                                                                        let flagcount2 = 0

                                                                                                                        let check = []

                                                                                                                        if (tag_search == '') {
                                                                                                                            check = document.getElementsByClassName('tagCheckbox')
                                                                                                                            for (let i = 0; i < check.length; i++) {
                                                                                                                                if (i != k && check[i].checked === false) {
                                                                                                                                    flagcount = flagcount + 1
                                                                                                                                }
                                                                                                                            }
                                                                                                                        } else {
                                                                                                                            check = camera_checkbox
                                                                                                                            check.push(1)
                                                                                                                        }

                                                                                                                        let check1 = document.getElementsByClassName('groupCheckbox')
                                                                                                                        for (let i = 0; i < check1.length; i++) {
                                                                                                                            if (check1[i].checked === false) {
                                                                                                                                flagcount1 = flagcount1 + 1
                                                                                                                            }
                                                                                                                        }

                                                                                                                        let check2 = document.getElementsByClassName('cameraCheckbox')
                                                                                                                        for (let i = 0; i < check2.length; i++) {
                                                                                                                            if (check2[i].checked === false) {
                                                                                                                                flagcount2 = flagcount2 + 1
                                                                                                                            }
                                                                                                                        }

                                                                                                                        if (check.length > flagcount) {
                                                                                                                            if (data1.length !== 0) {
                                                                                                                                if (check.length - 1 == flagcount) {
                                                                                                                                    if (check1.length == flagcount1 && check2.length == flagcount2) {

                                                                                                                                        new_camera_list = data1
                                                                                                                                    } else {
                                                                                                                                        let data = [...cameras_view, ...data1]
                                                                                                                                        for (let index = 0; index < data.length; index++) {
                                                                                                                                            let flag = true
                                                                                                                                            let obj = ''
                                                                                                                                            for (let index1 = 0; index1 < cameras_view.length; index1++) {
                                                                                                                                                if (cameras_view[index1]._id === data[index]._id) {
                                                                                                                                                    flag = false
                                                                                                                                                    break
                                                                                                                                                } else {
                                                                                                                                                    flag = true
                                                                                                                                                    obj = data[index]
                                                                                                                                                }
                                                                                                                                            }

                                                                                                                                            if (flag === true) {
                                                                                                                                                new_camera_list.push(obj)
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                        new_camera_list = [...cameras_view, ...new_camera_list]
                                                                                                                                    }

                                                                                                                                } else {
                                                                                                                                    let data = [...cameras_view, ...data1]
                                                                                                                                    for (let index = 0; index < data.length; index++) {
                                                                                                                                        let flag = true
                                                                                                                                        let obj = ''
                                                                                                                                        for (let index1 = 0; index1 < cameras_view.length; index1++) {
                                                                                                                                            if (cameras_view[index1]._id === data[index]._id) {
                                                                                                                                                flag = false
                                                                                                                                                break
                                                                                                                                            } else {
                                                                                                                                                flag = true
                                                                                                                                                obj = data[index]
                                                                                                                                            }
                                                                                                                                        }

                                                                                                                                        if (flag === true) {
                                                                                                                                            new_camera_list.push(obj)
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                    new_camera_list = [...cameras_view, ...new_camera_list]
                                                                                                                                }

                                                                                                                            } else {

                                                                                                                                new_camera_list = cameras_view
                                                                                                                            }
                                                                                                                        } else {

                                                                                                                            new_camera_list = data
                                                                                                                        }

                                                                                                                        let online = 0
                                                                                                                        let offline = 0
                                                                                                                        let online_list = []
                                                                                                                        let offline_list = []

                                                                                                                        new_camera_list.map((val) => {
                                                                                                                            if (val.camera_health == 'Online') {
                                                                                                                                online = online + 1
                                                                                                                                online_list.push(val)
                                                                                                                            } else {
                                                                                                                                offline = offline + 1
                                                                                                                                offline_list.push(val)
                                                                                                                            }

                                                                                                                        })

                                                                                                                        let check3 = document.getElementsByClassName('status')
                                                                                                                        if (check3[0].checked == true) {
                                                                                                                            setcameras_view(online_list)
                                                                                                                            // setcameras_search(online_list)
                                                                                                                        } else if (check3[1].checked == true) {
                                                                                                                            setcameras_view(offline_list)
                                                                                                                            // setcameras_search(offline_list)
                                                                                                                        } else {
                                                                                                                            setcameras_view(new_camera_list)
                                                                                                                            // setcameras_search(new_camera_list)
                                                                                                                        }


                                                                                                                        settag_checkbox([...tag_checkbox, value._id])
                                                                                                                        setcameras_view(new_camera_list)
                                                                                                                        setcameras_view2(new_camera_list)
                                                                                                                        setcameras_view1(new_camera_list)
                                                                                                                        setselectedcameras(new_camera_list)
                                                                                                                        dispatch({ type: SELECTED_CAMERAS, value: new_camera_list })
                                                                                                                        dispatch({ type: APPLY, value: !apply })
                                                                                                                        setfinaldata([])
                                                                                                                        setimage_arr([])
                                                                                                                        setfinaldate('')
                                                                                                                        colflag = true
                                                                                                                        setcolcount(30)
                                                                                                                        // setclickbtn2(true)
                                                                                                                        setonline_cam(online)
                                                                                                                        setoffline_cam(offline)
                                                                                                                    }
                                                                                                                })

                                                                                                                //                 response.data.map((val) => {
                                                                                                                //                     const getStocksData = {
                                                                                                                //                         method: 'get',
                                                                                                                //                         maxBodyLength: Infinity,
                                                                                                                //                         url: `${api.CAMERAS_HEALTH}${val.stream_id}/stream-info`,
                                                                                                                //                         headers: {
                                                                                                                //                             'Content-Type': 'application/json'
                                                                                                                //                         },
                                                                                                                //                     }


                                                                                                                //                     axios(getStocksData)
                                                                                                                //                         .then(res => {
                                                                                                                //                             count = count + 1
                                                                                                                //                             let findPermissionLevel = cameras.find((d) => d._id === response.data[k]._id).permission_level
                                                                                                                //                             data1.push({ ...val, camera_health: res.data.length !== 0 ? 'Online' : 'Offline', permission_level: findPermissionLevel })


                                                                                                                //                             if (count == response.data.length) {

                                                                                                                //                                 let new_camera_list = []
                                                                                                                //                                 let flagcount = 0
                                                                                                                //                                 let flagcount1 = 0
                                                                                                                //                                 let flagcount2 = 0

                                                                                                                //                                 let check = []

                                                                                                                //                                 if (tag_search == '') {
                                                                                                                //                                     check = document.getElementsByClassName('tagCheckbox')
                                                                                                                //                                     for (let i = 0; i < check.length; i++) {
                                                                                                                //                                         if (i != k && check[i].checked === false) {
                                                                                                                //                                             flagcount = flagcount + 1
                                                                                                                //                                         }
                                                                                                                //                                     }
                                                                                                                //                                 } else {
                                                                                                                //                                     check = camera_checkbox
                                                                                                                //                                     check.push(1)
                                                                                                                //                                 }

                                                                                                                //                                 let check1 = document.getElementsByClassName('groupCheckbox')
                                                                                                                //                                 for (let i = 0; i < check1.length; i++) {
                                                                                                                //                                     if (check1[i].checked === false) {
                                                                                                                //                                         flagcount1 = flagcount1 + 1
                                                                                                                //                                     }
                                                                                                                //                                 }

                                                                                                                //                                 let check2 = document.getElementsByClassName('cameraCheckbox')
                                                                                                                //                                 for (let i = 0; i < check2.length; i++) {
                                                                                                                //                                     if (check2[i].checked === false) {
                                                                                                                //                                         flagcount2 = flagcount2 + 1
                                                                                                                //                                     }
                                                                                                                //                                 }

                                                                                                                //                                 if (check.length > flagcount) {
                                                                                                                //                                     if (data1.length !== 0) {
                                                                                                                //                                         if (check.length - 1 == flagcount) {
                                                                                                                //                                             if (check1.length == flagcount1 && check2.length == flagcount2) {

                                                                                                                //                                                 new_camera_list = data1
                                                                                                                //                                             } else {
                                                                                                                //                                                 let data = [...cameras_view, ...data1]
                                                                                                                //                                                 for (let index = 0; index < data.length; index++) {
                                                                                                                //                                                     let flag = true
                                                                                                                //                                                     let obj = ''
                                                                                                                //                                                     for (let index1 = 0; index1 < cameras_view.length; index1++) {
                                                                                                                //                                                         if (cameras_view[index1]._id === data[index]._id) {
                                                                                                                //                                                             flag = false
                                                                                                                //                                                             break
                                                                                                                //                                                         } else {
                                                                                                                //                                                             flag = true
                                                                                                                //                                                             obj = data[index]
                                                                                                                //                                                         }
                                                                                                                //                                                     }

                                                                                                                //                                                     if (flag === true) {
                                                                                                                //                                                         new_camera_list.push(obj)
                                                                                                                //                                                     }
                                                                                                                //                                                 }
                                                                                                                //                                                 new_camera_list = [...cameras_view, ...new_camera_list]
                                                                                                                //                                             }

                                                                                                                //                                         } else {
                                                                                                                //                                             let data = [...cameras_view, ...data1]
                                                                                                                //                                             for (let index = 0; index < data.length; index++) {
                                                                                                                //                                                 let flag = true
                                                                                                                //                                                 let obj = ''
                                                                                                                //                                                 for (let index1 = 0; index1 < cameras_view.length; index1++) {
                                                                                                                //                                                     if (cameras_view[index1]._id === data[index]._id) {
                                                                                                                //                                                         flag = false
                                                                                                                //                                                         break
                                                                                                                //                                                     } else {
                                                                                                                //                                                         flag = true
                                                                                                                //                                                         obj = data[index]
                                                                                                                //                                                     }
                                                                                                                //                                                 }

                                                                                                                //                                                 if (flag === true) {
                                                                                                                //                                                     new_camera_list.push(obj)
                                                                                                                //                                                 }
                                                                                                                //                                             }
                                                                                                                //                                             new_camera_list = [...cameras_view, ...new_camera_list]
                                                                                                                //                                         }

                                                                                                                //                                     } else {

                                                                                                                //                                         new_camera_list = cameras_view
                                                                                                                //                                     }
                                                                                                                //                                 } else {

                                                                                                                //                                     new_camera_list = data
                                                                                                                //                                 }

                                                                                                                //                                 let online = 0
                                                                                                                //                                 let offline = 0
                                                                                                                //                                 let online_list = []
                                                                                                                //                                 let offline_list = []

                                                                                                                //                                 new_camera_list.map((val) => {
                                                                                                                //                                     if (val.camera_health == 'Online') {
                                                                                                                //                                         online = online + 1
                                                                                                                //                                         online_list.push(val)
                                                                                                                //                                     } else {
                                                                                                                //                                         offline = offline + 1
                                                                                                                //                                         offline_list.push(val)
                                                                                                                //                                     }

                                                                                                                //                                 })

                                                                                                                //                                 let check3 = document.getElementsByClassName('status')
                                                                                                                //                                 if (check3[0].checked == true) {
                                                                                                                //                                     setcameras_view(online_list)
                                                                                                                //                                     // setcameras_search(online_list)
                                                                                                                //                                 } else if (check3[1].checked == true) {
                                                                                                                //                                     setcameras_view(offline_list)
                                                                                                                //                                     // setcameras_search(offline_list)
                                                                                                                //                                 } else {
                                                                                                                //                                     setcameras_view(new_camera_list)
                                                                                                                //                                     // setcameras_search(new_camera_list)
                                                                                                                //                                 }


                                                                                                                //                                 settag_checkbox([...tag_checkbox, value._id])
                                                                                                                //                                 setcameras_view(new_camera_list)
                                                                                                                //                                 setcameras_view2(new_camera_list)
                                                                                                                //                                 setcameras_view1(new_camera_list)
                                                                                                                //                                 setselectedcameras(new_camera_list)
                                                                                                                //                                 dispatch({ type: SELECTED_CAMERAS, value: new_camera_list })
                                                                                                                //                                 dispatch({ type: APPLY, value: !apply })
                                                                                                                //                                 setfinaldata([])
                                                                                                                //                                 setimage_arr([])
                                                                                                                //                                 setfinaldate('')
                                                                                                                //                                 colflag = true
                                                                                                                //                                 setcolcount(30)
                                                                                                                //                                 // setclickbtn2(true)
                                                                                                                //                                 setonline_cam(online)
                                                                                                                //                                 setoffline_cam(offline)
                                                                                                                //                             }
                                                                                                                //                         })
                                                                                                                //                         .catch(function (e) {
                                                                                                                //                             console.log(e);

                                                                                                                //                         });
                                                                                                                //                 })
                                                                                                            })



                                                                                                            .catch((error) => {
                                                                                                                console.log(error);
                                                                                                            })

                                                                                                        // console.log([...selectedanalytics, val]);
                                                                                                    } else {
                                                                                                        tagelsefunction(value, 'regular')
                                                                                                    }
                                                                                                }
                                                                                                }></input>
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                    :
                                                                                    <p style={{ margin: 0, color: 'grey', width: '200px', textAlign: 'center' }}>No Tags</p>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div style={{ position: 'relative' }} className='groupCheckBox-div' >
                                                            <button className='eventbtn' id='cameras' onClick={() => {
                                                                setcamera_group(!camera_group)
                                                                setcamera_tag(false)
                                                                setonline_status(false)
                                                                setcamera_box(false)

                                                            }} style={{ display: 'flex', backgroundColor: camera_group ? '#e22747' : '#e6e8eb', color: camera_group ? 'white' : 'black' }}> <VideocamOutlinedIcon style={{ marginRight: '10px' }} />Groups <div style={{ backgroundColor: '#e32747', padding: '3px', borderRadius: '50%', height: '25px', width: '25px', marginLeft: '10px' }}><p style={{ color: 'white' }}>{get_group_full_data_sort.length}</p></div> <ArrowDropDownIcon style={{ marginLeft: '0px' }} /></button>

                                                            <div>
                                                                <div style={{ borderRadius: '5px', backgroundColor: '#181828', padding: '10px', position: 'absolute', top: '60px', zIndex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', display: camera_group ? 'block' : 'none' }}>
                                                                    <div style={{ position: 'relative' }}>

                                                                        <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: '-37px' }} />
                                                                        <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                            <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                                                                <CloseIcon style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }} onClick={() => {
                                                                                    setcamera_group(!camera_group)
                                                                                    setcamera_tag(false)
                                                                                    setonline_status(false)
                                                                                    setcamera_box(false)
                                                                                }} />
                                                                            </div>

                                                                            <div>
                                                                                <input type='text' placeholder='Search' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginBottom: '5px', width: '100%', height: '40px' }} onChange={(e) => {
                                                                                    if (e.target.value !== '') {
                                                                                        if (group_search == '') {
                                                                                            setget_group_full_data_sort1(get_group_full_data_sort)
                                                                                        }
                                                                                        searchfunction(e.target.value, get_group_full_data_sort1, 'group_search')
                                                                                        setgroup_search(e.target.value)
                                                                                    } else {
                                                                                        setget_group_full_data_sort(get_group_full_data_sort1)
                                                                                    }
                                                                                }}></input>
                                                                            </div>
                                                                            {
                                                                                get_group_full_data_sort.length !== 0 ?
                                                                                    <p style={{ margin: 0, color: 'white', cursor: 'pointer' }} onClick={() => {
                                                                                        let group_value = []
                                                                                        let check = document.getElementsByClassName('groupCheckbox')
                                                                                        for (let i = 0; i < check.length; i++) {
                                                                                            if (check[i].checked == true) {
                                                                                                group_value.push(get_group_full_data_sort[i])
                                                                                            }
                                                                                            check[i].checked = false
                                                                                        }

                                                                                        group_value.map((val) => {
                                                                                            groupelsefunction(val, 'once')
                                                                                        })

                                                                                        dispatch({ type: APPLY, value: !apply })
                                                                                        setcamera_group(!camera_group)
                                                                                        // setcameras_view(duplicateData)
                                                                                        setgroup_checkbox([])
                                                                                    }}>Clear all</p>
                                                                                    : ''
                                                                            }

                                                                        </div>

                                                                        <div className='lower_alerts' style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                                                                            {
                                                                                get_group_full_data_sort.length !== 0 ?
                                                                                    get_group_full_data_sort.map((value, k) => {
                                                                                        let typ = false
                                                                                        group_checkbox.map((id) => {
                                                                                            if (id == value._id) {
                                                                                                typ = true
                                                                                            }
                                                                                        })
                                                                                        return (
                                                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                                                                                <p style={{ margin: 0, color: 'white', width: '200px' }}>{value.group_name.charAt(0).toUpperCase() + value.group_name.slice(1)}<span style={{ color: 'white', borderRadius: '50%', backgroundColor: '#a8a4a4', marginLeft: '10px', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px' }}>{value.groups.length}</span></p>
                                                                                                <input className='groupCheckbox' checked={typ ? true : false} type="checkbox" onClick={(e) => {
                                                                                                    if (e.target.checked === true) {
                                                                                                        const axios = require('axios');
                                                                                                        let data = JSON.stringify({
                                                                                                            "group_id": value._id
                                                                                                        });

                                                                                                        let config = {
                                                                                                            method: 'post',
                                                                                                            maxBodyLength: Infinity,
                                                                                                            url: api.GROUP_API_LIST_ALL_ID,
                                                                                                            headers: {
                                                                                                                'Content-Type': 'application/json'
                                                                                                            },
                                                                                                            data: data
                                                                                                        };


                                                                                                        axios.request(config)
                                                                                                            // .then((response) => {
                                                                                                            //     console.log(response.data)
                                                                                                            //     let new_camera_list = []
                                                                                                            //     let flagcount = 0
                                                                                                            //     let flagcount1 = 0
                                                                                                            //     let flagcount2 = 0

                                                                                                            //     let check = document.getElementsByClassName('tagCheckbox')
                                                                                                            //     for (let i = 0; i < check.length; i++) {
                                                                                                            //         if (check[i].checked === false) {
                                                                                                            //             flagcount = flagcount + 1
                                                                                                            //         }
                                                                                                            //     }

                                                                                                            //     let check1 = []

                                                                                                            //     if (group_search == '') {
                                                                                                            //         check1 = document.getElementsByClassName('groupCheckbox')
                                                                                                            //         for (let i = 0; i < check1.length; i++) {
                                                                                                            //             if (i != k && check1[i].checked === false) {
                                                                                                            //                 flagcount1 = flagcount1 + 1
                                                                                                            //             }
                                                                                                            //         }
                                                                                                            //     } else {
                                                                                                            //         check1 = camera_checkbox
                                                                                                            //         check1.push(1)
                                                                                                            //     }

                                                                                                            //     let check2 = document.getElementsByClassName('cameraCheckbox')
                                                                                                            //     for (let i = 0; i < check2.length; i++) {
                                                                                                            //         if (check2[i].checked === false) {
                                                                                                            //             flagcount2 = flagcount2 + 1
                                                                                                            //         }
                                                                                                            //     }

                                                                                                            //     if (check1.length > flagcount1) {
                                                                                                            //         if (response.data.length !== 0) {
                                                                                                            //             if (check1.length - 1 == flagcount1) {
                                                                                                            //                 if (check.length == flagcount && check2.length == flagcount2) {

                                                                                                            //                     new_camera_list = response.data
                                                                                                            //                 } else {
                                                                                                            //                     let data = [...cameras_view, ...response.data]
                                                                                                            //                     for (let index = 0; index < data.length; index++) {
                                                                                                            //                         let flag = true
                                                                                                            //                         let obj = ''
                                                                                                            //                         for (let index1 = 0; index1 < cameras_view.length; index1++) {
                                                                                                            //                             if (cameras_view[index1]._id === data[index]._id) {
                                                                                                            //                                 flag = false
                                                                                                            //                                 break
                                                                                                            //                             } else {
                                                                                                            //                                 flag = true
                                                                                                            //                                 obj = data[index]
                                                                                                            //                             }
                                                                                                            //                         }

                                                                                                            //                         if (flag === true) {
                                                                                                            //                             new_camera_list.push(obj)
                                                                                                            //                         }
                                                                                                            //                     }
                                                                                                            //                     new_camera_list = [...cameras_view, ...new_camera_list]
                                                                                                            //                 }

                                                                                                            //             } else {
                                                                                                            //                 let data = [...cameras_view, ...response.data]
                                                                                                            //                 for (let index = 0; index < data.length; index++) {
                                                                                                            //                     let flag = true
                                                                                                            //                     let obj = ''
                                                                                                            //                     for (let index1 = 0; index1 < cameras_view.length; index1++) {
                                                                                                            //                         if (cameras_view[index1]._id === data[index]._id) {
                                                                                                            //                             flag = false
                                                                                                            //                             break
                                                                                                            //                         } else {
                                                                                                            //                             flag = true
                                                                                                            //                             obj = data[index]
                                                                                                            //                         }
                                                                                                            //                     }

                                                                                                            //                     if (flag === true) {
                                                                                                            //                         new_camera_list.push(obj)
                                                                                                            //                     }
                                                                                                            //                 }
                                                                                                            //                 new_camera_list = [...cameras_view, ...new_camera_list]
                                                                                                            //             }

                                                                                                            //         } else {

                                                                                                            //             new_camera_list = cameras_view
                                                                                                            //         }
                                                                                                            //     } else {

                                                                                                            //         new_camera_list = data
                                                                                                            //     }

                                                                                                            //     let online = 0
                                                                                                            //         let offline = 0
                                                                                                            //         let online_list = []
                                                                                                            //         let offline_list = []

                                                                                                            //         new_camera_list.map((val) => {
                                                                                                            //             if (val.camera_health == 'Online') {
                                                                                                            //                 online = online + 1
                                                                                                            //                 online_list.push(val)
                                                                                                            //             } else {
                                                                                                            //                 offline = offline + 1
                                                                                                            //                 offline_list.push(val)
                                                                                                            //             }

                                                                                                            //         })

                                                                                                            //         let check3 = document.getElementsByClassName('status')
                                                                                                            //         if (check3[0].checked == true) {
                                                                                                            //             setcameras_view(online_list)
                                                                                                            //             // setcameras_search(online_list)
                                                                                                            //         } else if (check3[1].checked == true) {
                                                                                                            //             setcameras_view(offline_list)
                                                                                                            //             // setcameras_search(offline_list)
                                                                                                            //         } else {
                                                                                                            //             setcameras_view(new_camera_list)
                                                                                                            //             // setcameras_search(new_camera_list)
                                                                                                            //         }


                                                                                                            //     setgroup_checkbox([...group_checkbox, val._id])
                                                                                                            //     setcameras_view(new_camera_list)
                                                                                                            //     setcameras_view2(new_camera_list)
                                                                                                            //     setcameras_view1(new_camera_list)
                                                                                                            //     setselectedcameras(new_camera_list)
                                                                                                            //     dispatch({ type: SELECTED_CAMERAS, value: new_camera_list })
                                                                                                            //     dispatch({ type: APPLY, value: !apply })
                                                                                                            //     setfinaldata([])
                                                                                                            //     setimage_arr([])
                                                                                                            //     setfinaldate('')
                                                                                                            //     colflag = true
                                                                                                            //     setcolcount(30)
                                                                                                            //     // setclickbtn2(true)
                                                                                                            //     setonline_cam(online)
                                                                                                            //     setoffline_cam(offline)
                                                                                                            // })
                                                                                                            .catch((error) => {
                                                                                                                console.log(error);
                                                                                                            })

                                                                                                            // console.log([...selectedanalytics, val]);
                                                                                                            .then((response) => {
                                                                                                                console.log(response.data)
                                                                                                                let count = 0
                                                                                                                let data1 = []

                                                                                                                response.data.map((val) => {

                                                                                                                    count = count + 1
                                                                                                                    let findPermissionLevel = cameras.find((d) => d._id === response.data[k]._id).permission_level

                                                                                                                    let time = moment(new Date(), 'HH:mm:ss');
                                                                                                                    time.subtract(2, 'minutes');
                                                                                                                    let newTime1 = time.format('HH:mm:ss');
                                                                                                                    let newTime = moment(new Date()).format('HH:mm:ss');
                                                                                                                    if ((moment(val.last_active_date).format('YYYY-MM-DD') == moment(new Date()).format('YYYY-MM-DD')) && (moment(val.last_active, 'HH:mm:ss').isBetween(moment(newTime1, 'HH:mm:ss'), moment(newTime, 'HH:mm:ss')))) {
                                                                                                                        data1.push({ ...val, camera_health: 'Online' })
                                                                                                                    } else {
                                                                                                                        data1.push({ ...val, camera_health: 'Offline' })
                                                                                                                    }

                                                                                                                    if (count == response.data.length) {
                                                                                                                        let new_camera_list = []
                                                                                                                        let flagcount = 0
                                                                                                                        let flagcount1 = 0
                                                                                                                        let flagcount2 = 0

                                                                                                                        let check = document.getElementsByClassName('tagCheckbox')
                                                                                                                        for (let i = 0; i < check.length; i++) {
                                                                                                                            if (check[i].checked === false) {
                                                                                                                                flagcount = flagcount + 1
                                                                                                                            }
                                                                                                                        }

                                                                                                                        let check1 = []

                                                                                                                        if (group_search == '') {
                                                                                                                            check1 = document.getElementsByClassName('groupCheckbox')
                                                                                                                            for (let i = 0; i < check1.length; i++) {
                                                                                                                                if (i != k && check1[i].checked === false) {
                                                                                                                                    flagcount1 = flagcount1 + 1
                                                                                                                                }
                                                                                                                            }
                                                                                                                        } else {
                                                                                                                            check1 = camera_checkbox
                                                                                                                            check1.push(1)
                                                                                                                        }

                                                                                                                        let check2 = document.getElementsByClassName('cameraCheckbox')
                                                                                                                        for (let i = 0; i < check2.length; i++) {
                                                                                                                            if (check2[i].checked === false) {
                                                                                                                                flagcount2 = flagcount2 + 1
                                                                                                                            }
                                                                                                                        }

                                                                                                                        if (check1.length > flagcount1) {
                                                                                                                            if (data1.length !== 0) {
                                                                                                                                if (check1.length - 1 == flagcount1) {
                                                                                                                                    if (check.length == flagcount && check2.length == flagcount2) {

                                                                                                                                        new_camera_list = data1
                                                                                                                                    } else {
                                                                                                                                        let data = [...cameras_view, ...data1]
                                                                                                                                        for (let index = 0; index < data.length; index++) {
                                                                                                                                            let flag = true
                                                                                                                                            let obj = ''
                                                                                                                                            for (let index1 = 0; index1 < cameras_view.length; index1++) {
                                                                                                                                                if (cameras_view[index1]._id === data[index]._id) {
                                                                                                                                                    flag = false
                                                                                                                                                    break
                                                                                                                                                } else {
                                                                                                                                                    flag = true
                                                                                                                                                    obj = data[index]
                                                                                                                                                }
                                                                                                                                            }

                                                                                                                                            if (flag === true) {
                                                                                                                                                new_camera_list.push(obj)
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                        new_camera_list = [...cameras_view, ...new_camera_list]
                                                                                                                                    }

                                                                                                                                } else {
                                                                                                                                    let data = [...cameras_view, ...data1]
                                                                                                                                    for (let index = 0; index < data.length; index++) {
                                                                                                                                        let flag = true
                                                                                                                                        let obj = ''
                                                                                                                                        for (let index1 = 0; index1 < cameras_view.length; index1++) {
                                                                                                                                            if (cameras_view[index1]._id === data[index]._id) {
                                                                                                                                                flag = false
                                                                                                                                                break
                                                                                                                                            } else {
                                                                                                                                                flag = true
                                                                                                                                                obj = data[index]
                                                                                                                                            }
                                                                                                                                        }

                                                                                                                                        if (flag === true) {
                                                                                                                                            new_camera_list.push(obj)
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                    new_camera_list = [...cameras_view, ...new_camera_list]
                                                                                                                                }

                                                                                                                            } else {

                                                                                                                                new_camera_list = cameras_view
                                                                                                                            }
                                                                                                                        } else {

                                                                                                                            new_camera_list = data
                                                                                                                        }

                                                                                                                        let online = 0
                                                                                                                        let offline = 0
                                                                                                                        let online_list = []
                                                                                                                        let offline_list = []

                                                                                                                        new_camera_list.map((val) => {
                                                                                                                            if (val.camera_health == 'Online') {
                                                                                                                                online = online + 1
                                                                                                                                online_list.push(val)
                                                                                                                            } else {
                                                                                                                                offline = offline + 1
                                                                                                                                offline_list.push(val)
                                                                                                                            }

                                                                                                                        })

                                                                                                                        let check3 = document.getElementsByClassName('status')
                                                                                                                        if (check3[0].checked == true) {
                                                                                                                            setcameras_view(online_list)
                                                                                                                            // setcameras_search(online_list)
                                                                                                                        } else if (check3[1].checked == true) {
                                                                                                                            setcameras_view(offline_list)
                                                                                                                            // setcameras_search(offline_list)
                                                                                                                        } else {
                                                                                                                            setcameras_view(new_camera_list)
                                                                                                                            // setcameras_search(new_camera_list)
                                                                                                                        }


                                                                                                                        setgroup_checkbox([...group_checkbox, value._id])
                                                                                                                        setcameras_view(new_camera_list)
                                                                                                                        setcameras_view2(new_camera_list)
                                                                                                                        setcameras_view1(new_camera_list)
                                                                                                                        setselectedcameras(new_camera_list)
                                                                                                                        dispatch({ type: SELECTED_CAMERAS, value: new_camera_list })
                                                                                                                        dispatch({ type: APPLY, value: !apply })
                                                                                                                        setfinaldata([])
                                                                                                                        setimage_arr([])
                                                                                                                        setfinaldate('')
                                                                                                                        colflag = true
                                                                                                                        setcolcount(30)
                                                                                                                        // setclickbtn2(true)
                                                                                                                        setonline_cam(online)
                                                                                                                        setoffline_cam(offline)
                                                                                                                    }
                                                                                                                    // const getStocksData = {
                                                                                                                    //     method: 'get',
                                                                                                                    //     maxBodyLength: Infinity,
                                                                                                                    //     url: `${api.CAMERAS_HEALTH}${value.stream_id}/stream-info`,
                                                                                                                    //     headers: {
                                                                                                                    //         'Content-Type': 'application/json'
                                                                                                                    //     },
                                                                                                                    // }


                                                                                                                    // axios(getStocksData)
                                                                                                                    //     .then(res => {
                                                                                                                    // count = count + 1
                                                                                                                    // let findPermissionLevel = cameras.find((d) => d._id === response.data[k]._id).permission_level
                                                                                                                    // data1.push({ ...val, camera_health: res.data.length !== 0 ? 'Online' : 'Offline', permission_level: findPermissionLevel })

                                                                                                                    // if (count == response.data.length) {
                                                                                                                    //     let new_camera_list = []
                                                                                                                    //     let flagcount = 0
                                                                                                                    //     let flagcount1 = 0
                                                                                                                    //     let flagcount2 = 0

                                                                                                                    //     let check = document.getElementsByClassName('tagCheckbox')
                                                                                                                    //     for (let i = 0; i < check.length; i++) {
                                                                                                                    //         if (check[i].checked === false) {
                                                                                                                    //             flagcount = flagcount + 1
                                                                                                                    //         }
                                                                                                                    //     }

                                                                                                                    //     let check1 = []

                                                                                                                    //     if (group_search == '') {
                                                                                                                    //         check1 = document.getElementsByClassName('groupCheckbox')
                                                                                                                    //         for (let i = 0; i < check1.length; i++) {
                                                                                                                    //             if (i != k && check1[i].checked === false) {
                                                                                                                    //                 flagcount1 = flagcount1 + 1
                                                                                                                    //             }
                                                                                                                    //         }
                                                                                                                    //     } else {
                                                                                                                    //         check1 = camera_checkbox
                                                                                                                    //         check1.push(1)
                                                                                                                    //     }

                                                                                                                    //     let check2 = document.getElementsByClassName('cameraCheckbox')
                                                                                                                    //     for (let i = 0; i < check2.length; i++) {
                                                                                                                    //         if (check2[i].checked === false) {
                                                                                                                    //             flagcount2 = flagcount2 + 1
                                                                                                                    //         }
                                                                                                                    //     }

                                                                                                                    //     if (check1.length > flagcount1) {
                                                                                                                    //         if (data1.length !== 0) {
                                                                                                                    //             if (check1.length - 1 == flagcount1) {
                                                                                                                    //                 if (check.length == flagcount && check2.length == flagcount2) {

                                                                                                                    //                     new_camera_list = data1
                                                                                                                    //                 } else {
                                                                                                                    //                     let data = [...cameras_view, ...data1]
                                                                                                                    //                     for (let index = 0; index < data.length; index++) {
                                                                                                                    //                         let flag = true
                                                                                                                    //                         let obj = ''
                                                                                                                    //                         for (let index1 = 0; index1 < cameras_view.length; index1++) {
                                                                                                                    //                             if (cameras_view[index1]._id === data[index]._id) {
                                                                                                                    //                                 flag = false
                                                                                                                    //                                 break
                                                                                                                    //                             } else {
                                                                                                                    //                                 flag = true
                                                                                                                    //                                 obj = data[index]
                                                                                                                    //                             }
                                                                                                                    //                         }

                                                                                                                    //                         if (flag === true) {
                                                                                                                    //                             new_camera_list.push(obj)
                                                                                                                    //                         }
                                                                                                                    //                     }
                                                                                                                    //                     new_camera_list = [...cameras_view, ...new_camera_list]
                                                                                                                    //                 }

                                                                                                                    //             } else {
                                                                                                                    //                 let data = [...cameras_view, ...data1]
                                                                                                                    //                 for (let index = 0; index < data.length; index++) {
                                                                                                                    //                     let flag = true
                                                                                                                    //                     let obj = ''
                                                                                                                    //                     for (let index1 = 0; index1 < cameras_view.length; index1++) {
                                                                                                                    //                         if (cameras_view[index1]._id === data[index]._id) {
                                                                                                                    //                             flag = false
                                                                                                                    //                             break
                                                                                                                    //                         } else {
                                                                                                                    //                             flag = true
                                                                                                                    //                             obj = data[index]
                                                                                                                    //                         }
                                                                                                                    //                     }

                                                                                                                    //                     if (flag === true) {
                                                                                                                    //                         new_camera_list.push(obj)
                                                                                                                    //                     }
                                                                                                                    //                 }
                                                                                                                    //                 new_camera_list = [...cameras_view, ...new_camera_list]
                                                                                                                    //             }

                                                                                                                    //         } else {

                                                                                                                    //             new_camera_list = cameras_view
                                                                                                                    //         }
                                                                                                                    //     } else {

                                                                                                                    //         new_camera_list = data
                                                                                                                    //     }

                                                                                                                    //     let online = 0
                                                                                                                    //     let offline = 0
                                                                                                                    //     let online_list = []
                                                                                                                    //     let offline_list = []

                                                                                                                    //     new_camera_list.map((val) => {
                                                                                                                    //         if (val.camera_health == 'Online') {
                                                                                                                    //             online = online + 1
                                                                                                                    //             online_list.push(val)
                                                                                                                    //         } else {
                                                                                                                    //             offline = offline + 1
                                                                                                                    //             offline_list.push(val)
                                                                                                                    //         }

                                                                                                                    //     })

                                                                                                                    //     let check3 = document.getElementsByClassName('status')
                                                                                                                    //     if (check3[0].checked == true) {
                                                                                                                    //         setcameras_view(online_list)
                                                                                                                    //         // setcameras_search(online_list)
                                                                                                                    //     } else if (check3[1].checked == true) {
                                                                                                                    //         setcameras_view(offline_list)
                                                                                                                    //         // setcameras_search(offline_list)
                                                                                                                    //     } else {
                                                                                                                    //         setcameras_view(new_camera_list)
                                                                                                                    //         // setcameras_search(new_camera_list)
                                                                                                                    //     }


                                                                                                                    //     setgroup_checkbox([...group_checkbox, value._id])
                                                                                                                    //     setcameras_view(new_camera_list)
                                                                                                                    //     setcameras_view2(new_camera_list)
                                                                                                                    //     setcameras_view1(new_camera_list)
                                                                                                                    //     setselectedcameras(new_camera_list)
                                                                                                                    //     dispatch({ type: SELECTED_CAMERAS, value: new_camera_list })
                                                                                                                    //     dispatch({ type: APPLY, value: !apply })
                                                                                                                    //     setfinaldata([])
                                                                                                                    //     setimage_arr([])
                                                                                                                    //     setfinaldate('')
                                                                                                                    //     colflag = true
                                                                                                                    //     setcolcount(30)
                                                                                                                    //     // setclickbtn2(true)
                                                                                                                    //     setonline_cam(online)
                                                                                                                    //     setoffline_cam(offline)
                                                                                                                    // }
                                                                                                                    // })
                                                                                                                    // .catch(function (e) {
                                                                                                                    //     console.log(e);

                                                                                                                    // });
                                                                                                                })




                                                                                                            })
                                                                                                    } else {

                                                                                                        groupelsefunction(value, 'regular')
                                                                                                    }
                                                                                                }}></input>
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                    :
                                                                                    <p style={{ margin: 0, color: 'grey', width: '200px', textAlign: 'center' }}>No Groups</p>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                : ''
                                        }

                                        <Row style={{ padding: '10px', minHeight: '100px' }}>

                                            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                <table style={{ width: '100%' }}>
                                                    <tr style={{ backgroundColor: '#e6e8eb', color: 'black' }}>
                                                        <th style={{ padding: '15px' }}>
                                                            {/* <input type='checkbox' checked={selectedcameras.length === cameras.length ? true : false} onClick={(e) => {
                                                            let check = document.getElementsByClassName('check')

                                                            if (e.target.checked === true) {
                                                                for (let i = 0; i < check.length; i++) {
                                                                    check[i].checked = true
                                                                }
                                                                setselectedcameras(cameras)
                                                                dispatch({ type: SELECTED_CAMERAS, value: cameras })
                                                                dispatch({ type: APPLY, value: !apply })
                                                            } else {
                                                                for (let i = 0; i < check.length; i++) {
                                                                    check[i].checked = false
                                                                }
                                                                setselectedcameras([])
                                                                dispatch({ type: SELECTED_CAMERAS, value: [] })
                                                                dispatch({ type: APPLY, value: !apply })
                                                            }

                                                        }}></input> */}

                                                            <div>

                                                                <div style={{ backgroundColor: toggle == true ? '#42cf10' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: toggle == true ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }} onClick={() => {
                                                                    settoggle(!toggle)

                                                                    let check = document.getElementsByClassName('check')
                                                                    if (toggle === false) {
                                                                        console.log(check);
                                                                        // for (let i = 0; i < check.length; i++) {
                                                                        //     check[i].style.backgroundColor = '#42cf10'
                                                                        //     check[i].style.justifyContent = 'flex-end'
                                                                        // }
                                                                        setselectedcameras(cameras)
                                                                    } else {
                                                                        console.log(check);
                                                                        // for (let i = 0; i < check.length; i++) {
                                                                        //     check[i].style.backgroundColor = '#a8a4a4'
                                                                        //     check[i].style.justifyContent = 'flex-start'
                                                                        // }
                                                                        setselectedcameras([])
                                                                    }
                                                                }}>
                                                                    <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                                                </div>
                                                            </div>

                                                        </th>
                                                        <th style={{ padding: '15px' }}>Cameras</th>
                                                        <th style={{ padding: '15px' }}>Cameras name</th>
                                                        <th style={{ padding: '15px' }}>Owner name</th>
                                                        <th style={{ padding: '15px' }}>Permission level</th>
                                                        <th style={{ padding: '15px' }}>Status</th>
                                                        <th style={{ padding: '15px' }}>Ip address</th>
                                                        {/* <th style={{ padding: '15px' }}>Cloud Adapter ID</th> */}
                                                        <th style={{ padding: '15px' }}>Cloud recording</th>
                                                        <th style={{ padding: '15px' }}>Recording mode</th>
                                                        <th style={{ padding: '15px' }}>Analytics</th>
                                                        <th style={{ padding: '15px' }}>Device id</th>
                                                        <th style={{ padding: '15px' }}>Tags</th>
                                                        <th style={{ padding: '15px' }}>Groups</th>
                                                    </tr>
                                                    {console.log('Alerts Cameras view', cameras_view)}
                                                    {
                                                        cameras_view.map((val, i) => {

                                                            let chk = ""
                                                            for (let i = 0; i < selectedcameras.length; i++) {
                                                                if (selectedcameras[i]._id === val._id) {
                                                                    chk = true
                                                                    break
                                                                } else {
                                                                    chk = false
                                                                }
                                                            }

                                                            return (
                                                                <tr style={{ borderBottom: '1px solid grey', color: 'black' }}>
                                                                    <th style={{ padding: '15px' }}>
                                                                        {/* <input className='check' checked={chk} type='checkbox' onClick={(e) => {
                                                                        if (e.target.checked === true) {
                                                                            setselectedcameras((old) => {
                                                                                dispatch({ type: SELECTED_CAMERAS, value: [...old, val] })
                                                                                dispatch({ type: APPLY, value: !apply })
                                                                                return [...old, val]
                                                                            })
                                                                        } else {
                                                                            let arr = []
                                                                            selectedcameras.map((data) => {
                                                                                if (val._id !== data._id) {
                                                                                    arr.push(data)
                                                                                }
                                                                            })
                                                                            setselectedcameras(arr)
                                                                            dispatch({ type: SELECTED_CAMERAS, value: arr })
                                                                            dispatch({ type: APPLY, value: !apply })
                                                                        }
                                                    
                                                                    }}></input> */}

                                                                        <div>

                                                                            <div id={`chk${i}`} className='check' title={`${chk}`} style={{ backgroundColor: chk == true ? '#42cf10' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: chk == true ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }} onClick={() => {
                                                                                // settoggle(!toggle)

                                                                                let ele = document.getElementById(`chk${i}`)

                                                                                let toggle = ele.getAttribute("title") === 'true' ? false : true
                                                                                let arr = []

                                                                                if (toggle === true) {
                                                                                    arr = [...selectedcameras, val]
                                                                                    setselectedcameras((old) => {
                                                                                        return [...old, val]
                                                                                    })
                                                                                } else {

                                                                                    selectedcameras.map((data) => {
                                                                                        if (val._id !== data._id) {
                                                                                            arr.push(data)
                                                                                        }
                                                                                    })
                                                                                    setselectedcameras(arr)
                                                                                }

                                                                                if (arr.length === cameras.length) {
                                                                                    settoggle(true)
                                                                                } else {
                                                                                    settoggle(false)
                                                                                }
                                                                            }}>
                                                                                <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                                                            </div>
                                                                        </div>
                                                                    </th>


                                                                    <td style={{ padding: '15px' }}>



                                                                        {
                                                                            loading ?
                                                                                <Skeleton width={150} height={100} />
                                                                                :
                                                                                <>

                                                                                    <img
                                                                                        width={150}
                                                                                        height={100}
                                                                                        id={`dash_image${i}`}
                                                                                        src={imguri[i]} // Placeholder image
                                                                                        onError={(event) => {
                                                                                            event.target.src = tento
                                                                                        }}



                                                                                    />
                                                                                </>
                                                                        }








                                                                    </td>
                                                                    <td style={{ padding: '15px' }}>{val.camera_gereral_name}</td>
                                                                    <td style={{ padding: '15px' }}>{val.camera_username}</td>
                                                                    <td style={{ padding: '15px', color: val.permission_level == 'All' ? '#1ee01e' : 'red' }}>
                                                                        {val.permission_level}
                                                                    </td>
                                                                    <td style={{ padding: '15px', color: val.camera_health == 'Online' ? '#1ee01e' : 'red' }}>
                                                                        {val.camera_health}
                                                                    </td>
                                                                    <td style={{ padding: '15px' }}>{val.ip_address}</td>
                                                                    {/* <td style={{ padding: '15px' }}>CAgxrx</td> */}
                                                                    <td style={{ padding: '15px', color: val.cloud_recording == 0 ? 'Red' : '#1ee01e' }}>
                                                                        {val.cloud_recording == 0 ? 'Off' : 'On'}
                                                                    </td>
                                                                    <td style={{ padding: '15px' }}>{val.recording_mode == 0 ? 'Motion triggered' : '24/7 Continuous'}</td>
                                                                    <td style={{ padding: '15px', color: val.analytics_alert == 0 ? 'Red' : '#1ee01e' }}>
                                                                        {val.analytics_alert == 0 ? 'Off' : 'On'}
                                                                    </td>
                                                                    <td style={{ padding: '15px' }}>{val.device_id}</td>
                                                                    <td style={{ padding: '15px', color: val.camera_tags.length == 0 ? '#E7E7E7' : 'black' }}>
                                                                        {val.camera_tags.length !== 0 ? val.camera_tags.map((val) => (val.name)) : 'No Tags'}
                                                                    </td>
                                                                    <td style={{ padding: '15px', color: val.camera_groups.length == 0 ? '#E7E7E7' : 'black' }}>
                                                                        {val.camera_groups.length !== 0 ? val.camera_groups.map((val) => (val.name)) : 'No Groups'}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </table>

                                            </Col>

                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Modal >
            </div >





            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    style={{ marginLeft: 'auto', marginRight: 'auto', height: 550, width: '100%', top: 20, }}
                >
                    <Row>
                        <Col xl={6} lg={6} md={6} sm={12} xs={12} style={style}>
                            <div className='lower_alerts' style={{ backgroundColor: 'white', borderRadius: '5px', height: 550, maxHeight: 550, overflowY: 'scroll', overflowX: 'hidden' }}>
                                <div style={{ backgroundColor: '#181828', padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                    <p style={{ color: 'white', fontSize: '20px', margin: 0 }}>{`${smallVideo.time} ${date}`}</p>
                                    <CloseIcon style={{ color: 'white', cursor: 'pointer', cursor: 'pointer' }} onClick={() => handleClose()} />
                                </div>


                                <div style={{ backgroundColor: "black", alignItems: 'center' }}>
                                    <img crossorigin="anonymous" style={{ display: iv === false ? 'none' : 'block' }} width="100%" height="100%" src={image_uri}></img>
                                    <div style={{ display: iv === false ? 'block' : 'none', }}>
                                        {/* smallVideo.video_url */}
                                        <video id={'vid1'} width="100%" height="100%" style={{ display: 'block' }} controls={true} autoPlay={true} src={video_uri} ></video>
                                        {/* <CircularProgress variant="determinate" value={progress} /> */}
                                    </div>
                                </div>

                                <div >





                                    <div>
                                        <Row style={{ padding: '10px', alignItems: 'center' }}>

                                            <Col xl={8} lg={8} md={1} sm={12} xs={12}>
                                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    <VideocamIcon style={{ color: 'gray', fontSize: '40px' }} />
                                                    <p style={{ color: 'black', margin: 0, marginLeft: '5px', fontSize: '18px', marginRight: '20px' }}>{smallVideo.camera_name}</p>
                                                    {
                                                        type == 'motion_events' ?
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <DirectionsRunIcon style={{ color: 'gray', fontSize: '40px' }} />
                                                                <p style={{ color: 'black', margin: 0, marginLeft: '5px', fontSize: '18px' }}>{smallVideo != '' && smallVideo.objects != '' ? Math.round(smallVideo.objects.person * 100) : ''}</p>
                                                            </div>
                                                            : ''
                                                    }

                                                </div>
                                            </Col>

                                            <Col xl={1} lg={1} md={1} sm={3} xs={3}>
                                                <div style={{ position: 'relative', width: '100%' }}>
                                                    <div id='view' style={{ backgroundColor: 'black', position: 'absolute', top: -50, width: 200, padding: '10px', borderRadius: '15px', display: 'none' }}>
                                                        <div style={{ position: 'relative' }}>
                                                            <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>View high resulation still</p>
                                                            <ArrowDropDownOutlinedIcon style={{ color: 'black', position: 'absolute', fontSize: '40px', top: 13 }} />
                                                        </div>
                                                    </div>

                                                    <div style={{ display: iv === false ? 'none' : 'block', position: 'relative' }} onClick={() => {
                                                        setiv(!iv)
                                                    }}>
                                                        <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>Play event video</p>
                                                        <PlayCircleFilledOutlinedIcon style={{ color: 'black', position: 'absolute', fontSize: '40px', top: 13, cursor: 'pointer' }} />
                                                    </div>

                                                    <div style={{ display: iv === false ? 'block' : 'none', cursor: 'pointer' }}>
                                                        <img crossorigin="anonymous" src={model_image_uri} width={50} height={30} onMouseOver={() => {
                                                            let div = document.getElementById('view')
                                                            div.style.display = 'block'
                                                        }} onMouseOut={() => {
                                                            let div = document.getElementById('view')
                                                            div.style.display = 'none'
                                                        }} onClick={() => {
                                                            setiv(!iv)
                                                        }}></img>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col xl={1} lg={1} md={1} sm={3} xs={3}>
                                                <div style={{ position: 'relative' }}>
                                                    <div id='down' style={{ backgroundColor: 'black', position: 'absolute', top: -50, width: 80, padding: '10px', borderRadius: '15px', display: 'none' }}>
                                                        <div style={{ position: 'relative' }}>
                                                            <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>Download</p>
                                                            <ArrowDropDownOutlinedIcon style={{ color: 'black', position: 'absolute', fontSize: '40px', top: 13 }} />
                                                        </div>
                                                    </div>
                                                    <ArrowCircleDownIcon style={{ color: 'black', fontSize: '35px', cursor: 'pointer' }} onMouseOver={() => {
                                                        let div = document.getElementById('down')
                                                        div.style.display = 'block'
                                                    }} onMouseOut={() => {
                                                        let div = document.getElementById('down')
                                                        div.style.display = 'none'
                                                    }} onClick={() => {
                                                        if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                                                            let access = userData.operation_type.filter((val) => { return val == 'Read' || val == 'All' })
                                                            if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Read' || access[1] == 'Read') {
                                                                generate_urifor_download(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, smallVideo)
                                                            } else {
                                                                setalert_box(true)
                                                                setalert_text('Your access level does not allow you to download videos.')

                                                            }
                                                        } else {
                                                            let cam_name = ''

                                                            userData.site_id.map((value) => {
                                                                let access = value.type.filter((val) => { return val == 'Read' || val == 'All' })
                                                                if (value.id == smallVideo.site_id) {
                                                                    if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Read' || access[1] == 'Read') {
                                                                        generate_urifor_download(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, smallVideo)
                                                                    } else {
                                                                        cam_name = `${cam_name} ${smallVideo.camera_name}`
                                                                    }
                                                                }
                                                            })

                                                            if (cam_name !== '') {
                                                                setalert_box(true)
                                                                setalert_text(`Your access level does not allow you to download these (${cam_name}) videos.`)

                                                            }
                                                        }
                                                    }} />
                                                </div>
                                            </Col>

                                            <Col xl={1} lg={1} md={1} sm={3} xs={3}>
                                                <div style={{ position: 'relative' }}>
                                                    <div id='del' style={{ backgroundColor: 'black', position: 'absolute', top: -50, width: 70, padding: '10px', borderRadius: '15px', display: 'none' }}>
                                                        <div style={{ position: 'relative' }}>
                                                            <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>Delete</p>
                                                            <ArrowDropDownOutlinedIcon style={{ color: 'black', position: 'absolute', fontSize: '40px', top: 13, }} />
                                                        </div>
                                                    </div>
                                                    <DeleteOutlineOutlinedIcon style={{ color: 'black', fontSize: '35px', cursor: 'pointer' }} onMouseOver={() => {
                                                        let div = document.getElementById('del')
                                                        div.style.display = 'block'
                                                    }} onMouseOut={() => {
                                                        let div = document.getElementById('del')
                                                        div.style.display = 'none'
                                                    }} onClick={() => {
                                                        if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                                                            let access = userData.operation_type.filter((val) => { return val == 'Read' || val == 'All' })
                                                            if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Read' || access[1] == 'Read') {
                                                                setdelete_download_heading('Deleting Videos')
                                                                setdelete_download_text(`1/1 Please wait...`)
                                                                setdelete_download_box(true)
                                                                deleteS3Object(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, smallVideo,)
                                                            } else {
                                                                setalert_box(true)
                                                                setalert_text('Your access level does not allow you to download videos.')

                                                            }
                                                        } else {
                                                            let cam_name = ''

                                                            userData.site_id.map((value) => {
                                                                let access = value.type.filter((val) => { return val == 'Read' || val == 'All' })
                                                                if (value.id == smallVideo.site_id) {
                                                                    if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Read' || access[1] == 'Read') {
                                                                        setdelete_download_heading('Deleting Videos')
                                                                        setdelete_download_text(`1/1 Please wait...`)
                                                                        setdelete_download_box(true)
                                                                        deleteS3Object(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, smallVideo,)
                                                                    } else {
                                                                        cam_name = `${cam_name} ${smallVideo.camera_name}`
                                                                    }
                                                                }
                                                            })

                                                            if (cam_name !== '') {
                                                                setalert_box(true)
                                                                setalert_text(`Your access level does not allow you to download these (${cam_name}) videos.`)

                                                            }
                                                        }
                                                    }} />
                                                </div>
                                            </Col>


                                            <Col xl={1} lg={1} md={1} sm={3} xs={3}>
                                                <div style={{ position: 'relative' }}>
                                                    <div id='rep' style={{ backgroundColor: 'black', position: 'absolute', top: -50, width: 370, padding: '10px', borderRadius: '15px', display: 'none' }}>
                                                        <div style={{ position: 'relative' }}>
                                                            <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>View this time frame across multiple cameras</p>
                                                            <ArrowDropDownOutlinedIcon style={{ color: 'black', position: 'absolute', fontSize: '40px', top: 13 }} />
                                                        </div>
                                                    </div>
                                                    <ReplayOutlinedIcon style={{ color: 'black', fontSize: '35px', cursor: 'pointer' }} onMouseOver={() => {
                                                        let div = document.getElementById('rep')
                                                        div.style.display = 'block'
                                                        // div.style.border = '1px solid red'
                                                    }} onMouseOut={() => {
                                                        let div = document.getElementById('rep')
                                                        div.style.display = 'none'
                                                    }} />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>

                                {
                                    type == 'motion_events' ?
                                        <div style={{ marginLeft: '30px', marginTop: '40px' }}>

                                            <Row>
                                                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <p style={{ color: 'black', fontSize: '20px' }}>Analytics</p>
                                                </Col>

                                                {
                                                    smallVideo != '' ?
                                                        smallVideo.objects.length != 0 ?
                                                            // smallVideo.objects.map((val) => (
                                                            //     Object.keys(val).map((data, i) => (
                                                            //         <Col xl={2} lg={2} md={2} sm={6} xs={6}>
                                                            //             <div style={{ marginRight: '40px' }}>
                                                            //                 <p style={{ color: 'black', fontWeight: 'bolder', fontSize: '20px', marginBottom: '3px' }}>{data}</p>
                                                            //                 <p style={{ color: 'gray', fontSize: '18px', }}>{val.data}</p>
                                                            //             </div>
                                                            //         </Col>
                                                            //     ))
                                                            // ))

                                                            Object.keys(smallVideo.objects).map((data, i) => (
                                                                <div style={{ marginRight: '40px' }}>
                                                                    <p style={{ color: 'black', fontWeight: 'bolder', fontSize: '20px', marginBottom: '3px' }}>{data}</p>
                                                                    <p style={{ color: 'gray', fontSize: '18px', }}>{Math.round(smallVideo.objects[`${data}`] * 100)}%</p>
                                                                </div>
                                                            ))

                                                            :
                                                            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                <div style={{ marginBottom: '20px' }}>
                                                                    <p style={{ color: 'gray', fontWeight: 'bolder', fontSize: '20px', marginBottom: '3px' }}>No analytics found!</p>
                                                                </div>
                                                            </Col>

                                                        :
                                                        <div style={{ marginLeft: '30px', marginTop: '40px' }}>
                                                            <Row>
                                                                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                    <p style={{ color: 'black', fontSize: '20px' }}>{smallVideo.title}</p>
                                                                    <p style={{ color: 'gray', fontSize: '18px', }}>{smallVideo.msg}</p>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                }

                                            </Row>
                                        </div>
                                        :
                                        <div style={{ marginLeft: '30px', marginTop: '40px' }}>

                                            <Row>
                                                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <p style={{ color: 'black', fontSize: '20px' }}>Alert Verification</p>
                                                </Col>

                                                <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ marginBottom: '10px' }}>
                                                    <div>

                                                        <div style={{ backgroundColor: smallVideo.Active == 0 ? '#42cf10' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: smallVideo.Active == 0 ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }} onClick={() => {

                                                            const getStocksData = {
                                                                method: 'put',
                                                                maxBodyLength: Infinity,
                                                                url: api.ALERT_CREATION + smallVideo._id,
                                                                headers: {
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                data: { 'Active': smallVideo.Active === 0 ? 1 : 0 }
                                                            }
                                                            axios(getStocksData)
                                                                .then(response => {
                                                                    console.log(response.data);
                                                                    dispatch({ type: APPLY, value: !apply })
                                                                    setsmallVideo(response.data)
                                                                })
                                                                .catch(function (e) {
                                                                    if (e.message === 'Network Error') {
                                                                        alert("No Internet Found. Please check your internet connection")
                                                                    }
                                                                    else {
                                                                        alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                                                                    }

                                                                });
                                                        }}>
                                                            <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                }

                            </div>
                        </Col>
                    </Row>
                </Modal>
            </div>

            <div style={{ overflowY: 'scroll', height: '98vh', width: '100%', paddingRight: 0, paddingLeft: '15px', overflowX: 'hidden' }} id='scroll_div' onScroll={(event) => {
                const { scrollHeight, scrollTop, clientHeight } = event.target;
                const isBottomReached = ((scrollHeight - Math.round(scrollTop)) - 300 < clientHeight);

                if (isBottomReached && scroll) {
                    // You have reached the bottom of the container
                    // colflag = true
                    // setcolcount(colcount + 30)
                    setscroll(false)
                    if (selectedanalytics.length != 0) {
                        if (selected_cameras.length !== 0) {
                            if (response_start_length.start_count + 60 <= response_start_length.total) {
                                response_start_length.start_count = response_start_length.start_count + 30
                                response_start_length.end_count = response_start_length.start_count + 30
                                next_data()
                            } else if (response_start_length.start_count + 30 <= response_start_length.total) {
                                response_start_length.start_count = response_start_length.start_count + 30
                                response_start_length.end_count = response_start_length.start_count + 30
                                next_data()
                            } else {
                                setres2('no more data')
                            }
                        }

                        function next_data() {
                            setres2('progress')

                            if (selected_cameras.length !== 0) {
                                let ids = []
                                selected_cameras.map((val) => {
                                    ids.push(val._id)
                                })
                                let data = JSON.stringify({
                                    "camera_id": ids,
                                    "camera_name": '',
                                    // startdate
                                    "start_date": startdate,
                                    // enddate
                                    "end_date": enddate,
                                    "start_count": response_start_length.start_count + 1,
                                    "end_count": response_start_length.end_count,
                                    "selectedanalytics": selectedanalytics
                                });

                                console.log(response_start_length.start_count + 1);

                                let config = {
                                    method: 'post',
                                    maxBodyLength: Infinity,
                                    url: api.ANALYTICS_GET,
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    data: data
                                }

                                axios.request(config)
                                    .then((response) => {
                                        console.log(response.data.data);
                                        data = [...first_data, ...response.data.data]
                                        setfirst_data([...first_data, ...response.data.data])
                                        colflag = true
                                        setcolcount(colcount + 30)
                                        if (response.data.data.length === 0) {
                                            newres = true
                                            setres2('no more data')
                                        } else {
                                            newres = true
                                            setres2('')
                                        }
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    })
                            } else {
                                setres2('no more data')
                            }
                        }
                    } else {
                        console.log('jkhhjghjghg');
                        call_next_data()
                    }
                }
            }}>
                <Row id='main' >
                    <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: page === 1 ? 'block' : 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ color: 'black', fontWeight: 'bolder', fontSize: '20px' }}>Filters</p>
                            <CloseIcon style={{ color: 'black', cursor: 'pointer' }} onClick={() => {
                                dispatch({ type: PAGE, value: 0 })
                            }} />
                        </div>
                    </Col>



                    <Col xl={12} lg={12} md={12} sm={12} xs={12} id='events' style={{ display: page === 1 || window.screen.width > 990 ? 'block' : 'none', backgroundColor: '#e6e8eb', position: 'sticky', top: 0, zIndex: 2 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: select === false ? 'block' : 'none' }}>
                                <div id='eventsDiv' style={{ display: 'flex', marginLeft: page === 1 ? '0px' : '10px', marginTop: '20px', marginBottom: '20px' }}>

                                    <div className='eventsDiv1' style={{ display: aditional_info === true ? 'block' : 'none' }}>
                                        <div style={{ position: 'relative' }}>

                                            {data != "" || res === 'empty response' || newres === true ? (

                                                <button className='eventbtn' id='cameras' onClick={() => {
                                                    setclickbtn3(true)
                                                    handleOpen1()



                                                }} style={{ display: 'flex' }}> <CameraAltOutlinedIcon style={{ marginRight: '7px' }} />Cameras <div style={{ backgroundColor: '#e32747', padding: '3px', borderRadius: '50%', height: '25px', width: '25px', marginLeft: '10px' }}><p style={{ color: 'white' }}>{selectedcameras.length}</p></div> <ArrowDropDownIcon style={{ marginLeft: '0px' }} /></button>

                                            ) : (<Skeleton style={{ display: 'flex', borderRadius: '20px', border: '1px solid gray', marginRight: '20px' }} width={200} height={45} />)
                                            }

                                        </div>
                                    </div>



                                    <div className='eventsDiv1' style={{ position: 'relative' }}>
                                        {data != "" || res === 'empty response' || newres === true ? (
                                            <button className='eventbtn' id='analytics' onMouseEnter={() => {
                                                analytics_mouse = true
                                            }} onMouseLeave={() => {
                                                if (btn1 === 'analytics') {
                                                    analytics_mouse = false
                                                }

                                            }} onClick={() => {
                                                setclickbtn2(true);
                                                setselectedanalytics(selectedanalytics_original)
                                                analytics_mouse = true
                                                console.log('kjhhhhggfffdd');
                                            }} style={{ display: 'flex' }}>
                                                <AssessmentOutlinedIcon style={{ marginRight: '7px' }} />
                                                {type == 'motion_events' ? 'Analytics' : 'Filter'}
                                                <div style={{ backgroundColor: '#e32747', padding: '3px', borderRadius: '50%', height: '25px', width: '25px', marginLeft: '10px' }}>
                                                    <p style={{ color: 'white' }}>{selectedanalytics.length}</p>
                                                </div>
                                                <ArrowDropDownIcon style={{ marginLeft: '10px' }} />
                                            </button>
                                        ) : (
                                            <Skeleton style={{ borderRadius: '20px', border: '1px solid gray', marginLeft: "20px" }} width={170} height={45} />
                                        )
                                        }



                                        <div onMouseEnter={() => {
                                            analytics_mouse = true
                                        }} onMouseLeave={() => {
                                            analytics_mouse = false
                                        }}>
                                            <div style={{ borderRadius: '5px', backgroundColor: '#181828', padding: '10px', position: 'absolute', top: '60px', zIndex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', display: btn1 === 'analytics' ? 'block' : 'none' }}>
                                                <div style={{ position: 'relative' }}>

                                                    <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: '-37px' }} />
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                        <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                                            <CloseIcon style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }} onClick={() => {
                                                                setclickbtn2(true)
                                                                setselectedanalytics(selectedanalytics_original)
                                                            }} />
                                                        </div>
                                                        {
                                                            analytics1.analytics_obj.length != 0 ?
                                                                <p style={{ margin: 0, color: 'white', cursor: 'pointer' }} onClick={() => {
                                                                    let check = document.getElementsByClassName('analyticCheckbox')
                                                                    for (let i = 0; i < check.length; i++) {
                                                                        check[i].checked = false
                                                                    }
                                                                    setselectedanalytics([])
                                                                    setfinaldata([])
                                                                    setimage_arr([])
                                                                    setfinaldate('')
                                                                    colflag = true
                                                                    setcolcount(30)
                                                                    setclickbtn2(true)
                                                                }}>Clear all</p>
                                                                : ''
                                                        }
                                                    </div>

                                                    {
                                                        analytics1.analytics_obj.map((val) => {
                                                            let chk = false
                                                            for (let i = 0; i < selectedanalytics.length; i++) {
                                                                if (selectedanalytics[i] === val) {
                                                                    chk = true
                                                                    break
                                                                } else {
                                                                    chk = false
                                                                }
                                                            }
                                                            console.log(chk);
                                                            return (
                                                                <div>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                                                        <p style={{ margin: 0, color: 'white', width: '200px' }}>{val.charAt(0).toUpperCase() + val.slice(1)}<span style={{ color: 'white', borderRadius: '50%', backgroundColor: '#a8a4a4', marginLeft: '10px', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px' }}>{analytics1.analytics_num[val]}</span></p>

                                                                        <input className='analyticCheckbox' id={`${val}_chk`} type="checkbox" checked={chk} onClick={(e) => {
                                                                            if (e.target.checked === true) {
                                                                                // let arr = []
                                                                                // data.map((val) => {
                                                                                //     if (val.objects.length !== 0 && val.objects.person !== undefined) {
                                                                                //         arr.push(val)
                                                                                //     }
                                                                                // })
                                                                                // setdata2(arr)
                                                                                // console.log(arr);
                                                                                // setselectedanalytics([...selectedanalytics, val])
                                                                                console.log('if statement')
                                                                                setselectedanalytics([...selectedanalytics, val])
                                                                                // console.log([...selectedanalytics, val]);
                                                                            } else {
                                                                                let arr = []
                                                                                for (let i = 0; i < selectedanalytics.length; i++) {
                                                                                    if (selectedanalytics[i] !== val) {
                                                                                        arr.push(selectedanalytics[i])
                                                                                    }
                                                                                }

                                                                                // if (arr.length == 0) {
                                                                                //     arr = analytics1.analytics_obj
                                                                                // }
                                                                                // console.log(analytics1.analytics_obj)
                                                                                // console.log('else statement')
                                                                                setselectedanalytics(arr)
                                                                                // setfinaldata([])
                                                                                // setimage_arr([])
                                                                                // setfinaldate('')
                                                                                // colflag = true
                                                                                // setcolcount(30)
                                                                                // setclickbtn2(true)
                                                                            }
                                                                        }}></input>
                                                                    </div>


                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                                <p style={{ margin: 0, color: 'white', width: '200px' }}>Person</p>
                                                <input className='analyticCheckbox' type="checkbox" onClick={(e) => {
                                                    if (e.target.checked === true) {
                                                        // let arr = []
                                                        // data.map((val) => {
                                                        //     if (val.objects.length !== 0 && val.objects.person !== undefined) {
                                                        //         arr.push(val)
                                                        //     }
                                                        // })
                                                        // setdata2(arr)
                                                        // console.log(arr);
                                                        setselectedanalytics([...selectedanalytics, 'person'])
                                                        setfinaldata([])
                                                        setfinaldate('')
                                                        colflag=true
                                                        setcolcount(30)
                                                        setclickbtn2(true)
                                                        console.log([...selectedanalytics, 'person']);
                                                    } else {
                                                        let arr = []
                                                        for (let i = 0; i < selectedanalytics.length; i++) {
                                                            if (selectedanalytics[i] !== 'person') {
                                                                arr.push(selectedanalytics[i])
                                                            }
                                                        }
                                                        setselectedanalytics(arr)
                                                        setfinaldata([])
                                                        setfinaldate('')
                                                        colflag=true
                                                        setcolcount(30)
                                                        setclickbtn2(true)
                                                    }
                                                }}></input>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                                <p style={{ margin: 0, color: 'white', width: '200px' }}>Car</p>
                                                <input className='analyticCheckbox' type="checkbox" onClick={(e) => {
                                                    if (e.target.checked === true) {
                                                        // let arr = []
                                                        // data.map((val) => {
                                                        //     if (val.objects.length !== 0 && val.objects.person !== undefined) {
                                                        //         arr.push(val)
                                                        //     }
                                                        // })
                                                        // setdata2(arr)
                                                        // console.log(arr);
                                                        setselectedanalytics([...selectedanalytics, 'car'])
                                                        setfinaldata([])
                                                        setfinaldate('')
                                                        colflag=true
                                                        setcolcount(30)
                                                        setclickbtn2(true)
                                                        console.log([...selectedanalytics, 'car']);
                                                    } else {
                                                        let arr = []
                                                        for (let i = 0; i < selectedanalytics.length; i++) {
                                                            if (selectedanalytics[i] !== 'car') {
                                                                arr.push(selectedanalytics[i])
                                                            }
                                                        }
                                                        setselectedanalytics(arr)
                                                        setfinaldata([])
                                                        setfinaldate('')
                                                        colflag=true
                                                        setcolcount(30)
                                                        setclickbtn2(true)
                                                    }
                                                }}></input>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                                <p style={{ margin: 0, color: 'white', width: '200px' }}>Cat</p>
                                                <input className='analyticCheckbox' type="checkbox" onClick={(e) => {
                                                    if (e.target.checked === true) {
                                                        // let arr = []
                                                        // data.map((val) => {
                                                        //     if (val.objects.length !== 0 && val.objects.person !== undefined) {
                                                        //         arr.push(val)
                                                        //     }
                                                        // })
                                                        // setdata2(arr)
                                                        // console.log(arr);
                                                        setselectedanalytics([...selectedanalytics, 'cat'])
                                                        setfinaldata([])
                                                        setfinaldate('')
                                                        colflag=true
                                                        setcolcount(30)
                                                        setclickbtn2(true)
                                                        console.log([...selectedanalytics, 'cat']);
                                                    } else {
                                                        let arr = []
                                                        for (let i = 0; i < selectedanalytics.length; i++) {
                                                            if (selectedanalytics[i] !== 'cat') {
                                                                arr.push(selectedanalytics[i])
                                                            }
                                                        }
                                                        setselectedanalytics(arr)
                                                        setfinaldata([])
                                                        setfinaldate('')
                                                        colflag=true
                                                        setcolcount(30)
                                                        setclickbtn2(true)
                                                    }
                                                }}></input>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                                <p style={{ margin: 0, color: 'white', width: '200px' }}>dog</p>
                                                <input className='analyticCheckbox' type="checkbox" onClick={(e) => {
                                                    if (e.target.checked === true) {
                                                        // let arr = []
                                                        // data.map((val) => {
                                                        //     if (val.objects.length !== 0 && val.objects.person !== undefined) {
                                                        //         arr.push(val)
                                                        //     }
                                                        // })
                                                        // setdata2(arr)
                                                        // console.log(arr);
                                                        setselectedanalytics([...selectedanalytics, 'dog'])
                                                        setfinaldata([])
                                                        setfinaldate('')
                                                        colflag=true
                                                        setcolcount(30)
                                                        setclickbtn2(true)
                                                        console.log([...selectedanalytics, 'dog']);
                                                    } else {
                                                        let arr = []
                                                        for (let i = 0; i < selectedanalytics.length; i++) {
                                                            if (selectedanalytics[i] !== 'dog') {
                                                                arr.push(selectedanalytics[i])
                                                            }
                                                        }
                                                        setselectedanalytics(arr)
                                                        setfinaldata([])
                                                        setfinaldate('')
                                                        colflag=true
                                                        setcolcount(30)
                                                        setclickbtn2(true)
                                                    }
                                                }}></input>
                                            </div> */}

                                                    {
                                                        analytics1.analytics_obj.length != 0 ?
                                                            <button style={{ backgroundColor: '#e22747', color: 'white', padding: '5px', borderRadius: '5px', border: '1px solid gray', width: '100%' }} onClick={() => {
                                                                setclickbtn2(true)
                                                                setselectedanalytics_original(selectedanalytics)

                                                                if (selectedanalytics.length == 0) {
                                                                    get_ana(analytics1.analytics_obj)
                                                                } else {
                                                                    get_ana(selectedanalytics)
                                                                }
                                                            }}>Apply</button>
                                                            :
                                                            <p style={{ margin: 0, color: '#e32747', fontWeight: 'bolder' }}>No Analytics Found</p>

                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {

                                        type === 'alert' ? (
                                            <div className='eventsDiv1'>
                                                <div style={{ position: 'relative' }}>
                                                    {data != "" || res === 'empty response' || newres === true ? (
                                                        <button className='eventbtn' id='filter_btn' onClick={() => {
                                                            setfilter_btn(!filter_btn);
                                                        }} style={{ display: 'flex', backgroundColor: filter_btn ? '#e32747' : 'transparent', color: filter_btn ? 'white' : 'black' }}> <TuneIcon style={{ marginRight: '10px' }} />Type</button>
                                                    ) : <Skeleton style={{ marginRight: '10px', borderRadius: "20px", border: '1px solid gray', marginLeft: "20px" }} width={130} height={45} />}
                                                </div>
                                            </div>
                                        ) : null

                                    }


                                </div>

                                <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: filter_btn ? 'block' : 'none', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex' }}>
                                        <div className='eventsDiv1' style={{ display: aditional_info === true ? 'block' : 'none' }}>
                                            <div style={{ position: 'relative' }}>

                                                <button className='eventbtn' id='true_alarm' onClick={(e) => {
                                                    listflag = false

                                                    let btn = document.getElementById('true_alarm')
                                                    btn.disabled = false
                                                    btn.style.backgroundColor = '#e32747'
                                                    btn.style.color = 'white'

                                                    let true_inner_btn = document.getElementById('true_inner_btn')
                                                    true_inner_btn.style.color = '#e32747'
                                                    true_inner_btn.style.backgroundColor = 'white'

                                                    let false_btn = document.getElementById('false_alarm')
                                                    false_btn.disabled = false
                                                    false_btn.style.backgroundColor = 'transparent'
                                                    false_btn.style.color = 'black'

                                                    let false_inner_btn = document.getElementById('false_inner_btn')
                                                    false_inner_btn.style.color = 'white'
                                                    false_inner_btn.style.backgroundColor = '#e32747'

                                                    sett_f_alert(0)
                                                    alarm_status(0)

                                                }} style={{ display: 'flex', backgroundColor: '#e32747', color: 'white', alignItems: 'center' }}> <AlarmIcon style={{ marginRight: '10px' }} />True Alarm <div id='true_inner_btn' style={{ backgroundColor: 'white', padding: '3px', borderRadius: all_alert_count.active_alert < 100 ? '50%' : '15px', height: '25px', minWidth: '25px', marginLeft: '10px', color: '#e32747' }}><p>{all_alert_count.active_alert}</p></div></button>
                                            </div>
                                        </div>

                                        <div className='eventsDiv1' style={{ display: aditional_info === true ? 'block' : 'none' }}>
                                            <div style={{ position: 'relative' }}>
                                                <button className='eventbtn' id='false_alarm' onClick={() => {
                                                    listflag = false

                                                    let btn = document.getElementById('false_alarm')
                                                    btn.disabled = false
                                                    btn.style.backgroundColor = '#e32747'
                                                    btn.style.color = 'white'

                                                    let true_inner_btn = document.getElementById('false_inner_btn')
                                                    true_inner_btn.style.color = '#e32747'
                                                    true_inner_btn.style.backgroundColor = 'white'

                                                    let false_btn = document.getElementById('true_alarm')
                                                    false_btn.disabled = false
                                                    false_btn.style.backgroundColor = 'transparent'
                                                    false_btn.style.color = 'black'

                                                    let false_inner_btn = document.getElementById('true_inner_btn')
                                                    false_inner_btn.style.color = 'white'
                                                    false_inner_btn.style.backgroundColor = '#e32747'

                                                    sett_f_alert(1)
                                                    alarm_status(1)

                                                }} style={{ display: 'flex' }}> <AlarmOffIcon style={{ marginRight: '10px' }} />False Alarm <div id='false_inner_btn' style={{ backgroundColor: '#e32747', padding: '3px', borderRadius: all_alert_count.inactive_alert < 100 ? '50%' : '15px', height: '25px', minWidth: '25px', marginLeft: '10px', color: 'white' }}><p>{all_alert_count.inactive_alert}</p></div></button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: page === 1 ? 'block' : 'none' }}>
                                    <hr style={{ borderTop: '1px solid gray' }}></hr>

                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <button style={{ backgroundColor: '#181828', color: 'white', padding: '10px', borderRadius: '15px', border: 'none' }} onClick={() => {
                                            dispatch({ type: PAGE, value: 0 })
                                            dispatch({ type: APPLY, value: !apply })
                                        }}>Apply</button>
                                    </div>
                                </Col>
                            </div>

                            <div className='eventsDiv3' style={{ display: 'flex', justifyContent: 'space-between', width: select ? '100%' : '' }}>
                                <div style={{ display: select === false ? 'none' : 'block', marginTop: '20px', marginBottom: '20px', paddingLeft: '10px', color: 'black' }}>
                                    {bulk_download_delete()}
                                </div>

                                <div style={{ marginTop: '20px', paddingRight: '10px', marginBottom: '20px' }}>

                                    {data != "" || res === 'empty response' || newres === true ? (
                                        <button id='analytics' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray' }} onClick={() => {
                                            document.getElementById('scroll_div').scrollTop = 0
                                            // console.log(document.getElementById('scroll_div'));
                                            dispatch({ type: SELECT, value: !select })
                                            setfinaldata([])
                                            setimage_arr([])
                                            setfinaldate('')
                                            colflag = true
                                            setcolcount(30)
                                        }}>{select === false ? <span><PlaylistAddCheckOutlinedIcon style={{ marginRight: '10px' }} />Select</span> : <span style={{ display: 'flex' }}>Done<div style={{ backgroundColor: '#e32747', padding: '3px', borderRadius: '50%', height: '25px', width: '25px', marginLeft: '3px' }}><p style={{ color: 'white' }}>{selected_video.length}</p></div></span>}</button>
                                    ) : (
                                        <Skeleton width={100} height={45} style={{ padding: '10px', borderRadius: '20px', border: '1px solid gray' }} />
                                    )
                                    }


                                </div>
                            </div>
                        </div>
                    </Col >



                    <Col xl={12} lg={12} md={12} sm={12} xs={12} id='filter' style={{ display: page === 1 || window.screen.width > 990 ? 'none' : 'block', backgroundColor: '#e6e8eb', marginTop: '20px', marginBottom: '20px', position: 'sticky', top: 0, zIndex: 2 }}>
                        <div style={{ padding: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ display: select === false ? 'block' : 'none' }}>
                                    <button style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginRight: '20px' }} onClick={() => {
                                        dispatch({ type: PAGE, value: 1 })
                                    }}> <TuneOutlinedIcon style={{ marginRight: '10px' }} />Filter</button>
                                </div>

                                <div style={{ display: select === false ? 'none' : 'block', color: 'black' }}>
                                    {bulk_download_delete()}
                                </div>

                                <button style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray' }} onClick={() => {
                                    document.getElementById('scroll_div').scrollTop = 0
                                    dispatch({ type: SELECT, value: !select })
                                    setfinaldata([])
                                    setimage_arr([])
                                    setfinaldate('')
                                    colflag = true
                                    setcolcount(30)
                                }}>{select === false ? <span><PlaylistAddCheckOutlinedIcon style={{ marginRight: '10px' }} />Select</span> : <span style={{ display: 'flex' }}>Done<div style={{ backgroundColor: '#e32747', padding: '3px', borderRadius: '50%', height: '25px', width: '25px', marginLeft: '3px' }}><p style={{ color: 'white' }}>{selected_video.length}</p></div></span>}</button>
                            </div>
                        </div>
                    </Col>

                    {
                        page === 1 ?
                            ''
                            :
                            data != '' ?
                                <>
                                    {/* {
                                        finaldata.map((component) => {
                                            return (
                                                component
                                            )
                                        })
                                    } */}

                                    <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: 0 }}>
                                        {
                                            res2 === 'no more data' ?
                                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px', borderTop: '1px solid grey' }}>
                                                    <CloudOffRoundedIcon size={'50px'} style={{ color: '#e32747' }} />
                                                    <h5 style={{ color: '#e32747', fontWeight: 'bold', margin: 0 }}>No more videos</h5>
                                                </div>
                                                : res2 === 'progress' ?
                                                    <div style={{ marginTop: "5px" }}>
                                                        {/* <CardSkeleton cart={12} value={4} /> */}
                                                        {
                                                            type != 'alert' ? (<CardSkeleton cart={1} value={4} />) : (<TableSkeleton show={true} numRows={2} />)
                                                        }
                                                    </div>
                                                    : ''
                                        }
                                    </Col>
                                </>
                                :
                                <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ backgroundColor: '#e6e8eb' }}>
                                    {
                                        res === 'empty response' || newres === true ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px', borderTop: '1px solid grey' }}>
                                                <CloudOffRoundedIcon size={'50px'} style={{ color: '#e32747' }} />
                                                <h5 style={{ color: '#e32747', fontWeight: 'bold', margin: 0 }}>No videos found!</h5>
                                            </div>
                                        ) : (
                                            type != 'alert' ? (
                                                <CardSkeleton cart={12} value={4} />
                                            ) : (
                                                <TableSkeleton numRows={8} />
                                            )
                                        )
                                    }

                                </Col>


                    }

                </Row >
            </div >



        </div >
    )
}
