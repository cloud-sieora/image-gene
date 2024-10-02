import React, { useState, useEffect } from 'react'
import {
    Row,
    Col,
} from "react-bootstrap";
import { db_type } from '../db_config'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { PAGE, STARTDATE, STARTTIME, ENDDATE, ENDTIME, APPLY, SELECT, SELECTED_CAMERAS } from '../../../store/actions'
import * as api from '../../Configurations/Api_Details'
import { useDispatch, useSelector } from 'react-redux'
import '../style.css';
import axios from 'axios'
import moment from 'moment'
import CircularProgress from '@mui/material/CircularProgress';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { CreateBucketCommand, S3Client, GetObjectCommand, ListBucketsCommand, DeleteBucketCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Skeleton from 'react-loading-skeleton';
import DateComponent from '../DateComponent'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VoiceToText from '../../resources/VoiceToText';
import io from 'socket.io-client';



let flag_type = 'add_tag'
let count = 0
let count1 = 0
let device_count = 0
let camera_list_image = []
let date_mouse = true
let interval = ''

export default function Search() {
    const dispatch = useDispatch()
    const fileRef = React.useRef();
    const fileTypes = ["JPG", "JPEG", "PNG", "GIF"]
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
    const [res, setres] = useState('')
    const [btn1, setbtn1] = useState('')
    const { page, startdate, starttime, enddate, endtime, apply, select, selected_cameras } = useSelector((state) => state)
    let split_start_date = startdate.split('-')
    let split_end_date = enddate.split('-')
    const [start_dateFullYear, setstart_dateFullYear] = useState(split_start_date[0]);
    const [start_dateMonth, setstart_dateMonth] = useState(split_start_date[1]);
    const [start_dateDate, setstart_dateDate] = useState(split_start_date[2]);
    const [end_dateFullYear, setend_dateFullYear] = useState(split_end_date[0]);
    const [end_dateMonth, setend_dateMonth] = useState(split_end_date[1]);
    const [end_dateDate, setend_dateDate] = useState(split_end_date[2]);
    const [clickbtn1, setclickbtn1] = useState(false)
    const [clickbtn2, setclickbtn2] = useState(false)
    const [viewstart_date, setviewstart_date] = useState(false);
    const [viewend_date, setviewend_date] = useState(false);
    const [aditional_info, setaditional_info] = useState(true);
    const [image_url, setimage_url] = useState('None');
    const [image_url_key, setimage_url_key] = useState('None');
    const [face_id, setface_id] = useState('');
    const [date_section, setdate_section] = useState('single')
    const [face_info, setface_info] = useState('OTHERS')
    const [user_list, setuser_list] = useState([]);
    // const [drop_image, setdrop_image] = useState('');
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

    function apply_can_fun() {
        setviewstart_date(false)
        setviewend_date(false)
    }

    useEffect(() => {
        handleAddCameraManually()
    }, [])

    useEffect(() => {
        date_mouse = true
    }, [apply])

    useEffect(() => {
        get_group_list()
    }, [])

    function initialdate(year, month, date, start_time, end_time, type) {
        if (type === 'start_date') {
            dispatch({ type: STARTDATE, value: `${year}-${month < 10 ? `0${month + 1}` : month + 1}-${date < 10 ? `0${date}` : date}` })
            setstart_dateFullYear(year)
            setstart_dateMonth(month < 10 ? `0${month + 1}` : month + 1)
            setstart_dateDate(date < 10 ? `0${date}` : date)
            setviewstart_date(!viewstart_date)
        } else if (type === 'end_date') {
            dispatch({ type: ENDDATE, value: `${year}-${month < 10 ? `0${month + 1}` : month + 1}-${date < 10 ? `0${date}` : date}` })
            setend_dateFullYear(year)
            setend_dateMonth(month < 10 ? `0${month + 1}` : month + 1)
            setend_dateDate(date < 10 ? `0${date}` : date)
            setviewend_date(!viewend_date)
        } else if (type === 'time') {
            dispatch({ type: STARTTIME, value: start_time })
            dispatch({ type: ENDTIME, value: end_time })
        }
    }

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

    function get_user(site_id) {
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
                    data = [...data, ...response.data]
                    count = count + 1

                    if (count == site_id.length) {
                        setuser_list(data)
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

    async function list_camera_site_id(site_id, face_id) {
        console.log(face_id);
        dispatch({ type: SELECTED_CAMERAS, value: [] })
        let data = []
        let count = 0


        for (let index = 0; index < site_id.length; index++) {
            const getStocksData = {
                url: face_id == '' ? api.FACE_LIST_BY_SITE_ID_DATE : api.LIST_FACE_SITE_USER_ID,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: face_id == '' ? JSON.stringify({

                    "site_id": site_id[index]._id,
                    "start_date": startdate,
                    "start_time": starttime,
                    "end_date": enddate,
                    "end_time": endtime,

                }) : JSON.stringify({

                    "site_id": site_id[index]._id,
                    "user_id": face_id,
                    "start_date": startdate,
                    "start_time": starttime,
                    "end_date": enddate,
                    "end_time": endtime,

                })
            }
            axios(getStocksData)
                .then(async response => {
                    setskeleton(true)
                    console.log(response.data);
                    data = [...data, ...response.data]
                    count = count + 1

                    if (count == site_id.length) {

                        let userList = []
                        let user_count = 0

                        for (let index = 0; index < data.length; index++) {
                            const s3Client = new S3Client({
                                region: "ap-south-1",
                                credentials: {
                                    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
                                    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
                                },
                            });

                            const image_command = new GetObjectCommand({
                                Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                                Key: data[index].image_url
                            });

                            let image_uri = ''
                            if (db_type == 'local') {
                                image_uri = data.image_uri
                            } else {
                                image_uri = await getSignedUrl(s3Client, image_command)
                            }
                            data[index].image_url = image_uri

                        }

                        console.log(data);
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
                    if (response.data.length !== 0) {
                        setselected_sites([response.data[0]])
                        list_camera_site_id([response.data[0]], face_id)
                        get_user([response.data[0]])
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



    const [faceImagesFromFast, setFaceImagesFromFast] = useState([])


    function result_prediction_image(image_path, site_id) {
        for (let index = 0; index < site_id.length; index++) {
            axios.post('http://10.147.21.167:5001/Face_Search_Api', JSON.stringify({
                data: {
                    "image_key": image_path,
                    "site_id": site_id[index],
                    "start_date": startdate,
                    "start_time": starttime,
                    "end_date": enddate,
                    "end_time": endtime,
                    "face_info": face_info,
                    "count": 50
                }
            }))
                .then(async (res) => {
                    console.log(res.data);
                    console.log('face response', res.data)
                    if (res.data.status === false) {
                        alert(res.data.data)

                    } else {

                        await axios.post('http://10.147.21.167:5008/read_image_from_path', res.data.data).then((res) => {
                            // await axios.post('http://localhost:5008/read_image_from_path', res.data.data).then((res) => {
                            console.log('resposne from image', res.data.data)
                            setFaceImagesFromFast(res.data.data)
                        }).catch((err) => {
                            console.log('err', err)
                        })
                        // setdrop_image('')
                    }
                })
                .catch(function (e) {
                    console.log(e)
                });
        }
    }


    function result_prediction_image_other(image_path, site_id) {
        for (let index = 0; index < site_id.length; index++) {
            axios.post(api.GET_IMAGES_FOR_IMAGE_SEARCH, JSON.stringify({
                data: {
                    "image_key": image_path,
                    "site_id": site_id[index],
                    "start_date": startdate,
                    "start_time": starttime,
                    "end_date": enddate,
                    "end_time": endtime,
                    "face_info": face_info,
                    "count": 50,
                    "input_info": "image"
                }
            }))
                .then(async (res) => {
                    console.log(res.data);
                    console.log('face response', res.data)
                    if (res.data.status === false) {
                        alert(res.data.data)

                    } else {

                        await axios.post('http://10.147.21.167:5008/read_image_from_path', res.data.data).then((res) => {
                            // await axios.post('http://localhost:5008/read_image_from_path', res.data.data).then((res) => {
                            console.log('resposne from image', res.data.data)
                            setFaceImagesFromFast(res.data.data)
                        }).catch((err) => {
                            console.log('err', err)
                        })
                        // setdrop_image('')
                    }
                })
                .catch(function (e) {
                    console.log(e)
                });
        }
    }


    const [drop_image, setDropImage] = useState(null);
    const [testSearchImage, setTextImageSearch] = useState('')
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedType, setSelectedType] = useState('other');
    const [isRecording, setIsRecording] = useState(false)

    console.log('selected type', selectedType)

    // Function to handle file upload
    const handleFileUpload = async (file) => {
        displayImage(file)
        try {
            if (selectedType === 'face') {
                const formData = new FormData();
                formData.append('image', file);

                fetch('http://10.147.21.167:5008/upload_image', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Upload successful:', data);
                        // Display the image in the container
                        ;
                        result_prediction_image(data.path, selected_sites);
                    })
                    .catch(error => {
                        console.error('Error uploading image:', error);
                    });
            } else if (selectedType === 'other') {
                const formData = new FormData();
                formData.append('image', file);

                fetch('http://10.147.21.167:5008/upload_image', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Upload successful:', data);
                        // Display the image in the container
                        ;
                        result_prediction_image_other(data.path, selected_sites);
                    })
                    .catch(error => {
                        console.error('Error uploading image:', error);
                    });
            }
        } catch (err) {
            console.log('err', err)
        }
    };

    const handleChangeTextSearchImage = async (e) => {
        setTextImageSearch(e.target.value)
    }


    useEffect(() => {
        handleCallingTextImageData()
    }, [testSearchImage])

    const handleCallingTextImageData = async () => {
        if (selectedType === 'other') {

            let site_id = selected_sites

            for (let index = 0; index < site_id.length; index++) {
                axios.post(api.GET_IMAGES_FOR_IMAGE_SEARCH, JSON.stringify({
                    data: {
                        "image_key": testSearchImage,
                        "site_id": site_id[index],
                        "start_date": startdate,
                        "start_time": starttime,
                        "end_date": enddate,
                        "end_time": endtime,
                        "face_info": face_info,
                        "count": 50,
                        "input_info": "text"
                    }
                }))
                    .then(async (res) => {
                        console.log(res.data);
                        console.log('face response', res.data)
                        if (res.data.status === false) {
                            alert(res.data.data)

                        } else {

                            await axios.post('http://10.147.21.167:5008/read_image_from_path', res.data.data).then((res) => {
                                // await axios.post('http://localhost:5008/read_image_from_path', res.data.data).then((res) => {
                                console.log('resposne from image', res.data.data)
                                setFaceImagesFromFast(res.data.data)
                            }).catch((err) => {
                                console.log('err', err)
                            })
                            // setdrop_image('')
                        }
                    })
                    .catch(function (e) {
                        console.log(e)
                    });
            }
        }
    }

    // Function to display the image
    const displayImage = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result); // Set the image preview
        };
        reader.readAsDataURL(file); // Read the file as a Data URL (base64 encoded image)
    };

    // Handle file input change
    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file); // Call upload function and display image
        }
    };

    // Handle drag and drop
    const onDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file); // Call upload function and display image
        }
    };




    return (
        <div onClick={(event) => {

            if (!date_mouse) {
                date_mouse = true
                setclickbtn1(true)
            }
        }}>
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
                                        <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>ADD ATTENDANCE (S)</p>
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
                                                                    <div>
                                                                        <p style={{ color: 'black', marginTop: '15px', marginBottom: '5px' }}>User Name</p>
                                                                        <div style={{ position: 'relative', zIndex: 2 }}>
                                                                            <p type='text' style={{ backgroundColor: '#e6e8eb', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'black' }} onClick={() => {
                                                                                setIsOpenMannualGenderOption(!isOpenMannualGenderOption)
                                                                                let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                let index = addCameraMannullyArray.indexOf(findArray)
                                                                                let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                filterArray.splice(index, 0, { ...findArray, flag: d.flag === true ? false : true })
                                                                                setAddCameraMannullyArray(filterArray)

                                                                            }}>{d.user_name.userName === '' ? 'Select' : d.user_name.userName}<span>
                                                                                    {isOpenMannualSiteOption && d.flag ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                                                                </span></p>

                                                                        </div>




                                                                        {isOpenMannualGenderOption &&
                                                                            d.flag === true &&

                                                                            <div
                                                                                // id={`site${val}`} 
                                                                                style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', zIndex: 2, maxHeight: '150px', overflowY: 'scroll' }}
                                                                            >
                                                                                {
                                                                                    user_list.length !== 0 ?
                                                                                        <div>
                                                                                            {
                                                                                                user_list.map((sites, siteIndex) => (

                                                                                                    <div key={siteIndex} >
                                                                                                        <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                                                                                                            let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                                                            let index = addCameraMannullyArray.indexOf(findArray)
                                                                                                            let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                                                            let editedData = {
                                                                                                                userName: sites.user_name,
                                                                                                                userId: sites._id
                                                                                                            }
                                                                                                            filterArray.splice(index, 0, { ...findArray, user_id: sites.emp_id, user_name: editedData, flag: d.flag === true ? false : true })
                                                                                                            setAddCameraMannullyArray(filterArray)

                                                                                                            setIsOpenMannualGenderOption(false)

                                                                                                        }}>{sites.user_name}</p>

                                                                                                        <hr></hr>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                        :
                                                                                        <p style={{ padding: '0', margin: 0, color: 'black' }}>No Users</p>
                                                                                }
                                                                            </div>
                                                                        }

                                                                    </div>
                                                                </Col>

                                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>User Id</p>
                                                                        <input type='text' placeholder='Enter User Id' disabled style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            // let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                            // let index = addCameraMannullyArray.indexOf(findArray)
                                                                            // let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                            // let value = e.target.value
                                                                            // filterArray.splice(index, 0, { ...findArray, user_id: value })
                                                                            // setAddCameraMannullyArray(filterArray)
                                                                        }} value={d.user_id} ></input>
                                                                    </div>
                                                                </Col>

                                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>In Time</p>
                                                                        <input type='time' placeholder='Enter Mobile Number' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                            let index = addCameraMannullyArray.indexOf(findArray)
                                                                            // console.log(index)
                                                                            let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                            let value = e.target.value
                                                                            filterArray.splice(index, 0, { ...findArray, in_time: value })
                                                                            setAddCameraMannullyArray(filterArray)
                                                                        }} value={d.in_time} ></input>
                                                                    </div>
                                                                </Col>

                                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Out Time</p>
                                                                        <input type='time' placeholder='Enter mail id' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                            let index = addCameraMannullyArray.indexOf(findArray)
                                                                            let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                            let value = e.target.value
                                                                            filterArray.splice(index, 0, { ...findArray, out_time: value })
                                                                            setAddCameraMannullyArray(filterArray)
                                                                        }} value={d.out_time} ></input>
                                                                    </div>
                                                                </Col>

                                                                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <p style={{ color: 'black', marginBottom: '5px' }}>Date</p>
                                                                        <input type='date' placeholder='Enter Password' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                            let findArray = addCameraMannullyArray.find((ele) => ele.cameraId === d.cameraId)
                                                                            let index = addCameraMannullyArray.indexOf(findArray)
                                                                            // console.log(index)
                                                                            let filterArray = addCameraMannullyArray.filter((ele) => ele.cameraId !== d.cameraId)
                                                                            let value = e.target.value
                                                                            filterArray.splice(index, 0, { ...findArray, date: value })
                                                                            setAddCameraMannullyArray(filterArray)
                                                                        }} value={d.date} ></input>
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

                                    {/* <Row>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <button style={{ backgroundColor: '#e22747', color: 'white', border: 'none', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', width: '100%', padding: '5px' }} onClick={() => {
                                                // console.log("total Data, Add camera button clicked", addCameraMannullyArray)

                                                // Ckeck if the inputs are filled or not
                                                let checkFlag = false
                                                let camera_count = 0
                                                for (let check = 0; check < addCameraMannullyArray.length; check++) {
                                                    if (addCameraMannullyArray[check].user_name.userName !== '' && addCameraMannullyArray[check].user_id !== '' && addCameraMannullyArray[check].in_time !== '' && addCameraMannullyArray[check].out_time !== '' && addCameraMannullyArray[check].date !== '') {
                                                        checkFlag = true
                                                    } else {
                                                        checkFlag = false
                                                        break;
                                                    }
                                                }


                                                // Creeate a device details for every device
                                                if (checkFlag) {

                                                    async function save_user(value) {
                                                        const device_details = {
                                                            "user_id": value.user_name.userId,
                                                            'user_name': value.user_name.userName,
                                                            'emp_id': value.user_id,
                                                            'date': value.date,
                                                            'in_time': value.in_time == '' ? 'NONE' : value.in_time,
                                                            'out_time': value.out_time == '' ? 'NONE' : value.out_time,
                                                            'site_id': value.site.siteId,
                                                            'post_type':'MANUAL'
                                                        };

                                                        const options = {
                                                            url: api.ATTENDANCE_LIST_CREATION_ORGINAL,
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


                                            }}>Add Attendance</button>
                                        </Col>
                                    </Row> */}
                                </div>
                        }
                    </div>
                </Modal>

                <Modal
                    open={opencamera}
                    onClose={() => {
                        setflag(!flag)
                        list_camera_site_id(selected_sites, face_id)
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
                                    <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>ADD ATTENDANCE(s)</p>

                                    <CloseIcon style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                        setflag(!flag)
                                        list_camera_site_id(selected_sites, face_id)
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
                                            add_camera_count.map((val) => (
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
                                                            <input type='text' placeholder='Enter Client Id' disabled value={camera_object[val].user_name.userName} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => { camera_object[val].user_name.userName = e.target.value; setcamera_name(e.target.value) }}></input>
                                                        </div>
                                                    </Col>

                                                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                        <div style={{ marginTop: '5px' }}>
                                                            <p style={{ color: 'black', marginBottom: '5px' }}>User Id</p>
                                                            <input type='text' placeholder='Enter Client Id' disabled value={camera_object[val].user_name.user_id} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                camera_object[val].user_id = e.target.value
                                                                setcamera_id(e.target.value)
                                                            }}></input>
                                                        </div>
                                                    </Col>

                                                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                        <div style={{ marginTop: '5px' }}>
                                                            <p style={{ color: 'black', marginBottom: '5px' }}>In Time</p>
                                                            <input type='time' placeholder='Enter Client Id' value={camera_object[val].in_time} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                camera_object[val].in_time = e.target.value
                                                                setcamera_id(e.target.value)
                                                            }}></input>
                                                        </div>
                                                    </Col>

                                                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                        <div style={{ marginTop: '5px' }}>
                                                            <p style={{ color: 'black', marginBottom: '5px' }}>Out Time</p>
                                                            <input type='time' placeholder='Enter Client Id' value={camera_object[val].out_time} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                camera_object[val].out_time = e.target.value
                                                                setcamera_id(e.target.value)
                                                            }}></input>
                                                        </div>
                                                    </Col>

                                                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                        <div style={{ marginTop: '5px' }}>
                                                            <p style={{ color: 'black', marginBottom: '5px' }}>Date</p>
                                                            <input type='date' placeholder='Enter Client Id' value={camera_object[val].date} style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', fontSize: '14px' }} onChange={(e) => {
                                                                camera_object[val].date = e.target.date
                                                                setcamera_id(e.target.value)
                                                            }}></input>
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

                                    {/* <Row>
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <button style={{ backgroundColor: '#e22747', color: 'white', border: 'none', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', width: '100%', padding: '5px' }} onClick={() => {
                                                let forSwitchApiCall
                                                let count = true
                                                let camera_count = 0

                                                for (let index = 0; index < camera_object.length; index++) {
                                                    if (camera_object[index].user_name.userName !== '' && camera_object[index].user_id !== '' && camera_object[index].in_time !== '' && camera_object[index].out_time !== '' && camera_object[index].date !== '') {
                                                        count = true
                                                    } else {
                                                        count = false
                                                        break;
                                                    }

                                                }

                                                // console.log('Camera object', camera_object)

                                                if (count) {

                                                    async function save_user(value, index) {
                                                        const device_details = {
                                                            "user_id": value.user_name.userId,
                                                            'user_name': value.user_name.userName,
                                                            'emp_id': value.user_id,
                                                            'date': value.date,
                                                            'in_time': value.in_time,
                                                            'out_time': value.out_time,
                                                            'site_id': value.site.siteId,
                                                            'post_type':'MANUAL'
                                                        };

                                                        const options = {
                                                            url: api.ATTENDANCE_LIST_CREATION + selectedcameras[index]._id,
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
                                                                // console.log(response.data)
                                                                // count1 = 0
                                                                // count = 0
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

                                                    async function call() {
                                                        camera_object.forEach(async (item, index) => {
                                                            await save_user(item, index);
                                                        })
                                                    }

                                                    call()

                                                }


                                                else {

                                                    alert("Please fill out all required fields.")

                                                }
                                            }}>Add Attendance</button>
                                        </Col>
                                    </Row> */}
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

                <div style={{ padding: '10px', display: 'flex' }}>
                    <div style={{ marginRight: '5px' }}>
                        <button className='eventbtn' onClick={() => {
                            setcreate_group_select(!create_group_select)

                        }} style={{ display: 'flex', backgroundColor: create_group_select ? '#e32747' : '#e6e8eb', color: create_group_select ? 'white' : 'black' }}> <CheckCircleOutlinedIcon style={{ marginRight: '10px' }} />Select Group<ArrowDropDownIcon style={{ marginLeft: '10px' }} /></button>

                        <div>
                            <div style={{ borderRadius: '5px', backgroundColor: '#181828', padding: '10px', position: 'absolute', top: '130px', zIndex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', width: '200px', display: create_group_select ? 'block' : 'none' }}>
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
                                                                list_camera_site_id([...selected_sites, val], face_id)
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

                    <div>
                        <div className='eventsDiv1' style={{ position: 'relative' }}>
                            {/* <button className='eventbtn' id='day' onClick={() => {
                                    setclickbtn1(true)

                                }}> <AccessTimeIcon style={{ marginRight: '10px' }} />{`${startdate} (${starttime}) - ${enddate} (${endtime})`} <ArrowDropDownIcon style={{ marginLeft: '10px' }} /></button> */}


                            {data != "" || res === 'empty response' ? (
                                <button className='eventbtn' id='day' onMouseEnter={() => {
                                    date_mouse = true
                                }} onMouseLeave={() => {
                                    if (btn1 === 'day') {
                                        date_mouse = false
                                    }

                                }} onClick={() => {
                                    setclickbtn1(true)
                                    date_mouse = true


                                }}> <CalendarMonthIcon style={{ marginRight: '7px' }} />{`${startdate} - ${enddate}`} <ArrowDropDownIcon style={{ marginLeft: '10px' }} /></button>
                            ) : (<Skeleton style={{ borderRadius: '20px', border: '1px solid gray', }} width={300} height={45} />)
                            }


                            <div onMouseEnter={() => {
                                date_mouse = true
                            }} onMouseLeave={() => {
                                date_mouse = false
                            }}>
                                <div style={{ width: page === 1 ? '350px' : '420px', borderRadius: '5px', backgroundColor: '#181828', padding: '10px', position: 'absolute', top: page === 1 ? '80px' : '60px', zIndex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', display: btn1 === 'day' ? 'block' : 'none' }}>
                                    <div style={{ position: 'relative' }}>

                                        <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: '-37px', left: 0 }} />
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                            <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                                                <CloseIcon style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }} onClick={() => {
                                                    setclickbtn1(true)
                                                }} />
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ marginTop: '10px' }}>
                                                <button style={{ backgroundColor: date_section == 'single' ? '#e22747' : 'transparent', color: date_section == 'single' ? 'white' : '#808080', padding: '5px', borderRadius: '20px', border: '1px solid gray', marginRight: '10px' }} onClick={() => {
                                                    setdate_section('single')

                                                    dispatch({ type: ENDDATE, value: startdate })
                                                    setend_dateFullYear(start_dateFullYear)
                                                    setend_dateMonth(start_dateMonth)
                                                    setend_dateDate(start_dateDate)
                                                }}>Single Date</button>

                                                <button style={{ backgroundColor: date_section == 'multi' ? '#e22747' : 'transparent', color: date_section == 'multi' ? 'white' : '#808080', padding: '5px', borderRadius: '20px', border: '1px solid gray' }} onClick={() => {
                                                    setdate_section('multi')
                                                }}>Multi Date</button>
                                            </div>
                                        </div>

                                        <div style={{ display: page === 1 ? 'none' : 'block' }}>
                                            <div style={{ display: 'flex', padding: '10px', flexDirection: 'column' }}>
                                                <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '5px' }}>Start Date</p>
                                                <div style={{ position: 'relative' }}>
                                                    <div style={{ backgroundColor: '#f4f7fa', borderRadius: '5px', padding: '10px', display: 'flex', justifyContent: 'space-between' }} onClick={() => {
                                                        setviewstart_date(!viewstart_date)
                                                        setviewend_date(false)
                                                    }}>
                                                        <p style={{ fontWeight: 'bolder', margin: 0, color: '#181828' }}>{`${start_dateFullYear}-${start_dateMonth}-${start_dateDate}`}  <span style={{ marginLeft: '10px' }}>{`${starttime}-${endtime}`}</span></p>
                                                        <CalendarMonthIcon style={{ cursor: 'pointer', color: '#181828' }} />
                                                    </div>

                                                    <div style={{ position: 'absolute', zIndex: 2, top: '50px', display: viewstart_date === true ? 'block' : 'none' }}>
                                                        <DateComponent year={start_dateFullYear} month={Number(start_dateMonth)} date={Number(start_dateDate)} type={'start_date'} starttime={starttime} endtime={endtime} parentFunction={initialdate} flag={'endTime'} select_hour={'none'} apply_can_fun={apply_can_fun} days_time={true} />
                                                    </div>
                                                </div>
                                                {/* <input type="date" value={startdate} style={{ padding: '10px', borderRadius: '5px' }} onChange={(e) => {

                                                        dispatch({ type: STARTDATE, value: e.target.value })
                                                    }}></input>
                                                    <input type="time" value={starttime} style={{ padding: '10px', borderRadius: '5px' }} onChange={(e) => {

                                                        dispatch({ type: STARTTIME, value: e.target.value })
                                                    }}></input> */}
                                            </div>

                                            {
                                                date_section == 'multi' ?
                                                    <div style={{ display: 'flex', padding: '10px', flexDirection: 'column' }}>
                                                        <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '5px' }}>End Date</p>
                                                        <div style={{ position: 'relative' }}>
                                                            <div style={{ backgroundColor: '#f4f7fa', borderRadius: '5px', padding: '10px', display: 'flex', justifyContent: 'space-between' }} onClick={() => {
                                                                setviewend_date(!viewend_date)
                                                                setviewstart_date(false)
                                                            }}>
                                                                <p style={{ fontWeight: 'bolder', margin: 0, color: '#181828' }}>{`${end_dateFullYear}-${end_dateMonth}-${end_dateDate}`}  <span style={{ marginLeft: '10px' }}>{`${starttime}-${endtime}`}</span></p>
                                                                <CalendarMonthIcon style={{ cursor: 'pointer', color: '#181828' }} />
                                                            </div>

                                                            <div style={{ position: 'absolute', zIndex: 2, top: '50px', display: viewend_date === true ? 'block' : 'none' }}>
                                                                <DateComponent year={end_dateFullYear} month={Number(end_dateMonth)} date={Number(end_dateDate)} type={'end_date'} starttime={starttime} endtime={endtime} parentFunction={initialdate} flag={'endTime'} select_hour={'none'} apply_can_fun={apply_can_fun} days_time={true} />
                                                            </div>
                                                        </div>
                                                        {/* <input type="date" value={enddate} style={{ padding: '10px', borderRadius: '5px' }} onChange={(e) => {
                                                        dispatch({ type: ENDDATE, value: e.target.value })
                                                    }}></input>
                                                    <input type="time" value={endtime} style={{ padding: '10px', borderRadius: '5px' }} onChange={(e) => {
                                                        dispatch({ type: ENDTIME, value: e.target.value })
                                                    }}></input> */}
                                                    </div>
                                                    : ''
                                            }

                                            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '10px' }}>
                                                <button className="my-2" style={{ backgroundColor: '#e32747', color: 'white', borderRadius: '5px', border: 'none', padding: '5px' }} onClick={() => {
                                                    setclickbtn1(true)
                                                    if (aditional_info) {
                                                        document.getElementById('day').innerText = `${startdate} (${starttime}) - ${enddate} (${endtime})`
                                                    } else {
                                                        document.getElementById('day').innerText = 'Select Date and Time'
                                                    }
                                                    dispatch({ type: APPLY, value: !apply })
                                                    list_camera_site_id(selected_sites, face_id)
                                                }}>Apply</button>
                                            </div>
                                        </div>

                                        <div style={{ display: page === 1 ? 'block' : 'none', paddingRight: '10px' }}>

                                            <Row>
                                                <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <p style={{ margin: 0, color: 'white', fontWeight: 'bolder' }}>Start Date</p>
                                                </Col>

                                                <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: '3px' }}>
                                                    <div style={{ position: 'relative' }}>
                                                        <div style={{ backgroundColor: '#f4f7fa', borderRadius: '5px', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                            <p style={{ fontWeight: 'bolder', margin: 0, color: '#181828' }}>{`${start_dateFullYear}-${start_dateMonth}-${start_dateDate}`}  <span style={{ marginLeft: '10px' }}>{`${starttime}-${endtime}`}</span></p>
                                                            <CalendarMonthIcon style={{ cursor: 'pointer', color: '#181828' }} onClick={() => {
                                                                setviewstart_date(!viewstart_date)
                                                            }} />
                                                        </div>

                                                        <div style={{ position: 'absolute', zIndex: 2, top: '90px', display: viewstart_date === true ? 'block' : 'none' }}>
                                                            <DateComponent year={start_dateFullYear} month={Number(start_dateMonth)} date={Number(start_dateDate)} type={'start_date'} starttime={starttime} endtime={endtime} parentFunction={initialdate} flag={'endTime'} select_hour={'none'} apply_can_fun={apply_can_fun} days_time={true} />
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>

                                            {/* <Row>
                                                    <Col xl={12} lg={12} md={12} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                                        <p style={{ margin: 0, color: 'white', fontWeight: 'bolder' }}>Start Date</p>
                                                    </Col>

                                                    <Col xl={12} lg={12} md={12} sm={7} xs={7} style={{ padding: '3px' }}>
                                                        <input type="date" value={startdate} style={{ padding: '5px', borderRadius: '5px', width: '100%' }} onChange={(e) => {
                                                            dispatch({ type: STARTDATE, value: e.target.value })
                                                        }}></input>
                                                    </Col>
                                                </Row> */}

                                            {/* <Row>
                                                    <Col xl={12} lg={12} md={12} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                                        <p style={{ margin: 0, color: 'white', fontWeight: 'bolder' }}>Start Time</p>
                                                    </Col>

                                                    <Col xl={12} lg={12} md={12} sm={7} xs={7} style={{ padding: '3px' }}>
                                                        <input type="time" value={starttime} style={{ padding: '5px', borderRadius: '5px', width: '100%' }} onChange={(e) => {
                                                            dispatch({ type: STARTTIME, value: e.target.value })
                                                        }}></input>
                                                    </Col>
                                                </Row> */}

                                            <Row>
                                                <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <p style={{ fontWeight: 'bolder', fontSize: '16px' }}>END DATE</p>
                                                </Col>

                                                <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: '3px' }}>
                                                    <div style={{ position: 'relative' }}>
                                                        <div style={{ backgroundColor: '#f4f7fa', borderRadius: '5px', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                            <p style={{ fontWeight: 'bolder', margin: 0, color: '#181828' }}>{`${end_dateFullYear}-${end_dateMonth}-${end_dateDate}`}  <span style={{ marginLeft: '10px' }}>{`${starttime}-${endtime}`}</span></p>
                                                            <CalendarMonthIcon style={{ cursor: 'pointer', color: '#181828' }} onClick={() => {
                                                                setviewend_date(!viewend_date)
                                                            }} />
                                                        </div>

                                                        <div style={{ position: 'absolute', zIndex: 2, top: '90px', display: viewend_date === true ? 'block' : 'none' }}>
                                                            <DateComponent year={end_dateFullYear} month={Number(end_dateMonth)} date={Number(end_dateDate)} type={'end_date'} starttime={starttime} endtime={endtime} parentFunction={initialdate} flag={'endTime'} select_hour={'none'} apply_can_fun={apply_can_fun} days_time={true} />
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>

                                            {/* <Row>
                                                    <Col xl={12} lg={12} md={12} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                                        <p style={{ margin: 0, color: 'white', fontWeight: 'bolder' }}>End Date</p>
                                                    </Col>

                                                    <Col xl={12} lg={12} md={12} sm={7} xs={7} style={{ padding: '3px' }}>
                                                        <input type="date" value={enddate} style={{ padding: '5px', borderRadius: '5px', width: '100%' }} onChange={(e) => {
                                                            dispatch({ type: ENDDATE, value: e.target.value })
                                                        }}></input>
                                                    </Col>
                                                </Row> */}

                                            {/* <Row>
                                                    <Col xl={12} lg={12} md={12} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                                        <p style={{ margin: 0, color: 'white', fontWeight: 'bolder' }}>End Time</p>
                                                    </Col>

                                                    <Col xl={12} lg={12} md={12} sm={7} xs={7} style={{ padding: '3px' }}>
                                                        <input type="time" value={endtime} style={{ padding: '5px', borderRadius: '5px', width: '100%' }} onChange={(e) => {
                                                            dispatch({ type: ENDTIME, value: e.target.value })
                                                        }}></input>
                                                    </Col>
                                                </Row> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                        </div>
                    </div>
                </div>

                <div style={{
                    padding: '10px',
                    width: '100%',
                    height: '250px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start'
                }} >

                    <div style={{
                        width: '69%',
                        height: '100%',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }} >

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '6px 10px',
                            height: '22%',
                            borderRadius: '10px',
                        }} >

                            <div  >

                            </div>

                            <div style={{
                                backgroundColor: isRecording !== true ? 'white' : '#f5b7b1',
                                borderRadius: '10px', height: '100%', alignItems: 'center', width: '50px',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                fontSize: '20px'
                            }} onClick={() => {
                                if (selectedType === 'other') {
                                    setIsRecording(!isRecording)
                                }
                            }}  >

                                <VoiceToText isRecording={isRecording} setTextImageSearch={setTextImageSearch} />
                            </div>
                        </div>
                        <textarea
                            value={testSearchImage}
                            placeholder="Try something ? "
                            onChange={handleChangeTextSearchImage}
                            style={{
                                borderRadius: '4px',
                                backgroundColor: 'white',
                                fontSize: '14px',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '8px 10px',
                                width: '100%',
                                height: '75%',
                                resize: 'none',
                                textAlign: 'start', 
                                verticalAlign: 'top', 
                            }}
                        />
                    </div>

                    <div
                        style={{
                            width: '30%',
                            height: '100%',
                            backgroundColor: 'white',
                            boxShadow: '0px 0px 6px 0px #eaecee',
                            borderRadius: '10px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                            position: 'relative',
                            cursor: 'pointer'
                        }}
                        onClick={() => document.getElementById('fileInput').click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={onDrop}
                    >
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={onFileChange} 
                        />

                        {
                            imagePreview ? (
                                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                    <img
                                        src={imagePreview}
                                        alt="Selected"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        height: '25px',
                                        width: '25px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '50%',
                                        backgroundColor: 'red',
                                        color: 'white',
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        fontSize: '13px'
                                    }}
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            setImagePreview(null);
                                        }}
                                    >
                                        X
                                    </div>
                                </div>
                            ) : (
                                <p style={{ textAlign: 'center' }}>Click or Drag an Image Here</p>
                            )
                        }
                    </div>




                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }} >
                    {
                        faceImagesFromFast.length !== 0 ?
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-evenly',
                                flexWrap: 'wrap',
                                alignItems: 'center'
                            }} >
                                {
                                    faceImagesFromFast.map((image) => {
                                        console.log('image', image)
                                        return (
                                            <div style={{
                                                position: 'relative',
                                                height: '120px',
                                                width: '120px',
                                                margin: '4px',
                                                overflow: 'hidden'
                                            }}
                                                onMouseEnter={(e) => e.currentTarget.querySelector('.date-info').style.opacity = '1'}
                                                onMouseLeave={(e) => e.currentTarget.querySelector('.date-info').style.opacity = '0'}
                                            >
                                                <img src={`data:image/jpeg;base64,${image.imageurl}`} style={{
                                                    height: '100%',
                                                    width: '100%',
                                                    boxShadow: '0px 0px 3px 0px black',
                                                    borderRadius: '5px',
                                                    objectFit: 'cover'
                                                }} />
                                                <p style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    right: 0,
                                                    color: 'white',
                                                    backgroundColor: 'black',
                                                    padding: '4px',
                                                    borderRadius: '5px',
                                                    fontSize: '12px'
                                                }} >{image.percentage}</p>

                                                {/* Date hidden initially and shown on hover */}
                                                <p className="date-info" style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    color: 'white',
                                                    backgroundColor: 'black',
                                                    padding: '4px',
                                                    borderRadius: '5px',
                                                    fontSize: '10px',
                                                    opacity: 0, // Hidden by default
                                                    transition: 'opacity 0.3s ease-in-out' // Smooth transition on hover
                                                }} >{image.datetime}</p>
                                            </div>

                                        )
                                    })
                                }
                            </div>
                            :
                            <>
                                <p>No Images</p>
                            </>
                    }
                </div>
            </div>
        </div>
    )
}
