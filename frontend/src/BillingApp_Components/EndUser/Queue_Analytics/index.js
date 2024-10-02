import React, { useEffect, useState, useContext } from 'react'
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
import '../style.css'
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
import MovingIcon from '@mui/icons-material/Moving';

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
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import CloudOffRoundedIcon from '@mui/icons-material/CloudOffRounded';
import { PAGE, STARTDATE, STARTTIME, ENDDATE, ENDTIME, APPLY, SELECT, SELECTED_CAMERAS } from '../../../store/actions'
import { useDispatch, useSelector } from 'react-redux';
import * as api from '../../Configurations/Api_Details'
import DateComponent from '../DateComponent';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import axios from 'axios';
import DownloadIcon from '@mui/icons-material/Download';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import TuneIcon from '@mui/icons-material/Tune';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import AlarmIcon from '@mui/icons-material/Alarm';
import CardSkeleton from '../Cartskeleton';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';


import { S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import AWS from "aws-sdk";

import { CreateBucketCommand, S3Client, GetObjectCommand, ListBucketsCommand, DeleteBucketCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import tento from '../tento.jpeg'
import Foot_Foll_count from './Foot_Foll_count';


var moment = require("moment");
let finalflag = false
let listflag = false
let colflag = true
let delete_length = 0
let hour_mouse = true
let date_mouse = true
let cameras_region1 = []
export default function Events() {
    const userData = JSON.parse(localStorage.getItem("userData"))

    const [loading, setloading] = useState(false)
    let data = []
    const [data2, setdata2] = useState([])
    let [ana, setana] = useState(false)
    const { page, startdate, starttime, enddate, endtime, apply, select, selected_cameras, socket } = useSelector((state) => state)
    console.log(page);
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
    const [selected_hour, setselected_hour] = useState('1:00:00')

    const [scroll, setscroll] = useState(false)
    const [alert_box, setalert_box] = useState(false)
    const [alarm_type, setalarm_type] = useState('Active')
    const [date_section, setdate_section] = useState('single')
    const [delete_download_box, setdelete_download_box] = useState(false)
    const [filter_btn, setfilter_btn] = useState(false)
    const [skeleton, setskeleton] = useState(false)
    const [apply_flag, setapply_flag] = useState(false)
    const [t_f_alarm, sett_f_alert] = useState(0)
    const [res2, setres2] = useState('')
    const [create_group_select, setcreate_group_select] = useState(false)
    const [time_chk, settime_chk] = useState('hour')
    const alertClose = () => setalert_box(false)
    const [response_start_length, setresponse_end_length] = useState({ start_count: 0, end_count: 30, total: 0 })
    const delete_downloadClose = () => setdelete_download_box(false)

    const [second_screen, setsecond_screen] = useState(false)
    const [online_cam, setonline_cam] = useState(0)
    const [offline_cam, setoffline_cam] = useState(0)
    const [res_flag, setres_flag] = useState('no res')
    const [cameras_region, setcameras_region] = useState([])
    const [time_count, settime_count] = useState({ time: 0, count: 0 })



    useEffect(() => {
        finalflag = false
        hour_mouse = true
        date_mouse = true
    }, [apply])

    function apply_can_fun() {
        setviewstart_date(false)
        setviewend_date(false)
    }

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
        setres_flag('no res')
        dispatch({ type: SELECTED_CAMERAS, value: [] })
        let data = []
        let count = 0

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
                    let new_camera = []
                    response.data.map((val) => {
                        if (val.camera_option.people_analytics != undefined && val.camera_option.people_analytics != 0) {
                            new_camera.push(val)
                        }
                    })

                    let region = []
                    new_camera.map((value) => {
                        value.image_edited_people.map((val) => {
                            region.push({ name: val.name, id: val.id, main_type: value.main_type, overall_count: value.overall_count, _id: value._id })
                        })
                    })


                    axios.post(api.LIST_ALL_QUEUE_COUNT_CAMERA_ID, { region_id: region }).then(response => {
                        console.log(new_camera);
                        cameras_region1 = region
                        settime_count({ time: response.data.time, count: response.data.count })
                        setcameras(new_camera)
                        setcameras1(new_camera)
                        setcameras_view(new_camera)
                        setcameras_region(region)
                        setcameras_view1(new_camera)
                        setcameras_view2(new_camera)
                        setselectedcameras(new_camera)
                        setres_flag('res')
                        setselectedcameras_orginal(new_camera)
                        dispatch({ type: SELECTED_CAMERAS, value: new_camera })
                    })
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
                            let new_camera = []
                            data.map((val) => {
                                if (val.camera_option.people_analytics != undefined && val.camera_option.people_analytics != 0) {
                                    new_camera.push(val)
                                }
                            })

                            let region = []
                            new_camera.map((value) => {
                                value.image_edited_people.map((val) => {
                                    region.push({ name: val.name, id: val.id, main_type: value.main_type, overall_count: value.overall_count })
                                })
                            })

                            axios.post(api.LIST_ALL_QUEUE_COUNT_CAMERA_ID, { region_id: region }).then(response => {
                                cameras_region1 = region
                                settime_count({ time: response.data.time, count: response.data.count })
                                setcameras(new_camera)
                                setcameras1(new_camera)
                                setcameras_view(new_camera)
                                setcameras_region(region)
                                setcameras_view1(new_camera)
                                setcameras_view2(new_camera)
                                setselectedcameras(new_camera)
                                setres_flag('no res')
                                setselectedcameras_orginal(new_camera)
                                dispatch({ type: SELECTED_CAMERAS, value: new_camera })
                            })
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
                    let new_camera = []
                    response.data.map((val) => {
                        if (val.camera_option.people_analytics != undefined && val.camera_option.people_analytics != 0) {
                            new_camera.push(val)
                        }
                    })

                    let region = []
                    new_camera.map((value) => {
                        value.image_edited_people.map((val) => {
                            region.push({ name: val.name, id: val.id, main_type: value.main_type, overall_count: value.overall_count })
                        })
                    })

                    axios.post(api.LIST_ALL_QUEUE_COUNT_CAMERA_ID, { region_id: region }).then(response => {
                        cameras_region1 = region
                        settime_count({ time: response.data.time, count: response.data.count })
                        setcameras(new_camera)
                        setcameras1(new_camera)
                        setcameras_view(new_camera)
                        setcameras_region(region)
                        setcameras_view1(new_camera)
                        setcameras_view2(new_camera)
                        setselectedcameras(new_camera)
                        setres_flag('no res')
                        setselectedcameras_orginal(new_camera)
                        dispatch({ type: SELECTED_CAMERAS, value: new_camera })
                    })
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
    }, [])

    useEffect(() => {
        try {
            socket.on('new queue', function (a) {
                console.log(JSON.parse(a))
                cameras_region1.map((val) => {
                    if (val.id == JSON.parse(a).region_id) {
                        if (JSON.parse(a).count > time_count.count) {
                            settime_count({ ...time_count, count: JSON.parse(a).count })
                        }

                        if (JSON.parse(a).wait_time > time_count.time) {
                            settime_count({ ...time_count, time: JSON.parse(a).time })
                        }
                    }
                })
            })
        } catch (e) {
            console.log(e);
        }
    }, [])

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

    if (clickbtn1 === true) {
        if (btn1 === 'day') {
            setbtn1('')
            let btn = document.getElementById('day')
            btn.style.backgroundColor = '#f0f0f0'
            btn.style.color = 'black'
        } else if (btn1 === '' || btn1 === 'analytics') {
            setbtn1('day')
            let btn = document.getElementById('day')
            btn.style.backgroundColor = '#e32747'
            btn.style.color = 'white'
        }
        setclickbtn1(false)
    } else if (clickbtn2 === true) {
        if (btn1 === 'analytics') {
            setbtn1('')
            let btn = document.getElementById('day')
            btn.style.backgroundColor = '#f0f0f0'
            btn.style.color = 'black'
        } else if (btn1 === '' || btn1 === 'day') {
            setbtn1('analytics')
            let btn = document.getElementById('day')
            btn.style.backgroundColor = '#f0f0f0'
            btn.style.color = 'black'
        }
        setclickbtn2(false)
    }


    function initialdate(year, month, date, start_time, end_time, type) {
        console.log(date_section);
        if (date_section == 'single') {
            if (type === 'start_date') {
                dispatch({ type: STARTDATE, value: `${year}-${month < 10 ? `0${month + 1}` : month + 1}-${date < 10 ? `0${date}` : date}` })
                setstart_dateFullYear(year)
                setstart_dateMonth(month < 10 ? `0${month + 1}` : month + 1)
                setstart_dateDate(date < 10 ? `0${date}` : date)
                if (time_chk != 'monthly' || time_chk != 'monthly') {
                    setviewstart_date(!viewstart_date)
                }


                dispatch({ type: ENDDATE, value: `${year}-${month < 10 ? `0${month + 1}` : month + 1}-${date < 10 ? `0${date}` : date}` })
                setend_dateFullYear(year)
                setend_dateMonth(month < 10 ? `0${month + 1}` : month + 1)
                setend_dateDate(date < 10 ? `0${date}` : date)

                if (time_chk != 'monthly' || time_chk != 'monthly') {
                    setviewend_date(!viewend_date)
                }
            } else if (type === 'time') {
                dispatch({ type: STARTTIME, value: start_time })
                dispatch({ type: ENDTIME, value: end_time })
            }
        } else {
            if (type === 'start_date') {
                dispatch({ type: STARTDATE, value: `${year}-${month < 10 ? `0${month + 1}` : month + 1}-${date < 10 ? `0${date}` : date}` })
                setstart_dateFullYear(year)
                setstart_dateMonth(month < 10 ? `0${month + 1}` : month + 1)
                setstart_dateDate(date < 10 ? `0${date}` : date)
                if (time_chk != 'monthly' || time_chk != 'monthly') {
                    setviewstart_date(!viewstart_date)
                }
            } else if (type === 'end_date') {
                dispatch({ type: ENDDATE, value: `${year}-${month < 10 ? `0${month + 1}` : month + 1}-${date < 10 ? `0${date}` : date}` })
                setend_dateFullYear(year)
                setend_dateMonth(month < 10 ? `0${month + 1}` : month + 1)
                setend_dateDate(date < 10 ? `0${date}` : date)
                if (time_chk != 'monthly' || time_chk != 'monthly') {
                    setviewend_date(!viewend_date)
                }

            } else if (type === 'time') {
                dispatch({ type: STARTTIME, value: start_time })
                dispatch({ type: ENDTIME, value: end_time })
            }
        }
    }

    function select_hour(val) {
        setselected_hour(val)
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
        const image_uri = await getSignedUrl(s3Client, image_command)
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


    return (
        <>
            {
                userData.position_type != 'Attendance User' ?
                    <div style={{ width: '100%' }} onClick={(event) => {
                        if (!hour_mouse) {
                            hour_mouse = true
                            setcreate_group_select(!create_group_select)
                        }

                        if (!date_mouse) {
                            date_mouse = true
                            setclickbtn1(true)
                        }
                    }}>

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
                                            <CloseIcon style={{ fontSize: '15px', color: 'red' }} onClick={() => {
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
                                            <CloseIcon style={{ fontSize: '15px', color: 'red' }} onClick={() => {
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
                                onClose={handleClose1}
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
                                                                <CloseIcon style={{ color: 'black', cursor: 'pointer' }} onClick={() => handleClose1()} />
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

                                                                        }} style={{ display: 'flex', backgroundColor: camera_box ? '#e22747' : '#e6e8eb', color: camera_box ? 'white' : 'black' }}> <CameraAltOutlinedIcon style={{ marginRight: '10px' }} />Cameras</button>

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
                                                                                                                                // const getStocksData = {
                                                                                                                                //     method: 'get',
                                                                                                                                //     maxBodyLength: Infinity,
                                                                                                                                //     url: `${api.CAMERAS_HEALTH}${val.stream_id}/stream-info`,
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

                                                                                                                                //     let check = []

                                                                                                                                //     if (tag_search == '') {
                                                                                                                                //         check = document.getElementsByClassName('tagCheckbox')
                                                                                                                                //         for (let i = 0; i < check.length; i++) {
                                                                                                                                //             if (i != k && check[i].checked === false) {
                                                                                                                                //                 flagcount = flagcount + 1
                                                                                                                                //             }
                                                                                                                                //         }
                                                                                                                                //     } else {
                                                                                                                                //         check = camera_checkbox
                                                                                                                                //         check.push(1)
                                                                                                                                //     }

                                                                                                                                //     let check1 = document.getElementsByClassName('groupCheckbox')
                                                                                                                                //     for (let i = 0; i < check1.length; i++) {
                                                                                                                                //         if (check1[i].checked === false) {
                                                                                                                                //             flagcount1 = flagcount1 + 1
                                                                                                                                //         }
                                                                                                                                //     }

                                                                                                                                //     let check2 = document.getElementsByClassName('cameraCheckbox')
                                                                                                                                //     for (let i = 0; i < check2.length; i++) {
                                                                                                                                //         if (check2[i].checked === false) {
                                                                                                                                //             flagcount2 = flagcount2 + 1
                                                                                                                                //         }
                                                                                                                                //     }

                                                                                                                                //     if (check.length > flagcount) {
                                                                                                                                //         if (data1.length !== 0) {
                                                                                                                                //             if (check.length - 1 == flagcount) {
                                                                                                                                //                 if (check1.length == flagcount1 && check2.length == flagcount2) {

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


                                                                                                                                //     settag_checkbox([...tag_checkbox, value._id])
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


                        <div style={{ height: '98vh', width: '100%', paddingRight: 0, }} >
                            <Row id='main' >
                                <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: page === 1 ? 'block' : 'none' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ color: 'black', fontWeight: 'bolder', fontSize: '20px' }}>Filters</p>
                                        <CloseIcon style={{ color: 'black' }} onClick={() => {
                                            dispatch({ type: PAGE, value: 0 })
                                        }} />
                                    </div>
                                </Col>



                                <Col xl={12} lg={12} md={12} sm={12} xs={12} id='events' style={{ backgroundColor: '#e6e8eb', position: 'sticky', top: 0, zIndex: 2 }}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', color: 'black', alignItems: 'flex-end' }}>
                                            <p style={{ fontSize: '20px', fontWeight: 'bolder' }}>QUEUE</p>
                                            <p style={{ marginLeft: '5px' }}>analytics</p>
                                        </div>

                                        {
                                            selected_cameras.length != 0 && cameras.length != 0 ?
                                                <div style={{ display: 'flex' }}>
                                                    <div style={{ background: `linear-gradient(#3453c7, #6d8dfc)`, borderRadius: '15px', padding: '10px', display: 'inline-block', color: 'black', width: '230px', marginRight: '10px', marginBottom: '10px', boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}>

                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <div style={{ marginBottom: '8px' }}>
                                                                <p style={{ fontWeight: 'bold', color: 'white', fontSize: '18px', margin: 0, marginBottom: '4px' }}>No Of Counter</p>
                                                            </div>
                                                            <div style={{ borderRadius: '20px', background: `linear-gradient(#3453c7, #6d8dfc)`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '3px', paddingBottom: '3px', color: 'white' }}>
                                                                <MovingIcon style={{ fontSize: '20px' }} />
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'flex', }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px', }}>
                                                                <p style={{ fontWeight: 'bold', margin: 0, color: 'white', marginRight: '5px' }}>Count</p>
                                                                <div style={{ borderRadius: '15px', background: `linear-gradient(#3453c7, #6d8dfc)`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '5px', paddingBottom: '5px' }}>
                                                                    <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>{cameras_region.length == 0 ? 0 : cameras_region.length}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div style={{ background: `linear-gradient(#520229, #c8019c)`, borderRadius: '15px', padding: '10px', display: 'inline-block', color: 'black', width: '230px', marginRight: '10px', marginBottom: '10px', boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}>

                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <div style={{ marginBottom: '8px' }}>
                                                                <p style={{ fontWeight: 'bold', color: 'white', fontSize: '18px', margin: 0, marginBottom: '4px' }}>Maximum Queue Length</p>
                                                            </div>
                                                            <div style={{ borderRadius: '20px', background: `linear-gradient(#520229, #c8019c)`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '3px', paddingBottom: '3px', color: 'white' }}>
                                                                <MovingIcon style={{ fontSize: '20px' }} />
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'flex', }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px', }}>
                                                                <p style={{ fontWeight: 'bold', margin: 0, color: 'white', marginRight: '5px' }}>Count</p>
                                                                <div style={{ borderRadius: '15px', background: `linear-gradient(#520229, #c8019c)`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '5px', paddingBottom: '5px' }}>
                                                                    <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>{time_count.count}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div style={{ background: `linear-gradient(#693408, #fea115)`, borderRadius: '15px', padding: '10px', display: 'inline-block', color: 'black', width: '230px', marginRight: '10px', marginBottom: '10px', boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}>

                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <div style={{ marginBottom: '8px' }}>
                                                                <p style={{ fontWeight: 'bold', color: 'white', fontSize: '18px', margin: 0, marginBottom: '4px' }}>Maximum Wait Time</p>
                                                            </div>
                                                            <div style={{ borderRadius: '20px', background: `linear-gradient(#693408, #fea115)`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '3px', paddingBottom: '3px', color: 'white' }}>
                                                                <MovingIcon style={{ fontSize: '20px' }} />
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'flex', }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px', }}>
                                                                <p style={{ fontWeight: 'bold', margin: 0, color: 'white', marginRight: '5px' }}>Count</p>
                                                                <div style={{ borderRadius: '15px', background: `linear-gradient(#693408, #fea115)`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '5px', paddingBottom: '5px' }}>
                                                                    <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>{time_count.time}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div style={{ background: `linear-gradient(#880408, #d50036)`, borderRadius: '15px', padding: '10px', display: 'inline-block', color: 'black', width: '230px', marginRight: '10px', marginBottom: '10px', boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}>

                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <div style={{ marginBottom: '8px' }}>
                                                                <p style={{ fontWeight: 'bold', color: 'white', fontSize: '18px', margin: 0, marginBottom: '4px' }}>Alert</p>
                                                            </div>
                                                            <div style={{ borderRadius: '20px', background: `linear-gradient(#880408, #d50036)`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '3px', paddingBottom: '3px', color: 'white' }}>
                                                                <MovingIcon style={{ fontSize: '20px' }} />
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'flex', }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px', }}>
                                                                <p style={{ fontWeight: 'bold', margin: 0, color: 'white', marginRight: '5px' }}>Count</p>
                                                                <div style={{ borderRadius: '15px', background: `linear-gradient(#880408, #d50036)`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '5px', paddingBottom: '5px' }}>
                                                                    <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>{0}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : ''
                                        }
                                    </div>

                                    <hr></hr>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ display: select === false ? 'block' : 'none' }}>
                                            <div id='eventsDiv' style={{ display: 'flex', marginBottom: '10px' }}>

                                                <div className='eventsDiv1'>
                                                    <div style={{ position: 'relative' }}>

                                                        {cameras.length != 0 ? (

                                                            <button className='eventbtn' id='cameras' onClick={() => {
                                                                setclickbtn3(true)
                                                                handleOpen1()



                                                            }} style={{ display: 'flex' }}> <CameraAltOutlinedIcon style={{ marginRight: '7px' }} />Cameras<div style={{ backgroundColor: '#e32747', padding: '3px', borderRadius: '50%', height: '25px', width: '25px', marginLeft: '10px' }}><p style={{ color: 'white' }}>{selectedcameras.length}</p></div> <ArrowDropDownIcon style={{ marginLeft: '0px' }} /></button>

                                                        ) : (<Skeleton style={{ display: 'flex', borderRadius: '20px', border: '1px solid gray', marginRight: '20px' }} width={200} height={45} />)
                                                        }

                                                    </div>
                                                </div>

                                                <div style={{ position: 'relative', }} >
                                                    {
                                                        cameras.length != 0 ?
                                                            <>
                                                                <button className='eventbtn' onMouseEnter={() => {
                                                                    hour_mouse = true
                                                                }} onMouseLeave={() => {
                                                                    if (create_group_select) {
                                                                        hour_mouse = false
                                                                    }

                                                                }} onClick={() => {
                                                                    setcreate_group_select(!create_group_select)

                                                                }} style={{ display: 'flex', backgroundColor: create_group_select ? '#e32747' : '#e6e8eb', color: create_group_select ? 'white' : 'black' }}> <CheckCircleOutlinedIcon style={{ marginRight: '10px' }} />{time_chk == 'hour' ? 'Hour' : time_chk == 'day' ? 'Day' : time_chk == 'monthly' ? 'Monthly' : 'Yearly'}<ArrowDropDownIcon style={{ marginLeft: '10px' }} /></button>

                                                                <div onMouseEnter={() => {
                                                                    hour_mouse = true
                                                                }} onMouseLeave={() => {
                                                                    hour_mouse = false
                                                                }}>
                                                                    <div style={{ borderRadius: '5px', backgroundColor: '#181828', padding: '10px', position: 'absolute', top: '60px', zIndex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', width: '200px', display: create_group_select ? 'block' : 'none' }}>
                                                                        <div style={{ position: 'relative' }}>

                                                                            <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: '-37px' }} />
                                                                            <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                                <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                                                                    <CloseIcon style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }} onClick={() => {
                                                                                        setcreate_group_select(false)
                                                                                    }} />
                                                                                </div>
                                                                            </div>

                                                                            <div>
                                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                                                    <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '0px', marginRight: '10px' }}>Hour</p>
                                                                                    <input type='checkbox' checked={time_chk == 'hour' ? true : false} onChange={(e) => {
                                                                                        settime_chk('hour')

                                                                                        setdate_section('single')

                                                                                        dispatch({ type: ENDDATE, value: startdate })
                                                                                        setend_dateFullYear(start_dateFullYear)
                                                                                        setend_dateMonth(start_dateMonth)
                                                                                        setend_dateDate(start_dateDate)
                                                                                    }}></input>
                                                                                </div>

                                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                                                    <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '0px', marginRight: '10px' }}>Day</p>
                                                                                    <input type='checkbox' checked={time_chk == 'day' ? true : false} onChange={(e) => {
                                                                                        settime_chk('day')
                                                                                    }}></input>
                                                                                </div>

                                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                                                    <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '0px', marginRight: '10px' }}>Monthly</p>
                                                                                    <input type='checkbox' checked={time_chk == 'monthly' ? true : false} onChange={(e) => {
                                                                                        settime_chk('monthly')
                                                                                    }}></input>
                                                                                </div>

                                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                                                    <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '0px', marginRight: '10px' }}>Yearly</p>
                                                                                    <input type='checkbox' checked={time_chk == 'yearly' ? true : false} onChange={(e) => {
                                                                                        settime_chk('yearly')
                                                                                    }}></input>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                            :
                                                            <Skeleton style={{ display: 'flex', borderRadius: '20px', border: '1px solid gray', marginRight: '20px' }} width={150} height={45} />
                                                    }
                                                </div>

                                                <div className='eventsDiv1' style={{ position: 'relative' }}>


                                                    {cameras.length != 0 ? (
                                                        <button className='eventbtn' id='day' onMouseEnter={() => {
                                                            date_mouse = true
                                                        }} onMouseLeave={() => {
                                                            if (btn1 === 'day') {
                                                                date_mouse = false
                                                            }

                                                        }} onClick={() => {
                                                            setclickbtn1(true)
                                                            date_mouse = true


                                                        }}> <CalendarMonthIcon style={{ marginRight: '7px' }} />{`${start_dateFullYear}${time_chk != 'yearly' ? `-${start_dateMonth}` : ''}${time_chk == 'monthly' || time_chk == 'yearly' ? '' : `-${start_dateDate}`}`} {time_chk == 'monthly' || time_chk == 'yearly' || time_chk == 'day' ? '' : `(${starttime})`} - {`${end_dateFullYear}${time_chk != 'yearly' ? `-${end_dateMonth}` : ''}${time_chk == 'monthly' || time_chk == 'yearly' ? '' : `-${end_dateDate}`}`} {time_chk == 'monthly' || time_chk == 'yearly' || time_chk == 'day' ? '' : `(${endtime})`} <ArrowDropDownIcon style={{ marginLeft: '10px' }} /></button>
                                                    ) : (<Skeleton style={{ borderRadius: '20px', border: '1px solid gray', }} width={300} height={45} />)
                                                    }

                                                    <div onMouseEnter={() => {
                                                        date_mouse = true
                                                    }} onMouseLeave={() => {
                                                        date_mouse = false
                                                    }}>
                                                        <div style={{ width: page === 1 ? '350px' : '420px', borderRadius: '5px', backgroundColor: '#181828', padding: '10px', position: 'absolute', top: page === 1 ? '80px' : '60px', zIndex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', display: btn1 === 'day' ? 'block' : 'none' }}>
                                                            <div style={{ position: 'relative' }}>

                                                                <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: '-37px', left: 0 }} />
                                                                <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                    <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                                                        <CloseIcon style={{ fontSize: '12px', color: 'white' }} onClick={() => {
                                                                            setclickbtn1(true)
                                                                        }} />
                                                                    </div>
                                                                </div>

                                                                {
                                                                    time_chk != 'hour' ?
                                                                        <div>
                                                                            <div style={{ marginTop: '10px' }}>
                                                                                <button style={{ backgroundColor: date_section == 'single' ? '#e22747' : 'transparent', color: date_section == 'single' ? 'white' : '#808080', padding: '5px', borderRadius: '20px', border: '1px solid gray', marginRight: '10px' }} onClick={() => {
                                                                                    setdate_section('single')

                                                                                    dispatch({ type: ENDDATE, value: startdate })
                                                                                    setend_dateFullYear(start_dateFullYear)
                                                                                    setend_dateMonth(start_dateMonth)
                                                                                    setend_dateDate(start_dateDate)
                                                                                }}>Single Date</button>

                                                                                <button style={{ backgroundColor: date_section == 'multi' ? '#e22747' : 'transparent', color: date_section == 'multi' ? 'white' : '#808080', padding: '5px', borderRadius: '20px', border: '1px solid gray' }} onClick={() => {
                                                                                    setdate_section('multi')
                                                                                }}>Multi Date</button>
                                                                            </div>
                                                                        </div>
                                                                        : ''
                                                                }

                                                                <div style={{ display: page === 1 ? 'none' : 'block' }}>
                                                                    <div style={{ display: 'flex', padding: '10px', flexDirection: 'column' }}>
                                                                        <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '5px' }}>Start Date</p>
                                                                        <div style={{ position: 'relative' }}>
                                                                            <div style={{ backgroundColor: '#f4f7fa', borderRadius: '5px', padding: '10px', display: 'flex', justifyContent: 'space-between' }} onClick={() => {
                                                                                setviewstart_date(!viewstart_date)
                                                                                setviewend_date(false)
                                                                            }}>
                                                                                <p style={{ fontWeight: 'bolder', margin: 0, color: '#181828' }}>{`${start_dateFullYear}${time_chk != 'yearly' ? `-${start_dateMonth}` : ''}${time_chk == 'monthly' || time_chk == 'yearly' ? '' : `-${start_dateDate}`}`} {time_chk == 'monthly' || time_chk == 'yearly' || time_chk == 'day' ? '' : <span style={{ marginLeft: '10px' }}>{`${starttime}-${endtime}`}</span>}</p>
                                                                                <CalendarMonthIcon style={{ cursor: 'pointer', color: '#181828' }} />
                                                                            </div>

                                                                            <div style={{ position: 'absolute', zIndex: 2, top: '50px', display: viewstart_date === true ? 'block' : 'none' }}>
                                                                                <DateComponent year={start_dateFullYear} month={Number(start_dateMonth)} date={Number(start_dateDate)} type={'start_date'} starttime={starttime} endtime={endtime} parentFunction={initialdate} flag={'endTime'} select_hour={'none'} apply_can_fun={apply_can_fun} days_time={time_chk == 'monthly' || time_chk == 'yearly' ? false : true} />
                                                                            </div>
                                                                        </div>
                                                                        {/* <input type="date" value={startdate} style={{ padding: '10px', borderRadius: '5px' }} onChange={(e) => {

                                                        dispatch({ type: STARTDATE, value: e.target.value })
                                                    }}></input>
                                                    <input type="time" value={starttime} style={{ padding: '10px', borderRadius: '5px' }} onChange={(e) => {

                                                        dispatch({ type: STARTTIME, value: e.target.value })
                                                    }}></input> */}
                                                                    </div>

                                                                    {
                                                                        date_section == 'multi' ?

                                                                            <div style={{ display: 'flex', padding: '10px', flexDirection: 'column' }}>
                                                                                <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '5px' }}>End Date</p>
                                                                                <div style={{ position: 'relative' }}>
                                                                                    <div style={{ backgroundColor: '#f4f7fa', borderRadius: '5px', padding: '10px', display: 'flex', justifyContent: 'space-between' }} onClick={() => {
                                                                                        setviewend_date(!viewend_date)
                                                                                        setviewstart_date(false)
                                                                                    }}>

                                                                                        <p style={{ fontWeight: 'bolder', margin: 0, color: '#181828' }}>{`${end_dateFullYear}${time_chk != 'yearly' ? `-${end_dateMonth}` : ''}${time_chk == 'monthly' || time_chk == 'yearly' ? '' : `-${end_dateDate}`}`} {time_chk == 'monthly' || time_chk == 'yearly' || time_chk == 'day' ? '' : <span style={{ marginLeft: '10px' }}>{`${starttime}-${endtime}`}</span>}</p>
                                                                                        <CalendarMonthIcon style={{ cursor: 'pointer', color: '#181828' }} />
                                                                                    </div>

                                                                                    <div style={{ position: 'absolute', zIndex: 2, top: '50px', display: viewend_date === true ? 'block' : 'none' }}>
                                                                                        <DateComponent year={end_dateFullYear} month={Number(end_dateMonth)} date={Number(end_dateDate)} type={'end_date'} starttime={starttime} endtime={endtime} parentFunction={initialdate} flag={'endTime'} select_hour={'none'} apply_can_fun={apply_can_fun} days_time={time_chk == 'monthly' || time_chk == 'yearly' ? false : true} />
                                                                                    </div>
                                                                                </div>
                                                                                {/* <input type="date" value={enddate} style={{ padding: '10px', borderRadius: '5px' }} onChange={(e) => {
                                                        dispatch({ type: ENDDATE, value: e.target.value })
                                                    }}></input>
                                                    <input type="time" value={endtime} style={{ padding: '10px', borderRadius: '5px' }} onChange={(e) => {
                                                        dispatch({ type: ENDTIME, value: e.target.value })
                                                    }}></input> */}
                                                                            </div>
                                                                            : ''
                                                                    }

                                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '10px' }}>
                                                                        <button className="my-2" style={{ backgroundColor: '#e32747', color: 'white', borderRadius: '5px', border: 'none', padding: '5px' }} onClick={() => {
                                                                            setclickbtn1(true)
                                                                            setapply_flag(true)

                                                                            if (!second_screen) {
                                                                                setsecond_screen(true)
                                                                            }
                                                                            dispatch({ type: APPLY, value: !apply })
                                                                        }}>Apply</button>
                                                                    </div>
                                                                </div>

                                                                <div style={{ display: page === 1 ? 'block' : 'none', paddingRight: '10px' }}>

                                                                    <Row>
                                                                        <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <p style={{ margin: 0, color: 'white', fontWeight: 'bolder' }}>Start Date</p>
                                                                        </Col>

                                                                        <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: '3px' }}>
                                                                            <div style={{ position: 'relative' }}>
                                                                                <div style={{ backgroundColor: '#f4f7fa', borderRadius: '5px', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>

                                                                                    <p style={{ fontWeight: 'bolder', margin: 0, color: '#181828' }}>{`${start_dateFullYear}${time_chk != 'yearly' ? `-${start_dateMonth}` : ''}${time_chk == 'monthly' || time_chk == 'yearly' ? '' : `-${start_dateDate}`}`} {time_chk == 'monthly' || time_chk == 'yearly' || time_chk == 'day' ? '' : <span style={{ marginLeft: '10px' }}>{`${starttime}-${endtime}`}</span>}</p>
                                                                                    <CalendarMonthIcon style={{ cursor: 'pointer', color: '#181828' }} onClick={() => {
                                                                                        setviewstart_date(!viewstart_date)
                                                                                    }} />
                                                                                </div>

                                                                                <div style={{ position: 'absolute', zIndex: 2, top: '90px', display: viewstart_date === true ? 'block' : 'none' }}>
                                                                                    <DateComponent year={start_dateFullYear} month={Number(start_dateMonth)} date={Number(start_dateDate)} type={'start_date'} starttime={starttime} endtime={endtime} parentFunction={initialdate} flag={'endTime'} select_hour={'none'} apply_can_fun={apply_can_fun} days_time={time_chk == 'monthly' || time_chk == 'yearly' ? false : true} />
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>

                                                                    {/* <Row>
                                                    <Col xl={12} lg={12} md={12} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                                        <p style={{ margin: 0, color: 'white', fontWeight: 'bolder' }}>Start Date</p>
                                                    </Col>

                                                    <Col xl={12} lg={12} md={12} sm={7} xs={7} style={{ padding: '3px' }}>
                                                        <input type="date" value={startdate} style={{ padding: '5px', borderRadius: '5px', width: '100%' }} onChange={(e) => {
                                                            dispatch({ type: STARTDATE, value: e.target.value })
                                                        }}></input>
                                                    </Col>
                                                </Row> */}

                                                                    {/* <Row>
                                                    <Col xl={12} lg={12} md={12} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                                        <p style={{ margin: 0, color: 'white', fontWeight: 'bolder' }}>Start Time</p>
                                                    </Col>

                                                    <Col xl={12} lg={12} md={12} sm={7} xs={7} style={{ padding: '3px' }}>
                                                        <input type="time" value={starttime} style={{ padding: '5px', borderRadius: '5px', width: '100%' }} onChange={(e) => {
                                                            dispatch({ type: STARTTIME, value: e.target.value })
                                                        }}></input>
                                                    </Col>
                                                </Row> */}

                                                                    <Row>
                                                                        <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <p style={{ fontWeight: 'bolder', fontSize: '16px' }}>END DATE</p>
                                                                        </Col>

                                                                        <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: '3px' }}>
                                                                            <div style={{ position: 'relative' }}>
                                                                                <div style={{ backgroundColor: '#f4f7fa', borderRadius: '5px', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>

                                                                                    <p style={{ fontWeight: 'bolder', margin: 0, color: '#181828' }}>{`${end_dateFullYear}${time_chk != 'yearly' ? `-${end_dateMonth}` : ''}${time_chk == 'monthly' || time_chk == 'yearly' ? '' : `-${end_dateDate}`}`} {time_chk == 'monthly' || time_chk == 'yearly' || time_chk == 'day' ? '' : <span style={{ marginLeft: '10px' }}>{`${starttime}-${endtime}`}</span>}</p>
                                                                                    <CalendarMonthIcon style={{ cursor: 'pointer', color: '#181828' }} onClick={() => {
                                                                                        setviewend_date(!viewend_date)
                                                                                    }} />
                                                                                </div>

                                                                                <div style={{ position: 'absolute', zIndex: 2, top: '90px', display: viewend_date === true ? 'block' : 'none' }}>
                                                                                    <DateComponent year={end_dateFullYear} month={Number(end_dateMonth)} date={Number(end_dateDate)} type={'end_date'} starttime={starttime} endtime={endtime} parentFunction={initialdate} flag={'endTime'} select_hour={'none'} apply_can_fun={apply_can_fun} days_time={time_chk == 'monthly' || time_chk == 'yearly' ? false : true} />
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>

                                                                    {/* <Row>
                                                    <Col xl={12} lg={12} md={12} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                                        <p style={{ margin: 0, color: 'white', fontWeight: 'bolder' }}>End Date</p>
                                                    </Col>

                                                    <Col xl={12} lg={12} md={12} sm={7} xs={7} style={{ padding: '3px' }}>
                                                        <input type="date" value={enddate} style={{ padding: '5px', borderRadius: '5px', width: '100%' }} onChange={(e) => {
                                                            dispatch({ type: ENDDATE, value: e.target.value })
                                                        }}></input>
                                                    </Col>
                                                </Row> */}

                                                                    {/* <Row>
                                                    <Col xl={12} lg={12} md={12} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                                        <p style={{ margin: 0, color: 'white', fontWeight: 'bolder' }}>End Time</p>
                                                    </Col>

                                                    <Col xl={12} lg={12} md={12} sm={7} xs={7} style={{ padding: '3px' }}>
                                                        <input type="time" value={endtime} style={{ padding: '5px', borderRadius: '5px', width: '100%' }} onChange={(e) => {
                                                            dispatch({ type: ENDTIME, value: e.target.value })
                                                        }}></input>
                                                    </Col>
                                                </Row> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div >
                                                </div >


                                            </div >


                                        </div >

                                    </div >

                                    <Row>

                                        {
                                            selected_cameras.length != 0 && cameras.length != 0 ?
                                                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <Foot_Foll_count startdate={startdate} starttime={starttime} enddate={enddate} endtime={endtime} time_chk={time_chk} />
                                                </Col>
                                                : res_flag == 'no res' ?
                                                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                        <p style={{ color: '#e32747', fontWeight: 'bolder', textAlign: 'center' }}>Loading...</p>
                                                    </Col>
                                                    :
                                                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                            <div style={{ width: '100%' }}>
                                                                <hr></hr>
                                                                <p style={{ color: '#e32747', fontWeight: 'bolder', textAlign: 'center' }}>No Cameras Found !</p>
                                                            </div>
                                                        </div>
                                                    </Col>
                                        }
                                    </Row>

                                </Col >

                            </Row >
                        </div >



                    </div >
                    :
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <p>Attendance user Doesn't have permission to access People Analytics</p>
                    </div>
            }
        </>
    )
}
