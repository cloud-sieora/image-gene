import React, { useState, useEffect } from 'react'
import {
    Row,
    Col,
} from "react-bootstrap";
import CloseIcon from '@mui/icons-material/Close';
import Live from './Live'
import Vehicle_history from './Vehicle_history'
import Database from './Database'
import Vehicle_alert from './Vehicle_alert'
import Modal from '@mui/material/Modal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import * as api from '../../Configurations/Api_Details'
import Skeleton from 'react-loading-skeleton';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import '../style.css';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';

export default function Index() {
    const userData = JSON.parse(localStorage.getItem("userData"))
    const [page_flag, setpage_flag] = useState('live')
    const [first_hour, setfirst_hour] = useState()
    const [first_rate, setfirst_rate] = useState()
    const [next_hour, setnext_hour] = useState()
    const [next_rate, setnext_rate] = useState()
    const [site_name, setsite_name] = useState({ name: '', id: '' })
    const [name, setname] = useState('Two Wheeler')
    const [ind, setind] = useState(0)
    const [tarif_creation_model, settarif_creation_model] = useState(0)
    const [tarif_model, settarif_model] = useState(false)
    const [tarif_type, settarif_type] = useState('new')
    const [flag, setflag] = useState(false)
    const [alert_box, setalert_box] = useState(false)
    const [alert_text, setalert_text] = useState('')
    const [data, setdata] = useState([])
    const [selected_sites, setselected_sites] = useState([])
    const [overtime_toggle, setovertime_toggle] = useState(false)
    const [site_list, setsite_list] = useState([])
    const [site_list1, setsite_list1] = useState([])
    const [skeleton, setskeleton] = useState(false)
    const [overtime_creation_model, setovertime_creation_model] = useState(false)
    const [overtime_model, setovertime_model] = useState(false)
    const [group_list, setgroup_list] = useState([])
    const [flag_type, setflag_type] = useState('')
    const [tag_type, settag_type] = useState(false)
    const [tags_list, settags_list] = useState([])
    const [tags_list1, settags_list1] = useState([])
    const [tags_array, settags_array] = useState([])

    useEffect(() => {
        get_group_list()
    }, [])

    function get_group_list() {

        if (userData.position_type == 'Client' || userData.position_type == 'Client Admin') {

            let getStocksData = {
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
                    setgroup_list(response.data)
                    setskeleton(true)
                    if (response.data.length !== 0) {
                        setselected_sites([response.data[0]])

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
        } else {
            let data = []
            let count = 0
            JSON.parse(localStorage.getItem("userData")).site_id.map((val) => {
                let getStocksData = {
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
                            setskeleton(true)
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

    useEffect(() => {
        let getStocksData = {}
        if (flag_type == 'tag') {
            getStocksData = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${api.VEHICLE_TAG_LIST_CLIENT_ID_API}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    user_id: userData.position_type == 'Client' ? userData._id : userData.clientt_id,
                }
            }
        } else if (flag_type == 'overtime') {
            getStocksData = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${api.VEHICLE_OVERTIME_CLIENT_ID_API}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    client_id: userData.position_type == 'Client' ? userData._id : userData.clientt_id,
                }
            }
        } else {
            getStocksData = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${api.LIST_TARIF_CLIENT_ID}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    client_id: userData.position_type == 'Client' ? userData._id : userData.clientt_id,
                }
            }
        }

        axios(getStocksData)
            .then(response => {
                console.log(response.data);
                setdata(response.data)
            })
            .catch(function (e) {
                if (e.message === 'Network Error') {
                    alert("No Internet Found. Please check your internet connection")
                }
                else {
                    alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                }

            });
    }, [flag])

    return (
        <div>
            <Modal
                open={tarif_creation_model}
                onClose={() => {
                    settarif_creation_model(false)
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ marginLeft: 'auto', marginRight: 'auto', height: 550, width: '55%', top: 120, }}>
                <div style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <div style={{ backgroundColor: '#e22747', color: 'white', display: 'flex', justifyContent: 'flex-end', padding: '10px', alignItems: 'center' }}>
                                <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                    settarif_creation_model(false)
                                }} />

                            </div>
                        </Col>
                    </Row>

                    <Row style={{ padding: '5px' }}>

                        {
                            flag_type != 'tag' ?
                                <>
                                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                        <div>
                                            <div style={{ position: 'relative', zIndex: 2 }}>
                                                <p style={{ color: 'black', marginBottom: '5px' }}>Vehicle Type</p>
                                                <p type='text' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', width: '100%' }} onClick={() => {
                                                    if (document.getElementById(`tarif_name`).style.display !== 'none') {
                                                        document.getElementById(`tarif_name`).style.display = 'none'
                                                    } else {
                                                        document.getElementById(`tarif_name`).style.display = 'block'
                                                    }

                                                }}>{name}<span><ArrowDropDownIcon /></span></p>

                                                <div id={`tarif_name`} style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', maxHeight: '150px', overflowY: 'scroll' }}>
                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                        setname('Two Wheeler')
                                                    }
                                                    }>Two Wheeler</p>
                                                    <hr></hr>
                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                        setname('Four Wheeler')
                                                    }
                                                    }>Four Wheeler</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>

                                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                        <div>
                                            <div style={{ position: 'relative', zIndex: 2 }}>
                                                <p style={{ color: 'black', marginBottom: '5px' }}>Select Site</p>
                                                <p type='text' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', width: '100%' }} onClick={() => {
                                                    if (document.getElementById(`site_name`).style.display !== 'none') {
                                                        document.getElementById(`site_name`).style.display = 'none'
                                                    } else {
                                                        document.getElementById(`site_name`).style.display = 'block'
                                                    }

                                                }}>{site_name.name}<span><ArrowDropDownIcon /></span></p>

                                                <div id={`site_name`} style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', maxHeight: '150px', overflowY: 'scroll' }}>
                                                    {
                                                        site_list.length !== 0 ?
                                                            <div>
                                                                {
                                                                    site_list.map((sites, siteIndex) => (

                                                                        <div key={siteIndex} >
                                                                            <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                setsite_name({ name: sites.site_name, id: sites._id })

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
                                            </div>
                                        </div>
                                    </Col>
                                </>
                                :
                                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <div>
                                        <div style={{ position: 'relative', zIndex: 2 }}>
                                            <p style={{ color: 'black', marginBottom: '5px' }}>Add Tag</p>
                                            {
                                                tag_type ?
                                                    <input type='text' placeholder='Enter Tag Name' disabled={name == 'Block List' ? true : false} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                        setname(e.target.value)
                                                    }} value={name} ></input>
                                                    :
                                                    <>
                                                        <p type='text' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', width: '100%' }} onClick={() => {
                                                            if (document.getElementById(`tag_name`).style.display !== 'none') {
                                                                document.getElementById(`tag_name`).style.display = 'none'
                                                            } else {
                                                                document.getElementById(`tag_name`).style.display = 'block'
                                                            }

                                                        }}>{name}<span><ArrowDropDownIcon /></span></p>

                                                        <div id={`tag_name`} style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', maxHeight: '150px', overflowY: 'scroll' }}>
                                                            <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                setname('Block List')
                                                                document.getElementById(`tag_name`).style.display = 'none'

                                                            }}>Block List</p>
                                                            <hr></hr>
                                                            <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                settag_type(true)
                                                                setname('')
                                                            }}>Others</p>
                                                        </div>
                                                    </>
                                            }

                                        </div>
                                    </div>
                                </Col>
                        }

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>First hour</p>
                                <input type='number' placeholder='0' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                    setfirst_hour(e.target.value)
                                }} value={first_hour} ></input>
                            </div>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>First rate</p>
                                <input type='number' placeholder='0' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                    setfirst_rate(e.target.value)
                                }} value={first_rate} ></input>
                            </div>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>Next hour</p>
                                <input type='number' placeholder='0' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                    setnext_hour(e.target.value)
                                }} value={next_hour} ></input>
                            </div>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>Next Rate</p>
                                <input type='number' placeholder='0' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                    setnext_rate(e.target.value)
                                }} value={next_rate} ></input>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <button style={{ backgroundColor: '#e22747', color: 'white', border: 'none', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', width: '100%', padding: '5px' }} onClick={() => {
                                if (name != '' && first_hour != '' && first_rate != "" && next_hour != "" && next_rate != "") {
                                    let getStocksData = {}
                                    if (flag_type == 'tag') {
                                        getStocksData = {
                                            method: tarif_type == 'new' ? 'post' : 'put',
                                            maxBodyLength: Infinity,
                                            url: tarif_type == 'new' ? `${api.VEHICLE_TAG_API_CREATE}` : `${api.VEHICLE_TAG_API_CREATE}${data[ind]._id}`,
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            data: {
                                                tag_name: name,
                                                user_id: userData.position_type == 'Client' ? userData._id : userData.clientt_id,
                                                site_id: site_name.id,
                                                first: {
                                                    time: first_hour,
                                                    rate: first_rate
                                                },
                                                next: {
                                                    time: next_hour,
                                                    rate: next_rate
                                                },
                                            }
                                        }
                                    } else {
                                        getStocksData = {
                                            method: tarif_type == 'new' ? 'post' : 'put',
                                            maxBodyLength: Infinity,
                                            url: tarif_type == 'new' ? `${api.TARIF_CREATION}` : `${api.TARIF_CREATION}${data[ind]._id}`,
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            data: {
                                                name: name,
                                                client_id: userData.position_type == 'Client' ? userData._id : userData.clientt_id,
                                                site_id: site_name.id,
                                                first: {
                                                    time: first_hour,
                                                    rate: first_rate
                                                },
                                                next: {
                                                    time: next_hour,
                                                    rate: next_rate
                                                },
                                            }
                                        }
                                    }

                                    console.log(getStocksData);
                                    axios(getStocksData)
                                        .then(response => {
                                            console.log(response.data);

                                            if (response.data.success == true) {
                                                settag_type(false)
                                                settarif_creation_model(false)
                                                setflag(!flag)

                                            } else {
                                                alert('Date is already Entered')
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
                                    alert('fill the required field')
                                }

                            }}>Save</button>
                        </Col>
                    </Row>
                </div>
            </Modal >


            <Modal
                open={tarif_model}
                onClose={() => {
                    settarif_model(false)
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ marginLeft: 'auto', marginRight: 'auto', height: 550, width: '90%', top: 20, }}>
                <div style={{ backgroundColor: 'white', borderRadius: '5px', height: 550, }}>
                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <div style={{ color: 'black', display: 'flex', justifyContent: 'flex-end', padding: '10px', alignItems: 'center' }}>
                                <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                    settarif_model(false)
                                }} />

                            </div>
                        </Col>
                    </Row>

                    <Row style={{ padding: '5px' }}>

                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <button style={{ backgroundColor: '#e22747', color: 'white', padding: '5px', borderRadius: '20px', border: '1px solid gray', marginBottom: '10px' }} onClick={() => {
                                settarif_type('new')
                                settarif_creation_model(true)
                            }}>Add</button>
                        </Col>


                        <Col xl={12} lg={12} md={12} sm={12} xs={12} >
                            <table style={{ width: '100%', backgroundColor: 'white' }}>
                                <tr style={{ backgroundColor: '#e6e8eb', color: 'black' }}>
                                    <th style={{ padding: '15px' }}>{flag_type == 'tag' ? 'Tag Name' : 'Name'}</th>
                                    <th style={{ padding: '15px' }}>First Hour</th>
                                    <th style={{ padding: '15px' }}>First Rate</th>
                                    <th style={{ padding: '15px' }}>Next Hour</th>
                                    <th style={{ padding: '15px' }}>Next Rate</th>
                                    <th style={{ padding: '15px' }}>Action</th>
                                </tr>

                                {
                                    flag_type != 'overtime' ?
                                        data.map((val, i) => {
                                            return (
                                                <tr style={{ borderBottom: '1px solid grey', color: 'black' }}>
                                                    <td style={{ padding: '15px' }}>{flag_type == 'tag' ? val.tag_name : val.name}</td>
                                                    <td style={{ padding: '15px' }}>{val.first.time}</td>
                                                    <td style={{ padding: '15px' }}>{val.first.rate}</td>
                                                    <td style={{ padding: '15px' }}>{val.next.time}</td>
                                                    <td style={{ padding: '15px' }}>{val.next.rate}</td>
                                                    <td style={{ padding: '15px', color: 'red' }}>
                                                        <div style={{ display: 'flex' }}>
                                                            <div style={{ backgroundColor: '#e22747', border: '1px solid grey', borderRadius: '5px', marginRight: '5px', cursor: 'pointer' }} onClick={() => {
                                                                let access = userData.operation_type.filter((val) => { return val == 'Edit' || val == 'All' })
                                                                if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Edit' || access[1] == 'Edit') {
                                                                    let site = { name: '', id: '' }

                                                                    if (flag_type != 'tag') {
                                                                        site_list.map((value) => {
                                                                            if (value._id == val.site_id) {
                                                                                site = { name: value.site_name, id: value._id }
                                                                            }
                                                                        })
                                                                        setname(val.name)
                                                                    } else {
                                                                        setname(val.tag_name)
                                                                    }


                                                                    setfirst_hour(val.first.time)
                                                                    setfirst_rate(val.first.rate)
                                                                    setnext_hour(val.next.time)
                                                                    setnext_rate(val.next.rate)
                                                                    settag_type(true)
                                                                    setsite_name(site)
                                                                    settarif_creation_model(true)
                                                                    setind(i)
                                                                    settarif_type('edit')
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

                                                                    const getStocksData = {
                                                                        method: 'delete',
                                                                        maxBodyLength: Infinity,
                                                                        url: flag_type == 'tag' ? `${api.VEHICLE_TAG_API_CREATE}${val._id}` : `${api.TARIF_CREATION}${val._id}`,
                                                                        headers: {
                                                                            'Content-Type': 'application/json'
                                                                        },
                                                                    }
                                                                    axios(getStocksData)
                                                                        .then(response => {
                                                                            console.log(response.data);
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
                                        : ''
                                }

                            </table>

                        </Col>
                    </Row>
                </div>
            </Modal>

            <Modal
                open={overtime_creation_model}
                onClose={() => {
                    setovertime_creation_model(false)
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ marginLeft: 'auto', marginRight: 'auto', height: 550, width: '55%', top: 120, }}>
                <div style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <div style={{ backgroundColor: '#e22747', color: 'white', display: 'flex', justifyContent: 'flex-end', padding: '10px', alignItems: 'center' }}>
                                <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                    setovertime_creation_model(false)
                                }} />

                            </div>
                        </Col>
                    </Row>

                    <Row style={{ padding: '5px' }}>


                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>Hour</p>
                                <input type='number' placeholder='0' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                    setname(e.target.value)
                                }} value={name} ></input>
                            </div>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>Tags</p>
                                <div style={{ position: 'relative', zIndex: 3 }}>
                                    <p type='text' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '8px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', overflowX: 'scroll', cursor: 'pointer', marginBottom: 0 }} onClick={() => {
                                        if (document.getElementById('operation_type').style.display !== 'none') {
                                            document.getElementById('operation_type').style.display = 'none'
                                        } else {
                                            document.getElementById('operation_type').style.display = 'block'
                                        }

                                    }}>
                                        {
                                            tags_array.length != 0 ?
                                                tags_array.map((value) => (
                                                    <span style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '5px', borderRadius: '20px', border: '1px solid gray', marginRight: '10px', display: 'flex', alignItems: 'center', fontSize: '13px' }}> {value.tag_name} <CloseIcon style={{ color: 'black', fontSize: '15px', cursor: 'pointer', marginLeft: '5px', cursor: 'pointer' }} onClick={() => {
                                                        let data = []
                                                        for (let index = 0; index < tags_array.length; index++) {
                                                            if (value._id !== tags_array[index]._id) {
                                                                data.push(tags_array[index])
                                                            }
                                                        }
                                                        settags_array(data)
                                                        settags_list([...tags_list, value])
                                                    }}></CloseIcon></span>
                                                ))
                                                :
                                                <span style={{ color: 'grey' }}>Select Tags</span>
                                        }
                                    </p>

                                    <div id='operation_type' style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', maxHeight: '100px', overflowY: 'scroll' }}>
                                        {
                                            tags_list.map((val) => (
                                                <div>
                                                    <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                        document.getElementById('operation_type').style.display = 'none'
                                                        let data = []
                                                        for (let index = 0; index < tags_list.length; index++) {
                                                            if (val._id !== tags_list[index]._id) {
                                                                data.push(tags_list[index])
                                                            }
                                                        }
                                                        settags_list(data)
                                                        settags_array([...tags_array, val])
                                                    }}>{val.tag_name}</p>
                                                    <hr></hr>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div>
                                <div style={{ position: 'relative', zIndex: 2 }}>
                                    <p style={{ color: 'black', marginBottom: '5px' }}>Select Site</p>
                                    <p type='text' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', width: '100%' }} onClick={() => {
                                        if (document.getElementById(`site_name`).style.display !== 'none') {
                                            document.getElementById(`site_name`).style.display = 'none'
                                        } else {
                                            document.getElementById(`site_name`).style.display = 'block'
                                        }

                                    }}>{site_name.name}<span><ArrowDropDownIcon /></span></p>

                                    <div id={`site_name`} style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', maxHeight: '150px', overflowY: 'scroll' }}>
                                        {
                                            site_list.length !== 0 ?
                                                <div>
                                                    {
                                                        site_list.map((sites, siteIndex) => (

                                                            <div key={siteIndex} >
                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                    setsite_name({ name: sites.site_name, id: sites._id })

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
                                </div>
                            </div>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div>
                                <p style={{ color: 'black', marginBottom: '5px' }}>No overtime alert</p>
                                <div style={{ backgroundColor: overtime_toggle != false ? '#42cf10' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: overtime_toggle != false ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }} onClick={() => {

                                    setovertime_toggle(!overtime_toggle)
                                }}>
                                    <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <button style={{ backgroundColor: '#e22747', color: 'white', border: 'none', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', width: '100%', padding: '5px' }} onClick={() => {
                                if (name != '' && site_name.id != '' && tags_array.length != 0) {
                                    let tag_ids = []
                                    tags_array.map((val) => {
                                        tag_ids.push(val._id)
                                    })

                                    let getStocksData = {
                                        method: tarif_type == 'new' ? 'post' : 'put',
                                        maxBodyLength: Infinity,
                                        url: tarif_type == 'new' ? `${api.VEHICLE_OVERTIME_CREATION_API}` : `${api.VEHICLE_OVERTIME_CREATION_API}${data[ind]._id}`,
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        data: {
                                            time: name,
                                            client_id: userData.position_type == 'Client' ? userData._id : userData.clientt_id,
                                            site_id: site_name.id,
                                            tag_enable: overtime_toggle,
                                            tags: tag_ids
                                        }
                                    }


                                    console.log(getStocksData);
                                    axios(getStocksData)
                                        .then(response => {
                                            console.log(response.data);

                                            if (response.data.success == true) {
                                                settag_type(false)
                                                setovertime_creation_model(false)
                                                setflag(!flag)

                                            } else {
                                                alert('Date is already Entered')
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
                                    alert('fill the required field')
                                }

                            }}>Save</button>
                        </Col>
                    </Row>
                </div>
            </Modal >

            <Modal
                open={overtime_model}
                onClose={() => {
                    setovertime_model(false)
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ marginLeft: 'auto', marginRight: 'auto', height: 550, width: '90%', top: 20, }}>
                <div style={{ backgroundColor: 'white', borderRadius: '5px', height: 550, }}>
                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <div style={{ color: 'black', display: 'flex', justifyContent: 'flex-end', padding: '10px', alignItems: 'center' }}>
                                <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                    setovertime_model(false)
                                }} />

                            </div>
                        </Col>
                    </Row>

                    <Row style={{ padding: '5px' }}>

                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <button style={{ backgroundColor: '#e22747', color: 'white', padding: '5px', borderRadius: '20px', border: '1px solid gray', marginBottom: '10px' }} onClick={() => {
                                settarif_type('new')
                                setovertime_creation_model(true)
                            }}>Add</button>
                        </Col>


                        <Col xl={12} lg={12} md={12} sm={12} xs={12} >
                            <table style={{ width: '100%', backgroundColor: 'white' }}>
                                <tr style={{ backgroundColor: '#e6e8eb', color: 'black' }}>
                                    <th style={{ padding: '15px' }}>Time</th>
                                    <th style={{ padding: '15px' }}>Site</th>
                                    <th style={{ padding: '15px' }}>Tags</th>
                                    <th style={{ padding: '15px' }}>Action</th>
                                </tr>

                                {
                                    flag_type == 'overtime' ?
                                        data.map((val, i) => {
                                            let site_name = ''
                                            let tag_name = ''

                                            site_list.map((value) => {
                                                if (value._id == val.site_id) {
                                                    site_name = value.site_name
                                                }
                                            })
                                            tags_list1.map((value) => {
                                                val.tags.map((id) => {
                                                    if (value._id == id) {
                                                        tag_name = `${tag_name}, ${value.tag_name}`
                                                    }
                                                })
                                            })

                                            return (
                                                <tr style={{ borderBottom: '1px solid grey', color: 'black' }}>
                                                    <td style={{ padding: '15px' }}>{val.time}</td>
                                                    <td style={{ padding: '15px' }}>{site_name}</td>
                                                    <td style={{ padding: '15px' }}>{tag_name}</td>
                                                    <td style={{ padding: '15px', color: 'red' }}>
                                                        <div style={{ display: 'flex' }}>
                                                            <div style={{ backgroundColor: '#e22747', border: '1px solid grey', borderRadius: '5px', marginRight: '5px', cursor: 'pointer' }} onClick={() => {
                                                                let access = userData.operation_type.filter((val) => { return val == 'Edit' || val == 'All' })
                                                                if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Edit' || access[1] == 'Edit') {
                                                                    let site = { name: '', id: '' }

                                                                    site_list.map((value) => {
                                                                        if (value._id == val.site_id) {
                                                                            site = { name: value.site_name, id: value._id }
                                                                        }
                                                                    })

                                                                    let tag_list = []
                                                                    let tag_droup_list = []

                                                                    tags_list.map((tag) => {
                                                                        let flag = false
                                                                        val.tags.map((value) => {
                                                                            if (value == tag._id) {
                                                                                flag = true
                                                                                tag_list.push(tag)
                                                                            }
                                                                        })

                                                                        if (!flag) {
                                                                            tag_droup_list.push(tag)
                                                                        }
                                                                    })
                                                                    settags_list(tag_droup_list)

                                                                    setname(val.time)
                                                                    settags_array(tag_list)
                                                                    setovertime_toggle(val.tag_enable)
                                                                    settag_type(true)
                                                                    setsite_name(site)
                                                                    setovertime_creation_model(true)
                                                                    setind(i)
                                                                    settarif_type('edit')
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

                                                                    const getStocksData = {
                                                                        method: 'delete',
                                                                        maxBodyLength: Infinity,
                                                                        url: `${api.VEHICLE_OVERTIME_CREATION_API}${val._id}`,
                                                                        headers: {
                                                                            'Content-Type': 'application/json'
                                                                        },
                                                                    }
                                                                    axios(getStocksData)
                                                                        .then(response => {
                                                                            console.log(response.data);
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
                                        : ''
                                }

                            </table>

                        </Col>
                    </Row>
                </div>
            </Modal>

            {/* <Modal
                open={tag_model}
                onClose={() => {
                    settag_model(false)
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ marginLeft: 'auto', marginRight: 'auto', height: 550, width: '90%', top: 20, }}>
                <div style={{ backgroundColor: 'white', borderRadius: '5px', height: 550, }}>
                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <div style={{ color: 'black', display: 'flex', justifyContent: 'flex-end', padding: '10px', alignItems: 'center' }}>
                                <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                    settag_model(false)
                                }} />

                            </div>
                        </Col>
                    </Row>

                    <Row style={{ padding: '5px' }}>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex' }}>

                            <div style={{ position: 'relative' }}>
                                <button className='eventbtn' onClick={() => {
                                    setcreate_tag(!create_tag)
                                }} style={{ display: 'flex', backgroundColor: create_tag ? '#e32747' : '#e6e8eb', color: create_tag ? 'white' : 'black' }}> <TuneOutlinedIcon style={{ marginRight: '10px' }} />{'Create Tag'}<ArrowDropDownIcon style={{ marginLeft: '10px' }} /></button>

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
                                                <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '5px' }}>{'Create Tag'}</p>
                                                <input type='text' value={tag_name} placeholder='Enter tag name' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray' }} onChange={(e) => {
                                                    settag_name(e.target.value)
                                                }}></input>
                                            </div>

                                            <div style={{ display: 'flex' }}>
                                                <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginRight: '10px' }}>Parking Fees</p>
                                                <input type='checkbox' value={tag_name} placeholder='Enter tag name' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray' }} onChange={(e) => {
                                                    setparking_fees(!parking_fees)
                                                }}></input>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <button style={{ backgroundColor: '#e32747', color: 'white', padding: '10px', borderRadius: '15px', border: 'none', marginTop: '10px' }} onClick={() => {
                                                    const axios = require('axios');
                                                    let data = JSON.stringify({
                                                        'tag_name': tag_name,
                                                        "user_id": userData._id
                                                    })

                                                    let config = {
                                                        method: 'post',
                                                        maxBodyLength: Infinity,
                                                        url: api.TAG_API_CREATE,
                                                        headers: {
                                                            'Content-Type': 'application/json'
                                                        },
                                                        data: data
                                                    };

                                                    // console.log(config);

                                                    axios.request(config)
                                                        .then((response) => {
                                                            // console.log(JSON.stringify(response.data));
                                                            // get_tag_list()
                                                            // settag_name('')
                                                            // settag_list([])
                                                            setcreate_tag(!create_tag)
                                                        })
                                                        .catch((error) => {
                                                            console.log(error);
                                                        })
                                                }}>Add Tag</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal> */}

            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex' }}>
                        <p style={{ backgroundColor: page_flag == 'live' ? 'white' : '#e6e8eb', display: 'inline-block', padding: '5px', cursor: 'pointer', fontSize: '17px', margin: 0, borderTopLeftRadius: page_flag == 'live' ? '5px' : '0px', borderTopRightRadius: page_flag == 'live' ? '5px' : '0px', paddingLeft: '15px', paddingRight: '15px' }} onClick={() => { setpage_flag('live') }}>Live</p>
                        <p style={{ backgroundColor: page_flag == 'history' ? 'white' : '#e6e8eb', display: 'inline-block', padding: '5px', cursor: 'pointer', fontSize: '17px', margin: 0, borderTopLeftRadius: page_flag == 'history' ? '5px' : '0px', borderTopRightRadius: page_flag == 'history' ? '5px' : '0px', paddingLeft: '15px', paddingRight: '15px' }} onClick={() => { setpage_flag('history') }}>History</p>
                        <p style={{ backgroundColor: page_flag == 'database' ? 'white' : '#e6e8eb', display: 'inline-block', padding: '5px', cursor: 'pointer', fontSize: '17px', margin: 0, borderTopLeftRadius: page_flag == 'database' ? '5px' : '0px', borderTopRightRadius: page_flag == 'database' ? '5px' : '0px', paddingLeft: '15px', paddingRight: '15px' }} onClick={() => { setpage_flag('database') }}>Database</p>
                        <p style={{ backgroundColor: page_flag == 'alert' ? 'white' : '#e6e8eb', display: 'inline-block', padding: '5px', cursor: 'pointer', fontSize: '17px', margin: 0, borderTopLeftRadius: page_flag == 'alert' ? '5px' : '0px', borderTopRightRadius: page_flag == 'alert' ? '5px' : '0px', paddingLeft: '15px', paddingRight: '15px' }} onClick={() => { setpage_flag('alert') }}>Alert</p>
                    </div>

                    <div style={{ display: 'flex' }}>
                        <button style={{ backgroundColor: '#e22747', color: 'white', padding: '5px', borderRadius: '20px', border: '1px solid gray', marginRight: '10px' }} onClick={() => {
                            settarif_model(true)
                            setflag_type('tarif')
                            setname('Two Wheeler')
                            setflag(!flag)
                        }}>Add Tarif</button>

                        <button style={{ backgroundColor: '#e22747', color: 'white', padding: '5px', borderRadius: '20px', border: '1px solid gray', marginRight: '10px' }} onClick={() => {
                            settarif_model(true)
                            setflag_type('tag')
                            setname('')
                            setflag(!flag)
                        }}>Add Tags</button>

                        <button style={{ backgroundColor: '#e22747', color: 'white', padding: '5px', borderRadius: '20px', border: '1px solid gray', }} onClick={() => {

                            const getStocksData = {
                                method: 'post',
                                maxBodyLength: Infinity,
                                url: `${api.VEHICLE_TAG_LIST_CLIENT_ID_API}`,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                data: {
                                    user_id: userData.position_type == 'Client' ? userData._id : userData.clientt_id,
                                }
                            }

                            axios(getStocksData)
                                .then(response => {
                                    console.log(response.data);
                                    setdata([])
                                    settags_list(response.data)
                                    settags_list1(response.data)
                                    setovertime_model(true)
                                    setflag_type('overtime')
                                    setname('')
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
                        }}>Overtime Config</button>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', height: '88vh', width: '100%', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', borderTopRightRadius: '5px', paddingTop: '10px' }}>
                    {
                        page_flag == 'live' ?
                            <Live />
                            : page_flag == 'history' ?
                                < Vehicle_history />
                                : page_flag == 'database' ?
                                    <Database />
                                    : page_flag == 'alert' ?
                                        <Vehicle_alert />
                                        : ''
                    }
                </div>
            </div>
        </div>
    )
}
