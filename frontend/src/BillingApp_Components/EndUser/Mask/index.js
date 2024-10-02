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
import { db_type } from '../db_config'
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import CircularProgress from '@mui/material/CircularProgress';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { PAGE, STARTDATE, STARTTIME, ENDDATE, ENDTIME, APPLY, SELECT, SELECTED_CAMERAS } from '../../../store/actions'
import { useDispatch, useSelector } from 'react-redux';
import * as api from '../../Configurations/Api_Details'
import axios from 'axios';
import io from 'socket.io-client'
import moment from 'moment'
import Mask from './Mask'
import tento from '../tento.jpeg'

import { S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import AWS from "aws-sdk";

import { CreateBucketCommand, S3Client, GetObjectCommand, ListBucketsCommand, DeleteBucketCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import Skeleton from 'react-loading-skeleton';
let colflag = true
let count = 0
let camera_list_image = []
let edit_image = []
let intervals = []
let selected_cameras_length = 0
let all_selected_cameras_length = 0
let dummey_array = []
export default function Events({ analytic_type }) {
    const userData = JSON.parse(localStorage.getItem("userData"))


    const digitalOceanSpaces = 'https://tentovision.sgp1.digitaloceanspaces.com'
    const bucketName = process.env.REACT_APP_AWS_BUCKET_NAME

    let data = []
    const { page, startdate, starttime, enddate, endtime, apply, select, selected_cameras } = useSelector((state) => state)
    const dispatch = useDispatch()
    const [viewstart_date, setviewstart_date] = useState(false);
    const [viewend_date, setviewend_date] = useState(false);
    let split_start_date = startdate.split('-')
    let split_end_date = enddate.split('-')
    const [start_dateFullYear, setstart_dateFullYear] = useState(split_start_date[0]);
    const [start_dateMonth, setstart_dateMonth] = useState(split_start_date[1]);
    const [start_dateDate, setstart_dateDate] = useState(split_start_date[2]);
    const [end_dateFullYear, setend_dateFullYear] = useState(split_end_date[0]);
    const [imguri, setimguri] = useState('');
    const [end_dateMonth, setend_dateMonth] = useState(split_end_date[1]);
    const [end_dateDate, setend_dateDate] = useState(split_end_date[2]);
    const [colcount, setcolcount] = useState(40)
    const [save_trigger, setsave_trigger] = useState(0)
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    let [finaldata, setfinaldata] = useState([])
    let [finaldate, setfinaldate] = useState('')
    const [clickbtn1, setclickbtn1] = useState(false)
    const [clickbtn2, setclickbtn2] = useState(false)
    const [clickbtn3, setclickbtn3] = useState(false)
    const [btn1, setbtn1] = useState('')
    const [cameras, setcameras] = useState([]);
    const [cameras1, setcameras1] = useState([]);
    const [cameras_view, setcameras_view] = useState([]);
    const [cameras_view1, setcameras_view1] = useState([]);
    const [cameras_view2, setcameras_view2] = useState([]);
    const [selectedcameras, setselectedcameras] = useState([]);
    const [over_image_array, setover_image_array] = useState([]);
    let [selected_video, setselected_video] = useState([])
    const [toggle, settoggle] = useState(false)
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

    const [camera_checkbox, setcamera_checkbox] = useState([])
    const [tag_checkbox, settag_checkbox] = useState([])
    const [group_checkbox, setgroup_checkbox] = useState([])
    const [full_camera_search, setfull_camera_search] = useState('')
    const [camera_search, setcamera_search] = useState('')
    const [tag_search, settag_search] = useState('')
    const [group_search, setgroup_search] = useState('')
    const [image_arr, setimage_arr] = useState([])
    const [camera_scan_flag, setcamera_scan_flag] = useState(false)

    const [scroll, setscroll] = useState(false)
    const [alert_box, setalert_box] = useState(false)
    const [res, setres] = useState(true)
    const [camera_state, setcamera_state] = useState(false)
    const alertClose = () => setalert_box(false)
    const [loading, setloading] = useState(false)
    const [select_cameras, setselect_cameras] = useState([])
    const [second_flag, setsecond_flag] = useState(false)
    const [mask_range_name, setmask_range_name] = useState([])
    const [from_time, setfrom_time] = useState([])
    const [to_time, setto_time] = useState([])
    const [class_name, setclass_name] = useState([])
    const [type, settype] = useState([])
    const [threshold, setthreshold] = useState([])
    const [direction_name, setdirection_name] = useState([])
    const [in_out, setin_out] = useState([])
    const [dummey, setdummey] = useState(false)

    if (select === false) {
        selected_video = []
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
                getimageurifunction(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, val, i)
            })
        }
    }, [open1])

    useEffect(() => {
        let socket = ''
        if (db_type == 'local') {

        } else {
            socket = io(api.BACKEND_URI, { transports: ['websocket'] });

            socket.on("connect_error", (err) => {
                console.log(`connect_error due to ${err.message}`);
            })

            socket.on('mask_image', function (a) {

                if (userData._id == JSON.parse(a).user_id) {
                    let data = JSON.parse(a).data
                    getmaskImagefunction(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, data,)
                }
                console.log(JSON.parse(a));
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
        setres(true)
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
                    let alert_camera = []

                    if (analytic_type == 'masking') {
                        response.data.map((val) => {
                            if (val.camera_option.alert != 0) {
                                alert_camera.push(val)
                            }
                        })
                    } else if (analytic_type == 'people_masking') {
                        response.data.map((val) => {
                            if (val.camera_option.people_analytics != undefined && val.camera_option.people_analytics != 0) {
                                alert_camera.push(val)
                            }
                        })
                    } else if (analytic_type == 'vehicle_masking') {
                        response.data.map((val) => {
                            if (val.camera_option.vehicle_analytics != undefined && val.camera_option.vehicle_analytics != 0) {
                                alert_camera.push(val)
                            }
                        })
                    }else if (analytic_type == 'face_masking') {
                        response.data.map((val) => {
                            if (val.camera_option.face_dedaction != undefined && val.camera_option.face_dedaction != 0) {
                                alert_camera.push(val)
                            }
                        })
                    }else if (analytic_type == 'anpr_masking') {
                        response.data.map((val) => {
                            if (val.camera_option.anpr != undefined && val.camera_option.anpr != 0) {
                                alert_camera.push(val)
                            }
                        })
                    }

                    console.log(alert_camera);

                    setcameras(alert_camera)
                    setcameras1(alert_camera)
                    setcameras_view(alert_camera)
                    setcameras_view1(alert_camera)
                    setcameras_view2(alert_camera)
                    setselectedcameras([])
                    dispatch({ type: SELECTED_CAMERAS, value: [] })

                    if (alert_camera.length == 0) {
                        setres('no_data')
                    } else {
                        setres(false)
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

                            let alert_camera = []
                            data1.map((val) => {
                                if (val.camera_option.alert != 0) {
                                    alert_camera.push(val)
                                }
                            })
                            setcameras(alert_camera)
                            setcameras1(alert_camera)
                            setcameras_view(alert_camera)
                            setcameras_view1(alert_camera)
                            setcameras_view2(alert_camera)
                            setselectedcameras([])
                            dispatch({ type: SELECTED_CAMERAS, value: [] })
                            if (alert_camera.length == 0) {
                                setres('no_data')
                            } else {
                                setres(false)
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

                    let alert_camera = []
                    response.data.map((val) => {
                        if (val.camera_option.alert != 0) {
                            alert_camera.push(val)
                        }
                    })

                    setcameras(alert_camera)
                    setcameras1(alert_camera)
                    setcameras_view(alert_camera)
                    setcameras_view1(alert_camera)
                    setcameras_view2(alert_camera)
                    setselectedcameras([])
                    dispatch({ type: SELECTED_CAMERAS, value: [] })

                    if (alert_camera.length == 0) {
                        setres('no_data')
                    } else {
                        setres(false)
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
    }, [])

    const handleOpen1 = () => setOpen1(true);
    const handleClose1 = () => {
        setOpen1(false)
        setcamera_box(false)
        setcamera_tag(false)
        setcamera_group(false)
        setonline_status(false)

    };

    function fun_over_image_array(value) {
        setover_image_array(value)
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
                                cameras.map((cameradata) => {
                                    if (groupdata === cameradata._id) {
                                        arr.push(cameradata)
                                    }
                                })
                            })
                        })


                        camera_value.map((group, i) => {
                            if (group.name == cameras[group.ind].camera_gereral_name) {
                                arr.push(cameras[group.ind])
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

        if (type == 'regular') {
            // let image_array = []
            // new_camera_list.map((val) => {
            //     if (val.image_edited.length == 0) {
            //         image_array.push({ id: val._id, img_arr: [{ name: 'None', id: Date.now(), url: 'NONE' }] })
            //     } else {
            //         let data = []
            // val.image_edited.map((da) => {
            //     data.push({ ...da, flag: false })
            // })
            // image_array.push({ id: val._id, img_arr: data })
            //     }

            // })

            // setover_image_array(image_array)
            setcameras_view(new_camera_list)
            setcameras_view2(new_camera_list)
            setselectedcameras(new_camera_list)

            dispatch({ type: SELECTED_CAMERAS, value: new_camera_list })
            setfinaldata([])
            setimage_arr([])
            setfinaldate('')
            colflag = true
            setcolcount(30)
            setclickbtn2(true)
        }
    }

    function groupelsefunction(val, type) {
        let new_camera_list = cameras_view
        let flagcount = 0
        let flagcount1 = 0
        let flagcount2 = 0

        let group_value = []
        let camera_value = []

        let check = document.getElementsByClassName('groupsCheckbox')
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
            if (val.tags.length !== 0) {
                for (let index = 0; index < val.tags.length; index++) {
                    let flag = false
                    let obj = []
                    for (let index1 = 0; index1 < new_camera_list.length; index1++) {
                        if (new_camera_list[index1]._id === val.tags[index]) {
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
                                cameras.map((cameradata) => {
                                    if (groupdata === cameradata._id) {
                                        arr.push(cameradata)
                                    }
                                })
                            })
                        })


                        camera_value.map((group, i) => {
                            if (group.name == cameras[group.ind].camera_gereral_name) {
                                arr.push(cameras[group.ind])
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

        if (type == 'regular') {
            let image_array = []
            new_camera_list.map((val) => {
                if (val.image_edited.length == 0) {
                    image_array.push({ id: val._id, img_arr: [{ name: 'None', id: Date.now(), url: 'NONE' }] })
                } else {
                    let data = []
                    val.image_edited.map((da, i) => {
                        data.push({ ...da, flag: i == 0 ? true : false })
                    })
                    image_array.push({ id: val._id, img_arr: data })
                }
            })
            setover_image_array(image_array)
            setcameras_view(new_camera_list)
            setcameras_view2(new_camera_list)
            setselectedcameras(new_camera_list)
            dispatch({ type: SELECTED_CAMERAS, value: new_camera_list })
            setfinaldata([])
            setimage_arr([])
            setfinaldate('')
            colflag = true
            setcolcount(30)
            setclickbtn2(true)
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

    async function getimageurifunction(accessKeyId, secretAccessKey, Bucket, data, i) {
        const s3Client = new S3Client({
            region: "ap-south-1",
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        });


        setloading(true)

        const image_command = new GetObjectCommand({
            Bucket: Bucket,
            Key: data.image_uri,
        });

        const image_uri = await getSignedUrl(s3Client, image_command)

        // document.getElementById(`mask_image${i}`).src = image_uri
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

    async function getmaskImagefunction(accessKeyId, secretAccessKey, Bucket, key, i) {

        let image_uri = ''
        if (key.trim(' ') !== 'NONE' && key !== '') {
            const s3Client = new S3Client({
                region: "ap-south-1",
                credentials: {
                    accessKeyId: accessKeyId,
                    secretAccessKey: secretAccessKey,
                },
            });

            const image_command = new GetObjectCommand({
                Bucket: Bucket,
                Key: key,
            });

            image_uri = await getSignedUrl(s3Client, image_command)
        } else {
            image_uri = 'none'
        }

        count = count + 1
        if (count == selected_cameras_length.length) {
            camera_list_image[i] = image_uri
            intervals = []
            setcamera_scan_flag(false)
            dispatch({ type: SELECTED_CAMERAS, value: selected_cameras_length })
            handleClose1()
            count = 0
        } else {
            camera_list_image[i] = image_uri
        }
        return image_uri
    }

    async function geteditimageuri(accessKeyId, secretAccessKey, Bucket, edit, mask, flag, i) {
        console.log(accessKeyId, secretAccessKey, Bucket, data, edit, mask, flag, i)
        if (edit.trim(' ') !== 'NONE' && edit !== '') {
            const s3Client = new S3Client({
                region: "ap-south-1",
                credentials: {
                    accessKeyId: accessKeyId,
                    secretAccessKey: secretAccessKey,
                },
            });

            const image_command = new GetObjectCommand({
                Bucket: Bucket,
                Key: edit,
            });

            const image_uri = await getSignedUrl(s3Client, image_command)
            edit_image[i] = image_uri
            if (flag == 'first') {
                getmaskImagefunction(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, mask, i)
            } else {
                count = count + 1
                if (count == selected_cameras_length.length) {
                    setsecond_flag(!second_flag)
                    count = 0
                }
            }
            return image_uri
        } else {
            edit_image[i] = 'none'
            if (flag == 'first') {
                getmaskImagefunction(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, mask, i)
            } else {
                count = count + 1
                if (count == selected_cameras_length.length) {
                    setsecond_flag(!second_flag)
                    count = 0
                }
                console.log(edit_image)
            }
            return 0
        }
    }

    // function getmask_data() {

    // }

    console.log(select_cameras)

    return (
        <div style={{ width: '100%' }}>

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
                                <p id='alert_text' style={{ color: 'white', margin: 0, textAlign: 'center' }}>Your access level does not allow you to create device.</p>
                            </Col>
                        </Row>
                    </div>
                </Modal>

                <Modal
                    open={open1}
                    onClose={() => {
                        // for (let index = 0; index < intervals.length; index++) {
                        //     clearInterval(intervals[index])
                        // }
                        // intervals = []
                        handleClose1()
                        setcamera_scan_flag(false)
                        dispatch({ type: SELECTED_CAMERAS, value: selectedcameras })
                    }}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    style={{ marginLeft: 'auto', marginRight: 'auto', height: 550, width: '90%', top: 20 }}
                >
                    <div>
                        {
                            camera_scan_flag ?
                                <Row>
                                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: 'white', borderRadius: '5px', paddingTop: '10px', height: 550, maxHeight: 550 }}>
                                            <CircularProgress size={'30px'} style={{ color: 'blue' }} />
                                            <p>Retriving images please wait...</p>
                                        </div>
                                    </Col>
                                </Row>
                                :

                                <Row>
                                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <div >

                                            <div style={{ backgroundColor: 'white', borderRadius: '5px', paddingTop: '10px', height: 550, maxHeight: 550, overflowY: 'scroll' }}>
                                                <Row style={{ padding: '10px', alignItems: 'center' }}>

                                                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                            <CloseIcon style={{ color: 'black' }} onClick={() => { handleClose1(); dispatch({ type: SELECTED_CAMERAS, value: selectedcameras }) }} />
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
                                                                    let current_time = moment(new Date()).format("HH:mm")
                                                                    current_time = current_time.split(':')
                                                                    let current_date = moment(new Date()).format('YYYY-MM-DD')
                                                                    let ofline_device = ''

                                                                    // let newdata = []
                                                                    // let existdata = []
                                                                    // if (selected_cameras.length == 0) {
                                                                    //     newdata = select_cameras
                                                                    // } else {
                                                                    //     for (let index = 0; index < select_cameras.length; index++) {
                                                                    //         let flag = false
                                                                    //         for (let index1 = 0; index1 < selected_cameras.length; index1++) {
                                                                    //             if (select_cameras[index]._id == selected_cameras[index1]._id) {
                                                                    //                 flag = true
                                                                    //                 existdata.push(select_cameras[index])
                                                                    //                 break
                                                                    //             } else {
                                                                    //                 flag = false
                                                                    //             }

                                                                    //         }

                                                                    //         if (!flag) {
                                                                    //             newdata.push(select_cameras[index])
                                                                    //         }

                                                                    //     }
                                                                    // }


                                                                    if (select_cameras.length !== 0) {
                                                                        edit_image = []
                                                                        camera_list_image = []
                                                                        selected_cameras_length = select_cameras
                                                                        setcamera_scan_flag(true)
                                                                        select_cameras.map((val, i) => {
                                                                            let key = 'NONE'
                                                                            if (analytic_type == 'masking') {
                                                                                key = val.image_edited.length == 0 ? 'NONE' : val.image_edited[0].url
                                                                                mask_range_name.push(val.image_edited.length == 0 ? 'None' : val.image_edited[0].name)
                                                                                direction_name.push(val.image_edited[0].direction == undefined ? 'LeftToRight' : val.image_edited[0].direction)
                                                                                in_out.push(val.image_edited[0].sequence == undefined ? 'In' : val.image_edited[0].sequence)
                                                                                from_time.push(val.image_edited[0].from_time == undefined ? '00:00' : val.image_edited[0].from_time)
                                                                                to_time.push(val.image_edited[0].to_time == undefined ? '23:59' : val.image_edited[0].to_time)
                                                                                type.push(val.image_edited[0].type == undefined ? 'Intrution' : val.image_edited[0].type)
                                                                                class_name.push(val.image_edited[0].class == undefined ? 'People' : val.image_edited[0].class)
                                                                                threshold.push(val.image_edited[0].threshold == undefined ? 0 : val.image_edited[0].threshold)
                                                                            } else if (analytic_type == 'people_masking') {
                                                                                key = val.image_edited_people.length == 0 ? 'NONE' : val.image_edited_people[0].url
                                                                                mask_range_name.push(val.image_edited_people.length == 0 ? 'None' : val.image_edited_people[0].name)
                                                                                direction_name.push(val.image_edited_people[0].direction == undefined ? 'LeftToRight' : val.image_edited_people[0].direction)
                                                                                in_out.push(val.image_edited_people[0].sequence == undefined ? 'In' : val.image_edited_people[0].sequence)
                                                                                from_time.push(val.image_edited_people[0].from_time == undefined ? '00:00' : val.image_edited_people[0].from_time)
                                                                                to_time.push(val.image_edited_people[0].to_time == undefined ? '23:59' : val.image_edited_people[0].to_time)
                                                                                type.push(val.image_edited_people[0].type == undefined ? 'Intrution' : val.image_edited_people[0].type)
                                                                                class_name.push(val.image_edited_people[0].class == undefined ? 'People' : val.image_edited_people[0].class)
                                                                                threshold.push(val.image_edited_people[0].threshold == undefined ? 0 : val.image_edited_people[0].threshold)
                                                                            } else if (analytic_type == 'vehicle_masking') {
                                                                                key = val.image_edited_vehicle.length == 0 ? 'NONE' : val.image_edited_vehicle[0].url
                                                                                mask_range_name.push(val.image_edited_vehicle.length == 0 ? 'None' : val.image_edited_vehicle[0].name)
                                                                                direction_name.push(val.image_edited_vehicle[0].direction == undefined ? 'LeftToRight' : val.image_edited_vehicle[0].direction)
                                                                                in_out.push(val.image_edited_vehicle[0].sequence == undefined ? 'In' : val.image_edited_vehicle[0].sequence)
                                                                                from_time.push(val.image_edited_vehicle[0].from_time == undefined ? '00:00' : val.image_edited_vehicle[0].from_time)
                                                                                to_time.push(val.image_edited_vehicle[0].to_time == undefined ? '23:59' : val.image_edited_vehicle[0].to_time)
                                                                                type.push(val.image_edited_vehicle[0].type == undefined ? 'Intrution' : val.image_edited_vehicle[0].type)
                                                                                class_name.push(val.image_edited_vehicle[0].class == undefined ? 'People' : val.image_edited_vehicle[0].class)
                                                                                threshold.push(val.image_edited_vehicle[0].threshold == undefined ? 0 : val.image_edited_vehicle[0].threshold)
                                                                            }
                                                                            // setmask_range_name(val.image_edited.length == 0 ? 'None' : val.image_edited[0].name)
                                                                            // setdirection_name(val.image_edited[0].direction == undefined ? 'LeftToRight' : val.image_edited[0].direction)
                                                                            // setin_out(val.image_edited[0].sequence == undefined ? 'In' : val.image_edited[0].sequence)
                                                                            geteditimageuri(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, key, val.mask, 'first', i)
                                                                            console.log()
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
                                                                                topic: `${val.device_id}/mask_image`,
                                                                                payload: JSON.stringify({ user_id: userData._id, camera_url: val.camera_url, device_id: val.device_id, camera_id: val._id }),
                                                                                qos: 0
                                                                            };

                                                                            iot.publish(params, (err, data) => {
                                                                                if (err) {
                                                                                    console.error('Error publishing message:', err);
                                                                                } else {
                                                                                    console.log('Message published successfully:', data);
                                                                                }
                                                                            });

                                                                            // intervals.push(
                                                                            //     setInterval(() => {
                                                                            //         const getStocksData = {
                                                                            //             url: api.CAMERA_CREATION + val._id,
                                                                            //             headers: {
                                                                            //                 'Content-Type': 'application/json',
                                                                            //             },
                                                                            //         }

                                                                            //         axios.request(getStocksData)
                                                                            //             .then((response) => {
                                                                            //                 console.log(response.data);



                                                                            //                 if (response.data.last_active != 'NONE' && response.data.last_active_date != 'NONE') {
                                                                            //                     let device_time = response.data.last_active.split(':')

                                                                            //                     if (current_date == response.data.last_active_date && Number(current_time[0]) == Number(device_time[0]) && (Number(current_time[1]) - Number(device_time[1])) == 0) {
                                                                            //                         getmaskImagefunction(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, response.data.mask,)
                                                                            //                         clearInterval(intervals[i])
                                                                            //                     } else if (current_date == response.data.last_active_date && Number(current_time[0]) == Number(device_time[0]) && (Number(current_time[1]) - Number(device_time[1])) == 1 && (Number(current_time[2]) + Number(device_time[2])) <= 60) {
                                                                            //                         if (ofline_device == '') {
                                                                            //                             ofline_device = `${response.data.camera_gereral_name}`
                                                                            //                         } else {
                                                                            //                             ofline_device = `${ofline_device}, ${response.data.camera_gereral_name}`
                                                                            //                         }
                                                                            //                     }
                                                                            //                 } else {
                                                                            //                     if (ofline_device == '') {
                                                                            //                         ofline_device = `${response.data.camera_gereral_name}`
                                                                            //                     } else {
                                                                            //                         ofline_device = `${ofline_device}, ${response.data.camera_gereral_name}`
                                                                            //                     }

                                                                            //                 }
                                                                            //             })
                                                                            //             .catch((e) => {
                                                                            //                 console.log(e);
                                                                            //             })
                                                                            //     }, 10000)
                                                                            // )
                                                                        })

                                                                    } else {

                                                                    }

                                                                    // console.log(newdata);
                                                                    // console.log(edit_image);
                                                                    // console.log(camera_list_image);
                                                                    // console.log([...existdata, ...newdata]);
                                                                    // console.log(select_cameras);
                                                                    // console.log(selected_cameras);
                                                                    // all_selected_cameras_length = [...existdata, ...newdata]
                                                                    let image_array = []
                                                                    console.log(select_cameras)
                                                                    select_cameras.map((val) => {
                                                                        if (analytic_type == 'masking') {
                                                                            if (val.image_edited.length == 0) {
                                                                                image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, id: Date.now(), url: 'NONE', flag: true }] })
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
                                                                        } else if (analytic_type == 'people_masking') {
                                                                            if (val.image_edited_people.length == 0) {
                                                                                image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, id: Date.now(), url: 'NONE', flag: true }] })
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
                                                                        } else if (analytic_type == 'vehicle_masking') {
                                                                            if (val.image_edited_vehicle.length == 0) {
                                                                                image_array.push({ id: val._id, img_arr: [{ name: 'None', direction: 'LeftToRight', sequence: 'In', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, id: Date.now(), url: 'NONE', flag: true }] })
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
                                                                        }
                                                                    })
                                                                    console.log(image_array);
                                                                    setover_image_array(image_array)
                                                                    setselectedcameras(select_cameras)
                                                                    // dispatch({ type: SELECTED_CAMERAS, value: [...existdata, ...newdata] })

                                                                }}> <HighlightAltIcon style={{ marginRight: '10px' }} />Mask</button>
                                                            </div>

                                                            <div>
                                                                <p style={{ color: 'black', fontSize: '20px', margin: 0 }}><span style={{ color: 'white', backgroundColor: '#1b0182', borderRadius: '50%', paddingLeft: '10px', paddingRight: '10px', paddingTop: '3px', paddingBottom: '3px' }}>{select_cameras.length}</span> / {cameras.length} Cameras Selected</p>
                                                            </div>
                                                        </div>
                                                    </Col>

                                                </Row>

                                                {
                                                    filter ?
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
                                                                                    <CloseIcon style={{ fontSize: '12px', color: 'white' }} onClick={() => {
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
                                                                                            let image_array = []
                                                                                            cameras.map((val) => {
                                                                                                if (val.image_edited.length == 0) {
                                                                                                    image_array.push({ id: val._id, img_arr: [{ name: 'None', id: Date.now(), url: 'NONE' }] })
                                                                                                } else {
                                                                                                    let data = []
                                                                                                    val.image_edited.map((da, i) => {
                                                                                                        data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                    })
                                                                                                    image_array.push({ id: val._id, img_arr: data })
                                                                                                }
                                                                                            })
                                                                                            setover_image_array(image_array)
                                                                                            setget_tag_full_data_sort(get_tag_full_data)
                                                                                            setget_tag_full_data_sort1(get_tag_full_data)
                                                                                            setget_group_full_data_sort(get_group_full_data)
                                                                                            setget_group_full_data_sort1(get_group_full_data)
                                                                                            setcameras_view(cameras)
                                                                                            setcameras_view2(cameras)
                                                                                            setselectedcameras(cameras)
                                                                                            dispatch({ type: SELECTED_CAMERAS, value: cameras })
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

                                                                                                            let image_array = []
                                                                                                            newcamera.map((val) => {
                                                                                                                if (val.image_edited.length == 0) {
                                                                                                                    image_array.push({ id: val._id, img_arr: [{ name: 'None', id: Date.now(), url: 'NONE' }] })
                                                                                                                } else {
                                                                                                                    let data = []
                                                                                                                    val.image_edited.map((da, i) => {
                                                                                                                        data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                    })
                                                                                                                    image_array.push({ id: val._id, img_arr: data })
                                                                                                                }
                                                                                                            })
                                                                                                            setover_image_array(image_array)
                                                                                                            setcamera_checkbox([...camera_checkbox, val._id])
                                                                                                            setget_tag_full_data_sort(new_camera_tag)
                                                                                                            setget_tag_full_data_sort1(new_camera_tag)
                                                                                                            setget_group_full_data_sort(new_camera_group)
                                                                                                            setget_group_full_data_sort1(new_camera_group)
                                                                                                            setcameras_view(newcamera)
                                                                                                            setcameras_view2(newcamera)
                                                                                                            setselectedcameras(newcamera)
                                                                                                            dispatch({ type: SELECTED_CAMERAS, value: newcamera })
                                                                                                            setfinaldata([])
                                                                                                            setimage_arr([])
                                                                                                            setfinaldate('')
                                                                                                            colflag = true
                                                                                                            setcolcount(30)
                                                                                                            setclickbtn2(true)
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

                                                                                                            let image_array = []
                                                                                                            new_camera_list.map((val) => {
                                                                                                                if (val.image_edited.length == 0) {
                                                                                                                    image_array.push({ id: val._id, img_arr: [{ name: 'None', id: Date.now(), url: 'NONE' }] })
                                                                                                                } else {
                                                                                                                    let data = []
                                                                                                                    val.image_edited.map((da, i) => {
                                                                                                                        data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                    })
                                                                                                                    image_array.push({ id: val._id, img_arr: data })
                                                                                                                }
                                                                                                            })
                                                                                                            setover_image_array(image_array)
                                                                                                            setcamera_checkbox(camcnk)
                                                                                                            setcameras_view(new_camera_list)
                                                                                                            setcameras_view2(new_camera_list)
                                                                                                            setselectedcameras(new_camera_list)
                                                                                                            dispatch({ type: SELECTED_CAMERAS, value: new_camera_list })
                                                                                                            setfinaldata([])
                                                                                                            setimage_arr([])
                                                                                                            setfinaldate('')
                                                                                                            colflag = true
                                                                                                            setcolcount(30)
                                                                                                            setclickbtn2(true)
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

                                                                    }} style={{ display: 'flex', backgroundColor: online_status ? '#e22747' : '#e6e8eb', color: online_status ? 'white' : 'black' }}> <AccessTimeIcon style={{ marginRight: '10px' }} />Status </button>

                                                                    <div id='status' style={{ borderRadius: '5px', backgroundColor: '#181828', padding: '10px', position: 'absolute', top: '60px', zIndex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', display: online_status ? 'block' : 'none' }}>
                                                                        <div style={{ position: 'relative' }}>

                                                                            <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: '-37px' }} />
                                                                            <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                                <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                                                                    <CloseIcon style={{ fontSize: '12px', color: 'white' }} onClick={() => {
                                                                                        setonline_status(!online_status)
                                                                                        setcamera_box(false)
                                                                                        setcamera_tag(false)
                                                                                        setcamera_group(false)
                                                                                    }} />
                                                                                </div>
                                                                            </div>

                                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                                                                <p style={{ margin: 0, color: 'white', width: '200px' }}>Online<span style={{ color: 'white', borderRadius: '50%', backgroundColor: '#a8a4a4', marginLeft: '10px', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px' }}>{selectedcameras.length}</span></p>
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
                                                                                        cameras.map((val) => {
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

                                                                    }} style={{ display: 'flex', backgroundColor: camera_tag ? '#e22747' : '#e6e8eb', color: camera_tag ? 'white' : 'black' }}> <AccessTimeIcon style={{ marginRight: '10px' }} />Tags <div style={{ backgroundColor: '#e32747', padding: '3px', borderRadius: '50%', height: '25px', width: '25px', marginLeft: '10px' }}><p style={{ color: 'white' }}>{get_tag_full_data_sort.length}</p></div> <ArrowDropDownIcon style={{ marginLeft: '0px' }} /></button>

                                                                    <div>
                                                                        <div style={{ borderRadius: '5px', backgroundColor: '#181828', padding: '10px', position: 'absolute', top: '60px', zIndex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', display: camera_tag ? 'block' : 'none' }}>
                                                                            <div style={{ position: 'relative' }}>

                                                                                <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: '-37px' }} />
                                                                                <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                                    <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                                                                        <CloseIcon style={{ fontSize: '12px', color: 'white' }} onClick={() => {
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

                                                                                                                        console.log(check.length, flagcount);
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
                                                                                                                            new_camera_list = cameras
                                                                                                                        }

                                                                                                                        let image_array = []
                                                                                                                        new_camera_list.map((val) => {
                                                                                                                            if (val.image_edited.length == 0) {
                                                                                                                                image_array.push({ id: val._id, img_arr: [{ name: 'None', id: Date.now(), url: 'NONE' }] })
                                                                                                                            } else {
                                                                                                                                let data = []
                                                                                                                                val.image_edited.map((da, i) => {
                                                                                                                                    data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                                })
                                                                                                                                image_array.push({ id: val._id, img_arr: data })
                                                                                                                            }
                                                                                                                        })
                                                                                                                        setover_image_array(image_array)
                                                                                                                        settag_checkbox([...tag_checkbox, val._id])
                                                                                                                        setcameras_view(new_camera_list)
                                                                                                                        setcameras_view2(new_camera_list)
                                                                                                                        setselectedcameras(new_camera_list)
                                                                                                                        dispatch({ type: SELECTED_CAMERAS, value: new_camera_list })
                                                                                                                        setfinaldata([])
                                                                                                                        setimage_arr([])
                                                                                                                        setfinaldate('')
                                                                                                                        colflag = true
                                                                                                                        setcolcount(30)
                                                                                                                        setclickbtn2(true)
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

                                                                    }} style={{ display: 'flex', backgroundColor: camera_group ? '#e22747' : '#e6e8eb', color: camera_group ? 'white' : 'black' }}> <AccessTimeIcon style={{ marginRight: '10px' }} />Groups <div style={{ backgroundColor: '#e32747', padding: '3px', borderRadius: '50%', height: '25px', width: '25px', marginLeft: '10px' }}><p style={{ color: 'white' }}>{get_group_full_data_sort.length}</p></div> <ArrowDropDownIcon style={{ marginLeft: '0px' }} /></button>

                                                                    <div>
                                                                        <div style={{ borderRadius: '5px', backgroundColor: '#181828', padding: '10px', position: 'absolute', top: '60px', zIndex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', display: camera_group ? 'block' : 'none' }}>
                                                                            <div style={{ position: 'relative' }}>

                                                                                <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: '-37px' }} />
                                                                                <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                                    <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                                                                        <CloseIcon style={{ fontSize: '12px', color: 'white' }} onClick={() => {
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
                                                                                                                        console.log(response.data)
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

                                                                                                                            new_camera_list = cameras
                                                                                                                        }

                                                                                                                        let image_array = []
                                                                                                                        new_camera_list.map((val) => {
                                                                                                                            if (val.image_edited.length == 0) {
                                                                                                                                image_array.push({ id: val._id, img_arr: [{ name: 'None', id: Date.now(), url: 'NONE' }] })
                                                                                                                            } else {
                                                                                                                                let data = []
                                                                                                                                val.image_edited.map((da, i) => {
                                                                                                                                    data.push({ ...da, flag: i == 0 ? true : false })
                                                                                                                                })
                                                                                                                                image_array.push({ id: val._id, img_arr: data })
                                                                                                                            }
                                                                                                                        })
                                                                                                                        setover_image_array(image_array)
                                                                                                                        settag_checkbox([...group_checkbox, val._id])
                                                                                                                        setcameras_view(new_camera_list)
                                                                                                                        setcameras_view2(new_camera_list)
                                                                                                                        setselectedcameras(new_camera_list)
                                                                                                                        dispatch({ type: SELECTED_CAMERAS, value: new_camera_list })
                                                                                                                        setfinaldata([])
                                                                                                                        setimage_arr([])
                                                                                                                        setfinaldate('')
                                                                                                                        colflag = true
                                                                                                                        setcolcount(30)
                                                                                                                        setclickbtn2(true)
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
                                                                                // setselectedcameras(cameras)
                                                                                setselect_cameras(cameras)
                                                                            } else {
                                                                                console.log(check);
                                                                                // for (let i = 0; i < check.length; i++) {
                                                                                //     check[i].style.backgroundColor = '#a8a4a4'
                                                                                //     check[i].style.justifyContent = 'flex-start'
                                                                                // }
                                                                                camera_list_image = []
                                                                                edit_image = []
                                                                                // setselectedcameras([])
                                                                                // dispatch({ type: SELECTED_CAMERAS, value: [] })
                                                                                setselect_cameras([])
                                                                            }
                                                                        }}>
                                                                            <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                                                        </div>
                                                                    </div>

                                                                </th>
                                                                <th style={{ padding: '15px' }}>Cameras</th>
                                                                <th style={{ padding: '15px' }}>Cameras name</th>
                                                                <th style={{ padding: '15px' }}>Device Id</th>
                                                                <th style={{ padding: '15px' }}>Cloud storage duration</th>
                                                            </tr>
                                                            {
                                                                console.log(cameras_view)
                                                            }
                                                            {
                                                                cameras_view.map((val, i) => {

                                                                    let chk = ""

                                                                    for (let i = 0; i < select_cameras.length; i++) {
                                                                        if (select_cameras[i]._id === val._id) {
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
                                                                                        let mask_image = []
                                                                                        let mask_edit = []

                                                                                        if (toggle === true) {
                                                                                            arr = [...select_cameras, val]
                                                                                            setselect_cameras(arr)
                                                                                            console.log(val)
                                                                                            console.log([...select_cameras, val])
                                                                                        } else {

                                                                                            select_cameras.map((data, i) => {
                                                                                                if (val._id !== data._id) {
                                                                                                    arr.push(data)
                                                                                                    mask_image.push(camera_list_image[i])
                                                                                                    mask_edit.push(edit_image[i])
                                                                                                }
                                                                                            })
                                                                                            camera_list_image = mask_image
                                                                                            edit_image = mask_edit
                                                                                            setselect_cameras(arr)
                                                                                            // setselectedcameras(arr)
                                                                                            // dispatch({ type: SELECTED_CAMERAS, value: arr })
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
                                                                                            <img width={150} height={100} id={`mask_image${i}`} src={imguri[i]} onError={(event) => {
                                                                                                event.target.src = tento
                                                                                            }}></img>
                                                                                        </>
                                                                                }



                                                                            </td>
                                                                            <td style={{ padding: '15px' }}>{val.camera_gereral_name}</td>
                                                                            <td style={{ padding: '15px' }}>{val.device_id}</td>
                                                                            <td style={{ padding: '15px' }}>{val.camera_option.alert != 0 ? 'Alert,' : ''} {val.camera_option.alert != 0 ? 'Analytics,' : ''} {val.camera_option.cloud != 0 ? `Cloud(${val.camera_option.cloud}),` : ''} {val.camera_option.face_dedaction != 0 ? 'Face Dedaction,' : ''} {val.camera_option.live != 0 ? 'Live,' : ''} {val.camera_option.local != 0 ? `Local(${val.camera_option.local}),` : ''} {val.camera_option.motion != 0 ? 'Motion,' : ''}</td>
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
                        }
                    </div>
                </Modal >
            </div >

            <Row style={{ width: '100%', paddingRight: 0, paddingLeft: '15px', }} onScroll={(event) => {
                const { scrollHeight, scrollTop, clientHeight } = event.target;
                const isBottomReached = ((scrollHeight - Math.round(scrollTop)) - 300 < clientHeight);

                if (isBottomReached && scroll) {
                    // You have reached the bottom of the container
                    colflag = true
                    setcolcount(colcount + 30)
                    setscroll(false)
                }
            }} id='main' >
                <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: page === 1 ? 'block' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ color: 'black', fontWeight: 'bolder', fontSize: '20px' }}>Filters</p>
                        <CloseIcon style={{ color: 'black' }} onClick={() => {
                            dispatch({ type: PAGE, value: 0 })
                        }} />
                    </div>
                </Col>



                <Col xl={12} lg={12} md={12} sm={12} xs={12} id='events' style={{ display: page === 1 || window.screen.width > 990 ? 'block' : 'none', backgroundColor: '#e6e8eb', position: 'sticky', top: 0, zIndex: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 3 }}>
                        <div style={{ display: select === false ? 'block' : 'none' }}>
                            <div id='eventsDiv' style={{ display: 'flex', marginLeft: page === 1 ? '0px' : '10px', marginTop: '20px', marginBottom: '20px' }}>

                                <div className='eventsDiv1'>
                                    <div style={{ position: 'relative' }}>
                                        <button className='eventbtn' id='cameras' onClick={() => {
                                            setselect_cameras(selected_cameras)
                                            // setselectedcameras(selected_cameras)
                                            setclickbtn3(true)
                                            handleOpen1()

                                        }} style={{ display: 'flex' }}> <CameraAltOutlinedIcon style={{ marginRight: '10px' }} />Cameras <div style={{ backgroundColor: '#e32747', padding: '3px', borderRadius: '50%', height: '25px', width: '25px', marginLeft: '10px' }}><p style={{ color: 'white' }}>{selected_cameras.length}</p></div> <ArrowDropDownIcon style={{ marginLeft: '0px' }} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>

                {
                    res == true ?
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <CircularProgress size={'30px'} style={{ color: 'blue' }} />
                            <p>Please Wait...</p>
                        </div>
                        : res == 'no_data' ?
                            <div style={{ width: '100%' }}>
                                <hr></hr>
                                <h5 style={{ color: '#e32747', fontWeight: 'bold', margin: 0, textAlign: 'center', }}>No camera's!</h5>
                            </div>
                            : selected_cameras.length == 0 ?
                                <div style={{ width: '100%' }}>
                                    <hr></hr>
                                    <h5 style={{ color: '#e32747', fontWeight: 'bold', margin: 0, textAlign: 'center', }}>No camera's have been selected!</h5>
                                </div>
                                :
                                selected_cameras.map((val, p) => (
                                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <div>
                                            <div style={{ backgroundColor: '#181828', padding: '10px', display: 'flex', alignItems: 'flex-end' }}>
                                                <button style={{ backgroundColor: '#e22747', color: 'white', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginRight: '5px' }} onClick={() => {
                                                    let newdata = []
                                                    over_image_array.map((arr, v) => {
                                                        if (val._id == arr.id) {
                                                            console.log(arr.img_arr)
                                                            if (arr.img_arr.length == 0) {
                                                                newdata.push({ ...arr, img_arr: [...arr.img_arr, { name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: true }] })

                                                                mask_range_name[p] = 'None'
                                                                direction_name[p] = 'LeftToRight'
                                                                in_out[p] = 'In'
                                                                from_time[p] = '00:00'
                                                                to_time[p] = '23:59'
                                                                type[p] = 'Intrution'
                                                                class_name[p] = 'People'
                                                                threshold[p] = 0
                                                                // setmask_range_name(data[index].img_arr[idx].name)

                                                                geteditimageuri(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, 'NONE', 'NONE', 'second', p)
                                                            } else {
                                                                newdata.push({ ...arr, img_arr: [...arr.img_arr, { name: 'None', direction: 'LeftToRight', sequence: 'In', id: Date.now(), url: 'NONE', from_time: '00:00', to_time: '23:59', type: 'Intrution', class: 'People', threshold: 0, flag: false }] })
                                                            }
                                                        } else {
                                                            newdata.push(arr)
                                                        }
                                                    })
                                                    setover_image_array(newdata)
                                                }}>Add Range</button>

                                                <div style={{ marginRight: '5px' }}>
                                                    <p style={{ color: 'white', marginBottom: '5px' }}>Range Name</p>
                                                    <input id={`input${p}`} type='text' placeholder='Name' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '5px', fontSize: '14px' }} onChange={(e) => {
                                                        let data = over_image_array
                                                        let newdata = []
                                                        data.map((da, i) => {
                                                            if (da.id == val._id) {
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
                                                        mask_range_name[p] = e.target.value
                                                        setover_image_array(newdata)
                                                        // setmask_range_name(e.target.value)

                                                    }} value={mask_range_name[p]}></input>
                                                </div>

                                                {
                                                    analytic_type == 'masking' ?
                                                        <>
                                                            <div style={{ marginRight: '5px' }}>
                                                                <p style={{ color: 'white', marginBottom: '5px' }}>From Time</p>
                                                                <input id={`from${p}`} type='time' placeholder='Name' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '5px', fontSize: '14px' }} onChange={(e) => {
                                                                    let data = over_image_array
                                                                    let newdata = []
                                                                    data.map((da, i) => {
                                                                        if (da.id == val._id) {
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
                                                                    from_time[p] = e.target.value
                                                                    setover_image_array(newdata)
                                                                    // setmask_range_name(e.target.value)

                                                                }} value={from_time[p]}></input>
                                                            </div>

                                                            <div style={{ marginRight: '5px' }}>
                                                                <p style={{ color: 'white', marginBottom: '5px' }}>To Time</p>
                                                                <input id={`from${p}`} type='time' placeholder='Name' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '5px', fontSize: '14px' }} onChange={(e) => {
                                                                    let data = over_image_array
                                                                    let newdata = []
                                                                    data.map((da, i) => {
                                                                        if (da.id == val._id) {
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
                                                                    to_time[p] = e.target.value
                                                                    setover_image_array(newdata)
                                                                    // setmask_range_name(e.target.value)

                                                                }} value={to_time[p]}></input>
                                                            </div>

                                                            <div style={{ marginRight: '5px' }}>
                                                                <p style={{ color: 'white', marginBottom: '5px' }}>Type</p>
                                                                <div>
                                                                    <p type='text' style={{ backgroundColor: '#e6e8eb', padding: '10px', borderRadius: '5px', border: '1px solid gray', margin: 0, display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'black' }} onClick={() => {
                                                                        if (document.getElementById(`type${p}`).style.display == 'block') {
                                                                            document.getElementById(`type${p}`).style.display = 'none'
                                                                        } else {
                                                                            document.getElementById(`type${p}`).style.display = 'block'
                                                                        }

                                                                    }}>{type[p]}<span><ArrowDropDownIcon />
                                                                        </span></p>
                                                                </div>


                                                                <div
                                                                    id={`type${p}`}
                                                                    style={{ backgroundColor: '#e6e8eb', padding: '15px', borderRadius: '5px', position: 'absolute', zIndex: 2, maxHeight: '150px', overflowY: 'scroll', display: 'none' }}>

                                                                    <div  >
                                                                        <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                            let data = over_image_array
                                                                            let newdata = []
                                                                            data.map((da, i) => {
                                                                                if (da.id == val._id) {
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
                                                                            type[p] = 'Intrution'
                                                                            document.getElementById(`type${p}`).style.display = 'none'
                                                                            setover_image_array(newdata)
                                                                            // setdirection_flag(!direction_flag)
                                                                            // setdirection_name('LeftToRight')
                                                                        }}>Intrution</p>
                                                                        <hr></hr>
                                                                        <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                            let data = over_image_array
                                                                            let newdata = []
                                                                            data.map((da, i) => {
                                                                                if (da.id == val._id) {
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
                                                                            type[p] = 'Loitering'
                                                                            document.getElementById(`type${p}`).style.display = 'none'
                                                                            setover_image_array(newdata)
                                                                            // setdirection_flag(!direction_flag)
                                                                            // setdirection_name('RightToLeft')
                                                                        }}>Loitering</p>
                                                                        <hr></hr>
                                                                        <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                            let data = over_image_array
                                                                            let newdata = []
                                                                            data.map((da, i) => {
                                                                                if (da.id == val._id) {
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
                                                                            type[p] = 'Crowd'
                                                                            document.getElementById(`type${p}`).style.display = 'none'
                                                                            setover_image_array(newdata)
                                                                            // setdirection_flag(!direction_flag)
                                                                            // setdirection_name('RightToLeft')
                                                                        }}>Crowd</p>
                                                                        <hr></hr>
                                                                        <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                            let data = over_image_array
                                                                            let newdata = []
                                                                            data.map((da, i) => {
                                                                                if (da.id == val._id) {
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
                                                                            type[p] = 'Fire'
                                                                            document.getElementById(`type${p}`).style.display = 'none'
                                                                            setover_image_array(newdata)
                                                                            // setdirection_flag(!direction_flag)
                                                                            // setdirection_name('RightToLeft')
                                                                        }}>Fire</p>
                                                                        <hr></hr>
                                                                        <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                            let data = over_image_array
                                                                            let newdata = []
                                                                            data.map((da, i) => {
                                                                                if (da.id == val._id) {
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
                                                                            type[p] = 'Smoke'
                                                                            document.getElementById(`type${p}`).style.display = 'none'
                                                                            setover_image_array(newdata)
                                                                            // setdirection_flag(!direction_flag)
                                                                            // setdirection_name('TopToBottom')
                                                                        }}>Smoke</p>
                                                                        <hr></hr>
                                                                        <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                            let data = over_image_array
                                                                            let newdata = []
                                                                            data.map((da, i) => {
                                                                                if (da.id == val._id) {
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
                                                                            type[p] = 'PPE'
                                                                            document.getElementById(`type${p}`).style.display = 'none'
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
                                                                        <input id={`threshold${p}`} type='number' placeholder='Number' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '5px', fontSize: '14px' }} onChange={(e) => {
                                                                            let data = over_image_array
                                                                            let newdata = []
                                                                            data.map((da, i) => {
                                                                                if (da.id == val._id) {
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
                                                                            threshold[p] = e.target.value
                                                                            setover_image_array(newdata)
                                                                            // setmask_range_name(e.target.value)

                                                                        }} value={threshold[p]}></input>
                                                                    </div>
                                                                    : ''

                                                            }

                                                            {
                                                                type == 'Loitering' || type == 'Intrution' ?
                                                                    <div style={{ marginRight: '5px' }}>
                                                                        <p style={{ color: 'white', marginBottom: '5px' }}>Class</p>
                                                                        <div>
                                                                            <p type='text' style={{ backgroundColor: '#e6e8eb', padding: '10px', borderRadius: '5px', border: '1px solid gray', margin: 0, display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'black' }} onClick={() => {
                                                                                if (document.getElementById(`class${p}`).style.display == 'block') {
                                                                                    document.getElementById(`class${p}`).style.display = 'none'
                                                                                } else {
                                                                                    document.getElementById(`class${p}`).style.display = 'block'
                                                                                }

                                                                            }}>{class_name[p]}<span><ArrowDropDownIcon />
                                                                                </span></p>
                                                                        </div>
                                                                        <div
                                                                            id={`class${p}`}
                                                                            style={{ backgroundColor: '#e6e8eb', padding: '15px', borderRadius: '5px', position: 'absolute', zIndex: 2, maxHeight: '150px', overflowY: 'scroll', display: 'none' }}>

                                                                            <div  >
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let data = over_image_array
                                                                                    let newdata = []
                                                                                    data.map((da, i) => {
                                                                                        if (da.id == val._id) {
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
                                                                                    class_name[p] = 'People'
                                                                                    document.getElementById(`class${p}`).style.display = 'none'
                                                                                    setover_image_array(newdata)
                                                                                    // setdirection_flag(!direction_flag)
                                                                                    // setdirection_name('LeftToRight')
                                                                                }}>People</p>
                                                                                <hr></hr>
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let data = over_image_array
                                                                                    let newdata = []
                                                                                    data.map((da, i) => {
                                                                                        if (da.id == val._id) {
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
                                                                                    class_name[p] = 'Vehicle'
                                                                                    document.getElementById(`class${p}`).style.display = 'none'
                                                                                    setover_image_array(newdata)
                                                                                    // setdirection_flag(!direction_flag)
                                                                                    // setdirection_name('LeftToRight')
                                                                                }}>Vehicle</p>
                                                                                <hr></hr>
                                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                    let data = over_image_array
                                                                                    let newdata = []
                                                                                    data.map((da, i) => {
                                                                                        if (da.id == val._id) {
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
                                                                                    class_name[p] = 'Vehicle'
                                                                                    document.getElementById(`class${p}`).style.display = 'none'
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
                                                    analytic_type != 'masking' ?

                                                        <div style={{ marginRight: '5px' }}>
                                                            <p style={{ color: 'white', marginBottom: '5px' }}>Range</p>
                                                            <div>
                                                                <p type='text' style={{ backgroundColor: '#e6e8eb', padding: '10px', borderRadius: '5px', border: '1px solid gray', margin: 0, display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'black' }} onClick={() => {
                                                                    if (document.getElementById(`direction${p}`).style.display == 'block') {
                                                                        document.getElementById(`direction${p}`).style.display = 'none'
                                                                    } else {
                                                                        document.getElementById(`direction${p}`).style.display = 'block'
                                                                    }

                                                                }}>{direction_name[p]}<span><ArrowDropDownIcon />
                                                                    </span></p>
                                                            </div>


                                                            <div
                                                                id={`direction${p}`}
                                                                style={{ backgroundColor: '#e6e8eb', padding: '15px', borderRadius: '5px', position: 'absolute', zIndex: 2, maxHeight: '150px', overflowY: 'scroll', display: 'none' }}>

                                                                <div  >
                                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                        let data = over_image_array
                                                                        let newdata = []
                                                                        data.map((da, i) => {
                                                                            if (da.id == val._id) {
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
                                                                        direction_name[p] = 'LeftToRight'
                                                                        document.getElementById(`direction${p}`).style.display = 'none'
                                                                        setover_image_array(newdata)
                                                                        // setdirection_flag(!direction_flag)
                                                                        // setdirection_name('LeftToRight')
                                                                    }}>LeftToRight</p>
                                                                    <hr></hr>
                                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                        let data = over_image_array
                                                                        let newdata = []
                                                                        data.map((da, i) => {
                                                                            if (da.id == val._id) {
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
                                                                        direction_name[p] = 'RightToLeft'
                                                                        document.getElementById(`direction${p}`).style.display = 'none'
                                                                        setover_image_array(newdata)
                                                                        // setdirection_flag(!direction_flag)
                                                                        // setdirection_name('RightToLeft')
                                                                    }}>RightToLeft</p>
                                                                    <hr></hr>
                                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                        let data = over_image_array
                                                                        let newdata = []
                                                                        data.map((da, i) => {
                                                                            if (da.id == val._id) {
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
                                                                        direction_name[p] = 'TopToBottom'
                                                                        document.getElementById(`direction${p}`).style.display = 'none'
                                                                        setover_image_array(newdata)
                                                                        // setdirection_flag(!direction_flag)
                                                                        // setdirection_name('TopToBottom')
                                                                    }}>TopToBottom</p>
                                                                    <hr></hr>
                                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                        let data = over_image_array
                                                                        let newdata = []
                                                                        data.map((da, i) => {
                                                                            if (da.id == val._id) {
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
                                                                        direction_name[p] = 'BottomToTop'
                                                                        document.getElementById(`direction${p}`).style.display = 'none'
                                                                        setover_image_array(newdata)
                                                                        // setdirection_flag(!direction_flag)
                                                                        // setdirection_name('BottomToTop')
                                                                    }}>BottomToTop</p>
                                                                </div>

                                                            </div>

                                                        </div>
                                                        : ''
                                                }

                                                {
                                                    analytic_type == 'vehicle_masking' ?

                                                        <div style={{ marginRight: '5px' }}>
                                                            <p style={{ color: 'white', marginBottom: '5px' }}>Sequence</p>
                                                            <div style={{ position: 'relative' }}>
                                                                <p type='text' style={{ backgroundColor: '#e6e8eb', padding: '10px', borderRadius: '5px', border: '1px solid gray', margin: 0, marginRight: '20px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'black' }} onClick={() => {
                                                                    if (document.getElementById(`in_out${p}`).style.display == 'block') {
                                                                        document.getElementById(`in_out${p}`).style.display = 'none'
                                                                    } else {
                                                                        document.getElementById(`in_out${p}`).style.display = 'block    '
                                                                    }


                                                                }}>{in_out[p]}<span>
                                                                        <ArrowDropDownIcon />
                                                                    </span></p>
                                                            </div>


                                                            <div
                                                                id={`in_out${p}`}
                                                                style={{ backgroundColor: '#e6e8eb', padding: '15px', borderRadius: '5px', position: 'absolute', zIndex: 2, maxHeight: '150px', display: 'none' }}>

                                                                <div  >
                                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                        let data = over_image_array
                                                                        let newdata = []
                                                                        data.map((da, i) => {
                                                                            if (da.id == val._id) {
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
                                                                        in_out[p] = 'In'
                                                                        document.getElementById(`in_out${p}`).style.display = 'none'
                                                                        setover_image_array(newdata)
                                                                        // setin_out_flag(!in_out_flag)
                                                                        // setin_out('In')
                                                                    }}>In</p>
                                                                    <hr></hr>
                                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                        let data = over_image_array
                                                                        let newdata = []
                                                                        data.map((da, i) => {
                                                                            if (da.id == val._id) {
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
                                                                        in_out[p] = 'Out'
                                                                        document.getElementById(`in_out${p}`).style.display = 'none'
                                                                        setover_image_array(newdata)
                                                                        // setin_out_flag(!in_out_flag)
                                                                        // setin_out('Out')
                                                                    }}>Out</p>
                                                                    <hr></hr>
                                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                        let data = over_image_array
                                                                        let newdata = []
                                                                        data.map((da, i) => {
                                                                            if (da.id == val._id) {
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
                                                                        in_out[p] = 'In & Out'
                                                                        document.getElementById(`in_out${p}`).style.display = 'none'
                                                                        setover_image_array(newdata)
                                                                        // setin_out_flag(!in_out_flag)
                                                                        // setin_out('In & Out')
                                                                    }}>In & Out</p>
                                                                </div>

                                                            </div>

                                                        </div>
                                                        : ''
                                                }

                                                <button style={{ backgroundColor: '#e22747', color: 'white', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginRight: '5px' }} onClick={() => {
                                                    setsave_trigger(save_trigger + 1)
                                                }}>Save</button>

                                            </div>

                                            <div style={{ padding: '10px', backgroundColor: '#181828' }}>
                                                {over_image_array.map((parentItem, index) => (
                                                    val._id == parentItem.id ?
                                                        <div style={{ display: 'flex', }}>
                                                            {parentItem.img_arr.map((childItem, idx) => (
                                                                <div style={{ backgroundColor: parentItem.img_arr[idx].flag ? '#e32747' : 'transparent', color: parentItem.img_arr[idx].flag ? 'white' : '#7f7f7e', padding: '5px', borderRadius: '20px', border: '1px solid gray', marginRight: '10px', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                                    <p style={{ marginBottom: 0, marginRight: '5px' }} onClick={() => {
                                                                        let data = over_image_array
                                                                        for (let index1 = 0; index1 < data[index].img_arr.length; index1++) {
                                                                            data[index].img_arr[index1].flag = false
                                                                        }
                                                                        data[index].img_arr[idx].flag = true

                                                                        mask_range_name[p] = data[index].img_arr[idx].name
                                                                        direction_name[p] = data[index].img_arr[idx].direction
                                                                        in_out[p] = data[index].img_arr[idx].sequence
                                                                        from_time[p] = data[index].img_arr[idx].from_time
                                                                        to_time[p] = data[index].img_arr[idx].to_time
                                                                        type[p] = data[index].img_arr[idx].type
                                                                        class_name[p] = data[index].img_arr[idx].class
                                                                        threshold[p] = data[index].img_arr[idx].threshold
                                                                        // setmask_range_name(data[index].img_arr[idx].name)

                                                                        console.log(data[index].img_arr[idx].url);
                                                                        console.log(over_image_array);
                                                                        geteditimageuri(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, data[index].img_arr[idx].url, 'NONE', 'second', p)
                                                                        setover_image_array(data)
                                                                        setdummey(!dummey)
                                                                    }}> {childItem.name}</p>

                                                                    <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {

                                                                        let newdata = []
                                                                        over_image_array.map((arr, v) => {
                                                                            if (val._id == arr.id) {
                                                                                let newone = []
                                                                                arr.img_arr.map((induval) => {
                                                                                    if (induval.id != childItem.id) {
                                                                                        newone.push(induval)
                                                                                    } else {

                                                                                    }
                                                                                })

                                                                                console.log(newone)
                                                                                newdata.push({ ...arr, img_arr: newone })

                                                                                if (newone.length != 0) {
                                                                                    newone[0].flag = true
                                                                                    mask_range_name[p] = newone[0].name
                                                                                    direction_name[p] = newone[0].direction
                                                                                    in_out[p] = newone[0].sequence
                                                                                    from_time[p] = newone[0].from_time
                                                                                    to_time[p] = newone[0].to_time
                                                                                    type[p] = newone[0].type
                                                                                    class_name[p] = newone[0].class
                                                                                    threshold[p] = newone[0].threshold

                                                                                    geteditimageuri(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, newone[0].url, 'NONE', 'second', p)
                                                                                }
                                                                                
                                                                            } else {
                                                                                newdata.push(arr)
                                                                            }
                                                                        })

                                                                        console.log(newdata);
                                                                        console.log(over_image_array);
                                                                        setover_image_array(newdata)
                                                                    }} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                        : ''
                                                ))}
                                            </div>
                                            {
                                                over_image_array[p].img_arr.length == 0 ?
                                                    <div style={{ border: '1px solid black' }}>
                                                        <div style={{ textAlign: 'center', width: '100%', marginTop: '10px' }}>
                                                            <p style={{ color: '#181828' }}>A snapshot does not exist. </p>
                                                            <p style={{ color: '#181828', fontSize: '12px', margin: '0px' }}>A snapshot will be taken next time camera is trigerred.</p>
                                                            <p style={{ color: '#181828', fontSize: '12px', margin: '0px' }}>Pleace come back later.</p>
                                                            <NoPhotographyIcon style={{ fontSize: '70px', color: '#a8a4a4' }} />
                                                        </div>
                                                    </div>
                                                    :
                                                    <Mask image_edited={edit_image[p]} data1={val} camera_name={val.camera_gereral_name} mask1={camera_list_image[p]} p={p} type='multi_mask' analytic_type={analytic_type} over_image_array={over_image_array} fun_over_image_array={fun_over_image_array} second_flag={second_flag} save_trigger={save_trigger}/>
                                            }
                                        </div>
                                    </Col>
                                ))
                }

            </Row >



        </div >
    )
}
