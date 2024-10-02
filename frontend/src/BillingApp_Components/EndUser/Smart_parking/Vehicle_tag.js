import React from 'react'
import {
    Row,
    Col,
} from "react-bootstrap";

export default function Vehicle_tag() {
    return (
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
    )
}
