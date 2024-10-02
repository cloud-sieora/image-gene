import React, { useState, useEffect } from 'react'
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
import {db_type} from '../db_config'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CloseIcon from '@mui/icons-material/Close';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import VideoCameraBackOutlinedIcon from '@mui/icons-material/VideoCameraBackOutlined';
import Modal from '@mui/material/Modal';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { PAGE, STARTDATE, STARTTIME, ENDDATE, ENDTIME, APPLY, SELECT, SELECTED_CAMERAS } from '../../../store/actions'
import * as api from '../../Configurations/Api_Details'
import { useDispatch } from 'react-redux'
import '../style.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import AWSMqtt from "aws-mqtt-client"
import AWS from 'aws-sdk';
import io from 'socket.io-client'
import axios from 'axios'
import moment from 'moment'
import CircularProgress from '@mui/material/CircularProgress';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { CreateBucketCommand, S3Client, GetObjectCommand, ListBucketsCommand, DeleteBucketCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import TableSkeleton from '../Tableskeleton';
import Skeleton from 'react-loading-skeleton';

import tentovision_logo from '../../../assets/images/tentovision_logo.jpeg';


let flag_type = 'add_tag'
let count = 0
let count1 = 0
let device_count = 0
let intervals = []
let camera_list_image = []
export default function Index() {
    const dispatch = useDispatch()
    const userData = JSON.parse(localStorage.getItem("userData"))
    const [cameras, setcameras] = useState([]);
    const [selectedcameras, setselectedcameras] = useState([]);
    const [actionClick, setactionClick] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [opendelete, setOpendelete] = useState(false);
    const [opencamera, setOpencamera] = useState(false);
    // const [username_pass_model, setusername_pass_model] = useState(false);
    const [tag_name, settag_name] = useState('');
    const [tag_list, settag_list] = useState([]);
    const [tag_list_names, settag_list_names] = useState([]);
    const [tag_btn, settag_btn] = useState(false);
    const [create_tag, setcreate_tag] = useState(false);
    const [get_tag_full_data, setget_tag_full_data] = useState([]);
    const [filter, setfilter] = useState(false)
    const [camera_box, setcamera_box] = useState(false)
    const [camera_tag, setcamera_tag] = useState(false)
    const [online_status, setonline_status] = useState(false)
    const [camera_group, setcamera_group] = useState(false)
    const [get_tag_full_data_sort, setget_tag_full_data_sort] = useState([])
    const [get_tag_full_data_sort1, setget_tag_full_data_sort1] = useState([])
    const [get_group_full_data, setget_group_full_data] = useState([])
    const [get_group_full_data_sort1, setget_group_full_data_sort1] = useState([])
    const [get_group_full_data_sort, setget_group_full_data_sort] = useState([])
    const [flag1, setflag1] = useState(false)
    // const [cameras, setcameras] = useState([]);
    const [camera_search, setcamera_search] = useState('')
    const [top_camera_search, settop_camera_search] = useState('')
    const [data, setdata] = useState([]);
    const [cameras_view, setcameras_view] = useState([])
    const [cameras_search, setcameras_search] = useState([])
    const [camera_checkbox, setcamera_checkbox] = useState([])
    const [camera_serach, setcamera_serach] = useState([])
    const [tag_search, settag_search] = useState('')
    const [tag_checkbox, settag_checkbox] = useState([])
    const [group_search, setgroup_search] = useState('')
    const [group_checkbox, setgroup_checkbox] = useState([])
    const [skeleton, setskeleton] = useState(false)


    const [camera_name, setcamera_name] = useState('')
    const [camera_id, setcamera_id] = useState('')
    const [password, setpassword] = useState('')
    const [user_name, setuser_name] = useState('')
    const [ip_address, setip_address] = useState({ select: 'Select', device_id: '' })
    const [site, setsite] = useState({ select: 'Select', id: '' })
    const [site_list, setsite_list] = useState([])
    const [site_list1, setsite_list1] = useState([])
    const [active, setactive] = useState(0)
    const [cloud, setcloud] = useState(0)
    const [analytic, setanalytic] = useState(0)
    const [alert_noti, setalert_noti] = useState(0)
    const [camera_username, setcamera_username] = useState('')
    const [camera_ips, setcamera_ips] = useState([])
    let [camera_list_data, setcamera_list_data] = useState([])
    const [camera_list_data1, setcamera_list_data1] = useState([])
    const [key, setkey] = useState(0)
    const [device_id, setdevice_id] = useState('')
    const [save_type, setsave_type] = useState('new_data')
    const [camera_scan_flag, setcamera_scan_flag] = useState(false)
    const [add_camera_count, setadd_camera_count] = useState([0])
    const [alert_text, setalert_text] = useState('')
    const [camera_object, setcamera_object] = useState([])
    const [alert_box, setalert_box] = useState(false)
    const [flag, setflag] = useState(false)
    const alertClose = () => setalert_box(false)


    const [username_pass_model, setusername_pass_model] = useState(false);
    const [isChooseMode, setIsChooseMode] = useState(false)
    const [isOpenMannualModel, setIsOpenMannualModel] = useState(false)

    const [isOpenMannualSiteOption, setIsOpenMannualSiteOption] = useState(false)
    const [isOpenMannualActiveOption, setIsOpenMannualActiveOption] = useState(false)

    useEffect(() => {
        if (db_type == 'local') {

        } else {
            let socket = io(api.BACKEND_URI, { transports: ['websocket'] });

            socket.on("connect_error", (err) => {
                console.log(`connect_error due to ${err.message}`);
            })

            socket.on('cameraDetails', function (a) {

                if (userData._id == JSON.parse(a).user_id) {

                    if (JSON.parse(a).data.length !== 0 && JSON.parse(a).data[0] == 'device_active') {
                        device_count = device_count + 1
                    } else {
                        count1 = count1 + 1
                        if (device_count == count1) {
                            let data = JSON.parse(a).data
                            setcamera_list_data([...camera_list_data, ...data])
                            setcamera_list_data1([...camera_list_data, ...data])
                            setcamera_scan_flag(false)
                            handleOpen2()
                            count1 = 0
                            count = 0
                            device_count = 0
                        } else {
                            let data = JSON.parse(a).data
                            camera_list_data = [...camera_list_data, ...data]
                        }
                    }

                }

                console.log(JSON.parse(a));
            })
        }

        if (userData.position_type == 'Client' || userData.position_type == 'Client Admin') {

            const getStocksData = {
                url: userData.position_type == 'Client' ? api.LIST_SITE_DATA_CLIENT_ID : userData.position_type == 'Client Admin' ? api.LIST_SITE_DATA_CLIENT_ADMIN_ID : api.LIST_SITE_DATA_USER_ID,
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
                    setsite_list(response.data)
                    setsite_list1(response.data)
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
            let data = []
            let count = 0
            JSON.parse(localStorage.getItem("userData")).site_id.map((val) => {
                const getStocksData = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: api.SITE_CREATION + val.id,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
                axios(getStocksData)
                    .then(response => {
                        console.log(response.data);
                        count = count + 1
                        data.push(response.data)
                        if (count == (JSON.parse(localStorage.getItem("userData"))).site_id.length) {
                            setsite_list(data)
                            setsite_list1(data)
                            console.log('set site list', data)
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

        return (() => {
            if (db_type == 'local') {

            } else {
                socket.disconnect();
            }
        })
    }, [])

    useEffect(() => {
        dispatch({ type: SELECTED_CAMERAS, value: [] })
        let data1 = []
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
                    get_camera_health(response.data)
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
                        data1.push(response.data)
                        if (count == (JSON.parse(localStorage.getItem("userData"))).site_id.length) {
                            get_camera_health(data1)
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
                    get_camera_health(response.data)

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
    }, [flag])

    function get_camera_health(cameras_res) {
        let data1 = []
        let count = 0
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

                        setdata(data1)
                        setcameras(data1)
                        // setcameras1(data1)
                        console.log(data1)
                        setcameras_view(data1)
                        setcameras_search(data1)
                        // setvid(true)
                        // setcamera_res(true)

                        if (data1.length == 0) {
                            setcameras_view('no_res')
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


    function scan_camera() {

        if (user_name !== '' && password !== '') {
            setcamera_scan_flag(true)
            let current_time = moment(new Date()).format("HH:mm:ss")
            current_time = current_time.split(':')
            let current_date = moment(new Date()).format('YYYY-MM-DD')
            let ofline_device = ''
            AWS.config.update({
                region: 'ap-south-1', // e.g., 'us-east-1'
                credentials: {
                    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
                    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
                },
            });

            const iot = new AWS.IotData({
                endpoint: process.env.REACT_APP_AWS_MQTT_KEY
            });

            const getStocksData = {
                url: userData.position_type == 'Client' ? api.LIST_DEVICE_DATA_CLIENT_ID_STATUS : userData.position_type == 'Client Admin' ? api.LIST_DEVICE_DATA_CLIENT_ADMIN_ID_STATUS : userData.position_type == 'Site Admin' ? api.LIST_DEVICE_DATA_SITE_ADMIN_ID_STATUS : api.LIST_DEVICE_DATA_USER_ID_STATUS,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: userData.position_type == 'Client' ? JSON.stringify({

                    "client_id": (JSON.parse(localStorage.getItem("userData")))._id

                }) : userData.position_type == 'Client Admin' ? JSON.stringify({

                    "client_admin_id": (JSON.parse(localStorage.getItem("userData")))._id

                }) : userData.position_type == 'Site Admin' ? JSON.stringify({

                    "site_admin_id": (JSON.parse(localStorage.getItem("userData")))._id

                }) : JSON.stringify({

                    "user_id": (JSON.parse(localStorage.getItem("userData")))._id

                })
            }

            axios.request(getStocksData)
                .then((response) => {
                    console.log(response.data);
                    let finaldata = []
                    response.data.map((val) => {

                        if (val.last_active != 'NONE' && val.last_active_date != 'NONE') {
                            let device_time = val.last_active.split(':')

                            console.log(current_date, val.last_active_date && Number(current_time[0]), Number(device_time[0]) && (Number(current_time[1]) - Number(device_time[1])), 0);
                            if (current_date == val.last_active_date && Number(current_time[0]) == Number(device_time[0]) && (Number(current_time[1]) - Number(device_time[1])) == 0) {
                                count = count + 1
                                finaldata.push(val._id)
                            } else if (current_date == val.last_active_date && Number(current_time[0]) == Number(device_time[0]) && (Number(current_time[1]) - Number(device_time[1])) == 1 && (Number(current_time[2]) + Number(device_time[2])) <= 60) {
                                count = count + 1
                                finaldata.push(val._id)
                            } else {
                                if (ofline_device == '') {
                                    ofline_device = `${val.device_name}`
                                } else {
                                    ofline_device = `${ofline_device}, ${val.device_name}`
                                }
                            }
                        } else {
                            if (ofline_device == '') {
                                ofline_device = `${val.device_name}`
                            } else {
                                ofline_device = `${ofline_device}, ${val.device_name}`
                            }

                        }
                    })


                    // count = response.data.length
                    if (response.data.length == 0) {
                        handleCloseuser_pass()
                        setcamera_scan_flag(false)
                        setalert_box(true)
                        setalert_text(`No device found first add you device to device creation page.`)
                    }

                    if (ofline_device != '') {
                        setalert_box(true)
                        setalert_text(`${ofline_device}, is ofline`)

                        if (finaldata.length == 0) {
                            handleCloseuser_pass()
                            setcamera_scan_flag(false)
                        }
                    }

                    finaldata.map((val, i) => {
                        intervals.push(
                            setInterval(() => {
                                const getStocksData = {
                                    url: api.DEVICE_DATA + val,
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                }

                                axios.request(getStocksData)
                                    .then((response) => {
                                        console.log(response.data);
                                        if (response.data.camera_ip.length !== 0) {
                                            clearInterval(intervals[i])
                                            count1 = count1 + 1

                                            if (count == count1) {
                                                let data = response.data.camera_ip
                                                let newdata = [...camera_list_data, ...data]
                                                let newlist = []

                                                if (cameras.length) {
                                                    for (let index = 0; index < newdata.length; index++) {
                                                        let datacount = true
                                                        for (let inerindex = 0; inerindex < cameras.length; inerindex++) {
                                                            if (newdata[index].IPAddress == cameras[inerindex].ip_address) {
                                                                datacount = true
                                                                break
                                                            } else {
                                                                datacount = false
                                                            }
                                                        }
                                                        if (datacount == false) {
                                                            newlist.push(newdata[index])
                                                        }
                                                    }
                                                } else {
                                                    newlist = newdata
                                                }
                                                newdata = newlist
                                                let datacount = 0

                                                const s3Client = new S3Client({
                                                    region: "ap-south-1",
                                                    credentials: {
                                                        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
                                                        secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
                                                    },
                                                });

                                                console.log(newdata);

                                                newdata.map(async (val, i) => {
                                                    const image_command = new GetObjectCommand({
                                                        Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                                                        Key: val.image_key,
                                                    });

                                                    const image_uri = await getSignedUrl(s3Client, image_command)
                                                    newdata[i] = { ...newdata[i], image_uri: image_uri }
                                                    camera_object.push({
                                                        camera_name: '',
                                                        camera_id: '',
                                                        ip_address: { select: '', device_id: '' },
                                                        site: { select: '', id: '' },
                                                        active: 0,
                                                        cloud: 0,
                                                        analytic: 0,
                                                        alert_noti: 0,
                                                        from: '00:00',
                                                        to: '00:00'
                                                    })
                                                    datacount = datacount + 1


                                                    if (newdata.length == datacount) {
                                                        setcamera_list_data(newdata)
                                                        setcamera_list_data1(newdata)
                                                        setcamera_scan_flag(false)
                                                        handleOpen2()
                                                        count1 = 0
                                                        count = 0
                                                        device_count = 0
                                                        intervals = []
                                                    }
                                                })
                                            } else {
                                                let data = response.data.camera_ip
                                                camera_list_data = [...camera_list_data, ...data]
                                            }
                                        }
                                    })
                                    .catch((e) => {
                                        console.log(e);
                                    })
                            }, 10000)
                        )
                    })
                    response.data.map((val) => {
                        console.log(val.device_id);
                        const params = {
                            topic: `${val.device_id}/list_camera`,
                            payload: JSON.stringify({ user_id: userData._id, user_name: user_name, password: password, device_id: val.device_id, _id: val._id }),
                            qos: 0
                        };

                        iot.publish(params, (err, data) => {
                            if (err) {
                                console.error('Error publishing message:', err);
                            } else {
                                console.log('Message published successfully:', data);
                            }
                        });
                    })
                })
                .catch((error) => {
                    console.log(error);
                })
        } else {
            alert('enter username password')
        }
    }


    function groupelsefunction(val, type) {
        console.log('value', val)
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
                // let filteredData = cameras_view.filter((d) => d._id === val.groups[i])
                // setcameras_view(filteredData)
            } else {
                // group_value.push({ name: get_group_full_data_sort[i].group_name, ind: i })
                // setcameras_view()
            }
        }

        let check2 = document.getElementsByClassName('cameraCheckbox')
        for (let i = 0; i < check2.length; i++) {
            if (check2[i].checked === false) {
                flagcount2 = flagcount2 + 1
            } else {
                camera_value.push({ name: data[i].camera_gereral_name, ind: i })
            }
        }

        console.log(check1.length != flagcount1);

        if (check.length != flagcount) {
            if (val.tags.length !== 0) {
                for (let index = 0; index < val.tags.length; index++) {
                    let flag = false
                    let obj = []
                    for (let index1 = 0; index1 < new_camera_list.length; index1++) {
                        if (new_camera_list[index1]._id === val.tags[index]) {
                            if (check1.length != flagcount1) {
                                group_value.map((group) => {
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
                        } else {
                            flag = true
                            obj.push(new_camera_list[index1])

                        }
                    }


                    new_camera_list = obj

                }

            } else {
                new_camera_list = cameras_view
            }
        } else {
            if (check1.length != flagcount1 || check2.length != flagcount2) {
                if (val.groups.length !== 0) {
                    if (check.length == flagcount) {
                        let arr = []
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
                            }

                        }

                        group_value.map((group) => {
                            get_tag_full_data_sort[group.ind].tags.map((groupdata) => {
                                data.map((cameradata) => {
                                    if (groupdata === cameradata._id) {
                                        arr.push(cameradata)
                                    }
                                })
                            })
                        })


                        camera_value.map((group, i) => {
                            if (group.name == data[group.ind].camera_gereral_name) {
                                arr.push(data[group.ind])
                            }
                        })

                        const uniqueArray = [...new Set(arr)];
                        new_camera_list = uniqueArray


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
                new_camera_list = data
            }
        }

        let camcnk = []
        group_checkbox.map((cam) => {
            if (cam !== val._id) {
                camcnk.push(cam)
            }
        })

        setgroup_checkbox(camcnk)

        if (type == 'regular') {
            console.log(new_camera_list)
            setcameras_view(new_camera_list)
            // setcameras_search(new_camera_list)

        }
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
                camera_value.push({ name: data[i].camera_gereral_name, ind: i })
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
                        } else {
                            flag = true
                            obj.push(new_camera_list[index1])

                        }
                    }

                    console.log(obj);
                    new_camera_list = obj

                }
            } else {
                new_camera_list = cameras_view
            }
        } else {
            if (check1.length != flagcount1 || check2.length != flagcount2) {
                if (val.tags.length !== 0) {
                    if (check.length == flagcount) {
                        let arr = []
                        for (let index = 0; index < cameras_view.length; index++) {
                            let flag = true
                            let obj = {}
                            for (let index1 = 0; index1 < val.tags.length; index1++) {
                                console.log(cameras_view[index]._id, val.tags[index1], index1);
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
                            }

                        }

                        group_value.map((group) => {
                            get_group_full_data_sort[group.ind].groups.map((groupdata) => {
                                data.map((cameradata) => {
                                    if (groupdata === cameradata._id) {
                                        arr.push(cameradata)
                                    }
                                })
                            })
                        })


                        camera_value.map((group, i) => {
                            if (group.name == data[group.ind].camera_gereral_name) {
                                arr.push(data[group.ind])
                            }
                        })

                        const uniqueArray = [...new Set(arr)];
                        new_camera_list = uniqueArray


                    } else {
                        for (let index = 0; index < val.tags.length; index++) {
                            let flag = false
                            let obj = []
                            for (let index1 = 0; index1 < new_camera_list.length; index1++) {
                                if (new_camera_list[index1]._id === val.tags[index]) {
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
                new_camera_list = data
            }

        }

        let camcnk = []
        tag_checkbox.map((cam) => {
            if (cam !== val._id) {
                camcnk.push(cam)
            }
        })

        settag_checkbox(camcnk)

        if (type == 'regular') {
            console.log(new_camera_list);
            setcameras_view(new_camera_list)
            // setcameras_search(new_camera_list)

        }
    }
    function searchfunction(event, data, type) {
        let str = event
        let arr = []
        if (event != '') {
            for (let i = 0; i < data.length; i++) {
                let username = type == 'camera_search' ? `${data[i].camera_gereral_name}${data[i].camera_gereral_name}${data[i].permission_level}${data[i].camera_health}${data[i].ip_address}${data[i].camera_username}${data[i].cloud_recording == 0 ? 'Off' : 'On'}${data[i].recording_mode == 0 ? 'Motion triggered' : '24/7 Continuous'}${data[i].analytics_alert == 0 ? 'Off' : 'On'}${data[i].device_id}` : type == 'camera_search1' ? data[i].camera_gereral_name : type == 'tag_search' ? data[i].tag_name : type == 'group_search' ? data[i].group_name : ''
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

        console.log(arr);

        if (arr.length != 0) {
            if (type == 'camera_search') {
                setcameras_view(arr)
                console.log(arr);
                setcameras(arr)
            } else if (type == 'camera_search1') {
                setdata(arr)
            } else if (type == 'tag_search') {
                setget_tag_full_data_sort(arr)
            } else if (type == 'group_search') {
                setget_group_full_data_sort(arr)
            }

        } else {
            if (type == 'camera_search') {
                setcameras_view([])
                setcameras([])
            } else if (type == 'camera_search1') {
                setdata([])
            } else if (type == 'tag_search') {
                setget_tag_full_data_sort([])
            } else if (type == 'group_search') {
                setget_group_full_data_sort([])
            }
        }
    }

    function get_tag_list() {
        const axios = require('axios');
        let data = JSON.stringify({
            "user_id": userData._id
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: flag_type === 'add_tag' ? api.TAG_API_LIST : api.GROUP_API_LIST,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(response.data);
                let newlist = []
                // get_group_full_list()
                console.log(selectedcameras);

                selectedcameras.map((val) => {
                    if (newlist.length !== 0) {
                        for (let index = 0; index < newlist.length; index++) {
                            let flag = true
                            let obj = {}
                            let current = flag_type === 'add_tag' ? val.camera_tags : val.camera_groups
                            for (let index1 = 0; index1 < current.length; index1++) {
                                if (newlist[index].id === current[index1].id) {
                                    flag = true
                                    newlist[index].count = newlist[index].count + 1
                                    break
                                } else {
                                    flag = false
                                    obj = { name: current[index1].name, id: current[index1].id, count: 1, tags: [] }
                                }
                            }

                            if (flag === false) {
                                newlist.push(obj)
                            }

                        }

                    } else {
                        flag_type === 'add_tag' ?
                            val.camera_tags.map((tag_info) => {
                                newlist.push({ name: tag_info.name, id: tag_info.id, count: 1, tags: [] })
                            })
                            :
                            val.camera_groups.map((tag_info) => {
                                newlist.push({ name: tag_info.name, id: tag_info.id, count: 1, tags: [] })
                            })
                    }
                })

                console.log(newlist);

                let new_tag_list = []

                if (newlist.length !== 0) {

                    for (let index = 0; index < response.data.length; index++) {
                        let flag = true
                        let obj = ''
                        for (let index1 = 0; index1 < newlist.length; index1++) {
                            if (newlist[index1].id === response.data[index]._id) {
                                flag = true
                                newlist[index1].tags = flag_type === 'add_tag' ? response.data[index].tags : response.data[index].groups
                                break
                            } else {
                                flag = false
                                obj = response.data[index]

                            }
                        }

                        if (flag === false) {
                            new_tag_list.push(obj)
                        }
                    }
                } else {
                    new_tag_list = response.data
                }

                console.log(new_tag_list);
                console.log(newlist);
                settag_list(new_tag_list)
                settag_list_names(newlist)
                handleOpen1()


            })
            .catch((error) => {
                console.log(error);
            })
    }



    function get_tag_full_list1() {
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
                console.log("group list", response.data)
                setget_group_full_data(response.data)
                setget_group_full_data_sort(response.data)
                setget_group_full_data_sort1(response.data)
                // setcameras_view(response.data)

            })
            .catch((error) => {
                console.log(error);
            })
    }

    function get_tag_full_list() {
        const axios = require('axios');
        let data = JSON.stringify({
            "user_id": userData._id
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: flag_type === 'delete_tag' ? api.TAG_API_LIST : api.GROUP_API_LIST,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        console.log(flag_type);
        axios.request(config)
            .then((response) => {
                console.log(response.data)
                setget_tag_full_data(response.data)
                handleOpendelete()
            })
            .catch((error) => {
                console.log(error);
            })
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
            Key: data.image_uri,
        });

        const image_uri = await getSignedUrl(s3Client, image_command)
        setTimeout(() => {
            document.getElementById(`dash_image${i}`).src = image_uri
        }, 500);
        return image_uri
    }

    // async function getimageurifunction(accessKeyId, secretAccessKey, Bucket, data, i) {
    //     const s3Client = new S3Client({
    //         region: "ap-south-1",
    //         credentials: {
    //             accessKeyId: accessKeyId,
    //             secretAccessKey: secretAccessKey,
    //         },
    //     });

    //     const image_command = new GetObjectCommand({
    //         Bucket: Bucket,
    //         Key: data.image_uri,
    //     });

    //     const image_uri = await getSignedUrl(s3Client, image_command)
    //     let img = document.getElementById(`dash_image${i + 1}`).src = image_uri
    //     img.style.border = '1px solid red'
    //     return image_uri
    // }

    const handleOpen1 = () => setOpen1(true);
    const handleClose1 = () => setOpen1(false);

    const handleOpendelete = () => setOpendelete(true);
    const handleClosedelete = () => setOpendelete(false);

    const handleOpen2 = () => setOpencamera(true);
    const handleClose = () => setOpencamera(false);

    const handleopeneuser_pass = () => setusername_pass_model(true);
    const handleCloseuser_pass = () => setusername_pass_model(false);


    const handleUserChooseMode = () => setIsChooseMode(true)
    const handleOpenMannualModel = () => setIsOpenMannualModel(true)

    let initialDataMannullyArray = {
        cameraId: 0,
        flag: false,
        name: '',
        id: '',
        site: {
            siteName: '',
            siteId: ''
        },
        active: '',
        fromTime: `${new Date().getHours()}:${new Date().getMinutes()}`,
        toTime: `${23}:${59}`,
        device_id: '',
        ip_address: '',
        alertNotification: false,
        analyticAlert: false,
        cloudRecording: false
    }

    const [addCameraMannullyArray, setAddCameraMannullyArray] = useState([])

    const handleCancelCameraBtn = (id) => {
        let filteredArray = addCameraMannullyArray.filter((d) => d.cameraId !== id)
        console.log(filteredArray)
        setAddCameraMannullyArray(filteredArray)
    }

    const handleAddCameraManually = () => {
        let count = addCameraMannullyArray.length + 1
        let indexCount = addCameraMannullyArray.length
        setAddCameraMannullyArray([...addCameraMannullyArray, { ...initialDataMannullyArray, cameraId: count, index: indexCount }])

    }


    useEffect(() => {
        handleAddCameraManually()
    }, [])

    console.log('site_list', site_list)

    return (
        <div>

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


            {/* Choose MOdel */}
            <Modal
                open={isChooseMode}
                style={{ marginLeft: 'auto', marginRight: 'auto', height: '40%', width: '35%', top: '35%', }}
            >
                <div style={{ backgroundColor: 'white', borderRadius: '5px', height: '70%', }}>
                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <div style={{ backgroundColor: '#e22747', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
                                <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>CHOOSE MODE</p>
                                <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                    setIsChooseMode(false)
                                }} />
                            </div>
                        </Col>
                    </Row>

                    {
                        camera_scan_flag ?
                            <Row style={{ padding: '10px', alignItems: 'center', }}>
                                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                        <CircularProgress size={'30px'} style={{ color: 'blue' }} />
                                        <p>Scaning Cameras Please Wait...</p>
                                    </div>
                                </Col>
                            </Row>

                            :

                            <Row style={{ padding: '10px', display: "flex", justifyContent: 'space-around', alignItems: 'center', width: '100%', height: '70%' }}>
                                <Col xl={6} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                    <button onClick={() => {
                                        handleopeneuser_pass()
                                        setIsChooseMode(false)
                                    }}
                                        style={{ backgroundColor: '#e22747', color: 'white', border: 'none', borderRadius: '5px', width: '60%', padding: '5px', marginTop: '15px' }}
                                    >Auto</button>
                                </Col>

                                <Col xl={6} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                    <button onClick={() => {
                                        handleOpenMannualModel()
                                        setIsChooseMode(false)
                                    }}
                                        style={{ backgroundColor: '#e22747', color: 'white', border: 'none', borderRadius: '5px', width: '60%', padding: '5px', marginTop: '15px' }}
                                    >Manual</button>
                                </Col>

                            </Row>
                    }
                </div>
            </Modal>


            {/* Mannual Model */}
            <Modal
                open={isOpenMannualModel}
                // onClose={() => {
                //     setcamera_list_data([])
                //     setcamera_list_data1([])
                //     setcamera_scan_flag(false)
                //     count1 = 0
                //     count = 0
                //     for (let index = 0; index < intervals.length; index++) {
                //         clearInterval(intervals[index])
                //     }
                //     intervals = []
                //     handleCloseuser_pass()
                // }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ marginLeft: 'auto', marginRight: 'auto', height: 550, width: '50%', top: 20, }}
            >
                <div style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <div style={{ backgroundColor: '#e22747', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '30%', }} >
                                    <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>ADD CAMERA</p>
                                    <div onClick={handleAddCameraManually}
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <AddCircleOutlineIcon />
                                    </div>

                                </div>
                                <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                    setIsOpenMannualModel(false)
                                }} />
                            </div>
                        </Col>
                    </Row>

                    {
                        camera_scan_flag ?
                            <Row style={{ padding: '10px', alignItems: 'center', }}>
                                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                        <CircularProgress size={'30px'} style={{ color: 'blue' }} />
                                        <p>Scaning Cameras Please Wait...</p>
                                    </div>
                                </Col>
                            </Row>

                            :


                            <div>
                                <div style={{ overflowY: 'scroll', overflowX: 'hidden', maxHeight: '400px' }}>
                                    {
                                        addCameraMannullyArray.length >= 1 ?
                                            <div>
                                                {
                                                    addCameraMannullyArray.map((d, i) => (
                                                        <Row style={{ padding: '10px', alignItems: 'center', backgroundColor: 'white' }} key={i} >
                                                            {
                                                                addCameraMannullyArray.length > 1 ?
                                                                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                            <HighlightOffIcon style={{ color: '#e22747', cursor: 'pointer' }} onClick={() => handleCancelCameraBtn(d.cameraId)} />
                                                                        </div>
                                                                    </Col>
                                                                    : ''
                                                            }

                                                            <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                <div style={{ marginTop: '5px' }}>
                                                                    <p style={{ color: 'black', marginBottom: '5px' }}>Camera Name</p>
                                                                    <input type='text' placeholder='Enter Camera Name' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                        console.log(index)
                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                        let value = e.target.value
                                                                        filterArray.splice(index, 0, { ...findArray, name: value })
                                                                        setAddCameraMannullyArray(filterArray)
                                                                    }} value={d.name} ></input>
                                                                </div>
                                                            </Col>

                                                            <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                <div style={{ marginTop: '5px' }}>
                                                                    <p style={{ color: 'black', marginBottom: '5px' }}>Camera Id</p>
                                                                    <input type='text' placeholder='Enter Camera Id' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                        let value = e.target.value
                                                                        filterArray.splice(index, 0, { ...findArray, id: value })
                                                                        setAddCameraMannullyArray(filterArray)
                                                                    }} value={d.id} ></input>
                                                                </div>
                                                            </Col>

                                                            <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                <div style={{ marginTop: '5px' }}>
                                                                    <p style={{ color: 'black', marginBottom: '5px' }}>Device Id</p>
                                                                    <input type='text' placeholder='Enter Device Id' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                        console.log(index)
                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                        let value = e.target.value
                                                                        filterArray.splice(index, 0, { ...findArray, device_id: value })
                                                                        setAddCameraMannullyArray(filterArray)
                                                                    }} value={d.device_id} ></input>
                                                                </div>
                                                            </Col>

                                                            <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                <div style={{ marginTop: '5px' }}>
                                                                    <p style={{ color: 'black', marginBottom: '5px' }}>Ip Address</p>
                                                                    <input type='text' placeholder='Enter Ip Address' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                        let value = e.target.value
                                                                        filterArray.splice(index, 0, { ...findArray, ip_address: value })
                                                                        setAddCameraMannullyArray(filterArray)
                                                                    }} value={d.ip_address} ></input>
                                                                </div>
                                                            </Col>

                                                            <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                <div>
                                                                    <p style={{ color: 'black', marginTop: '15px', marginBottom: '5px' }}>Site</p>
                                                                    <div style={{ position: 'relative', zIndex: 2 }}>
                                                                        <p type='text' style={{ backgroundColor: '#e6e8eb', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'black' }} onClick={() => {
                                                                            setIsOpenMannualSiteOption(!isOpenMannualSiteOption)
                                                                            let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                            let index = addCameraMannullyArray.indexOf(findArray)
                                                                            let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                            filterArray.splice(index, 0, { ...findArray, flag: d.flag === true ? false : true })
                                                                            setAddCameraMannullyArray(filterArray)

                                                                        }}>{d.site.siteName === '' ? 'Select' : d.site.siteName}<span>
                                                                                {isOpenMannualSiteOption && d.flag ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                                                            </span></p>

                                                                    </div>




                                                                    {isOpenMannualSiteOption &&
                                                                        d.flag === true &&

                                                                        <div
                                                                            // id={`site${val}`} 
                                                                            style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', zIndex: 2, maxHeight: '150px', overflowY: 'scroll' }}
                                                                        >
                                                                            {
                                                                                site_list.length !== 0 ?
                                                                                    <div>
                                                                                        {
                                                                                            site_list.map((sites, siteIndex) => (

                                                                                                <div key={siteIndex} >
                                                                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                                        let editedData = {
                                                                                                            siteName: sites.site_name,
                                                                                                            siteId: sites._id
                                                                                                        }
                                                                                                        filterArray.splice(index, 0, { ...findArray, site: editedData, flag: d.flag === true ? false : true })
                                                                                                        setAddCameraMannullyArray(filterArray)

                                                                                                        setIsOpenMannualSiteOption(false)

                                                                                                    }}>{sites.site_name}</p>

                                                                                                    <hr></hr>
                                                                                                </div>
                                                                                            ))
                                                                                        }
                                                                                    </div>

                                                                                    :
                                                                                    <p style={{ padding: '0', margin: 0, color: 'black' }}>No Sites</p>
                                                                            }
                                                                        </div>
                                                                    }

                                                                </div>
                                                            </Col>

                                                            <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                <div>
                                                                    <p style={{ color: 'black', marginTop: '15px', marginBottom: '5px' }}>Active</p>
                                                                    <div style={{ position: 'relative' }}>
                                                                        <p type='text' style={{ backgroundColor: '#e6e8eb', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'black' }} onClick={() => {
                                                                            setIsOpenMannualActiveOption(!isOpenMannualActiveOption)
                                                                            let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                            let index = addCameraMannullyArray.indexOf(findArray)
                                                                            let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                            filterArray.splice(index, 0, { ...findArray, flag: d.flag === true ? false : true })
                                                                            setAddCameraMannullyArray(filterArray)

                                                                        }}>{d.active === '' ? 'Select' : d.active}<span>
                                                                                {isOpenMannualActiveOption && d.flag ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                                                            </span></p>


                                                                    </div>

                                                                    {isOpenMannualActiveOption && d.flag === true &&
                                                                        <div
                                                                            // id={`site${val}`} 
                                                                            style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', zIndex: 2, maxHeight: '150px', overflowY: 'scroll' }}>

                                                                            <div  >
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                    let index = addCameraMannullyArray.indexOf(findArray)
                                                                                    let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                    filterArray.splice(index, 0, { ...findArray, active: 'active', flag: d.flag === true ? false : true })
                                                                                    setAddCameraMannullyArray(filterArray)
                                                                                    setIsOpenMannualActiveOption(false)
                                                                                }}>Active</p>
                                                                                <hr></hr>
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                    let index = addCameraMannullyArray.indexOf(findArray)
                                                                                    let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                    filterArray.splice(index, 0, { ...findArray, active: 'Inactive', flag: d.flag === true ? false : true })
                                                                                    setAddCameraMannullyArray(filterArray)
                                                                                    setIsOpenMannualActiveOption(false)
                                                                                }}>Inactive</p>
                                                                                <hr></hr>
                                                                            </div>

                                                                        </div>
                                                                    }

                                                                </div>
                                                            </Col>

                                                            <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                <div style={{ marginTop: '5px' }}>
                                                                    <p style={{ color: 'black', marginBottom: '5px' }}>From Time</p>
                                                                    <input type='time' placeholder='Enter Client Id' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                        filterArray.splice(index, 0, { ...findArray, fromTime: e.target.value })
                                                                        setAddCameraMannullyArray(filterArray)
                                                                    }}

                                                                        value={d.fromTime}
                                                                    // value={d.fromTime === 0 ? `${12}:${50}` : d.fromTime}
                                                                    ></input>
                                                                </div>
                                                            </Col>


                                                            <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                <div style={{ marginTop: '5px' }}>
                                                                    <p style={{ color: 'black', marginBottom: '5px' }}>To Time</p>
                                                                    <input type='time' placeholder='Enter Client Id' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                        filterArray.splice(index, 0, { ...findArray, toTime: e.target.value })
                                                                        setAddCameraMannullyArray(filterArray)
                                                                    }}
                                                                        // value={d.toTime === 0 ? `${23}:${59}` : d.toTime}
                                                                        value={d.toTime}
                                                                    ></input>
                                                                </div>
                                                            </Col>

                                                            {/* <Col xl={4} lg={4} md={4} sm={12} xs={12}>

                                                                <div style={{ marginTop: '10px' }}>
                                                                    <p style={{ color: 'black' }}>Alert Notification</p>
                                                                    <div
                                                                        style={{
                                                                            backgroundColor: d.alertNotification == true ? '#e32747' : '#a8a4a4',
                                                                            width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex',
                                                                            justifyContent: d.alertNotification == true ? 'flex-end' : 'flex-start',
                                                                            alignItems: 'center', padding: '2px'
                                                                        }} onClick={() => {
                                                                            let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                            let index = addCameraMannullyArray.indexOf(findArray)
                                                                            let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                            filterArray.splice(index, 0, { ...findArray, alertNotification: d.alertNotification === true ? false : true })
                                                                            setAddCameraMannullyArray(filterArray)
                                                                        }}>
                                                                        <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                                                    </div>
                                                                </div>
                                                            </Col>

                                                            <Col xl={4} lg={4} md={4} sm={12} xs={12}>

                                                                <div style={{ marginTop: '10px' }}>
                                                                    <p style={{ color: 'black' }}>Analytic Alert</p>
                                                                    <div
                                                                        style={{
                                                                            backgroundColor: d.analyticAlert == true ? '#e32747' : '#a8a4a4',
                                                                            width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex',
                                                                            justifyContent: d.analyticAlert == true ? 'flex-end' : 'flex-start',
                                                                            alignItems: 'center', padding: '2px'
                                                                        }} onClick={() => {
                                                                            let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                            let index = addCameraMannullyArray.indexOf(findArray)
                                                                            let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                            filterArray.splice(index, 0, { ...findArray, analyticAlert: d.analyticAlert === true ? false : true })
                                                                            setAddCameraMannullyArray(filterArray)
                                                                        }}>
                                                                        <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                                                    </div>
                                                                </div>
                                                            </Col>

                                                            <Col xl={4} lg={4} md={4} sm={12} xs={12}>

                                                                <div style={{ marginTop: '10px' }}>
                                                                    <p style={{ color: 'black' }}>Cloud Recording</p>
                                                                    <div
                                                                        style={{
                                                                            backgroundColor: d.cloudRecording == true ? '#e32747' : '#a8a4a4',
                                                                            width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex',
                                                                            justifyContent: d.cloudRecording == true ? 'flex-end' : 'flex-start',
                                                                            alignItems: 'center', padding: '2px'
                                                                        }} onClick={() => {
                                                                            let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                            let index = addCameraMannullyArray.indexOf(findArray)
                                                                            let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                            filterArray.splice(index, 0, { ...findArray, cloudRecording: d.cloudRecording === true ? false : true })
                                                                            setAddCameraMannullyArray(filterArray)
                                                                        }}>
                                                                        <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                                                    </div>
                                                                </div>
                                                            </Col> */}



                                                            {
                                                                addCameraMannullyArray.length > 1 ?
                                                                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                        <div style={{ width: '100%', height: '3px', backgroundColor: '#e6e8eb', marginTop: '20px' }}></div>
                                                                    </Col>
                                                                    : ''
                                                            }
                                                        </Row>

                                                    ))
                                                }
                                            </div>
                                            :
                                            []
                                    }
                                </div>

                                <Row>
                                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <button style={{ backgroundColor: '#e22747', color: 'white', border: 'none', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', width: '100%', padding: '5px' }} onClick={() => {
                                            console.log("total Data, Add camera button clicked", addCameraMannullyArray)
                                            let forSwitchApiCall

                                            // Ckeck if the inputs are filled or not
                                            let checkFlag = false
                                            let camera_count = 0
                                            for (let check = 0; check < addCameraMannullyArray.length; check++) {
                                                if (addCameraMannullyArray[check].name !== '' && addCameraMannullyArray[check].id !== '' && addCameraMannullyArray[check].site !== '' && addCameraMannullyArray[check].active !== '') {
                                                    checkFlag = true
                                                } else {
                                                    checkFlag = false
                                                    break;
                                                }
                                            }


                                            // Creeate a device details for every device
                                            if (checkFlag) {
                                                addCameraMannullyArray.map((value) => {
                                                    const device_details = {
                                                        "dealer_id": (JSON.parse(localStorage.getItem("userData"))).dealer_id,
                                                        "user_id": (JSON.parse(localStorage.getItem("userData")))._id,
                                                        'device_id': value.device_id,
                                                        'camera_gereral_name': value.name,
                                                        "camera_id": value.id,
                                                        "site_id": value.site.siteId,
                                                        "from": value.fromTime,
                                                        "to": value.toTime,
                                                        "camera_username": (JSON.parse(localStorage.getItem("userData"))).User_name,
                                                        "password": (JSON.parse(localStorage.getItem("userData"))).password,
                                                        // 'notification_alert': value.alertNotification,
                                                        // "cloud_recording": value.cloudRecording,
                                                        "ip_address": value.ip_address,
                                                        // "analytics_alert": value.analyticAlert,
                                                        'created_date': moment(new Date()).format('YYYY-MM-DD'),
                                                        // 'updated_date': moment(new Date()).format('YYYY-MM-DD'),
                                                        'created_time': moment(new Date()).format('HH:MM:ss'),
                                                        // 'updated_time': moment(new Date()).format('HH:MM:ss'),
                                                        "Active": value.active === "active" ? 1 : 0,
                                                        "client_admin_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).client_admin_id,
                                                        "site_admin_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Site Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).site_admin_id,
                                                        "clientt_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).clientt_id,
                                                    };

                                                    const options = {
                                                        url: api.CAMERA_CREATION,
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                        },
                                                        data: JSON.stringify(device_details)
                                                    };

                                                    console.log("device_details", device_details)


                                                    // Api Call
                                                    axios(options)
                                                        .then(response => {
                                                            console.log(response.data)
                                                            // count1 = 0
                                                            // count = 0
                                                            camera_count = camera_count + 1

                                                            if (camera_count == addCameraMannullyArray.length) {
                                                                setflag(!flag)
                                                                // list_camera_site_id(selected_sites)
                                                                // setcamera_list_data([])
                                                                // setcamera_list_data1([])
                                                                setIsOpenMannualModel(false)
                                                                handleClose()
                                                                // get_camera_health()
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
                                            else {
                                                alert("Please fill out all required fields.")
                                            }


                                            // let count = true

                                            // camera_object.map((value) => {
                                            //     if (value.camera_name == "" && value.camera_id == '' && value.site.id == '' && value.ip_address.select !== "") {
                                            //         count = false
                                            //     }
                                            // })

                                            // if (count) {
                                            //     camera_object.map((value) => {
                                            //         const device_details = {
                                            //             "dealer_id": (JSON.parse(localStorage.getItem("userData"))).dealer_id,
                                            //             "user_id": (JSON.parse(localStorage.getItem("userData")))._id,
                                            //             'device_id': value.ip_address.device_id,
                                            //             'camera_gereral_name': value.camera_name,
                                            //             "camera_id": value.camera_id,
                                            //             "site_id": value.site.id,
                                            //             "from": value.from,
                                            //             "to": value.to,
                                            //             "camera_username": user_name,
                                            //             "password": password,
                                            //             'notification_alert': value.alert_noti,
                                            //             "cloud_recording": value.cloud,
                                            //             "ip_address": value.ip_address.select,
                                            //             "analytics_alert": value.analytic,
                                            //             'created_date': save_type == 'new_data' ? moment(new Date()).format('YYYY-MM-DD') : selectedcameras[0].created_date,
                                            //             'updated_date': moment(new Date()).format('YYYY-MM-DD'),
                                            //             'created_time': save_type == 'new_data' ? moment(new Date()).format('HH:MM:ss') : selectedcameras[0].updated_time,
                                            //             'updated_time': moment(new Date()).format('HH:MM:ss'),
                                            //             "Active": Number(value.active),
                                            //             "client_admin_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).client_admin_id,
                                            //             "site_admin_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Site Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).site_admin_id,
                                            //             "clientt_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).clientt_id,
                                            //         };

                                            //         const options = {
                                            //             url: save_type == 'new_data' ? api.CAMERA_CREATION : api.CAMERA_CREATION + value._id,
                                            //             method: save_type == 'new_data' ? 'POST' : 'PUT',
                                            //             headers: {
                                            //                 'Content-Type': 'application/json',
                                            //             },
                                            //             data: JSON.stringify(device_details)
                                            //         };

                                            //         console.log(device_details)

                                            //         axios(options)
                                            //             .then(response => {
                                            //                 console.log(response.data)
                                            //                 count1 = 0
                                            //                 count = 0
                                            //                 camera_count = camera_count + 1

                                            //                 if (camera_count == camera_object.length) {
                                            //                     setflag(!flag)
                                            //                     list_camera_site_id(selected_sites)
                                            //                     setcamera_list_data([])
                                            //                     setcamera_list_data1([])
                                            //                     handleCloseuser_pass()
                                            //                     handleClose()
                                            //                 }

                                            //             })
                                            //             .catch(function (e) {
                                            //                 if (e.message === 'Network Error') {
                                            //                     alert("No Internet Found. Please check your internet connection")
                                            //                 }
                                            //                 else {

                                            //                     alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                                            //                 }
                                            //             });
                                            //     })

                                            // }


                                            // else {

                                            //     alert("Please fill out all required fields.")

                                            // }


                                        }}>Add Camera</button>
                                    </Col>
                                </Row>
                            </div>
                    }
                </div>
            </Modal>




            {/* Auto Model */}
            <Modal
                open={username_pass_model}
                onClose={() => {
                    setcamera_list_data([])
                    setcamera_list_data1([])
                    setcamera_scan_flag(false)
                    count1 = 0
                    count = 0
                    for (let index = 0; index < intervals.length; index++) {
                        clearInterval(intervals[index])
                    }
                    intervals = []
                    handleCloseuser_pass()
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ marginLeft: 'auto', marginRight: 'auto', height: 550, width: '50%', top: 20, }}
            >
                <div style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <div style={{ backgroundColor: '#e22747', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
                                <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>ADD CAMERA USER NAME AND PASSWORD</p>
                                <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                    setcamera_list_data([])
                                    setcamera_list_data1([])
                                    setcamera_scan_flag(false)
                                    count1 = 0
                                    count = 0
                                    for (let index = 0; index < intervals.length; index++) {
                                        clearInterval(intervals[index])
                                    }
                                    intervals = []
                                    handleCloseuser_pass()
                                }} />
                            </div>
                        </Col>
                    </Row>

                    {
                        camera_scan_flag ?
                            <Row style={{ padding: '10px', alignItems: 'center', }}>
                                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                        <CircularProgress size={'30px'} style={{ color: 'blue' }} />
                                        <p>Scaning Cameras Please Wait...</p>
                                    </div>
                                </Col>
                            </Row>
                            :

                            <Row style={{ padding: '10px', alignItems: 'center', }}>
                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                    <div style={{ marginTop: '5px' }}>
                                        <p style={{ color: 'black', marginBottom: '5px' }}>User Name</p>
                                        <input type='text' placeholder='Enter User Name' value={user_name} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => { setuser_name(e.target.value) }}></input>
                                    </div>
                                </Col>

                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                    <div style={{ marginTop: '5px' }}>
                                        <p style={{ color: 'black', marginBottom: '5px' }}>Password</p>
                                        <input type='text' placeholder='Enter Password' value={password} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => { setpassword(e.target.value) }}></input>
                                    </div>
                                </Col>

                                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <button style={{ backgroundColor: '#e22747', color: 'white', border: 'none', borderRadius: '5px', width: '100%', padding: '5px', marginTop: '15px' }} onClick={() => {
                                        scan_camera()
                                    }}>Add</button>
                                </Col>
                            </Row>
                    }
                </div>
            </Modal>

            <Modal
                open={opencamera}
                onClose={() => {
                    setflag(!flag)
                    setcamera_list_data([])
                    setcamera_list_data1([])
                    handleCloseuser_pass()
                    handleClose()
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ marginLeft: 'auto', marginRight: 'auto', maxHeight: '80%', width: '50%', top: 20 }}
            >
                <div style={{ backgroundColor: 'grey', borderRadius: '5px', overflowX: 'hidden' }}>
                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <div style={{ backgroundColor: '#e22747', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
                                <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>Edit CAMERA</p>

                                <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                    setflag(!flag)
                                    setcamera_list_data([])
                                    setcamera_list_data1([])
                                    handleCloseuser_pass()
                                    handleClose()
                                }}></CloseIcon>


                                {/* <AddCircleOutlineIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                        camera_object.push({
                                            camera_name: '',
                                            camera_id: '',
                                            ip_address: { select: 'Select', device_id: '' },
                                            site: { select: group_list[site_ind].site_name, id: group_list[site_ind]._id },
                                            active: 0,
                                            cloud: 0,
                                            analytic: 0,
                                            alert_noti: 0,
                                            from: '00:00',
                                            to: '00:00'
                                        })
                                        setadd_camera_count([...add_camera_count, Number(add_camera_count.length)])
                                    }} /> */}


                            </div>
                        </Col>
                    </Row>

                    {
                        save_type != 'put_data' ?

                            <div style={{ overflowY: 'scroll', overflowX: 'hidden', maxHeight: '85vh' }}>
                                <Row style={{ padding: '10px', alignItems: 'center', backgroundColor: 'white' }}>

                                    {
                                        camera_list_data.map((val, i) => {
                                            return (
                                                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <div style={{ border: '1px solid grey', borderRadius: '5px', marginBottom: '10px' }}>
                                                        <div id={`cam${i}`}>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <img style={{ width: '100px', borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px' }} src={val.image_uri}></img>

                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginLeft: '5px', marginRight: '5px' }}>
                                                                    <div>
                                                                        <p style={{ marginBottom: '0px' }}>Manufacturer : {val.Manufacturer}</p>
                                                                        <p style={{ marginBottom: '0px' }}>IPAddress : {val.IPAddress}</p>
                                                                        {/* <p>Username : {val.Username}</p>
                                                                <p>Password : {val.Password}</p> */}
                                                                        <p style={{ marginBottom: '0px' }}>Device Id : {val.device_id}</p>
                                                                    </div>

                                                                    <div>

                                                                        <div id={`toggle${i}`} className='toggle' title='false' style={{ backgroundColor: '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '2px', cursor: 'pointer' }} onClick={() => {
                                                                            // settoggle(!toggle)

                                                                            let ele = document.getElementById(`toggle${i}`)
                                                                            let cam = document.getElementById(`cam${i}`)
                                                                            let cam_input = document.getElementById(`camera_input${i}`)

                                                                            if (ele.title == 'false') {
                                                                                camera_object[i] = {
                                                                                    camera_name: '',
                                                                                    camera_id: '',
                                                                                    ip_address: { select: val.IPAddress, device_id: val.device_id },
                                                                                    site: { select: 'Select', id: '' },
                                                                                    active: 0,
                                                                                    cloud: 0,
                                                                                    analytic: 0,
                                                                                    alert_noti: 0,
                                                                                    from: '00:00',
                                                                                    to: '00:00'
                                                                                }
                                                                                cam_input.style.display = 'block'
                                                                                cam.style.display = 'none'
                                                                            } else {
                                                                                let newdata = []
                                                                                camera_object.map((cam_obj, j) => {
                                                                                    if (j == i) {
                                                                                        newdata[i] = {
                                                                                            camera_name: '',
                                                                                            camera_id: '',
                                                                                            ip_address: { select: '', device_id: '' },
                                                                                            site: { select: 'Select', id: '' },
                                                                                            active: 0,
                                                                                            cloud: 0,
                                                                                            analytic: 0,
                                                                                            alert_noti: 0,
                                                                                            from: '00:00',
                                                                                            to: '00:00'
                                                                                        }
                                                                                    } else {
                                                                                        newdata.push(cam_obj)
                                                                                    }
                                                                                })

                                                                                const options = {
                                                                                    url: api.CAMERA_CREATION + camera_object[i].camera_id,
                                                                                    method: 'DELETE',
                                                                                    headers: {
                                                                                        'Content-Type': 'application/json',
                                                                                    },
                                                                                };

                                                                                console.log(options)

                                                                                axios(options)
                                                                                    .then(response => {
                                                                                        console.log(response.data)
                                                                                        ele.style.justifyContent = 'flex-start'
                                                                                        ele.style.backgroundColor = '#a8a4a4'
                                                                                        ele.title = 'false'
                                                                                        cam_input.style.display = 'none'
                                                                                        setcamera_object(newdata)
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
                                                                        }}>
                                                                            <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div id={`camera_input${i}`} style={{ display: 'none', padding: '5px' }}>
                                                            <Row>
                                                                <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                    <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                                                        <CloseIcon style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }} onClick={() => {
                                                                            let cam = document.getElementById(`cam${i}`)
                                                                            let cam_input = document.getElementById(`camera_input${i}`)

                                                                            let newdata = []
                                                                            camera_object.map((cam_obj, j) => {
                                                                                if (j == i) {
                                                                                    newdata[i] = {
                                                                                        camera_name: '',
                                                                                        camera_id: 'none',
                                                                                        ip_address: { select: '', device_id: '' },
                                                                                        site: { select: 'Select', id: '' },
                                                                                        active: 0,
                                                                                        cloud: 0,
                                                                                        analytic: 0,
                                                                                        alert_noti: 0,
                                                                                        from: '00:00',
                                                                                        to: '00:00'
                                                                                    }
                                                                                } else {
                                                                                    newdata.push(cam_obj)
                                                                                }
                                                                            })

                                                                            cam_input.style.display = 'none'
                                                                            cam.style.display = 'block'
                                                                            setcamera_object(newdata)

                                                                        }} />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Camera Name</p>

                                                                        <input type='text' placeholder='Enter Client Id' value={camera_object.length !== 0 && camera_object[i] !== undefined ? camera_object[i].camera_name : ''} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => { camera_object[i].camera_name = e.target.value; setcamera_name(e.target.value) }}></input>
                                                                    </div>
                                                                </Col>

                                                                {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Camera Id</p>
                                                                        <input type='text' placeholder='Enter Client Id' value={camera_object.length !== 0 && camera_object[i] !== undefined ? camera_object[i].camera_id : ''} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            camera_object[i].camera_id = e.target.value
                                                                            setcamera_id(e.target.value)
                                                                        }}></input>
                                                                    </div>
                                                                </Col> */}

                                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Site</p>
                                                                        <div style={{ position: 'relative', zIndex: 2 }}>
                                                                            <p type='text' style={{ backgroundColor: '#e6e8eb', color: camera_object[i].site.select != 'Select' ? 'black' : '#898989', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => {
                                                                                if (document.getElementById(`site${i}`).style.display !== 'none') {
                                                                                    document.getElementById(`site${i}`).style.display = 'none'
                                                                                } else {
                                                                                    document.getElementById(`site${i}`).style.display = 'block'
                                                                                }

                                                                            }}>{camera_object[i].site.select}<span><ArrowDropDownIcon /></span></p>

                                                                            <div id={`site${i}`} style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', maxHeight: '150px', overflowY: 'scroll' }}>
                                                                                {
                                                                                    site_list.length != 0 ?
                                                                                        site_list.map((siteval) => (
                                                                                            <div>
                                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                                    // let arr = []
                                                                                                    // site_list1.map((value) => {
                                                                                                    //     if (value._id !== siteval._id) {
                                                                                                    //         arr.push(value)
                                                                                                    //     }
                                                                                                    // })

                                                                                                    camera_object[i].site.select = siteval.site_name
                                                                                                    camera_object[i].site.id = siteval._id
                                                                                                    document.getElementById(`site${i}`).style.display = 'none'
                                                                                                    // let arr1 = []
                                                                                                    // for (let index = 0; index < arr.length; index++) {
                                                                                                    //     let flag = false
                                                                                                    //     let data = ''
                                                                                                    //     for (let index1 = 0; index1 < camera_object.length; index1++) {
                                                                                                    //         if (camera_object[index1].site.select == arr[index].site_name && camera_object[index1].site.id == arr[index]._id) {
                                                                                                    //             flag = false
                                                                                                    //             break
                                                                                                    //         } else {
                                                                                                    //             data = arr[index]
                                                                                                    //             flag = true
                                                                                                    //         }
                                                                                                    //     }

                                                                                                    //     if (flag) {
                                                                                                    //         arr1.push(data)
                                                                                                    //     }
                                                                                                    // }
                                                                                                    // setsite_list(arr1)
                                                                                                    setsite({ select: siteval.site_name, id: siteval._id })

                                                                                                }
                                                                                                }>{siteval.site_name}</p>
                                                                                                <hr></hr>
                                                                                            </div>
                                                                                        ))
                                                                                        :
                                                                                        <p style={{ padding: '0', margin: 0, color: 'black' }}>No Sites</p>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Col>

                                                                <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ marginTop: '5px' }}>
                                                                    <button style={{ backgroundColor: '#e22747', color: 'white', border: 'none', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', width: '100%', padding: '5px' }} onClick={() => {
                                                                        let cam_input = document.getElementById(`camera_input${i}`)
                                                                        let cam = document.getElementById(`cam${i}`)
                                                                        let ele = document.getElementById(`toggle${i}`)


                                                                        if (camera_object[i].camera_name != "" && camera_object[i].site.id != '') {
                                                                            const device_details = {
                                                                                "dealer_id": (JSON.parse(localStorage.getItem("userData"))).dealer_id,
                                                                                "user_id": (JSON.parse(localStorage.getItem("userData")))._id,
                                                                                'device_id': camera_object[i].ip_address.device_id,
                                                                                'camera_gereral_name': camera_object[i].camera_name,
                                                                                "camera_id": camera_object[i].camera_id,
                                                                                "site_id": camera_object[i].site.id,
                                                                                "from": camera_object[i].from,
                                                                                "to": camera_object[i].to,
                                                                                "camera_username": user_name,
                                                                                "password": password,
                                                                                'notification_alert': camera_object[i].alert_noti,
                                                                                "cloud_recording": camera_object[i].cloud,
                                                                                "ip_address": camera_object[i].ip_address.select,
                                                                                "analytics_alert": camera_object[i].analytic,
                                                                                'created_date': save_type == 'new_data' ? moment(new Date()).format('YYYY-MM-DD') : selectedcameras[0].created_date,
                                                                                'updated_date': moment(new Date()).format('YYYY-MM-DD'),
                                                                                'created_time': save_type == 'new_data' ? moment(new Date()).format('HH:MM:ss') : selectedcameras[0].updated_time,
                                                                                'updated_time': moment(new Date()).format('HH:MM:ss'),
                                                                                "Active": Number(camera_object[i].active),
                                                                                "client_admin_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).client_admin_id,
                                                                                "site_admin_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Site Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).site_admin_id,
                                                                                "clientt_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).clientt_id,
                                                                            };

                                                                            const options = {
                                                                                url: api.CAMERA_CREATION,
                                                                                method: 'POST',
                                                                                headers: {
                                                                                    'Content-Type': 'application/json',
                                                                                },
                                                                                data: JSON.stringify(device_details)
                                                                            };

                                                                            console.log(device_details)

                                                                            axios(options)
                                                                                .then(response => {
                                                                                    console.log(response.data)
                                                                                    camera_object[i] = { ...camera_object[i], camera_id: response.data._id }
                                                                                    cam_input.style.display = 'none'
                                                                                    cam.style.display = 'block'
                                                                                    ele.style.justifyContent = 'flex-end'
                                                                                    ele.style.backgroundColor = '#42cf10'
                                                                                    ele.title = 'true'
                                                                                })
                                                                                .catch(function (e) {
                                                                                    console.log(e);
                                                                                    if (e.message === 'Network Error') {
                                                                                        alert("No Internet Found. Please check your internet connection")
                                                                                    }
                                                                                    else {

                                                                                        alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                                                                                    }


                                                                                });
                                                                        } else {

                                                                            alert("Please fill out all required fields.")

                                                                        }
                                                                    }}>Add Camera</button>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                </Col>
                                            )
                                        })
                                    }

                                </Row>
                            </div>

                            :
                            <div>
                                <div style={{ overflowY: 'scroll', overflowX: 'hidden', maxHeight: '400px' }}>
                                    {
                                        add_camera_count.map((val) => (
                                            <Row style={{ padding: '10px', alignItems: 'center', backgroundColor: 'white' }}>
                                                {
                                                    add_camera_count.length > 1 ?
                                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                <HighlightOffIcon style={{ color: '#e22747', cursor: 'pointer' }} onClick={() => {
                                                                    let arr = []
                                                                    camera_object.map((camdata, i) => {
                                                                        if (i != val) {
                                                                            arr.push(camdata)
                                                                        }
                                                                    })
                                                                    let arr1 = []
                                                                    arr.map((ff, i) => {
                                                                        arr1.push(i)
                                                                    })
                                                                    setcamera_object(arr)
                                                                    setadd_camera_count(arr1)
                                                                }} />
                                                            </div>
                                                        </Col>
                                                        : ''
                                                }
                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                    <div style={{ marginTop: '5px' }}>
                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Camera Name</p>
                                                        <input type='text' placeholder='Enter Client Id' value={camera_object[val].camera_name} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => { camera_object[val].camera_name = e.target.value; setcamera_name(e.target.value) }}></input>
                                                    </div>
                                                </Col>

                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                    <div style={{ marginTop: '5px' }}>
                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Camera Id</p>
                                                        <input type='text' placeholder='Enter Client Id' value={camera_object[val].camera_id} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                            camera_object[val].camera_id = e.target.value
                                                            setcamera_id(e.target.value)
                                                        }}></input>
                                                    </div>
                                                </Col>

                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                    <div>
                                                        <p style={{ color: 'black', marginTop: '15px', marginBottom: '5px' }}>Site</p>
                                                        <div style={{ position: 'relative', zIndex: 2 }}>
                                                            <p type='text' style={{ backgroundColor: '#e6e8eb', color: camera_object[val].site.select != 'Select' ? 'black' : '#898989', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => {
                                                                if (document.getElementById(`site${val}`).style.display !== 'none') {
                                                                    document.getElementById(`site${val}`).style.display = 'none'
                                                                } else {
                                                                    document.getElementById(`site${val}`).style.display = 'block'
                                                                }

                                                            }}>{camera_object[val].site.select}<span><ArrowDropDownIcon /></span></p>

                                                            <div id={`site${val}`} style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', maxHeight: '150px', overflowY: 'scroll' }}>
                                                                {
                                                                    site_list.length != 0 ?
                                                                        site_list.map((siteval) => (
                                                                            <div>
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    // let arr = []
                                                                                    // site_list1.map((value) => {
                                                                                    //     if (value._id !== siteval._id) {
                                                                                    //         arr.push(value)
                                                                                    //     }
                                                                                    // })

                                                                                    camera_object[val].site.select = siteval.site_name
                                                                                    camera_object[val].site.id = siteval._id
                                                                                    // let arr1 = []
                                                                                    // for (let index = 0; index < arr.length; index++) {
                                                                                    //     let flag = false
                                                                                    //     let data = ''
                                                                                    //     for (let index1 = 0; index1 < camera_object.length; index1++) {
                                                                                    //         if (camera_object[index1].site.select == arr[index].site_name && camera_object[index1].site.id == arr[index]._id) {
                                                                                    //             flag = false
                                                                                    //             break
                                                                                    //         } else {
                                                                                    //             data = arr[index]
                                                                                    //             flag = true
                                                                                    //         }
                                                                                    //     }

                                                                                    //     if (flag) {
                                                                                    //         arr1.push(data)
                                                                                    //     }
                                                                                    // }
                                                                                    // setsite_list(arr1)
                                                                                    setsite({ select: siteval.site_name, id: siteval._id })

                                                                                }
                                                                                }>{siteval.site_name}</p>
                                                                                <hr></hr>
                                                                            </div>
                                                                        ))
                                                                        :
                                                                        <p style={{ padding: '0', margin: 0, color: 'black' }}>No Sites</p>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>

                                                {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                    <div>
                                                        <p style={{ color: 'black', }}>Ip Address</p>
                                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                                            <p type='text' style={{ backgroundColor: '#e6e8eb', color: camera_object[val].ip_address.select != 'Select' ? 'black' : '#898989', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => {
                                                                if (document.getElementById(`ip${val}`).style.display !== 'none') {
                                                                    document.getElementById(`ip${val}`).style.display = 'none'
                                                                } else {
                                                                    document.getElementById(`ip${val}`).style.display = 'block'
                                                                }

                                                            }}>{camera_object[val].ip_address.select}<span><ArrowDropDownIcon /></span></p>

                                                            <div id={`ip${val}`} style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', maxHeight: '150px', overflowY: 'scroll' }}>
                                                                {
                                                                    camera_list_data.length != 0 ?
                                                                        camera_list_data.map((camvalue) => (
                                                                            <div>
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let arr = []
                                                                                    camera_list_data1.map((value) => {
                                                                                        if (value.IPAddress !== camvalue.IPAddress) {
                                                                                            arr.push(value)
                                                                                        }
                                                                                    })
                                                                                    camera_object[val].ip_address.select = camvalue.IPAddress
                                                                                    camera_object[val].ip_address.device_id = camvalue.device_id
                                                                                    let arr1 = []
                                                                                    for (let index = 0; index < arr.length; index++) {
                                                                                        let flag = false
                                                                                        let data = ''
                                                                                        for (let index1 = 0; index1 < camera_object.length; index1++) {
                                                                                            if (camera_object[index1].ip_address.select == arr[index].IPAddress && camera_object[index1].ip_address.device_id == arr[index].device_id) {
                                                                                                flag = false
                                                                                                break
                                                                                            } else {
                                                                                                data = arr[index]
                                                                                                flag = true
                                                                                            }
                                                                                        }

                                                                                        if (flag) {
                                                                                            arr1.push(data)
                                                                                        }
                                                                                    }

                                                                                    setcamera_list_data(arr)
                                                                                    setip_address({ select: camvalue.IPAddress, device_id: camvalue.device_id, })

                                                                                }}>{camvalue.IPAddress}</p>
                                                                                <hr></hr>
                                                                            </div>
                                                                        ))
                                                                        :
                                                                        <p style={{ padding: '0', margin: 0, color: 'black' }}>No Cameras</p>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>


                                                </Col> */}

                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                    <div style={{ marginTop: '5px' }}>
                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Active</p>
                                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                                            <p type='text' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => {
                                                                if (document.getElementById(`active${val}`).style.display !== 'none') {
                                                                    document.getElementById(`active${val}`).style.display = 'none'
                                                                } else {
                                                                    document.getElementById(`active${val}`).style.display = 'block'
                                                                }

                                                            }}>{camera_object[val].active == 0 ? 'Active' : 'Inactive'}<span><ArrowDropDownIcon /></span></p>

                                                            <div id={`active${val}`} style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', }}>
                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer', color: active == 0 ? 'blue' : '' }} onClick={() => {
                                                                    document.getElementById(`active${val}`).style.display = 'none'
                                                                    camera_object[val].active = 0
                                                                    setactive(0)
                                                                }}>Active</p>
                                                                <hr></hr>
                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer', color: active == 1 ? 'blue' : '' }} onClick={() => {
                                                                    document.getElementById(`active${val}`).style.display = 'none'
                                                                    camera_object[val].active = 1
                                                                    setactive(1)
                                                                }}>Inactive</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                    <div style={{ marginTop: '5px' }}>
                                                        <p style={{ color: 'black', marginBottom: '5px' }}>From Time</p>
                                                        <input type='time' placeholder='Enter Client Id' value={camera_object[val].from} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                            camera_object[val].from = e.target.value
                                                            setcamera_id(e.target.value)
                                                        }}></input>
                                                    </div>
                                                </Col>

                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                    <div style={{ marginTop: '5px' }}>
                                                        <p style={{ color: 'black', marginBottom: '5px' }}>To Time</p>
                                                        <input type='time' placeholder='Enter Client Id' value={camera_object[val].to} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                            camera_object[val].to = e.target.value
                                                            setcamera_id(e.target.value)
                                                        }}></input>
                                                    </div>
                                                </Col>

                                                <Col xl={4} lg={4} md={4} sm={12} xs={12}>

                                                    <div style={{ marginTop: '10px' }}>
                                                        <p style={{ color: 'black' }}>Alert Notification</p>
                                                        <div style={{ backgroundColor: camera_object[val].alert_noti == true ? '#e32747' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: camera_object[val].alert_noti == true ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }} onClick={() => {
                                                            camera_object[val].alert_noti = !camera_object[val].alert_noti
                                                            setalert_noti(!alert_noti)

                                                        }}>
                                                            <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                                    <div style={{ marginTop: '10px' }}>
                                                        <p style={{ color: 'black' }}>Analytic Alert</p>
                                                        <div style={{ backgroundColor: camera_object[val].analytic == true ? '#e32747' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: camera_object[val].analytic == true ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }} onClick={() => {
                                                            camera_object[val].analytic = !camera_object[val].analytic
                                                            setanalytic(!analytic)

                                                        }}>
                                                            <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col xl={4} lg={4} md={4} sm={12} xs={12}>

                                                    <div style={{ marginTop: '10px' }}>
                                                        <p style={{ color: 'black' }}>Cloud Recording</p>
                                                        <div style={{ backgroundColor: camera_object[val].cloud == true ? '#e32747' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: camera_object[val].cloud == true ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }} onClick={() => {
                                                            camera_object[val].cloud = !camera_object[val].cloud
                                                            setcloud(!cloud)

                                                        }}>
                                                            <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                                        </div>
                                                    </div>
                                                </Col>

                                                {
                                                    add_camera_count.length > 1 ?
                                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                            <div style={{ width: '100%', height: '2px', backgroundColor: '#e6e8eb', marginTop: '20px' }}></div>
                                                        </Col>
                                                        : ''
                                                }
                                            </Row>
                                        ))
                                    }
                                </div>

                                <Row>
                                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <button style={{ backgroundColor: '#e22747', color: 'white', border: 'none', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', width: '100%', padding: '5px' }} onClick={() => {
                                            let count = true
                                            let camera_count = 0
                                            camera_object.map((value) => {
                                                if (value.camera_name == "" && value.camera_id == '' && value.site.id == '' && value.ip_address.select !== "") {
                                                    count = false
                                                }
                                            })

                                            if (count) {
                                                camera_object.map((value, i) => {
                                                    const device_details = {
                                                        "dealer_id": (JSON.parse(localStorage.getItem("userData"))).dealer_id,
                                                        "user_id": (JSON.parse(localStorage.getItem("userData")))._id,
                                                        'device_id': value.ip_address.device_id,
                                                        'camera_gereral_name': value.camera_name,
                                                        "camera_id": value.camera_id,
                                                        "site_id": value.site.id,
                                                        "from": value.from,
                                                        "to": value.to,
                                                        "camera_username": selectedcameras[i].user_name,
                                                        "password": selectedcameras[i].password,
                                                        'notification_alert': value.alert_noti,
                                                        "cloud_recording": value.cloud,
                                                        "ip_address": value.ip_address.select,
                                                        "analytics_alert": value.analytic,
                                                        'created_date': save_type == 'new_data' ? moment(new Date()).format('YYYY-MM-DD') : selectedcameras[i].created_date,
                                                        'updated_date': moment(new Date()).format('YYYY-MM-DD'),
                                                        'created_time': save_type == 'new_data' ? moment(new Date()).format('HH:MM:ss') : selectedcameras[i].updated_time,
                                                        'updated_time': moment(new Date()).format('HH:MM:ss'),
                                                        "Active": Number(value.active),
                                                        "client_admin_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).client_admin_id,
                                                        "site_admin_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Site Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).site_admin_id,
                                                        "clientt_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).clientt_id,
                                                    };

                                                    const options = {
                                                        url: save_type == 'new_data' ? api.CAMERA_CREATION : api.CAMERA_CREATION + selectedcameras[i]._id,
                                                        method: save_type == 'new_data' ? 'POST' : 'PUT',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                        },
                                                        data: JSON.stringify(device_details)
                                                    };

                                                    axios(options)
                                                        .then(response => {
                                                            console.log(response.data)
                                                            count1 = 0
                                                            count = 0
                                                            camera_count = camera_count + 1

                                                            if (camera_count == camera_object.length) {
                                                                setflag(!flag)
                                                                setselectedcameras([])
                                                                setcamera_list_data([])
                                                                setcamera_list_data1([])
                                                                handleCloseuser_pass()
                                                                handleClose()
                                                            }

                                                        })
                                                        .catch(function (e) {
                                                            console.log(e);
                                                            if (e.message === 'Network Error') {
                                                                alert("No Internet Found. Please check your internet connection")
                                                            }
                                                            else {

                                                                alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                                                            }

                                                        });
                                                })

                                            }


                                            else {

                                                alert("Please fill out all required fields.")

                                            }
                                        }}>Add Camera</button>
                                    </Col>
                                </Row>
                            </div>
                    }
                </div>
            </Modal >


            {/* Delete tag model */}
            <Modal
                open={opendelete}
                onClose={handleClosedelete}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <div style={{ backgroundColor: 'white', width: '80%', borderRadius: '5px' }}>
                    <Row style={{ padding: '10px', alignItems: 'center' }}>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <input type='text' placeholder='Search tag' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginRight: '20px' }}></input>

                            <CloseIcon style={{ fontSize: '15px', color: 'black', cursor: 'pointer' }} onClick={() => {
                                handleClosedelete()
                            }} />
                        </Col>
                        <Col>
                            <hr></hr>
                        </Col>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex' }}>
                            {flag_type === 'delete_tag' ?
                                // {
                                get_tag_full_data.map((val) => (
                                    <p style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '5px', borderRadius: '20px', border: '1px solid gray', marginRight: '20px', display: 'inline-block', fontSize: '15px' }}> {val.tag_name} <CloseIcon style={{ color: 'black', fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                        const axios = require('axios');
                                        let config = {
                                            method: 'Delete',
                                            maxBodyLength: Infinity,
                                            url: flag_type === 'delete_tag' ? api.TAG_API_CREATE + val._id : api.GROUP_API_CREATE + val._id,
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                        };

                                        axios.request(config)
                                            .then((response) => {
                                                console.log(response.data);
                                                get_tag_full_list()
                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            })
                                    }} /></p>
                                ))
                                // }
                                :
                                // {
                                get_tag_full_data.map((val) => (
                                    <p style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '5px', borderRadius: '20px', border: '1px solid gray', marginRight: '20px', display: 'inline-block', fontSize: '15px' }}> {val.group_name} <CloseIcon style={{ color: 'black', fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                        const axios = require('axios');
                                        let config = {
                                            method: 'Delete',
                                            maxBodyLength: Infinity,
                                            // url: flag_type === 'delete_tag' ? api.TAG_API_CREATE + val._id : api.GROUP_API_CREATE + val._id,
                                            url: api.GROUP_API_CREATE + val._id,
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                        };

                                        axios.request(config)
                                            .then((response) => {
                                                console.log(response.data);
                                                get_tag_full_list()
                                                get_group_full_list()
                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            })
                                    }} /></p>
                                ))
                                // }
                            }
                        </Col>
                    </Row>
                </div>
            </Modal>


            {/* Create group and tag model */}
            <Modal
                open={open1}
                onClose={() => {
                    camera_list_image = []
                    handleClose1()
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ marginLeft: 'auto', marginRight: 'auto', height: 550, width: '90%', top: 20 }}
            >
                <div>
                    <Row>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <div>
                                <div style={{ backgroundColor: 'white', borderRadius: '5px', paddingTop: '10px', height: 550, maxHeight: 550, overflowY: 'scroll' }}>
                                    <Row style={{ padding: '10px', alignItems: 'center' }}>
                                        <Col xl={6} lg={6} md={6} sm={12} xs={12} style={{ display: 'flex' }}>

                                            <div style={{ position: 'relative' }}>
                                                <button className='eventbtn' onClick={() => {
                                                    setcreate_tag(!create_tag)
                                                }} style={{ display: 'flex', backgroundColor: create_tag ? '#e32747' : '#e6e8eb', color: create_tag ? 'white' : 'black' }}> <TuneOutlinedIcon style={{ marginRight: '10px' }} />{flag_type === 'add_tag' ? 'Create Tag' : 'Create Group'}<ArrowDropDownIcon style={{ marginLeft: '10px' }} /></button>

                                                <div>
                                                    <div style={{ borderRadius: '5px', backgroundColor: '#181828', padding: '10px', position: 'absolute', top: '60px', zIndex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', display: create_tag ? 'block' : 'none' }}>
                                                        <div style={{ position: 'relative' }}>

                                                            <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: '-37px' }} />
                                                            <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                                                    <CloseIcon style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }} onClick={() => {
                                                                        setcreate_tag(false)
                                                                    }} />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '5px' }}>{flag_type === 'add_tag' ? 'Create Tag' : 'Create Group'}</p>
                                                                <input type='text' value={tag_name} placeholder={flag_type === 'add_tag' ? 'Enter tag name' : 'Enter Groupp name'} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray' }} onChange={(e) => {
                                                                    settag_name(e.target.value)
                                                                }}></input>
                                                            </div>

                                                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                <button style={{ backgroundColor: '#e32747', color: 'white', padding: '10px', borderRadius: '15px', border: 'none', marginTop: '10px' }} onClick={() => {
                                                                    const axios = require('axios');
                                                                    let data = flag_type === 'add_tag' ? JSON.stringify({
                                                                        'tag_name': tag_name,
                                                                        "user_id": userData._id
                                                                    })
                                                                        :
                                                                        JSON.stringify({
                                                                            'group_name': tag_name,
                                                                            "user_id": userData._id
                                                                        });

                                                                    let config = {
                                                                        method: 'post',
                                                                        maxBodyLength: Infinity,
                                                                        url: flag_type === 'add_tag' ? api.TAG_API_CREATE : api.GROUP_API_CREATE,
                                                                        headers: {
                                                                            'Content-Type': 'application/json'
                                                                        },
                                                                        data: data
                                                                    };

                                                                    console.log(config);

                                                                    axios.request(config)
                                                                        .then((response) => {
                                                                            console.log(JSON.stringify(response.data));
                                                                            get_tag_list()
                                                                            settag_name('')
                                                                            settag_list([])
                                                                            setcreate_tag(!create_tag)
                                                                            get_group_full_list()
                                                                        })
                                                                        .catch((error) => {
                                                                            console.log(error);
                                                                        })
                                                                }}>{flag_type === 'add_tag' ? 'Add Tag' : 'Add Group'}</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ position: 'relative' }}>

                                                <button style={{ backgroundColor: '#e32747', color: 'white', padding: '10px', borderRadius: '20px', border: '1px solid gray', }} onClick={() => {
                                                    settag_btn(!tag_btn)
                                                }}><TuneOutlinedIcon style={{ marginRight: '10px' }} />{flag_type === 'add_tag' ? 'Add Tag' : 'Add Group'}</button>

                                                <div>
                                                    <div style={{ borderRadius: '5px', backgroundColor: '#181828', padding: '10px', position: 'absolute', top: '60px', zIndex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', display: tag_btn ? 'block' : 'none', width: '300px' }}>
                                                        <div style={{ position: 'relative' }}>

                                                            <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: '-37px' }} />
                                                            <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                                                    <CloseIcon style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }} onClick={() => {
                                                                        settag_btn(false)
                                                                    }} />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                {console.log("tag_list", tag_list)}
                                                                {

                                                                    tag_list.length === 0 ?
                                                                        <div>
                                                                            <p style={{ color: 'grey', fontSize: '12px', margin: 0, marginRight: '10px', cursor: 'pointer', padding: '5px', textAlign: 'center' }}>{flag_type === 'add_tag' ? 'NO Tags' : 'No Groups'}</p>
                                                                        </div>
                                                                        :
                                                                        tag_list.map((value, num) => (
                                                                            <div onClick={() => {
                                                                                const axios = require('axios');
                                                                                let count = 0
                                                                                let fulldata = []
                                                                                let ids = []
                                                                                selectedcameras.map((val, i) => {

                                                                                    let config = {
                                                                                        method: 'put',
                                                                                        maxBodyLength: Infinity,
                                                                                        url: api.CAMERA_CREATION + val._id,
                                                                                        headers: {
                                                                                            'Content-Type': 'application/json'
                                                                                        },
                                                                                        data: flag_type === 'add_tag' ? { camera_tags: [...val.camera_tags, { name: value.tag_name, id: value._id }] } : { camera_groups: [...val.camera_groups, { name: value.group_name, id: value._id }] }
                                                                                    };

                                                                                    axios.request(config)
                                                                                        .then((response) => {
                                                                                            console.log(JSON.stringify(response.data));
                                                                                            fulldata.push(response.data)
                                                                                            ids.push(response.data._id)
                                                                                            count = count + 1
                                                                                            flag_type === 'add_tag' ? selectedcameras[i].camera_tags = [...val.camera_tags, { name: value.tag_name, id: value._id }] : selectedcameras[i].camera_groups = [...val.camera_groups, { name: value.group_name, id: value._id }]

                                                                                            if (count === selectedcameras.length) {

                                                                                                let config = {
                                                                                                    method: 'put',
                                                                                                    maxBodyLength: Infinity,
                                                                                                    url: flag_type === 'add_tag' ? api.TAG_API_CREATE + value._id : api.GROUP_API_CREATE + value._id,
                                                                                                    headers: {
                                                                                                        'Content-Type': 'application/json'
                                                                                                    },
                                                                                                    data: flag_type === 'add_tag' ? { tags: [...value.tags, ...ids] } : { groups: [...value.groups, ...ids] }
                                                                                                };

                                                                                                axios.request(config)
                                                                                                    .then((response) => {
                                                                                                        console.log(JSON.stringify(response.data));
                                                                                                        get_tag_list()
                                                                                                        settag_list_names((old) => {
                                                                                                            return [...old, val]
                                                                                                        })
                                                                                                        dispatch({ type: SELECTED_CAMERAS, value: fulldata })
                                                                                                    })
                                                                                                    .catch((error) => {
                                                                                                        console.log(error);
                                                                                                    })
                                                                                            }


                                                                                        })
                                                                                        .catch((error) => {
                                                                                            console.log(error);
                                                                                        })
                                                                                })
                                                                            }}>
                                                                                <p style={{ color: 'white', fontSize: '12px', margin: 0, marginRight: '10px', cursor: 'pointer', padding: '5px' }}>{flag_type === 'add_tag' ? value.tag_name : value.group_name}</p>
                                                                            </div>
                                                                        ))
                                                                }

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div></Col>
                                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                <CloseIcon style={{ color: 'black', cursor: 'pointer' }} onClick={() => handleClose1()} />
                                            </div>
                                        </Col>

                                    </Row>

                                    <Row style={{ padding: '10px', alignItems: 'center' }}>
                                        <Col>
                                            <hr></hr>
                                        </Col>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex' }}>

                                            {
                                                tag_list_names.map((val) => (
                                                    <p style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '5px', borderRadius: '20px', border: '1px solid gray', marginRight: '20px', display: 'inline-block', fontSize: '15px' }}> {val.name} <CloseIcon style={{ color: 'black', fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                                        const axios = require('axios');
                                                        let count = 0
                                                        let fulldata = []
                                                        let arr = []
                                                        let ids = val.tags
                                                        tag_list_names.map((tag_list) => {
                                                            if (val.id !== tag_list.id) {
                                                                arr.push(tag_list)
                                                            }
                                                        })


                                                        selectedcameras.map((tags, i) => {

                                                            let config = {
                                                                method: 'put',
                                                                maxBodyLength: Infinity,
                                                                url: api.CAMERA_CREATION + tags._id,
                                                                headers: {
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                data: flag_type === 'add_tag' ? { camera_tags: arr } : { camera_groups: arr }
                                                            };

                                                            axios.request(config)
                                                                .then((response) => {
                                                                    console.log(response.data);
                                                                    fulldata.push(response.data)
                                                                    let newdata = []
                                                                    ids.map((val) => {
                                                                        if (val !== response.data._id) {
                                                                            newdata.push(val)
                                                                        }
                                                                    })
                                                                    ids = newdata
                                                                    count = count + 1
                                                                    flag_type === 'add_tag' ? selectedcameras[i].camera_tags = arr : selectedcameras[i].camera_groups = arr
                                                                    if (count === selectedcameras.length) {

                                                                        let config = {
                                                                            method: 'put',
                                                                            maxBodyLength: Infinity,
                                                                            url: flag_type === 'add_tag' ? api.TAG_API_CREATE + val.id : api.GROUP_API_CREATE + val.id,
                                                                            headers: {
                                                                                'Content-Type': 'application/json'
                                                                            },
                                                                            data: flag_type === 'add_tag' ? { tags: ids } : { groups: ids }
                                                                        };

                                                                        axios.request(config)
                                                                            .then((response) => {
                                                                                console.log(JSON.stringify(response.data));
                                                                                get_tag_list()
                                                                                settag_list_names((old) => {
                                                                                    return [...old, val]
                                                                                })
                                                                                dispatch({ type: SELECTED_CAMERAS, value: fulldata })
                                                                            })
                                                                            .catch((error) => {
                                                                                console.log(error);
                                                                            })
                                                                    }


                                                                })
                                                                .catch((error) => {
                                                                    console.log(error);
                                                                })
                                                        })
                                                    }} /></p>
                                                ))
                                            }
                                        </Col>
                                    </Row>

                                    <Row style={{ padding: '10px', alignItems: 'center' }}>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <table style={{ width: '100%', backgroundColor: 'white' }}>
                                                <tr style={{ backgroundColor: '#e6e8eb', color: 'black' }}>
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
                                                {
                                                    selectedcameras.map((val, i) => {

                                                        return (
                                                            <tr style={{ borderBottom: '1px solid grey', color: 'black' }}>
                                                                <td style={{ padding: '15px' }}><img id={`dash_image${i + 1}`} width={150} height={100} src={camera_list_image[i]}></img></td>
                                                                <td style={{ padding: '15px' }}>{val.camera_gereral_name}</td>
                                                                <td style={{ padding: '15px' }}>{val.camera_username}</td>
                                                                <td style={{ padding: '15px', color: val.permission_level == 'All' ? '#1ee01e' : 'red' }}>{val.permission_level}</td>
                                                                <td style={{ padding: '15px', color: val.camera_health == 'Online' ? '#1ee01e' : 'red' }}>{val.camera_health}</td>
                                                                <td style={{ padding: '15px' }}>{val.ip_address}</td>
                                                                {/* <td style={{ padding: '15px' }}>CAgxrx</td> */}
                                                                <td style={{ padding: '15px', color: val.cloud_recording == 0 ? 'Red' : '#1ee01e' }}>{val.cloud_recording == 0 ? 'Off' : 'On'}</td>
                                                                <td style={{ padding: '15px' }}>{val.recording_mode == 0 ? 'Motion triggered' : '24/7 Continuous'}</td>
                                                                <td style={{ padding: '15px', color: val.analytics_alert == 0 ? 'Red' : '#1ee01e' }}>{val.analytics_alert == 0 ? 'Off' : 'On'}</td>
                                                                <td style={{ padding: '15px' }}>{val.device_id}</td>
                                                                <td style={{ padding: '15px', color: val.camera_tags.length == 0 ? '#E7E7E7' : 'black' }}>{
                                                                    val.camera_tags.length !== 0 ?
                                                                        val.camera_tags.map((val) => (
                                                                            val.name
                                                                        ))
                                                                        : 'No Tags'
                                                                }</td>

                                                                <td style={{ padding: '15px', color: val.camera_groups.length == 0 ? '#E7E7E7' : 'black' }}>{
                                                                    val.camera_groups.length !== 0 ?
                                                                        val.camera_groups.map((val) => (
                                                                            val.name
                                                                        ))
                                                                        : 'No Groups'
                                                                }</td>
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


            <Row>
                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                    <div >

                        <div style={{ backgroundColor: 'white', borderRadius: '5px', paddingTop: '10px' }}>
                            <Row style={{ padding: '10px', alignItems: 'center' }}>

                                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                    {
                                        skeleton != "" ?
                                            (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <div>
                                                        <input type='text' placeholder='Searchhh' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginRight: '20px' }} value={top_camera_search} onChange={(e) => {
                                                            if (e.target.value !== '') {
                                                                searchfunction(e.target.value, cameras_search, 'camera_search')
                                                                settop_camera_search(e.target.value)
                                                            } else {
                                                                setcameras_view(cameras_search)
                                                                console.log(cameras_search);
                                                                settop_camera_search(e.target.value)
                                                            }
                                                        }}></input>

                                                        <button style={{ backgroundColor: filter ? '#e22747' : '#e6e8eb', color: filter ? 'white' : 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginRight: '20px' }} onClick={() => {
                                                            setfilter(!filter)
                                                            get_tag_full_list1()
                                                            get_group_full_list()
                                                            setcamera_box(false)
                                                            setcamera_tag(false)
                                                            setcamera_group(false)
                                                            setonline_status(false)
                                                        }}> <TuneOutlinedIcon style={{ marginRight: '10px' }} />Filter</button>

                                                        <button style={{ backgroundColor: '#e22747', color: 'white', padding: '10px', borderRadius: '20px', border: '1px solid gray', }} onClick={() => {
                                                            if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                                                                let access = userData.operation_type.filter((val) => { return val == 'Create' || val == 'All' })
                                                                if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Create' || access[1] == 'Create') {
                                                                    handleUserChooseMode()
                                                                } else {
                                                                    setalert_box(true)
                                                                    setalert_text('Your access level does not allow you to download videos.')
                                                                }
                                                                setsave_type('new_data')
                                                            } else {
                                                                let cam_name = ''
                                                                let count = true
                                                                selectedcameras.map((val) => {
                                                                    userData.site_id.map((value) => {
                                                                        let access = value.type.filter((val) => { return val == 'Create' || val == 'All' })
                                                                        if (val.site_id == value.id) {
                                                                            if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Create' || access[1] == 'Create') {
                                                                                count = false
                                                                            } else {
                                                                                cam_name = `${cam_name} ${val.camera_gereral_name}`
                                                                            }
                                                                        }
                                                                    })

                                                                })

                                                                if (count) {
                                                                    handleopeneuser_pass()
                                                                } else {
                                                                    setalert_box(true)
                                                                    setalert_text(`Your access level does not allow you to download these (${cam_name}) videos.`)

                                                                }
                                                                setsave_type('new_data')
                                                            }
                                                        }}> <CameraAltOutlinedIcon style={{ marginRight: '10px' }} />Add Cameras</button>
                                                    </div>

                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <p style={{ color: 'black', fontSize: '20px', margin: 0, marginRight: '10px' }}>{selectedcameras.length} / {cameras.length} Selected</p>
                                                        <div style={{ position: 'relative' }}>
                                                            <button style={{ backgroundColor: actionClick ? '#181828' : '#e6e8eb', color: actionClick ? 'white' : 'black', padding: '10px', borderRadius: '20px', border: 'none', }} onClick={() => {
                                                                setactionClick(!actionClick)
                                                            }}>Action</button>

                                                            <div style={{ display: actionClick ? 'block' : 'none' }}>
                                                                <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: 32, left: 15 }} />

                                                                <div style={{ position: 'absolute', top: 60, bottom: 0, left: -230, right: 0, width: '300px', zIndex: 2 }}>
                                                                    <div style={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', borderRadius: '5px', backgroundColor: '#181828' }}>
                                                                        <p style={{ color: 'white', fontSize: '15px', margin: 0, marginRight: '10px', cursor: 'pointer', padding: '15px' }} onClick={() => {
                                                                            if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                                                                                let access = userData.operation_type.filter((val) => { return val == 'Edit' || val == 'All' })
                                                                                if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Edit' || access[1] == 'Edit') {
                                                                                    if (selectedcameras.length != 0) {
                                                                                        let cam_obj = []
                                                                                        let cam_count = []
                                                                                        console.log(site_list1);
                                                                                        console.log(selectedcameras);
                                                                                        selectedcameras.map((val) => {
                                                                                            let str = 'Select'
                                                                                            site_list1.map((value) => {
                                                                                                if (val.site_id == value._id) {
                                                                                                    str = value.site_name
                                                                                                }
                                                                                            })
                                                                                            cam_obj.push({
                                                                                                camera_name: val.camera_gereral_name,
                                                                                                camera_id: val.camera_id,
                                                                                                ip_address: { select: val.ip_address, device_id: val.device_id },
                                                                                                site: { select: str, id: val.site_id },
                                                                                                active: val.Active,
                                                                                                cloud: val.cloud_recording,
                                                                                                analytic: val.analytics_alert,
                                                                                                alert_noti: val.notification_alert,
                                                                                                from: val.from,
                                                                                                to: val.to
                                                                                            })
                                                                                            cam_count = [...cam_count, Number(cam_count.length)]
                                                                                        })
                                                                                        setadd_camera_count(cam_count)
                                                                                        setcamera_object(cam_obj)
                                                                                        setsave_type('put_data')
                                                                                        // handleopeneuser_pass()
                                                                                        handleOpen2()

                                                                                    } else {
                                                                                        alert('Select Cameras to Edit')
                                                                                    }
                                                                                } else {
                                                                                    setalert_box(true)
                                                                                    setalert_text('Your access level does not allow you to download videos.')

                                                                                }
                                                                            } else {
                                                                                let cam_name = ''
                                                                                let count = true
                                                                                selectedcameras.map((val) => {
                                                                                    userData.site_id.map((value) => {
                                                                                        let access = value.type.filter((val) => { return val == 'Edit' || val == 'All' })
                                                                                        if (val.site_id == value.id) {
                                                                                            if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Edit' || access[1] == 'Edit') {
                                                                                                count = false
                                                                                            } else {
                                                                                                cam_name = `${cam_name} ${val.camera_gereral_name}`
                                                                                            }
                                                                                        }
                                                                                    })

                                                                                })

                                                                                if (count) {
                                                                                    if (selectedcameras.length != 0) {
                                                                                        selectedcameras.map((val) => {
                                                                                            let str = 'Select'
                                                                                            site_list1.map((value) => {
                                                                                                if (val.site_id == value.site_id) {
                                                                                                    str = value.site_name
                                                                                                }
                                                                                            })
                                                                                            camera_object.push({
                                                                                                camera_name: val.camera_gereral_name,
                                                                                                camera_id: val.camera_id,
                                                                                                ip_address: { select: val.ip_address, device_id: val.device_id },
                                                                                                site: { select: val.str, id: val.site_id },
                                                                                                active: val.Active,
                                                                                                cloud: val.cloud_recording,
                                                                                                analytic: val.analytics_alert,
                                                                                                alert_noti: val.notification_alert,
                                                                                                from: val.from,
                                                                                                to: val.to
                                                                                            })
                                                                                        })
                                                                                        setsave_type('put_data')
                                                                                        // handleopeneuser_pass()
                                                                                        handleOpen2()

                                                                                    } else {
                                                                                        alert('Select Cameras to Edit')
                                                                                    }
                                                                                } else {
                                                                                    setalert_box(true)
                                                                                    setalert_text(`Your access level does not allow you to download these (${cam_name}) videos.`)

                                                                                }
                                                                            }

                                                                        }}>Edit settings</p>
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                            <div style={{ height: '1px', width: '90%', backgroundColor: 'white' }}></div>
                                                                        </div>
                                                                        <p style={{ color: 'white', fontSize: '15px', margin: 0, marginRight: '10px', cursor: 'pointer', padding: '15px' }} onClick={() => {
                                                                            let access = userData.operation_type.filter((val) => { return val == 'Create' || val == 'All' })
                                                                            if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Create' || access[1] == 'Create') {
                                                                                flag_type = 'add_tag'
                                                                                get_tag_list()
                                                                            } else {
                                                                                setalert_box(true)
                                                                                setalert_text('Your access level does not allow you to create Sites.')

                                                                            }

                                                                        }}>Add tags</p>
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                            <div style={{ height: '1px', width: '90%', backgroundColor: 'white' }}></div>
                                                                        </div>
                                                                        <p style={{ color: 'white', fontSize: '15px', margin: 0, marginRight: '10px', cursor: 'pointer', padding: '15px' }} onClick={() => {
                                                                            let access = userData.operation_type.filter((val) => { return val == 'Create' || val == 'All' })
                                                                            if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Delete' || access[1] == 'Delete') {
                                                                                flag_type = 'delete_tag';
                                                                                handleOpendelete()
                                                                                get_tag_full_list()
                                                                            } else {
                                                                                setalert_box(true)
                                                                                setalert_text('Your access level does not allow you to create Sites.')

                                                                            }

                                                                        }}>Delete tags</p>
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                            <div style={{ height: '1px', width: '90%', backgroundColor: 'white' }}></div>
                                                                        </div>
                                                                        <p style={{ color: 'white', fontSize: '15px', margin: 0, marginRight: '10px', cursor: 'pointer', padding: '15px' }} onClick={() => {
                                                                            let access = userData.operation_type.filter((val) => { return val == 'Create' || val == 'All' })
                                                                            if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Create' || access[1] == 'Create') {
                                                                                flag_type = 'add_group';
                                                                                get_tag_list()
                                                                                get_group_full_list()
                                                                            } else {
                                                                                setalert_box(true)
                                                                                setalert_text('Your access level does not allow you to create Sites.')

                                                                            }

                                                                        }}>Create group</p>
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                            <div style={{ height: '1px', width: '90%', backgroundColor: 'white' }}></div>
                                                                        </div>
                                                                        <p style={{ color: 'white', fontSize: '15px', margin: 0, marginRight: '10px', cursor: 'pointer', padding: '15px' }} onClick={() => {
                                                                            let access = userData.operation_type.filter((val) => { return val == 'Create' || val == 'All' })
                                                                            if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Delete' || access[1] == 'Delete') {
                                                                                flag_type = 'delete_group';
                                                                                handleOpendelete()
                                                                                get_tag_full_list()
                                                                                // get_group_full_list()
                                                                            } else {
                                                                                setalert_box(true)
                                                                                setalert_text('Your access level does not allow you to create Sites.')

                                                                            }
                                                                        }}>Delete Group</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            ) :
                                            (
                                                <div style={{ display: 'flex', alignItems: 'center', }}>

                                                    <Skeleton width={220} height={45} style={{ borderRadius: '20px', border: '1px solid gray', }} />
                                                    <Skeleton width={100} height={45} style={{ borderRadius: '20px', border: '1px solid gray', marginLeft: "20px" }} />
                                                    <Skeleton width={170} height={45} style={{ borderRadius: '20px', border: '1px solid gray', marginLeft: "20px" }} />
                                                </div>
                                            )
                                    }

                                </Col>

                            </Row>
                            {
                                filter && !flag1 ?
                                    <Row style={{ padding: '10px' }}>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex' }}>

                                            <div style={{ position: 'relative' }}>
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
                                                                        searchfunction(e.target.value, cameras, 'camera_search1')
                                                                        setcamera_search(e.target.value)
                                                                    } else {
                                                                        setdata(cameras)
                                                                    }
                                                                }}></input>
                                                            </div>

                                                            {
                                                                data.length !== 0 ?
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
                                                                        setcameras_view(data)
                                                                        console.log(data);
                                                                        // setcameras_search(data)
                                                                        setcamera_box(!camera_box)
                                                                        setcamera_checkbox([])
                                                                    }}>Clear all</p>
                                                                    : ''
                                                            }
                                                        </div>

                                                        <div className='lower_alerts' style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                                                            {
                                                                data.length !== 0 ?
                                                                    data.map((val, k) => {
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
                                                                                                        console.log(get_tag_full_data);
                                                                                                        console.log(val.camera_tags);
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

                                                                                        setcamera_checkbox([...camera_checkbox, val._id])
                                                                                        setget_tag_full_data_sort(new_camera_tag)
                                                                                        setget_tag_full_data_sort1(new_camera_tag)
                                                                                        setget_group_full_data_sort(new_camera_group)
                                                                                        setget_group_full_data_sort1(new_camera_group)
                                                                                        setcameras_view(newcamera)
                                                                                        console.log(newcamera);
                                                                                        // setcameras_search(newcamera)
                                                                                    } else {

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
                                                                                            setcamera_checkbox(camcnk)
                                                                                            setcameras_view(data)
                                                                                            console.log(data)
                                                                                            // setcameras_search(data)
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
                                                                                                    new_camera_list = data
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

                                                                                            setcamera_checkbox(camcnk)
                                                                                            setcameras_view(new_camera_list)
                                                                                            console.log(new_camera_list);
                                                                                            // setcameras_search(new_camera_list)

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

                                            <div style={{ position: 'relative' }}>
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

                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                                            <p style={{ margin: 0, color: 'white', width: '200px' }}>Online<span style={{ color: 'white', borderRadius: '50%', backgroundColor: '#a8a4a4', marginLeft: '10px', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px' }}>{data.length}</span></p>
                                                            <input className='onlineCheckbox' type="checkbox" onClick={(e) => {
                                                                if (e.target.checked === true) {
                                                                    // let arr = []
                                                                    // data.map((val) => {
                                                                    //     if (val.objects.length !== 0 && val.objects.person !== undefined) {
                                                                    //         arr.push(val)
                                                                    //     }
                                                                    // })
                                                                    // setdata2(arr)
                                                                    // console.log(arr);
                                                                    let active = []
                                                                    data.map((val) => {
                                                                        if (val.Active === 1) {
                                                                            active.push(val)
                                                                        }
                                                                    })
                                                                    // setcameras_view(active)
                                                                    // setselectedcameras(active)
                                                                    // dispatch({ type: SELECTED_CAMERAS, value: active })
                                                                    // dispatch({ type: APPLY, value: !apply })
                                                                    // console.log([...selectedanalytics, val]);
                                                                } else {
                                                                    // setcameras_view(cameras)
                                                                    // setselectedcameras(cameras)
                                                                    // dispatch({ type: SELECTED_CAMERAS, value: cameras })
                                                                    // dispatch({ type: APPLY, value: !apply })
                                                                }
                                                            }}></input>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ position: 'relative' }}>
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
                                                                            settag_checkbox([])
                                                                            setcameras_view(cameras_search)

                                                                            setcamera_tag(!camera_tag)
                                                                        }}>Clear all</p>
                                                                        : ''
                                                                }

                                                            </div>

                                                            <div className='lower_alerts' style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                                                                {
                                                                    get_tag_full_data_sort.length !== 0 ?
                                                                        get_tag_full_data_sort.map((val, k) => {
                                                                            let typ = false
                                                                            tag_checkbox.map((id) => {
                                                                                if (id == val._id) {
                                                                                    typ = true
                                                                                }
                                                                            })
                                                                            return (
                                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                                                                    <p style={{ margin: 0, color: 'white', width: '200px' }}>{val.tag_name.charAt(0).toUpperCase() + val.tag_name.slice(1)}<span style={{ color: 'white', borderRadius: '50%', backgroundColor: '#a8a4a4', marginLeft: '10px', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px' }}>{val.tags.length}</span></p>
                                                                                    <input className='tagCheckbox' checked={typ ? true : false} type="checkbox" onClick={(e) => {


                                                                                        if (e.target.checked === true) {
                                                                                            const axios = require('axios');
                                                                                            let data = JSON.stringify({
                                                                                                "tag_id": val._id
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
                                                                                                        if (response.data.length !== 0) {
                                                                                                            if (check.length - 1 == flagcount) {
                                                                                                                if (check1.length == flagcount1 && check2.length == flagcount2) {

                                                                                                                    new_camera_list = response.data
                                                                                                                } else {
                                                                                                                    let data = [...cameras_view, ...response.data]
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
                                                                                                                let data = [...cameras_view, ...response.data]
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

                                                                                                    setcameras_view(new_camera_list)
                                                                                                    console.log(new_camera_list)
                                                                                                    // setcameras_search(new_camera_list)
                                                                                                    settag_checkbox([...tag_checkbox, val._id])

                                                                                                })
                                                                                                .catch((error) => {
                                                                                                    console.log(error);
                                                                                                })
                                                                                            // console.log([...selectedanalytics, val]);
                                                                                        } else {
                                                                                            tagelsefunction(val, 'regular')
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

                                            <div style={{ position: 'relative' }}>
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
                                                                    <input type='text' placeholder='Search group' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginBottom: '5px', width: '100%', height: '40px' }} onChange={(e) => {
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
                                                                                // groupelsefunction(val, 'once')
                                                                                tagelsefunction(val, 'once')
                                                                            })

                                                                            setcamera_group(!camera_group)
                                                                            setcameras_view(cameras_search)
                                                                            setgroup_checkbox([])
                                                                        }}>Clear all</p>
                                                                        : ''
                                                                }

                                                            </div>

                                                            <div className='lower_alerts' style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                                                                {
                                                                    get_group_full_data_sort.length !== 0 ?
                                                                        get_group_full_data_sort.map((val, k) => {
                                                                            let typ = false
                                                                            group_checkbox.map((id) => {
                                                                                if (id == val._id) {
                                                                                    typ = true
                                                                                }
                                                                            })
                                                                            return (
                                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                                                                    {console.log('val.group.length', val.groups)}
                                                                                    <p style={{ margin: 0, color: 'white', width: '200px' }}>{val.group_name.charAt(0).toUpperCase() + val.group_name.slice(1)}<span style={{ color: 'white', borderRadius: '50%', backgroundColor: '#a8a4a4', marginLeft: '10px', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px' }}>{val.groups.length}</span></p>
                                                                                    <input className='groupCheckbox' checked={typ ? true : false} type="checkbox" onClick={(e) => {
                                                                                        if (e.target.checked === true) {
                                                                                            const axios = require('axios');
                                                                                            let data = JSON.stringify({
                                                                                                "group_id": val._id
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
                                                                                                .then((response) => {
                                                                                                    // setcameras_view([...response.data])

                                                                                                    console.log("check box", response.data)
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
                                                                                                        if (response.data.length !== 0) {
                                                                                                            if (check1.length - 1 == flagcount1) {
                                                                                                                if (check.length == flagcount && check2.length == flagcount2) {

                                                                                                                    new_camera_list = response.data
                                                                                                                } else {
                                                                                                                    let data = [...cameras_view, ...response.data]
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
                                                                                                                let data = [...cameras_view, ...response.data]
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

                                                                                                    setcameras_view(new_camera_list)
                                                                                                    console.log(new_camera_list);
                                                                                                    // setcameras_search(new_camera_list)
                                                                                                    setgroup_checkbox([...group_checkbox, val._id])

                                                                                                })
                                                                                                .catch((error) => {
                                                                                                    console.log(error);
                                                                                                })


                                                                                            // console.log([...selectedanalytics, val]);
                                                                                        } else {

                                                                                            groupelsefunction(val, 'regular')
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

                            <Row style={{ padding: '10px', alignItems: 'center', }}>

                                <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ overflowX: 'scroll' }}>
                                    {
                                        skeleton ? (
                                            <table style={{ width: '100%', backgroundColor: 'white' }}>
                                                <tr style={{ backgroundColor: '#e6e8eb', color: 'black' }}>
                                                    <th style={{ padding: '15px' }}>
                                                        <input
                                                            type='checkbox'
                                                            checked={selectedcameras.length === cameras.length ? true : false}
                                                            onClick={(e) => {
                                                                let check = document.getElementsByClassName('check');

                                                                if (e.target.checked === true) {
                                                                    for (let i = 0; i < check.length; i++) {
                                                                        check[i].checked = true;
                                                                        let img = document.getElementById(`dash_image${i}`);
                                                                        camera_list_image.push(img.src);
                                                                    }
                                                                    setselectedcameras(cameras);
                                                                    dispatch({ type: SELECTED_CAMERAS, value: cameras });
                                                                } else {
                                                                    for (let i = 0; i < check.length; i++) {
                                                                        check[i].checked = false;
                                                                    }
                                                                    setselectedcameras([]);
                                                                    setselectedcameras([]);
                                                                    dispatch({ type: SELECTED_CAMERAS, value: [] });
                                                                }
                                                            }}
                                                        />
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
                                                {console.log('Cameras view', cameras_view)}
                                                {cameras_view !== '' && cameras_view !== 'no_res' ? (
                                                    cameras_view.map((val, i) => {
                                                        let chk = "";

                                                        if (selectedcameras.length !== 0) {
                                                            for (let i = 0; i < selectedcameras.length; i++) {
                                                                if (selectedcameras[i]._id === val._id) {
                                                                    chk = true;
                                                                    break;
                                                                } else {
                                                                    chk = false;
                                                                }
                                                            }
                                                        } else {
                                                            chk = false;
                                                        }
                                                        getimageurifunction(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, val, i);
                                                        return (
                                                            <tr style={{ borderBottom: '1px solid grey', color: 'black' }}>
                                                                <th style={{ padding: '15px' }}>
                                                                    <input
                                                                        id={`checked${i}`}
                                                                        checked={chk}
                                                                        className='check'
                                                                        type='checkbox'
                                                                        onClick={(e) => {
                                                                            if (e.target.checked === true) {
                                                                                setselectedcameras((old) => {
                                                                                    let img = document.getElementById(`dash_image${i}`);
                                                                                    camera_list_image.push(img.src);
                                                                                    dispatch({ type: SELECTED_CAMERAS, value: [...old, val] });
                                                                                    return [...old, val];
                                                                                });
                                                                            } else {
                                                                                let arr = [];
                                                                                selectedcameras.map((data, i) => {
                                                                                    if (val._id !== data._id) {
                                                                                        let img = document.getElementById(`dash_image${i}`);
                                                                                        camera_list_image.push(img.src);
                                                                                        arr.push(data);
                                                                                    }
                                                                                });
                                                                                setselectedcameras(arr);
                                                                                dispatch({ type: SELECTED_CAMERAS, value: arr });
                                                                            }
                                                                        }}
                                                                    />
                                                                </th>
                                                                <td style={{ padding: '15px' }}>
                                                                    <img
                                                                        id={`dash_image${i}`}
                                                                        width={150}
                                                                        height={100}
                                                                        src={tentovision_logo}
                                                                        alt='Tento vision image is loading'
                                                                        onError={(e) => {
                                                                            e.target.src = tentovision_logo;
                                                                        }}
                                                                    />
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
                                                        );
                                                    })
                                                ) : (
                                                    <></>
                                                )}
                                            </table>
                                        ) : (
                                            <TableSkeleton numRows={8} />
                                        )
                                    }
                                </Col>


                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
        </div >
    )
}
