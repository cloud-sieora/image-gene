import React, { useState, useEffect } from 'react'
import {
    Row,
    Col,
} from "react-bootstrap";
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import * as api from '../../Configurations/Api_Details'

export default function Database() {
    const userData = JSON.parse(localStorage.getItem("userData"))
    const [tag_data, settag_data] = useState([])
    const [data, setdata] = useState([])
    const [tag, settag] = useState({ tag_name: '', id: '' })
    const [plate_number, setplate_number] = useState('')
    const [flag, setflag] = useState(false)
    const [tarif_creation_model, settarif_creation_model] = useState(false)
    const [ind, setind] = useState(0)
    const [tag_type, settag_type] = useState(false)
    const [alert_box, setalert_box] = useState(false)
    const [alert_text, setalert_text] = useState(false)
    const [tarif_type, settarif_type] = useState('new')

    useEffect(() => {
        let getStocksData = {
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
                settag_data(response.data)
            })
            .catch(function (e) {
                if (e.message === 'Network Error') {
                    alert("No Internet Found. Please check your internet connection")
                }
                else {
                    alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                }

            });
    }, [])

    useEffect(() => {
        let getStocksData = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${api.VEHICLE_DATABASE_CLIENT_ID_API}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                client_id: userData.position_type == 'Client' ? userData._id : userData.clientt_id,
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

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div style={{ marginTop: '5px' }}>
                                <p style={{ color: 'black', marginBottom: '5px' }}>Plate Number</p>
                                <input type='text' placeholder='Enter Plate number' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                    setplate_number(e.target.value)
                                }} value={plate_number} ></input>
                            </div>
                        </Col>

                        <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                            <div>
                                <div style={{ position: 'relative', zIndex: 2 }}>
                                    <p style={{ color: 'black', marginBottom: '5px' }}>Select Tags</p>
                                    <p type='text' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', width: '100%' }} onClick={() => {
                                        if (document.getElementById(`site_name`).style.display !== 'none') {
                                            document.getElementById(`site_name`).style.display = 'none'
                                        } else {
                                            document.getElementById(`site_name`).style.display = 'block'
                                        }

                                    }}>{tag.tag_name}<span><ArrowDropDownIcon /></span></p>

                                    <div id={`site_name`} style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', maxHeight: '150px', overflowY: 'scroll' }}>
                                        {
                                            tag_data.length !== 0 ?
                                                <div>
                                                    {
                                                        tag_data.map((tag) => (

                                                            <div >
                                                                <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                    settag({ tag_name: tag.tag_name, id: tag._id })
                                                                    document.getElementById(`site_name`).style.display = 'none'

                                                                }}>{tag.tag_name}</p>

                                                                <hr></hr>
                                                            </div>
                                                        ))
                                                    }
                                                </div>

                                                :
                                                <p style={{ padding: '0', margin: 0, color: 'black' }}>No Tags</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <button style={{ backgroundColor: '#e22747', color: 'white', border: 'none', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', width: '100%', padding: '5px' }} onClick={() => {
                                if (plate_number != '' && tag.id != "") {
                                    let getStocksData = {
                                        method: tarif_type == 'new' ? 'post' : 'put',
                                        maxBodyLength: Infinity,
                                        url: tarif_type == 'new' ? `${api.VEHICLE_DATABASE_CREATION_API}` : `${api.VEHICLE_DATABASE_CREATION_API}${data[ind]._id}`,
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        data: {
                                            plate_number: plate_number,
                                            client_id: userData.position_type == 'Client' ? userData._id : userData.clientt_id,
                                            tag_id: tag.id
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
            <div>
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
                                <th style={{ padding: '15px' }}>Plate Number</th>
                                <th style={{ padding: '15px' }}>Tag</th>
                                <th style={{ padding: '15px' }}>Action</th>
                            </tr>

                            {
                                data.map((val, i) => {
                                    let tag_name = ''

                                    tag_data.map((tag) => {
                                        if (tag._id == val.tag_id) {
                                            tag_name = tag.tag_name
                                        }
                                    })

                                    return (
                                        <tr style={{ borderBottom: '1px solid grey', color: 'black' }}>
                                            <td style={{ padding: '15px' }}>{val.plate_number}</td>
                                            <td style={{ padding: '15px' }}>{tag_name}</td>
                                            <td style={{ padding: '15px', color: 'red' }}>
                                                <div style={{ display: 'flex' }}>
                                                    <div style={{ backgroundColor: '#e22747', border: '1px solid grey', borderRadius: '5px', marginRight: '5px', cursor: 'pointer' }} onClick={() => {
                                                        let access = userData.operation_type.filter((val) => { return val == 'Edit' || val == 'All' })
                                                        if (access[0] == 'All' || access[1] == 'All' || access[0] == 'Edit' || access[1] == 'Edit') {
                                                            let tag = { tag_name: '', id: '' }

                                                            tag_data.map((value) => {
                                                                if (value._id == val.tag_id) {
                                                                    tag = { tag_name: value.tag_name, id: value._id }
                                                                }
                                                            })
                                                            setplate_number(val.plate_number)
                                                            settag_type(true)
                                                            settag(tag)
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
                                                                url: `${api.VEHICLE_DATABASE_CREATION_API}${val._id}`,
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
                            }

                        </table>

                    </Col>
                </Row>
            </div>
        </div>
    )
}
