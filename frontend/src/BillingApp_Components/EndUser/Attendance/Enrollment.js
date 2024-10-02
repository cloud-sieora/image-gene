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
import { useDispatch } from 'react-redux'
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
import Mask from '../Mask'
import Skeleton from 'react-loading-skeleton';
import TableSkeleton from '../Tableskeleton';

import tento from '../tento.jpeg'
import tentovision_logo from '../../../assets/images/tentovision_logo.jpeg';


let flag_type = 'add_tag'
let count = 0
let count1 = 0
let device_count = 0
let intervals = []
let camera_list_image = []

export default function Enrollment() {
    const dispatch = useDispatch()
    const userData = JSON.parse(localStorage.getItem("userData"))
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
    const [skeleton, setskeleton] = useState(true)

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
    const [camera_object, setcamera_object] = useState()
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
    const alertClose = () => setalert_box(false)


    const [online_cam, setonline_cam] = useState(0)
    const [offline_cam, setoffline_cam] = useState(0)


    const [username_pass_model, setusername_pass_model] = useState(false);
    const [isChooseMode, setIsChooseMode] = useState(false)
    const [isOpenMannualModel, setIsOpenMannualModel] = useState(false)

    const [isOpenMannualSiteOption, setIsOpenMannualSiteOption] = useState(false)
    const [isOpenMannualActiveOption, setIsOpenMannualActiveOption] = useState(false)
    const [isOpenMannualGenderOption, setIsOpenMannualGenderOption] = useState(false)
    const [camera_save_loader, setcamera_save_loader] = useState(false)
    const [cancel_img, setcancel_img] = useState(false)

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
        user_name: '',
        user_id: '',
        mobile_number: '',
        mail_id: '',
        gender: '',
        image_url: [],
        desigination: '',
        password: '',
        active: '',
        site: {
            siteName: '',
            siteId: ''
        }
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

    useEffect(() => {
        get_group_list()
    }, [])

    function list_camera_site_id(site_id) {
        dispatch({ type: SELECTED_CAMERAS, value: [] })
        let data = []
        let count = 0


        for (let index = 0; index < site_id.length; index++) {
            const getStocksData = {
                url: api.ENROLLMENT_LIST_BY_SITE_ID,
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
                        // get_camera_health(data)

                        if (cameraArray.length === 0) {
                            setCameraArray(data)
                        }

                        setcameras(data)
                        setskeleton(true)
                        setdata(data)
                        setcameras_view(data)
                        setcameras_view1(data)
                        setcamera_serach(data)
                        setcameras(data)
                        setRoughData(data)


                        if (data.length == 0) {
                            setcameras_view('no_res')
                            setcameras_view1('no_res')
                        }
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

    function get_group_list() {

        if (userData.position_type == 'Client' || userData.position_type == 'Client Admin') {

            const getStocksData = {
                url: userData.position_type == 'Client' ? api.LIST_ATTENDANCE_SITE_DATA_CLIENT_ID : userData.position_type == 'Client Admin' ? api.LIST_ATTENDANCE_SITE_DATA_CLIENT_ADMIN_ID : api.LIST_ATTENDANCE_SITE_DATA_USER_ID,
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
                    setgroup_list(response.data)
                    if (response.data.length !== 0) {
                        setselected_sites([response.data[0]])
                        list_camera_site_id([response.data[0]])
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
                    url: api.ATTENDANCE_SITE_CREATION + val.id,
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

    async function getimageurifunction(accessKeyId, secretAccessKey, Bucket, image_key, i, j) {
        const s3Client = new S3Client({
            region: "ap-south-1",
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        });

        const image_command = new GetObjectCommand({
            Bucket: Bucket,
            Key: image_key,
        });
        const image_uri = await getSignedUrl(s3Client, image_command)
        document.getElementById(`enroll_image${i}${j}`).src = image_uri
        return image_uri
    }

    return (
        <div>
            <div>
                {/* <div style={{ backgroundColor: 'white', borderRadius: '5px', height: '88vh' }}>
                    <button>Add enrollment</button>
                </div> */}

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
                                        <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>ADD ENROLLMENT (S)</p>
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
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>User Name</p>
                                                                        <input type='text' placeholder='Enter User Name' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                            let index = addCameraMannullyArray.indexOf(findArray)
                                                                            // console.log(index)
                                                                            let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                            let value = e.target.value
                                                                            filterArray.splice(index, 0, { ...findArray, user_name: value })
                                                                            setAddCameraMannullyArray(filterArray)
                                                                        }} value={d.user_name} ></input>
                                                                    </div>
                                                                </Col>

                                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>User Id</p>
                                                                        <input type='text' placeholder='Enter User Id' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                            let index = addCameraMannullyArray.indexOf(findArray)
                                                                            let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                            let value = e.target.value
                                                                            filterArray.splice(index, 0, { ...findArray, user_id: value })
                                                                            setAddCameraMannullyArray(filterArray)
                                                                        }} value={d.user_id} ></input>
                                                                    </div>
                                                                </Col>

                                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Mobile Number</p>
                                                                        <input type='text' placeholder='Enter Mobile Number' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                            let index = addCameraMannullyArray.indexOf(findArray)
                                                                            // console.log(index)
                                                                            let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                            let value = e.target.value
                                                                            filterArray.splice(index, 0, { ...findArray, mobile_number: value })
                                                                            setAddCameraMannullyArray(filterArray)
                                                                        }} value={d.mobile_number} ></input>
                                                                    </div>
                                                                </Col>

                                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Mail Id</p>
                                                                        <input type='text' placeholder='Enter mail id' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                            let index = addCameraMannullyArray.indexOf(findArray)
                                                                            let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                            let value = e.target.value
                                                                            filterArray.splice(index, 0, { ...findArray, mail_id: value })
                                                                            setAddCameraMannullyArray(filterArray)
                                                                        }} value={d.mail_id} ></input>
                                                                    </div>
                                                                </Col>

                                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Password</p>
                                                                        <input type='text' placeholder='Enter Password' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                            let index = addCameraMannullyArray.indexOf(findArray)
                                                                            // console.log(index)
                                                                            let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                            let value = e.target.value
                                                                            filterArray.splice(index, 0, { ...findArray, password: value })
                                                                            setAddCameraMannullyArray(filterArray)
                                                                        }} value={d.password} ></input>
                                                                    </div>
                                                                </Col>

                                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Desigination</p>
                                                                        <input type='text' placeholder='Enter Desigination' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                            let index = addCameraMannullyArray.indexOf(findArray)
                                                                            // console.log(index)
                                                                            let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                            let value = e.target.value
                                                                            filterArray.splice(index, 0, { ...findArray, desigination: value })
                                                                            setAddCameraMannullyArray(filterArray)
                                                                        }} value={d.desigination} ></input>
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
                                                                                style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', zIndex: 3, maxHeight: '150px', overflowY: 'scroll' }}>

                                                                                <div  >
                                                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                        filterArray.splice(index, 0, { ...findArray, active: 'active', flag: d.flag === true ? false : true })
                                                                                        setAddCameraMannullyArray(filterArray)
                                                                                        setIsOpenMannualActiveOption(false)
                                                                                        setIsOpenMannualGenderOption(false)
                                                                                    }}>Active</p>
                                                                                    <hr></hr>
                                                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                        filterArray.splice(index, 0, { ...findArray, active: 'Inactive', flag: d.flag === true ? false : true })
                                                                                        setAddCameraMannullyArray(filterArray)
                                                                                        setIsOpenMannualActiveOption(false)
                                                                                        setIsOpenMannualGenderOption(false)
                                                                                    }}>Inactive</p>
                                                                                    <hr></hr>
                                                                                </div>

                                                                            </div>
                                                                        }

                                                                    </div>
                                                                </Col>

                                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div>
                                                                        <p style={{ color: 'black', marginTop: '15px', marginBottom: '5px' }}>Gender</p>
                                                                        <div style={{ position: 'relative' }}>
                                                                            <p type='text' style={{ backgroundColor: '#e6e8eb', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'black' }} onClick={() => {
                                                                                setIsOpenMannualGenderOption(!isOpenMannualGenderOption)
                                                                                let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                let index = addCameraMannullyArray.indexOf(findArray)
                                                                                let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                filterArray.splice(index, 0, { ...findArray, flag: d.flag === true ? false : true })
                                                                                setAddCameraMannullyArray(filterArray)

                                                                            }}>{d.gender === '' ? 'Select' : d.gender}<span>
                                                                                    {isOpenMannualActiveOption && d.flag ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                                                                </span></p>


                                                                        </div>

                                                                        {isOpenMannualGenderOption && d.flag === true &&
                                                                            <div
                                                                                // id={`site${val}`} 
                                                                                style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', zIndex: 2, maxHeight: '150px', overflowY: 'scroll' }}>

                                                                                <div  >
                                                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                        filterArray.splice(index, 0, { ...findArray, gender: 'Male', flag: d.flag === true ? false : true })
                                                                                        setAddCameraMannullyArray(filterArray)
                                                                                        setIsOpenMannualActiveOption(false)
                                                                                        setIsOpenMannualGenderOption(false)
                                                                                    }}>Male</p>
                                                                                    <hr></hr>
                                                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                        filterArray.splice(index, 0, { ...findArray, gender: 'Female', flag: d.flag === true ? false : true })
                                                                                        setAddCameraMannullyArray(filterArray)
                                                                                        setIsOpenMannualActiveOption(false)
                                                                                        setIsOpenMannualGenderOption(false)
                                                                                    }}>Female</p>
                                                                                    <hr></hr>
                                                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                        filterArray.splice(index, 0, { ...findArray, gender: 'Other', flag: d.flag === true ? false : true })
                                                                                        setAddCameraMannullyArray(filterArray)
                                                                                        setIsOpenMannualActiveOption(false)
                                                                                        setIsOpenMannualGenderOption(false)
                                                                                    }}>Others</p>
                                                                                </div>

                                                                            </div>
                                                                        }

                                                                    </div>
                                                                </Col>
                                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div>
                                                                        <p style={{ color: 'black', marginTop: '15px', marginBottom: '5px' }}>Group</p>
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
                                                                    <button onClick={() => {
                                                                        document.getElementById(`save_upload${i}`).click()
                                                                    }}>
                                                                        <input id={`save_upload${i}`} name="upload" type="file" hidden
                                                                            onChange={(event) => {
                                                                                if (event.target.files[0]) {

                                                                                    if (((addCameraMannullyArray[i].image_url.length + 1) <= 5) && event.target.files[0].type.startsWith('image/')) {
                                                                                        let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                        let index = addCameraMannullyArray.indexOf(findArray)
                                                                                        // console.log(index)
                                                                                        let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                        filterArray.splice(index, 0, { ...findArray, image_url: [...findArray.image_url, event.target.files[0]] })
                                                                                        setAddCameraMannullyArray(filterArray)
                                                                                    } else {
                                                                                        alert('please select image')
                                                                                    }
                                                                                } else {
                                                                                    console.log('empty')

                                                                                }
                                                                                event.target.value = ''
                                                                            }} />
                                                                        Upload image
                                                                    </button>
                                                                </Col>

                                                                {
                                                                    addCameraMannullyArray != 'none' ?
                                                                        addCameraMannullyArray[i].image_url.map((val, j) => (
                                                                            <Col xl={3} lg={3} md={3} sm={6} xs={6}>
                                                                                <div style={{ position: 'relative' }}>
                                                                                    <img src={URL.createObjectURL(val)} alt="Selected" style={{ width: '100%' }} />
                                                                                    <p style={{ backgroundColor: 'red', color: 'white', textAlign: 'center', cursor: 'pointer' }} onClick={() => {
                                                                                        let newarr = []
                                                                                        addCameraMannullyArray[i].image_url.map((img, k) => {
                                                                                            if (j != k) {
                                                                                                newarr.push(img)
                                                                                            }
                                                                                        })
                                                                                        addCameraMannullyArray[i].image_url = newarr
                                                                                        setcancel_img(!cancel_img)
                                                                                    }}>X</p>
                                                                                </div>
                                                                            </Col>
                                                                        ))
                                                                        : ''
                                                                }

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
                                                                    addCameraMannullyArray > 1 ?
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
                                                for (let check = 0; check < addCameraMannullyArray.length; check++) {
                                                    if (addCameraMannullyArray[check].user_name !== '' && addCameraMannullyArray[check].user_id !== '' && addCameraMannullyArray[check].mobile_number !== '' && addCameraMannullyArray[check].mail_id !== '' && addCameraMannullyArray[check].password !== '' && addCameraMannullyArray[check].desigination !== '' && addCameraMannullyArray[check].gender !== '' && addCameraMannullyArray[check].image_url.length !== 0 && addCameraMannullyArray[check].active !== '') {
                                                        checkFlag = true
                                                    } else {
                                                        checkFlag = false
                                                        break;
                                                    }
                                                }


                                                // Creeate a device details for every device
                                                if (checkFlag) {

                                                    async function save_user(value) {

                                                        let image_count = 0
                                                        let image_key = []
                                                        try {
                                                            let img_count = 0
                                                            AWS.config.update({
                                                                region: 'ap-south-1',
                                                                credentials: new AWS.Credentials(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY),
                                                            });
                                                            for (const item of value.image_url) {

                                                                const s3 = new AWS.S3();
                                                                const params = {
                                                                    Bucket: 'tentoface-rekognition',
                                                                    Key: `${value.user_id}-${img_count}.jpg`,
                                                                    Body: item,
                                                                    ACL: 'private',
                                                                    ContentType: 'image/jpeg'
                                                                };
                                                                img_count = img_count + 1

                                                                s3.upload(params, (err, data) => {
                                                                    if (err) {
                                                                        console.error('Error uploading file:', err);
                                                                    } else {
                                                                        console.log('File uploaded successfully:', data.Location);
                                                                        image_key.push(`${value.user_id}-${image_count}.jpg`)
                                                                        image_count = image_count + 1

                                                                        if (image_count == value.image_url.length) {
                                                                            const device_details = {
                                                                                "user_id": (JSON.parse(localStorage.getItem("userData")))._id,
                                                                                'user_name': value.user_name,
                                                                                'emp_id': value.user_id,
                                                                                "password": value.password,
                                                                                "desigination": value.desigination,
                                                                                "mobile_number": value.mobile_number,
                                                                                "mail": value.mail_id,
                                                                                "image_url": image_key,
                                                                                "gender": value.gender,
                                                                                "attendance_group_id": value.site.siteId,
                                                                                'created_date': moment(new Date()).format('YYYY-MM-DD'),
                                                                                'updated_date': moment(new Date()).format('YYYY-MM-DD'),
                                                                                'created_time': moment(new Date()).format('HH:MM:ss'),
                                                                                'updated_time': moment(new Date()).format('HH:MM:ss'),
                                                                                "Active": value.active === "active" ? 1 : 0,
                                                                                "client_admin_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).client_admin_id,
                                                                                "site_admin_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Site Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).site_admin_id,
                                                                                "clientt_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).clientt_id,
                                                                            };

                                                                            console.log(device_details);

                                                                            const options = {
                                                                                url: api.ENROLLMENT_USER_CREATION,
                                                                                method: 'POST',
                                                                                headers: {
                                                                                    'Content-Type': 'application/json',
                                                                                },
                                                                                data: JSON.stringify(device_details)
                                                                            };

                                                                            // console.log(device_details)


                                                                            // Api Call
                                                                            axios(options)
                                                                                .then(response => {
                                                                                    // console.log(response.data)
                                                                                    // count1 = 0
                                                                                    // count = 0
                                                                                    camera_count = camera_count + 1

                                                                                    if (camera_count == addCameraMannullyArray.length) {
                                                                                        setflag(!flag)
                                                                                        list_camera_site_id(selected_sites)
                                                                                        setcamera_list_data([])
                                                                                        setcamera_list_data1([])
                                                                                        setIsOpenMannualModel(false)
                                                                                        handleClose()
                                                                                        get_group_list()
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
                                                                        }
                                                                    }
                                                                });


                                                            }
                                                        } catch (e) {
                                                            image_count = image_count + 1
                                                            console.log(e)
                                                        }
                                                    }

                                                    async function call() {
                                                        for (const item of addCameraMannullyArray) {
                                                            await save_user(item);
                                                        }
                                                    }

                                                    call()


                                                } else {
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


                                            }}>Add Enrollment</button>
                                        </Col>
                                    </Row>
                                </div>
                        }
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
                                    <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>ADD ENROLLMENT(s)</p>

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
                            save_type != 'put_data' ? '' :
                                <div>
                                    <div style={{ overflowY: 'scroll', overflowX: 'hidden', maxHeight: '400px' }}>
                                        {
                                            add_camera_count.map((val, i) => (
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
                                                            <p style={{ color: 'black', marginBottom: '5px' }}>User Name</p>
                                                            <input type='text' placeholder='Enter Client Id' value={camera_object[val].user_name} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => { camera_object[val].user_name = e.target.value; setcamera_name(e.target.value) }}></input>
                                                        </div>
                                                    </Col>

                                                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                        <div style={{ marginTop: '5px' }}>
                                                            <p style={{ color: 'black', marginBottom: '5px' }}>User Id</p>
                                                            <input type='text' placeholder='Enter Client Id' value={camera_object[val].user_id} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                camera_object[val].user_id = e.target.value
                                                                setcamera_id(e.target.value)
                                                            }}></input>
                                                        </div>
                                                    </Col>

                                                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                        <div style={{ marginTop: '5px' }}>
                                                            <p style={{ color: 'black', marginBottom: '5px' }}>Mobile Number</p>
                                                            <input type='text' placeholder='Enter Client Id' value={camera_object[val].mobile_number} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                camera_object[val].mobile_number = e.target.value
                                                                setcamera_id(e.target.value)
                                                            }}></input>
                                                        </div>
                                                    </Col>

                                                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                        <div style={{ marginTop: '5px' }}>
                                                            <p style={{ color: 'black', marginBottom: '5px' }}>Mail Id</p>
                                                            <input type='text' placeholder='Enter Client Id' value={camera_object[val].mail_id} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                camera_object[val].mail_id = e.target.value
                                                                setcamera_id(e.target.value)
                                                            }}></input>
                                                        </div>
                                                    </Col>

                                                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                        <div style={{ marginTop: '5px' }}>
                                                            <p style={{ color: 'black', marginBottom: '5px' }}>Password</p>
                                                            <input type='text' placeholder='Enter Client Id' value={camera_object[val].password} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                camera_object[val].password = e.target.value
                                                                setcamera_id(e.target.value)
                                                            }}></input>
                                                        </div>
                                                    </Col>

                                                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                        <div style={{ marginTop: '5px' }}>
                                                            <p style={{ color: 'black', marginBottom: '5px' }}>Desigination</p>
                                                            <input type='text' placeholder='Enter Client Id' value={camera_object[val].desigination} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                camera_object[val].desigination = e.target.value
                                                                setcamera_id(e.target.value)
                                                            }}></input>
                                                        </div>
                                                    </Col>

                                                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                        <div style={{ marginTop: '5px', }}>
                                                            <p style={{ color: 'black', marginBottom: '5px' }}>Active</p>
                                                            <div style={{ position: 'relative', zIndex: 3 }}>
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
                                                        <div style={{ marginTop: '5px', }}>
                                                            <p style={{ color: 'black', marginBottom: '5px' }}>Gender</p>
                                                            <div style={{ position: 'relative', zIndex: 1 }}>
                                                                <p type='text' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => {
                                                                    if (document.getElementById(`gender${val}`).style.display !== 'none') {
                                                                        document.getElementById(`gender${val}`).style.display = 'none'
                                                                    } else {
                                                                        document.getElementById(`gender${val}`).style.display = 'block'
                                                                    }

                                                                }}>{camera_object[val].gender}<span><ArrowDropDownIcon /></span></p>

                                                                <div id={`gender${val}`} style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', }}>
                                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer', color: camera_object[val].gender == 'Male' ? 'blue' : '' }} onClick={() => {
                                                                        document.getElementById(`gender${val}`).style.display = 'none'
                                                                        camera_object[val].gender = 'Male'
                                                                        setactive(2)
                                                                    }}>Male</p>
                                                                    <hr></hr>
                                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer', color: camera_object[val].gender == 'Female' ? 'blue' : '' }} onClick={() => {
                                                                        document.getElementById(`gender${val}`).style.display = 'none'
                                                                        camera_object[val].gender = 'Female'
                                                                        setactive(3)
                                                                    }}>Female</p>
                                                                    <hr></hr>
                                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer', color: camera_object[val].gender == 'Others' ? 'blue' : '' }} onClick={() => {
                                                                        document.getElementById(`gender${val}`).style.display = 'none'
                                                                        camera_object[val].gender = 'Others'
                                                                        setactive(4)
                                                                    }}>Others</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>

                                                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                        <div>
                                                            <p style={{ color: 'black', marginTop: '15px', marginBottom: '5px' }}>Groups</p>
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

                                                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                        <button onClick={() => {
                                                            document.getElementById(`edit_upload${i}`).click()
                                                        }}>
                                                            <input id={`edit_upload${i}`} name="upload" type="file" hidden
                                                                onChange={(event) => {
                                                                    if (event.target.files[0]) {
                                                                        if (((camera_object[val].image_url.length + 1) <= 5) && event.target.files[0].type.startsWith('image/')) {
                                                                            camera_object[val].image_url.push(event.target.files[0])
                                                                            setcamera_id(event.target.files[0])
                                                                        } else {
                                                                            alert('please upload image file')
                                                                        }
                                                                    } else {

                                                                    }
                                                                    event.target.value = ''
                                                                }} />
                                                            Upload image
                                                        </button>
                                                    </Col>

                                                    {
                                                        opencamera ?
                                                            camera_object[val].image_url.map((key, j) => {
                                                                console.log(key);
                                                                if (key.type != undefined) {
                                                                    setTimeout(() => {
                                                                        document.getElementById(`enroll_image${i}${j}`).src = URL.createObjectURL(key)
                                                                    }, 100);
                                                                } else {
                                                                    getimageurifunction(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, 'tentoface-rekognition', key, i, j)
                                                                }
                                                                return (
                                                                    <Col xl={3} lg={3} md={3} sm={6} xs={6}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                            <div>
                                                                                <img id={`enroll_image${i}${j}`} src='' style={{ width: '100%', display: 'none' }} onLoad={(e) => {
                                                                                    document.getElementById(`error_div${i}${j}`).style.display = 'none'
                                                                                    document.getElementById(`load_div${i}${j}`).style.display = 'none'
                                                                                    document.getElementById(`close_p${i}${j}`).style.display = 'block'
                                                                                    e.target.style.display = 'block'
                                                                                }} onError={() => {
                                                                                    document.getElementById(`error_div${i}${j}`).style.display = 'block'
                                                                                    document.getElementById(`load_div${i}${j}`).style.display = 'none'
                                                                                    document.getElementById(`close_p${i}${j}`).style.display = 'none'
                                                                                }}></img>
                                                                                <p id={`close_p${i}${j}`} style={{ backgroundColor: 'red', color: 'white', display: 'none', textAlign: 'center', cursor: 'pointer' }} onClick={() => {
                                                                                    let newarr = []
                                                                                    camera_object[val].image_url.map((img, k) => {
                                                                                        if (j != k) {
                                                                                            newarr.push(img)
                                                                                        }
                                                                                    })
                                                                                    camera_object[val].image_url = newarr
                                                                                    setcancel_img(!cancel_img)
                                                                                }}>X</p>
                                                                            </div>
                                                                            <div>
                                                                                <div id={`load_div${i}${j}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                                    <CircularProgress size={18} />
                                                                                </div>
                                                                            </div>

                                                                            <div id={`error_div${i}${j}`} style={{ display: 'none' }}>
                                                                                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                                    <p>No Image</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Col>
                                                                )
                                                            })
                                                            : ''
                                                    }

                                                    <Col xl={3} lg={3} md={3} sm={6} xs={6}>
                                                        {/* {
                                                                        d.image_url.map((val) => {
                                                                            let imagePreview = ''
                                                                            if (val) {
                                                                                var reader = new FileReader(); // Create a FileReader object
                                                                                reader.onload = function (e) {
                                                                                    imagePreview = e.target.result; // Set the image source to the result of the FileReader
                                                                                    console.log(imagePreview);
                                                                                };
                                                                                reader.readAsDataURL(val); // Read the selected file as a data URL
                                                                            }

                                                                            return (
                                                                                <p></p>
                                                                            )
                                                                        })
                                                                    } */}
                                                        <p>{camera_object[val].image_url.length}</p>
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
                                                let forSwitchApiCall
                                                let count = true
                                                let camera_count = 0

                                                for (let index = 0; index < camera_object.length; index++) {
                                                    if (camera_object[index].user_name !== '' && camera_object[index].user_id !== '' && camera_object[index].mobile_number !== '' && camera_object[index].mail_id !== '' && camera_object[index].password !== '' && camera_object[index].desigination !== '' && camera_object[index].gender !== '' && camera_object[index].image_url.length !== 0 && camera_object[index].active !== '') {
                                                        count = true
                                                    } else {
                                                        count = false
                                                        break;
                                                    }

                                                }

                                                // console.log('Camera object', camera_object)

                                                if (count) {

                                                    async function save_user(value) {
                                                        let image_count = 0
                                                        let img_count = 0
                                                        let image_key = []
                                                        let upload_image = []
                                                        let already_upload = []
                                                        AWS.config.update({
                                                            region: 'ap-south-1',
                                                            credentials: new AWS.Credentials(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY),
                                                        });

                                                        for (let index1 = 0; index1 < value.image_url.length; index1++) {
                                                            try {
                                                                value.image_url[index1].split(".")
                                                                already_upload.push(value.image_url[index1])
                                                            } catch {
                                                                upload_image.push(value.image_url[index1])
                                                            }

                                                        }


                                                        if (upload_image.length != 0) {
                                                            upload_image.forEach((item) => {

                                                                const s3 = new AWS.S3();
                                                                const params = {
                                                                    Bucket: 'tentoface-rekognition',
                                                                    Key: `${value.user_id}-${img_count}.jpg`,
                                                                    Body: item,
                                                                    ACL: 'private',
                                                                    ContentType: 'image/jpeg'
                                                                };
                                                                img_count = img_count + 1

                                                                s3.upload(params, (err, data) => {
                                                                    if (err) {
                                                                        console.error('Error uploading file:', err);
                                                                    } else {
                                                                        console.log('File uploaded successfully:', data.Location);
                                                                        image_key.push(`${value.user_id}-${image_count}.jpg`)
                                                                        image_count = image_count + 1

                                                                        if (image_count == value.image_url.length) {
                                                                            const device_details = {
                                                                                "user_id": (JSON.parse(localStorage.getItem("userData")))._id,
                                                                                'user_name': value.user_name,
                                                                                'emp_id': value.user_id,
                                                                                "password": value.password,
                                                                                "desigination": value.desigination,
                                                                                "mobile_number": value.mobile_number,
                                                                                "mail": value.mail_id,
                                                                                "image_url": [...already_upload, ...image_key],
                                                                                "gender": value.gender,
                                                                                "attendance_group_id": value.site.siteId,
                                                                                'updated_date': moment(new Date()).format('YYYY-MM-DD'),
                                                                                'updated_time': moment(new Date()).format('HH:MM:ss'),
                                                                                "Active": value.active === "active" ? 1 : 0,
                                                                                "client_admin_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).client_admin_id,
                                                                                "site_admin_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Site Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).site_admin_id,
                                                                                "clientt_id": (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).clientt_id,
                                                                            };

                                                                            console.log(device_details);

                                                                            const options = {
                                                                                url: api.ENROLLMENT_USER_CREATION + value.id,
                                                                                method: 'PUT',
                                                                                headers: {
                                                                                    'Content-Type': 'application/json',
                                                                                },
                                                                                data: JSON.stringify(device_details)
                                                                            };

                                                                            // console.log(device_details)


                                                                            // Api Call
                                                                            axios(options)
                                                                                .then(response => {
                                                                                    count1 = 0
                                                                                    count = 0
                                                                                    camera_count = camera_count + 1

                                                                                    if (camera_count == camera_object.length) {
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
                                                                        }
                                                                    }
                                                                });
                                                            })
                                                        } else {

                                                            const device_details = {
                                                                "user_id": (JSON.parse(localStorage.getItem("userData")))._id,
                                                                'user_name': value.user_name,
                                                                'emp_id': value.user_id,
                                                                "password": value.password,
                                                                "desigination": value.desigination,
                                                                "mobile_number": value.mobile_number,
                                                                "mail": value.mail_id,
                                                                "gender": value.gender,
                                                                "attendance_group_id": value.site.siteId,
                                                                'updated_date': moment(new Date()).format('YYYY-MM-DD'),
                                                                'updated_time': moment(new Date()).format('HH:MM:ss'),
                                                                "Active": value.active === "active" ? 1 : 0,
                                                            };
                                                            console.log(device_details, 'else');

                                                            const options = {
                                                                url: api.ENROLLMENT_USER_CREATION_EDIT + value.id,
                                                                method: 'PUT',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                data: JSON.stringify(device_details)
                                                            };

                                                            // console.log(device_details)


                                                            // Api Call
                                                            axios(options)
                                                                .then(response => {
                                                                    console.log(response.data);
                                                                    count1 = 0
                                                                    count = 0
                                                                    camera_count = camera_count + 1

                                                                    if (camera_count == camera_object.length) {
                                                                        setOpencamera(false)
                                                                        setflag(!flag)
                                                                        list_camera_site_id(selected_sites)
                                                                        setcamera_list_data([])
                                                                        setcamera_list_data1([])
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
                                                        }
                                                    }

                                                    async function call() {
                                                        for (const item of camera_object) {
                                                            await save_user(item);
                                                        }
                                                    }

                                                    call()

                                                }


                                                else {

                                                    alert("Please fill out all required fields.")

                                                }
                                            }}>Save Enrollment</button>
                                        </Col>
                                    </Row>
                                </div>
                        }

                        {/* {
                            !camera_save_loader ?
                                <Row style={{ padding: '0px', alignItems: 'center', }}>
                                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <div style={{ backgroundColor: '#e22747', color: 'white', display: 'flex', justifyContent: 'center', padding: '10px', alignItems: 'center' }} onClick={() => {
                                            // save_cameras()
                                        }}>
                                            <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>Save Camera(s)</p>
                                        </div>
                                    </Col>
                                </Row> : ''
                        } */}

                    </div>
                </Modal >

                {/* <div style={{ padding: '10px', paddingTop: '5px' }}>
                    <button className='eventbtn' onClick={() => {
                        setsite_manage_btn(!site_manage_btn)
                        setdevice_manage_btn(false)

                    }} style={{ display: 'flex', backgroundColor: site_manage_btn ? '#e32747' : '#e6e8eb', color: site_manage_btn ? 'white' : 'black' }}> <BusinessOutlinedIcon style={{ marginRight: '10px' }} />Group Management<ArrowDropDownIcon style={{ marginLeft: '10px' }} /></button>
                </div> */}

                <div style={{ padding: '10px', paddingBottom: '0px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '5px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }}>
                        <div xl={12} lg={12} md={12} sm={12} xs={12}>

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

                                    }} style={{ display: 'flex', backgroundColor: create_group ? '#e32747' : '#e6e8eb', color: create_group ? 'white' : 'black' }}> <DomainAddOutlinedIcon style={{ marginRight: '10px' }} />Group Creation<ArrowDropDownIcon style={{ marginLeft: '10px' }} /></button>

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
                                                            url: api.ATTENDANCE_SITE_CREATION,
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
                                                    }}>Add Group</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ position: 'relative', }}>
                                    <button className='eventbtn' onClick={() => {
                                        setcreate_group_select(!create_group_select)

                                    }} style={{ display: 'flex', backgroundColor: create_group_select ? '#e32747' : '#e6e8eb', color: create_group_select ? 'white' : 'black' }}> <CheckCircleOutlinedIcon style={{ marginRight: '10px' }} />Select Group<ArrowDropDownIcon style={{ marginLeft: '10px' }} /></button>

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
                        </div>

                        <div>
                            <hr></hr>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '10px', paddingTop: '5px' }}>
                    <div style={{ backgroundColor: '#e6e8eb', borderRadius: '5px', borderTopLeftRadius: site_manage_btn ? '0px' : '5px', borderTopRightRadius: site_manage_btn ? '0px' : '5px' }}>
                        <div xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', }}>
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
                                                                    url: api.ATTENDANCE_SITE_CREATION + val._id,
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
                        </div>
                    </div>
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

                                                                    <button style={{ backgroundColor: '#e22747', color: 'white', padding: '10px', borderRadius: '20px', border: '1px solid gray', }} onClick={() => {
                                                                        if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                                                                            let access = userData.operation_type.filter((val) => { return val == 'Create' || val == 'All' })
                                                                            if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Create' || access[1] == 'Create') {
                                                                                handleOpenMannualModel()
                                                                                setIsChooseMode(false)
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
                                                                                handleOpenMannualModel()
                                                                                setIsChooseMode(false)
                                                                            } else {
                                                                                setalert_box(true)
                                                                                setalert_text(`Your access level does not allow you to download these (${cam_name}) videos.`)

                                                                            }
                                                                            setsave_type('new_data')
                                                                        }
                                                                    }}> <TuneOutlinedIcon style={{ marginRight: '10px' }} />Add Enrollment</button>
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
                                                                                                        site_list1.map((value) => {
                                                                                                            if (val.attendance_group_id == value._id) {
                                                                                                                str = value.site_name
                                                                                                            }
                                                                                                        })
                                                                                                        cam_obj.push({
                                                                                                            user_name: val.user_name,
                                                                                                            user_id: val.emp_id,
                                                                                                            mobile_number: val.mobile_number,
                                                                                                            mail_id: val.mail,
                                                                                                            gender: val.gender,
                                                                                                            image_url: val.image_url,
                                                                                                            desigination: val.desigination,
                                                                                                            password: val.password,
                                                                                                            active: val.Active,
                                                                                                            site: { select: str, id: val.attendance_group_id },
                                                                                                            id: val._id
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
                                                                                                            if (val.attendance_group_id == value._id) {
                                                                                                                str = value.site_name
                                                                                                            }
                                                                                                        })
                                                                                                        camera_object.push({
                                                                                                            user_name: val.user_name,
                                                                                                            user_id: val.emp_id,
                                                                                                            mobile_number: val.mobile_number,
                                                                                                            mail_id: val.mail,
                                                                                                            gender: val.gender,
                                                                                                            image_url: val.image_url,
                                                                                                            desigination: val.desigination,
                                                                                                            password: val.password,
                                                                                                            active: val.Active,
                                                                                                            site: { select: str, id: val.attendance_group_id }
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
                                                                                        if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                                                                                            let access = userData.operation_type.filter((val) => { return val == 'Edit' || val == 'All' })
                                                                                            if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Edit' || access[1] == 'Edit') {

                                                                                                let count = 0
                                                                                                if (selectedcameras.length != 0) {
                                                                                                    selectedcameras.map((val) => {
                                                                                                        let config = {
                                                                                                            method: 'delete',
                                                                                                            maxBodyLength: Infinity,
                                                                                                            url: api.ENROLLMENT_USER_CREATION + val._id,
                                                                                                            headers: {
                                                                                                                'Content-Type': 'application/json'
                                                                                                            },
                                                                                                            data: data
                                                                                                        };

                                                                                                        axios.request(config)
                                                                                                            .then((response) => {
                                                                                                                count = count + 1
                                                                                                                if (count == selectedcameras.length) {
                                                                                                                    list_camera_site_id(selected_sites)
                                                                                                                    setselectedcameras([])
                                                                                                                    setcamera_list_data([])
                                                                                                                    setcamera_list_data1([])
                                                                                                                }
                                                                                                            })
                                                                                                            .catch((error) => {
                                                                                                                console.log(error);
                                                                                                            })
                                                                                                    })

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
                                                                                                            cam_name = `${cam_name} ${val.user_name}`
                                                                                                        }
                                                                                                    }
                                                                                                })

                                                                                            })

                                                                                            if (count) {
                                                                                                if (selectedcameras.length != 0) {
                                                                                                    let count = 0
                                                                                                    selectedcameras.map((val) => {
                                                                                                        let config = {
                                                                                                            method: 'delete',
                                                                                                            maxBodyLength: Infinity,
                                                                                                            url: api.ENROLLMENT_USER_CREATION + val._id,
                                                                                                            headers: {
                                                                                                                'Content-Type': 'application/json'
                                                                                                            },
                                                                                                            data: data
                                                                                                        };

                                                                                                        axios.request(config)
                                                                                                            .then((response) => {
                                                                                                                count = count + 1
                                                                                                                if (count == selectedcameras.length) {
                                                                                                                    list_camera_site_id(selected_sites)
                                                                                                                    setselectedcameras([])
                                                                                                                    setcamera_list_data([])
                                                                                                                    setcamera_list_data1([])
                                                                                                                }
                                                                                                            })
                                                                                                            .catch((error) => {
                                                                                                                console.log(error);
                                                                                                            })
                                                                                                    })

                                                                                                } else {
                                                                                                    alert('Select Cameras to Edit')
                                                                                                }
                                                                                            } else {
                                                                                                setalert_box(true)
                                                                                                setalert_text(`Your access level does not allow you to download these (${cam_name}) videos.`)

                                                                                            }
                                                                                        }

                                                                                    }}>Delete User</p>

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





                                        {/* Cameras Data */}
                                        {

                                            skeleton == true ?
                                                <Row style={{ padding: '10px', alignItems: 'center', }}>

                                                    <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ overflowX: 'scroll' }}>
                                                        <table style={{ width: '100%', backgroundColor: 'white' }}>
                                                            <tr style={{ backgroundColor: '#e6e8eb', color: 'black' }}>
                                                                <th style={{ padding: '15px' }}><input type='checkbox' checked={selectedcameras.length === cameras.length ? true : false} onClick={(e) => {
                                                                    let check = document.getElementsByClassName('check')

                                                                    if (e.target.checked === true) {
                                                                        for (let i = 0; i < check.length; i++) {
                                                                            check[i].checked = true
                                                                            // let img = document.getElementById(`dash_image${i}`)
                                                                            // camera_list_image.push(img.src)
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
                                                                <th style={{ padding: '15px' }}>User Name</th>
                                                                <th style={{ padding: '15px' }}>Mail Id</th>
                                                                <th style={{ padding: '15px' }}>Employee Id</th>
                                                                <th style={{ padding: '15px' }}>Gender</th>
                                                                <th style={{ padding: '15px' }}>Mobile Number</th>
                                                                <th style={{ padding: '15px' }}>Desigination</th>
                                                            </tr>
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

                                                                        return (
                                                                            <tr style={{ borderBottom: '1px solid grey', color: 'black' }}>
                                                                                <th style={{ padding: '15px' }}><input className='check' checked={chk} type='checkbox' onClick={(e) => {
                                                                                    if (e.target.checked === true) {
                                                                                        setselectedcameras((old) => {
                                                                                            // let img = document.getElementById(`dash_image${i}`)
                                                                                            // camera_list_image.push(img.src)
                                                                                            dispatch({ type: SELECTED_CAMERAS, value: [...old, val] })
                                                                                            return [...old, val]
                                                                                        })
                                                                                    } else {
                                                                                        let arr = []
                                                                                        selectedcameras.map((data, i) => {
                                                                                            if (val._id !== data._id) {
                                                                                                // let img = document.getElementById(`dash_image${i}`)
                                                                                                // camera_list_image.push(img.src)
                                                                                                arr.push(data)
                                                                                            }
                                                                                        })
                                                                                        setselectedcameras(arr)
                                                                                        dispatch({ type: SELECTED_CAMERAS, value: arr })
                                                                                    }

                                                                                }}></input></th>
                                                                                <td style={{ padding: '15px' }}>{val.user_name}</td>
                                                                                <td style={{ padding: '15px' }}>{val.mail_id}</td>
                                                                                <td style={{ padding: '15px' }}>{val.emp_id}</td>
                                                                                <td style={{ padding: '15px' }}>{val.gender}</td>
                                                                                <td style={{ padding: '15px' }}>{val.mobile_number}</td>
                                                                                <td style={{ padding: '15px' }}>{val.desigination}</td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                    :
                                                                    ''

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
            </div>
        </div>
    )
}
