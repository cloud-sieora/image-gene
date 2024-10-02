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
import Modal from '@mui/material/Modal';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import CloseIcon from '@mui/icons-material/Close';
import * as api from '../../Configurations/Api_Details'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment'
import axios from 'axios'
import { DataBrew } from 'aws-sdk';


export default function Device_list() {
    const userData = JSON.parse(localStorage.getItem("userData"))
    console.log(userData);
    const [open, setopen] = useState(false)
    const [device_id, setdevice_id] = useState('')
    const [device_name, setdevice_name] = useState('')
    const [password, setpassword] = useState('')
    const [active, setactive] = useState(1)
    const [flag, setflag] = useState(false)
    const [device_list, setdevice_list] = useState([])
    const [device_res, setdevice_res] = useState(false)
    const [save_type, setsave_type] = useState('new_data')
    const [key_value, setkey_value] = useState(0)
    const [alert_text, setalert_text] = useState('')
    const handleClose = () => setopen(false)
    const [alert_box, setalert_box] = useState(false)
    const alertClose = () => setalert_box(false)
    const [site_list, setsite_list] = useState([])
    const [site_list1, setsite_list1] = useState([])
    const [site_detail, setsite_detail] = useState({ select: 'Select', id: '' })

    const [duplicateData, setDuplicateData] = useState([])

    const [current_time, setCurrentTime] = useState()
    const [current_date, setCurrentDate] = useState()

    useEffect(() => {

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
                setdevice_list(response.data)
                setDuplicateData(response.data)
                setCurrentTime(moment(new Date()).format('HH:mm:ss'))
                setCurrentDate(moment(new Date()).format('YYYY-MM-DD'))

                if (response.data.length == 0) {
                    setdevice_res('no_data')
                } else {
                    setdevice_res(true)
                }
            })
            .catch((error) => {
                console.log(error);
            })
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
    }, [])

    console.log('device_list', device_list)

    // const [lastActiveTime, setLastActiveTime] = useState([])
    const lastActiveTime = []


    function searchfunction(event, data, type) {
        let str = event
        let arr = []



        // let filteredArray = duplicateData.filter((d) => {
        //     return d.device_id.toUpperCase().includes(str.toUpperCase()) || d.device_name.toUpperCase().includes(str.toUpperCase()) || d.camera_limit.toString().includes(str.toUpperCase()) || d.local_ip.toUpperCase().includes(str.toUpperCase()) || lastActiveTime.forEach((ele) => ele.toUpperCase().includes(str.toUpperCase()))
        // })

        // setdevice_list(filteredArray)

        // let current_time = moment(new Date()).format('HH:mm:ss')
        let current_time_split = current_time.split(':')
        // let current_date = moment(new Date()).format('YYYY-MM-DD')
        // let current_date_split = current_date.split('-')
        // console.log(current_time)
        // console.log(current_date)


        if (event !== '') {
            for (let i = 0; i < data.length; i++) {

                let device_time = data[i].last_active.split(':')

                let username = type == 'devie_management_search' ? `${data[i].device_id}${data[i].local_ip === 'NONE' ? 'Null' : data[i].local_ip}${data[i].device_name}
                ${data[i].Active === 1 &&
                        current_date === data[i].last_active_date &&
                        (Number(current_time_split[1]) - Number(device_time[1])) === 0
                        ? 'Running' : 'Stopped'}
                ${data[i].camera_limit}${data[i].device_off_alert === 0 ? 'Off' : 'On'}${data[i].local_alarm === 0 ? 'False' : 'True'}${lastActiveTime[i]}` : ''
                for (let j = 0; j < str.length; j++) {

                    console.log('username', username)

                    // console.log('date check', data[i].last_active_date === current_date)
                    // console.log('time check', ((Number(current_time_split[1]) - Number(device_time[1])) === 0))
                    // console.log('check number', (Number(current_time_split[1]) - Number(device_time[1])) === 0)

                    for (let k = 0; k < username.length; k++) {
                        if (str[j].toUpperCase() === username[k].toUpperCase()) {
                            // console.log(username[k], str[j]);
                            let wrd = ''
                            for (let l = k; l < k + str.length; l++) {
                                // console.log(k, l);
                                wrd = wrd + username[l]

                            }
                            // console.log(wrd);
                            if (str.toUpperCase() === wrd.toUpperCase()) {
                                arr.push(data[i])
                                break
                            }
                        }
                    }

                }
            }
        }

        console.log("arr", arr);

        if (arr.length != 0) {
            if (type == 'devie_management_search') {
                setdevice_list(arr)
            }

        } else {
            if (type == 'devie_management_search') {
                setdevice_list([])
            }
        }
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
                                <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>ADD DEVICE</p>
                                <CloseIcon style={{ fontSize: '15px', }} onClick={() => {
                                    // if(userData.access_type)
                                    setsave_type('put_data')
                                    handleClose()
                                }} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ padding: '10px', alignItems: 'center', }}>
                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>Enter Device Id</p>
                                <input type='text' placeholder='Enter Device Id' value={device_id} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => { setdevice_id(e.target.value) }}></input>
                            </div>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>Enter Device Name</p>
                                <input type='text' placeholder='Enter Device Name' value={device_name} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => { setdevice_name(e.target.value) }}></input>
                            </div>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>Enter Password</p>
                                <input type='text' placeholder='Enter Password' value={password} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => { setpassword(e.target.value) }}></input>
                            </div>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div>
                                <p style={{ color: 'black', marginTop: '15px', marginBottom: '5px' }}>Site</p>
                                <div style={{ position: 'relative', zIndex: 2 }}>
                                    <p type='text' style={{ backgroundColor: '#e6e8eb', color: site_detail.select != 'Select' ? 'black' : '#898989', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => {
                                        if (document.getElementById(`site`).style.display !== 'none') {
                                            document.getElementById(`site`).style.display = 'none'
                                        } else {
                                            document.getElementById(`site`).style.display = 'block'
                                        }

                                    }}>{site_detail.select}<span><ArrowDropDownIcon /></span></p>

                                    <div id={`site`} style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', maxHeight: '150px', overflowY: 'scroll' }}>
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

                                                            setsite_detail({ select: siteval.site_name, id: siteval._id })
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

                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <button style={{ backgroundColor: '#e22747', color: 'white', border: 'none', borderRadius: '5px', padding: '5px', marginTop: '15px', marginRight: '15px' }} onClick={() => {

                                let data = JSON.stringify({
                                    "user_id": userData._id,
                                    "device_id": device_id,
                                    "device_name": device_name,
                                    "password": password,
                                    "Active": active,
                                    "site_id": site_detail.id,
                                    dealer_id: (JSON.parse(localStorage.getItem("userData"))).dealer_id,
                                    created_date: save_type == 'new_data' ? moment(new Date()).format("YYYY-MM-DD") : device_list[key_value].created_date,
                                    created_time: save_type == 'new_data' ? moment(new Date()).format("YYYY-MM-DD") : device_list[key_value].created_time,
                                    updated_date: moment(new Date()).format("YYYY-MM-DD"),
                                    updated_time: moment(new Date()).format("YYYY-MM-DD"),
                                    client_admin_id: (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).client_admin_id,
                                    site_admin_id: (JSON.parse(localStorage.getItem("userData"))).position_type == 'Site Admin' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).site_admin_id,
                                    clientt_id: (JSON.parse(localStorage.getItem("userData"))).position_type == 'Client' ? (JSON.parse(localStorage.getItem("userData")))._id : (JSON.parse(localStorage.getItem("userData"))).clientt_id,
                                });

                                let config = {
                                    method: save_type == 'new_data' ? 'post' : 'put',
                                    maxBodyLength: Infinity,
                                    url: save_type == 'new_data' ? api.DEVICE_DATA : api.DEVICE_DATA + device_list[key_value]._id,
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    data: data
                                };
                                console.log(config);

                                axios.request(config)
                                    .then((response) => {
                                        console.log(JSON.stringify(response.data));

                                        if (db_type == 'local') {
                                            let config = {
                                                method: save_type == 'new_data' ? 'post' : 'put',
                                                maxBodyLength: Infinity,
                                                url: save_type == 'new_data' ? api.DEVICE_CREATION_LOCAL : api.DEVICE_CREATION_LOCAL + device_list[key_value]._id,
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                data: data
                                            };
                                            axios.request(config).then((newres) => {
                                                console.log(newres.data);
                                                if (save_type == 'new_data') {
                                                    if (response.data == "Device ID already exist") {
                                                        setalert_box(true)
                                                        setalert_text("Device id (" + device_id + ") already exist")
                                                        // alert("Device id (" + device_id + ") already exist");
                                                    } else {
                                                        setflag(!flag)
                                                        setopen(false)
                                                    }
                                                } else {

                                                    setflag(!flag)
                                                    setopen(false)
                                                }
                                            }).catch((e) => { console.log(e); })
                                        } else {
                                            if (save_type == 'new_data') {
                                                if (response.data == "Device ID already exist") {
                                                    setalert_box(true)
                                                    setalert_text("Device id (" + device_id + ") already exist")
                                                    // alert("Device id (" + device_id + ") already exist");
                                                } else {
                                                    setflag(!flag)
                                                    setopen(false)
                                                }
                                            } else {
                                                setflag(!flag)
                                                setopen(false)
                                            }
                                        }
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    })
                            }}>Add Device</button>

                            <button style={{ backgroundColor: '#e6e8eb', color: 'black', border: '1px solid grey', borderRadius: '5px', padding: '5px', marginTop: '15px' }} onClick={() => {
                                setopen(false)
                            }}>Close</button>
                        </Col>
                    </Row>
                </div>
            </Modal>


            <Row style={{ padding: '10px', alignItems: 'center', }}>
                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                    <div style={{ display: 'flex' }}>
                        <input type='text' placeholder='Search' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginRight: '20px', }}
                            onChange={(e) => {
                                if (e.target.value !== '') {
                                    searchfunction(e.target.value, device_list, "devie_management_search")
                                    // setdevice_list(duplicateData)
                                } else {
                                    setdevice_list(duplicateData)
                                }

                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Backspace') {
                                    // alert('clicked')
                                    setdevice_list(duplicateData)
                                }
                            }}
                        ></input>

                        <button style={{ backgroundColor: '#e22747', color: 'white', padding: '10px', borderRadius: '20px', border: '1px solid gray', }} onClick={() => {
                            let access = userData.operation_type.filter((val) => { return val == 'Create' || val == 'All' })
                            if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Create' || access[1] == 'Create') {
                                setopen(true)
                            } else {
                                setalert_box(true)
                                setalert_text('Your access level does not allow you to create device.')

                            }
                        }}> <TuneOutlinedIcon style={{ marginRight: '10px' }} />Add Device</button>
                    </div>
                </Col>
            </Row>

            <Row style={{ padding: '10px', alignItems: 'center', }}>

                {
                    device_res == true ?

                        <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ overflowX: 'scroll', minHeight: '80vh' }}>
                            <table style={{ width: '100%', backgroundColor: 'white' }}>
                                <tr style={{ backgroundColor: '#e6e8eb', color: 'black' }}>
                                    <th style={{ padding: '15px' }}>Device Id</th>
                                    <th style={{ padding: '15px' }}>Device Name</th>
                                    <th style={{ padding: '15px' }}>Last Active</th>
                                    <th style={{ padding: '15px' }}>Password</th>
                                    <th style={{ padding: '15px' }}>Status</th>
                                    <th style={{ padding: '15px' }}>Camera Limit</th>
                                    {/* <th style={{ padding: '15px' }}>MAC address</th> */}
                                    {/* <th style={{ padding: '15px' }}>Cloud Adapter ID</th> */}
                                    <th style={{ padding: '15px' }}>Device Off Alert</th>
                                    <th style={{ padding: '15px' }}>Local Ip</th>
                                    <th style={{ padding: '15px' }}>Local Alarm</th>
                                    <th style={{ padding: '15px' }}>Action</th>
                                </tr>
                                {
                                    device_list.map((val, i) => {

                                        let current_time_split = current_time.split(':')
                                        let current_date_split = current_date.split('-')



                                        let store_time = val.last_active
                                        let store_time_split = store_time.split(':')
                                        let store_date = val.last_active_date
                                        let store_date_split = store_date.split('-')

                                        let str = ''
                                        let str_color = 'red'

                                        if (store_date == current_date && store_time_split[0] == current_time_split[0] && store_time_split[1] == current_time_split[1]) {
                                            str = `${Math.abs(Number(store_time_split[2]) - Number(current_time_split[2]))} second ago`
                                            str_color = '#1ee01e'
                                        } else if (store_date == current_date && store_time_split[0] == current_time_split[0]) {
                                            str = `${Math.abs(Number(store_time_split[1]) - Number(current_time_split[1]))} minute ago`
                                            str_color = 'red'
                                        } else if (store_date == current_date) {
                                            str = `${Math.abs(Number(store_time_split[0]) - Number(current_time_split[0]))} hour ago`
                                        } else {
                                            if (store_date_split[0] == current_date_split[0] && store_date_split[1] == current_date_split[1]) {
                                                str = `${Math.abs(Number(store_date_split[2]) - Number(current_date_split[2]))} days ago`
                                            } else if (store_date_split[0] == current_date_split[0]) {

                                                if (store_date_split[1] != current_date_split[1] && (Math.abs(Number(store_date_split[1]) - Number(current_date_split[1]))) == 1) {
                                                    let lastDayOfMonth = moment(new Date(store_date_split[0], store_date_split[1], 0)).format('YYYY-MM-DD')
                                                    lastDayOfMonth = lastDayOfMonth.split('-')

                                                    if ((Math.abs(Number(store_date_split[2]) - Number(lastDayOfMonth[2]))) == 0) {
                                                        if (current_date_split[2] == 1) {
                                                            str = `${Math.abs(Number(current_time_split[0]))} hour ago`
                                                        } else {
                                                            str = `${Math.abs(Number(current_date_split[2]))} days ago`
                                                        }
                                                    } else {
                                                        str = Math.abs(Number(store_date_split[2]) - Number(lastDayOfMonth[2]))
                                                        str = `${Math.abs(Number(str - 1) + Number(current_date_split[2]))} days ago`
                                                    }
                                                } else {

                                                    str = `${Math.abs(Number(store_date_split[1]) - Number(current_date_split[1]))} months ago`
                                                }

                                            } else {
                                                str = `${Math.abs(Number(store_date_split[2]) - Number(current_date_split[2]))} years ago`
                                            }
                                        }

                                        lastActiveTime.push(str)


                                        
                                        let duplicateLastActiveTime = duplicateData.find((d) => d.device_id === val.device_id)
                                        let index = duplicateData.indexOf(duplicateLastActiveTime)

                                        let device_time=[]
                                        if(index < 0){
                                            device_time = ['NONE']
                                        }else{
                                            device_time = duplicateData[index].last_active.split(':')
                                        } 

                                        let activeStatus = val.Active === 1 &&
                                            current_date === val.last_active_date &&
                                            Number(current_time_split[1]) == Number(device_time[1])
                                            ? 'Runing' : 'Stopped'

                                        console.log('index', index);
                                        console.log('current time', Number(current_time_split[1]))

                                        console.log('duplicate data last active', Number(device_time[1]))

                                        console.log(Number(current_time_split[1]) == Number(device_time[1]))


                                        // console.log('str', str)
                                        // console.log('last active time', lastActiveTime)
                                        return (
                                            <tr style={{ borderBottom: '1px solid grey', color: 'black' }}>
                                                <td style={{ padding: '15px' }}>{val.device_id}</td>
                                                <td style={{ padding: '15px' }}>{val.device_name}</td>
                                                <td style={{ padding: '15px', color: str_color }}>{str}</td>

                                                <td style={{ padding: '15px' }}>{val.password}</td>
                                                <td style={{
                                                    padding: '15px', color: str_color === 'red' ? 'red' : '#1ee01e'
                                                    // val.Active === 1 ? '#1ee01e' : 'red'
                                                }}>
                                                    {
                                                        activeStatus
                                                    }
                                                </td>
                                                <td style={{ padding: '15px', }}>{val.camera_limit}</td>
                                                {/* <td style={{ padding: '15px' }}>10:12:fb:09:21:f5</td> */}
                                                {/* <td style={{ padding: '15px' }}>CAgxrx</td> */}
                                                <td style={{ padding: '15px', color: val.device_off_alert == 1 ? '#1ee01e' : 'red' }}>{val.device_off_alert == 1 ? 'On' : 'Off'}</td>
                                                <td style={{ padding: '15px' }}>{val.local_ip === 'NONE' ? 'Null' : val.local_ip}</td>
                                                <td style={{ padding: '15px', color: val.local_alarm == 1 ? '#1ee01e' : 'red' }}>{val.local_alarm == 1 ? 'True' : 'False'}</td>
                                                <td style={{ padding: '15px', color: 'red' }}>
                                                    <div style={{ display: 'flex' }}>
                                                        <div style={{ backgroundColor: '#e22747', border: '1px solid grey', borderRadius: '5px', marginRight: '5px', cursor: 'pointer' }} onClick={() => {
                                                            let access = userData.operation_type.filter((val) => { return val == 'Edit' || val == 'All' })
                                                            if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Edit' || access[1] == 'Edit') {
                                                                let edit_site = { select: '', id: '' }
                                                                let site = []
                                                                site_list1.map((site_data) => {
                                                                    if (val.site_id == site_data._id) {
                                                                        edit_site.select = site_data.site_name
                                                                        edit_site.id = site_data._id
                                                                    } else {
                                                                        site.push(site_data)
                                                                    }
                                                                })
                                                                setsite_list(site)
                                                                setsite_detail(edit_site)
                                                                setdevice_id(val.device_id)
                                                                setdevice_name(val.device_name)
                                                                setpassword(val.password)
                                                                setactive(val.Active)
                                                                setsave_type('put_data')
                                                                setkey_value(i)
                                                                setopen(true)
                                                            } else {
                                                                setalert_box(true)
                                                                setalert_text('Your access level does not allow you to delete device.')

                                                            }

                                                        }}>
                                                            <EditIcon style={{ color: 'white' }} />
                                                        </div>

                                                        <div style={{ backgroundColor: '#e22747', border: '1px solid grey', borderRadius: '5px', cursor: 'pointer' }} onClick={() => {

                                                            let access = userData.operation_type.filter((val) => { return val == 'Delete' || val == 'All' })
                                                            if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Delete' || access[1] == 'Delete') {
                                                                const options = {
                                                                    url: api.DEVICE_DATA + val._id,
                                                                    method: 'DELETE',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                        // 'Authorization': 'Bearer ' + window.localStorage.getItem('codeofauth')
                                                                    }
                                                                };

                                                                axios(options)
                                                                    .then(response => {
                                                                        // console.log(response);

                                                                        if (db_type == 'local') {
                                                                            const options = {
                                                                                url: api.DEVICE_DATA_LOCAL + val._id,
                                                                                method: 'DELETE',
                                                                                headers: {
                                                                                    'Content-Type': 'application/json',
                                                                                    // 'Authorization': 'Bearer ' + window.localStorage.getItem('codeofauth')
                                                                                }
                                                                            };
                                                                            axios(options)
                                                                                .then(response => {
                                                                                    setflag(!flag)
                                                                                })
                                                                                .catch((e) => {
                                                                                    console.log(e);
                                                                                })


                                                                        } else {
                                                                            setflag(!flag)
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
                                                                setalert_box(true)
                                                                setalert_text('Your access level does not allow you to delete device.')

                                                            }
                                                        }}>
                                                            <DeleteIcon style={{ color: 'white' }} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </table>

                        </Col>
                        : device_res == false ?
                            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                <div style={{ width: '100%', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: 'white' }}>
                                    <CircularProgress size={'50px'} style={{ color: 'blue' }} />
                                    <p>Please Wait...</p>
                                </div>
                            </Col>
                            :
                            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                <div style={{ width: '100%', height: '80vh', }}>
                                    <hr></hr>
                                    <p style={{ color: '#e32747', fontWeight: 'bolder', textAlign: 'center' }}>No Device Found !</p>
                                </div>
                            </Col>
                }

            </Row>
        </div>
    )
}
