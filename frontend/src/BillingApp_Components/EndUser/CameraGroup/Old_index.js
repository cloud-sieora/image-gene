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
import { db_type } from '../db_config'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';

import VideoCameraBackOutlinedIcon from '@mui/icons-material/VideoCameraBackOutlined';
import BentoOutlinedIcon from '@mui/icons-material/BentoOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { PAGE, STARTDATE, STARTTIME, ENDDATE, ENDTIME, APPLY, SELECT, SELECTED_CAMERAS } from '../../../store/actions'
import * as api from '../../Configurations/Api_Details'
import { useDispatch, useSelector } from 'react-redux'
import '../style.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import AWSMqtt from "aws-mqtt-client"
import AWS from 'aws-sdk';
import DomainAddOutlinedIcon from '@mui/icons-material/DomainAddOutlined';
import axios from 'axios'
import moment from 'moment'
import CircularProgress from '@mui/material/CircularProgress';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { CreateBucketCommand, S3Client, GetObjectCommand, ListBucketsCommand, DeleteBucketCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import ClientDevice from '../Device_creation/Client_device_creation'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import Mask from '../Mask'
import Skeleton from 'react-loading-skeleton';
import TableSkeleton from '../Tableskeleton';
import MaskSelection from '../Mask/Mask'

import tento from '../tento.jpeg'
import tentovision_logo from '../../../assets/images/tentovision_logo.jpeg';


let flag_type = 'add_tag'
let count = 0
let count1 = 0
let device_count = 0
let intervals = []
let camera_list_image = []
let socket_camera_count = -1
export default function Index() {
    const dispatch = useDispatch()
    const userData = JSON.parse(localStorage.getItem("userData"))
    const { socket } = useSelector((state) => state)
    const [cameras, setcameras] = useState([]);
    const [selectedcameras, setselectedcameras] = useState([]);
    const [actionClick, setactionClick] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [opendelete, setOpendelete] = useState(false);
    const [opencamera, setOpencamera] = useState(false);

    const [device_list_view, setdevice_list_view] = useState(false);
    const [mask_list_view, setmask_list_view] = useState(false);
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
    const [cameras_view1, setcameras_view1] = useState([])
    const [data, setdata] = useState([]);
    const [cameras_view, setcameras_view] = useState([])
    const [camera_checkbox, setcamera_checkbox] = useState([])
    const [camera_serach, setcamera_serach] = useState([])
    const [tag_search, settag_search] = useState('')
    const [tag_checkbox, settag_checkbox] = useState([])
    const [group_search, setgroup_search] = useState('')
    const [group_checkbox, setgroup_checkbox] = useState([])
    const [top_camera_search, settop_camera_search] = useState('')
    const [cameras_search, setcameras_search] = useState([])
    const [skeleton, setskeleton] = useState(false)

    const [roughData, setRoughData] = useState([])


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
    const [group_name, setgroup_name] = useState('')
    const [siteactive, setsiteactive] = useState(0)
    const [site_flag, setsite_flag] = useState('new_data')
    const [create_group, setcreate_group] = useState(false)
    const [group_list, setgroup_list] = useState([])
    const [flag, setflag] = useState(false)
    const [site_ind, setsite_ind] = useState(0)
    const [create_group_select, setcreate_group_select] = useState(false)
    const [site_manage_btn, setsite_manage_btn] = useState(false)
    const [device_manage_btn, setdevice_manage_btn] = useState(false)
    const [selected_sites, setselected_sites] = useState([])
    const [homeArray, setHomeArray] = useState([])
    const [cameraArray, setCameraArray] = useState([])
    const [alertmodel, setalertmodel] = useState(false)
    const [alert_start_time, setalert_start_time] = useState('')
    const [alert_end_time, setalert_end_time] = useState('')
    const [userSelectedPlan, setUserSelectedPlan] = useState('')
    const [isPlanSelected, setIsPlanSelected] = useState('')
    const [mask_div_open, setmask_div_open] = useState(false)
    const [alert_value, setalert_value] = useState('')
    const [edit_image, setedit_image] = useState('')
    const [mask_image, setmask_image] = useState('')
    const [subscriptionPlanData, setSubscriptionPlanData] = useState([])
    const [peoplemodel, setpeoplemodel] = useState(false)
    const [over_image_array, setover_image_array] = useState([])
    const [mask_range_name, setmask_range_name] = useState([])
    const [direction_name, setdirection_name] = useState('')
    const [from_time, setfrom_time] = useState([])
    const [to_time, setto_time] = useState([])
    const [class_name, setclass_name] = useState([])
    const [type, settype] = useState([])
    const [threshold, setthreshold] = useState([])
    const [in_out, setin_out] = useState('')
    const [direction_flag, setdirection_flag] = useState(false)
    const [in_out_flag, setin_out_flag] = useState(false)
    const [second_flag, setsecond_flag] = useState(false)
    const alertClose = () => setalert_box(false)

    const [intrusion_alert, setintrusion_alert] = useState(0)
    const [crowd_alert, setcrowd_alert] = useState(0)
    const [loitering_alert, setloitering_alert] = useState(0)
    const [smoke_alert, setsmoke_alert] = useState(0)
    const [fire_alert, setfire_alert] = useState(0)
    const [ppe_alert, setppe_alert] = useState(0)
    const [intrusion_type, setintrusion_type] = useState({ people: 1, vehicle: 0, animal: 0 })
    const [loitering_type, setloitering_type] = useState({ people: 0, vehicle: 0, animal: 0, people_threshold: 30, vehicle_threshold: 30, animal_threshold: 30 })
    const [crowd_threshold, setcrowd_threshold] = useState(0)


    const [online_cam, setonline_cam] = useState(0)
    const [offline_cam, setoffline_cam] = useState(0)
    const [main_type_id, setmain_type_id] = useState({})
    const [main_cam_value, setmain_cam_value] = useState('In')
    const [main_cam_model, setmain_cam_model] = useState(false)


    const [username_pass_model, setusername_pass_model] = useState(false);
    const [isChooseMode, setIsChooseMode] = useState(false)
    const [isOpenMannualModel, setIsOpenMannualModel] = useState(false)

    const [isOpenMannualSiteOption, setIsOpenMannualSiteOption] = useState(false)
    const [isOpenMannualDeviceOption, setIsOpenMannualDeviceOption] = useState(false)
    const [isOpenMannualActiveOption, setIsOpenMannualActiveOption] = useState(false)
    const [camera_save_loader, setcamera_save_loader] = useState(false)
    const [analytic_type, setanalytic_type] = useState('masking')
    const [motion_actionClick, setmotion_actionClick] = useState(false)
    const [Total_camera_count_plan, setTotal_camera_count_plan] = useState({})
    const [blur_div, setblur_div] = useState(false)
    const [device_list, setdevice_list] = useState([])


    console.log('Total_camera_count_plan', Total_camera_count_plan)


    function get_image_url(key) {
        const s3Client = new S3Client({
            region: "ap-south-1",
            credentials: {
                accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
                secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
            },
        });

        const image_command = new GetObjectCommand({
            Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
            Key: key,
        });

        if (key != 'NONE') {
            if (db_type == 'local') {
                setedit_image(key)
                setsecond_flag(!second_flag)
            } else {
                getSignedUrl(s3Client, image_command)
                    .then((edit) => {
                        setedit_image(edit)
                        setsecond_flag(!second_flag)
                    })
                    .catch((e) => {
                        console.log('error')
                    })
            }

        } else {
            setedit_image('none')
            setsecond_flag(!second_flag)
        }
    }

    function fun_over_image_array(value) {
        setover_image_array(value)
    }


    const apiData = {
        "success": true,
        "sub": [
            {
                "sub": {
                    "_2mp": {
                        "motion": {
                            "motion": 2,
                            "plan_id": "none",
                            "payment_id": "NONE"
                        },
                        "continues": {
                            "continues": 1,
                            "plan_id": "none",
                            "payment_id": "none"
                        }
                    },
                    "_4mp": {
                        "motion": {
                            "motion": 1,
                            "plan_id": "none",
                            "payment_id": "NONE"
                        },
                        "continues": {
                            "continues": 0,
                            "plan_id": "none",
                            "payment_id": "none"
                        }
                    },
                    "_8mp": {
                        "motion": {
                            "motion": 1,
                            "plan_id": "none",
                            "payment_id": "NONE"
                        },
                        "continues": {
                            "continues": 0,
                            "plan_id": "none",
                            "payment_id": "none"
                        }
                    },
                    "options": {
                        "alert": 1,
                        "analytics": 1,
                        "cloud": 0,
                        "local": 0,
                        "face_dedaction": 1,
                        "motion": 3,
                        "live": 1
                    },
                    "start_date": "2024-05-09",
                    "start_time": "11:13",
                    "end_date": "2024-05-20",
                    "end_time": "11:13",
                    "_id": "6641aebc03666e8a086d08a9"
                },
                "camera_add": 4,
                "cameras_options": {
                    "alert": 0,
                    "analytics": 1,
                    "cloud": 0,
                    "local": 0,
                    "face_dedaction": 1,
                    "_2mp": {
                        "motion": 1,
                        "continues": 1
                    },
                    "_4mp": {
                        "motion": 1,
                        "continues": 0
                    },
                    "_8mp": {
                        "motion": 1,
                        "continues": 0
                    }
                }
            },
            {
                "sub": {
                    "_2mp": {
                        "motion": {
                            "motion": 2,
                            "plan_id": "none",
                            "payment_id": "NONE"
                        },
                        "continues": {
                            "continues": 1,
                            "plan_id": "none",
                            "payment_id": "none"
                        }
                    },
                    "_4mp": {
                        "motion": {
                            "motion": 1,
                            "plan_id": "none",
                            "payment_id": "NONE"
                        },
                        "continues": {
                            "continues": 0,
                            "plan_id": "none",
                            "payment_id": "none"
                        }
                    },
                    "_8mp": {
                        "motion": {
                            "motion": 0,
                            "plan_id": "none",
                            "payment_id": "NONE"
                        },
                        "continues": {
                            "continues": 0,
                            "plan_id": "none",
                            "payment_id": "none"
                        }
                    },
                    "options": {
                        "alert": 1,
                        "analytics": 1,
                        "cloud": 0,
                        "local": 0,
                        "face_dedaction": 1,
                        "motion": 3,
                        "live": 1
                    },
                    "start_date": "2024-05-09",
                    "start_time": "11:13",
                    "end_date": "2024-05-20",
                    "end_time": "11:13",
                    "_id": "6641f7c9f0ede4c8330e84b8"
                },
                "camera_add": 4,
                "cameras_options": {
                    "alert": 1,
                    "analytics": 1,
                    "cloud": 0,
                    "local": 0,
                    "face_dedaction": 1,
                    "motion": 3,
                    "live": 1,
                    "_2mp": {
                        "motion": 2,
                        "continues": 1
                    },
                    "_4mp": {
                        "motion": 1,
                        "continues": 0
                    },
                    "_8mp": {
                        "motion": 0,
                        "continues": 0
                    }
                }
            }
        ]
    }

    function device_get() {
        let getStocksData = {}

        if (db_type == 'local') {
            getStocksData = {
                url: userData.position_type == 'Client' ? api.LIST_DEVICE_DATA_CLIENT_ID_LOCAL : userData.position_type == 'Client Admin' ? api.LIST_DEVICE_DATA_CLIENT_ADMIN_ID_LOCAL : userData.position_type == 'Site Admin' ? api.LIST_DEVICE_DATA_SITE_ADMIN_ID_LOCAL : api.LIST_DEVICE_DATA_USER_ID_LOCAL,
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
        } else {
            getStocksData = {
                url: userData.position_type == 'Client' ? api.LIST_DEVICE_DATA_CLIENT_ID : userData.position_type == 'Client Admin' ? api.LIST_DEVICE_DATA_CLIENT_ADMIN_ID : userData.position_type == 'Site Admin' ? api.LIST_DEVICE_DATA_SITE_ADMIN_ID : api.LIST_DEVICE_DATA_USER_ID,
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
        }


        axios.request(getStocksData)
            .then((response) => {
                console.log("Response from backend", response.data);
                setblur_div(false)
                setdevice_list(response.data)
            })
            .catch((error) => {
                console.log(error);
            })
    }



    useEffect(() => {


        // let socket = ''
        if (db_type == 'local') {

        } else {
            // socket = io(api.BACKEND_URI, { transports: ['websocket'] });

            // socket.on("connect_error", (err) => {
            //     console.log(`connect_error due to ${err.message}`);
            // })

            // socket.on('cameraDetails', function (a) {

            //     if (userData._id == JSON.parse(a).user_id) {

            //         if (JSON.parse(a).data.length !== 0 && JSON.parse(a).data[0] == 'device_active') {
            //             device_count = device_count + 1
            //         } else {
            //             count1 = count1 + 1
            //             if (device_count == count1) {
            //                 let data = JSON.parse(a).data
            //                 setcamera_list_data([...camera_list_data, ...data])
            //                 setcamera_list_data1([...camera_list_data, ...data])
            //                 setcamera_scan_flag(false)
            //                 handleOpen2()
            //                 count1 = 0
            //                 count = 0
            //                 device_count = 0
            //             } else {
            //                 let data = JSON.parse(a).data
            //                 camera_list_data = [...camera_list_data, ...data]
            //             }
            //         }

            //     }

            //     // console.log(JSON.parse(a));
            // })

            try {
                socket.on('camera_mp', function (a) {
                    console.log(JSON.parse(a));
                    if (save_type == 'new_data') {
                        addCameraMannullyArray.map((val, i) => {
                            if (val.main_stream == JSON.parse(a).rtsp) {
                                addCameraMannullyArray[i].camera_mp = JSON.parse(a).camera_mp
                                addCameraMannullyArray[i].ip_address = JSON.parse(a).ip_address
                                addCameraMannullyArray[i].user_name = JSON.parse(a).user_name
                                addCameraMannullyArray[i].password = JSON.parse(a).password
                                addCameraMannullyArray[i].sub_stream = JSON.parse(a).sub_stream
                            }
                        })
                    } else {
                        camera_object.map((val, i) => {
                            if (val.main_stream == JSON.parse(a).rtsp) {
                                camera_object[i].camera_mp = JSON.parse(a).camera_mp
                                camera_object[i].ip_address.select = JSON.parse(a).ip_address
                                camera_object[i].user_name = JSON.parse(a).user_name
                                camera_object[i].password = JSON.parse(a).password
                                camera_object[i].sub_stream = JSON.parse(a).sub_stream
                            }
                        })
                    }
                    socket_camera_count = socket_camera_count - 1

                    if (socket_camera_count == 0) {
                        setblur_div(false)
                    }
                })
            } catch (e) {
                console.log(e);
            }
        }

        get_group_list()
        device_get()

        return (() => {
            if (db_type == 'local') {

            } else {
                // socket.disconnect();
            }
        })
    }, [])

    function get_group_list() {

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
                    console.log(getStocksData);
                    console.log(response.data);
                    setsite_list(response.data)
                    setsite_list1(response.data)
                    setgroup_list(response.data)
                    if (response.data.length !== 0) {
                        setselected_sites(response.data)
                        list_camera_site_id(response.data)
                        setsite_ind(0)
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

    function list_camera_site_id(site_id) {
        dispatch({ type: SELECTED_CAMERAS, value: [] })
        let data = []
        let count = 0


        for (let index = 0; index < site_id.length; index++) {
            const getStocksData = {
                url: api.CAMERA_LIST_BY_SITE_ID,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({

                    "site_id": site_id[index]

                })
            }
            axios(getStocksData)
                .then(response => {
                    setskeleton(true)
                    console.log(response.data);
                    data = [...data, ...response.data]
                    count = count + 1

                    if (count == site_id.length) {
                        console.log('get camera health first in camera management', data)
                        get_camera_health(data)
                    }

                    setskeleton(true)
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

    }


    console.log('home array', homeArray)


    useEffect(() => {
        let data1 = []
        let count = 0

        if (userData.position_type == 'Client' || userData.position_type == 'Client Admin') {
            setskeleton(false)
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
                    console.log('first response', response.data)
                    setskeleton(true)
                    setHomeArray(response.data)
                    // alert('coming first')
                    // console.log('First data', response.data)

                    // if (response.data.length == 0) {
                    //     webrts_flag = true
                    //     setcameras_view('no_res')
                    // }
                    // let element = document.getElementById(`outerDiv${0}`).clientHeight
                    // let vid = document.getElementsByTagName('video')
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
                            setHomeArray(data1)
                            // alert('coming second')

                            // if (data1.length == 0) {
                            //     setcameras_view('no_res')
                            // }
                            // let element = document.getElementById(`outerDiv${0}`).clientHeight
                            // let vid = document.getElementsByTagName('video')
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
                    setHomeArray(response.data)
                    // alert('coming third')

                    // if (response.data.length == 0) {
                    //     webrts_flag = true
                    //     setcameras_view('no_res')
                    // }

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
        }

        // return () => {
        //     hlsDetail.map((val) => {
        //         val.player.pause()
        //         val.hls.stopLoad()
        //         val.hls.destroy()
        //         val.player.remove()
        //         console.log(val.player)
        //     })
        // }
    }, [])




    function get_camera_health(cameras_res) {
        // console.log('camera res in camera managment', cameras_res)
        let data1 = []
        let count = 0
        let online = 0
        let offline = 0

        if (db_type == 'local') {
            setcameras(cameras_res)
            setskeleton(true)
            setdata(cameras_res)
            setcameras_view(cameras_res)
            setcameras_view1(cameras_res)
            setcamera_serach(cameras_res)
            setcameras(cameras_res)
            setRoughData(cameras_res)
            setonline_cam(online)
            setoffline_cam(offline)
            setblur_div(false)


            if (cameras_res.length == 0) {
                setcameras_view('no_res')
                setcameras_view1('no_res')
                setblur_div(false)
            }
        } else {
            cameras_res.map((val) => {
                setskeleton(false)
                count = count + 1

                let time = moment(new Date(), 'HH:mm:ss');
                time.subtract(2, 'minutes');
                let newTime1 = time.format('HH:mm:ss');
                let newTime = moment(new Date()).format('HH:mm:ss');

                if ((moment(val.last_active_date).format('YYYY-MM-DD') == moment(new Date()).format('YYYY-MM-DD')) && (moment(val.last_active, 'HH:mm:ss').isBetween(moment(newTime1, 'HH:mm:ss'), moment(newTime, 'HH:mm:ss')))) {

                    
                    data1.push({ ...val, camera_health: 'Online' })
                    online = online + 1
                } else {
                    data1.push({ ...val, camera_health: 'Offline' })
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

                    if (cameraArray.length === 0) {
                        setCameraArray(data1)
                    }

                    setcameras(data1)
                    setskeleton(true)
                    setdata(data1)
                    setcameras_view(data1)
                    setcameras_view1(data1)
                    setcamera_serach(data1)
                    setcameras(data1)
                    setRoughData(data1)
                    setonline_cam(online)
                    setoffline_cam(offline)
                    setblur_div(false)


                    if (data1.length == 0) {
                        setcameras_view('no_res')
                        setcameras_view1('no_res')
                        setblur_div(false)
                    }

                }
                // const getStocksData = {
                //     method: 'get',
                //     maxBodyLength: Infinity,
                //     url: `${api.CAMERAS_HEALTH}${val.stream_id}/stream-info`,
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                // }

                // // console.log(getStocksData)
                // axios(getStocksData)
                //     .then(response => {
                //         // console.log('Response in Camera Managment',response.data);
                //         count = count + 1
                //         data1.push({ ...val, camera_health: response.data.length !== 0 ? 'Online' : 'Offline' })
                //         if (response.data.length !== 0) {
                //             online = online + 1
                //         } else {
                //             offline = offline + 1
                //         }
                //         if (count == cameras_res.length) {

                //             if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                //                 let access = userData.operation_type.filter((val) => { return val == 'Read' || val == 'All' || val == 'Edit' || val == 'Delete' })
                //                 if (access[0] == 'All' || access[1] == 'All' || access[2] == 'All' || access[2] == 'All') {
                //                     data1.map((cam, i) => {
                //                         data1[i] = { ...data1[i], permission_level: 'All' }
                //                     })
                //                 } else {
                //                     data1.map((cam, i) => {
                //                         data1[i] = { ...data1[i], permission_level: 'Read, Edit, Delete' }
                //                     })
                //                 }
                //             } else {
                //                 userData.site_id.map((value) => {
                //                     let access = value.type.filter((val) => { return val == 'Read' || val == 'All' || val == 'Edit' || val == 'Delete' })
                //                     if (access[0] == 'All' || access[1] == 'All' || access[2] == 'All' || access[2] == 'All') {
                //                         data1.map((cam, i) => {
                //                             data1[i] = { ...data1[i], permission_level: 'All' }
                //                         })
                //                     } else {
                //                         data1.map((cam, i) => {
                //                             data1[i] = { ...data1[i], permission_level: 'Read, Edit, Delete' }
                //                         })
                //                     }
                //                 })
                //             }

                //             if (cameraArray.length === 0) {
                //                 setCameraArray(data1)
                //             }

                //             setcameras(data1)
                //             setskeleton(true)
                //             setdata(data1)
                //             setcameras_view(data1)
                //             setcameras_view1(data1)
                //             setcamera_serach(data1)
                //             setcameras(data1)
                //             setRoughData(data1)
                //             setonline_cam(online)
                //             setoffline_cam(offline)
                //             setblur_div(false)


                //             if (data1.length == 0) {
                //                 setcameras_view('no_res')
                //                 setcameras_view1('no_res')
                //                 setblur_div(false)
                //             }

                //         }
                //     })
                //     .catch(function (e) {
                //         if (e.message === 'Network Error') {
                //             alert("No Internet Found. Please check your internet connection")
                //         }
                //         else {
                //             alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                //         }

                //     });
            })
        }
    }



    function getCommonElements(array1, array2, identifier) {
        console.log('array 1', array1)
        console.log('array 2', array2)
        if (array1.length !== 0 && array2.length !== 0) {
            return array1.filter(obj1 =>
                array2.some(obj2 => obj2._id === obj1._id)
            );
        }

    }

    useEffect(() => {
        if (homeArray.length !== 0 && cameraArray.length !== 0) {

            const commonElements = getCommonElements(cameraArray, homeArray, '_id');

            get_camera_health(commonElements)

        }
    }, [homeArray, cameraArray])



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
                url: api.DEVICE_LIST_SITE_ID,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({

                    "site_id": group_list[site_ind]._id

                })
            }

            axios.request(getStocksData)
                .then((response) => {
                    console.log(response);
                    let finaldata = []
                    response.data.map((val) => {

                        if (val.last_active != 'NONE' && val.last_active_date != 'NONE') {
                            let device_time = val.last_active.split(':')


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
                        setalert_text(`No device found first add device to device creation page.`)
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

                                                if (cameras.length !== 0) {
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

                                                if (newdata.length !== 0) {


                                                    newdata.map(async (val, i) => {
                                                        const image_command = new GetObjectCommand({
                                                            Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                                                            Key: val.image_key,
                                                        });

                                                        let image_uri = ''
                                                        if (db_type == 'local') {
                                                            image_uri = val.image_key
                                                        } else {
                                                            image_uri = await getSignedUrl(s3Client, image_command)
                                                        }
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
                                                    setcamera_list_data(newdata)
                                                    setcamera_list_data1(newdata)
                                                    setcamera_scan_flag(false)
                                                    handleOpen2()
                                                    count1 = 0
                                                    count = 0
                                                    device_count = 0
                                                    intervals = []
                                                    alert('All Cameras are added')
                                                }
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

                    console.log(response.data);
                    response.data.map((val) => {
                        // console.log(val.device_id);
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
            }
            else {
                group_value.push({ name: get_tag_full_data_sort[i].tag_name, ind: i })
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

        // console.log(check.length != flagcount);

        if (check.length != flagcount) {
            if (val.groups.length !== 0) {
                for (let index = 0; index < val.groups.length; index++) {
                    let flag = false
                    let obj = []
                    for (let index1 = 0; index1 < new_camera_list.length; index1++) {
                        if (new_camera_list[index1]._id === val.groups[index]) {
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
                                data.map((cameradata) => {
                                    if (groupdata === cameradata._id) {
                                        arr.push(cameradata)
                                        arr1.push(cameradata._id)
                                    }
                                })
                            })
                        })


                        camera_value.map((group, i) => {
                            if (group.name == data[group.ind].camera_gereral_name) {
                                arr.push(data[group.ind])
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

        if (true) {
            // console.log(new_camera_list)
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
                setcameras(on)
                setcameras_view(on)
                // setcameras_search(on)
            } else if (check3[1].checked == true) {
                setcameras(of)
                setcameras_view(of)
                // setcameras_search(of)
            } else {
                setcameras(newcam)
                setcameras_view(newcam)
                // setcameras_search(newcam)
            }


            setcameras_view1(newcam)
            setcameras_view(newcam)
            setonline_cam(online)

            setoffline_cam(offline)

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

                    // console.log("obj", obj);
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
                                // console.log(cameras_view[index]._id, val.tags[index1], index1);
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
                                data.map((cameradata) => {
                                    if (groupdata === cameradata._id) {
                                        arr.push(cameradata)
                                        arr1.push(cameradata._id)
                                    }
                                })
                            })
                        })


                        camera_value.map((group, i) => {
                            if (group.name == data[group.ind].camera_gereral_name) {
                                arr.push(data[group.ind])
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

        if (true) {
            // console.log(new_camera_list);

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
                setcameras(on)
                setcameras_view(on)
                // setcameras_search(on)
            } else if (check3[1].checked == true) {
                setcameras(of)
                setcameras_view(of)
                // setcameras_search(of)
            } else {
                setcameras(newcam)
                setcameras_view(newcam)
                // setcameras_search(newcam)
            }


            setcameras_view1(newcam)
            setonline_cam(online)
            setoffline_cam(offline)

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

        // console.log(arr);

        if (arr.length != 0) {
            if (type == 'camera_search') {
                setcameras(arr)
                setcameras_view(arr)
            } else if (type == 'camera_search1') {
                setdata(arr)
            } else if (type == 'tag_search') {
                setget_tag_full_data_sort(arr)
            } else if (type == 'group_search') {
                setget_group_full_data_sort(arr)
            }

        } else {
            if (type == 'camera_search') {
                setcameras([])
                setcameras_view([])
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
                // console.log(response.data);
                let newlist = []

                // console.log(selectedcameras);

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

                // console.log(newlist);

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

                // console.log(new_tag_list);
                // console.log(newlist);
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
                // console.log(response.data)
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
                // console.log(response.data)
                setget_group_full_data(response.data)
                setget_group_full_data_sort(response.data)
                setget_group_full_data_sort1(response.data)
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

        // console.log(flag_type);
        axios.request(config)
            .then((response) => {
                // console.log(response.data)
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

        let image_uri = ''
        if (db_type == 'local') {
            image_uri = data.image_key
        } else {
            image_uri = await getSignedUrl(s3Client, image_command)
        }
        setTimeout(() => {
            document.getElementById(`skle${i}`).style.display = 'none'
            let img = document.getElementById(`dash_image${i}`)
            img.src = image_uri
            img.style.display = 'block'
        }, 1000);
        return image_uri
    }

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
        device_id: {
            deviceName: '',
            deviceId: ''
        },
        ip_address: '',
        main_stream: '',
        camera_mp: 0,
        user_name: '',
        password: '',
        sub_stream: '',
        alertNotification: false,
        analyticAlert: false,
        cloudRecording: false
    }


    const [addCameraMannullyArray, setAddCameraMannullyArray] = useState([])

    const handleCancelCameraBtn = (id) => {
        let filteredArray = addCameraMannullyArray.filter((d) => d.cameraId !== id)
        // console.log(filteredArray)
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



    const userDataFromLocalStorge = JSON.parse(localStorage.getItem('userData'))
    const [workingPlanData, setWorkingPlanData] = useState({})
    // const [recordingModePlanCount, setRecordingModePlanCount] = useState({
    //     '_2mp': {
    //         continues: 0,
    //         motion: 0
    //     },
    //     '_4mp': {
    //         continues: 0,
    //         motion: 0
    //     },
    //     '_8mp': {
    //         continues: 0,
    //         motion: 0
    //     }
    // })

    // const handleGetAllCountFromPlan = (res) => {
    //     const newData = { ...recordingModePlanCount };

    //     res.forEach((subscription) => {

    //         const { _2mp, _4mp, _8mp } = subscription.cameras_options;


    //         newData._2mp.continues += _2mp.continues;
    //         newData._2mp.motion += _2mp.motion;


    //         newData._4mp.continues += _4mp.continues;
    //         newData._4mp.motion += _4mp.motion;


    //         newData._8mp.continues += _8mp.continues;
    //         newData._8mp.motion += _8mp.motion;
    //     });

    //     setRecordingModePlanCount(newData);
    // };




    // console.log('recordingModePlanCount', recordingModePlanCount)   



    const [subscriptionPlanApiData, setSubscriptionPlanApiData] = useState([])


    function save_cameras() {
        let count = 0
        setcamera_save_loader(true)

        let camera_object2 = []
        console.log('camera_object', camera_object)
        camera_object.map((val, i) => {
            if (val.camera_name !== '') {
                camera_object2.push(val)
            }
        })
        console.log('camera_object2', camera_object2)
        if (camera_object2.length !== 0) {
            camera_object2.map((val, i) => {

                const device_details = {
                    "dealer_id": (JSON.parse(localStorage.getItem("userData"))).dealer_id,
                    "user_id": (JSON.parse(localStorage.getItem("userData")))._id,
                    'device_id': val.ip_address.device_id,
                    'camera_gereral_name': val.camera_name,
                    "camera_id": val.camera_id,
                    "site_id": val.site.id,
                    "from": val.from,
                    "to": val.to,
                    "camera_mp": val.camera_mp,
                    "camera_username": user_name,
                    "password": password,
                    'notification_alert': val.alert_noti,
                    "cloud_recording": val.cloud,
                    "ip_address": val.ip_address.select,
                    "plan_end_date": val.plan_end_date,
                    "plan_end_time": val.plan_end_time,
                    "plan_start_date": val.plan_start_date,
                    "plan_start_time": val.plan_start_time,
                    "subscribe_id": val.subscribe_id,
                    "analytics_alert": val.analytic,
                    'created_date': save_type == 'new_data' ? moment(new Date()).format('YYYY-MM-DD') : selectedcameras[0].created_date,
                    'updated_date': moment(new Date()).format('YYYY-MM-DD'),
                    'created_time': save_type == 'new_data' ? moment(new Date()).format('HH:MM:ss') : selectedcameras[0].updated_time,
                    'updated_time': moment(new Date()).format('HH:MM:ss'),
                    "Active": Number(val.active),
                    "client_admin_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).client_admin_id,
                    "site_admin_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Site Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).site_admin_id,
                    "clientt_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).clientt_id,
                };

                console.log('device_details', device_details)

                const options = {
                    url: api.CAMERA_CREATION,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: JSON.stringify(device_details)
                };

                // console.log(device_details)

                axios(options)
                    .then(response => {
                        console.log('response.data', response.data)
                        count = count + 1
                        camera_object[i] = { ...camera_object[i], camera_id: response.data._id }
                        if (count == camera_object2.length) {

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

                            const params = {
                                topic: `${val.ip_address.device_id}/camera_added`,
                                payload: JSON.stringify({}),
                                qos: 0
                            };

                            iot.publish(params, (err, data) => {
                                if (err) {
                                    console.error('Error publishing message:', err);
                                } else {
                                    console.log('Message published successfully:', data);
                                }
                            });


                            setflag(!flag)
                            setcamera_list_data([])
                            setcamera_list_data1([])
                            handleCloseuser_pass()
                            handleClose()
                            setcamera_save_loader(false)
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
        } else {
            alert("Cameras are not selected")
        }

    }


    return (
        <>
            {
                userData.position_type != 'Attendance User' ?
                    <div style={{ height: '95vh', overflowX: 'hidden' }}>

                        {
                            blur_div ?
                                <div>
                                    <div id='progress' style={{ display: 'block' }}>
                                        <div style={{ height: '95vh', width: `98%`, backgroundColor: 'rgb(128,128,128,0.5)', position: 'absolute', zIndex: 2 }}>
                                        </div>

                                        <div style={{ height: '95vh', width: `98%`, display: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', zIndex: 3 }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <CircularProgress style={{ color: '#e32747' }} />
                                                <p style={{ color: 'white' }}>Please wait...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : ''
                        }


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

                            <Modal
                                open={mask_div_open}
                                onClose={() => {
                                    setmask_div_open(false)
                                    setalertmodel(false)
                                }}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                style={{ marginLeft: 'auto', marginRight: 'auto', height: '85vh', width: '90%', top: 20, }}
                            >
                                <div style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <div style={{ backgroundColor: '#e22747', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
                                                <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>Camera Masking</p>
                                                <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                                    setmask_div_open(false)
                                                    setalertmodel(false)
                                                }} />
                                            </div>
                                        </Col>
                                    </Row>

                                    <div style={{ height: '85vh', backgroundColor: '#e6e8eb', overflow: 'scroll', overflowX: 'hidden', }}>
                                        <Row style={{ width: '100%', paddingRight: 0, paddingLeft: '15px', }}>

                                            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                <div>
                                                    <div style={{ backgroundColor: '#181828', padding: '10px', display: 'flex', alignItems: 'flex-end' }}>
                                                        {
                                                            <button style={{ backgroundColor: '#e22747', color: 'white', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginRight: '5px' }} onClick={() => {
                                                                let newdata = []
                                                                over_image_array.map((arr, v) => {
                                                                    if (alert_value._id == arr.id) {
                                                                        newdata.push({ ...arr, img_arr: [...arr.img_arr, { name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: false }] })
                                                                    } else {
                                                                        newdata.push(arr)
                                                                    }
                                                                })
                                                                setover_image_array(newdata)
                                                            }}>Add Range</button>
                                                        }

                                                        <div style={{ marginRight: '5px' }}>
                                                            <p style={{ color: 'white', marginBottom: '5px' }}>Range Name</p>
                                                            <input type='text' placeholder='Name' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', fontSize: '14px' }} onChange={(e) => {

                                                                let data = over_image_array
                                                                let newdata = []
                                                                data.map((da, i) => {
                                                                    if (da.id == alert_value._id) {
                                                                        newdata.push(da)
                                                                        da.img_arr.map((value, k) => {
                                                                            if (value.flag == true) {
                                                                                newdata[i].img_arr[k].name = e.target.value
                                                                            }
                                                                        })
                                                                    } else {
                                                                        newdata.push(da)
                                                                    }
                                                                })
                                                                console.log(newdata)
                                                                setover_image_array(newdata)
                                                                setmask_range_name(e.target.value)

                                                            }} value={mask_range_name} ></input>
                                                        </div>

                                                        {/* {
                                                            analytic_type == 'masking' ?
                                                                <div>
                                                                    <div style={{ backgroundColor: gps == `true` ? '#42cf10' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: gps == 'true' ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }} onClick={() => {

                                                                        if (gps == 'true') {
                                                                            setgps('false')
                                                                        } else {
                                                                            setgps('true')
                                                                        }
                                                                    }}>
                                                                        <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                                                    </div>
                                                                </div>
                                                                : ''
                                                        } */}

                                                        {
                                                            analytic_type == 'masking' ?
                                                                <>
                                                                    <div style={{ marginRight: '5px' }}>
                                                                        <p style={{ color: 'white', marginBottom: '5px' }}>From Time</p>
                                                                        <input id={`from`} type='time' placeholder='Name' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '5px', fontSize: '14px' }} onChange={(e) => {
                                                                            let data = over_image_array
                                                                            let newdata = []
                                                                            data.map((da, i) => {
                                                                                if (da.id == alert_value._id) {
                                                                                    newdata.push(da)
                                                                                    da.img_arr.map((value, k) => {
                                                                                        if (value.flag == true) {
                                                                                            newdata[i].img_arr[k].from_time = e.target.value
                                                                                        }
                                                                                    })
                                                                                } else {
                                                                                    newdata.push(da)
                                                                                }
                                                                            })
                                                                            setfrom_time(e.target.value)
                                                                            setover_image_array(newdata)
                                                                            // setmask_range_name(e.target.value)

                                                                        }} value={from_time}></input>
                                                                    </div>

                                                                    <div style={{ marginRight: '5px' }}>
                                                                        <p style={{ color: 'white', marginBottom: '5px' }}>To Time</p>
                                                                        <input id={`from`} type='time' placeholder='Name' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '5px', fontSize: '14px' }} onChange={(e) => {
                                                                            let data = over_image_array
                                                                            let newdata = []
                                                                            data.map((da, i) => {
                                                                                if (da.id == alert_value._id) {
                                                                                    newdata.push(da)
                                                                                    da.img_arr.map((value, k) => {
                                                                                        if (value.flag == true) {
                                                                                            newdata[i].img_arr[k].to_time = e.target.value
                                                                                        }
                                                                                    })
                                                                                } else {
                                                                                    newdata.push(da)
                                                                                }
                                                                            })
                                                                            setto_time(e.target.value)
                                                                            setover_image_array(newdata)
                                                                            // setmask_range_name(e.target.value)

                                                                        }} value={to_time}></input>
                                                                    </div>

                                                                    <div style={{ marginRight: '5px' }}>
                                                                        <p style={{ color: 'white', marginBottom: '5px' }}>Type</p>
                                                                        <div>
                                                                            <p type='text' style={{ backgroundColor: '#e6e8eb', padding: '10px', borderRadius: '5px', border: '1px solid gray', margin: 0, display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'black' }} onClick={() => {
                                                                                if (document.getElementById(`type`).style.display == 'block') {
                                                                                    document.getElementById(`type`).style.display = 'none'
                                                                                } else {
                                                                                    document.getElementById(`type`).style.display = 'block'
                                                                                }

                                                                            }}>{type}<span><ArrowDropDownIcon />
                                                                                </span></p>
                                                                        </div>


                                                                        <div
                                                                            id={`type`}
                                                                            style={{ backgroundColor: '#e6e8eb', padding: '15px', borderRadius: '5px', position: 'absolute', zIndex: 2, maxHeight: '150px', overflowY: 'scroll', display: 'none' }}>

                                                                            <div  >
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let data = over_image_array
                                                                                    let newdata = []
                                                                                    data.map((da, i) => {
                                                                                        if (da.id == alert_value._id) {
                                                                                            newdata.push(da)
                                                                                            da.img_arr.map((value, k) => {
                                                                                                if (value.flag == true) {
                                                                                                    newdata[i].img_arr[k].type = 'Intrution'
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            newdata.push(da)
                                                                                        }
                                                                                    })
                                                                                    settype('Intrution')
                                                                                    document.getElementById(`type`).style.display = 'none'
                                                                                    setover_image_array(newdata)
                                                                                    // setdirection_flag(!direction_flag)
                                                                                    // setdirection_name('LeftToRight')
                                                                                }}>Intrution</p>
                                                                                <hr></hr>
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let data = over_image_array
                                                                                    let newdata = []
                                                                                    data.map((da, i) => {
                                                                                        if (da.id == alert_value._id) {
                                                                                            newdata.push(da)
                                                                                            da.img_arr.map((value, k) => {
                                                                                                if (value.flag == true) {
                                                                                                    newdata[i].img_arr[k].type = 'Loitering'
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            newdata.push(da)
                                                                                        }
                                                                                    })
                                                                                    settype('Loitering')
                                                                                    document.getElementById(`type`).style.display = 'none'
                                                                                    setover_image_array(newdata)
                                                                                    // setdirection_flag(!direction_flag)
                                                                                    // setdirection_name('RightToLeft')
                                                                                }}>Loitering</p>
                                                                                <hr></hr>
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let data = over_image_array
                                                                                    let newdata = []
                                                                                    data.map((da, i) => {
                                                                                        if (da.id == alert_value._id) {
                                                                                            newdata.push(da)
                                                                                            da.img_arr.map((value, k) => {
                                                                                                if (value.flag == true) {
                                                                                                    newdata[i].img_arr[k].type = 'Crowd'
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            newdata.push(da)
                                                                                        }
                                                                                    })
                                                                                    settype('Crowd')
                                                                                    document.getElementById(`type`).style.display = 'none'
                                                                                    setover_image_array(newdata)
                                                                                    // setdirection_flag(!direction_flag)
                                                                                    // setdirection_name('RightToLeft')
                                                                                }}>Crowd</p>
                                                                                <hr></hr>
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let data = over_image_array
                                                                                    let newdata = []
                                                                                    data.map((da, i) => {
                                                                                        if (da.id == alert_value._id) {
                                                                                            newdata.push(da)
                                                                                            da.img_arr.map((value, k) => {
                                                                                                if (value.flag == true) {
                                                                                                    newdata[i].img_arr[k].type = 'Fire'
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            newdata.push(da)
                                                                                        }
                                                                                    })
                                                                                    settype('Fire')
                                                                                    document.getElementById(`type`).style.display = 'none'
                                                                                    setover_image_array(newdata)
                                                                                    // setdirection_flag(!direction_flag)
                                                                                    // setdirection_name('RightToLeft')
                                                                                }}>Fire</p>
                                                                                <hr></hr>
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let data = over_image_array
                                                                                    let newdata = []
                                                                                    data.map((da, i) => {
                                                                                        if (da.id == alert_value._id) {
                                                                                            newdata.push(da)
                                                                                            da.img_arr.map((value, k) => {
                                                                                                if (value.flag == true) {
                                                                                                    newdata[i].img_arr[k].type = 'Smoke'
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            newdata.push(da)
                                                                                        }
                                                                                    })
                                                                                    settype('Smoke')
                                                                                    document.getElementById(`type`).style.display = 'none'
                                                                                    setover_image_array(newdata)
                                                                                    // setdirection_flag(!direction_flag)
                                                                                    // setdirection_name('TopToBottom')
                                                                                }}>Smoke</p>
                                                                                <hr></hr>
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let data = over_image_array
                                                                                    let newdata = []
                                                                                    data.map((da, i) => {
                                                                                        if (da.id == alert_value._id) {
                                                                                            newdata.push(da)
                                                                                            da.img_arr.map((value, k) => {
                                                                                                if (value.flag == true) {
                                                                                                    newdata[i].img_arr[k].type = 'PPE'
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            newdata.push(da)
                                                                                        }
                                                                                    })
                                                                                    settype('PPE')
                                                                                    document.getElementById(`type`).style.display = 'none'
                                                                                    setover_image_array(newdata)
                                                                                    // setdirection_flag(!direction_flag)
                                                                                    // setdirection_name('BottomToTop')
                                                                                }}>PPE</p>
                                                                            </div>

                                                                        </div>

                                                                    </div>

                                                                    {
                                                                        type == 'Loitering' || type == 'Crowd' ?
                                                                            <div style={{ marginRight: '5px' }}>
                                                                                <p style={{ color: 'white', marginBottom: '5px' }}>{type == 'Loitering' ? 'Seconds' : 'Count'}</p>
                                                                                <input id={`threshold`} type='number' placeholder='Number' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '5px', fontSize: '14px' }} onChange={(e) => {
                                                                                    let data = over_image_array
                                                                                    let newdata = []
                                                                                    data.map((da, i) => {
                                                                                        if (da.id == alert_value._id) {
                                                                                            newdata.push(da)
                                                                                            da.img_arr.map((value, k) => {
                                                                                                if (value.flag == true) {
                                                                                                    newdata[i].img_arr[k].threshold = e.target.value
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            newdata.push(da)
                                                                                        }
                                                                                    })
                                                                                    console.log(newdata)
                                                                                    setthreshold(e.target.value)
                                                                                    setover_image_array(newdata)
                                                                                    // setmask_range_name(e.target.value)

                                                                                }} value={threshold}></input>
                                                                            </div>
                                                                            : ''

                                                                    }

                                                                    {
                                                                        type == 'Loitering' || type == 'Intrution' ?
                                                                            <div style={{ marginRight: '5px' }}>
                                                                                <p style={{ color: 'white', marginBottom: '5px' }}>Class</p>
                                                                                <div>
                                                                                    <p type='text' style={{ backgroundColor: '#e6e8eb', padding: '10px', borderRadius: '5px', border: '1px solid gray', margin: 0, display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'black' }} onClick={() => {
                                                                                        if (document.getElementById(`class`).style.display == 'block') {
                                                                                            document.getElementById(`class`).style.display = 'none'
                                                                                        } else {
                                                                                            document.getElementById(`class`).style.display = 'block'
                                                                                        }

                                                                                    }}>{class_name}<span><ArrowDropDownIcon />
                                                                                        </span></p>
                                                                                </div>
                                                                                <div
                                                                                    id={`class`}
                                                                                    style={{ backgroundColor: '#e6e8eb', padding: '15px', borderRadius: '5px', position: 'absolute', zIndex: 2, maxHeight: '150px', overflowY: 'scroll', display: 'none' }}>

                                                                                    <div  >
                                                                                        <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                            let data = over_image_array
                                                                                            let newdata = []
                                                                                            data.map((da, i) => {
                                                                                                if (da.id == alert_value._id) {
                                                                                                    newdata.push(da)
                                                                                                    da.img_arr.map((value, k) => {
                                                                                                        if (value.flag == true) {
                                                                                                            newdata[i].img_arr[k].class_name = 'People'
                                                                                                        }
                                                                                                    })
                                                                                                } else {
                                                                                                    newdata.push(da)
                                                                                                }
                                                                                            })
                                                                                            setclass_name('People')
                                                                                            document.getElementById(`class`).style.display = 'none'
                                                                                            setover_image_array(newdata)
                                                                                            // setdirection_flag(!direction_flag)
                                                                                            // setdirection_name('LeftToRight')
                                                                                        }}>People</p>
                                                                                        <hr></hr>
                                                                                        <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                            let data = over_image_array
                                                                                            let newdata = []
                                                                                            data.map((da, i) => {
                                                                                                if (da.id == alert_value._id) {
                                                                                                    newdata.push(da)
                                                                                                    da.img_arr.map((value, k) => {
                                                                                                        if (value.flag == true) {
                                                                                                            newdata[i].img_arr[k].class_name = 'Vehicle'
                                                                                                        }
                                                                                                    })
                                                                                                } else {
                                                                                                    newdata.push(da)
                                                                                                }
                                                                                            })
                                                                                            setclass_name('Vehicle')
                                                                                            document.getElementById(`class`).style.display = 'none'
                                                                                            setover_image_array(newdata)
                                                                                            // setdirection_flag(!direction_flag)
                                                                                            // setdirection_name('LeftToRight')
                                                                                        }}>Vehicle</p>
                                                                                        <hr></hr>
                                                                                        <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                            let data = over_image_array
                                                                                            let newdata = []
                                                                                            data.map((da, i) => {
                                                                                                if (da.id == alert_value._id) {
                                                                                                    newdata.push(da)
                                                                                                    da.img_arr.map((value, k) => {
                                                                                                        if (value.flag == true) {
                                                                                                            newdata[i].img_arr[k].class_name = 'Animal'
                                                                                                        }
                                                                                                    })
                                                                                                } else {
                                                                                                    newdata.push(da)
                                                                                                }
                                                                                            })
                                                                                            setclass_name('Vehicle')
                                                                                            document.getElementById(`class`).style.display = 'none'
                                                                                            setover_image_array(newdata)
                                                                                            // setdirection_flag(!direction_flag)
                                                                                            // setdirection_name('LeftToRight')
                                                                                        }}>Animal</p>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                            : ''
                                                                    }
                                                                </>
                                                                : ''
                                                        }

                                                        {
                                                            analytic_type != 'masking' && analytic_type != 'face_masking' && analytic_type != 'anpr_masking' ?

                                                                <div style={{ marginRight: '5px' }}>
                                                                    <p style={{ color: 'white', marginBottom: '5px' }}>Range</p>
                                                                    <div>
                                                                        <p type='text' style={{ backgroundColor: '#e6e8eb', padding: '10px', borderRadius: '5px', border: '1px solid gray', margin: 0, display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'black' }} onClick={() => {
                                                                            setdirection_flag(!direction_flag)

                                                                        }}>{direction_name}<span>
                                                                                {direction_flag ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                                                            </span></p>
                                                                    </div>

                                                                    {direction_flag ?
                                                                        <div
                                                                            // id={`site${val}`} 
                                                                            style={{ backgroundColor: '#e6e8eb', padding: '15px', borderRadius: '5px', position: 'absolute', zIndex: 2, maxHeight: '150px', overflowY: 'scroll' }}>

                                                                            <div  >
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let data = over_image_array
                                                                                    let newdata = []
                                                                                    data.map((da, i) => {
                                                                                        if (da.id == alert_value._id) {
                                                                                            newdata.push(da)
                                                                                            da.img_arr.map((value, k) => {
                                                                                                if (value.flag == true) {
                                                                                                    newdata[i].img_arr[k].direction = 'LeftToRight'
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            newdata.push(da)
                                                                                        }
                                                                                    })
                                                                                    setover_image_array(newdata)
                                                                                    setdirection_flag(!direction_flag)
                                                                                    setdirection_name('LeftToRight')
                                                                                }}>LeftToRight</p>
                                                                                <hr></hr>
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let data = over_image_array
                                                                                    let newdata = []
                                                                                    data.map((da, i) => {
                                                                                        if (da.id == alert_value._id) {
                                                                                            newdata.push(da)
                                                                                            da.img_arr.map((value, k) => {
                                                                                                if (value.flag == true) {
                                                                                                    newdata[i].img_arr[k].direction = 'RightToLeft'
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            newdata.push(da)
                                                                                        }
                                                                                    })
                                                                                    setover_image_array(newdata)
                                                                                    setdirection_flag(!direction_flag)
                                                                                    setdirection_name('RightToLeft')
                                                                                }}>RightToLeft</p>
                                                                                <hr></hr>
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let data = over_image_array
                                                                                    let newdata = []
                                                                                    data.map((da, i) => {
                                                                                        if (da.id == alert_value._id) {
                                                                                            newdata.push(da)
                                                                                            da.img_arr.map((value, k) => {
                                                                                                if (value.flag == true) {
                                                                                                    newdata[i].img_arr[k].direction = 'TopToBottom'
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            newdata.push(da)
                                                                                        }
                                                                                    })
                                                                                    setover_image_array(newdata)
                                                                                    setdirection_flag(!direction_flag)
                                                                                    setdirection_name('TopToBottom')
                                                                                }}>TopToBottom</p>
                                                                                <hr></hr>
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let data = over_image_array
                                                                                    let newdata = []
                                                                                    data.map((da, i) => {
                                                                                        if (da.id == alert_value._id) {
                                                                                            newdata.push(da)
                                                                                            da.img_arr.map((value, k) => {
                                                                                                if (value.flag == true) {
                                                                                                    newdata[i].img_arr[k].direction = 'BottomToTop'
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            newdata.push(da)
                                                                                        }
                                                                                    })
                                                                                    setover_image_array(newdata)
                                                                                    setdirection_flag(!direction_flag)
                                                                                    setdirection_name('BottomToTop')
                                                                                }}>BottomToTop</p>
                                                                            </div>

                                                                        </div>
                                                                        : ''
                                                                    }

                                                                </div>
                                                                : ''
                                                        }

                                                        {
                                                            analytic_type == 'vehicle_masking' ?

                                                                <div style={{ marginRight: '5px' }}>
                                                                    <p style={{ color: 'white', marginBottom: '5px' }}>Sequence</p>
                                                                    <div style={{ position: 'relative' }}>
                                                                        <p type='text' style={{ backgroundColor: '#e6e8eb', padding: '10px', borderRadius: '5px', border: '1px solid gray', margin: 0, marginRight: '20px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'black' }} onClick={() => {
                                                                            setin_out_flag(!in_out_flag)

                                                                        }}>{in_out}<span>
                                                                                {in_out_flag ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                                                            </span></p>
                                                                    </div>

                                                                    {in_out_flag ?
                                                                        <div
                                                                            // id={`site${val}`} 
                                                                            style={{ backgroundColor: '#e6e8eb', padding: '15px', borderRadius: '5px', position: 'absolute', zIndex: 2, maxHeight: '150px' }}>

                                                                            <div  >
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let data = over_image_array
                                                                                    let newdata = []
                                                                                    data.map((da, i) => {
                                                                                        if (da.id == alert_value._id) {
                                                                                            newdata.push(da)
                                                                                            da.img_arr.map((value, k) => {
                                                                                                if (value.flag == true) {
                                                                                                    newdata[i].img_arr[k].sequence = 'In'
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            newdata.push(da)
                                                                                        }
                                                                                    })
                                                                                    setover_image_array(newdata)
                                                                                    setin_out_flag(!in_out_flag)
                                                                                    setin_out('In')
                                                                                }}>In</p>
                                                                                <hr></hr>
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let data = over_image_array
                                                                                    let newdata = []
                                                                                    data.map((da, i) => {
                                                                                        if (da.id == alert_value._id) {
                                                                                            newdata.push(da)
                                                                                            da.img_arr.map((value, k) => {
                                                                                                if (value.flag == true) {
                                                                                                    newdata[i].img_arr[k].sequence = 'Out'
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            newdata.push(da)
                                                                                        }
                                                                                    })
                                                                                    setover_image_array(newdata)
                                                                                    setin_out_flag(!in_out_flag)
                                                                                    setin_out('Out')
                                                                                }}>Out</p>
                                                                                <hr></hr>
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let data = over_image_array
                                                                                    let newdata = []
                                                                                    data.map((da, i) => {
                                                                                        if (da.id == alert_value._id) {
                                                                                            newdata.push(da)
                                                                                            da.img_arr.map((value, k) => {
                                                                                                if (value.flag == true) {
                                                                                                    newdata[i].img_arr[k].sequence = 'In & Out'
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            newdata.push(da)
                                                                                        }
                                                                                    })
                                                                                    setover_image_array(newdata)
                                                                                    setin_out_flag(!in_out_flag)
                                                                                    setin_out('In & Out')
                                                                                }}>In & Out</p>
                                                                            </div>

                                                                        </div>
                                                                        : ''
                                                                    }

                                                                </div>
                                                                : ''
                                                        }

                                                    </div>
                                                    <div style={{ padding: '10px', display: 'flex', backgroundColor: '#181828' }}>
                                                        {over_image_array.map((parentItem, index) => (
                                                            <div style={{ display: 'flex' }}>
                                                                {parentItem.img_arr.map((childItem, idx) => (
                                                                    <div style={{ backgroundColor: parentItem.img_arr[idx].flag ? '#e32747' : 'transparent', color: parentItem.img_arr[idx].flag ? 'white' : '#7f7f7e', padding: '5px', borderRadius: '20px', border: '1px solid gray', marginRight: '10px', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                                        <p style={{ marginBottom: 0, marginRight: '5px' }} onClick={() => {
                                                                            let data = over_image_array
                                                                            for (let index1 = 0; index1 < data[index].img_arr.length; index1++) {
                                                                                data[index].img_arr[index1].flag = false
                                                                            }
                                                                            data[index].img_arr[idx].flag = true

                                                                            console.log(data[index].img_arr[idx].url);
                                                                            console.log(over_image_array);

                                                                            get_image_url(data[index].img_arr[idx].url)
                                                                            setover_image_array(data)
                                                                            setmask_range_name(data[index].img_arr[idx].name)
                                                                            setdirection_name(data[index].img_arr[idx].direction)
                                                                            setin_out(data[index].img_arr[idx].sequence)
                                                                            setfrom_time(data[index].img_arr[idx].from_time)
                                                                            setto_time(data[index].img_arr[idx].to_time)
                                                                            settype(data[index].img_arr[idx].type)
                                                                            setclass_name(data[index].img_arr[idx].class)
                                                                            setthreshold(data[index].img_arr[idx].threshold)
                                                                        }}> {childItem.name}</p>

                                                                        <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {




                                                                        }} />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <MaskSelection image_edited={edit_image} data1={alert_value} camera_name={alert_value.camera_gereral_name} mask1={mask_image} p={0} type='one_mask' analytic_type={analytic_type} over_image_array={over_image_array} fun_over_image_array={fun_over_image_array} second_flag={second_flag} />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    {/* <ClientDevice /> */}
                                </div>
                            </Modal>




                            {/* Choose Mode */}

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
                                                        const data = {
                                                            "client_id": userDataFromLocalStorge._id
                                                        }
                                                        axios.post(`${api.LIST_SUBSCRIPTION_PLAN}`, data).then((res) => {
                                                            setSubscriptionPlanData(res.data.sub)
                                                            handleOpenMannualModel()
                                                            setIsChooseMode(false)
                                                        })
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
                                style={{ marginLeft: 'auto', marginRight: 'auto', height: 550, width: '50%', top: 20, zIndex: 1 }}
                            >
                                <div style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <div style={{ backgroundColor: '#e22747', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '30%', }} >
                                                    <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>ADD CAMERA(s)</p>
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
                                                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                                                                                            <div>
                                                                                                <p style={{ margin: 0, color: 'black' }}>Camera Mp : <span style={{ color: '#e22747' }}>{d.camera_mp}</span></p>
                                                                                            </div>

                                                                                            <div>
                                                                                                {
                                                                                                    addCameraMannullyArray.length > 1 ?
                                                                                                        <HighlightOffIcon style={{ color: '#e22747', cursor: 'pointer' }} onClick={() => {
                                                                                                            let arr = []
                                                                                                            camera_object.map((camdata, val) => {
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
                                                                                                        : ''
                                                                                                }

                                                                                            </div>
                                                                                        </div>
                                                                                    </Col>
                                                                                    : ''
                                                                            }



                                                                            {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
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
                                                                            </Col> */}

                                                                            <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                                <div>
                                                                                    <p style={{ color: 'black', marginTop: '15px', marginBottom: '5px' }}>Device</p>
                                                                                    <div style={{ position: 'relative', zIndex: 2 }}>
                                                                                        <p type='text' style={{ backgroundColor: '#e6e8eb', margin: 0, padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'black' }} onClick={() => {
                                                                                            setIsOpenMannualDeviceOption(!isOpenMannualDeviceOption)
                                                                                            let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                            let index = addCameraMannullyArray.indexOf(findArray)
                                                                                            let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                            filterArray.splice(index, 0, { ...findArray, flag: d.flag === true ? false : true })
                                                                                            setAddCameraMannullyArray(filterArray)

                                                                                        }}>{d.device_id.deviceName === '' ? 'Select' : d.device_id.deviceName}<span>
                                                                                                {isOpenMannualDeviceOption && d.flag ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                                                                            </span></p>

                                                                                    </div>




                                                                                    {isOpenMannualDeviceOption &&
                                                                                        d.flag === true &&

                                                                                        <div
                                                                                            // id={`site${val}`} 
                                                                                            style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', zIndex: 2, maxHeight: '150px', overflowY: 'scroll' }}
                                                                                        >
                                                                                            {
                                                                                                device_list.length !== 0 ?
                                                                                                    <div>
                                                                                                        {
                                                                                                            device_list.map((sites, siteIndex) => (

                                                                                                                <div key={siteIndex} >
                                                                                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                                                        let editedData = {
                                                                                                                            deviceName: sites.device_name,
                                                                                                                            deviceId: sites.device_id
                                                                                                                        }
                                                                                                                        filterArray.splice(index, 0, { ...findArray, device_id: editedData, flag: d.flag === true ? false : true })
                                                                                                                        setAddCameraMannullyArray(filterArray)

                                                                                                                        setIsOpenMannualDeviceOption(false)

                                                                                                                    }}>{sites.device_name}</p>

                                                                                                                    <hr></hr>
                                                                                                                </div>
                                                                                                            ))
                                                                                                        }
                                                                                                    </div>

                                                                                                    :
                                                                                                    <p style={{ padding: '0', margin: 0, color: 'black' }}>No Device</p>
                                                                                            }
                                                                                        </div>
                                                                                    }

                                                                                </div>
                                                                            </Col>

                                                                            <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                                <div>
                                                                                    <p style={{ color: 'black', marginTop: '15px', marginBottom: '5px' }}>Site</p>
                                                                                    <div style={{ position: 'relative', zIndex: 2 }}>
                                                                                        <p type='text' style={{ backgroundColor: '#e6e8eb', margin: 0, padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'black' }} onClick={() => {
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



                                                                            {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
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
                                                                            </Col> */}


                                                                            <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                                <div style={{ marginTop: '5px' }}>
                                                                                    <p style={{ color: 'black', marginBottom: '5px' }}>Camera Name</p>
                                                                                    <input type='text' placeholder='Enter Camera Name' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                                        // console.log(index)
                                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                        let value = e.target.value
                                                                                        filterArray.splice(index, 0, { ...findArray, name: value })
                                                                                        setAddCameraMannullyArray(filterArray)
                                                                                    }} value={d.name} ></input>
                                                                                </div>
                                                                            </Col>

                                                                            <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                                <div>
                                                                                    <p style={{ color: 'black', marginTop: '5px', marginBottom: '5px' }}>Main Stream</p>
                                                                                    <input type='text' disabled={d.device_id.deviceName != '' ? false : true} placeholder='Enter Ip Address' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                        let value = e.target.value
                                                                                        filterArray.splice(index, 0, { ...findArray, main_stream: value })
                                                                                        setAddCameraMannullyArray(filterArray)
                                                                                    }} onBlur={() => {
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

                                                                                        const params = {
                                                                                            topic: `${d.device_id.deviceId}/get_camera_mp`,
                                                                                            payload: JSON.stringify({ rtsp: d.main_stream, socket_id: socket.id }),
                                                                                            qos: 0
                                                                                        };

                                                                                        iot.publish(params, (err, data) => {
                                                                                            if (err) {
                                                                                                console.error('Error publishing message:', err);
                                                                                            } else {
                                                                                                if (socket_camera_count == -1) {
                                                                                                    socket_camera_count = 1
                                                                                                } else {
                                                                                                    socket_camera_count = socket_camera_count + 1
                                                                                                }

                                                                                                console.log('Message published successfully:', data);
                                                                                            }
                                                                                        });
                                                                                    }} value={d.main_stream} ></input>
                                                                                </div>
                                                                            </Col>

                                                                            {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                                <div style={{ marginTop: '5px' }}>
                                                                                    <p style={{ color: 'black', marginBottom: '5px' }}>Sub Stream</p>
                                                                                    <input type='text' placeholder='Enter Ip Address' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                        let value = e.target.value
                                                                                        filterArray.splice(index, 0, { ...findArray, sub_stream: value })
                                                                                        setAddCameraMannullyArray(filterArray)
                                                                                    }} value={d.sub_stream} ></input>
                                                                                </div>
                                                                            </Col> */}

                                                                            {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                                <div style={{ marginTop: '5px' }}>
                                                                                    <p style={{ color: 'black', marginBottom: '5px' }}>User Name</p>
                                                                                    <input type='text' placeholder='Enter Ip Address' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                        let value = e.target.value
                                                                                        filterArray.splice(index, 0, { ...findArray, user_name: value })
                                                                                        setAddCameraMannullyArray(filterArray)
                                                                                    }} value={d.user_name} ></input>
                                                                                </div>
                                                                            </Col> */}

                                                                            {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                                <div style={{ marginTop: '5px' }}>
                                                                                    <p style={{ color: 'black', marginBottom: '5px' }}>Password</p>
                                                                                    <input type='text' placeholder='Enter Ip Address' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                        let value = e.target.value
                                                                                        filterArray.splice(index, 0, { ...findArray, password: value })
                                                                                        setAddCameraMannullyArray(filterArray)
                                                                                    }} value={d.password} ></input>
                                                                                </div>
                                                                            </Col> */}

                                                                            {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                                <div style={{ marginTop: '5px' }}>
                                                                                    <p style={{ color: 'black', marginBottom: '5px' }}>Camera Mp</p>
                                                                                    <input type='number' placeholder='Enter Ip Address' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                        let value = e.target.value
                                                                                        filterArray.splice(index, 0, { ...findArray, camera_mp: value })
                                                                                        setAddCameraMannullyArray(filterArray)
                                                                                    }} value={d.camera_mp} ></input>
                                                                                </div>
                                                                            </Col> */}

                                                                            <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                                <div>
                                                                                    <p style={{ color: 'black', marginTop: '5px', marginBottom: '5px' }}>Active</p>
                                                                                    <div style={{ position: 'relative' }}>
                                                                                        <p type='text' style={{ backgroundColor: '#e6e8eb', margin: 0, padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'black' }} onClick={() => {
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

                                                                            {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
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
                                                                            </Col> */}


                                                                            {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
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
                                                                            </Col> */}

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
                                                            // console.log("total Data, Add camera button clicked", addCameraMannullyArray)

                                                            // Ckeck if the inputs are filled or not


                                                            let checkFlag = false
                                                            let camera_count = 0

                                                            let camera_mp = { _2mp: 0, _4mp: 0, _8mp: 0 }
                                                            let alert_str = ''
                                                            let available_str = ''

                                                            subscriptionPlanData.map((plan, index) => {
                                                                camera_mp._2mp = camera_mp._2mp + plan.cameras_for_add._2mp
                                                                camera_mp._4mp = camera_mp._4mp + plan.cameras_for_add._4mp
                                                                camera_mp._8mp = camera_mp._8mp + plan.cameras_for_add._8mp
                                                            })

                                                            for (let check = 0; check < addCameraMannullyArray.length; check++) {
                                                                if (addCameraMannullyArray[check].name !== '' && addCameraMannullyArray[check].device_id.deviceId != '' && addCameraMannullyArray[check].site !== '' && addCameraMannullyArray[check].active !== '' && addCameraMannullyArray[check].main_stream !== '') {
                                                                    checkFlag = true
                                                                    let plan_flag = false

                                                                    if (addCameraMannullyArray[check].camera_mp !== 0) {
                                                                        for (let index = 0; index < subscriptionPlanData.length; index++) {
                                                                            if (addCameraMannullyArray[check].camera_mp === 2 && subscriptionPlanData[index].cameras_for_add._2mp > 0) {
                                                                                addCameraMannullyArray[check] = {
                                                                                    ...addCameraMannullyArray[check],
                                                                                    plan_end_date: subscriptionPlanData[index].sub.end_date,
                                                                                    plan_end_time: subscriptionPlanData[index].sub.end_time,
                                                                                    plan_start_date: subscriptionPlanData[index].sub.start_date,
                                                                                    plan_start_time: subscriptionPlanData[index].sub.start_time,
                                                                                    subscribe_id: subscriptionPlanData[index].sub._id
                                                                                }
                                                                                plan_flag = true
                                                                                break
                                                                            } else if (addCameraMannullyArray[check].camera_mp === 4 && subscriptionPlanData[index].cameras_for_add._4mp > 0) {
                                                                                addCameraMannullyArray[check] = {
                                                                                    ...addCameraMannullyArray[check],
                                                                                    plan_end_date: subscriptionPlanData[index].sub.end_date,
                                                                                    plan_end_time: subscriptionPlanData[index].sub.end_time,
                                                                                    plan_start_date: subscriptionPlanData[index].sub.start_date,
                                                                                    plan_start_time: subscriptionPlanData[index].sub.start_time,
                                                                                    subscribe_id: subscriptionPlanData[index].sub._id
                                                                                }
                                                                                plan_flag = true
                                                                                break
                                                                            } else if (addCameraMannullyArray[check].camera_mp === 8 && subscriptionPlanData[index].cameras_for_add._8mp > 0) {
                                                                                addCameraMannullyArray[check] = {
                                                                                    ...addCameraMannullyArray[check],
                                                                                    plan_end_date: subscriptionPlanData[index].sub.end_date,
                                                                                    plan_end_time: subscriptionPlanData[index].sub.end_time,
                                                                                    plan_start_date: subscriptionPlanData[index].sub.start_date,
                                                                                    plan_start_time: subscriptionPlanData[index].sub.start_time,
                                                                                    subscribe_id: subscriptionPlanData[index].sub._id
                                                                                }
                                                                                plan_flag = true
                                                                                break
                                                                            } else {

                                                                                if (addCameraMannullyArray[check].camera_mp == false) {
                                                                                    available_str = `${available_str}, ${addCameraMannullyArray[check].name} `
                                                                                } else {
                                                                                    plan_flag = false
                                                                                }
                                                                            }
                                                                        }

                                                                        if (!plan_flag) {
                                                                            alert_str = `${alert_str}, ${addCameraMannullyArray[check].camera_mp} `
                                                                        }
                                                                    }
                                                                } else {
                                                                    checkFlag = false
                                                                    break;
                                                                }
                                                            }

                                                            if (!checkFlag) {
                                                                alert("Please fill out all required fields.")
                                                            } else if (socket_camera_count != 0) {
                                                                setblur_div(true)
                                                            } else if (available_str != '') {
                                                                alert(`${available_str} cameras not available`)
                                                            } else if (alert_str != '') {
                                                                alert('Plan not eligibal')
                                                            }


                                                            // Creeate a device details for every device
                                                            if (socket_camera_count == 0) {
                                                                if (checkFlag && alert_str == '' && available_str == '') {
                                                                    addCameraMannullyArray.map((value) => {
                                                                        const device_details = {
                                                                            "dealer_id": (JSON.parse(localStorage.getItem("userData"))).dealer_id,
                                                                            "user_id": (JSON.parse(localStorage.getItem("userData")))._id,
                                                                            'device_id': value.device_id.deviceId,
                                                                            'camera_gereral_name': value.name,
                                                                            "camera_id": value.id,
                                                                            "site_id": value.site.siteId,
                                                                            "from": value.fromTime,
                                                                            "to": value.toTime,
                                                                            "camera_username": (JSON.parse(localStorage.getItem("userData"))).User_name,
                                                                            "password": (JSON.parse(localStorage.getItem("userData"))).password,
                                                                            "camera_url": value.main_stream,
                                                                            "live_uri": value.sub_stream,
                                                                            "camera_username": value.user_name,
                                                                            "password": value.password,
                                                                            "camera_mp": value.camera_mp,
                                                                            "plan_end_date": value.plan_end_date,
                                                                            "plan_end_time": value.plan_end_time,
                                                                            "plan_start_date": value.plan_start_date,
                                                                            "plan_start_time": value.start_time,
                                                                            "subscribe_id": value.subscribe_id,
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

                                                                        // console.log(device_details)

                                                                        console.log(device_details)

                                                                        // Api Call
                                                                        // axios(options)
                                                                        //     .then(response => {
                                                                        //         console.log(response.data)
                                                                        //         // count1 = 0
                                                                        //         // count = 0
                                                                        //         camera_count = camera_count + 1

                                                                        //         if (camera_count == addCameraMannullyArray.length) {
                                                                        //             socket_camera_count = -1
                                                                        //             setflag(!flag)
                                                                        //             // list_camera_site_id(selected_sites)
                                                                        //             // setcamera_list_data([])
                                                                        //             // setcamera_list_data1([])
                                                                        //             setIsOpenMannualModel(false)
                                                                        //             handleClose()
                                                                        //             get_group_list()
                                                                        //         }

                                                                        //     })
                                                                        //     .catch(function (e) {
                                                                        //         if (e.message === 'Network Error') {
                                                                        //             alert("No Internet Found. Please check your internet connection")
                                                                        //         }
                                                                        //         else {

                                                                        //             alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                                                                        //         }

                                                                        //     });
                                                                    })

                                                                }
                                                                else {
                                                                    // alert("Please fill out all required fields.")
                                                                }
                                                            } else {

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


                                                        }}>Add Cameras</button>
                                                    </Col>
                                                </Row>
                                            </div>
                                    }
                                </div>
                            </Modal>

                            <Modal
                                open={alertmodel}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                style={{ marginLeft: 'auto', marginRight: 'auto', height: 550, width: '50%', top: 20, }}
                            >
                                <div style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <div style={{ backgroundColor: '#e22747', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', width: '30%', }} >
                                                    <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>ALERT TIME</p>
                                                </div>
                                                <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                                    setalertmodel(false)
                                                }} />
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row style={{ padding: '0px', alignItems: 'center', padding: '10px' }}>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <div style={{ cursor: 'pointer', display: 'flex', overflowX: 'scroll' }} >
                                                {
                                                    subscriptionPlanData.sub?.map((plans, planIndex) => (
                                                        <div key={planIndex} onClick={() => {
                                                            setUserSelectedPlan(plans)
                                                            setIsPlanSelected(true)

                                                        }
                                                        }  >


                                                            <div style={{
                                                                border: userSelectedPlan && plans.sub?._id === userSelectedPlan.sub?._id ? '4px solid black' : '1px solid black',
                                                                display: 'inline-block', borderRadius: '5px', padding: '5px',
                                                                backgroundColor: userSelectedPlan && plans.sub?._id === userSelectedPlan.sub?._id ? 'lightgray' : 'white',
                                                                width: '23rem',
                                                                marginRight: '10px'
                                                            }}

                                                                key={planIndex} >
                                                                <div>
                                                                    <p style={{ margin: 0 }}>Your plan</p>
                                                                    <div  >
                                                                        <div style={{ border: '1px solid grey', borderRadius: '5px', display: 'inline-block', color: 'black', backgroundColor: 'white', marginRight: '10px' }}>
                                                                            <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
                                                                                <p style={{ padding: '5px', margin: 0, }}>2 mp cameras</p>
                                                                            </div>
                                                                            <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                                                                                <div style={{ marginRight: '10px' }}>
                                                                                    <p style={{ margin: 0 }}>Motion triggered</p>
                                                                                    <p style={{ margin: 0 }}>24/Continuous</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p style={{ margin: 0 }}> {plans.sub._2mp.motion.motion - plans.cameras_options._2mp.motion} / {plans.sub._2mp.motion.motion}</p>
                                                                                    <p style={{ margin: 0 }}> {plans.sub._2mp.continues.continues - plans.cameras_options._2mp.continues} / {plans.sub._2mp.continues.continues}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div style={{ border: '1px solid grey', borderRadius: '5px', display: 'inline-block', color: 'black', backgroundColor: 'white' }}>
                                                                            <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
                                                                                <p style={{ padding: '5px', margin: 0, }}>4 mp cameras</p>
                                                                            </div>
                                                                            <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                                                                                <div style={{ marginRight: '10px' }}>
                                                                                    <p style={{ margin: 0 }}>Motion triggered</p>
                                                                                    <p style={{ margin: 0 }}>24/Continuous</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p style={{ margin: 0 }}> {plans.sub._4mp.motion.motion - plans.cameras_options._4mp.motion} / {plans.sub._4mp.motion.motion}</p>
                                                                                    <p style={{ margin: 0 }}> {plans.sub._4mp.continues.continues - plans.cameras_options._4mp.continues} / {plans.sub._4mp.continues.continues}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div style={{ border: '1px solid grey', borderRadius: '5px', display: 'inline-block', color: 'black', backgroundColor: 'white', marginRight: '10px', marginTop: '5px' }}>
                                                                            <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
                                                                                <p style={{ padding: '5px', margin: 0, }}>8 mp cameras</p>
                                                                            </div>
                                                                            <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                                                                                <div style={{ marginRight: '10px' }}>
                                                                                    <p style={{ margin: 0 }}>Motion triggered</p>
                                                                                    <p style={{ margin: 0 }}>24/Continuous</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p style={{ margin: 0 }}> {plans.sub._8mp.motion.motion - plans.cameras_options._8mp.motion} / {plans.sub._8mp.motion.motion}</p>
                                                                                    <p style={{ margin: 0 }}> {plans.sub._8mp.continues.continues - plans.cameras_options._8mp.continues} / {plans.sub._8mp.continues.continues}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div style={{ border: '1px solid grey', borderRadius: '5px', display: 'inline-block', color: 'black', backgroundColor: 'white', width: '170px', marginTop: '5px' }}>
                                                                            <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
                                                                                <p style={{ padding: '5px', margin: 0, }}>Storage</p>
                                                                            </div>
                                                                            <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                                                                                <div style={{ marginRight: '10px' }}>
                                                                                    <p style={{ margin: 0 }}>Cloud</p>
                                                                                    <p style={{ margin: 0 }}>Local</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p style={{ margin: 0 }}> {plans.sub.options.cloud} Days</p>
                                                                                    <p style={{ margin: 0 }}> {plans.sub.options.local} Days</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div style={{ border: '1px solid grey', borderRadius: '5px', color: 'black', backgroundColor: 'white', marginTop: '5px' }}>
                                                                        <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
                                                                            <p style={{ padding: '5px', margin: 0, }}>Other Subscription</p>
                                                                        </div>
                                                                        <div style={{ display: 'flex', padding: '5px' }}>
                                                                            <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                                                                                <div style={{ marginRight: '10px' }}>
                                                                                    <p style={{ margin: 0 }}>Alert</p>
                                                                                    <p style={{ margin: 0 }}>Analytic</p>
                                                                                    <p style={{ margin: 0 }}>Live Stream</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p style={{ margin: 0 }}>{plans.sub.options.alert - plans.cameras_options.alert} / {plans.sub.options.alert}</p>
                                                                                    <p style={{ margin: 0 }}>{plans.sub.options.analytics - plans.cameras_options.analytics} / {plans.sub.options.analytics}</p>
                                                                                    <p style={{ margin: 0 }}>{plans.cameras_options.live_stream == undefined ? 0 : plans.sub.options.live_stream - plans.cameras_options.live_stream} / {plans.sub.options.live_stream == undefined ? 0 : plans.sub.options.live_stream}</p>
                                                                                </div>
                                                                            </div>
                                                                            {/* <div style={{ display: 'flex', alignItems: 'center', width: '35%' }}>
                                                    <div style={{ marginRight: '10px' }}>
                                                    <p style={{ margin: 0 }}>People Analytics</p>
                                                      <p style={{ margin: 0 }}>Vehicle Analytics</p>
                                                    </div>
                                                    <div>
                                                    <p style={{ margin: 0 }}>{plans.sub.options.people_analytics - plans.cameras_options.people_analytics} / {plans.cameras_options.people_analytics}</p>
                                                      <p style={{ margin: 0 }}>{plans.sub.options.vehicle_analytics - plans.cameras_options.vehicle_analytics} / {plans.cameras_options.vehicle_analytics}</p>
                              
                                                    </div>
                                                  </div> */}

                                                                            <div style={{ display: 'flex', width: '50%' }}>
                                                                                <div style={{ marginRight: '10px' }}>
                                                                                    <p style={{ margin: 0 }}>People Analytics</p>
                                                                                    <p style={{ margin: 0 }}>Vehicle Analytics</p>
                                                                                    <p style={{ margin: 0 }}>Face Dedaction</p>
                                                                                    {/* <p style={{ margin: 0 }}>Cloud</p> */}
                                                                                </div>
                                                                                <div>
                                                                                    <p style={{ margin: 0 }}>{plans.sub.options.people_analytics - plans.cameras_options.people_analytics} / {plans.sub.options.people_analytics}</p>
                                                                                    <p style={{ margin: 0 }}>{plans.sub.options.vehicle_analytics - plans.cameras_options.vehicle_analytics} / {plans.sub.options.vehicle_analytics}</p>
                                                                                    <p style={{ margin: 0 }}>{plans.cameras_options.face_dedaction == undefined ? 0 : plans.sub.options.face_dedaction - plans.cameras_options.face_dedaction} / {plans.sub.options.face_dedaction == undefined ? 0 : plans.sub.options.face_dedaction}</p>
                                                                                    {/* <p style={{ margin: 0 }}>{plans.sub.options.cloud - plans.cameras_options.cloud} / {plans.sub.options.cloud}</p> */}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }


                                            </div>
                                        </Col>

                                        {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                            <div style={{ marginTop: '5px' }}>
                                                <p style={{ color: 'black', marginBottom: '5px' }}>From Time</p>
                                                <input type='time' placeholder='Enter Client Id' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                    setalert_start_time(e.target.value)
                                                }}

                                                    value={alert_start_time}
                                                ></input>
                                            </div>
                                        </Col> */}


                                        {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                            <div style={{ marginTop: '5px' }}>
                                                <p style={{ color: 'black', marginBottom: '5px' }}>To Time</p>
                                                <input type='time' placeholder='Enter Client Id' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                    setalert_end_time(e.target.value)
                                                }}
                                                    value={alert_end_time}
                                                ></input>
                                            </div>
                                        </Col> */}
                                    </Row>

                                    <Row>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <button style={{ backgroundColor: '#e22747', color: 'white', border: 'none', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', width: '100%', padding: '5px' }} onClick={() => {
                                                if (isPlanSelected) {
                                                    if (userSelectedPlan.cameras_options.alert > 0) {
                                                        alert_value.from = alert_start_time
                                                        alert_value.to = alert_end_time
                                                        alert_value.camera_option = { ...alert_value.camera_option, alert: 1 }
                                                        alert_value.plan_end_date = userSelectedPlan.sub.end_date
                                                        alert_value.plan_end_time = userSelectedPlan.sub.end_time
                                                        alert_value.plan_start_date = userSelectedPlan.sub.start_date
                                                        alert_value.plan_start_time = userSelectedPlan.sub.start_time
                                                        alert_value.subscribe_id = userSelectedPlan.sub._id
                                                        setmask_div_open(true)
                                                    } else {
                                                        alert('there is no plan to add')
                                                    }
                                                } else {
                                                    alert('Please Select Plan')
                                                }
                                            }}>Add Time</button>
                                        </Col>
                                    </Row>
                                </div>
                            </Modal>

                            <Modal
                                open={peoplemodel}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                style={{ marginLeft: 'auto', marginRight: 'auto', height: 550, width: '50%', top: 20, }}
                            >
                                <div style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <div style={{ backgroundColor: '#e22747', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', width: '30%', }} >
                                                    <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>{analytic_type == 'people_masking' ? 'People' : analytic_type == 'vehicle_masking' ? 'Vehicle' : analytic_type == 'face_masking' ? 'Face' : 'ANPR'} Analytics</p>
                                                </div>
                                                <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                                    setpeoplemodel(false)
                                                }} />
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row style={{ padding: '0px', alignItems: 'center', padding: '10px' }}>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <div style={{ cursor: 'pointer', display: 'flex', overflowX: 'scroll' }} >
                                                {
                                                    subscriptionPlanData.sub?.map((plans, planIndex) => (
                                                        <div key={planIndex} onClick={() => {
                                                            setUserSelectedPlan(plans)
                                                            setIsPlanSelected(true)

                                                        }
                                                        }  >


                                                            <div style={{
                                                                border: userSelectedPlan && plans.sub?._id === userSelectedPlan.sub?._id ? '4px solid black' : '1px solid black',
                                                                display: 'inline-block', borderRadius: '5px', padding: '5px',
                                                                backgroundColor: userSelectedPlan && plans.sub?._id === userSelectedPlan.sub?._id ? 'lightgray' : 'white',
                                                                width: '23rem',
                                                                marginRight: '10px'
                                                            }}

                                                                key={planIndex} >
                                                                <div>
                                                                    <p style={{ margin: 0 }}>Your plan</p>
                                                                    <div  >
                                                                        <div style={{ border: '1px solid grey', borderRadius: '5px', display: 'inline-block', color: 'black', backgroundColor: 'white', marginRight: '10px' }}>
                                                                            <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
                                                                                <p style={{ padding: '5px', margin: 0, }}>2 mp cameras</p>
                                                                            </div>
                                                                            <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                                                                                <div style={{ marginRight: '10px' }}>
                                                                                    <p style={{ margin: 0 }}>Motion triggered</p>
                                                                                    <p style={{ margin: 0 }}>24/Continuous</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p style={{ margin: 0 }}> {plans.sub._2mp.motion.motion - plans.cameras_options._2mp.motion} / {plans.sub._2mp.motion.motion}</p>
                                                                                    <p style={{ margin: 0 }}> {plans.sub._2mp.continues.continues - plans.cameras_options._2mp.continues} / {plans.sub._2mp.continues.continues}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div style={{ border: '1px solid grey', borderRadius: '5px', display: 'inline-block', color: 'black', backgroundColor: 'white' }}>
                                                                            <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
                                                                                <p style={{ padding: '5px', margin: 0, }}>4 mp cameras</p>
                                                                            </div>
                                                                            <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                                                                                <div style={{ marginRight: '10px' }}>
                                                                                    <p style={{ margin: 0 }}>Motion triggered</p>
                                                                                    <p style={{ margin: 0 }}>24/Continuous</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p style={{ margin: 0 }}> {plans.sub._4mp.motion.motion - plans.cameras_options._4mp.motion} / {plans.sub._4mp.motion.motion}</p>
                                                                                    <p style={{ margin: 0 }}> {plans.sub._4mp.continues.continues - plans.cameras_options._4mp.continues} / {plans.sub._4mp.continues.continues}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div style={{ border: '1px solid grey', borderRadius: '5px', display: 'inline-block', color: 'black', backgroundColor: 'white', marginRight: '10px', marginTop: '5px' }}>
                                                                            <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
                                                                                <p style={{ padding: '5px', margin: 0, }}>8 mp cameras</p>
                                                                            </div>
                                                                            <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                                                                                <div style={{ marginRight: '10px' }}>
                                                                                    <p style={{ margin: 0 }}>Motion triggered</p>
                                                                                    <p style={{ margin: 0 }}>24/Continuous</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p style={{ margin: 0 }}> {plans.sub._8mp.motion.motion - plans.cameras_options._8mp.motion} / {plans.sub._8mp.motion.motion}</p>
                                                                                    <p style={{ margin: 0 }}> {plans.sub._8mp.continues.continues - plans.cameras_options._8mp.continues} / {plans.sub._8mp.continues.continues}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div style={{ border: '1px solid grey', borderRadius: '5px', display: 'inline-block', color: 'black', backgroundColor: 'white', width: '170px', marginTop: '5px' }}>
                                                                            <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
                                                                                <p style={{ padding: '5px', margin: 0, }}>Storage</p>
                                                                            </div>
                                                                            <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                                                                                <div style={{ marginRight: '10px' }}>
                                                                                    <p style={{ margin: 0 }}>Cloud</p>
                                                                                    <p style={{ margin: 0 }}>Local</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p style={{ margin: 0 }}> {plans.sub.options.cloud} Days</p>
                                                                                    <p style={{ margin: 0 }}> {plans.sub.options.local} Days</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div style={{ border: '1px solid grey', borderRadius: '5px', color: 'black', backgroundColor: 'white', marginTop: '5px' }}>
                                                                        <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
                                                                            <p style={{ padding: '5px', margin: 0, }}>Other Subscription</p>
                                                                        </div>
                                                                        <div style={{ display: 'flex', padding: '5px' }}>
                                                                            <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                                                                                <div style={{ marginRight: '10px' }}>
                                                                                    <p style={{ margin: 0 }}>Alert</p>
                                                                                    <p style={{ margin: 0 }}>Analytic</p>
                                                                                    <p style={{ margin: 0 }}>Live Stream</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p style={{ margin: 0 }}>{plans.sub.options.alert - plans.cameras_options.alert} / {plans.sub.options.alert}</p>
                                                                                    <p style={{ margin: 0 }}>{plans.sub.options.analytics - plans.cameras_options.analytics} / {plans.sub.options.analytics}</p>
                                                                                    <p style={{ margin: 0 }}>{plans.cameras_options.live_stream == undefined ? 0 : plans.sub.options.live_stream - plans.cameras_options.live_stream} / {plans.sub.options.live_stream == undefined ? 0 : plans.sub.options.live_stream}</p>
                                                                                </div>
                                                                            </div>
                                                                            {/* <div style={{ display: 'flex', alignItems: 'center', width: '35%' }}>
                                                    <div style={{ marginRight: '10px' }}>
                                                    <p style={{ margin: 0 }}>People Analytics</p>
                                                      <p style={{ margin: 0 }}>Vehicle Analytics</p>
                                                    </div>
                                                    <div>
                                                    <p style={{ margin: 0 }}>{plans.sub.options.people_analytics - plans.cameras_options.people_analytics} / {plans.cameras_options.people_analytics}</p>
                                                      <p style={{ margin: 0 }}>{plans.sub.options.vehicle_analytics - plans.cameras_options.vehicle_analytics} / {plans.cameras_options.vehicle_analytics}</p>
                              
                                                    </div>
                                                  </div> */}

                                                                            <div style={{ display: 'flex', width: '50%' }}>
                                                                                <div style={{ marginRight: '10px' }}>
                                                                                    <p style={{ margin: 0 }}>People Analytics</p>
                                                                                    <p style={{ margin: 0 }}>Vehicle Analytics</p>
                                                                                    <p style={{ margin: 0 }}>Face Dedaction</p>
                                                                                    {/* <p style={{ margin: 0 }}>Cloud</p> */}
                                                                                </div>
                                                                                <div>
                                                                                    <p style={{ margin: 0 }}>{plans.sub.options.people_analytics - plans.cameras_options.people_analytics} / {plans.sub.options.people_analytics}</p>
                                                                                    <p style={{ margin: 0 }}>{plans.sub.options.vehicle_analytics - plans.cameras_options.vehicle_analytics} / {plans.sub.options.vehicle_analytics}</p>
                                                                                    <p style={{ margin: 0 }}>{plans.cameras_options.face_dedaction == undefined ? 0 : plans.sub.options.face_dedaction - plans.cameras_options.face_dedaction} / {plans.sub.options.face_dedaction == undefined ? 0 : plans.sub.options.face_dedaction}</p>
                                                                                    {/* <p style={{ margin: 0 }}>{plans.sub.options.cloud - plans.cameras_options.cloud} / {plans.sub.options.cloud}</p> */}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }


                                            </div>
                                        </Col>

                                        {/* {
                                            analytic_type != 'face_masking' && analytic_type != 'anpr_masking' ?
                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                    <div style={{ marginTop: '5px' }}>
                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Range</p>
                                                        <select name="people" id="people" onChange={(e) => {
                                                            var select = document.getElementById("people");
                                                            var selectedOption = select.options[select.selectedIndex];
                                                            var selectedValue = selectedOption.value;
                                                            setalert_start_time(selectedValue)
                                                        }}>
                                                            <option value="LeftToRight">LeftToRight</option>
                                                            <option value="RightToLeft">RightToLeft</option>
                                                            <option value="TopToBottom">TopToBottom</option>
                                                            <option value="BottomToTop">BottomToTop</option>
                                                        </select>
                                                    </div>
                                                </Col>
                                                : ''
                                        } */}

                                        {/* {
                                            analytic_type == 'vehicle_masking' ?
                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                    <div style={{ marginTop: '5px' }}>
                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Sequence</p>
                                                        <select name="vehicle_seq" id="vehicle_seq" onChange={(e) => {
                                                            var select = document.getElementById("vehicle_seq");
                                                            var selectedOption = select.options[select.selectedIndex];
                                                            var selectedValue = selectedOption.value;
                                                            setalert_end_time(selectedValue)
                                                        }}>
                                                            <option value="In">In</option>
                                                            <option value="Out">Out</option>
                                                            <option value="In & Out">In & Out</option>
                                                        </select>
                                                    </div>
                                                </Col>
                                                : ''
                                        } */}
                                        {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                <div style={{ marginTop: '5px' }}>
                    <p style={{ color: 'black', marginBottom: '5px' }}>Sequence</p>
                    <select name="people_seq" id="people_seq" onChange={(e) => {
                        var select = document.getElementById("people_seq");
                        var selectedOption = select.options[select.selectedIndex];
                        var selectedValue = selectedOption.value;
                        setalert_end_time(selectedValue)
                    }}>
                        <option value="In">In</option>
                        <option value="Out">Out</option>
                    </select>
                </div>
            </Col> */}
                                    </Row>

                                    <Row>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <button style={{ backgroundColor: '#e22747', color: 'white', border: 'none', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', width: '100%', padding: '5px' }} onClick={() => {
                                                if (isPlanSelected) {

                                                    let flag = true
                                                    if (analytic_type == 'people_masking' && userSelectedPlan.cameras_options.people_analytics > 0) {
                                                        alert_value.camera_option = { ...alert_value.camera_option, people_analytics: 1 }
                                                    } else if (analytic_type == 'vehicle_masking' && userSelectedPlan.cameras_options.vehicle_analytics > 0) {
                                                        alert_value.camera_option = { ...alert_value.camera_option, vehicle_analytics: 1 }
                                                    } else if (analytic_type == 'face_masking' && userSelectedPlan.cameras_options.face_analytics > 0) {
                                                        alert_value.camera_option = { ...alert_value.camera_option, face_dedaction: 1 }
                                                    } else if (analytic_type == 'anpr_masking' && userSelectedPlan.cameras_options.anpr_analytics > 0) {
                                                        alert_value.camera_option = { ...alert_value.camera_option, anpr: 1 }
                                                    } else {
                                                        flag = false
                                                        alert('there is no plan to add')
                                                    }

                                                    // if (analytic_type == 'people_masking') {
                                                    //     alert_value.camera_option = { ...alert_value.camera_option, people_analytics: 1 }
                                                    // } else if (analytic_type == 'vehicle_masking') {
                                                    //     alert_value.camera_option = { ...alert_value.camera_option, vehicle_analytics: 1 }
                                                    // } else if (analytic_type == 'face_masking') {
                                                    //     alert_value.camera_option = { ...alert_value.camera_option, face_dedaction: 1 }
                                                    // } else if (analytic_type == 'anpr_masking') {
                                                    //     alert_value.camera_option = { ...alert_value.camera_option, anpr: 1 }
                                                    // } else {
                                                    //     alert('there is no plan to add')
                                                    // }

                                                    if (flag) {
                                                        alert_value.plan_end_date = userSelectedPlan.sub.end_date
                                                        alert_value.plan_end_time = userSelectedPlan.sub.end_time
                                                        alert_value.plan_start_date = userSelectedPlan.sub.start_date
                                                        alert_value.plan_start_time = userSelectedPlan.sub.start_time
                                                        alert_value.subscribe_id = userSelectedPlan.sub._id
                                                        setmask_div_open(true)
                                                    }
                                                } else {
                                                    alert('Please Select Plan')
                                                }
                                            }}>Add {analytic_type == 'people_masking' ? 'People' : analytic_type == 'vehicle_masking' ? 'Vehicle' : analytic_type == 'face_masking' ? 'Face' : 'ANPR'} Analytic</button>
                                        </Col>
                                    </Row>
                                </div>
                            </Modal>

                            <Modal
                                open={main_cam_model}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                style={{ marginLeft: 'auto', marginRight: 'auto', height: 550, width: '50%', top: 20, }}
                            >
                                <div style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <div style={{ backgroundColor: '#e22747', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', width: '30%', }} >
                                                    <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>Main Camera setting</p>
                                                </div>
                                                <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                                    setmain_cam_model(false)
                                                }} />
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row style={{ padding: '0px', alignItems: 'center', padding: '10px' }}>


                                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                            <div style={{ marginTop: '5px' }}>
                                                <p style={{ color: 'black', marginBottom: '5px' }}>Sequence</p>
                                                <select name="vehicle_seq" id="vehicle_seq" onChange={(e) => {
                                                    var select = document.getElementById("vehicle_seq");
                                                    var selectedOption = select.options[select.selectedIndex];
                                                    var selectedValue = selectedOption.value;
                                                    setmain_cam_value(selectedValue)
                                                }}>
                                                    <option value="In">In</option>
                                                    <option value="Out">Out</option>
                                                    <option value="In & Out">In & Out</option>
                                                </select>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <button style={{ backgroundColor: '#e22747', color: 'white', border: 'none', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', width: '100%', padding: '5px' }} onClick={() => {
                                                setblur_div(true)
                                                const device_details = {
                                                    "main_type": 'true',
                                                    "overall_count": main_cam_value
                                                };

                                                const options = {
                                                    url: api.CAMERA_CREATION + main_type_id,
                                                    method: 'PUT',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    data: JSON.stringify(device_details)
                                                };

                                                console.log(device_details)

                                                axios(options)
                                                    .then(response => {
                                                        console.log(response.data);
                                                        setmain_cam_model(false)
                                                        list_camera_site_id(selected_sites)
                                                    }).catch((e) => {
                                                        console.log(e)
                                                    })
                                            }}>Add</button>
                                        </Col>
                                    </Row>
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
                                open={device_list_view}
                                onClose={() => {
                                    setdevice_list_view(false)
                                    setdevice_manage_btn(false)
                                }}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                style={{ marginLeft: 'auto', marginRight: 'auto', height: '80vh', width: '80%', top: 20, }}
                            >
                                <div style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <div style={{ backgroundColor: '#e22747', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
                                                <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>Device Details</p>
                                                <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                                    setdevice_list_view(false)
                                                    setdevice_manage_btn(false)
                                                }} />
                                            </div>
                                        </Col>
                                    </Row>

                                    <div style={{ height: '80vh', backgroundColor: 'white', overflow: 'scroll', overflowX: 'hidden' }}>
                                        <ClientDevice />
                                    </div>
                                    {/* <ClientDevice /> */}
                                </div>
                            </Modal>

                            <Modal
                                open={mask_list_view}
                                onClose={() => {
                                    setmask_list_view(false)
                                }}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                style={{ marginLeft: 'auto', marginRight: 'auto', height: '85vh', width: '90%', top: 20, }}
                            >
                                <div style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <div style={{ backgroundColor: '#e22747', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
                                                <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>Camera Masking</p>
                                                <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                                    setmask_list_view(false)
                                                }} />
                                            </div>
                                        </Col>
                                    </Row>

                                    <div style={{ height: '85vh', backgroundColor: '#e6e8eb', overflow: 'scroll', overflowX: 'hidden', }}>
                                        <Mask analytic_type={analytic_type} />
                                    </div>
                                    {/* <ClientDevice /> */}
                                </div>
                            </Modal>

                            <Modal
                                open={opencamera}
                                onClose={() => {
                                    setflag(!flag)
                                    list_camera_site_id(selected_sites)
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
                                                <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>ADD CAMERA(s)</p>

                                                <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                                    setflag(!flag)
                                                    list_camera_site_id(selected_sites)
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

                                            <div style={{ overflowY: 'scroll', overflowX: 'hidden', maxHeight: '80vh' }}>
                                                {
                                                    !camera_save_loader ?
                                                        <Row style={{ padding: '10px', alignItems: 'center', backgroundColor: 'white' }}>

                                                            {
                                                                camera_list_data.map((val, i) => {
                                                                    return (
                                                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                            <div style={{ border: '1px solid grey', borderRadius: '5px', marginBottom: '10px' }}>
                                                                                <div id={`cam${i}`}>
                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <img style={{ width: '100px', borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px' }} src={val.image_uri} ></img>

                                                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginLeft: '5px', marginRight: '5px' }}>
                                                                                            <div>
                                                                                                <p style={{ marginBottom: '0px' }}>Manufacturer : {val.Manufacturer}</p>
                                                                                                <p style={{ marginBottom: '0px' }}>IPAddress : {val.IPAddress}</p>
                                                                                                {/* <p>Username : {val.Username}</p>
                                                                                                    <p>Password : {val.Password}</p> */}
                                                                                                <p style={{ marginBottom: '0px' }}>Device Id : {val.device_id}</p>
                                                                                                <p style={{ marginBottom: '0px' }}>Resolution : {val.resolution} MP</p>
                                                                                            </div>

                                                                                            <div>

                                                                                                <div id={`toggle${i}`} className='toggle' title='false' style={{ backgroundColor: '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '2px', cursor: 'pointer' }} onClick={() => {
                                                                                                    // settoggle(!toggle)

                                                                                                    let ele = document.getElementById(`toggle${i}`)
                                                                                                    let cam = document.getElementById(`cam${i}`)
                                                                                                    let cam_input = document.getElementById(`camera_input${i}`)

                                                                                                    if (ele.title == 'false') {
                                                                                                        console.log('subscription plan', subscriptionPlanData)
                                                                                                        subscriptionPlanData.map((plan, index) => {
                                                                                                            if (val.resolution === 2 && plan.cameras_for_add._2mp > 0) {
                                                                                                                camera_object[i] = {
                                                                                                                    camera_name: '',
                                                                                                                    camera_id: 'none',
                                                                                                                    ip_address: { select: val.IPAddress, device_id: val.device_id },
                                                                                                                    site: { select: group_list[site_ind].site_name, id: group_list[site_ind]._id },
                                                                                                                    active: 0,
                                                                                                                    cloud: 0,
                                                                                                                    analytic: 0,
                                                                                                                    main_stream: '',
                                                                                                                    user_name: '',
                                                                                                                    password: '',
                                                                                                                    camera_mp: '',
                                                                                                                    sub_stream: '',
                                                                                                                    alert_noti: 0,
                                                                                                                    from: '00:00',
                                                                                                                    to: '00:00',
                                                                                                                    camera_mp: val.resolution,
                                                                                                                    plan_end_date: plan.sub.end_date,
                                                                                                                    plan_end_time: plan.sub.end_time,
                                                                                                                    plan_start_date: plan.sub.start_date,
                                                                                                                    plan_start_time: plan.sub.start_time,
                                                                                                                    subscribe_id: plan.sub._id
                                                                                                                }
                                                                                                                cam_input.style.display = 'block'
                                                                                                                cam.style.display = 'none'
                                                                                                                console.log(plan.sub.end_date)
                                                                                                                plan.cameras_for_add._2mp = plan.cameras_for_add._2mp - 1
                                                                                                            } else if (val.resolution === 4 && plan.cameras_for_add._4mp > 0) {
                                                                                                                camera_object[i] = {
                                                                                                                    camera_name: '',
                                                                                                                    camera_id: 'none',
                                                                                                                    ip_address: { select: val.IPAddress, device_id: val.device_id },
                                                                                                                    site: { select: group_list[site_ind].site_name, id: group_list[site_ind]._id },
                                                                                                                    active: 0,
                                                                                                                    cloud: 0,
                                                                                                                    analytic: 0,
                                                                                                                    alert_noti: 0,
                                                                                                                    from: '00:00',
                                                                                                                    to: '00:00',
                                                                                                                    camera_mp: val.resolution,
                                                                                                                    plan_end_date: plan.sub.end_date,
                                                                                                                    plan_end_time: plan.sub.end_time,
                                                                                                                    plan_start_date: plan.sub.start_date,
                                                                                                                    plan_start_time: plan.sub.start_time,
                                                                                                                    subscribe_id: plan.sub._id
                                                                                                                }
                                                                                                                cam_input.style.display = 'block'
                                                                                                                cam.style.display = 'none'
                                                                                                                console.log(plan)
                                                                                                                plan.cameras_for_add._4mp = plan.cameras_for_add._4mp - 1
                                                                                                            }
                                                                                                            else if (val.resolution === 8 && plan.cameras_for_add._8mp > 0) {
                                                                                                                camera_object[i] = {
                                                                                                                    camera_name: '',
                                                                                                                    camera_id: 'none',
                                                                                                                    ip_address: { select: val.IPAddress, device_id: val.device_id },
                                                                                                                    site: { select: group_list[site_ind].site_name, id: group_list[site_ind]._id },
                                                                                                                    active: 0,
                                                                                                                    cloud: 0,
                                                                                                                    analytic: 0,
                                                                                                                    alert_noti: 0,
                                                                                                                    from: '00:00',
                                                                                                                    to: '00:00',
                                                                                                                    camera_mp: val.resolution,
                                                                                                                    plan_end_date: plan.sub.end_date,
                                                                                                                    plan_end_time: plan.sub.end_time,
                                                                                                                    plan_start_date: plan.sub.start_date,
                                                                                                                    plan_start_time: plan.sub.start_time,
                                                                                                                    subscribe_id: plan.sub._id
                                                                                                                }
                                                                                                                cam_input.style.display = 'block'
                                                                                                                cam.style.display = 'none'
                                                                                                                plan.cameras_for_add._8mp = plan.cameras_for_add._8mp - 1
                                                                                                            }
                                                                                                            else {
                                                                                                                alert('Your plan is not eligible')
                                                                                                            }
                                                                                                        })


                                                                                                    } else {
                                                                                                        let newdata = []
                                                                                                        camera_object.map((cam_obj, j) => {
                                                                                                            if (j == i) {
                                                                                                                subscriptionPlanData.map((plan, index) => {
                                                                                                                    if (val.resolution === 2) {
                                                                                                                        newdata[i] = {
                                                                                                                            camera_name: '',
                                                                                                                            camera_id: 'none',
                                                                                                                            ip_address: { select: '', device_id: '' },
                                                                                                                            site: { select: '', id: '' },
                                                                                                                            active: 0,
                                                                                                                            cloud: 0,
                                                                                                                            analytic: 0,
                                                                                                                            main_stream: '',
                                                                                                                            user_name: '',
                                                                                                                            password: '',
                                                                                                                            camera_mp: '',
                                                                                                                            sub_stream: '',
                                                                                                                            alert_noti: 0,
                                                                                                                            from: '00:00',
                                                                                                                            to: '00:00',
                                                                                                                            camera_mp: val.resolution,
                                                                                                                            plan_end_date: plan.sub.end_date,
                                                                                                                            plan_end_time: plan.sub.end_time,
                                                                                                                            plan_start_date: plan.sub.start_date,
                                                                                                                            plan_start_time: plan.sub.start_time,
                                                                                                                            subscribe_id: plan.sub._id
                                                                                                                        }
                                                                                                                        plan.cameras_for_add._2mp = plan.cameras_for_add._2mp + 1
                                                                                                                    }
                                                                                                                    else if (val.resolution === 4) {
                                                                                                                        newdata[i] = {
                                                                                                                            camera_name: '',
                                                                                                                            camera_id: 'none',
                                                                                                                            ip_address: { select: '', device_id: '' },
                                                                                                                            site: { select: '', id: '' },
                                                                                                                            active: 0,
                                                                                                                            cloud: 0,
                                                                                                                            analytic: 0,
                                                                                                                            alert_noti: 0,
                                                                                                                            from: '00:00',
                                                                                                                            to: '00:00',
                                                                                                                            camera_mp: val.resolution,
                                                                                                                            plan_end_date: plan.sub.end_date,
                                                                                                                            plan_end_time: plan.sub.end_time,
                                                                                                                            plan_start_date: plan.sub.start_date,
                                                                                                                            plan_start_time: plan.sub.start_time,
                                                                                                                            subscribe_id: plan.sub._id
                                                                                                                        }
                                                                                                                        plan.cameras_for_add._4mp = plan.cameras_for_add._4mp + 1
                                                                                                                    }
                                                                                                                    else if (val.resolution === 8) {
                                                                                                                        newdata[i] = {
                                                                                                                            camera_name: '',
                                                                                                                            camera_id: 'none',
                                                                                                                            ip_address: { select: '', device_id: '' },
                                                                                                                            site: { select: '', id: '' },
                                                                                                                            active: 0,
                                                                                                                            cloud: 0,
                                                                                                                            analytic: 0,
                                                                                                                            alert_noti: 0,
                                                                                                                            from: '00:00',
                                                                                                                            to: '00:00',
                                                                                                                            camera_mp: val.resolution,
                                                                                                                            plan_end_date: plan.sub.end_date,
                                                                                                                            plan_end_time: plan.sub.end_time,
                                                                                                                            plan_start_date: plan.sub.start_date,
                                                                                                                            plan_start_time: plan.sub.start_time,
                                                                                                                            subscribe_id: plan.sub._id
                                                                                                                        }
                                                                                                                        plan.cameras_for_add._8mp = plan.cameras_for_add._8mp + 1
                                                                                                                    }

                                                                                                                })
                                                                                                            } else {
                                                                                                                newdata.push(cam_obj)
                                                                                                            }
                                                                                                        })

                                                                                                        ele.style.justifyContent = 'flex-start'
                                                                                                        ele.style.backgroundColor = '#a8a4a4'
                                                                                                        ele.title = 'false'
                                                                                                        cam_input.style.display = 'none'
                                                                                                        setcamera_object(newdata)


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
                                                                                                            subscriptionPlanData.map((plan, index) => {
                                                                                                                if (val.resolution === 2) {

                                                                                                                    newdata[i] = {
                                                                                                                        camera_name: '',
                                                                                                                        camera_id: 'none',
                                                                                                                        ip_address: { select: '', device_id: '' },
                                                                                                                        site: { select: '', id: '' },
                                                                                                                        active: 0,
                                                                                                                        cloud: 0,
                                                                                                                        analytic: 0,
                                                                                                                        alert_noti: 0,
                                                                                                                        main_stream: '',
                                                                                                                        user_name: '',
                                                                                                                        password: '',
                                                                                                                        camera_mp: '',
                                                                                                                        sub_stream: '',
                                                                                                                        from: '00:00',
                                                                                                                        to: '00:00',
                                                                                                                        camera_mp: val.resolution,
                                                                                                                        plan_end_date: plan.sub.end_date,
                                                                                                                        plan_end_time: plan.sub.end_time,
                                                                                                                        plan_start_date: plan.sub.start_date,
                                                                                                                        plan_start_time: plan.sub.start_time,
                                                                                                                        subscribe_id: plan.sub._id
                                                                                                                    }

                                                                                                                    plan.cameras_for_add._2mp = plan.cameras_for_add._2mp + 1



                                                                                                                }
                                                                                                                else if (val.resolution === 4) {

                                                                                                                    newdata[i] = {
                                                                                                                        camera_name: '',
                                                                                                                        camera_id: 'none',
                                                                                                                        ip_address: { select: '', device_id: '' },
                                                                                                                        site: { select: '', id: '' },
                                                                                                                        active: 0,
                                                                                                                        cloud: 0,
                                                                                                                        analytic: 0,
                                                                                                                        alert_noti: 0,
                                                                                                                        from: '00:00',
                                                                                                                        to: '00:00',
                                                                                                                        camera_mp: val.resolution,
                                                                                                                        plan_end_date: plan.sub.end_date,
                                                                                                                        plan_end_time: plan.sub.end_time,
                                                                                                                        plan_start_date: plan.sub.start_date,
                                                                                                                        plan_start_time: plan.sub.start_time,
                                                                                                                        subscribe_id: plan.sub._id
                                                                                                                    }

                                                                                                                    plan.cameras_for_add._4mp = plan.cameras_for_add._4mp + 1



                                                                                                                }
                                                                                                                else if (val.resolution === 8) {

                                                                                                                    newdata[i] = {
                                                                                                                        camera_name: '',
                                                                                                                        camera_id: 'none',
                                                                                                                        ip_address: { select: '', device_id: '' },
                                                                                                                        site: { select: '', id: '' },
                                                                                                                        active: 0,
                                                                                                                        cloud: 0,
                                                                                                                        analytic: 0,
                                                                                                                        alert_noti: 0,
                                                                                                                        from: '00:00',
                                                                                                                        to: '00:00',
                                                                                                                        camera_mp: val.resolution,
                                                                                                                        plan_end_date: plan.sub.end_date,
                                                                                                                        plan_end_time: plan.sub.end_time,
                                                                                                                        plan_start_date: plan.sub.start_date,
                                                                                                                        plan_start_time: plan.sub.start_time,
                                                                                                                        subscribe_id: plan.sub._id
                                                                                                                    }

                                                                                                                    plan.cameras_for_add._8mp = plan.cameras_for_add._8mp + 1



                                                                                                                }
                                                                                                            })



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
                                                                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
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

                                                                                        <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ marginTop: '5px' }}>
                                                                                            <button style={{ backgroundColor: '#e22747', color: 'white', border: 'none', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', width: '100%', padding: '5px' }} onClick={() => {
                                                                                                let cam_input = document.getElementById(`camera_input${i}`)
                                                                                                let cam = document.getElementById(`cam${i}`)
                                                                                                let ele = document.getElementById(`toggle${i}`)

                                                                                                if (camera_object[i].camera_name != "" && camera_object[i].camera_id != '') {
                                                                                                    cam_input.style.display = 'none'
                                                                                                    cam.style.display = 'block'
                                                                                                    ele.style.justifyContent = 'flex-end'
                                                                                                    ele.style.backgroundColor = '#42cf10'
                                                                                                    ele.title = 'true'

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
                                                        :
                                                        <Row>
                                                            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                                    <CircularProgress />
                                                                    <p>Please wait...</p>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                }

                                            </div>

                                            :
                                            <div>
                                                <div style={{ overflowY: 'scroll', overflowX: 'hidden', maxHeight: '400px' }}>
                                                    {
                                                        add_camera_count.map((val) => (
                                                            <Row style={{ padding: '10px', alignItems: 'center', backgroundColor: 'white' }}>
                                                                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                                                                        <div>
                                                                            <p style={{ margin: 0, color: 'black' }}>Camera Mp : <span style={{ color: '#e22747' }}>{camera_object[val].camera_mp}</span></p>
                                                                        </div>

                                                                        <div>
                                                                            {
                                                                                add_camera_count.length > 1 ?
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
                                                                                    : ''
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </Col>

                                                                {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Camera Id</p>
                                                                        <input type='text' placeholder='Enter Client Id' value={camera_object[val].camera_id} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            camera_object[val].camera_id = e.target.value
                                                                            setcamera_id(e.target.value)
                                                                        }}></input>
                                                                    </div>
                                                                </Col> */}

                                                                {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Ip Address</p>
                                                                        <input type='text' placeholder='Enter Client Id' value={camera_object[val].ip_address.select} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            camera_object[val].ip_address.select = e.target.value
                                                                            setcamera_id(e.target.value)
                                                                        }}></input>
                                                                    </div>
                                                                </Col> */}

                                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div>
                                                                        <p style={{ color: 'black', marginTop: '15px', marginBottom: '5px' }}>Device</p>
                                                                        <div style={{ position: 'relative', zIndex: 2 }}>
                                                                            <p type='text' style={{ backgroundColor: '#e6e8eb', margin: 0, color: camera_object[val].ip_address.device_id.select != 'Select' ? 'black' : '#898989', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => {
                                                                                if (document.getElementById(`device${val}`).style.display !== 'none') {
                                                                                    document.getElementById(`device${val}`).style.display = 'none'
                                                                                } else {
                                                                                    document.getElementById(`device${val}`).style.display = 'block'
                                                                                }

                                                                            }}>{camera_object[val].ip_address.device_id.select}<span><ArrowDropDownIcon /></span></p>

                                                                            <div id={`device${val}`} style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', maxHeight: '150px', overflowY: 'scroll' }}>
                                                                                {
                                                                                    device_list.length != 0 ?
                                                                                        device_list.map((siteval) => (
                                                                                            <div>
                                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                                    // let arr = []
                                                                                                    // site_list1.map((value) => {
                                                                                                    //     if (value._id !== siteval._id) {
                                                                                                    //         arr.push(value)
                                                                                                    //     }
                                                                                                    // })

                                                                                                    camera_object[val].ip_address.device_id.select = siteval.device_name
                                                                                                    camera_object[val].ip_address.device_id.id = siteval._id
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
                                                                                                    document.getElementById(`device${val}`).style.display = 'none'
                                                                                                    setsite({ select: siteval.device_name, id: siteval._id })

                                                                                                }
                                                                                                }>{siteval.device_name}</p>
                                                                                                <hr></hr>
                                                                                            </div>
                                                                                        ))
                                                                                        :
                                                                                        <p style={{ padding: '0', margin: 0, color: 'black' }}>No Device</p>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Col>

                                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div>
                                                                        <p style={{ color: 'black', marginTop: '15px', marginBottom: '5px' }}>Site</p>
                                                                        <div style={{ position: 'relative', zIndex: 2 }}>
                                                                            <p type='text' style={{ backgroundColor: '#e6e8eb', margin: 0, color: camera_object[val].site.select != 'Select' ? 'black' : '#898989', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => {
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
                                                                                                    document.getElementById(`site${val}`).style.display = 'none'
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

                                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Camera Name</p>
                                                                        <input type='text' placeholder='Enter Client Id' value={camera_object[val].camera_name} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => { camera_object[val].camera_name = e.target.value; setcamera_name(e.target.value) }}></input>
                                                                    </div>
                                                                </Col>

                                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div>
                                                                        <p style={{ color: 'black', marginTop: '5px', marginBottom: '5px' }}>Main Stream</p>
                                                                        <input type='text' disabled={camera_object[val].ip_address.device_id.id != '' ? false : true} placeholder='Enter Client Id' value={camera_object[val].main_stream} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            camera_object[val].camera_mp = 0
                                                                            camera_object[val].main_stream = e.target.value
                                                                            setcamera_id(e.target.value)
                                                                        }} onBlur={() => {
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

                                                                            const params = {
                                                                                topic: `${camera_object[val].ip_address.device_id.id}/get_camera_mp`,
                                                                                payload: JSON.stringify({ rtsp: camera_object[val].main_stream, socket_id: socket.id }),
                                                                                qos: 0
                                                                            };

                                                                            iot.publish(params, (err, data) => {
                                                                                if (err) {
                                                                                    console.error('Error publishing message:', err);
                                                                                } else {
                                                                                    if (socket_camera_count == -1) {
                                                                                        socket_camera_count = 1
                                                                                    } else {
                                                                                        socket_camera_count = socket_camera_count + 1
                                                                                    }

                                                                                    console.log('Message published successfully:', data);
                                                                                }
                                                                            });
                                                                        }}></input>
                                                                    </div>
                                                                </Col>

                                                                {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Sub Stream</p>
                                                                        <input type='text' placeholder='Enter Client Id' value={camera_object[val].sub_stream} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            camera_object[val].sub_stream = e.target.value
                                                                            setcamera_id(e.target.value)
                                                                        }}></input>
                                                                    </div>
                                                                </Col> */}

                                                                {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>User Name</p>
                                                                        <input type='text' placeholder='Enter Client Id' value={camera_object[val].user_name} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            camera_object[val].user_name = e.target.value
                                                                            setcamera_id(e.target.value)
                                                                        }}></input>
                                                                    </div>
                                                                </Col> */}

                                                                {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Password</p>
                                                                        <input type='text' placeholder='Enter Client Id' value={camera_object[val].password} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            camera_object[val].password = e.target.value
                                                                            setcamera_id(e.target.value)
                                                                        }}></input>
                                                                    </div>
                                                                </Col> */}

                                                                {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Camera Mp</p>
                                                                        <input type='number' placeholder='Enter Client Id' value={camera_object[val].camera_mp} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            camera_object[val].camera_mp = e.target.value
                                                                            setcamera_id(e.target.value)
                                                                        }}></input>
                                                                    </div>
                                                                </Col> */}

                                                                {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                <div>
                                    <p style={{ color: 'black', }}>Ip Address</p>
                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <p type='text' style={{ backgroundColor: '#e6e8eb', color: camera_object[val].ip_address.select != 'Select' ? 'black' : '#898989', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => {
                                            // if (document.getElementById(`ip${val}`).style.display !== 'none') {
                                            //     document.getElementById(`ip${val}`).style.display = 'none'
                                            // } else {
                                            //     document.getElementById(`ip${val}`).style.display = 'block'
                                            // }

                                        }}>{camera_object[val].ip_address.select}</p>

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
                                                                    <div >
                                                                        <p style={{ color: 'black', marginTop: '5px', marginBottom: '5px' }}>Active</p>
                                                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                                                            <p type='text' style={{ backgroundColor: '#e6e8eb', margin: 0, color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => {
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

                                                                {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>From Time</p>
                                                                        <input type='time' placeholder='Enter Client Id' value={camera_object[val].from} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            camera_object[val].from = e.target.value
                                                                            setcamera_id(e.target.value)
                                                                        }}></input>
                                                                    </div>
                                                                </Col> */}

                                                                {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>To Time</p>
                                                                        <input type='time' placeholder='Enter Client Id' value={camera_object[val].to} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            camera_object[val].to = e.target.value
                                                                            setcamera_id(e.target.value)
                                                                        }}></input>
                                                                    </div>
                                                                </Col> */}

                                                                {/* <Col xl={4} lg={4} md={4} sm={12} xs={12}>

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
                                                                </Col> */}

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

                                                            let checkFlag = false
                                                            let camera_count = 0

                                                            let camera_mp = { _2mp: 0, _4mp: 0, _8mp: 0 }
                                                            let alert_str = ''
                                                            let available_str = ''

                                                            subscriptionPlanData.map((plan, index) => {
                                                                camera_mp._2mp = camera_mp._2mp + plan.cameras_for_add._2mp
                                                                camera_mp._4mp = camera_mp._4mp + plan.cameras_for_add._4mp
                                                                camera_mp._8mp = camera_mp._8mp + plan.cameras_for_add._8mp
                                                            })

                                                            for (let check = 0; check < camera_object.length; check++) {
                                                                if (camera_object[check].name !== '' && camera_object[check].site !== '' && camera_object[check].active !== '' && camera_object[check].main_stream !== '') {
                                                                    checkFlag = true
                                                                    let plan_flag = false

                                                                    if (camera_object[check].camera_mp !== 0 && camera_object[check].main_stream !== selectedcameras[check].main_stream) {
                                                                        for (let index = 0; index < subscriptionPlanData.length; index++) {
                                                                            if (camera_object[check].camera_mp === 2 && subscriptionPlanData[index].cameras_for_add._2mp > 0) {
                                                                                camera_object[check] = {
                                                                                    ...camera_object[check],
                                                                                    plan_end_date: subscriptionPlanData[index].sub.end_date,
                                                                                    plan_end_time: subscriptionPlanData[index].sub.end_time,
                                                                                    plan_start_date: subscriptionPlanData[index].sub.start_date,
                                                                                    plan_start_time: subscriptionPlanData[index].sub.start_time,
                                                                                    subscribe_id: subscriptionPlanData[index].sub._id
                                                                                }
                                                                                plan_flag = true
                                                                                break
                                                                            } else if (camera_object[check].camera_mp === 4 && subscriptionPlanData[index].cameras_for_add._4mp > 0) {
                                                                                camera_object[check] = {
                                                                                    ...camera_object[check],
                                                                                    plan_end_date: subscriptionPlanData[index].sub.end_date,
                                                                                    plan_end_time: subscriptionPlanData[index].sub.end_time,
                                                                                    plan_start_date: subscriptionPlanData[index].sub.start_date,
                                                                                    plan_start_time: subscriptionPlanData[index].sub.start_time,
                                                                                    subscribe_id: subscriptionPlanData[index].sub._id
                                                                                }
                                                                                plan_flag = true
                                                                                break
                                                                            } else if (camera_object[check].camera_mp === 8 && subscriptionPlanData[index].cameras_for_add._8mp > 0) {
                                                                                camera_object[check] = {
                                                                                    ...camera_object[check],
                                                                                    plan_end_date: subscriptionPlanData[index].sub.end_date,
                                                                                    plan_end_time: subscriptionPlanData[index].sub.end_time,
                                                                                    plan_start_date: subscriptionPlanData[index].sub.start_date,
                                                                                    plan_start_time: subscriptionPlanData[index].sub.start_time,
                                                                                    subscribe_id: subscriptionPlanData[index].sub._id
                                                                                }
                                                                                plan_flag = true
                                                                                break
                                                                            } else {
                                                                                if (addCameraMannullyArray[check].camera_mp == false) {
                                                                                    available_str = `${available_str}, ${addCameraMannullyArray[check].name} `
                                                                                } else {
                                                                                    plan_flag = false
                                                                                }
                                                                            }
                                                                        }

                                                                        if (!plan_flag) {
                                                                            alert_str = `${alert_str}, ${addCameraMannullyArray[check].camera_mp} `
                                                                        }
                                                                    }
                                                                } else {
                                                                    checkFlag = false
                                                                    break;
                                                                }
                                                            }

                                                            if (!checkFlag) {
                                                                alert("Please fill out all required fields.")
                                                            } else if (socket_camera_count != 0) {
                                                                setblur_div(true)
                                                            } else if (available_str != '') {
                                                                alert(`${available_str} cameras not available`)
                                                            } else if (alert_str != '') {
                                                                alert('Plan not eligibal')
                                                            }


                                                            // Creeate a device details for every device
                                                            if (socket_camera_count == 0) {
                                                                if (checkFlag && alert_str == '' && available_str == '') {
                                                                    camera_object.map((value, i) => {
                                                                        const device_details = {
                                                                            "dealer_id": (JSON.parse(localStorage.getItem("userData"))).dealer_id,
                                                                            "user_id": (JSON.parse(localStorage.getItem("userData")))._id,
                                                                            'device_id': value.ip_address.device_id.id,
                                                                            'camera_gereral_name': value.camera_name,
                                                                            "camera_id": value.camera_id,
                                                                            "site_id": value.site.id,
                                                                            "from": value.from,
                                                                            "to": value.to,
                                                                            "camera_username": value.user_name,
                                                                            "password": value.password,
                                                                            // 'notification_alert': value.alert_noti,
                                                                            // "cloud_recording": value.cloud,
                                                                            "ip_address": value.ip_address.select,
                                                                            "camera_url": value.main_stream,
                                                                            "live_uri": value.sub_stream,
                                                                            "camera_username": value.user_name,
                                                                            "password": value.password,
                                                                            "camera_mp": value.camera_mp,
                                                                            "plan_end_date": value.plan_end_date,
                                                                            "plan_end_time": value.plan_end_time,
                                                                            "plan_start_date": value.plan_start_date,
                                                                            "plan_start_time": value.start_time,
                                                                            "subscribe_id": value.subscribe_id,
                                                                            // "analytics_alert": value.analytic,
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

                                                                        // console.log(device_details)


                                                                        // Api Call
                                                                        axios(options)
                                                                            .then(response => {
                                                                                console.log(response.data)
                                                                                // count1 = 0
                                                                                // count = 0
                                                                                camera_count = camera_count + 1

                                                                                if (camera_count == camera_object.length) {
                                                                                    socket_camera_count = -1
                                                                                    setflag(!flag)
                                                                                    list_camera_site_id(selected_sites)
                                                                                    setselectedcameras([])
                                                                                    setcamera_list_data([])
                                                                                    setcamera_list_data1([])
                                                                                    handleCloseuser_pass()
                                                                                    handleClose()
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
                                                                    // alert("Please fill out all required fields.")
                                                                }
                                                            } else {

                                                            }
                                                        }}>Add Camera</button>
                                                    </Col>
                                                </Row>
                                            </div>
                                    }

                                    {
                                        save_type != 'put_data' ?
                                            <Row style={{ padding: '0px', alignItems: 'center', }}>
                                                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <div style={{ backgroundColor: '#e22747', color: 'white', display: 'flex', justifyContent: 'center', padding: '10px', alignItems: 'center' }} onClick={() => {
                                                        save_cameras()
                                                    }}>
                                                        <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>Save Camera(s)</p>
                                                    </div>
                                                </Col>
                                            </Row> : ''
                                    }

                                </div>
                            </Modal >


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
                                            <input type='text' placeholder='Search' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginRight: '20px' }}></input>

                                            <CloseIcon style={{ fontSize: '15px', color: 'black', cursor: 'pointer' }} onClick={() => {
                                                handleClosedelete()
                                            }} />
                                        </Col>
                                        <Col>
                                            <hr></hr>
                                        </Col>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex' }}>
                                            {
                                                get_tag_full_data.map((val) => (
                                                    <p style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '5px', borderRadius: '20px', border: '1px solid gray', marginRight: '20px', display: 'inline-block', fontSize: '15px' }}> {val.tag_name} <CloseIcon style={{ color: 'black', fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                                        const axios = require('axios');
                                                        let config = {
                                                            method: 'put',
                                                            maxBodyLength: Infinity,
                                                            url: flag_type === 'delete_tag' ? api.TAG_API_CREATE + val._id : api.GROUP_API_CREATE + val._id,
                                                            headers: {
                                                                'Content-Type': 'application/json'
                                                            },
                                                        };

                                                        axios.request(config)
                                                            .then((response) => {
                                                                // console.log(response.data);
                                                                get_tag_full_list()

                                                            })
                                                            .catch((error) => {
                                                                console.log(error);
                                                            })
                                                    }} /></p>
                                                ))
                                            }
                                        </Col>
                                    </Row>
                                </div>
                            </Modal>


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
                                                                                <input type='text' value={tag_name} placeholder={flag_type === 'add_tag' ? 'Enter tag name' : 'Enter Group name'} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray' }} onChange={(e) => {
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

                                                                                    // console.log(config);

                                                                                    axios.request(config)
                                                                                        .then((response) => {
                                                                                            // console.log(JSON.stringify(response.data));
                                                                                            get_tag_list()
                                                                                            settag_name('')
                                                                                            settag_list([])
                                                                                            setcreate_tag(!create_tag)
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
                                                                                                                        get_group_full_list()
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
                                                                <CloseIcon style={{ color: 'black', cursor: 'pointer' }} onClick={() => {
                                                                    handleClose1()
                                                                    setselectedcameras([])
                                                                }} />
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
                                                                                    // console.log(response.data);
                                                                                    fulldata.push(response.data)
                                                                                    get_group_full_list()
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
                                                                                                // console.log(JSON.stringify(response.data));
                                                                                                get_tag_list()
                                                                                                get_group_full_list()
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


                            {
                                skeleton == true ? (
                                    <div>
                                        <div style={{ position: 'relative', display: 'flex', padding: '10px' }}>

                                            <input type='text' placeholder='Search' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginRight: '20px', }} ></input>




                                            <button className='eventbtn' onClick={() => {
                                                setsite_manage_btn(!site_manage_btn)
                                                setdevice_manage_btn(false)

                                            }} style={{ display: 'flex', backgroundColor: site_manage_btn ? '#e32747' : '#e6e8eb', color: site_manage_btn ? 'white' : 'black' }}> <BusinessOutlinedIcon style={{ marginRight: '10px' }} />Site Management<ArrowDropDownIcon style={{ marginLeft: '10px' }} /></button>



                                            <button className='eventbtn' onClick={() => {
                                                setdevice_manage_btn(!device_manage_btn)
                                                setsite_manage_btn(false)
                                                setdevice_list_view(true)

                                            }} style={{ display: 'flex', backgroundColor: device_manage_btn ? '#e32747' : '#e6e8eb', color: device_manage_btn ? 'white' : 'black' }}><ManageHistoryIcon style={{ marginRight: '10px' }} alt="Device" />
                                                Management</button>

                                            <div style={{ position: 'relative' }}>
                                                <button className='eventbtn' onClick={() => {
                                                    setmotion_actionClick(!motion_actionClick)
                                                    // setmask_list_view(true)
                                                    // setanalytic_type('masking')
                                                    // setalert_end_time('')
                                                    // setalert_start_time('')
                                                }} style={{ display: 'flex', backgroundColor: mask_list_view ? '#e32747' : '#e6e8eb', color: mask_list_view ? 'white' : 'black' }}> <HighlightAltIcon style={{ marginRight: '10px' }} />Masking</button>

                                                <div style={{ display: motion_actionClick ? 'block' : 'none' }}>
                                                    <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: 32, left: 40 }} />

                                                    <div style={{ position: 'absolute', top: 60, bottom: 0, left: -30, right: 0, width: '200px', zIndex: 2 }}>
                                                        <div style={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', borderRadius: '5px', backgroundColor: '#181828' }}>
                                                            <p style={{ color: 'white', fontSize: '15px', margin: 0, marginRight: '10px', cursor: 'pointer', padding: '15px' }} onClick={() => {
                                                                let access = userData.operation_type.filter((val) => { return val == 'Create' || val == 'All' })
                                                                if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Create' || access[1] == 'Create') {
                                                                    flag_type = 'add_tag'
                                                                    setmask_list_view(true)
                                                                    setanalytic_type('masking')
                                                                    setalert_end_time('')
                                                                    setalert_start_time('')
                                                                } else {
                                                                    setalert_box(true)
                                                                    setalert_text('Your access level does not allow you to create Sites.')
                                                                }
                                                            }}>Alert Masking</p>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div style={{ height: '1px', width: '90%', backgroundColor: 'white' }}></div>
                                                            </div>
                                                            <p style={{ color: 'white', fontSize: '15px', margin: 0, marginRight: '10px', cursor: 'pointer', padding: '15px' }} onClick={() => {
                                                                let access = userData.operation_type.filter((val) => { return val == 'Create' || val == 'All' })
                                                                if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Create' || access[1] == 'Create') {
                                                                    setmask_list_view(true)
                                                                    setanalytic_type('people_masking')
                                                                    setalert_end_time('In')
                                                                    setalert_start_time('LeftToRight')
                                                                } else {
                                                                    setalert_box(true)
                                                                    setalert_text('Your access level does not allow you to create Sites.')

                                                                }

                                                            }}>People Masking</p>

                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div style={{ height: '1px', width: '90%', backgroundColor: 'white' }}></div>
                                                            </div>
                                                            <p style={{ color: 'white', fontSize: '15px', margin: 0, marginRight: '10px', cursor: 'pointer', padding: '15px' }} onClick={() => {
                                                                let access = userData.operation_type.filter((val) => { return val == 'Create' || val == 'All' })
                                                                if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Create' || access[1] == 'Create') {
                                                                    setmask_list_view(true)
                                                                    setanalytic_type('vehicle_masking')
                                                                    setalert_end_time('In')
                                                                    setalert_start_time('LeftToRight')
                                                                } else {
                                                                    setalert_box(true)
                                                                    setalert_text('Your access level does not allow you to create Sites.')

                                                                }

                                                            }}>Vehicle Masking</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <button className='eventbtn' onClick={() => {
                                                setmask_list_view(true)
                                                setanalytic_type('people_masking')
                                                setalert_end_time('In')
                                                setalert_start_time('LeftToRight')
                                            }} style={{ display: 'flex', backgroundColor: mask_list_view ? '#e32747' : '#e6e8eb', color: mask_list_view ? 'white' : 'black' }}> <HighlightAltIcon style={{ marginRight: '10px' }} />People Masking</button> */}

                                            {/* <button className='eventbtn' onClick={() => {
                                                setmask_list_view(true)
                                                setanalytic_type('vehicle_masking')
                                                setalert_end_time('In')
                                                setalert_start_time('LeftToRight')
                                            }} style={{ display: 'flex', backgroundColor: mask_list_view ? '#e32747' : '#e6e8eb', color: mask_list_view ? 'white' : 'black' }}> <HighlightAltIcon style={{ marginRight: '10px' }} />Vehicle Masking</button> */}
                                        </div>
                                    </div>
                                ) : (

                                    <div>
                                        <div style={{ position: 'relative', display: 'flex', padding: '10px' }}>

                                            <Skeleton style={{ borderRadius: "20px", border: '1px solid gray', }} width={200} height={45} />
                                            <Skeleton style={{ borderRadius: "20px", border: '1px solid gray', marginLeft: "20px" }} width={210} height={45} />
                                            <Skeleton style={{ borderRadius: "20px", border: '1px solid gray', marginLeft: "20px" }} width={160} height={45} />
                                            <Skeleton style={{ borderRadius: "20px", border: '1px solid gray', marginLeft: "20px" }} width={120} height={45} />
                                        </div>
                                    </div>

                                )
                            }


                            {site_manage_btn ?
                                <div style={{ padding: '10px', paddingBottom: '0px' }}>
                                    <Row style={{ backgroundColor: 'white', borderRadius: '5px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }}>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>

                                            <div style={{ position: 'relative', display: 'flex', padding: '10px' }}>

                                                <div style={{ position: 'relative', }}>
                                                    <button className='eventbtn' onClick={() => {
                                                        let access = userData.operation_type.filter((val) => { return val == 'Create' || val == 'All' })
                                                        if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Create' || access[1] == 'Create') {
                                                            setgroup_name('')
                                                            setsiteactive(0)
                                                            setsite_flag('new_data')
                                                            setcreate_group(!create_group)
                                                        } else {
                                                            setalert_box(true)
                                                            setalert_text('Your access level does not allow you to create Sites.')

                                                        }

                                                    }} style={{ display: 'flex', backgroundColor: create_group ? '#e32747' : '#e6e8eb', color: create_group ? 'white' : 'black' }}> <DomainAddOutlinedIcon style={{ marginRight: '10px' }} />Site Creation<ArrowDropDownIcon style={{ marginLeft: '10px' }} /></button>

                                                    <div>
                                                        <div style={{ borderRadius: '5px', backgroundColor: '#181828', padding: '10px', position: 'absolute', top: '60px', zIndex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', display: create_group ? 'block' : 'none' }}>
                                                            <div style={{ position: 'relative' }}>

                                                                <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: '-37px' }} />
                                                                <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                    <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                                                        <CloseIcon style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }} onClick={() => {
                                                                            setcreate_group(false)
                                                                        }} />
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '5px' }}>{'Create Group'}</p>
                                                                    <input type='text' value={group_name} placeholder={'Enter site name'} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray' }} onChange={(e) => {
                                                                        setgroup_name(e.target.value)
                                                                    }}></input>
                                                                </div>

                                                                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '5px' }}>
                                                                    <div>
                                                                        <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '5px' }}>Active</p>
                                                                        <input type='checkbox' checked={siteactive == 0 ? true : false} onChange={(e) => {
                                                                            if (e.target.checked == true) {
                                                                                setsiteactive(0)
                                                                            } else {
                                                                                setsiteactive(1)
                                                                            }

                                                                        }}></input>
                                                                    </div>

                                                                    <div>
                                                                        <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '5px' }}>Inactive</p>
                                                                        <input type='checkbox' checked={siteactive == 1 ? true : false} onChange={(e) => {
                                                                            if (e.target.checked == true) {
                                                                                setsiteactive(1)
                                                                            } else {
                                                                                setsiteactive(0)
                                                                            }

                                                                        }}></input>
                                                                    </div>
                                                                </div>

                                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                    <button style={{ backgroundColor: '#e32747', color: 'white', padding: '10px', borderRadius: '15px', border: 'none', marginTop: '10px' }} onClick={() => {
                                                                        const axios = require('axios');
                                                                        let data = JSON.stringify({
                                                                            'site_name': group_name,
                                                                            "user_id": userData._id,
                                                                            "Active": siteactive,
                                                                            created_date: moment(new Date()).format("YYYY-MM-DD"),
                                                                            created_time: moment(new Date()).format("YYYY-MM-DD"),
                                                                            updated_date: moment(new Date()).format("YYYY-MM-DD"),
                                                                            updated_time: moment(new Date()).format("YYYY-MM-DD"),
                                                                            client_admin_id: (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).client_admin_id,
                                                                            site_admin_id: (JSON.parse(localStorage.getItem("userData"))).position_type == 'Site Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).site_admin_id,
                                                                            clientt_id: (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).clientt_id,
                                                                        });

                                                                        let config = {
                                                                            method: 'post',
                                                                            maxBodyLength: Infinity,
                                                                            url: api.SITE_CREATION,
                                                                            headers: {
                                                                                'Content-Type': 'application/json'
                                                                            },
                                                                            data: data
                                                                        };

                                                                        axios.request(config)
                                                                            .then((response) => {
                                                                                // console.log(JSON.stringify(response.data));
                                                                                get_group_list()
                                                                                setgroup_name('')
                                                                                setsiteactive(0)
                                                                                setcreate_group(false)
                                                                            })
                                                                            .catch((error) => {
                                                                                console.log(error);
                                                                            })
                                                                    }}>Add Site</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ position: 'relative', }}>
                                                    <button className='eventbtn' onClick={() => {
                                                        setcreate_group_select(!create_group_select)

                                                    }} style={{ display: 'flex', backgroundColor: create_group_select ? '#e32747' : '#e6e8eb', color: create_group_select ? 'white' : 'black' }}> <CheckCircleOutlinedIcon style={{ marginRight: '10px' }} />Select Site<ArrowDropDownIcon style={{ marginLeft: '10px' }} /></button>

                                                    <div>
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
                                                                    {group_list.length != 0 ?
                                                                        group_list.map((val, i) => {
                                                                            let chk = false


                                                                            for (let index = 0; index < selected_sites.length; index++) {
                                                                                if (val._id == selected_sites[index]._id) {
                                                                                    chk = true
                                                                                    break
                                                                                } else {
                                                                                    chk = false
                                                                                }

                                                                            }
                                                                            return (
                                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                                                    <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '0px', marginRight: '10px' }}>{val.site_name}</p>
                                                                                    <input type='checkbox' checked={chk} onChange={(e) => {
                                                                                        if (e.target.checked == true) {
                                                                                            setselected_sites([...selected_sites, val])
                                                                                            list_camera_site_id([...selected_sites, val])
                                                                                            setsite_ind(i)
                                                                                        } else {

                                                                                            let sit_data = []
                                                                                            let camera_data = []

                                                                                            selected_sites.map((val, j) => {
                                                                                                if (i !== j) {
                                                                                                    sit_data.push(val)
                                                                                                }
                                                                                            })

                                                                                            data.map((value) => {
                                                                                                if (val._id !== value.site_id) {
                                                                                                    camera_data.push(value)
                                                                                                }
                                                                                            })

                                                                                            setselected_sites(sit_data)
                                                                                            setcameras(camera_data)
                                                                                            setcameras_view(camera_data)
                                                                                            setdata(camera_data)
                                                                                        }

                                                                                    }}></input>
                                                                                </div>
                                                                            )
                                                                        })
                                                                        :
                                                                        <p style={{ margin: 0, color: 'grey', fontWeight: 'bolder', marginBottom: '0px', marginRight: '10px' }}>No Sites</p>

                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>

                                        <Col>
                                            <hr></hr>
                                        </Col>
                                    </Row>
                                </div>
                                : ''
                            }


                            <div style={{ padding: '10px', paddingTop: 0 }}>
                                <Row style={{ backgroundColor: 'white', borderRadius: '5px', borderTopLeftRadius: site_manage_btn ? '0px' : '5px', borderTopRightRadius: site_manage_btn ? '0px' : '5px' }}>
                                    <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', }}>
                                        <div style={{ padding: '10px', display: 'flex' }}>
                                            {
                                                selected_sites.map((val, i) => (
                                                    <div style={{ position: 'relative' }}>
                                                        <p style={{ backgroundColor: '#e32747', color: 'white', padding: '5px', borderRadius: '20px', border: '1px solid gray', marginRight: '20px', display: 'inline-block', fontSize: '15px', cursor: 'pointer', marginBottom: 0 }} onClick={() => {
                                                            // list_camera_site_id(val._id)
                                                            // setsite_ind(i)
                                                            // let box = document.getElementsByClassName('site_edit')
                                                            // for (let index = 0; index < box.length; index++) {
                                                            //     if (index !== i) {
                                                            //         box[index].style.display = 'none'
                                                            //     } else {
                                                            //         if (box[index].style.display == 'none') {
                                                            //             box[index].style.display = 'block'
                                                            //         } else {
                                                            //             box[index].style.display = 'none'
                                                            //         }
                                                            //     }

                                                            // }
                                                            // setgroup_name(val.site_name)
                                                            // setsiteactive(val.Active)
                                                            // setsite_flag('put_data')
                                                        }}> {val.site_name} <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {

                                                            // let access = userData.operation_type.filter((val) => { return val == 'Delete' || val == 'All' })
                                                            // if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Delete' || access[1] == 'Delete') {

                                                            //     const options = {
                                                            //         url: api.SITE_CREATION + val._id,
                                                            //         method: 'DELETE',
                                                            //         headers: {
                                                            //             'Content-Type': 'application/json',
                                                            //             // 'Authorization': 'Bearer ' + window.localStorage.getItem('codeofauth')
                                                            //         }
                                                            //     };

                                                            //     axios(options)
                                                            //         .then(response => {
                                                            //             // console.log(response);

                                                            //             // if (group_list.length == 1) {

                                                            //             // } else if (site_ind == 0) {
                                                            //             //     list_camera_site_id(val._id)
                                                            //             //     setsite_ind(i + 1)
                                                            //             // } else if (site_ind + 1 == group_list.length) {
                                                            //             //     list_camera_site_id(val._id)
                                                            //             //     setsite_ind(i - 1)
                                                            //             // }
                                                            //             get_group_list()
                                                            //             setcreate_group(!create_group)

                                                            //         })

                                                            //         .catch(function (e) {


                                                            //             if (e.message === 'Network Error') {
                                                            //                 alert("No Internet Found. Please check your internet connection")
                                                            //             }

                                                            //             else {

                                                            //                 alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                                                            //             }


                                                            //         });
                                                            // } else {
                                                            //     setalert_box(true)
                                                            //     setalert_text('Your access level does not allow you to delete Sites.')

                                                            // }

                                                            let sit_data = []
                                                            let camera_data = []

                                                            selected_sites.map((val, j) => {
                                                                if (i !== j) {
                                                                    sit_data.push(val)
                                                                }
                                                            })

                                                            data.map((value) => {
                                                                if (val._id !== value.site_id) {
                                                                    camera_data.push(value)
                                                                }
                                                            })
                                                            setselected_sites(sit_data)
                                                            setcameras(camera_data)
                                                            setcameras_view(camera_data)
                                                            setdata(camera_data)


                                                        }} /></p>

                                                        <div>
                                                            <div className='site_edit' id={`site_edit_box${i}`} style={{ borderRadius: '5px', backgroundColor: '#181828', padding: '10px', position: 'absolute', top: '50px', zIndex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', display: 'none' }}>
                                                                <div style={{ position: 'relative' }}>

                                                                    <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: '-37px' }} />
                                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                        <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                                                            <CloseIcon style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }} onClick={() => {
                                                                                document.getElementById(`site_edit_box${i}`).style.display = 'none'
                                                                            }} />
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '5px' }}>{'Create Group'}</p>
                                                                        <input type='text' value={group_name} placeholder={'Enter site name'} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray' }} onChange={(e) => {
                                                                            setgroup_name(e.target.value)
                                                                        }}></input>
                                                                    </div>

                                                                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '5px' }}>
                                                                        <div>
                                                                            <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '5px' }}>Active</p>
                                                                            <input type='checkbox' checked={siteactive == 0 ? true : false} onChange={(e) => {
                                                                                if (e.target.checked == true) {
                                                                                    setsiteactive(0)
                                                                                } else {
                                                                                    setsiteactive(1)
                                                                                }

                                                                            }}></input>
                                                                        </div>

                                                                        <div>
                                                                            <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '5px' }}>Inactive</p>
                                                                            <input type='checkbox' checked={siteactive == 1 ? true : false} onChange={(e) => {
                                                                                if (e.target.checked == true) {
                                                                                    setsiteactive(1)
                                                                                } else {
                                                                                    setsiteactive(0)
                                                                                }

                                                                            }}></input>
                                                                        </div>
                                                                    </div>

                                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                        <button style={{ backgroundColor: '#e32747', color: 'white', padding: '10px', borderRadius: '15px', border: 'none', marginTop: '10px' }} onClick={() => {
                                                                            const axios = require('axios');
                                                                            let data = JSON.stringify({
                                                                                'site_name': group_name,
                                                                                "user_id": userData._id,
                                                                                "Active": siteactive,
                                                                                updated_date: moment(new Date()).format("YYYY-MM-DD"),
                                                                                updated_time: moment(new Date()).format("YYYY-MM-DD"),
                                                                                client_admin_id: (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).client_admin_id,
                                                                                site_admin_id: (JSON.parse(localStorage.getItem("userData"))).position_type == 'Site Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).site_admin_id,
                                                                                clientt_id: (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).clientt_id,
                                                                            });

                                                                            let config = {
                                                                                method: 'put',
                                                                                maxBodyLength: Infinity,
                                                                                url: api.SITE_CREATION + val._id,
                                                                                headers: {
                                                                                    'Content-Type': 'application/json'
                                                                                },
                                                                                data: data
                                                                            };

                                                                            axios.request(config)
                                                                                .then((response) => {
                                                                                    // console.log(JSON.stringify(response.data));
                                                                                    document.getElementById(`site_edit_box${i}`).style.display = 'none'
                                                                                    get_group_list()
                                                                                    setgroup_name('')
                                                                                    setsiteactive(0)
                                                                                })
                                                                                .catch((error) => {
                                                                                    console.log(error);
                                                                                })
                                                                        }}>Edit Site</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            {
                                group_list.length !== 0 ?


                                    <Row>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <div >

                                                <div style={{ backgroundColor: 'white', borderRadius: '5px', paddingTop: '10px' }}>
                                                    <Row style={{ padding: '10px', alignItems: 'center' }}>

                                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                            {
                                                                skeleton == true ?
                                                                    (
                                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                                                                            {/* Action Button */}
                                                                            <div>




                                                                                <input type='text' placeholder='Searchh' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginRight: '20px' }} value={top_camera_search} onChange={(e) => {
                                                                                    if (e.target.value !== '') {
                                                                                        searchfunction(e.target.value, camera_serach, 'camera_search')
                                                                                        settop_camera_search(e.target.value)
                                                                                    } else {
                                                                                        setcameras(roughData)
                                                                                        setcameras_view(roughData)
                                                                                        settop_camera_search(e.target.value)
                                                                                    }
                                                                                }}
                                                                                ></input>
                                                                                {/* {console.log("cameras view", cameras_view)} */}

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
                                                                                            // handleopeneuser_pass()
                                                                                            const data = {
                                                                                                "client_id": userDataFromLocalStorge._id
                                                                                            }

                                                                                            if (db_type == 'local') {
                                                                                                handleUserChooseMode()
                                                                                            } else {


                                                                                                axios.post(`${api.LIST_SUBSCRIPTION_PLAN}`, data).then((res) => {
                                                                                                    const mergedData = {};
                                                                                                    for (const obj of res.data.sub) {
                                                                                                        for (const key in obj) {
                                                                                                            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                                                                                                                if (!mergedData[key]) {
                                                                                                                    mergedData[key] = {};
                                                                                                                }
                                                                                                                for (const subKey in obj[key]) {
                                                                                                                    mergedData[key][subKey] = (mergedData[key][subKey] || 0) + obj[key][subKey];
                                                                                                                }
                                                                                                            } else {
                                                                                                                mergedData[key] = (mergedData[key] || 0) + obj[key];
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                    const mergedDataArray = [mergedData];
                                                                                                    setSubscriptionPlanData(mergedDataArray);
                                                                                                    setSubscriptionPlanApiData(apiData)
                                                                                                    // let total_camera_count = { two: { motion: 0, live: 0 }, four: { motion: 0, live: 0 }, eight: { motion: 0, live: 0 } }
                                                                                                    // // let camera_plan = res.data.sub
                                                                                                    // let camera_plan = apiData.sub

                                                                                                    // for (let index = 0; index < camera_plan.length; index++) {

                                                                                                    //     total_camera_count.two.motion = total_camera_count.two.motion + camera_plan[index].sub._2mp.motion.motion
                                                                                                    //     total_camera_count.two.live = total_camera_count.two.live + camera_plan[index].sub._2mp.continues.continues

                                                                                                    //     total_camera_count.four.motion = total_camera_count.four.motion + camera_plan[index].sub._4mp.motion.motion
                                                                                                    //     total_camera_count.four.live = total_camera_count.four.live + camera_plan[index].sub._4mp.continues.continues

                                                                                                    //     total_camera_count.eight.motion = total_camera_count.eight.motion + camera_plan[index].sub._8mp.motion.motion
                                                                                                    //     total_camera_count.eight.live = total_camera_count.eight.live + camera_plan[index].sub._8mp.continues.continues
                                                                                                    // }

                                                                                                    // let total_count = 0
                                                                                                    // total_count = total_count + (total_camera_count.two.motion + total_camera_count.two.live)
                                                                                                    // total_count = total_count + (total_camera_count.four.motion + total_camera_count.four.live)
                                                                                                    // total_count = total_count + (total_camera_count.eight.motion + total_camera_count.eight.live)
                                                                                                    // setSubscriptionPlanData(total_camera_count)
                                                                                                    // let totalCountData = {
                                                                                                    //     two: (total_camera_count.two.motion + total_camera_count.two.live),
                                                                                                    //     four: (total_camera_count.four.motion + total_camera_count.four.live),
                                                                                                    //     eight: (total_camera_count.eight.motion + total_camera_count.eight.live)
                                                                                                    // }
                                                                                                    // console.log('total count', totalCountData)
                                                                                                    // setTotal_camera_count_plan(totalCountData)
                                                                                                    setblur_div(false)
                                                                                                    handleUserChooseMode()

                                                                                                }).catch((err) => console.log(err))
                                                                                            }


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
                                                                                            // handleUserChooseMode()
                                                                                            setblur_div(true)

                                                                                            if (db_type == 'local') {
                                                                                                handleUserChooseMode()
                                                                                            } else {
                                                                                                const data = {
                                                                                                    "client_id": userDataFromLocalStorge._id
                                                                                                }
                                                                                                axios.post(`${api.LIST_SUBSCRIPTION_PLAN}`, data).then((res) => {
                                                                                                    setSubscriptionPlanData(res.data.sub)
                                                                                                    console.log('subscriptionplandata', subscriptionPlanData)
                                                                                                    // let total_camera_count = { two: { motion: 0, live: 0 }, four: { motion: 0, live: 0 }, eight: { motion: 0, live: 0 } }
                                                                                                    // let camera_plan = res.data.sub

                                                                                                    // for (let index = 0; index < camera_plan.length; index++) {

                                                                                                    //     total_camera_count.two.motion = total_camera_count.two.motion + camera_plan[index].sub._2mp.motion.motion
                                                                                                    //     total_camera_count.two.live = total_camera_count.two.live + camera_plan[index].sub._2mp.continues.continues

                                                                                                    //     total_camera_count.four.motion = total_camera_count.four.motion + camera_plan[index].sub._4mp.motion.motion
                                                                                                    //     total_camera_count.four.live = total_camera_count.four.live + camera_plan[index].sub._4mp.continues.continues

                                                                                                    //     total_camera_count.eight.motion = total_camera_count.eight.motion + camera_plan[index].sub._8mp.motion.motion
                                                                                                    //     total_camera_count.eight.live = total_camera_count.eight.live + camera_plan[index].sub._8mp.continues.continues
                                                                                                    // }

                                                                                                    // let total_count = 0
                                                                                                    // total_count = total_count + (total_camera_count.two.motion + total_camera_count.two.live)
                                                                                                    // total_count = total_count + (total_camera_count.four.motion + total_camera_count.four.live)
                                                                                                    // total_count = total_count + (total_camera_count.eight.motion + total_camera_count.eight.live)
                                                                                                    setblur_div(false)
                                                                                                    handleUserChooseMode()
                                                                                                    // setSubscriptionPlanData(total_camera_count)
                                                                                                    // setTotal_camera_count_plan(total_count)
                                                                                                }).catch((err) => console.log(err))
                                                                                            }
                                                                                        } else {
                                                                                            setalert_box(true)
                                                                                            setalert_text(`Your access level does not allow you to download these (${cam_name}) videos.`)

                                                                                        }
                                                                                        setsave_type('new_data')
                                                                                    }
                                                                                }}> <TuneOutlinedIcon style={{ marginRight: '10px' }} />Add Cameras</button>
                                                                            </div>


                                                                            {/* Action Button */}

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
                                                                                                    socket_camera_count = 0
                                                                                                    if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                                                                                                        let access = userData.operation_type.filter((val) => { return val == 'Edit' || val == 'All' })
                                                                                                        if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Edit' || access[1] == 'Edit') {
                                                                                                            if (selectedcameras.length != 0) {
                                                                                                                let cam_obj = []
                                                                                                                let cam_count = []
                                                                                                                // console.log(site_list1);
                                                                                                                // console.log(selectedcameras);
                                                                                                                selectedcameras.map((val) => {
                                                                                                                    let str = 'Select'
                                                                                                                    let str1 = 'Select'
                                                                                                                    site_list1.map((value) => {
                                                                                                                        if (val.site_id == value._id) {
                                                                                                                            str = value.site_name
                                                                                                                        }
                                                                                                                    })

                                                                                                                    device_list.map((value) => {
                                                                                                                        if (val.device_id == value.device_id) {
                                                                                                                            str1 = value.device_name
                                                                                                                        }
                                                                                                                    })

                                                                                                                    cam_obj.push({
                                                                                                                        camera_name: val.camera_gereral_name,
                                                                                                                        camera_id: val.camera_id,
                                                                                                                        ip_address: { select: val.ip_address, device_id: { select: str1, id: val.device_id } },
                                                                                                                        site: { select: str, id: val.site_id },
                                                                                                                        active: val.Active,
                                                                                                                        cloud: val.cloud_recording,
                                                                                                                        main_stream: val.camera_url,
                                                                                                                        user_name: val.camera_username,
                                                                                                                        password: val.password,
                                                                                                                        camera_mp: val.camera_mp,
                                                                                                                        sub_stream: val.live_uri,
                                                                                                                        analytic: val.analytics_alert,
                                                                                                                        alert_noti: val.notification_alert,
                                                                                                                        from: val.from,
                                                                                                                        to: val.to,
                                                                                                                        plan_end_date: val.plan_end_date,
                                                                                                                        plan_end_time: val.plan_end_time,
                                                                                                                        plan_start_date: val.plan_start_date,
                                                                                                                        plan_start_time: val.start_time,
                                                                                                                        subscribe_id: val.subscribe_id,
                                                                                                                    })
                                                                                                                    cam_count = [...cam_count, Number(cam_count.length)]
                                                                                                                })
                                                                                                                console.log(cam_obj);
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
                                                                                                                    let str1 = 'Select'
                                                                                                                    site_list1.map((value) => {
                                                                                                                        if (val.site_id == value.site_id) {
                                                                                                                            str = value.site_name
                                                                                                                        }
                                                                                                                    })

                                                                                                                    device_list.map((value) => {
                                                                                                                        if (val.device_id == value.device_id) {
                                                                                                                            str1 = value.device_id
                                                                                                                        }
                                                                                                                    })

                                                                                                                    camera_object.push({
                                                                                                                        camera_name: val.camera_gereral_name,
                                                                                                                        camera_id: val.camera_id,
                                                                                                                        ip_address: { select: val.ip_address, device_id: { select: str1, id: val.device_id } },
                                                                                                                        site: { select: str, id: val.site_id },
                                                                                                                        active: val.Active,
                                                                                                                        cloud: val.cloud_recording,
                                                                                                                        main_stream: val.camera_url,
                                                                                                                        user_name: val.camera_username,
                                                                                                                        password: val.password,
                                                                                                                        camera_mp: val.camera_mp,
                                                                                                                        sub_stream: val.live_uri,
                                                                                                                        analytic: val.analytics_alert,
                                                                                                                        alert_noti: val.notification_alert,
                                                                                                                        from: val.from,
                                                                                                                        to: val.to,
                                                                                                                        plan_end_date: val.plan_end_date,
                                                                                                                        plan_end_time: val.plan_end_time,
                                                                                                                        plan_start_date: val.plan_start_date,
                                                                                                                        plan_start_time: val.start_time,
                                                                                                                        subscribe_id: val.subscribe_id,
                                                                                                                    })
                                                                                                                })
                                                                                                                setsave_type('put_data')
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
                                                                                                {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <div style={{ height: '1px', width: '90%', backgroundColor: 'white' }}></div>
                                        </div>
                                        <p style={{ color: 'white', fontSize: '15px', margin: 0, marginRight: '10px', cursor: 'pointer', padding: '15px' }} onClick={() => {
                                            let access = userData.operation_type.filter((val) => { return val == 'Create' || val == 'All' })
                                            if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Delete' || access[1] == 'Delete') {
                                                flag_type = 'delete_tag';
                                                get_tag_full_list()
                                            } else {
                                                setalert_box(true)
                                                setalert_text('Your access level does not allow you to create Sites.')

                                            }

                                        }}>Delete tags</p> */}
                                                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                                                    <div style={{ height: '1px', width: '90%', backgroundColor: 'white' }}></div>
                                                                                                </div>
                                                                                                <p style={{ color: 'white', fontSize: '15px', margin: 0, marginRight: '10px', cursor: 'pointer', padding: '15px' }} onClick={() => {
                                                                                                    let access = userData.operation_type.filter((val) => { return val == 'Create' || val == 'All' })
                                                                                                    if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Create' || access[1] == 'Create') {
                                                                                                        flag_type = 'add_group';
                                                                                                        get_tag_list()
                                                                                                    } else {
                                                                                                        setalert_box(true)
                                                                                                        setalert_text('Your access level does not allow you to create Sites.')

                                                                                                    }

                                                                                                }}>Create group</p>
                                                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                                                    <div style={{ height: '1px', width: '90%', backgroundColor: 'white' }}></div>
                                                                                                </div>
                                                                                                <p style={{ color: 'white', fontSize: '15px', margin: 0, marginRight: '10px', cursor: 'pointer', padding: '15px' }} onClick={() => {
                                                                                                    let access = userData.operation_type.filter((val) => { return val == 'Edit' || val == 'All' })
                                                                                                    if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Edit' || access[1] == 'Edit') {


                                                                                                        let box = document.getElementsByClassName('site_edit')
                                                                                                        for (let index = 0; index < box.length; index++) {
                                                                                                            if (index !== site_ind) {
                                                                                                                box[index].style.display = 'none'
                                                                                                            } else {
                                                                                                                if (box[index].style.display == 'none') {
                                                                                                                    box[index].style.display = 'block'
                                                                                                                } else {
                                                                                                                    box[index].style.display = 'none'
                                                                                                                }
                                                                                                            }

                                                                                                        }
                                                                                                        setgroup_name(group_list[site_ind].site_name)
                                                                                                        setsiteactive(group_list[site_ind].Active)
                                                                                                        setsite_flag('put_data')
                                                                                                    } else {
                                                                                                        setalert_box(true)
                                                                                                        setalert_text('Your access level does not allow you to create Sites.')

                                                                                                    }
                                                                                                }}>Edit Site</p>
                                                                                                {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <div style={{ height: '1px', width: '90%', backgroundColor: 'white' }}></div>
                                        </div>
                                        <p style={{ color: 'white', fontSize: '15px', margin: 0, marginRight: '10px', cursor: 'pointer', padding: '15px' }} onClick={() => {
                                            let access = userData.operation_type.filter((val) => { return val == 'Create' || val == 'All' })
                                            if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Delete' || access[1] == 'Delete') {
                                                flag_type = 'delete_group';
                                                get_tag_full_list()
                                            } else {
                                                setalert_box(true)
                                                setalert_text('Your access level does not allow you to create Sites.')

                                            }
                                        }}>Delete Group</p> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>)

                                                                    : (
                                                                        <div style={{ display: 'flex', alignItems: 'center', }}>

                                                                            <Skeleton width={220} height={45} style={{ borderRadius: '20px', border: '1px solid gray', }} />
                                                                            <Skeleton width={100} height={45} style={{ borderRadius: '20px', border: '1px solid gray', marginLeft: "20px" }} />
                                                                            <Skeleton width={170} height={45} style={{ borderRadius: '20px', border: '1px solid gray', marginLeft: "20px" }} />
                                                                        </div>
                                                                    )

                                                            }

                                                        </Col>

                                                    </Row>

                                                    {/* Filters Div */}
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
                                                                                                searchfunction(e.target.value, camera_serach, 'camera_search1')
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
                                                                                                setcameras_view1(data)
                                                                                                setcamera_box(!camera_box)
                                                                                                setcamera_serach(data)
                                                                                                setcameras(roughData)
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
                                                                                                                                // console.log(get_tag_full_data);
                                                                                                                                // console.log(val.camera_tags);
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
                                                                                                                setcameras_view1(newcamera)
                                                                                                                setcamera_serach(newcamera)
                                                                                                                setcameras(newcamera)
                                                                                                                setonline_cam(online)
                                                                                                                setoffline_cam(offline)
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
                                                                                                                    setcamera_serach(data)
                                                                                                                    setcameras(data)
                                                                                                                    setonline_cam(data)
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
                                                                                                                    setcameras_view1(new_camera_list)
                                                                                                                    setcamera_serach(new_camera_list)
                                                                                                                    setcameras(new_camera_list)
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
                                                                                            // setcameras(cameras_view1)
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

                                                                                                // setcameras(new_date)
                                                                                                setcameras_view(new_date)
                                                                                                // setcameras_search(new_date)
                                                                                            } else {
                                                                                                if (!document.getElementById('offline_status').checked && !e.target.checked) {
                                                                                                    // setcameras(cameras_view1)
                                                                                                    setcameras_view(cameras_view1)
                                                                                                    // setcameras_search(cameras_view1)
                                                                                                } else {
                                                                                                    let new_date = []
                                                                                                    cameras_view.map((val) => {
                                                                                                        if (val.camera_health != 'Online') {
                                                                                                            new_date.push(val)
                                                                                                        }
                                                                                                    })

                                                                                                    // setcameras(new_date)
                                                                                                    setcameras_view(new_date)
                                                                                                    // setcameras_search(new_date)
                                                                                                }

                                                                                            }
                                                                                        }

                                                                                    }}></input>
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
                                                                                            // setcameras(cameras_view1)
                                                                                            // setcameras_search(cameras_view1)
                                                                                            setcameras_view(cameras_view1)
                                                                                        } else {
                                                                                            if (e.target.checked === true) {
                                                                                                let new_date = []
                                                                                                cameras_view.map((val) => {
                                                                                                    if (val.camera_health == 'Offline') {
                                                                                                        new_date.push(val)
                                                                                                    }
                                                                                                })

                                                                                                // setcameras(new_date)
                                                                                                setcameras_view(new_date)
                                                                                                // setcameras_search(new_date)
                                                                                            } else {
                                                                                                if (!document.getElementById('online_status').checked && !e.target.checked) {
                                                                                                    // setcameras(cameras_view1)
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
                                                                                                    // setcameras(new_date)
                                                                                                    // setcameras_search(new_date)
                                                                                                }

                                                                                            }
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

                                                                                                    setcamera_tag(!camera_tag)
                                                                                                    // setcameras(roughData)
                                                                                                    settag_checkbox([])
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

                                                                                                                                let findPermissionLevel = roughData.find((d) => d._id === response.data[k]._id).permission_level

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
                                                                                                                                        setcameras(online_list)
                                                                                                                                        setcameras_search(online_list)
                                                                                                                                    } else if (check3[1].checked == true) {
                                                                                                                                        setcameras_view(offline_list)
                                                                                                                                        setcameras(offline_list)
                                                                                                                                        setcameras_search(offline_list)
                                                                                                                                    } else {
                                                                                                                                        setcameras_view(new_camera_list)
                                                                                                                                        setcameras(new_camera_list)
                                                                                                                                        // setcameras_search(new_camera_list)
                                                                                                                                    }


                                                                                                                                    setcameras_view1(new_camera_list)
                                                                                                                                    setcameras_view(new_camera_list)
                                                                                                                                    // console.log(new_camera_list)
                                                                                                                                    settag_checkbox([...tag_checkbox, value._id])
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

                                                                                                                                // let findPermissionLevel = roughData.find((d) => d._id === response.data[k]._id).permission_level
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
                                                                                                                                //         setcameras(online_list)
                                                                                                                                //         setcameras_search(online_list)
                                                                                                                                //     } else if (check3[1].checked == true) {
                                                                                                                                //         setcameras_view(offline_list)
                                                                                                                                //         setcameras(offline_list)
                                                                                                                                //         setcameras_search(offline_list)
                                                                                                                                //     } else {
                                                                                                                                //         setcameras_view(new_camera_list)
                                                                                                                                //         setcameras(new_camera_list)
                                                                                                                                //         // setcameras_search(new_camera_list)
                                                                                                                                //     }


                                                                                                                                //     setcameras_view1(new_camera_list)
                                                                                                                                //     setcameras_view(new_camera_list)
                                                                                                                                //     // console.log(new_camera_list)
                                                                                                                                //     settag_checkbox([...tag_checkbox, value._id])
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

                                                                                                    setcamera_group(!camera_group)
                                                                                                    // setcameras(roughData)
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
                                                                                                    // console.log('value.length', value.groups.length)
                                                                                                    // console.log('value.Name', value.groups)
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
                                                                                                                        .then((response) => {
                                                                                                                            // console.log(response.data)
                                                                                                                            let count = 0
                                                                                                                            let data1 = []

                                                                                                                            response.data.map((val) => {

                                                                                                                                count = count + 1

                                                                                                                                let findPermissionLevel = roughData.find((d) => d._id === response.data[k]._id).permission_level

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
                                                                                                                                        setcameras(online_list)
                                                                                                                                        setcameras_view(online_list)
                                                                                                                                        setcameras_search(online_list)
                                                                                                                                    } else if (check3[1].checked == true) {
                                                                                                                                        setcameras(offline_list)
                                                                                                                                        setcameras_view(offline_list)
                                                                                                                                        setcameras_search(offline_list)
                                                                                                                                    } else {
                                                                                                                                        setcameras(new_camera_list)
                                                                                                                                        setcameras_view(new_camera_list)
                                                                                                                                        // setcameras_search(new_camera_list)
                                                                                                                                    }


                                                                                                                                    setcameras_view1(new_camera_list)
                                                                                                                                    setcameras_view(new_camera_list)
                                                                                                                                    // console.log(new_camera_list)
                                                                                                                                    setgroup_checkbox([...group_checkbox, value._id])
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

                                                                                                                                // let findPermissionLevel = roughData.find((d) => d._id === response.data[k]._id).permission_level
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
                                                                                                                                //         setcameras(online_list)
                                                                                                                                //         setcameras_view(online_list)
                                                                                                                                //         setcameras_search(online_list)
                                                                                                                                //     } else if (check3[1].checked == true) {
                                                                                                                                //         setcameras(offline_list)
                                                                                                                                //         setcameras_view(offline_list)
                                                                                                                                //         setcameras_search(offline_list)
                                                                                                                                //     } else {
                                                                                                                                //         setcameras(new_camera_list)
                                                                                                                                //         setcameras_view(new_camera_list)
                                                                                                                                //         // setcameras_search(new_camera_list)
                                                                                                                                //     }


                                                                                                                                //     setcameras_view1(new_camera_list)
                                                                                                                                //     setcameras_view(new_camera_list)
                                                                                                                                //     // console.log(new_camera_list)
                                                                                                                                //     setgroup_checkbox([...group_checkbox, value._id])
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





                                                    {/* Cameras Data */}
                                                    {

                                                        skeleton == true ?
                                                            <Row style={{ padding: '10px', alignItems: 'center', }}>

                                                                <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ overflowX: 'scroll' }}>
                                                                    <table style={{ width: '100%', backgroundColor: 'white' }}>
                                                                        <tr style={{ backgroundColor: '#e6e8eb', color: 'black', }}>
                                                                            <th style={{ padding: '15px' }}><input type='checkbox' checked={selectedcameras.length === cameras.length ? true : false} onClick={(e) => {
                                                                                let check = document.getElementsByClassName('check')

                                                                                if (e.target.checked === true) {
                                                                                    for (let i = 0; i < check.length; i++) {
                                                                                        check[i].checked = true
                                                                                        let img = document.getElementById(`dash_image${i}`)
                                                                                        camera_list_image.push(img.src)
                                                                                    }
                                                                                    setselectedcameras(cameras)
                                                                                    dispatch({ type: SELECTED_CAMERAS, value: cameras })
                                                                                } else {
                                                                                    for (let i = 0; i < check.length; i++) {
                                                                                        check[i].checked = false
                                                                                    }
                                                                                    setselectedcameras([])
                                                                                    setselectedcameras([])
                                                                                    dispatch({ type: SELECTED_CAMERAS, value: [] })
                                                                                }

                                                                            }}></input></th>
                                                                            <th style={{ padding: '15px' }}>Cameras</th>
                                                                            <th style={{ padding: '15px' }}>Cameras name</th>
                                                                            <th style={{ padding: '15px' }}>Status</th>
                                                                            {/* <th style={{ padding: '15px' }}>Cloud Adapter ID</th> */}
                                                                            <th style={{ padding: '15px' }}>Recording mode</th>
                                                                            <th style={{ padding: '15px' }}>Analytics</th>
                                                                            <th style={{ padding: '15px' }}>Main</th>
                                                                            <th style={{ padding: '15px' }}>Publish Mode</th>
                                                                            <th style={{ padding: '15px' }}>Alert</th>
                                                                            <th style={{ padding: '15px' }}>People Analytics</th>
                                                                            <th style={{ padding: '15px' }}>Vehicle Analytics</th>
                                                                            <th style={{ padding: '15px' }}>Face Recognition</th>
                                                                            <th style={{ padding: '15px' }}>ANPR</th>
                                                                            <th style={{ padding: '15px' }}>Device id</th>
                                                                            <th style={{ padding: '15px' }}>Tags</th>
                                                                            <th style={{ padding: '15px' }}>Groups</th>
                                                                        </tr>
                                                                        {console.log('Cameras view', cameras_view)}
                                                                        {
                                                                            cameras_view != 'no_res' ?
                                                                                cameras_view.map((val, i) => {
                                                                                    let chk = ""

                                                                                    if (selectedcameras.length !== 0) {
                                                                                        for (let i = 0; i < selectedcameras.length; i++) {
                                                                                            if (selectedcameras[i]._id === val._id) {
                                                                                                chk = true
                                                                                                break
                                                                                            } else {
                                                                                                chk = false
                                                                                            }
                                                                                        }
                                                                                    } else {
                                                                                        chk = false
                                                                                    }
                                                                                    getimageurifunction(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, val, i)
                                                                                    return (
                                                                                        <tr style={{ borderBottom: '1px solid grey', color: 'black' }}>
                                                                                            <td style={{ padding: '15px' }}><input className='check' checked={chk} type='checkbox' onClick={(e) => {
                                                                                                if (e.target.checked === true) {
                                                                                                    setselectedcameras((old) => {
                                                                                                        let img = document.getElementById(`dash_image${i}`)
                                                                                                        camera_list_image.push(img.src)
                                                                                                        dispatch({ type: SELECTED_CAMERAS, value: [...old, val] })
                                                                                                        return [...old, val]
                                                                                                    })
                                                                                                } else {
                                                                                                    let arr = []
                                                                                                    selectedcameras.map((data, i) => {
                                                                                                        if (val._id !== data._id) {
                                                                                                            let img = document.getElementById(`dash_image${i}`)
                                                                                                            camera_list_image.push(img.src)
                                                                                                            arr.push(data)
                                                                                                        }
                                                                                                    })
                                                                                                    setselectedcameras(arr)
                                                                                                    dispatch({ type: SELECTED_CAMERAS, value: arr })
                                                                                                }

                                                                                            }}></input></td>
                                                                                            <td style={{ padding: '15px' }}>
                                                                                                <div style={{ position: "relative", width: "150px", height: "100px" }}>
                                                                                                    <div style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, display: "flex", overflow: "hidden", justifyContent: "center", alignItems: "center" }}>
                                                                                                        <div id={`skle${i}`}>
                                                                                                            <Skeleton width={150} height={100} />
                                                                                                        </div>
                                                                                                        <img style={{ display: 'none' }} id={`dash_image${i}`} width={150} height={100}
                                                                                                            src={val.image_key} alt='Tento vision image is loading' onError={(e) => {
                                                                                                                e.target.src = tentovision_logo
                                                                                                            }}
                                                                                                        ></img>

                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>
                                                                                            <td style={{ padding: '15px' }}>{val.camera_gereral_name}</td>
                                                                                            <td style={{ padding: '15px', color: val.camera_health == 'Online' ? '#1ee01e' : 'red' }}>{val.camera_health}</td>
                                                                                            {/* <td style={{ padding: '15px' }}>CAgxrx</td> */}
                                                                                            <td style={{ padding: '15px' }}> {val.camera_option.motion != 0 ? 'Motion triggered' : val.camera_option.live != 0 ? '24/7 Continuous' : 'Not Selected'}</td>
                                                                                            <td style={{ padding: '15px' }}>{val.camera_option.alert != 0 ? 'Alert,' : ''} {val.camera_option.alert != 0 ? 'Analytics,' : ''} {val.camera_option.cloud != 0 ? `Cloud(${val.camera_option.cloud}),` : ''} {val.camera_option.local != 0 ? `Local(${val.camera_option.local}),` : ''} {val.camera_option.people_analytics != undefined && val.camera_option.people_analytics != 0 ? 'People,' : ''} {val.camera_option.vehicle_analytics != undefined && val.camera_option.vehicle_analytics != 0 ? 'Vehicle,' : ''} {val.camera_option.face_dedaction != undefined && val.camera_option.face_dedaction != 0 ? 'Face,' : ''} {val.camera_option.anpr != undefined && val.camera_option.anpr != 0 ? 'ANPR,' : ''}</td>

                                                                                            <td>
                                                                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                                                                                    <div style={{ backgroundColor: val.main_type == 'true' ? '#e22747' : '#e6e8eb', width: '1rem', height: '1rem', borderRadius: '50%' }} onClick={() => {

                                                                                                        if (val.main_type == 'true') {
                                                                                                            setblur_div(true)
                                                                                                            const device_details = {
                                                                                                                "main_type": 'false'
                                                                                                            };

                                                                                                            const options = {
                                                                                                                url: api.CAMERA_CREATION + val._id,
                                                                                                                method: 'PUT',
                                                                                                                headers: {
                                                                                                                    'Content-Type': 'application/json',
                                                                                                                },
                                                                                                                data: JSON.stringify(device_details)
                                                                                                            };

                                                                                                            console.log(device_details)

                                                                                                            axios(options)
                                                                                                                .then(response => {
                                                                                                                    list_camera_site_id(selected_sites)
                                                                                                                }).catch((e) => {
                                                                                                                    console.log(e)
                                                                                                                })
                                                                                                        } else {
                                                                                                            setmain_cam_value('In')
                                                                                                            setmain_type_id(val._id)
                                                                                                            setmain_cam_model(true)
                                                                                                        }

                                                                                                    }}>
                                                                                                    </div>
                                                                                                    {
                                                                                                        val.main_type == 'true' ?
                                                                                                            <p style={{ margin: 0, marginLeft: '3px' }}>{`(${val.overall_count})`}</p>
                                                                                                            : ''
                                                                                                    }

                                                                                                </div>
                                                                                            </td>

                                                                                            <td>
                                                                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                                                                                    <div>
                                                                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                                                            <SettingsEthernetIcon style={{ fontSize: 'small' }} />
                                                                                                            <SyncAltIcon style={{ fontSize: 'small' }} />
                                                                                                        </div>
                                                                                                        <div style={{ backgroundColor: val.camera_option.publish_mode != 0 ? '#f7a000' : '#85c9e8', width: '3rem', height: '1.5rem', borderRadius: '5px', display: 'flex', justifyContent: val.camera_option.publish_mode != 0 ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }} onClick={() => {

                                                                                                            setblur_div(true)
                                                                                                            const device_details = {
                                                                                                                "camera_option": { ...val.camera_option, publish_mode: val.camera_option.publish_mode == 0 ? 1 : 0 }
                                                                                                            };

                                                                                                            const options = {
                                                                                                                url: api.CAMERA_CREATION + val._id,
                                                                                                                method: 'PUT',
                                                                                                                headers: {
                                                                                                                    'Content-Type': 'application/json',
                                                                                                                },
                                                                                                                data: JSON.stringify(device_details)
                                                                                                            };

                                                                                                            console.log(device_details)

                                                                                                            axios(options)
                                                                                                                .then(response => {
                                                                                                                    console.log(response)
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


                                                                                                                    const params = {
                                                                                                                        topic: `${val.device_id}/live_camera`,
                                                                                                                        payload: JSON.stringify({ camera_id: val._id, publish_mode: val.camera_option.publish_mode == 0 ? 1 : 0 }),
                                                                                                                        qos: 0
                                                                                                                    };

                                                                                                                    iot.publish(params, (err, data) => {
                                                                                                                        if (err) {
                                                                                                                            console.error('Error publishing message:', err);
                                                                                                                        } else {
                                                                                                                            console.log('Message published successfully:', data);
                                                                                                                            list_camera_site_id(selected_sites)
                                                                                                                        }
                                                                                                                    });
                                                                                                                }).catch((e) => {
                                                                                                                    console.log(e)
                                                                                                                })
                                                                                                        }}>
                                                                                                            <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '20%' }}></div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>

                                                                                            <td>
                                                                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                                                                                    <div style={{ backgroundColor: val.camera_option.alert != 0 ? '#42cf10' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: val.camera_option.alert != 0 ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }} onClick={() => {
                                                                                                        setanalytic_type('masking')
                                                                                                        setalert_end_time('')
                                                                                                        setalert_start_time('')

                                                                                                        if (val.camera_option.alert == 1) {
                                                                                                            setblur_div(true)
                                                                                                            const device_details = {
                                                                                                                "camera_option": { ...val.camera_option, alert: 0 }
                                                                                                            };

                                                                                                            const options = {
                                                                                                                url: api.CAMERA_CREATION + val._id,
                                                                                                                method: 'PUT',
                                                                                                                headers: {
                                                                                                                    'Content-Type': 'application/json',
                                                                                                                },
                                                                                                                data: JSON.stringify(device_details)
                                                                                                            };

                                                                                                            console.log(device_details)

                                                                                                            axios(options)
                                                                                                                .then(response => {
                                                                                                                    list_camera_site_id(selected_sites)
                                                                                                                }).catch((e) => {
                                                                                                                    console.log(e)
                                                                                                                })
                                                                                                        } else {
                                                                                                            setalertmodel(true)

                                                                                                            const data = {
                                                                                                                "client_id": userData._id
                                                                                                            }

                                                                                                            if (db_type == 'local') {
                                                                                                                if (val.image_edited.length != 0 && val.image_edited[0].url != 'NONE') {
                                                                                                                    let image_array = []
                                                                                                                    if (val.image_edited.length == 0) {
                                                                                                                        image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                    } else {
                                                                                                                        let data = []

                                                                                                                        if (Object.keys(val.image_edited[0]).length == 6) {
                                                                                                                            val.image_edited.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        } else {
                                                                                                                            val.image_edited.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        }
                                                                                                                    }
                                                                                                                    setover_image_array(image_array)
                                                                                                                    setedit_image(val.image_edited.length != 0 ? val.image_edited[0].url : 'NONE')
                                                                                                                    setmask_range_name(val.image_edited[0].name)
                                                                                                                    setdirection_name(val.image_edited[0].direction == undefined ? 'LeftToRight' : val.image_edited[0].direction)
                                                                                                                    setin_out(val.image_edited[0].sequence == undefined ? 'In' : val.image_edited[0].sequence)
                                                                                                                    setfrom_time(val.image_edited[0].from_time == undefined ? '00:00' : val.image_edited[0].from_time)
                                                                                                                    setto_time(val.image_edited[0].to_time == undefined ? '23:59' : val.image_edited[0].to_time)
                                                                                                                    settype(val.image_edited[0].type == undefined ? 'Intrution' : val.image_edited[0].type)
                                                                                                                    setclass_name(val.image_edited[0].class == undefined ? 'People' : val.image_edited[0].class)
                                                                                                                    setthreshold(val.image_edited[0].threshold == undefined ? 0 : val.image_edited[0].threshold)
                                                                                                                    setmask_image(val.mask)
                                                                                                                    setalertmodel(true)
                                                                                                                    setalert_value(val)
                                                                                                                    setSubscriptionPlanData('')
                                                                                                                } else {
                                                                                                                    let image_array = []
                                                                                                                    if (val.image_edited.length == 0) {
                                                                                                                        image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                    } else {
                                                                                                                        let data = []
                                                                                                                        if (Object.keys(val.image_edited[0]).length == 6) {
                                                                                                                            val.image_edited.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        } else {
                                                                                                                            val.image_edited.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        }
                                                                                                                    }
                                                                                                                    setover_image_array(image_array)
                                                                                                                    setedit_image('none')
                                                                                                                    setmask_range_name('None')
                                                                                                                    setdirection_name('LeftToRight')
                                                                                                                    setin_out('In')
                                                                                                                    setfrom_time('00:00')
                                                                                                                    setto_time('23:59')
                                                                                                                    settype('Intrution')
                                                                                                                    setclass_name('People')
                                                                                                                    setthreshold(0)
                                                                                                                    setmask_image(val.mask)
                                                                                                                    setalertmodel(true)
                                                                                                                    setalert_value(val)
                                                                                                                    setSubscriptionPlanData('')
                                                                                                                }
                                                                                                            } else {
                                                                                                                axios.post(api.LIST_SUBSCRIPTION_PLAN, data).then((res) => {

                                                                                                                    console.log(res.data);
                                                                                                                    const s3Client = new S3Client({
                                                                                                                        region: "ap-south-1",
                                                                                                                        credentials: {
                                                                                                                            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
                                                                                                                            secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
                                                                                                                        },
                                                                                                                    });

                                                                                                                    const image_command = new GetObjectCommand({
                                                                                                                        Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                                                                                                                        Key: val.mask,
                                                                                                                    });

                                                                                                                    getSignedUrl(s3Client, image_command)
                                                                                                                        .then((response) => {

                                                                                                                            const image_command = new GetObjectCommand({
                                                                                                                                Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                                                                                                                                Key: val.image_edited.length != 0 ? val.image_edited[0].url : 'NONE',
                                                                                                                            });

                                                                                                                            if (val.image_edited.length != 0 && val.image_edited[0].url != 'NONE') {
                                                                                                                                getSignedUrl(s3Client, image_command)
                                                                                                                                    .then((edit) => {
                                                                                                                                        let image_array = []
                                                                                                                                        if (val.image_edited.length == 0) {
                                                                                                                                            image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                                        } else {
                                                                                                                                            let data = []
                                                                                                                                            if (Object.keys(val.image_edited[0]).length == 6) {
                                                                                                                                                val.image_edited.map((da, i) => {
                                                                                                                                                    data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                                                })
                                                                                                                                                image_array.push({ id: val._id, img_arr: data })
                                                                                                                                            } else {
                                                                                                                                                val.image_edited.map((da, i) => {
                                                                                                                                                    data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                                                })
                                                                                                                                                image_array.push({ id: val._id, img_arr: data })
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                        setover_image_array(image_array)
                                                                                                                                        setedit_image(edit)
                                                                                                                                        setmask_range_name(val.image_edited[0].name)
                                                                                                                                        setdirection_name(val.image_edited[0].direction == undefined ? 'LeftToRight' : val.image_edited[0].direction)
                                                                                                                                        setin_out(val.image_edited[0].sequence == undefined ? 'In' : val.image_edited[0].sequence)
                                                                                                                                        setfrom_time(val.image_edited[0].from_time == undefined ? '00:00' : val.image_edited[0].from_time)
                                                                                                                                        setto_time(val.image_edited[0].to_time == undefined ? '23:59' : val.image_edited[0].to_time)
                                                                                                                                        settype(val.image_edited[0].type == undefined ? 'Intrution' : val.image_edited[0].type)
                                                                                                                                        setclass_name(val.image_edited[0].class == undefined ? 'People' : val.image_edited[0].class)
                                                                                                                                        setthreshold(val.image_edited[0].threshold == undefined ? 0 : val.image_edited[0].threshold)
                                                                                                                                        setmask_image(response)
                                                                                                                                        setalertmodel(true)
                                                                                                                                        setalert_value(val)
                                                                                                                                        setSubscriptionPlanData(res.data)
                                                                                                                                    })
                                                                                                                                    .catch((e) => {
                                                                                                                                        console.log('error')
                                                                                                                                    })
                                                                                                                            } else {
                                                                                                                                let image_array = []
                                                                                                                                if (val.image_edited.length == 0) {
                                                                                                                                    image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                                } else {
                                                                                                                                    let data = []
                                                                                                                                    if (Object.keys(val.image_edited[0]).length == 6) {
                                                                                                                                        val.image_edited.map((da, i) => {
                                                                                                                                            data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                                        })
                                                                                                                                        image_array.push({ id: val._id, img_arr: data })
                                                                                                                                    } else {
                                                                                                                                        val.image_edited.map((da, i) => {
                                                                                                                                            data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                                        })
                                                                                                                                        image_array.push({ id: val._id, img_arr: data })
                                                                                                                                    }
                                                                                                                                }
                                                                                                                                setover_image_array(image_array)
                                                                                                                                setedit_image('none')
                                                                                                                                setmask_range_name('None')
                                                                                                                                setdirection_name('LeftToRight')
                                                                                                                                setin_out('In')
                                                                                                                                setfrom_time('00:00')
                                                                                                                                setto_time('23:59')
                                                                                                                                settype('Intrution')
                                                                                                                                setclass_name('People')
                                                                                                                                setthreshold(0)
                                                                                                                                setmask_image(response)
                                                                                                                                setalertmodel(true)
                                                                                                                                setalert_value(val)
                                                                                                                                setSubscriptionPlanData(res.data)
                                                                                                                            }
                                                                                                                        })
                                                                                                                        .catch((e) => {
                                                                                                                            alert('error')
                                                                                                                        })
                                                                                                                }).catch((err) => console.log(err))
                                                                                                            }
                                                                                                        }
                                                                                                    }}>
                                                                                                        <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>

                                                                                            <td>
                                                                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                                                                                    <div style={{ backgroundColor: val.camera_option.people_analytics != undefined && val.camera_option.people_analytics != 0 ? '#42cf10' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: val.camera_option.people_analytics != undefined && val.camera_option.people_analytics != 0 ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }} onClick={() => {
                                                                                                        setanalytic_type('people_masking')
                                                                                                        setalert_end_time('In')
                                                                                                        setalert_start_time('LeftToRight')
                                                                                                        if (val.camera_option.people_analytics == 1) {
                                                                                                            setblur_div(true)
                                                                                                            const device_details = {
                                                                                                                "camera_option": { ...val.camera_option, people_analytics: 0 }
                                                                                                            };

                                                                                                            const options = {
                                                                                                                url: api.CAMERA_CREATION + val._id,
                                                                                                                method: 'PUT',
                                                                                                                headers: {
                                                                                                                    'Content-Type': 'application/json',
                                                                                                                },
                                                                                                                data: JSON.stringify(device_details)
                                                                                                            };

                                                                                                            console.log(device_details)

                                                                                                            axios(options)
                                                                                                                .then(response => {
                                                                                                                    list_camera_site_id(selected_sites)
                                                                                                                }).catch((e) => {
                                                                                                                    console.log(e)
                                                                                                                })
                                                                                                        } else {
                                                                                                            setpeoplemodel(true)
                                                                                                            setalert_end_time('In')
                                                                                                            setalert_start_time('LeftToRight')

                                                                                                            const data = {
                                                                                                                "client_id": userData._id
                                                                                                            }

                                                                                                            if (db_type == 'local') {
                                                                                                                if (val.image_edited_people.length != 0 && val.image_edited_people[0].url != 'NONE') {
                                                                                                                    let image_array = []
                                                                                                                    if (val.image_edited_people.length == 0) {
                                                                                                                        image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                    } else {
                                                                                                                        let data = []
                                                                                                                        if (Object.keys(val.image_edited[0]).length == 6) {
                                                                                                                            val.image_edited.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        } else {
                                                                                                                            val.image_edited.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        }
                                                                                                                    }
                                                                                                                    setover_image_array(image_array)
                                                                                                                    setedit_image(val.image_edited_people.length != 0 ? val.image_edited_people[0].url : 'NONE',)
                                                                                                                    setmask_range_name(val.image_edited_people[0].name)
                                                                                                                    setdirection_name(val.image_edited_people[0].direction == undefined ? 'LeftToRight' : val.image_edited_people[0].direction)
                                                                                                                    setin_out(val.image_edited_people[0].sequence == undefined ? 'In' : val.image_edited_people[0].sequence)
                                                                                                                    setfrom_time(val.image_edited_people[0].from_time == undefined ? '00:00' : val.image_edited_people[0].from_time)
                                                                                                                    setto_time(val.image_edited_people[0].to_time == undefined ? '23:59' : val.image_edited_people[0].to_time)
                                                                                                                    settype(val.image_edited_people[0].type == undefined ? 'Intrution' : val.image_edited_people[0].type)
                                                                                                                    setclass_name(val.image_edited_people[0].class == undefined ? 'People' : val.image_edited_people[0].class)
                                                                                                                    setthreshold(val.image_edited_people[0].threshold == undefined ? 0 : val.image_edited_people[0].threshold)
                                                                                                                    setmask_image(val.mask)
                                                                                                                    setpeoplemodel(true)
                                                                                                                    setalert_value(val)
                                                                                                                    setSubscriptionPlanData('')
                                                                                                                } else {
                                                                                                                    let image_array = []
                                                                                                                    if (val.image_edited_people.length == 0) {
                                                                                                                        image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                    } else {
                                                                                                                        let data = []
                                                                                                                        if (Object.keys(val.image_edited_people[0]).length == 6) {
                                                                                                                            val.image_edited_people.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        } else {
                                                                                                                            val.image_edited_people.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        }
                                                                                                                    }
                                                                                                                    setover_image_array(image_array)
                                                                                                                    setedit_image('none')
                                                                                                                    setdirection_name('LeftToRight')
                                                                                                                    setin_out('In')
                                                                                                                    setmask_range_name('None')
                                                                                                                    setfrom_time('00:00')
                                                                                                                    setto_time('23:59')
                                                                                                                    settype('Intrution')
                                                                                                                    setclass_name('People')
                                                                                                                    setthreshold(0)
                                                                                                                    setmask_image(val.mask)
                                                                                                                    setpeoplemodel(true)
                                                                                                                    setalert_value(val)
                                                                                                                    setSubscriptionPlanData('')
                                                                                                                }
                                                                                                            } else {
                                                                                                                axios.post(api.LIST_SUBSCRIPTION_PLAN, data).then((res) => {
                                                                                                                    const s3Client = new S3Client({
                                                                                                                        region: "ap-south-1",
                                                                                                                        credentials: {
                                                                                                                            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
                                                                                                                            secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
                                                                                                                        },
                                                                                                                    });

                                                                                                                    const image_command = new GetObjectCommand({
                                                                                                                        Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                                                                                                                        Key: val.mask,
                                                                                                                    });

                                                                                                                    getSignedUrl(s3Client, image_command)
                                                                                                                        .then((response) => {

                                                                                                                            const image_command = new GetObjectCommand({
                                                                                                                                Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                                                                                                                                Key: val.image_edited_people.length != 0 ? val.image_edited_people[0].url : 'NONE',
                                                                                                                            });

                                                                                                                            if (val.image_edited_people.length != 0 && val.image_edited_people[0].url != 'NONE') {
                                                                                                                                getSignedUrl(s3Client, image_command)
                                                                                                                                    .then((edit) => {
                                                                                                                                        let image_array = []
                                                                                                                                        if (val.image_edited_people.length == 0) {
                                                                                                                                            image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                                        } else {
                                                                                                                                            let data = []
                                                                                                                                            if (Object.keys(val.image_edited_people[0]).length == 6) {
                                                                                                                                                val.image_edited_people.map((da, i) => {
                                                                                                                                                    data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                                                })
                                                                                                                                                image_array.push({ id: val._id, img_arr: data })
                                                                                                                                            } else {
                                                                                                                                                val.image_edited_people.map((da, i) => {
                                                                                                                                                    data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                                                })
                                                                                                                                                image_array.push({ id: val._id, img_arr: data })
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                        setover_image_array(image_array)
                                                                                                                                        setedit_image(edit)
                                                                                                                                        setmask_range_name(val.image_edited_people[0].name)
                                                                                                                                        setdirection_name(val.image_edited_people[0].direction == undefined ? 'LeftToRight' : val.image_edited_people[0].direction)
                                                                                                                                        setin_out(val.image_edited_people[0].sequence == undefined ? 'In' : val.image_edited_people[0].sequence)
                                                                                                                                        setfrom_time(val.image_edited_people[0].from_time == undefined ? '00:00' : val.image_edited_people[0].from_time)
                                                                                                                                        setto_time(val.image_edited_people[0].to_time == undefined ? '23:59' : val.image_edited_people[0].to_time)
                                                                                                                                        settype(val.image_edited_people[0].type == undefined ? 'Intrution' : val.image_edited_people[0].type)
                                                                                                                                        setclass_name(val.image_edited_people[0].class == undefined ? 'People' : val.image_edited_people[0].class)
                                                                                                                                        setthreshold(val.image_edited_people[0].threshold == undefined ? 0 : val.image_edited_people[0].threshold)
                                                                                                                                        setmask_image(response)
                                                                                                                                        setpeoplemodel(true)
                                                                                                                                        setalert_value(val)
                                                                                                                                        setSubscriptionPlanData(res.data)
                                                                                                                                    })
                                                                                                                                    .catch((e) => {
                                                                                                                                        console.log('error')
                                                                                                                                    })
                                                                                                                            } else {
                                                                                                                                let image_array = []
                                                                                                                                if (val.image_edited_people.length == 0) {
                                                                                                                                    image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                                } else {
                                                                                                                                    let data = []
                                                                                                                                    if (Object.keys(val.image_edited_people[0]).length == 6) {
                                                                                                                                        val.image_edited_people.map((da, i) => {
                                                                                                                                            data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                                        })
                                                                                                                                        image_array.push({ id: val._id, img_arr: data })
                                                                                                                                    } else {
                                                                                                                                        val.image_edited_people.map((da, i) => {
                                                                                                                                            data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                                        })
                                                                                                                                        image_array.push({ id: val._id, img_arr: data })
                                                                                                                                    }
                                                                                                                                }
                                                                                                                                setover_image_array(image_array)
                                                                                                                                setedit_image('none')
                                                                                                                                setdirection_name('LeftToRight')
                                                                                                                                setin_out('In')
                                                                                                                                setmask_range_name('None')
                                                                                                                                setfrom_time('00:00')
                                                                                                                                setto_time('23:59')
                                                                                                                                settype('Intrution')
                                                                                                                                setclass_name('People')
                                                                                                                                setthreshold(0)
                                                                                                                                setmask_image(response)
                                                                                                                                setpeoplemodel(true)
                                                                                                                                setalert_value(val)
                                                                                                                                setSubscriptionPlanData(res.data)
                                                                                                                            }
                                                                                                                        })
                                                                                                                        .catch((e) => {
                                                                                                                            alert('error')
                                                                                                                        })
                                                                                                                }).catch((err) => console.log(err))
                                                                                                            }
                                                                                                        }
                                                                                                    }}>
                                                                                                        <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>

                                                                                            <td>
                                                                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                                                                                    <div style={{ backgroundColor: val.camera_option.vehicle_analytics != undefined && val.camera_option.vehicle_analytics != 0 ? '#42cf10' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: val.camera_option.vehicle_analytics != undefined && val.camera_option.vehicle_analytics != 0 ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }} onClick={() => {
                                                                                                        setanalytic_type('vehicle_masking')
                                                                                                        setalert_end_time('In')
                                                                                                        setalert_start_time('LeftToRight')

                                                                                                        if (val.camera_option.vehicle_analytics == 1) {
                                                                                                            setblur_div(true)
                                                                                                            const device_details = {
                                                                                                                "camera_option": { ...val.camera_option, vehicle_analytics: 0 }
                                                                                                            };

                                                                                                            const options = {
                                                                                                                url: api.CAMERA_CREATION + val._id,
                                                                                                                method: 'PUT',
                                                                                                                headers: {
                                                                                                                    'Content-Type': 'application/json',
                                                                                                                },
                                                                                                                data: JSON.stringify(device_details)
                                                                                                            };

                                                                                                            console.log(device_details)

                                                                                                            axios(options)
                                                                                                                .then(response => {
                                                                                                                    list_camera_site_id(selected_sites)
                                                                                                                }).catch((e) => {
                                                                                                                    console.log(e)
                                                                                                                })
                                                                                                        } else {
                                                                                                            setpeoplemodel(true)
                                                                                                            setalert_end_time('In')
                                                                                                            setalert_start_time('LeftToRight')

                                                                                                            const data = {
                                                                                                                "client_id": userData._id
                                                                                                            }

                                                                                                            if (db_type == 'local') {
                                                                                                                if (val.image_edited_vehicle.length != 0 && val.image_edited_vehicle[0].url != 'NONE') {
                                                                                                                    let image_array = []
                                                                                                                    if (val.image_edited_vehicle.length == 0) {
                                                                                                                        image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                    } else {
                                                                                                                        let data = []
                                                                                                                        if (Object.keys(val.image_edited_people[0]).length == 6) {
                                                                                                                            val.image_edited_people.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        } else {
                                                                                                                            val.image_edited_people.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        }
                                                                                                                    }
                                                                                                                    setover_image_array(image_array)
                                                                                                                    setedit_image(val.image_edited_vehicle.length != 0 ? val.image_edited_vehicle[0].url : 'NONE',)
                                                                                                                    setmask_range_name(val.image_edited_vehicle[0].name)
                                                                                                                    setdirection_name(val.image_edited_vehicle[0].direction == undefined ? 'LeftToRight' : val.image_edited_vehicle[0].direction)
                                                                                                                    setin_out(val.image_edited_vehicle[0].sequence == undefined ? 'In' : val.image_edited_vehicle[0].sequence)
                                                                                                                    setfrom_time(val.image_edited_vehicle[0].from_time == undefined ? '00:00' : val.image_edited_vehicle[0].from_time)
                                                                                                                    setto_time(val.image_edited_vehicle[0].to_time == undefined ? '23:59' : val.image_edited_vehicle[0].to_time)
                                                                                                                    settype(val.image_edited_vehicle[0].type == undefined ? 'Intrution' : val.image_edited_vehicle[0].type)
                                                                                                                    setclass_name(val.image_edited_vehicle[0].class == undefined ? 'People' : val.image_edited_vehicle[0].class)
                                                                                                                    setthreshold(val.image_edited_vehicle[0].threshold == undefined ? 0 : val.image_edited_vehicle[0].threshold)
                                                                                                                    setmask_image(val.mask)
                                                                                                                    setpeoplemodel(true)
                                                                                                                    setalert_value(val)
                                                                                                                    setSubscriptionPlanData('')
                                                                                                                } else {
                                                                                                                    let image_array = []
                                                                                                                    if (val.image_edited_vehicle.length == 0) {
                                                                                                                        image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                    } else {
                                                                                                                        let data = []
                                                                                                                        if (Object.keys(val.image_edited_people[0]).length == 6) {
                                                                                                                            val.image_edited_people.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        } else {
                                                                                                                            val.image_edited_people.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        }
                                                                                                                    }
                                                                                                                    setover_image_array(image_array)
                                                                                                                    setedit_image('none')
                                                                                                                    setmask_range_name('None')
                                                                                                                    setfrom_time('00:00')
                                                                                                                    setto_time('23:59')
                                                                                                                    settype('Intrution')
                                                                                                                    setclass_name('People')
                                                                                                                    setthreshold(0)
                                                                                                                    setdirection_name('LeftToRight')
                                                                                                                    setin_out('In')
                                                                                                                    setmask_image(val.mask)
                                                                                                                    setpeoplemodel(true)
                                                                                                                    setalert_value(val)
                                                                                                                    setSubscriptionPlanData('')
                                                                                                                }
                                                                                                            } else {
                                                                                                                axios.post(api.LIST_SUBSCRIPTION_PLAN, data).then((res) => {
                                                                                                                    const s3Client = new S3Client({
                                                                                                                        region: "ap-south-1",
                                                                                                                        credentials: {
                                                                                                                            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
                                                                                                                            secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
                                                                                                                        },
                                                                                                                    });

                                                                                                                    const image_command = new GetObjectCommand({
                                                                                                                        Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                                                                                                                        Key: val.mask,
                                                                                                                    });

                                                                                                                    getSignedUrl(s3Client, image_command)
                                                                                                                        .then((response) => {

                                                                                                                            const image_command = new GetObjectCommand({
                                                                                                                                Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                                                                                                                                Key: val.image_edited_vehicle.length != 0 ? val.image_edited_vehicle[0].url : 'NONE',
                                                                                                                            });

                                                                                                                            if (val.image_edited_vehicle.length != 0 && val.image_edited_vehicle[0].url != 'NONE') {
                                                                                                                                getSignedUrl(s3Client, image_command)
                                                                                                                                    .then((edit) => {
                                                                                                                                        let image_array = []
                                                                                                                                        if (val.image_edited_vehicle.length == 0) {
                                                                                                                                            image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                                        } else {
                                                                                                                                            let data = []

                                                                                                                                            if (Object.keys(val.image_edited_vehicle[0]).length == 6) {
                                                                                                                                                val.image_edited_vehicle.map((da, i) => {
                                                                                                                                                    data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                                                })
                                                                                                                                                image_array.push({ id: val._id, img_arr: data })
                                                                                                                                            } else {
                                                                                                                                                val.image_edited_vehicle.map((da, i) => {
                                                                                                                                                    data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                                                })
                                                                                                                                                image_array.push({ id: val._id, img_arr: data })
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                        setover_image_array(image_array)
                                                                                                                                        setedit_image(edit)
                                                                                                                                        setmask_range_name(val.image_edited_vehicle[0].name)
                                                                                                                                        setdirection_name(val.image_edited_vehicle[0].direction == undefined ? 'LeftToRight' : val.image_edited_vehicle[0].direction)
                                                                                                                                        setin_out(val.image_edited_vehicle[0].sequence == undefined ? 'In' : val.image_edited_vehicle[0].sequence)
                                                                                                                                        setfrom_time(val.image_edited_vehicle[0].from_time == undefined ? '00:00' : val.image_edited_vehicle[0].from_time)
                                                                                                                                        setto_time(val.image_edited_vehicle[0].to_time == undefined ? '23:59' : val.image_edited_vehicle[0].to_time)
                                                                                                                                        settype(val.image_edited_vehicle[0].type == undefined ? 'Intrution' : val.image_edited_vehicle[0].type)
                                                                                                                                        setclass_name(val.image_edited_vehicle[0].class == undefined ? 'People' : val.image_edited_vehicle[0].class)
                                                                                                                                        setthreshold(val.image_edited_vehicle[0].threshold == undefined ? 0 : val.image_edited_vehicle[0].threshold)
                                                                                                                                        setmask_image(response)
                                                                                                                                        setpeoplemodel(true)
                                                                                                                                        setalert_value(val)
                                                                                                                                        setSubscriptionPlanData(res.data)
                                                                                                                                    })
                                                                                                                                    .catch((e) => {
                                                                                                                                        console.log('error')
                                                                                                                                    })
                                                                                                                            } else {
                                                                                                                                let image_array = []
                                                                                                                                if (val.image_edited_vehicle.length == 0) {
                                                                                                                                    image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                                } else {
                                                                                                                                    let data = []
                                                                                                                                    if (Object.keys(val.image_edited_vehicle[0]).length == 6) {
                                                                                                                                        val.image_edited_vehicle.map((da, i) => {
                                                                                                                                            data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                                        })
                                                                                                                                        image_array.push({ id: val._id, img_arr: data })
                                                                                                                                    } else {
                                                                                                                                        val.image_edited_vehicle.map((da, i) => {
                                                                                                                                            data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                                        })
                                                                                                                                        image_array.push({ id: val._id, img_arr: data })
                                                                                                                                    }
                                                                                                                                }
                                                                                                                                setover_image_array(image_array)
                                                                                                                                setedit_image('none')
                                                                                                                                setmask_range_name('None')
                                                                                                                                setfrom_time('00:00')
                                                                                                                                setto_time('23:59')
                                                                                                                                settype('Intrution')
                                                                                                                                setclass_name('People')
                                                                                                                                setthreshold(0)
                                                                                                                                setdirection_name('LeftToRight')
                                                                                                                                setin_out('In')
                                                                                                                                setmask_image(response)
                                                                                                                                setpeoplemodel(true)
                                                                                                                                setalert_value(val)
                                                                                                                                setSubscriptionPlanData(res.data)
                                                                                                                            }
                                                                                                                        })
                                                                                                                        .catch((e) => {
                                                                                                                            alert('error')
                                                                                                                        })
                                                                                                                }).catch((err) => console.log(err))
                                                                                                            }
                                                                                                        }
                                                                                                    }}>
                                                                                                        <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>

                                                                                            <td>
                                                                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                                                                                    <div style={{ backgroundColor: val.camera_option.face_dedaction != undefined && val.camera_option.face_dedaction != 0 ? '#42cf10' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: val.camera_option.face_dedaction != undefined && val.camera_option.face_dedaction != 0 ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }} onClick={() => {
                                                                                                        setanalytic_type('face_masking')
                                                                                                        setalert_end_time('In')
                                                                                                        setalert_start_time('LeftToRight')

                                                                                                        if (val.camera_option.face_dedaction == 1) {
                                                                                                            setblur_div(true)
                                                                                                            const device_details = {
                                                                                                                "camera_option": { ...val.camera_option, face_dedaction: 0 }
                                                                                                            };

                                                                                                            const options = {
                                                                                                                url: api.CAMERA_CREATION + val._id,
                                                                                                                method: 'PUT',
                                                                                                                headers: {
                                                                                                                    'Content-Type': 'application/json',
                                                                                                                },
                                                                                                                data: JSON.stringify(device_details)
                                                                                                            };

                                                                                                            console.log(device_details)

                                                                                                            axios(options)
                                                                                                                .then(response => {
                                                                                                                    list_camera_site_id(selected_sites)
                                                                                                                }).catch((e) => {
                                                                                                                    console.log(e)
                                                                                                                })
                                                                                                        } else {
                                                                                                            setpeoplemodel(true)
                                                                                                            setalert_end_time('In')
                                                                                                            setalert_start_time('LeftToRight')

                                                                                                            const data = {
                                                                                                                "client_id": userData._id
                                                                                                            }

                                                                                                            if (db_type == 'local') {
                                                                                                                if (val.image_edited_face.length != 0 && val.image_edited_face[0].url != 'NONE') {
                                                                                                                    let image_array = []
                                                                                                                    if (val.image_edited_face.length == 0) {
                                                                                                                        image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                    } else {
                                                                                                                        let data = []

                                                                                                                        if (Object.keys(val.image_edited_face[0]).length == 6) {
                                                                                                                            val.image_edited_face.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        } else {
                                                                                                                            val.image_edited_face.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        }
                                                                                                                    }
                                                                                                                    setover_image_array(image_array)
                                                                                                                    setedit_image(val.image_edited_face.length != 0 ? val.image_edited_face[0].url : 'NONE',)
                                                                                                                    setmask_range_name(val.image_edited_face[0].name)
                                                                                                                    setdirection_name(val.image_edited_face[0].direction == undefined ? 'LeftToRight' : val.image_edited_face[0].direction)
                                                                                                                    setin_out(val.image_edited_face[0].sequence == undefined ? 'In' : val.image_edited_face[0].sequence)
                                                                                                                    setfrom_time(val.image_edited_face[0].from_time == undefined ? '00:00' : val.image_edited_face[0].from_time)
                                                                                                                    setto_time(val.image_edited_face[0].to_time == undefined ? '23:59' : val.image_edited_face[0].to_time)
                                                                                                                    settype(val.image_edited_face[0].type == undefined ? 'Intrution' : val.image_edited_face[0].type)
                                                                                                                    setclass_name(val.image_edited_face[0].class == undefined ? 'People' : val.image_edited_face[0].class)
                                                                                                                    setthreshold(val.image_edited_face[0].threshold == undefined ? 0 : val.image_edited_face[0].threshold)
                                                                                                                    setmask_image(val.mask)
                                                                                                                    setpeoplemodel(true)
                                                                                                                    setalert_value(val)
                                                                                                                    setSubscriptionPlanData('')
                                                                                                                } else {
                                                                                                                    let image_array = []
                                                                                                                    if (val.image_edited_face.length == 0) {
                                                                                                                        image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                    } else {
                                                                                                                        let data = []
                                                                                                                        if (Object.keys(val.image_edited_face[0]).length == 6) {
                                                                                                                            val.image_edited_face.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        } else {
                                                                                                                            val.image_edited_face.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        }
                                                                                                                    }
                                                                                                                    setover_image_array(image_array)
                                                                                                                    setedit_image('none')
                                                                                                                    setmask_range_name('None')
                                                                                                                    setfrom_time('00:00')
                                                                                                                    setto_time('23:59')
                                                                                                                    settype('Intrution')
                                                                                                                    setclass_name('People')
                                                                                                                    setthreshold(0)
                                                                                                                    setdirection_name('LeftToRight')
                                                                                                                    setin_out('In')
                                                                                                                    setmask_image(val.mask)
                                                                                                                    setpeoplemodel(true)
                                                                                                                    setalert_value(val)
                                                                                                                    setSubscriptionPlanData('')
                                                                                                                }
                                                                                                            } else {
                                                                                                                axios.post(api.LIST_SUBSCRIPTION_PLAN, data).then((res) => {
                                                                                                                    const s3Client = new S3Client({
                                                                                                                        region: "ap-south-1",
                                                                                                                        credentials: {
                                                                                                                            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
                                                                                                                            secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
                                                                                                                        },
                                                                                                                    });

                                                                                                                    const image_command = new GetObjectCommand({
                                                                                                                        Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                                                                                                                        Key: val.mask,
                                                                                                                    });

                                                                                                                    getSignedUrl(s3Client, image_command)
                                                                                                                        .then((response) => {

                                                                                                                            const image_command = new GetObjectCommand({
                                                                                                                                Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                                                                                                                                Key: val.image_edited_face.length != 0 ? val.image_edited_face[0].url : 'NONE',
                                                                                                                            });

                                                                                                                            if (val.image_edited_face.length != 0 && val.image_edited_face[0].url != 'NONE') {
                                                                                                                                getSignedUrl(s3Client, image_command)
                                                                                                                                    .then((edit) => {
                                                                                                                                        let image_array = []
                                                                                                                                        if (val.image_edited_face.length == 0) {
                                                                                                                                            image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                                        } else {
                                                                                                                                            let data = []
                                                                                                                                            if (Object.keys(val.image_edited_face[0]).length == 6) {
                                                                                                                                                val.image_edited_face.map((da, i) => {
                                                                                                                                                    data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                                                })
                                                                                                                                                image_array.push({ id: val._id, img_arr: data })
                                                                                                                                            } else {
                                                                                                                                                val.image_edited_face.map((da, i) => {
                                                                                                                                                    data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                                                })
                                                                                                                                                image_array.push({ id: val._id, img_arr: data })
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                        setover_image_array(image_array)
                                                                                                                                        setedit_image(edit)
                                                                                                                                        setmask_range_name(val.image_edited_face[0].name)
                                                                                                                                        setdirection_name(val.image_edited_face[0].direction == undefined ? 'LeftToRight' : val.image_edited_face[0].direction)
                                                                                                                                        setin_out(val.image_edited_face[0].sequence == undefined ? 'In' : val.image_edited_face[0].sequence)
                                                                                                                                        setfrom_time(val.image_edited_face[0].from_time == undefined ? '00:00' : val.image_edited_face[0].from_time)
                                                                                                                                        setto_time(val.image_edited_face[0].to_time == undefined ? '23:59' : val.image_edited_face[0].to_time)
                                                                                                                                        settype(val.image_edited_face[0].type == undefined ? 'Intrution' : val.image_edited_face[0].type)
                                                                                                                                        setclass_name(val.image_edited_face[0].class == undefined ? 'People' : val.image_edited_face[0].class)
                                                                                                                                        setthreshold(val.image_edited_face[0].threshold == undefined ? 0 : val.image_edited_face[0].threshold)
                                                                                                                                        setmask_image(response)
                                                                                                                                        setpeoplemodel(true)
                                                                                                                                        setalert_value(val)
                                                                                                                                        setSubscriptionPlanData(res.data)
                                                                                                                                    })
                                                                                                                                    .catch((e) => {
                                                                                                                                        console.log('error')
                                                                                                                                    })
                                                                                                                            } else {
                                                                                                                                let image_array = []
                                                                                                                                if (val.image_edited_face.length == 0) {
                                                                                                                                    image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                                } else {
                                                                                                                                    let data = []
                                                                                                                                    if (Object.keys(val.image_edited_face[0]).length == 6) {
                                                                                                                                        val.image_edited_face.map((da, i) => {
                                                                                                                                            data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                                        })
                                                                                                                                        image_array.push({ id: val._id, img_arr: data })
                                                                                                                                    } else {
                                                                                                                                        val.image_edited_face.map((da, i) => {
                                                                                                                                            data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                                        })
                                                                                                                                        image_array.push({ id: val._id, img_arr: data })
                                                                                                                                    }
                                                                                                                                }
                                                                                                                                setover_image_array(image_array)
                                                                                                                                setedit_image('none')
                                                                                                                                setmask_range_name('None')
                                                                                                                                setfrom_time('00:00')
                                                                                                                                setto_time('23:59')
                                                                                                                                settype('Intrution')
                                                                                                                                setclass_name('People')
                                                                                                                                setthreshold(0)
                                                                                                                                setdirection_name('LeftToRight')
                                                                                                                                setin_out('In')
                                                                                                                                setmask_image(response)
                                                                                                                                setpeoplemodel(true)
                                                                                                                                setalert_value(val)
                                                                                                                                setSubscriptionPlanData(res.data)
                                                                                                                            }
                                                                                                                        })
                                                                                                                        .catch((e) => {
                                                                                                                            alert('error')
                                                                                                                        })
                                                                                                                }).catch((err) => console.log(err))
                                                                                                            }
                                                                                                        }
                                                                                                    }}>
                                                                                                        <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>

                                                                                            <td>
                                                                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                                                                                    <div style={{ backgroundColor: val.camera_option.anpr != undefined && val.camera_option.anpr != 0 ? '#42cf10' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: val.camera_option.anpr != undefined && val.camera_option.anpr != 0 ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }} onClick={() => {
                                                                                                        setanalytic_type('anpr_masking')
                                                                                                        setalert_end_time('In')
                                                                                                        setalert_start_time('LeftToRight')

                                                                                                        if (val.camera_option.anpr == 1) {
                                                                                                            setblur_div(true)
                                                                                                            const device_details = {
                                                                                                                "camera_option": { ...val.camera_option, anpr: 0 }
                                                                                                            };

                                                                                                            const options = {
                                                                                                                url: api.CAMERA_CREATION + val._id,
                                                                                                                method: 'PUT',
                                                                                                                headers: {
                                                                                                                    'Content-Type': 'application/json',
                                                                                                                },
                                                                                                                data: JSON.stringify(device_details)
                                                                                                            };

                                                                                                            console.log(device_details)

                                                                                                            axios(options)
                                                                                                                .then(response => {
                                                                                                                    list_camera_site_id(selected_sites)
                                                                                                                }).catch((e) => {
                                                                                                                    console.log(e)
                                                                                                                })
                                                                                                        } else {
                                                                                                            setpeoplemodel(true)
                                                                                                            setalert_end_time('In')
                                                                                                            setalert_start_time('LeftToRight')

                                                                                                            const data = {
                                                                                                                "client_id": userData._id
                                                                                                            }

                                                                                                            if (db_type == 'local') {
                                                                                                                if (val.image_edited_anpr.length != 0 && val.image_edited_anpr[0].url != 'NONE') {
                                                                                                                    let image_array = []
                                                                                                                    if (val.image_edited_anpr.length == 0) {
                                                                                                                        image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                    } else {
                                                                                                                        let data = []

                                                                                                                        if (Object.keys(val.image_edited_anpr[0]).length == 6) {
                                                                                                                            val.image_edited_anpr.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        } else {
                                                                                                                            val.image_edited_anpr.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        }
                                                                                                                    }
                                                                                                                    setover_image_array(image_array)
                                                                                                                    setedit_image(val.image_edited_anpr.length != 0 ? val.image_edited_anpr[0].url : 'NONE',)
                                                                                                                    setmask_range_name(val.image_edited_anpr[0].name)
                                                                                                                    setdirection_name(val.image_edited_anpr[0].direction == undefined ? 'LeftToRight' : val.image_edited_anpr[0].direction)
                                                                                                                    setin_out(val.image_edited_anpr[0].sequence == undefined ? 'In' : val.image_edited_anpr[0].sequence)
                                                                                                                    setfrom_time(val.image_edited_anpr[0].from_time == undefined ? '00:00' : val.image_edited_anpr[0].from_time)
                                                                                                                    setto_time(val.image_edited_anpr[0].to_time == undefined ? '23:59' : val.image_edited_anpr[0].to_time)
                                                                                                                    settype(val.image_edited_anpr[0].type == undefined ? 'Intrution' : val.image_edited_anpr[0].type)
                                                                                                                    setclass_name(val.image_edited_anpr[0].class == undefined ? 'People' : val.image_edited_anpr[0].class)
                                                                                                                    setthreshold(val.image_edited_anpr[0].threshold == undefined ? 0 : val.image_edited_anpr[0].threshold)
                                                                                                                    setmask_image(val.mask)
                                                                                                                    setpeoplemodel(true)
                                                                                                                    setalert_value(val)
                                                                                                                    setSubscriptionPlanData('')
                                                                                                                } else {
                                                                                                                    let image_array = []
                                                                                                                    if (val.image_edited_anpr.length == 0) {
                                                                                                                        image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                    } else {
                                                                                                                        let data = []
                                                                                                                        if (Object.keys(val.image_edited_anpr[0]).length == 6) {
                                                                                                                            val.image_edited_anpr.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        } else {
                                                                                                                            val.image_edited_anpr.map((da, i) => {
                                                                                                                                data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                            })
                                                                                                                            image_array.push({ id: val._id, img_arr: data })
                                                                                                                        }
                                                                                                                    }
                                                                                                                    setover_image_array(image_array)
                                                                                                                    setedit_image('none')
                                                                                                                    setmask_range_name('None')
                                                                                                                    setfrom_time('00:00')
                                                                                                                    setto_time('23:59')
                                                                                                                    settype('Intrution')
                                                                                                                    setclass_name('People')
                                                                                                                    setthreshold(0)
                                                                                                                    setdirection_name('LeftToRight')
                                                                                                                    setin_out('In')
                                                                                                                    setmask_image(val.mask)
                                                                                                                    setpeoplemodel(true)
                                                                                                                    setalert_value(val)
                                                                                                                    setSubscriptionPlanData('')
                                                                                                                }
                                                                                                            } else {
                                                                                                                axios.post(api.LIST_SUBSCRIPTION_PLAN, data).then((res) => {
                                                                                                                    const s3Client = new S3Client({
                                                                                                                        region: "ap-south-1",
                                                                                                                        credentials: {
                                                                                                                            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
                                                                                                                            secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
                                                                                                                        },
                                                                                                                    });

                                                                                                                    const image_command = new GetObjectCommand({
                                                                                                                        Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                                                                                                                        Key: val.mask,
                                                                                                                    });

                                                                                                                    getSignedUrl(s3Client, image_command)
                                                                                                                        .then((response) => {

                                                                                                                            const image_command = new GetObjectCommand({
                                                                                                                                Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                                                                                                                                Key: val.image_edited_anpr.length != 0 ? val.image_edited_anpr[0].url : 'NONE',
                                                                                                                            });

                                                                                                                            if (val.image_edited_anpr.length != 0 && val.image_edited_anpr[0].url != 'NONE') {
                                                                                                                                getSignedUrl(s3Client, image_command)
                                                                                                                                    .then((edit) => {
                                                                                                                                        let image_array = []
                                                                                                                                        if (val.image_edited_anpr.length == 0) {
                                                                                                                                            image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                                        } else {
                                                                                                                                            let data = []
                                                                                                                                            if (Object.keys(val.image_edited_anpr[0]).length == 6) {
                                                                                                                                                val.image_edited_anpr.map((da, i) => {
                                                                                                                                                    data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                                                })
                                                                                                                                                image_array.push({ id: val._id, img_arr: data })
                                                                                                                                            } else {
                                                                                                                                                val.image_edited_anpr.map((da, i) => {
                                                                                                                                                    data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                                                })
                                                                                                                                                image_array.push({ id: val._id, img_arr: data })
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                        setover_image_array(image_array)
                                                                                                                                        setedit_image(edit)
                                                                                                                                        setmask_range_name(val.image_edited_anpr[0].name)
                                                                                                                                        setdirection_name(val.image_edited_anpr[0].direction == undefined ? 'LeftToRight' : val.image_edited_anpr[0].direction)
                                                                                                                                        setin_out(val.image_edited_anpr[0].sequence == undefined ? 'In' : val.image_edited_anpr[0].sequence)
                                                                                                                                        setfrom_time(val.image_edited_anpr[0].from_time == undefined ? '00:00' : val.image_edited_anpr[0].from_time)
                                                                                                                                        setto_time(val.image_edited_anpr[0].to_time == undefined ? '23:59' : val.image_edited_anpr[0].to_time)
                                                                                                                                        settype(val.image_edited_anpr[0].type == undefined ? 'Intrution' : val.image_edited_anpr[0].type)
                                                                                                                                        setclass_name(val.image_edited_anpr[0].class == undefined ? 'People' : val.image_edited_anpr[0].class)
                                                                                                                                        setthreshold(val.image_edited_anpr[0].threshold == undefined ? 0 : val.image_edited_anpr[0].threshold)
                                                                                                                                        setmask_image(response)
                                                                                                                                        setpeoplemodel(true)
                                                                                                                                        setalert_value(val)
                                                                                                                                        setSubscriptionPlanData(res.data)
                                                                                                                                    })
                                                                                                                                    .catch((e) => {
                                                                                                                                        console.log('error')
                                                                                                                                    })
                                                                                                                            } else {
                                                                                                                                let image_array = []
                                                                                                                                if (val.image_edited_anpr.length == 0) {
                                                                                                                                    image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })
                                                                                                                                } else {
                                                                                                                                    let data = []
                                                                                                                                    if (Object.keys(val.image_edited_anpr[0]).length == 6) {
                                                                                                                                        val.image_edited_anpr.map((da, i) => {
                                                                                                                                            data.push({ ...da, flag: i == 0 ? true : false, from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0 })
                                                                                                                                        })
                                                                                                                                        image_array.push({ id: val._id, img_arr: data })
                                                                                                                                    } else {
                                                                                                                                        val.image_edited_anpr.map((da, i) => {
                                                                                                                                            data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                                        })
                                                                                                                                        image_array.push({ id: val._id, img_arr: data })
                                                                                                                                    }
                                                                                                                                }
                                                                                                                                setover_image_array(image_array)
                                                                                                                                setedit_image('none')
                                                                                                                                setmask_range_name('None')
                                                                                                                                setfrom_time('00:00')
                                                                                                                                setto_time('23:59')
                                                                                                                                settype('Intrution')
                                                                                                                                setclass_name('People')
                                                                                                                                setthreshold(0)
                                                                                                                                setdirection_name('LeftToRight')
                                                                                                                                setin_out('In')
                                                                                                                                setmask_image(response)
                                                                                                                                setpeoplemodel(true)
                                                                                                                                setalert_value(val)
                                                                                                                                setSubscriptionPlanData(res.data)
                                                                                                                            }
                                                                                                                        })
                                                                                                                        .catch((e) => {
                                                                                                                            console.log(e)
                                                                                                                            alert('error')
                                                                                                                        })
                                                                                                                }).catch((err) => console.log(err))
                                                                                                            }
                                                                                                        }
                                                                                                    }}>
                                                                                                        <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>

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
                                                                                : ''

                                                                        }
                                                                    </table>

                                                                </Col>

                                                            </Row>
                                                            : <TableSkeleton numRows={8} />
                                                    }
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    : ''
                            }
                        </div >
                    </div >
                    :
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <p>Attendance user Doesn't have permission to access Cameras</p>
                    </div>
            }
        </>
    )
}
