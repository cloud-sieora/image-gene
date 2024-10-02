import React, { useState, useContext, useEffect } from 'react'
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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CloseIcon from '@mui/icons-material/Close';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { date } from './DateTimeFun'
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { PAGE, STARTDATE, STARTTIME, ENDDATE, ENDTIME, APPLY, SELECT, SELECTED_CAMERAS } from '../../store/actions'

import { Context } from './CameraLiveView';

export default function EventMenu({ data1, res, aditional_info, camera_name }) {
    const device = JSON.parse(localStorage.getItem("device"))
    let data = []
    const device_id = device.device_id
    const { page, startdate, starttime, enddate, endtime, apply, select } = useSelector((state) => state)
    const dispatch = useDispatch()
    const [btn1, setbtn1] = useState('')
    const [clickbtn1, setclickbtn1] = useState(false)
    const [clickbtn2, setclickbtn2] = useState(false)
    const [clickbtn3, setclickbtn3] = useState(false)
    const [cameras, setcameras] = useState([])
    const [selectedcameras, setselectedcameras] = useState([])
    let [selectedanalytics, setselectedanalytics] = useState([])
    let [newres, setnewres] = useState(false)
    let [open1, setOpen1] = useState(false)
    const [toggle, settoggle] = useState(true)
    // const { value, dispatch } = useContext(Context)

    useEffect(() => {
        dispatch({ type: SELECTED_CAMERAS, value: [] })
        const axios = require('axios');
        let data = JSON.stringify({
            "device_id": device_id
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://tentovision1.cloudjiffy.net/camera_creation_api_list/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                setcameras(response.data)
                setselectedcameras(response.data)
                dispatch({ type: SELECTED_CAMERAS, value: response.data })
                dispatch({ type: APPLY, value: !apply })


            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    const handleOpen1 = () => setOpen1(true);
    const handleClose1 = () => setOpen1(false);

    if (selectedanalytics.length === 0) {
        data = data1
        newres = false
    } else {
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
        data1.map((val) => {
            selectedanalytics.map((ana) => {

                if (val.objects.length !== 0 && val.objects[`${ana}`] !== undefined) {
                    let duplicate = dup(arr, val._id)
                    if (duplicate === 0) {
                        arr.push(val)
                    }
                }
            })
        })

        data = arr
        if (arr.length === 0) {
            newres = true
        } else {
            newres = true
        }
        console.log(arr);
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

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: 24,
    };

    let camera_list = cameras.map((val, i) => {

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
                                    dispatch({ type: SELECTED_CAMERAS, value: [...old, val] })
                                    dispatch({ type: APPLY, value: !apply })
                                    return [...old, val]
                                })
                            } else {

                                selectedcameras.map((data) => {
                                    if (val._id !== data._id) {
                                        arr.push(data)
                                    }
                                })
                                setselectedcameras(arr)
                                dispatch({ type: SELECTED_CAMERAS, value: arr })
                                dispatch({ type: APPLY, value: !apply })
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
                <td style={{ padding: '15px' }}><img width={150} height={100} src={`https://sgp1.digitaloceanspaces.com/tentovision/${val.device_id}/${val.camera_gereral_name}.jpg?${new Date()}`}></img></td>
                <td style={{ padding: '15px' }}>{val.camera_gereral_name}</td>
                <td style={{ padding: '15px' }}>{val.camera_gereral_name}</td>
                <td style={{ padding: '15px' }}>360 days</td>
            </tr>
        )
    })

    return (
        <>

            <div>
                <Modal
                    open={open1}
                    onClose={handleClose1}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    style={{ overflowY: 'scroll' }}
                >
                    <Row>
                        <Col xl={10} lg={10} md={10} sm={12} xs={12} style={style}>
                            <div >

                                <div style={{ backgroundColor: 'white', borderRadius: '5px', paddingTop: '10px' }}>
                                    <Row style={{ padding: '10px', alignItems: 'center' }}>

                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                <CloseIcon style={{ color: 'black', cursor : 'pointer' }} onClick={() => handleClose1()} />
                                            </div>
                                        </Col>

                                    </Row>
                                    <Row style={{ padding: '10px', alignItems: 'center' }}>

                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div>
                                                    <input type='text' placeholder='Search' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginRight: '20px' }}></input>

                                                    <button style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', }} onClick={() => {
                                                    }}> <TuneOutlinedIcon style={{ marginRight: '10px' }} />Filter</button>
                                                </div>

                                                <div>
                                                    <p style={{ color: 'black', fontSize: '20px', margin: 0 }}><span style={{ color: 'white', backgroundColor: '#1b0182', borderRadius: '50%', paddingLeft: '10px', paddingRight: '10px', paddingTop: '3px', paddingBottom: '3px' }}>{selectedcameras.length}</span> / {cameras.length} Cameras Selected</p>
                                                </div>
                                            </div>
                                        </Col>

                                    </Row>

                                    <Row style={{ padding: '10px', alignItems: 'center', }}>

                                        <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ overflow: 'scroll' }}>
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
                                                                    dispatch({ type: SELECTED_CAMERAS, value: cameras })
                                                                    dispatch({ type: APPLY, value: !apply })
                                                                } else {
                                                                    console.log(check);
                                                                    // for (let i = 0; i < check.length; i++) {
                                                                    //     check[i].style.backgroundColor = '#a8a4a4'
                                                                    //     check[i].style.justifyContent = 'flex-start'
                                                                    // }
                                                                    setselectedcameras([])
                                                                    dispatch({ type: SELECTED_CAMERAS, value: [] })
                                                                    dispatch({ type: APPLY, value: !apply })
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
                                                    camera_list
                                                }
                                            </table>

                                        </Col>

                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Modal>
            </div>


            <Row>
                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ color: 'black', fontWeight: 'bolder', fontSize: '20px' }}>Filters</p>
                        <CloseIcon style={{ color: 'black', cursor : 'pointer' }} onClick={() => {
                            dispatch({ type: PAGE, value: 0 })
                        }} />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                    <div style={{ display: aditional_info === true ? 'block' : 'none' }}>
                        <div style={{ position: 'relative' }}>
                            <button className='eventbtn' id='cameras' onClick={() => {
                                setclickbtn3(true)
                                handleOpen1()

                            }} style={{ display: 'flex' }}> <AccessTimeIcon style={{ marginRight: '10px' }} />Cameras <div style={{ backgroundColor: '#e32747', padding: '3px', borderRadius: '50%', height: '25px', width: '25px', marginLeft: '10px' }}><p style={{ color: 'white' }}>{selectedcameras.length}</p></div> <ArrowDropDownIcon style={{ marginLeft: '0px' }} /></button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ marginTop: '10px' }}>
                    <div>
                        <button id='day' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginRight: '20px' }} onClick={() => {

                            setclickbtn1(true)
                        }}> <AccessTimeIcon style={{ marginRight: '10px' }} />{aditional_info ? `${startdate} (${starttime}) - ${enddate} (${endtime})` : 'Select Date and Time'} <ArrowDropDownIcon style={{ marginLeft: '10px' }} /></button>
                    </div>

                    {btn1 === 'day' ?
                        <div style={{ padding: '5px' }}>

                            <Row>
                                <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ position: 'relative', backgroundColor: '#181828', borderRadius: '5px', paddingTop: '10px' }}>

                                    <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: '-28px', left: 0 }} />

                                    <Row>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px', paddingTop: '3px', paddingRight: '10px' }}>
                                            <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                                <CloseIcon style={{ fontSize: '12px', color: 'white', cursor : 'pointer' }} onClick={() => {

                                                    setclickbtn1(true)
                                                }} />
                                            </div>
                                        </Col>
                                    </Row>


                                    <Row>
                                        <Col xl={12} lg={12} md={12} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                            <p style={{ margin: 0, color: 'white', fontWeight: 'bolder' }}>Start Date</p>
                                        </Col>

                                        <Col xl={12} lg={12} md={12} sm={7} xs={7} style={{ padding: '3px' }}>
                                            <input type="date" value={startdate} style={{ padding: '5px', borderRadius: '5px', width: '100%' }} onChange={(e) => {
                                                dispatch({ type: STARTDATE, value: e.target.value })
                                            }}></input>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xl={12} lg={12} md={12} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                            <p style={{ margin: 0, color: 'white', fontWeight: 'bolder' }}>Start Time</p>
                                        </Col>

                                        <Col xl={12} lg={12} md={12} sm={7} xs={7} style={{ padding: '3px' }}>
                                            <input type="time" value={starttime} style={{ padding: '5px', borderRadius: '5px', width: '100%' }} onChange={(e) => {
                                                dispatch({ type: STARTTIME, value: e.target.value })
                                            }}></input>
                                        </Col>
                                    </Row>

                                    <div>
                                        <Row>
                                            <Col xl={12} lg={12} md={12} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                                <p style={{ margin: 0, color: 'white', fontWeight: 'bolder' }}>End Date</p>
                                            </Col>

                                            <Col xl={12} lg={12} md={12} sm={7} xs={7} style={{ padding: '3px' }}>
                                                <input type="date" value={enddate} style={{ padding: '5px', borderRadius: '5px', width: '100%' }} onChange={(e) => {
                                                    dispatch({ type: ENDDATE, value: e.target.value })
                                                }}></input>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xl={12} lg={12} md={12} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                                <p style={{ margin: 0, color: 'white', fontWeight: 'bolder' }}>End Time</p>
                                            </Col>

                                            <Col xl={12} lg={12} md={12} sm={7} xs={7} style={{ padding: '3px' }}>
                                                <input type="time" value={endtime} style={{ padding: '5px', borderRadius: '5px', width: '100%' }} onChange={(e) => {
                                                    dispatch({ type: ENDTIME, value: e.target.value })
                                                }}></input>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        : ''}
                </Col>
            </Row >

            <Row>
                <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ marginTop: '10px' }}>
                    <div>
                        <button id='analytics' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray' }} onClick={() => {
                            setclickbtn2(true)


                        }}> <TroubleshootIcon style={{ marginRight: '10px' }} />Analytics <ArrowDropDownIcon style={{ marginLeft: '10px' }} /></button>
                    </div>

                    {btn1 === 'analytics' ?
                        <div style={{ position: 'relative', backgroundColor: '#181828', padding: '10px', marginTop: '5px' }}>

                            <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: '-28px' }} />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                    <CloseIcon style={{ fontSize: '12px', color: 'white', cursor : 'pointer' }} onClick={() => {

                                        setclickbtn2(true)
                                    }} />
                                </div>
                                <p style={{ margin: 0, color: 'white' }}>Clear all</p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                <p style={{ margin: 0, color: 'white', width: '200px' }}>Person</p>
                                <input type="checkbox"></input>
                            </div>
                        </div>
                        : ''}
                </Col>
            </Row >

            <Row >

                <Col xl={12} lg={12} md={12} sm={12} xs={12} >
                    <hr style={{ borderTop: '1px solid gray' }}></hr>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button style={{ backgroundColor: '#181828', color: 'white', padding: '10px', borderRadius: '15px', border: 'none' }} onClick={() => {
                            dispatch({ type: PAGE, value: 0 })
                            dispatch({ type: APPLY, value: !apply })
                        }}>Apply</button>
                    </div>
                </Col>
            </Row>
        </>

    )
}
