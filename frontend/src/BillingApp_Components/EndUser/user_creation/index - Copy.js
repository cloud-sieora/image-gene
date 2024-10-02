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
import Modal from '@mui/material/Modal';
import '../style.css'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import * as api from '../../Configurations/Api_Details'
import axios from 'axios'
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { PAGE, STARTDATE, STARTTIME, ENDDATE, ENDTIME, APPLY, SELECT, SELECTED_CAMERAS } from '../../../store/actions'
import { useDispatch, useSelector } from 'react-redux';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import AWS from "aws-sdk";

import { CreateBucketCommand, S3Client, GetObjectCommand, ListBucketsCommand, DeleteBucketCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

let colflag = true
let camera_list_value = []
export default function Device_list() {
    const userData = JSON.parse(localStorage.getItem("userData"))
    const { page, startdate, starttime, enddate, endtime, apply, select, selected_cameras } = useSelector((state) => state)
    let data = []
    const dispatch = useDispatch()
    const [open, setopen] = useState(false)
    const [user_id, setuser_id] = useState('')
    const [user_name, setuser_name] = useState('')
    const [password, setpassword] = useState('')
    const [mobile_number, setmobile_number] = useState('')
    const [mail_id, setmail_id] = useState('')
    const [active, setactive] = useState(1)
    const [gender, setgender] = useState('Male')
    const [user_type, setuser_type] = useState(userData.position_type == 'Client' ? 'Admin' : userData.position_type == 'Client Admin' ? 'Site Admin' : '')
    const [operation_type, setoperation_type] = useState(['Read'])
    const [operation_list, setoperation_list] = useState(['Read', 'Create', 'Edit', 'Delete', 'All'])
    const [flag, setflag] = useState(false)
    const [user_list, setuser_list] = useState([])
    const [save_type, setsave_type] = useState('new_data')
    const [key_value, setkey_value] = useState(0)
    const [group_list, setgroup_list] = useState([])
    const [site, setsite] = useState([])
    const [alert_text, setalert_text] = useState('')
    const handleClose = () => setopen(false)
    const [alert_box, setalert_box] = useState(false)
    const [selectedcameras, setselectedcameras] = useState([]);
    const [open1, setOpen1] = React.useState(false);
    const [toggle, settoggle] = useState(false)
    const [online_status, setonline_status] = useState(false)
    const [camera_tag, setcamera_tag] = useState(false)
    const [camera_group, setcamera_group] = useState(false)
    const [camera_box, setcamera_box] = useState(false)
    const [cameras, setcameras] = useState([]);
    const [cameras1, setcameras1] = useState([]);
    const [cameras_view, setcameras_view] = useState([]);
    const [cameras_view1, setcameras_view1] = useState([]);
    const [cameras_view2, setcameras_view2] = useState([]);
    const [res, setres] = useState(true)
    const [get_group_full_data, setget_group_full_data] = useState([])
    const [get_group_full_data_sort, setget_group_full_data_sort] = useState([])
    const [get_group_full_data_sort1, setget_group_full_data_sort1] = useState([])
    const [get_tag_full_data, setget_tag_full_data] = useState([])
    const [get_tag_full_data_sort, setget_tag_full_data_sort] = useState([])
    const [get_tag_full_data_sort1, setget_tag_full_data_sort1] = useState([])
    const [camera_checkbox, setcamera_checkbox] = useState([])
    const [tag_checkbox, settag_checkbox] = useState([])
    const [full_camera_search, setfull_camera_search] = useState('')
    let [finaldate, setfinaldate] = useState('')
    const [colcount, setcolcount] = useState(40)
    const [clickbtn2, setclickbtn2] = useState(false)
    let [finaldata, setfinaldata] = useState([])
    const [group_checkbox, setgroup_checkbox] = useState([])
    const [filter, setfilter] = useState(false)
    const [camera_search, setcamera_search] = useState('')
    const [tag_search, settag_search] = useState('')
    const [group_search, setgroup_search] = useState('')
    const [camera_ids, setcamera_ids] = useState([])
    const [empty_flag, setempty_flag] = useState(false)
    const alertClose = () => setalert_box(false)

    const [duplicateData, setDuplicateData] = useState([])

    useEffect(() => {

        const getStocksData = {
            url: userData.position_type == 'Client' ? api.LIST_USER_DATA_CLIENT_ID : userData.position_type == 'Client Admin' ? api.LIST_USER_DATA_CLIENT_ADMIN_ID : userData.position_type == 'Site Admin' ? api.LIST_USER_DATA_SITE_ADMIN_ID : api.LIST_USER_DATA_USER_ID,
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
        console.log(getStocksData);
        axios(getStocksData)
            .then(response => {
                console.log(response.data);
                setuser_list(response.data)
                setDuplicateData(response.data)

            })
            .catch(function (e) {

                console.log(e.message)
                if (e.message === 'Network Error') {
                    alert("No Internet Found. Please check your internet connection")
                }
                else {
                    alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                }

            });



    }, [flag])

    useEffect(() => {

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

                    "user_id": (JSON.parse(localStorage.getItem("userData")))._id

                })
            }
            axios(getStocksData)
                .then(response => {
                    console.log(response.data);
                    setgroup_list(response.data)
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

            // let count = 0
            // let data = []

            // userData.site_id.map((val, i) => {
            //     const getStocksData = {
            //         url: api.SITE_CREATION + val.id,
            //         method: 'get',
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //     }
            //     axios(getStocksData)
            //         .then(response => {
            //             console.log(response.data);
            //             data.push(response.data)
            //             count = count + 1
            //             if (count == i) {
            //                 setgroup_list(data)
            //             }
            //         })
            //         .catch(function (e) {
            //             if (e.message === 'Network Error') {
            //                 alert("No Internet Found. Please check your internet connection")
            //             }
            //             else {
            //                 alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
            //             }

            //         });
            // })
        }
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
                    setcameras(response.data)
                    setcameras1(response.data)
                    setcameras_view(response.data)
                    setcameras_view1(response.data)
                    setcameras_view2(response.data)
                    setselectedcameras([])
                    dispatch({ type: SELECTED_CAMERAS, value: [] })

                    if (response.data.length == 0) {
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
                        data.push(response.data)
                        if (count == (JSON.parse(localStorage.getItem("userData"))).site_id.length) {
                            setcameras(data1)
                            setcameras1(data1)
                            setcameras_view(data1)
                            setcameras_view1(data1)
                            setcameras_view2(data1)
                            setselectedcameras([])
                            dispatch({ type: SELECTED_CAMERAS, value: [] })
                            if (data1.length == 0) {
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
                    setcameras(response.data)
                    setcameras1(response.data)
                    setcameras_view(response.data)
                    setcameras_view1(response.data)
                    setcameras_view2(response.data)
                    setselectedcameras([])
                    dispatch({ type: SELECTED_CAMERAS, value: [] })

                    if (response.data.length == 0) {
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

    useEffect(() => {
        if (open1) {
            cameras_view.map((val, i) => {
                getimageurifunction(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, val, i)
            })
        }
    }, [open1])

    const handleOpen1 = () => setOpen1(true);
    const handleClose1 = () => {
        setOpen1(false)
        setcamera_box(false)
        setcamera_tag(false)
        setcamera_group(false)
        setonline_status(false)

    };

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
            setcameras_view(new_camera_list)
            setcameras_view2(new_camera_list)
            setselectedcameras(new_camera_list)
            dispatch({ type: SELECTED_CAMERAS, value: new_camera_list })
            setfinaldata([])

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
            setcameras_view(new_camera_list)
            setcameras_view2(new_camera_list)
            setselectedcameras(new_camera_list)
            dispatch({ type: SELECTED_CAMERAS, value: new_camera_list })
            setfinaldata([])

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
                let roughString = ''
                for (let l = 0; l < data[i].operation_type.length; l++) {
                    roughString = roughString + data[i].operation_type[l]
                    roughString = roughString + ','
                }
                console.log('rough string', roughString)
                let username = type == 'search_user' ? `${data[i].mail}${data[i].client_id}${data[i].User_name}${data[i].mobile_number}${data[i].position_type === 'Client Admin' ? 'Admin' : "User"}${data[i].Active === 1 ? 'Active' : 'Off'}${roughString}`
                    : type == 'camera_search1' ? data[i].camera_gereral_name : type == 'tag_search' ? data[i].tag_name : type == 'group_search' ? data[i].group_name : ''
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
            if (type == 'search_user') {
                setuser_list(arr)
            } else if (type == 'camera_search1') {
                setcameras(arr)
            } else if (type == 'tag_search') {
                setget_tag_full_data_sort(arr)
            } else if (type == 'group_search') {
                setget_group_full_data_sort(arr)
            }

        } else {
            if (type == 'camera_search') {
                setuser_list([])
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

        const image_command = new GetObjectCommand({
            Bucket: Bucket,
            Key: data.image_uri,
        });

        const image_uri = await getSignedUrl(s3Client, image_command)
        document.getElementById(`dash_image${i}`).src = image_uri
        return image_uri
    }

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '5px' }}>

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
                onClose={() => {
                    handleClose1()
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
                                                <CloseIcon style={{ color: 'black' }} onClick={() => handleClose1()} />
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
                                                    <div style={{ position: 'relative' }}>
                                                        <button className='eventbtn' id='cameras' onClick={() => {
                                                            setcamera_box(!camera_box)
                                                            setcamera_tag(false)
                                                            setcamera_group(false)
                                                            setonline_status(false)


                                                        }} style={{ display: 'flex', backgroundColor: camera_box ? '#e22747' : '#e6e8eb', color: camera_box ? 'white' : 'black' }}> <AccessTimeIcon style={{ marginRight: '10px' }} />Cameras </button>

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
                                                                                setget_tag_full_data_sort(get_tag_full_data)
                                                                                setget_tag_full_data_sort1(get_tag_full_data)
                                                                                setget_group_full_data_sort(get_group_full_data)
                                                                                setget_group_full_data_sort1(get_group_full_data)
                                                                                setcameras_view(cameras)
                                                                                setcameras_view2(cameras)
                                                                                setselectedcameras(cameras)
                                                                                dispatch({ type: SELECTED_CAMERAS, value: cameras })
                                                                                setfinaldata([])

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

                                                                                                setcamera_checkbox(camcnk)
                                                                                                setcameras_view(new_camera_list)
                                                                                                setcameras_view2(new_camera_list)
                                                                                                setselectedcameras(new_camera_list)
                                                                                                dispatch({ type: SELECTED_CAMERAS, value: new_camera_list })
                                                                                                setfinaldata([])

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

                                                                                                            settag_checkbox([...tag_checkbox, val._id])
                                                                                                            setcameras_view(new_camera_list)
                                                                                                            setcameras_view2(new_camera_list)
                                                                                                            setselectedcameras(new_camera_list)
                                                                                                            dispatch({ type: SELECTED_CAMERAS, value: new_camera_list })
                                                                                                            setfinaldata([])

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

                                                                                                            settag_checkbox([...group_checkbox, val._id])
                                                                                                            setcameras_view(new_camera_list)
                                                                                                            setcameras_view2(new_camera_list)
                                                                                                            setselectedcameras(new_camera_list)
                                                                                                            dispatch({ type: SELECTED_CAMERAS, value: new_camera_list })
                                                                                                            setfinaldata([])

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
                                                                    let cam = []
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
                                                                    setcamera_ids([])
                                                                    dispatch({ type: SELECTED_CAMERAS, value: [] })
                                                                }
                                                            }}>
                                                                <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                                            </div>
                                                        </div>

                                                    </th>
                                                    <th style={{ padding: '15px' }}>Cameras</th>
                                                    <th style={{ padding: '15px' }}>Cameras name</th>
                                                    <th style={{ padding: '15px' }}>Tags</th>
                                                    <th style={{ padding: '15px' }}>Cloud storage duration</th>
                                                </tr>
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


                                                        if ((camera_ids[i] == undefined || camera_ids[i].id !== val._id) && open1) {
                                                            camera_ids[i] = { camera_name: val.camera_gereral_name, type: 'empty', id: val._id }
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
                                                                                camera_ids[i].type = 'All'
                                                                                setselectedcameras((old) => {
                                                                                    // dispatch({ type: SELECTED_CAMERAS, value: [...old, val] })
                                                                                    return [...old, val]
                                                                                })
                                                                            } else {

                                                                                selectedcameras.map((data, i) => {
                                                                                    if (val._id !== data._id) {
                                                                                        arr.push(data)

                                                                                    }
                                                                                })

                                                                                camera_ids[i].type = 'empty'
                                                                                setselectedcameras(arr)
                                                                                dispatch({ type: SELECTED_CAMERAS, value: arr })
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
                                                                <td style={{ padding: '15px' }}><img width={150} height={100} id={`dash_image${i}`} src={''}></img></td>
                                                                {
                                                                    chk == true ?
                                                                        <td style={{ padding: '15px' }}>
                                                                            <div style={{ display: 'flex' }}>
                                                                                <input type='checkbox' id={`camera_access_1${i}`} checked={camera_ids[i].type != undefined && camera_ids[i].type == 'Read' ? true : false} name='camera_access_type' onClick={(e) => {
                                                                                    let chk1 = document.getElementById(`camera_access_1${i}`)
                                                                                    let chk2 = document.getElementById(`camera_access_2${i}`)
                                                                                    let chk3 = document.getElementById(`camera_access_3${i}`)

                                                                                    chk2.checked = false
                                                                                    chk3.checked = false


                                                                                    if (e.target.checked == true) {
                                                                                        camera_ids[i].type = 'Read'
                                                                                        setempty_flag(!empty_flag)
                                                                                    }
                                                                                }}></input>
                                                                                <p style={{ margin: 0, marginLeft: '5px' }}>Read</p>
                                                                            </div>
                                                                        </td>
                                                                        :
                                                                        <td style={{ padding: '15px' }}>{val.camera_gereral_name}</td>
                                                                }
                                                                {
                                                                    chk == true ?
                                                                        <td style={{ padding: '15px' }}>
                                                                            <div style={{ display: 'flex' }}>
                                                                                <input type='checkbox' id={`camera_access_2${i}`} checked={camera_ids[i].type != undefined && camera_ids[i].type == 'Edit' ? true : false} name='camera_access_type' onClick={(e) => {
                                                                                    let chk3 = document.getElementById(`camera_access_3${i}`)
                                                                                    let chk1 = document.getElementById(`camera_access_1${i}`)

                                                                                    chk3.checked = false
                                                                                    chk1.checked = false

                                                                                    if (e.target.checked == true) {
                                                                                        camera_ids[i].type = 'Edit'
                                                                                        setempty_flag(!empty_flag)
                                                                                    }
                                                                                }}></input>
                                                                                <p style={{ margin: 0, marginLeft: '5px' }}>Edit</p>
                                                                            </div>
                                                                        </td>
                                                                        :
                                                                        <td style={{ padding: '15px' }}>{val.camera_gereral_name}</td>
                                                                }
                                                                {
                                                                    chk == true ?
                                                                        <td style={{ padding: '15px' }}>
                                                                            <div style={{ display: 'flex' }}>
                                                                                <input type='checkbox' id={`camera_access_3${i}`} checked={camera_ids[i].type != undefined && camera_ids[i].type == 'All' ? true : false} name='camera_access_type' onClick={(e) => {
                                                                                    let chk2 = document.getElementById(`camera_access_2${i}`)
                                                                                    let chk1 = document.getElementById(`camera_access_1${i}`)

                                                                                    chk2.checked = false
                                                                                    chk1.checked = false

                                                                                    if (e.target.checked == true) {
                                                                                        camera_ids[i].type = 'All'
                                                                                        setempty_flag(!empty_flag)
                                                                                    }
                                                                                }}></input>
                                                                                <p style={{ margin: 0, marginLeft: '5px' }}>All</p>
                                                                            </div>
                                                                        </td>
                                                                        :
                                                                        <td style={{ padding: '15px' }}>360 days</td>
                                                                }
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

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ marginLeft: 'auto', marginRight: 'auto', height: 550, width: '50%', top: 20, }}
            >
                <div style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <div style={{ backgroundColor: '#e22747', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
                                <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>ADD USER</p>
                                <CloseIcon style={{ fontSize: '15px', }} onClick={() => {
                                    handleClose()
                                }} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ padding: '10px', alignItems: 'center', }}>
                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>Enter User Name</p>
                                <input type='text' placeholder='Enter User Name' value={user_name} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => { setuser_name(e.target.value) }}></input>
                            </div>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>Enter User Id</p>
                                <input type='text' placeholder='Enter Client Id' value={user_id} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => { setuser_id(e.target.value) }}></input>
                            </div>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>Enter Mail Id</p>
                                <input type='text' placeholder='Enter mail Id' value={mail_id} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => { setmail_id(e.target.value) }}></input>
                            </div>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>Enter Password</p>
                                <input type='text' placeholder='Enter Client Id' value={password} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => { setpassword(e.target.value) }}></input>
                            </div>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>Enter mobile_number</p>
                                <input type='text' placeholder='Enter Mobile Number' value={mobile_number} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => { setmobile_number(e.target.value) }}></input>
                            </div>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>Gender</p>
                                <div style={{ position: 'relative', zIndex: 4 }}>
                                    <p type='text' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '8px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', marginBottom: 0 }} onClick={() => {
                                        if (document.getElementById('gender').style.display !== 'none') {
                                            document.getElementById('gender').style.display = 'none'
                                        } else {
                                            document.getElementById('gender').style.display = 'block'
                                        }

                                    }}>{gender}<span><ArrowDropDownIcon /></span></p>

                                    <div id='gender' style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', }}>
                                        <p style={{ padding: '0', margin: 0, cursor: 'pointer', color: gender == 'Male' ? 'blue' : '' }} onClick={() => {
                                            document.getElementById('gender').style.display = 'none'
                                            setgender('Male')
                                        }}>Male</p>
                                        <hr></hr>
                                        <p style={{ padding: '0', margin: 0, cursor: 'pointer', color: gender == 'Female' ? 'blue' : '' }} onClick={() => {
                                            document.getElementById('gender').style.display = 'none'
                                            setgender('Female')
                                        }}>Female</p>
                                        <hr></hr>
                                        <p style={{ padding: '0', margin: 0, cursor: 'pointer', color: gender == 'Others' ? 'blue' : '' }} onClick={() => {
                                            document.getElementById('gender').style.display = 'none'
                                            setgender('Others')
                                        }}>Others</p>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>Operation Type</p>
                                <div style={{ position: 'relative', zIndex: 3 }}>
                                    <p type='text' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '8px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', overflowX: 'scroll', cursor: 'pointer', marginBottom: 0 }} onClick={() => {
                                        if (document.getElementById('operation_type').style.display !== 'none') {
                                            document.getElementById('operation_type').style.display = 'none'
                                        } else {
                                            document.getElementById('operation_type').style.display = 'block'
                                        }

                                    }}>
                                        {
                                            operation_type.length != 0 ?
                                                operation_type.map((value) => (
                                                    <span style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '5px', borderRadius: '20px', border: '1px solid gray', marginRight: '10px', display: 'flex', alignItems: 'center', fontSize: '13px' }}> {value} <CloseIcon style={{ color: 'black', fontSize: '15px', cursor: 'pointer', marginLeft: '5px' }} onClick={() => {
                                                        let data = []
                                                        for (let index = 0; index < operation_type.length; index++) {
                                                            if (value !== operation_type[index]) {
                                                                data.push(operation_type[index])
                                                            }
                                                        }
                                                        setoperation_type(data)
                                                        setoperation_list([...operation_list, value])
                                                    }}></CloseIcon></span>
                                                ))
                                                :
                                                <span style={{ color: 'grey' }}>Select Access</span>
                                        }
                                    </p>

                                    <div id='operation_type' style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', maxHeight: '100px', overflowY: 'scroll' }}>
                                        {
                                            operation_list.map((val) => (
                                                <div>
                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                        document.getElementById('operation_type').style.display = 'none'
                                                        let data = []
                                                        for (let index = 0; index < operation_list.length; index++) {
                                                            if (val !== operation_list[index]) {
                                                                data.push(operation_list[index])
                                                            }
                                                        }
                                                        setoperation_type([...operation_type, val])
                                                        setoperation_list(data)
                                                    }}>{val}</p>
                                                    <hr></hr>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>Active</p>
                                <div style={{ position: 'relative', zIndex: 2 }}>
                                    <p type='text' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '8px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', marginBottom: 0 }} onClick={() => {
                                        if (document.getElementById('active').style.display !== 'none') {
                                            document.getElementById('active').style.display = 'none'
                                        } else {
                                            document.getElementById('active').style.display = 'block'
                                        }

                                    }}>{active == 1 ? 'Active' : 'Inactive'}<span><ArrowDropDownIcon /></span></p>

                                    <div id='active' style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', }}>
                                        <p style={{ padding: '0', margin: 0, cursor: 'pointer', color: active == 1 ? 'blue' : '' }} onClick={() => {
                                            document.getElementById('active').style.display = 'none'
                                            setactive(1)
                                        }}>Active</p>
                                        <hr></hr>
                                        <p style={{ padding: '0', margin: 0, cursor: 'pointer', color: active == 0 ? 'blue' : '' }} onClick={() => {
                                            document.getElementById('active').style.display = 'none'
                                            setactive(0)
                                        }}>Inactive</p>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>User Type</p>
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <p type='text' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', marginBottom: 0 }} onClick={() => {
                                        if (document.getElementById('user_type').style.display !== 'none') {
                                            document.getElementById('user_type').style.display = 'none'
                                        } else {
                                            document.getElementById('user_type').style.display = 'block'
                                        }

                                    }}>{user_type}<span><ArrowDropDownIcon /></span></p>

                                    <div id='user_type' style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', maxHeight: '100px', overflowY: 'scroll' }}>
                                        {
                                            userData.position_type == 'Client' ?
                                                <div>
                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer', color: user_type == 'Admin' ? 'blue' : '' }} onClick={() => {
                                                        document.getElementById('user_type').style.display = 'none'
                                                        setuser_type('Admin')
                                                    }}>Admin</p>
                                                    <hr></hr>
                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer', color: user_type == 'Site Admin' ? 'blue' : '' }} onClick={() => {
                                                        document.getElementById('user_type').style.display = 'none'
                                                        setuser_type('Site Admin')
                                                    }}>Site Admin</p>
                                                    <hr></hr>
                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer', color: user_type == 'User' ? 'blue' : '' }} onClick={() => {
                                                        document.getElementById('user_type').style.display = 'none'
                                                        setuser_type('User')
                                                    }}>User</p>
                                                </div>
                                                : userData.position_type == 'Client Admin' ?
                                                    <div>
                                                        <p style={{ padding: '0', margin: 0, cursor: 'pointer', color: user_type == 'Site Admin' ? 'blue' : '' }} onClick={() => {
                                                            document.getElementById('user_type').style.display = 'none'
                                                            setuser_type('Site Admin')
                                                        }}>Site Admin</p>
                                                        <hr></hr>
                                                        <p style={{ padding: '0', margin: 0, cursor: 'pointer', color: user_type == 'User' ? 'blue' : '' }} onClick={() => {
                                                            document.getElementById('user_type').style.display = 'none'
                                                            setuser_type('User')
                                                        }}>User</p>
                                                    </div>
                                                    : userData.position_type == 'Site Admin' ?
                                                        <div>
                                                            <p style={{ padding: '0', margin: 0, cursor: 'pointer', color: user_type == 'User' ? 'blue' : '' }} onClick={() => {
                                                                document.getElementById('user_type').style.display = 'none'
                                                                setuser_type('User')
                                                            }}>User</p>
                                                        </div> : ''
                                        }
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {
                            user_type == 'Site Admin' ?

                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                    <div style={{ marginTop: '5px' }}>
                                        <p style={{ color: 'black', marginBottom: '5px' }}>Select Site</p>
                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                            <p type='text' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '8px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', overflowX: 'scroll', cursor: 'pointer', marginBottom: 0 }} onClick={() => {
                                                if (document.getElementById('select_site').style.display !== 'none') {
                                                    document.getElementById('select_site').style.display = 'none'
                                                } else {
                                                    document.getElementById('select_site').style.display = 'block'
                                                }

                                            }}> {
                                                    site.length != 0 ?
                                                        site.map((value) => (
                                                            <span style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '5px', borderRadius: '20px', border: '1px solid gray', marginRight: '10px', display: 'flex', alignItems: 'center', fontSize: '13px' }}> {value.site_name} <CloseIcon style={{ color: 'black', fontSize: '15px', cursor: 'pointer', marginLeft: '5px' }} onClick={() => {
                                                                let data = []
                                                                for (let index = 0; index < site.length; index++) {
                                                                    if (value.id !== site[index].id) {
                                                                        data.push(site[index])
                                                                    }
                                                                }
                                                                setgroup_list([...group_list, { site_name: value.site_name, _id: value.id }])
                                                                setsite(data)
                                                            }}></CloseIcon></span>
                                                        ))
                                                        :
                                                        <span style={{ color: 'grey' }}>Select Site</span>
                                                }</p>

                                            <div id='select_site' style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', maxHeight: '100px', overflowY: 'scroll' }}>
                                                {
                                                    group_list.length !== 0 ?
                                                        group_list.map((val, i) => (
                                                            <div>
                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer', }} onClick={() => {
                                                                    if (document.getElementById(`chk${i}`).style.display !== 'none') {
                                                                        document.getElementById(`chk${i}`).style.display = 'none'
                                                                    } else {
                                                                        document.getElementById(`chk${i}`).style.display = 'block'
                                                                    }
                                                                }}>{val.site_name}</p>

                                                                <div id={`chk${i}`} style={{ backgroundColor: 'white', padding: '5px', display: 'none' }}>
                                                                    <div style={{ display: 'flex', }}>
                                                                        <div style={{ display: 'flex', width: '50%' }}>
                                                                            <input className='chkbox' value='Read' type='checkbox'></input>
                                                                            <p style={{ margin: 0 }}>Read</p>
                                                                        </div>

                                                                        <div style={{ display: 'flex' }}>
                                                                            <input className='chkbox' value='Create' type='checkbox'></input>
                                                                            <p style={{ margin: 0 }}>Create</p>
                                                                        </div>
                                                                    </div>

                                                                    <div style={{ display: 'flex', marginTop: '5px' }}>
                                                                        <div style={{ display: 'flex', width: '50%' }}>
                                                                            <input className='chkbox' value='Edit' type='checkbox'></input>
                                                                            <p style={{ margin: 0 }}>Edit</p>
                                                                        </div>

                                                                        <div style={{ display: 'flex' }}>
                                                                            <input className='chkbox' value='Delete' type='checkbox'></input>
                                                                            <p style={{ margin: 0 }}>Delete</p>
                                                                        </div>
                                                                    </div>

                                                                    <div style={{ display: 'flex', marginTop: '5px' }}>
                                                                        <div style={{ display: 'flex', width: '50%' }}>
                                                                            <input className='chkbox' value='All' type='checkbox'></input>
                                                                            <p style={{ margin: 0 }}>All</p>
                                                                        </div>

                                                                        <div style={{ display: 'flex', width: '50%' }}>
                                                                            <button style={{ border: '1px solid grey', borderRadius: '5px', fontSize: '14px', backgroundColor: '#e22747', color: 'white', display: 'flex', alignItems: 'center' }} onClick={() => {
                                                                                let data = []
                                                                                group_list.map((value) => {
                                                                                    if (value._id !== val._id) {
                                                                                        data.push(value)
                                                                                    }
                                                                                })

                                                                                let chk_access_data = []
                                                                                let chkbox = document.getElementsByClassName('chkbox')
                                                                                for (let index = 0; index < chkbox.length; index++) {
                                                                                    if (chkbox[index].checked == true) {
                                                                                        chk_access_data.push(chkbox[index].value)
                                                                                    }
                                                                                    chkbox[index].checked = false
                                                                                }

                                                                                setgroup_list(data)
                                                                                setsite([...site, { site_name: val.site_name, type: chk_access_data, id: val._id }])
                                                                                document.getElementById(`chk${i}`).style.display = 'none'
                                                                                document.getElementById('select_site').style.display = 'none'
                                                                            }}><AddCircleOutlineIcon style={{ color: 'white', marginRight: '5px', fontSize: '15px' }} />Add</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <hr></hr>
                                                            </div>
                                                        ))
                                                        :
                                                        <p style={{ padding: '0', margin: 0, cursor: 'pointer', color: 'grey' }}>No Sites</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                : ''
                        }

                        {
                            user_type == 'User' ?

                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                    <div style={{ marginTop: '5px' }}>
                                        <p style={{ color: 'black', marginBottom: '5px' }}>Select Cameras</p>

                                        <div>
                                            <p type='text' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '8px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', overflowX: 'scroll', cursor: 'pointer', marginBottom: 0 }} onClick={() => {
                                                handleOpen1()

                                            }}> {
                                                    camera_ids.length != 0 ?
                                                        camera_ids.map((value) => (
                                                            value.type !== 'empty' ?
                                                                <span style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '5px', borderRadius: '20px', border: '1px solid gray', marginRight: '10px', display: 'flex', alignItems: 'center', fontSize: '13px', whiteSpace: 'nowrap' }}> {value.camera_name} <CloseIcon style={{ color: 'black', fontSize: '15px', cursor: 'pointer', marginLeft: '5px' }} onClick={() => {
                                                                    handleOpen1()
                                                                }}></CloseIcon></span>
                                                                : null
                                                        ))
                                                        :
                                                        <span style={{ color: 'grey' }}>Select Cameras</span>
                                                }</p>
                                        </div>
                                    </div>
                                </Col>
                                : ''

                        }



                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <button style={{ backgroundColor: '#e22747', color: 'white', border: '1px solid grey', borderRadius: '5px', padding: '5px', marginTop: '15px', marginRight: '15px' }} onClick={() => {
                                if (
                                    user_name !== "" &&
                                    user_id !== "" &&
                                    mobile_number !== "" &&
                                    password !== "" &&
                                    mail_id !== "" &&
                                    password !== ""
                                ) {
                                    let cam_list = []
                                    camera_ids.map((cam_value) => {
                                        if (cam_value.type !== 'empty') {
                                            cam_list.push(cam_value)
                                        }
                                    })
                                    const client_admin_details = {
                                        client_id: user_id,
                                        User_name: user_name,
                                        password: password,
                                        mobile_number: mobile_number,
                                        mail: mail_id,
                                        Active: active,
                                        created_date: save_type == 'new_data' ? moment(new Date()).format("YYYY-MM-DD") : user_list[key_value].created_date,
                                        created_time: save_type == 'new_data' ? moment(new Date()).format("YYYY-MM-DD") : user_list[key_value].created_time,
                                        updated_date: moment(new Date()).format("YYYY-MM-DD"),
                                        updated_time: moment(new Date()).format("YYYY-MM-DD"),
                                        dealer_id: (JSON.parse(localStorage.getItem("userData"))).dealer_id,
                                        gender: gender,
                                        user_type: 'User',
                                        site_id: site,
                                        camera_id: cam_list,
                                        client_admin_id: (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).client_admin_id,
                                        site_admin_id: (JSON.parse(localStorage.getItem("userData"))).position_type == 'Site Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).site_admin_id,
                                        clientt_id: (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).clientt_id,
                                        position_type: user_type == 'Admin' ? 'Client Admin' : user_type == 'Site Admin' ? 'Site Admin' : 'User',
                                        access_type: (JSON.parse(localStorage.getItem("userData"))).access_type,
                                        operation_type: operation_type,
                                        company_name: userData.company_name
                                    };
                                    console.log(client_admin_details)

                                    const options = {
                                        url: save_type == 'new_data' ? api.USER_DATA : `${api.USER_DATA}${user_list[key_value]._id}`,
                                        method: save_type == 'new_data' ? "POST" : 'PUT',
                                        headers: {
                                            "Content-Type": "application/json",
                                            // 'Authorization': 'Bearer ' + window.localStorage.getItem('codeofauth')
                                        },
                                        data: JSON.stringify(client_admin_details),
                                    };

                                    if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                                        let access = userData.operation_type.filter((val) => { return val == 'Create' || val == 'All' })
                                        if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Create' || access[1] == 'Create') {
                                            if (user_id !== '' && user_name !== '' && password !== '' && mobile_number !== '' && mail_id !== '' && gender !== '' && operation_type.length !== 0) {
                                                axios(options)
                                                    .then((response) => {
                                                        console.log(response.data);

                                                        if (save_type == 'new_data') {
                                                            if (response.data == "User ID already exist") {
                                                                alert("Username(" + user_id + ") Mail(" + mail_id + ") already exist");
                                                            } else {
                                                                setflag(!flag)
                                                                setopen(false)
                                                            }
                                                        } else {
                                                            setflag(!flag)
                                                            setopen(false)
                                                        }
                                                    })
                                                    .catch(function (e) {
                                                        if (e.message === "Network Error") {
                                                            alert(
                                                                "No Internet Found. Please check your internet connection"
                                                            );
                                                        } else {
                                                            alert(
                                                                "Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support."
                                                            );
                                                        }
                                                    });
                                            } else {
                                                alert("Please fill out all required fields.");
                                            }
                                        } else {
                                            setalert_box(true)
                                            setalert_text('Your access level does not allow you to download videos.')

                                        }
                                    } else {
                                        let cam_name = ''
                                        let count = false
                                        camera_ids.map((val) => {
                                            userData.site_id.map((value) => {
                                                let access = value.type.filter((val) => { return val == 'Create' || val == 'All' })
                                                if (val.id == value.id) {
                                                    if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Create' || access[1] == 'Create') {
                                                        count = true
                                                    } else {
                                                        cam_name = `${cam_name} ${value.site_name}`
                                                    }
                                                }
                                            })

                                        })

                                        if (count && cam_name !== '') {
                                            if (user_id !== '' && user_name !== '' && password !== '' && mobile_number !== '' && mail_id !== '' && gender !== '' && operation_type.length !== 0) {
                                                axios(options)
                                                    .then((response) => {
                                                        console.log(response.data);

                                                        if (save_type == 'new_data') {
                                                            if (response.data == "User ID already exist") {
                                                                alert("Username(" + user_id + ") Mail(" + mail_id + ") already exist");
                                                            } else {
                                                                setflag(!flag)
                                                                setopen(false)
                                                            }
                                                        } else {
                                                            setflag(!flag)
                                                            setopen(false)
                                                        }
                                                    })
                                                    .catch(function (e) {
                                                        if (e.message === "Network Error") {
                                                            alert(
                                                                "No Internet Found. Please check your internet connection"
                                                            );
                                                        } else {
                                                            alert(
                                                                "Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support."
                                                            );
                                                        }
                                                    });
                                            } else {
                                                alert("Please fill out all required fields.");
                                            }
                                        } else {
                                            setalert_box(true)
                                            setalert_text(`Your access level does not allow you to download these (${cam_name}) videos.`)

                                        }
                                    }

                                }
                            }
                            }>Save User</button>

                            <button style={{ backgroundColor: '#e6e8eb', color: 'black', border: '1px solid grey', borderRadius: '5px', padding: '5px', marginTop: '15px' }} onClick={() => {
                                setopen(false)
                            }}>Close</button>
                        </Col>
                    </Row>
                </div>
            </Modal >


            <Row style={{ padding: '10px', alignItems: 'center', }}>
                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                    <div style={{ display: 'flex' }}>
                        <input type='text' placeholder='Search' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginRight: '20px', }}  
                         onChange={(e) => {
                            if (e.target.value !== '') {
                                // console.log(e.target.value)
                                searchfunction(e.target.value, duplicateData, "search_user")
                            } else {
                                setuser_list(duplicateData)
                            }
                        }}
                        ></input>

                        <button style={{ backgroundColor: '#e22747', color: 'white', padding: '10px', borderRadius: '20px', border: '1px solid gray', }} onClick={() => {
                            let data = []
                            let chlk = true
                            for (let index = 0; index < operation_list.length; index++) {
                                for (let index1 = 0; index1 < operation_type.length; index1++) {
                                    if (operation_type[index1] !== operation_list[index]) {
                                        chlk = false
                                    } else {
                                        chlk = true
                                        break
                                    }
                                }
                                if (!chlk) {
                                    data.push(operation_list[index])
                                }
                            }

                            setoperation_list(data)
                            setsave_type('new_data')
                            setopen(true)
                        }}> <TuneOutlinedIcon style={{ marginRight: '10px' }} />Add User</button>
                    </div>
                </Col>
            </Row>

            <Row style={{ padding: '10px', alignItems: 'center', }}>

                <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ overflowX: 'scroll', minHeight: '80vh' }}>
                    <table style={{ width: '100%', backgroundColor: 'white' }}>
                        <tr style={{ backgroundColor: '#e6e8eb', color: 'black' }}>
                            <th style={{ padding: '15px' }}>Client Id</th>
                            <th style={{ padding: '15px' }}>User Name</th>
                            <th style={{ padding: '15px' }}>Password</th>
                            <th style={{ padding: '15px' }}>Status</th>
                            <th style={{ padding: '15px' }}>Mobile Number</th>
                            {/* <th style={{ padding: '15px' }}>MAC address</th> */}
                            {/* <th style={{ padding: '15px' }}>Cloud Adapter ID</th> */}
                            <th style={{ padding: '15px' }}>Mail Id</th>
                            <th style={{ padding: '15px' }}>Type</th>
                            <th style={{ padding: '15px' }}>Permission Level</th>
                            <th style={{ padding: '15px' }}>Action</th>
                        </tr>
                        {
                            
                            user_list.map((val, i) => (
                                <tr style={{ borderBottom: '1px solid grey', color: 'black' }}>
                                    <td style={{ padding: '15px' }}>{val.client_id}</td>
                                    <td style={{ padding: '15px' }}>{val.User_name}</td>
                                    <td style={{ padding: '15px' }}>{val.password}</td>
                                    <td style={{ padding: '15px', color: val.Active == 1 ? '#1ee01e' : 'red' }}>{val.Active == 1 ? 'Active' : 'Inactive'}</td>
                                    <td style={{ padding: '15px', }}>{val.mobile_number}</td>
                                    {/* <td style={{ padding: '15px' }}>10:12:fb:09:21:f5</td> */}
                                    {/* <td style={{ padding: '15px' }}>CAgxrx</td> */}
                                    <td style={{ padding: '15px' }}>{val.mail}</td>
                                    <td style={{ padding: '15px' }}>{val.position_type == 'Client Admin' ? 'Admin' : 'User'}</td>
                                    <td style={{ padding: '15px', color: val.operation_type != 'Read Only' ? '#1ee01e' : 'red' }}>{val.operation_type}</td>
                                    <td style={{ padding: '15px', color: 'red' }}>
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ backgroundColor: '#e22747', border: '1px solid grey', borderRadius: '5px', marginRight: '5px', cursor: 'pointer' }} onClick={() => {

                                                if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                                                    let access = userData.operation_type.filter((val) => { return val == 'Edit' || val == 'All' })
                                                    if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Edit' || access[1] == 'Edit') {

                                                        let data = []
                                                        let chlk = true
                                                        for (let index = 0; index < operation_list.length; index++) {
                                                            for (let index1 = 0; index1 < val.operation_type.length; index1++) {
                                                                if (val.operation_type[index1] !== operation_list[index]) {
                                                                    chlk = false
                                                                } else {
                                                                    chlk = true
                                                                    break
                                                                }
                                                            }
                                                            if (!chlk) {
                                                                data.push(operation_list[index])
                                                            }
                                                        }

                                                        let data1 = []
                                                        let chlk1 = true
                                                        for (let index = 0; index < group_list.length; index++) {
                                                            for (let index1 = 0; index1 < val.site_id.length; index1++) {
                                                                if (val.site_id[index1].id !== group_list[index]._id) {
                                                                    chlk1 = false
                                                                } else {
                                                                    chlk1 = true
                                                                    break
                                                                }
                                                            }
                                                            if (!chlk1) {
                                                                data1.push(group_list[index])
                                                            }
                                                        }

                                                        let data2 = []
                                                        let chlk2 = true
                                                        for (let index = 0; index < cameras.length; index++) {
                                                            for (let index1 = 0; index1 < val.camera_id.length; index1++) {
                                                                if (val.camera_id[index1].id == cameras[index]._id) {
                                                                    chlk2 = true
                                                                    break
                                                                } else {
                                                                    chlk2 = false
                                                                }
                                                            }
                                                            if (chlk2) {
                                                                data2.push(cameras[index])
                                                            }
                                                        }


                                                        setselectedcameras(data2)
                                                        setoperation_list(data)
                                                        setgroup_list(data1)
                                                        setuser_id(val.client_id)
                                                        setuser_name(val.User_name)
                                                        setpassword(val.password)
                                                        setmobile_number(val.mobile_number)
                                                        setmail_id(val.mail)
                                                        setactive(val.Active)
                                                        setgender(val.gender)
                                                        setsite(val.site_id)
                                                        setcamera_ids(val.camera_id)
                                                        setuser_type(val.position_type == 'Client Admin' ? 'Admin' : val.position_type)
                                                        setoperation_type(val.operation_type)
                                                        setsave_type('put_data')
                                                        setkey_value(i)
                                                        setopen(true)
                                                    } else {
                                                        setalert_box(true)
                                                        setalert_text('Your access level does not allow you to download videos.')

                                                    }
                                                } else {

                                                    let data2 = []
                                                    let chlk2 = true
                                                    for (let index = 0; index < cameras.length; index++) {
                                                        for (let index1 = 0; index1 < val.camera_id.length; index1++) {
                                                            if (val.camera_id[index1].id == cameras[index]._id) {
                                                                chlk2 = true
                                                                break
                                                            } else {
                                                                chlk2 = false
                                                            }
                                                        }
                                                        if (chlk2) {
                                                            data2.push(cameras[index])
                                                        }
                                                    }
                                                    setselectedcameras(data2)
                                                    setuser_id(val.client_id)
                                                    setuser_name(val.User_name)
                                                    setpassword(val.password)
                                                    setmobile_number(val.mobile_number)
                                                    setmail_id(val.mail)
                                                    setactive(val.Active)
                                                    setgender(val.gender)
                                                    setsite(val.site_id)
                                                    setcamera_ids(val.camera_id)
                                                    setuser_type(val.position_type == 'Client Admin' ? 'Admin' : val.position_type)
                                                    setoperation_type(val.operation_type)
                                                    setsave_type('put_data')
                                                    setkey_value(i)
                                                    setopen(true)
                                                }


                                            }}>
                                                <EditIcon style={{ color: 'white' }} />
                                            </div>

                                            <div style={{ backgroundColor: '#e22747', border: '1px solid grey', borderRadius: '5px', cursor: 'pointer' }} onClick={() => {

                                                if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                                                    let access = userData.operation_type.filter((val) => { return val == 'Create' || val == 'All' })
                                                    if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Edit' || access[1] == 'Edit') {

                                                        const options = {
                                                            url: `${api.USER_DATA}${val._id}`,
                                                            method: 'DELETE',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                // 'Authorization': 'Bearer ' + window.localStorage.getItem('codeofauth')
                                                            }
                                                        };

                                                        axios(options)
                                                            .then(response => {
                                                                // console.log(response);
                                                                setflag(!flag)

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
                                                        setalert_box(true)
                                                        setalert_text('Your access level does not allow you to download videos.')

                                                    }
                                                } else {
                                                    let cam_name = ''
                                                    let count = false
                                                    site.map((val) => {
                                                        userData.site_id.map((value) => {
                                                            let access = value.type.filter((val) => { return val == 'Create' || val == 'All' })
                                                            if (val.id == value.id) {
                                                                if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Edit' || access[1] == 'Edit') {
                                                                    count = true
                                                                } else {
                                                                    cam_name = `${cam_name} ${value.site_name}`
                                                                }
                                                            }
                                                        })

                                                    })

                                                    if (count && cam_name == '') {
                                                        const options = {
                                                            url: `${api.USER_DATA}${val._id}`,
                                                            method: 'DELETE',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                // 'Authorization': 'Bearer ' + window.localStorage.getItem('codeofauth')
                                                            }
                                                        };

                                                        axios(options)
                                                            .then(response => {
                                                                // console.log(response);
                                                                setflag(!flag)

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
                                                        setalert_box(true)
                                                        setalert_text(`Your access level does not allow you to download these (${cam_name}) videos.`)

                                                    }
                                                }


                                            }}>
                                                <DeleteIcon style={{ color: 'white' }} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </table>

                </Col>

            </Row>
        </div >
    )
}
