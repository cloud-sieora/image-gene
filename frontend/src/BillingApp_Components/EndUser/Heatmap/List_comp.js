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
import * as api from '../../Configurations/Api_Details'
import { useDispatch, useSelector } from 'react-redux'
import '../style.css';
import axios from 'axios'
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { CreateBucketCommand, S3Client, GetObjectCommand, ListBucketsCommand, DeleteBucketCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default function PersonList({ time_chk }) {
    const dispatch = useDispatch()
    const fileRef = React.useRef();
    const userData = JSON.parse(localStorage.getItem("userData"))
    const [cameras, setcameras] = useState([]);
    const [open1, setOpen1] = useState(false);
    const [opendelete, setOpendelete] = useState(false);
    const [opencamera, setOpencamera] = useState(false);

    const [cameras_view1, setcameras_view1] = useState([])
    const [data, setdata] = useState([]);
    const [cameras_view, setcameras_view] = useState([])
    const [camera_serach, setcamera_serach] = useState([])
    const [skeleton, setskeleton] = useState(true)

    const [roughData, setRoughData] = useState([])
    const [alert_box, setalert_box] = useState(false)
    const [res, setres] = useState('')
    const [btn1, setbtn1] = useState('')
    const { page, startdate, starttime, enddate, endtime, apply, select, selected_cameras } = useSelector((state) => state)
    let split_start_date = startdate.split('-')
    let split_end_date = enddate.split('-')
    const [clickbtn1, setclickbtn1] = useState(false)
    const [clickbtn2, setclickbtn2] = useState(false)
    const [viewstart_date, setviewstart_date] = useState(false);
    const [viewend_date, setviewend_date] = useState(false);
    const alertClose = () => setalert_box(false)


    const [username_pass_model, setusername_pass_model] = useState(false);
    const [isChooseMode, setIsChooseMode] = useState(false)
    const [isOpenMannualModel, setIsOpenMannualModel] = useState(false)
    const [camera_save_loader, setcamera_save_loader] = useState(false)

    let initialDataMannullyArray = {
        cameraId: 0,
        user_name: {
            userName: '',
            userId: ''
        },
        user_id: '',
        in_time: '',
        out_time: '',
        date: '',
        site: {
            siteName: '',
            siteId: ''
        }
    }


    const [addCameraMannullyArray, setAddCameraMannullyArray] = useState([])

    const handleAddCameraManually = () => {
        let count = addCameraMannullyArray.length + 1
        let indexCount = addCameraMannullyArray.length
        setAddCameraMannullyArray([...addCameraMannullyArray, { ...initialDataMannullyArray, cameraId: count, index: indexCount }])

    }

    useEffect(() => {
        handleAddCameraManually()
    }, [])

    useEffect(() => {
        setdata([])
        list_camera_site_id(selected_cameras)
    }, [apply, time_chk])

    if (clickbtn1 === true) {
        if (btn1 === 'day') {
            setbtn1('')
            let btn = document.getElementById('day')
            btn.style.backgroundColor = '#f0f0f0'
            btn.style.color = 'black'
        } else if (btn1 === '' || btn1 === 'analytics') {
            setbtn1('day')
            let btn = document.getElementById('day')
            btn.style.backgroundColor = '#e32747'
            btn.style.color = 'white'
        }
        setclickbtn1(false)
    } else if (clickbtn2 === true) {

        if (btn1 === 'analytics') {
            setbtn1('')
            let btn = document.getElementById('day')
            btn.style.backgroundColor = '#f0f0f0'
            btn.style.color = 'black'

        } else if (btn1 === '' || btn1 === 'day') {
            // alert('coming')
            setbtn1('analytics')
            let btn = document.getElementById('day')
            btn.style.backgroundColor = '#f0f0f0'
            btn.style.color = 'black'
        }
        setclickbtn2(false)
    }

    async function list_camera_site_id(site_id, face_id) {
        // dispatch({ type: SELECTED_CAMERAS, value: [] })
        setskeleton(false)
        let data = []
        let count = 0
        let region = []
        for (let index = 0; index < selected_cameras.length; index++) {
            if (selected_cameras[index].camera_option.people_analytics != undefined && selected_cameras[index].camera_option.people_analytics != 0) {
                for (let index1 = 0; index1 < selected_cameras[index].image_edited_people.length; index1++) {
                    // const s3Client = new S3Client({
                    //     region: "ap-south-1",
                    //     credentials: {
                    //         accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
                    //         secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
                    //     },
                    // });

                    // const image_command = new GetObjectCommand({
                    //     Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                    //     Key: selected_cameras[index].image_edited_people[index1].url,
                    // });
                    // let image_uri = ''
                    // if (db_type == 'local') {
                    //     image_uri = data.image_uri
                    // } else {
                    //     image_uri = await getSignedUrl(s3Client, image_command)
                    // }
                    region.push({ name: selected_cameras[index].image_edited_people[index1].name, id: selected_cameras[index].image_edited_people[index1].id, })
                }
            }
        }

        for (let index = 0; index < selected_cameras.length; index++) {
            const getStocksData = {
                url: api.HEATMAP_LIST_CAMERA_ID,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({

                    "camera_id": selected_cameras[index]._id,
                    "start_date": startdate,
                    "end_date": enddate,
                    "day_type": time_chk,

                })
            }

            axios(getStocksData)
                .then(async (response) => {
                    console.log(response.data);
                    if (response.data.length != 0) {
                        let img_uri = []
                        let top_data = []
                        response.data.map((val, i) => {
                            img_uri.push(val.image_uri)
                            top_data.push(val.top_data)
                        })
                        data = [...data, { camera_name: selected_cameras[index].camera_gereral_name, image_uri: img_uri, top_data: top_data }]
                    } else {
                        data = [...data, { camera_name: selected_cameras[index].camera_gereral_name, image_uri: [], top_data: [] }]
                    }
                    count = count + 1

                    if (count == selected_cameras.length) {

                        let count1 = 0
                        for (let index = 0; index < data.length; index++) {
                            let urls = []
                            for (let index1 = 0; index1 < data[index].image_uri.length; index1++) {
                                if (data[index].image_uri[index1] != 'NONE') {
                                    const s3Client = new S3Client({
                                        region: "ap-south-1",
                                        credentials: {
                                            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
                                            secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
                                        },
                                    });

                                    const image_command = new GetObjectCommand({
                                        Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                                        Key: data[index].image_uri[index1],
                                    });
                                    let image_uri = await getSignedUrl(s3Client, image_command)
                                    urls.push(image_uri)
                                }
                                data[index] = { ...data[index], image_uri: urls }
                            }
                            count1 = count1 + 1
                        }

                        if (count1 == data.length) {
                            setskeleton(true)
                            setcameras(data)
                            setskeleton(true)
                            setdata(data)
                            setcameras_view(data)
                            setcameras_view1(data)
                            setcamera_serach(data)
                            setcameras(data)
                            setRoughData(data)
                            setres('empty response')


                            if (data.length == 0) {
                                setcameras_view('no_res')
                                setcameras_view1('no_res')
                            }
                        }
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

        }

    }

    return (
        <div>
            <div>
                {/* <div style={{ backgroundColor: 'white', borderRadius: '5px', height: '88vh' }}>
                    <button>Add enrollment</button>
                </div> */}


                <Row>
                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                        <div >

                            <div>





                                {/* Cameras Data */}
                                {
                                    skeleton == true ?

                                        <Row style={{ padding: '10px', alignItems: 'center', }}>
                                            {
                                                data.map((val) => {
                                                    return (
                                                        <>
                                                            {
                                                                val.image_uri.length == 0 ?
                                                                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                        <div style={{ backgroundColor: 'white', borderRadius: '5px', paddingTop: '10px', boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", marginBottom: '10px' }}>
                                                                            <p style={{ fontWeight: 'bolder', margin: 0, marginLeft: '10px', color: '#e32747' }}>{val.camera_name}</p>
                                                                            <div style={{ textAlign: 'center', width: '100%' }}>
                                                                                <p style={{ color: '#181828' }}>A snapshot does not exist. </p>
                                                                                <p style={{ color: '#181828', fontSize: '12px', margin: '0px' }}>A snapshot will be taken next time camera is trigerred.</p>
                                                                                <p style={{ color: '#181828', fontSize: '12px', margin: '0px' }}>Pleace come back later.</p>
                                                                                <NoPhotographyIcon style={{ fontSize: '70px', color: '#a8a4a4' }} />
                                                                            </div>
                                                                        </div>
                                                                    </Col>
                                                                    :
                                                                    <>
                                                                        {
                                                                            val.image_uri.map((url, i) => (
                                                                                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                                                    <div style={{ backgroundColor: 'white', borderRadius: '5px', paddingTop: '10px', boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", marginBottom: '10px' }}>
                                                                                        <p style={{ fontWeight: 'bolder', margin: 0, marginLeft: '10px', color: '#e32747' }}>{val.camera_name}</p>
                                                                                        {
                                                                                            url != 'NONE' ?
                                                                                                <div style={{ display: 'flex', }}>
                                                                                                    <img crossorigin="anonymous" width="75%" height="75%" style={{borderRadius:'10px',marginLeft:'10px',marginBottom:'10px'}} src={url}></img>

                                                                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                                                                                        <div>
                                                                                                            {
                                                                                                                val.top_data[i].map((top) => (
                                                                                                                    <>
                                                                                                                        {
                                                                                                                            Object.keys(top).map((key) => (
                                                                                                                                <p style={{color: 'black' }}><span style={{ paddingLeft: '5px', paddingRight: '5px', borderRadius: '10px', boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",fontWeight: 'bolder', }}>{key}</span> : {top[key]} Seconds</p>
                                                                                                                            ))
                                                                                                                        }
                                                                                                                    </>
                                                                                                                ))
                                                                                                            }
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                :
                                                                                                <div style={{ textAlign: 'center', width: '100%' }}>
                                                                                                    <p style={{ color: '#181828' }}>A snapshot does not exist. </p>
                                                                                                    <p style={{ color: '#181828', fontSize: '12px', margin: '0px' }}>A snapshot will be taken next time camera is trigerred.</p>
                                                                                                    <p style={{ color: '#181828', fontSize: '12px', margin: '0px' }}>Pleace come back later.</p>
                                                                                                    <NoPhotographyIcon style={{ fontSize: '70px', color: '#a8a4a4' }} />
                                                                                                </div>
                                                                                        }
                                                                                    </div>
                                                                                </Col>
                                                                            ))
                                                                        }
                                                                    </>
                                                            }
                                                        </>
                                                    )
                                                })
                                            }

                                        </Row>

                                        : <p style={{ color: '#e32747', fontWeight: 'bolder', textAlign: 'center' }}>Loading...</p>
                                }
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
