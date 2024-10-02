
import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Table, Tabs, Tab, Container, Button } from 'react-bootstrap';
import Aux from "../../hoc/_Aux";
import HLSVideoPlayer from '../Components/LiveHLSPlayer';
import Loader from '../CommonComponent/Loader'
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CloseIcon from '@mui/icons-material/Close';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import axios from 'axios';
import Hls from "hls.js";
import * as api from '../Configurations/Api_Details'
import Player from './Ant_media_webrtc_player'
import Slider from '@mui/material/Slider';

import BorderColorIcon from '@mui/icons-material/BorderColor';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import Tooltip from '@material-ui/core/Tooltip';
import './style.css'
import CardSkeleton from './Cartskeleton';
import Skeleton from 'react-loading-skeleton';
import { db_type } from './db_config';
import moment from 'moment'
import io from 'socket.io-client';




let webrts_flag = false
let final_cameras = []
let live_flag = false
let cam_flag_count = 0
let cameras_ids_for_stream = {}
function Dashboard() {
    const playerRef = useRef()

    const userData = JSON.parse(localStorage.getItem("userData"))
    const [final_cameras_modify, setFinal_cameras_modify] = useState([])


    const [logic, setlogic] = useState("")
    const [hlsDetail, sethlsDetail] = useState([])
    let [vid, setvid] = useState(false)

    const [buttonval, setbuttonval] = useState(false)

    const [rev, setRev] = useState(0)
    const [ods, setods] = useState(0)
    const [val, setSum] = useState(0)
    const [time, settime] = useState(0)
    const [pie, setPie] = useState([])
    const [startdate, setstartdate] = useState(new Date());
    const [enddate, setenddate] = useState(new Date());
    const [profit, setprofit] = useState([])
    const [profit_amount, setprofit_amount] = useState(0)

    const [screenlogic, setscreenlogic] = useState(1);
    const [flag, setflag] = useState(false);

    const [count, setcount] = useState(0);

    localStorage.setItem('button_value', buttonval);
    localStorage.setItem('button_flag', flag);

    let current_time = new Date()
    let current_timesplit = current_time.toString().split(" ")

    const [videoFlag, setvideoFlag] = useState(1);
    const [data, setdata] = useState([]);
    const [cameras1, setcameras1] = useState([]);
    const [uurl, setuurl] = useState('');

    const [camera_tag, setcamera_tag] = useState(false)
    const [online_status, setonline_status] = useState(false)
    const [cameras_view, setcameras_view] = useState([])
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
    const [camera_search, setcamera_search] = useState('')
    const [tag_search, settag_search] = useState('')
    const [group_search, setgroup_search] = useState('')
    const [skeleton, setskeleton] = useState(false)

    const [camera_serach, setcamera_serach] = useState([])
    const [top_camera_search, settop_camera_search] = useState('')
    const [flag1, setflag1] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [camera_res, setcamera_res] = useState(false);
    const [webrts_instant, setwebrts_instant] = useState([]);
    const [camera_empty_flag, setcamera_empty_flag] = useState(true);
    const [play_steams, setplay_steams] = useState([]);
    const [online_cam, setonline_cam] = useState(0)
    const [offline_cam, setoffline_cam] = useState(0)
    const [cameras_view1, setcameras_view1] = useState([])
    const [totalCameraCoverScreen, setTotalCameraCoverScreen] = useState(4)
    const [duplicateData, setDuplicateData] = useState([])


    const marks = [
        { value: 0, label: 'Auto' },
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
    ];
    const [done, setdone] = useState(false)
    const [sliderValue, setSliderValue] = useState(0);
    const [colStyle, setColStyle] = useState({ xl: 4, lg: 4, md: 6, sm: 12, xs: 12, padding: '15px' });

    function initial_webrtc(data, id, i, flag, info, play_fun, handleStopPlaying) {
        webrts_instant[i] = { webrtc: data, id: id, flag: flag, info: info, playing_type: true, play_fun: play_fun, stop_fun: handleStopPlaying }

        cam_flag_count = cam_flag_count + 1
        if (cameras_view.length == cam_flag_count) {
            live_flag = true
        }
    }

    function play_stream_id(id) {
        play_steams.push(id)
    }

    function returnstrams() {
        return play_steams
    }

    function function_cameras_ids_for_stream(interval, id) {
        cameras_ids_for_stream = { ...cameras_ids_for_stream, [id]: interval }
    }


    useEffect(() => {
        webrts_flag = false
        final_cameras = []
        setFinal_cameras_modify([])
        live_flag = false
        cam_flag_count = 0
        cameras_ids_for_stream = {}
    }, [])


    const socket = io('https://tentovision1.cloudjiffy.net', {
        transports: ['websocket', 'polling'], // Ensure both WebSocket and polling are enabled
    });

    let [isStateChanged, setIsStateChanged] = useState(false);

    useEffect(() => {
        // Connect to Socket.IO server
        socket.on('motion', ({ camera_id, motion_type }) => {
            console.log('camera motion changed', camera_id, motion_type);
            
            handleSortFunction(camera_id)
            setIsStateChanged(!isStateChanged)

        });

    }, []);


    const handleSortFunction = (camera_id) => {
        try {
            setcameras_view(prevCameras => {
                const sorted = [
                    // Move the camera with matching camera_id to the top
                    ...prevCameras.filter((camera) => camera._id === camera_id),
                    // Keep the rest of the cameras in their original order
                    ...prevCameras.filter((camera) => camera._id !== camera_id)
                ];
                return sorted;
            });
        } catch (err) {
            console.log('Error sorting cameras:', err);
        }
    };

    const [isMotionDataView, setIsMotionDataView] = useState(false);
    


    useEffect(() => {
        // Ensure that the `webrts_flag` check is done after state has updated
        console.log(webrts_flag);
        if (!webrts_flag || webrts_flag) {
            if (cameras_view !== 'no_res') {
                let modifiedData = cameras_view.map((data, i) => {
                    cameras_ids_for_stream = { ...cameras_ids_for_stream, [data.stream_id]: 'none' };
                    return (
                        <Col
                            className="player_comp"
                            name={data._id}
                            key={data._id} // Add a key here to properly handle re-rendering
                            xl={12 / totalCameraCoverScreen} // This dynamically sets the column size
                            lg={3}
                            md={6}
                            sm={12}
                            xs={12}
                            style={{
                                padding: 3, backgroundColor: 'transparent', 
                                height:
                                    totalCameraCoverScreen === 12
                                        ? '15vh'
                                        : totalCameraCoverScreen === 6
                                            ? '20vh'
                                            : totalCameraCoverScreen === 4
                                                ? '25vh'
                                                : totalCameraCoverScreen === 3
                                                    ? '25vh'
                                                    : totalCameraCoverScreen === 2
                                                        ? '50vh'
                                                        : 'auto',
                            }}
                        >
                            <div>
                                <Player
                                    id={`player${i}`}
                                    i={i}
                                    data={data}
                                    initial_webrtc={initial_webrtc}
                                    play_stream_id={play_stream_id}
                                    returnstrams={returnstrams}
                                    cameras_ids_for_stream={cameras_ids_for_stream}
                                    function_cameras_ids_for_stream={function_cameras_ids_for_stream}
                                    totalCameraCoverScreen={totalCameraCoverScreen}
                                />
                            </div>
                        </Col>
                    );
                });



                console.log('final_cameras_modify', final_cameras_modify)

                setFinal_cameras_modify(modifiedData)

                final_cameras = modifiedData;
                webrts_flag = true; // Ensure this flag only changes after UI re-renders
            }
        } else {
            if (live_flag) {
                let new_data = [];
                let player = document.getElementsByClassName('player_comp');

                for (let index = 0; index < player.length; index++) {
                    player[index].style.display = 'none';
                }

                for (let index = 0; index < cameras_view.length; index++) {
                    let flag = false;
                    for (let index1 = 0; index1 < player.length; index1++) {
                        if (cameras_view[index]._id === player[index1].getAttribute('name')) {
                            new_data.push(final_cameras[index1]);
                            player[index1].style.display = 'block';
                            flag = true;
                            break;
                        } else {
                            flag = false;
                        }
                    }
                }
            }
        }
    }, [cameras_view, totalCameraCoverScreen]); // Add totalCameraCoverScreen to the dependency array



    useEffect(() => {

        const savedSliderValue = localStorage.getItem('sliderValue');
        if (savedSliderValue) {
            setSliderValue(parseInt(savedSliderValue));
        }
    }, [done]);

    useEffect(() => {
        localStorage.setItem('sliderValue', sliderValue.toString());

        if (sliderValue === 0) {
            setColStyle({ xl: 4, lg: 4, md: 4, sm: 4, xs: 4, padding: '2px', height: '156px' });

        } else if (sliderValue === 1) {
            console.log('++++++ 1');
            setColStyle({ xl: 12, lg: 12, md: 12, sm: 12, xs: 12, padding: '2px', height: '500px' });

        } else if (sliderValue === 2) {
            console.log('++++++ 2');
            setColStyle({ xl: 6, lg: 6, md: 6, sm: 6, xs: 6, padding: '2px', height: '500px' });

        } else if (sliderValue === 3) {
            console.log('++++++ 3');
            setColStyle({ xl: 4, lg: 4, md: 4, sm: 4, xs: 4, padding: '2px', height: '156px' });

        } else if (sliderValue === 4) {
            console.log('++++++ 4');
            setColStyle({ xl: 3, lg: 3, md: 3, sm: 3, xs: 3, padding: isFullScreen ? '0px' : '2px', height: '100%' });

        }

    }, [sliderValue]);


    const handleSliderChange = (event, newValue) => {

        setSliderValue(newValue);
    };


    const handleFullScreenChange = () => {
        setIsFullScreen(!!document.fullscreenElement);
    };

    const handleKeyUp = (event) => {
        if (event.key === 'Escape') {
            setIsFullScreen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const handleFullScreenClick = () => {
        const elem = document.getElementById("fullScreenDiv");

        if (!elem) {
            console.error('Target element not found.');
            return;
        }

        if (document.fullscreenElement === elem) {
            document.exitFullscreen();
            setIsFullScreen(false)
        } else {
            elem.requestFullscreen().catch(err => {
                console.error('Failed to enable fullscreen mode:', err);
            });
            setIsFullScreen(true)
        }
    };

    // Hide scrollbar for WebKit browsers
    //   const hideScrollbar = () => {
    //     const style = document.createElement('style');
    //     style.innerHTML = `
    //       #fullScreenDiv::-webkit-scrollbar {
    //         display: none;
    //       }
    //     `;
    //     document.head.appendChild(style);
    //   };

    //   const showScrollbar = () => {
    //     const style = document.querySelector('#fullscreen-scrollbar-style');
    //     if (style) {
    //       document.head.removeChild(style);
    //     }
    //   };


    useEffect(() => {
        if (isFullScreen) {
            const style = document.createElement('style');
            style.innerHTML = `
          #fullScreenDiv::-webkit-scrollbar {
            width: 5px; /* Set the width of the scrollbar */
          }
    
          #fullScreenDiv::-webkit-scrollbar-thumb {
            background-color: #888; /* Set the color of the scrollbar thumb */
          }
    
          /* Firefox */
          #fullScreenDiv {
            scrollbar-width: thin; /* Set the width of the scrollbar */
          }
    
          /* IE 10+ */
          #fullScreenDiv {
            -ms-overflow-style: thin; /* Set the width of the scrollbar */
          }
        `;
            document.head.appendChild(style);

            return () => {
                document.head.removeChild(style);
            };
        }

    }, [isFullScreen]);





    const get_all_cameras_live = () => {
        let data1 = []
        let count = 0

        let online = 0
        let offline = 0

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
                    webrts_flag = false
                    setdata(response.data)
                    setcameras1(response.data)
                    setcameras_view1(response.data)
                    if(isMotionDataView){
                        const sorted = response.data.filter((camera) => {
                            console.log('camera id', camera.motion_type)
                            return camera.motion_type === 'start'
                        })
                        setcameras_view(sorted)
                    }else{
                        setcameras_view(response.data)
                    }
                    // console.log('duplicate response 1', response.data);
                    setDuplicateData(response.data)
                    setcamera_serach(response.data)
                    setskeleton(true)
                    setvid(true)
                    setcamera_res(true)

                    let time = moment(new Date(), 'HH:mm:ss');
                    time.subtract(2, 'minutes');
                    let newTime1 = time.format('HH:mm:ss');
                    let newTime = moment(new Date()).format('HH:mm:ss');
                    response.data.map((val) => {
                        if ((moment(val.last_active_date).format('YYYY-MM-DD') == moment(new Date()).format('YYYY-MM-DD')) && (moment(val.last_active, 'HH:mm:ss').isBetween(moment(newTime1, 'HH:mm:ss'), moment(newTime, 'HH:mm:ss')))) {
                            data1.push({ ...val, camera_health: 'Online' })
                            online = online + 1
                        } else {
                            data1.push({ ...val, camera_health: 'Offline' })
                            offline = offline + 1
                        }
                    })

                    if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                        let access = userData.operation_type.filter((val) => { return val == 'Read' || val == 'All' || val == 'Edit' || val == 'Delete' })
                        if (access[0] == 'All' || access[1] == 'All' || access[2] == 'All' || access[2] == 'All') {
                            data1.map((cam, i) => {
                                data1[i] = { ...data1[i], permission_level: 'All' }
                            })
                        } else {
                            data1.map((cam, i) => {
                                data1[i] = { ...data1[i], permission_level: 'Read, Edit, Delete' }
                            })
                        }
                    } else {
                        userData.site_id.map((value) => {
                            let access = value.type.filter((val) => { return val == 'Read' || val == 'All' || val == 'Edit' || val == 'Delete' })
                            if (access[0] == 'All' || access[1] == 'All' || access[2] == 'All' || access[2] == 'All') {
                                data1.map((cam, i) => {
                                    data1[i] = { ...data1[i], permission_level: 'All' }
                                })
                            } else {
                                data1.map((cam, i) => {
                                    data1[i] = { ...data1[i], permission_level: 'Read, Edit, Delete' }
                                })
                            }
                        })
                    }


                    setdata(data1)
                    // setcameras(data1)
                    // setcameras1(data1)
                    console.log(data1)
                    
                    if(isMotionDataView){
                        const sorted = data1.filter((camera) => {
                            console.log('camera id', camera.motion_type)
                            return camera.motion_type === 'start'
                        })
                        setcameras_view(sorted)
                    }else{
                        setcameras_view(data1)
                    }
                    console.log("data 1", data1)
                    setcameras_view1(data1)
                    // setcameras_search(data1)
                    setonline_cam(online)
                    setoffline_cam(offline)
                    // setvid(true)
                    // setcamera_res(true)

                    if (data1.length == 0) {
                        setcameras_view('no_res')
                        setcameras_view1('no_res')
                    }
                    // get_camera_health(response.data)

                    if (response.data.length == 0) {
                        webrts_flag = true
                        setcameras_view('no_res')
                    }
                    // let element = document.getElementById(`outerDiv${0}`).clientHeight
                    // let vid = document.getElementsByTagName('video')
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
                            webrts_flag = false
                            setdata(data1)
                            setcameras1(data1)
                            setcameras_view('no_res')
                            setcameras_view1('no_res')
                            setvid(true)
                            setcamera_res(true)

                            let time = moment(new Date(), 'HH:mm:ss');
                            time.subtract(2, 'minutes');
                            let newTime1 = time.format('HH:mm:ss');
                            let newTime = moment(new Date()).format('HH:mm:ss');
                            data1.map((val) => {
                                if ((moment(val.last_active_date).format('YYYY-MM-DD') == moment(new Date()).format('YYYY-MM-DD')) && (moment(val.last_active, 'HH:mm:ss').isBetween(moment(newTime1, 'HH:mm:ss'), moment(newTime, 'HH:mm:ss')))) {
                                    data1.push({ ...val, camera_health: 'Online' })
                                    online = online + 1
                                } else {
                                    data1.push({ ...val, camera_health: 'Offline' })
                                    offline = offline + 1
                                }
                            })

                            if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                                let access = userData.operation_type.filter((val) => { return val == 'Read' || val == 'All' || val == 'Edit' || val == 'Delete' })
                                if (access[0] == 'All' || access[1] == 'All' || access[2] == 'All' || access[2] == 'All') {
                                    data1.map((cam, i) => {
                                        data1[i] = { ...data1[i], permission_level: 'All' }
                                    })
                                } else {
                                    data1.map((cam, i) => {
                                        data1[i] = { ...data1[i], permission_level: 'Read, Edit, Delete' }
                                    })
                                }
                            } else {
                                userData.site_id.map((value) => {
                                    let access = value.type.filter((val) => { return val == 'Read' || val == 'All' || val == 'Edit' || val == 'Delete' })
                                    if (access[0] == 'All' || access[1] == 'All' || access[2] == 'All' || access[2] == 'All') {
                                        data1.map((cam, i) => {
                                            data1[i] = { ...data1[i], permission_level: 'All' }
                                        })
                                    } else {
                                        data1.map((cam, i) => {
                                            data1[i] = { ...data1[i], permission_level: 'Read, Edit, Delete' }
                                        })
                                    }
                                })
                            }


                            setdata(data1)
                            // setcameras(data1)
                            // setcameras1(data1)
                            console.log(data1)
                            if(isMotionDataView){
                                const sorted = data1.filter((camera) => {
                                    console.log('camera id', camera.motion_type)
                                    return camera.motion_type === 'start'
                                })
                                setcameras_view(sorted)
                            }else{
                                setcameras_view(data1)
                            }
                            
                            // console.log('duplicate response', data1);

                            // setDuplicateData(data1)
                            setDuplicateData(data1)
                            console.log("data 1", data1)
                            setcameras_view1(data1)
                            // setcameras_search(data1)
                            setonline_cam(online)
                            setoffline_cam(offline)
                            // setvid(true)
                            // setcamera_res(true)

                            if (data1.length == 0) {
                                setcameras_view('no_res')
                                setcameras_view1('no_res')
                            }
                            // get_camera_health(data1)

                            if (data1.length == 0) {
                                webrts_flag = true
                                setcameras_view('no_res')
                            }
                            // let element = document.getElementById(`outerDiv${0}`).clientHeight
                            // let vid = document.getElementsByTagName('video')
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

                    setdata(response.data)
                    setcameras1(response.data)
                   
                    // console.log('duplicate response 3', response.data);
                    if(isMotionDataView){
                        const sorted = response.data.filter((camera) => {
                            console.log('camera id', camera.motion_type)
                            return camera.motion_type === 'start'
                        })
                        setcameras_view(sorted)
                    }else{
                        setcameras_view(response.data)
                    }
                    // setDuplicateData(response.data)
                    setDuplicateData(response.data)
                    setcameras_view1(response.data)
                    setcamera_serach(response.data)
                    setvid(true)
                    setcamera_res(true)

                    let time = moment(new Date(), 'HH:mm:ss');
                    time.subtract(2, 'minutes');
                    let newTime1 = time.format('HH:mm:ss');
                    let newTime = moment(new Date()).format('HH:mm:ss');
                    response.data.map((val) => {
                        if ((moment(val.last_active_date).format('YYYY-MM-DD') == moment(new Date()).format('YYYY-MM-DD')) && (moment(val.last_active, 'HH:mm:ss').isBetween(moment(newTime1, 'HH:mm:ss'), moment(newTime, 'HH:mm:ss')))) {
                            data1.push({ ...val, camera_health: 'Online' })
                            online = online + 1
                        } else {
                            data1.push({ ...val, camera_health: 'Offline' })
                            offline = offline + 1
                        }
                    })

                    if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                        let access = userData.operation_type.filter((val) => { return val == 'Read' || val == 'All' || val == 'Edit' || val == 'Delete' })
                        if (access[0] == 'All' || access[1] == 'All' || access[2] == 'All' || access[2] == 'All') {
                            data1.map((cam, i) => {
                                data1[i] = { ...data1[i], permission_level: 'All' }
                            })
                        } else {
                            data1.map((cam, i) => {
                                data1[i] = { ...data1[i], permission_level: 'Read, Edit, Delete' }
                            })
                        }
                    } else {
                        userData.site_id.map((value) => {
                            let access = value.type.filter((val) => { return val == 'Read' || val == 'All' || val == 'Edit' || val == 'Delete' })
                            if (access[0] == 'All' || access[1] == 'All' || access[2] == 'All' || access[2] == 'All') {
                                data1.map((cam, i) => {
                                    data1[i] = { ...data1[i], permission_level: 'All' }
                                })
                            } else {
                                data1.map((cam, i) => {
                                    data1[i] = { ...data1[i], permission_level: 'Read, Edit, Delete' }
                                })
                            }
                        })
                    }


                    setdata(data1)
                    // setcameras(data1)
                    // setcameras1(data1)
                    console.log(data1)
                    if(isMotionDataView){
                        const sorted = data1.filter((camera) => {
                            console.log('camera id', camera.motion_type)
                            return camera.motion_type === 'start'
                        })
                        setcameras_view(sorted)
                    }else{
                        setcameras_view(data1)
                    }
                    console.log("data 1", data1)
                    setcameras_view1(data1)
                    // setcameras_search(data1)
                    setonline_cam(online)
                    setoffline_cam(offline)
                    // setvid(true)
                    // setcamera_res(true)

                    if (data1.length == 0) {
                        setcameras_view('no_res')
                        setcameras_view1('no_res')
                    }

                    // get_camera_health(response.data)

                    if (response.data.length == 0) {
                        webrts_flag = true
                        setcameras_view('no_res')
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

        return () => {
            hlsDetail.map((val) => {
                val.player.pause()
                val.hls.stopLoad()
                val.hls.destroy()
                val.player.remove()
                console.log(val.player)
            })
        }
    }

    useEffect(() => {
        get_all_cameras_live()
    }, [isMotionDataView, isStateChanged])




    function get_camera_health(cameras_res) {
        let data1 = []
        let count = 0
        let online = 0
        let offline = 0

        if (db_type == 'local') {
            setdata(cameras_res)
            // setcameras(data1)
            // setcameras1(data1)
            console.log(cameras_res)
            setcameras_view(cameras_res)
            console.log("data 1", cameras_res)
            setcameras_view1(cameras_res)
            // setcameras_search(data1)
            setonline_cam(online)
            setoffline_cam(offline)
            // setvid(true)
            // setcamera_res(true)

            if (cameras_res.length == 0) {
                setcameras_view('no_res')
                setcameras_view1('no_res')
            }
        } else {
            cameras_res.map((val) => {
                setskeleton(false)
                const getStocksData = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `${api.CAMERAS_HEALTH}${val.stream_id}/stream-info`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }

                console.log(getStocksData)
                axios(getStocksData)
                    .then(response => {
                        console.log(response.data);
                        setskeleton(true)
                        count = count + 1
                        data1.push({ ...val, camera_health: response.data.length !== 0 ? 'Online' : 'Offline' })
                        if (response.data.length !== 0) {
                            online = online + 1
                        } else {
                            offline = offline + 1
                        }

                        if (count == cameras_res.length) {

                            if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
                                let access = userData.operation_type.filter((val) => { return val == 'Read' || val == 'All' || val == 'Edit' || val == 'Delete' })
                                if (access[0] == 'All' || access[1] == 'All' || access[2] == 'All' || access[2] == 'All') {
                                    data1.map((cam, i) => {
                                        data1[i] = { ...data1[i], permission_level: 'All' }
                                    })
                                } else {
                                    data1.map((cam, i) => {
                                        data1[i] = { ...data1[i], permission_level: 'Read, Edit, Delete' }
                                    })
                                }
                            } else {
                                userData.site_id.map((value) => {
                                    let access = value.type.filter((val) => { return val == 'Read' || val == 'All' || val == 'Edit' || val == 'Delete' })
                                    if (access[0] == 'All' || access[1] == 'All' || access[2] == 'All' || access[2] == 'All') {
                                        data1.map((cam, i) => {
                                            data1[i] = { ...data1[i], permission_level: 'All' }
                                        })
                                    } else {
                                        data1.map((cam, i) => {
                                            data1[i] = { ...data1[i], permission_level: 'Read, Edit, Delete' }
                                        })
                                    }
                                })
                            }


                            setdata(data1)
                            // setcameras(data1)
                            // setcameras1(data1)
                            console.log(data1)
                            setcameras_view(data1)
                            console.log("data 1", data1)
                            setcameras_view1(data1)
                            // setcameras_search(data1)
                            setonline_cam(online)
                            setoffline_cam(offline)
                            // setvid(true)
                            // setcamera_res(true)

                            if (data1.length == 0) {
                                setcameras_view('no_res')
                                setcameras_view1('no_res')
                            }
                        }
                    })
                    .catch(function (e) {

                        if (db_type == 'local') {

                        } else {
                            if (e.message === 'Network Error') {
                                alert("No Internet Found. Please check your internet connection")
                            }
                            else {
                                alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                            }
                        }

                    });
            })
        }
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
                console.log(response.data, 'ppppppppppppppppp')
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

        console.log(config.data);


        axios.request(config)
            .then((response) => {
                console.log(response.data, '00000000000000000000000000000000')
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
                camera_value.push({ name: data[i].camera_gereral_name, ind: i })
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
                        } else {
                            flag = true
                            obj.push(new_camera_list[index1])

                        }
                    }

                    console.log(obj);
                    new_camera_list = obj

                }
                for (let index = 0; index < cameras_view.length; index++) {

                    if (cameras_view[index].camera_tags.length > 1) {
                        new_camera_list = [...new_camera_list, cameras_view[index]]
                    }

                }
            } else {
                new_camera_list = cameras_view
            }
        } else {
            if (check1.length != flagcount1 || check2.length != flagcount2) {
                if (val.tags.length !== 0) {
                    if (check.length == flagcount) {
                        let arr = []
                        let arr1 = []
                        for (let index = 0; index < cameras_view.length; index++) {
                            let flag = true
                            let obj = {}
                            for (let index1 = 0; index1 < val.tags.length; index1++) {
                                console.log(cameras_view[index]._id, val.tags[index1], index1);
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
                                arr1.push(obj._id)
                            }

                        }

                        group_value.map((group) => {
                            get_group_full_data_sort[group.ind].groups.map((groupdata) => {
                                data.map((cameradata) => {
                                    if (groupdata === cameradata._id) {
                                        arr.push(cameradata)
                                        arr1.push(cameradata._id)
                                    }
                                })
                            })
                        })


                        camera_value.map((group, i) => {
                            if (group.name == data[group.ind].camera_gereral_name) {
                                arr.push(data[group.ind])
                                arr1.push(data[group.ind]._id)
                            }
                        })

                        const uniqueArray = [...new Set(arr1)];
                        const new_camera_list1 = uniqueArray


                        for (let index = 0; index < uniqueArray.length; index++) {
                            for (let index1 = 0; index1 < arr.length; index1++) {
                                if (uniqueArray[index] == arr[index1]._id) {
                                    new_camera_list1.push(arr[index1])
                                    break
                                }

                            }

                        }
                        new_camera_list = new_camera_list1


                    } else {
                        for (let index = 0; index < val.tags.length; index++) {
                            let flag = false
                            let obj = []
                            for (let index1 = 0; index1 < new_camera_list.length; index1++) {
                                if (new_camera_list[index1]._id === val.tags[index]) {
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
                new_camera_list = data
            }

        }

        let camcnk = []
        tag_checkbox.map((cam) => {
            if (cam !== val._id) {
                camcnk.push(cam)
            }
        })

        settag_checkbox(camcnk)

        if (true) {
            setcameras_view(new_camera_list)
            setcameras_view1(new_camera_list)
            setcamera_serach(new_camera_list)

        }
    }

    function groupelsefunction(val, type) {
        let new_camera_list = cameras_view
        let flagcount = 0
        let flagcount1 = 0
        let flagcount2 = 0

        let group_value = []
        let camera_value = []

        let check = document.getElementsByClassName('groupCheckbox')
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
                camera_value.push({ name: data[i].camera_gereral_name, ind: i })
            }
        }

        console.log(check.length != flagcount);

        if (check.length != flagcount) {
            if (val.groups.length !== 0) {
                for (let index = 0; index < val.groups.length; index++) {
                    let flag = false
                    let obj = []
                    for (let index1 = 0; index1 < new_camera_list.length; index1++) {
                        if (new_camera_list[index1]._id === val.groups[index]) {
                            if (check1.length != flagcount1) {
                                group_value.map((group) => {
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
                        } else {
                            flag = true
                            obj.push(new_camera_list[index1])

                        }
                    }


                    new_camera_list = obj

                }
                for (let index = 0; index < cameras_view.length; index++) {

                    if (cameras_view[index].camera_groups.length > 1) {
                        new_camera_list = [...new_camera_list, cameras_view[index]]
                    }

                }

            } else {
                new_camera_list = cameras_view
            }
        } else {
            if (check1.length != flagcount1 || check2.length != flagcount2) {
                if (val.groups.length !== 0) {
                    if (check.length == flagcount) {
                        let arr = []
                        let arr1 = []
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
                                arr1.push(obj._id)
                            }

                        }

                        group_value.map((group) => {
                            get_tag_full_data_sort[group.ind].tags.map((groupdata) => {
                                data.map((cameradata) => {
                                    if (groupdata === cameradata._id) {
                                        arr.push(cameradata)
                                        arr1.push(cameradata._id)
                                    }
                                })
                            })
                        })


                        camera_value.map((group, i) => {
                            if (group.name == data[group.ind].camera_gereral_name) {
                                arr.push(data[group.ind])
                                arr1.push(data[group.ind]._id)
                            }
                        })

                        const uniqueArray = [...new Set(arr1)];
                        const new_camera_list1 = []

                        for (let index = 0; index < uniqueArray.length; index++) {
                            for (let index1 = 0; index1 < arr.length; index1++) {
                                if (uniqueArray[index] == arr[index1]._id) {
                                    new_camera_list1.push(arr[index1])
                                    break
                                }

                            }

                        }
                        new_camera_list = new_camera_list1


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
                new_camera_list = data
            }
        }

        let camcnk = []
        group_checkbox.map((cam) => {
            if (cam !== val._id) {
                camcnk.push(cam)
            }
        })

        setgroup_checkbox(camcnk)

        if (true) {



            setcameras_view(new_camera_list)
            setcameras_view1(new_camera_list)
            setcamera_serach(new_camera_list)

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
                setdata(arr)
            } else if (type == 'tag_search') {
                setget_tag_full_data_sort(arr)
            } else if (type == 'group_search') {
                setget_group_full_data_sort(arr)
            }

        } else {
            if (type == 'camera_search') {
                setcameras_view('no_res')
            } else if (type == 'camera_search1') {
                setdata([])
            } else if (type == 'tag_search') {
                setget_tag_full_data_sort([])
            } else if (type == 'group_search') {
                setget_group_full_data_sort([])
            }
        }
    }


    console.log('isFullScreen', isFullScreen)
    console.log('totalCameraCoverScreen', totalCameraCoverScreen)


    if (screenlogic == 0) {

        return (

            <div>
                <Loader />
            </div>
        )
    }

    else {

        return (
            <>
                {
                    userData.position_type != 'Attendance User' ?

                        <Aux>
                            <Row>
                                {/* <Button style={{ marginLeft:20,marginBottom:15 }} onClick={() => {
                                setbuttonval(true)
                                setflag(!flag)
                                 }} >YESTERDAY</Button>
                                <Button style={{ marginBottom:15 }}onClick={() => {
                                setbuttonval(false)
                                setflag(!flag)
                                }} >TODAY</Button> */}
                            </Row>

                            <div>
                                <Row style={{ padding: '10px', alignItems: 'center' }}>

                                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                                            {flag1 == false ?


                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    {skeleton != '' ? (
                                                        <div>
                                                            <input
                                                                type='text'
                                                                placeholder='Search'
                                                                style={{
                                                                    backgroundColor: '#e6e8eb',
                                                                    color: 'black',
                                                                    padding: '10px',
                                                                    borderRadius: '20px',
                                                                    border: '1px solid gray',
                                                                    marginRight: '20px'
                                                                }}
                                                                onChange={(e) => {
                                                                    // final_cameras_modify = []

                                                                    if (e.target.value !== '') {
                                                                        searchfunction(e.target.value, camera_serach, 'camera_search')
                                                                        settop_camera_search(e.target.value)
                                                                    } else {
                                                                        setcameras_view(camera_serach)
                                                                        settop_camera_search(e.target.value)
                                                                    }
                                                                }}
                                                            />

                                                            <button
                                                                style={{
                                                                    backgroundColor: filter ? '#e22747' : '#e6e8eb',
                                                                    color: filter ? 'white' : 'black',
                                                                    padding: '10px',
                                                                    borderRadius: '20px',
                                                                    border: '1px solid gray',
                                                                    marginRight: '20px'
                                                                }}
                                                                onClick={() => {
                                                                    setfilter(!filter);
                                                                    get_tag_full_list();
                                                                    get_group_full_list();
                                                                    setcamera_box(false);
                                                                    setcamera_tag(false);
                                                                    setcamera_group(false);
                                                                    setonline_status(false);
                                                                }}
                                                            >
                                                                <TuneOutlinedIcon style={{ marginRight: '10px' }} />
                                                                Filter
                                                            </button>



                                                        </div>
                                                    ) : (
                                                        <div style={{ width: "700px", display: 'flex' }}>
                                                            <Skeleton width={225} height={45} style={{ borderRadius: '20px', border: '1px solid gray', marginRight: '20px' }} />
                                                            <Skeleton width={100} height={45} style={{ borderRadius: '20px', border: '1px solid gray', marginRight: '20px' }} />
                                                        </div>


                                                    )}
                                                </div>





                                                :
                                                <Slider style={{ width: "30%" }}
                                                    aria-label="Temperature"
                                                    defaultValue={sliderValue}
                                                    valueLabelDisplay="auto"
                                                    step={1}
                                                    marks={marks}
                                                    min={0}
                                                    max={4}
                                                    onChange={handleSliderChange}
                                                    // valueLabelDisplay="on"
                                                    valueLabelFormat={(value) => {
                                                        return marks.find((mark) => mark.value === value).label;
                                                    }}
                                                    sx={{
                                                        '& .MuiSlider-thumb': {
                                                            backgroundColor: 'red',
                                                        },
                                                    }}
                                                />

                                            }
                                            <div>

                                                {
                                                    flag1 == false ?
                                                        <div>
                                                            <select
                                                                value={totalCameraCoverScreen}
                                                                onChange={(e) => {
                                                                    setTotalCameraCoverScreen(Number(e.target.value))
                                                                }}
                                                                className="form-select"
                                                                style={{
                                                                    padding: '4px 10px',
                                                                    margin: '0px 15px',
                                                                    borderRadius: '8px'
                                                                }}
                                                            >
                                                                <option value={1}>1</option>
                                                                <option value={2}>4</option>
                                                                <option value={3}>12</option>
                                                                <option value={4}>16</option>
                                                                <option value={6}>30</option>
                                                                <option value={12}>72</option>
                                                            </select>
                                                            <Tooltip title="Full Screen" arrow>
                                                                <ZoomOutMapIcon
                                                                    style={{ marginRight: '30px', cursor: 'pointer' }}
                                                                    onClick={handleFullScreenClick}
                                                                />
                                                            </Tooltip>

                                                            <Tooltip title="Edit layout" arrow>
                                                                <BorderColorIcon
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => {
                                                                        setflag1(!flag1);
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        </div>
                                                        : <Button onClick={() => { setflag1(!flag1); setdone(true) }} style={{ width: "100%", borderRadius: "30px" }} >Done</Button>
                                                }

                                            </div>


                                        </div>

                                    </Col>

                                </Row>

                                {
                                    filter && !flag1 ?
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
                                                                        console.log('____________++++++++++++++++');
                                                                    }} />
                                                                </div>

                                                                <div>
                                                                    <input type='text' placeholder='Search' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '20px', border: '1px solid gray', marginBottom: '5px', width: '100%', height: '40px' }} onChange={(e) => {
                                                                        if (e.target.value !== '') {
                                                                            searchfunction(e.target.value, cameras1, 'camera_search1')
                                                                            setcamera_search(e.target.value)
                                                                        } else {
                                                                            setdata(cameras1)
                                                                        }
                                                                    }}></input>
                                                                </div>

                                                                {
                                                                    data.length !== 0 ?
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
                                                                            setcameras_view(data)
                                                                            setcameras_view1(data)
                                                                            setcamera_serach(data)
                                                                            setcamera_box(!camera_box)
                                                                            console.log(camera_checkbox);
                                                                            setcamera_checkbox([])

                                                                        }}>Clear all</p>
                                                                        : ''
                                                                }
                                                            </div>

                                                            <div className='lower_alerts' style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                                                                {
                                                                    data.length !== 0 ?
                                                                        data.map((val, k) => {
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
                                                                                                console.log('!!!!!!');
                                                                                            } else {
                                                                                                tag_value.push(i)
                                                                                                console.log('!!!!!!2');
                                                                                            }
                                                                                        }

                                                                                        let check1 = document.getElementsByClassName('groupCheckbox')
                                                                                        for (let i = 0; i < check1.length; i++) {
                                                                                            if (check1[i].checked === false) {
                                                                                                flagcount1 = flagcount1 + 1

                                                                                                console.log('!!!!!4');
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
                                                                                                    console.log('!!!!!5');
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
                                                                                                            console.log(get_tag_full_data);
                                                                                                            console.log(val.camera_tags);
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
                                                                                            setcameras_view1(newcamera)
                                                                                            setcamera_serach(newcamera)
                                                                                        } else {


                                                                                            let chkbox = document.getElementsByClassName('cameraCheckbox')
                                                                                            let calculate = 0
                                                                                            for (let i = 0; i < chkbox.length; i++) {
                                                                                                if (chkbox[i].checked === false) {
                                                                                                    calculate = calculate + 1
                                                                                                }
                                                                                            }

                                                                                            if (calculate == chkbox.length) {
                                                                                                console.log('hjghjghfg');
                                                                                                let camcnk = []
                                                                                                camera_checkbox.map((cam) => {
                                                                                                    if (cam !== val._id) {
                                                                                                        camcnk.push(cam)
                                                                                                    }
                                                                                                })
                                                                                                setcamera_checkbox(camcnk)
                                                                                                setget_tag_full_data_sort(get_tag_full_data)
                                                                                                setget_tag_full_data_sort1(get_tag_full_data)
                                                                                                setget_group_full_data_sort(get_group_full_data)
                                                                                                setget_group_full_data_sort1(get_group_full_data)
                                                                                                setcameras_view(data)
                                                                                                setcameras_view1(data)
                                                                                                setcamera_serach(data)
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
                                                                                                        new_camera_list = data
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
                                                                                                setcameras_view1(new_camera_list)
                                                                                                setcamera_serach(new_camera_list)

                                                                                            }
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

                                                            <div>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                                                    <p style={{ margin: 0, color: 'white', width: '200px' }}>Online<span style={{ color: 'white', borderRadius: '50%', backgroundColor: '#a8a4a4', marginLeft: '10px', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px' }}>{online_cam}</span></p>
                                                                    <input id='online_status' className='status' type="checkbox" onClick={(e) => {
                                                                        let flagcount = 0
                                                                        let flagcount1 = 0
                                                                        let flagcount2 = 0



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
                                                                            }
                                                                        }

                                                                        let check2 = document.getElementsByClassName('cameraCheckbox')
                                                                        for (let i = 0; i < check2.length; i++) {
                                                                            if (check2[i].checked === false) {
                                                                                flagcount2 = flagcount2 + 1
                                                                            }
                                                                        }

                                                                        if (document.getElementById('offline_status').checked && e.target.checked) {
                                                                            setcameras_view(cameras_view1)
                                                                            // setcameras_search(cameras_view1)
                                                                        } else {
                                                                            if (e.target.checked === true) {
                                                                                let new_date = []
                                                                                cameras_view.map((val) => {
                                                                                    if (val.camera_health == 'Online') {
                                                                                        new_date.push(val)
                                                                                    }
                                                                                })

                                                                                setcameras_view(new_date)
                                                                                // setcameras_search(new_date)
                                                                            } else {
                                                                                if (!document.getElementById('offline_status').checked && !e.target.checked) {
                                                                                    setcameras_view(cameras_view1)
                                                                                    // setcameras_search(cameras_view1)
                                                                                } else {
                                                                                    let new_date = []
                                                                                    cameras_view.map((val) => {
                                                                                        if (val.camera_health != 'Online') {
                                                                                            new_date.push(val)
                                                                                        }
                                                                                    })

                                                                                    setcameras_view(new_date)
                                                                                    // setcameras_search(new_date)
                                                                                }

                                                                            }
                                                                        }
                                                                    }}
                                                                    ></input>
                                                                </div>

                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                                                    <p style={{ margin: 0, color: 'white', width: '200px' }}>Offline<span style={{ color: 'white', borderRadius: '50%', backgroundColor: '#a8a4a4', marginLeft: '10px', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px' }}>{offline_cam}</span></p>
                                                                    <input id='offline_status' className='status' type="checkbox" onClick={(e) => {

                                                                        let flagcount = 0
                                                                        let flagcount1 = 0
                                                                        let flagcount2 = 0



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
                                                                            }
                                                                        }

                                                                        let check2 = document.getElementsByClassName('cameraCheckbox')
                                                                        for (let i = 0; i < check2.length; i++) {
                                                                            if (check2[i].checked === false) {
                                                                                flagcount2 = flagcount2 + 1
                                                                            }
                                                                        }

                                                                        if (document.getElementById('online_status').checked && e.target.checked) {
                                                                            setcameras_view(cameras_view1)
                                                                            // setcameras_search(cameras_view1)
                                                                        } else {
                                                                            if (e.target.checked === true) {
                                                                                let new_date = []
                                                                                cameras_view.map((val) => {
                                                                                    if (val.camera_health == 'Offline') {
                                                                                        new_date.push(val)
                                                                                    }
                                                                                })

                                                                                setcameras_view(new_date)
                                                                                // setcameras_search(new_date)
                                                                            } else {
                                                                                if (!document.getElementById('online_status').checked && !e.target.checked) {
                                                                                    setcameras_view(cameras_view1)
                                                                                    // setcameras_search(cameras_view1)
                                                                                } else {
                                                                                    let new_date = []
                                                                                    cameras_view.map((val) => {
                                                                                        if (val.camera_health != 'Offline') {
                                                                                            new_date.push(val)
                                                                                        }
                                                                                    })

                                                                                    setcameras_view(new_date)
                                                                                    // setcameras_search(new_date)
                                                                                }

                                                                            }
                                                                        }
                                                                    }}></input>
                                                                </div>
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

                                                                                setget_tag_full_data_sort(get_tag_full_data)
                                                                                setget_tag_full_data_sort1(get_tag_full_data)
                                                                                setget_group_full_data_sort(get_group_full_data)
                                                                                setget_group_full_data_sort1(get_group_full_data)
                                                                                settag_checkbox([])
                                                                                // setcameras_view(data)
                                                                                // setcameras_view1(data)
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

                                                                                                            new_camera_list = data
                                                                                                        }

                                                                                                        setcameras_view(new_camera_list)
                                                                                                        setcameras_view1(new_camera_list)
                                                                                                        setcamera_serach(new_camera_list)

                                                                                                    })
                                                                                                    .catch((error) => {
                                                                                                        console.log(error);
                                                                                                    })

                                                                                                settag_checkbox([...tag_checkbox, val._id])
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

                                                                                setget_tag_full_data_sort(get_tag_full_data)
                                                                                setget_tag_full_data_sort1(get_tag_full_data)
                                                                                setget_group_full_data_sort(get_group_full_data)
                                                                                setget_group_full_data_sort1(get_group_full_data)

                                                                                // setcameras_view(data)
                                                                                // setcameras_view1(data)
                                                                                setcamera_group(!camera_group)
                                                                                setgroup_checkbox([])
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

                                                                                                        if (check1.length > flagcount1) {
                                                                                                            if (response.data.length !== 0) {
                                                                                                                if (check1.length - 1 == flagcount1) {
                                                                                                                    if (check.length == flagcount && check2.length == flagcount2) {

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

                                                                                                            new_camera_list = data
                                                                                                        }

                                                                                                        setcameras_view(new_camera_list)
                                                                                                        setcameras_view1(new_camera_list)
                                                                                                        setcamera_serach(new_camera_list)
                                                                                                    })
                                                                                                    .catch((error) => {
                                                                                                        console.log(error);
                                                                                                    })

                                                                                                setgroup_checkbox([...group_checkbox, val._id])
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
                                                <button onClick={() => setIsMotionDataView(!isMotionDataView)} style={{
                                                    backgroundColor: isMotionDataView ? '#e22747' : '#e6e8eb',
                                                    color: isMotionDataView ? '#fdfefe' : 'black',
                                                    color: 'black',
                                                    padding: '10px',
                                                    borderRadius: '20px',
                                                    border: '1px solid gray',
                                                    marginRight: '20px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    cursor: 'pointer'
                                                }} >
                                                    <span style={{
                                                        color: isMotionDataView ? '#fdfefe' : 'black',
                                                    }} >Motion</span>
                                                </button>
                                            </Col>
                                        </Row>
                                        : ''
                                }
                            </div>



                            <Row id='main'>
                                {
                                    cameras_view == '' ?
                                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <CardSkeleton cart={12} value={3} />
                                        </Col>
                                        : cameras_view == 'no_res' ?
                                            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                <div id='cam' style={{ display: 'flex', flexWrap: 'wrap', backgroundColor: isFullScreen ? 'black' : 'transparent', }}>
                                                    <div style={{ width: '100%' }}>
                                                        <hr></hr>
                                                        <p style={{ color: '#e32747', fontWeight: 'bolder', textAlign: 'center' }}>No Cameras Found !</p>
                                                    </div>
                                                </div>
                                            </Col>
                                            :
                                            ''


                                }
                            </Row>
                            {
                                cameras_view != '' && cameras_view != 'no_res' ?
                                    <div id='fullScreenDiv' style={{
                                        // height: isFullScreen && '100vh',
                                        // width: isFullScreen && '100%',
                                        overflowX: isFullScreen && 'auto',
                                        backgroundColor: isFullScreen ? '#242424' : 'transparent'
                                    }} >
                                        {!isFullScreen && <hr></hr>}
                                        <Row style={{
                                            // height :  isFullScreen && '100vh',
                                            // width :  isFullScreen && '100vw',
                                            backgroundColor: isFullScreen ? '#242424' : 'transparent'
                                        }} >
                                            {
                                                final_cameras_modify
                                            }


                                            {/* 
                        <Col xl={3} lg={6} md={6} sm={12} xs={12}>
                            <Card style={{ borderRadius: 25 }}>
                                <Card.Body >
                                    <Row>
                                        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                                            <Avatar sx={{ bgcolor: '#f4f6fd' }} style={{ height: '50px', width: '50px' }}>
                                                <GiExpense className="ml-0" color="#2d47f7" size={38} />
                                            </Avatar>
                                        </Col>
                                        <Col xxl={8} xl={8} lg={8} md={8} sm={8} xs={8}>
                                            <h6 className=" d-flex align-items-center m-b-1 ml-1" style={{ fontFamily: 'Poppins-SemiBold', fontSize: 28, lineHeight: 1.2 }}>{val.toFixed(Number(localStorage.getItem("Digits")))}</h6>
                                            <p className='m-b-0 ml-1 ' style={{ fontFamily: 'Poppins-M#5e72e4edium', fontSize: 16, lineHeight: 1.2, color: '#7e7e7e' }}>Expense</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col xl={3} lg={6} md={6} sm={12} xs={12}>
                            <Card style={{ borderRadius: 25 }}>
                                <Card.Body >
                                    <Row>
                                        <Col xl={3} lg={3} md={3} sm={3} xs={3}>

                                            {
                                                Number(Math.abs(Number(rev) - Number(val)).toFixed(Number(localStorage.getItem("Digits")))) > 0 ?
                                                    (
                                                        <Avatar sx={{ bgcolor: '#f4f6fd' }} style={{ height: '50px', width: '50px' }}>
                                                            <BsCloudArrowUpFill className="ml-0" color="#2d47f7" size={38} />
                                                        </Avatar>
                                                    ) : (
                                                        <Avatar sx={{ bgcolor: '#f4f6fd' }} style={{ height: '50px', width: '50px' }}>
                                                            <BsCloudArrowDownFill className="ml-0" color="#2d47f7" size={38} />
                                                        </Avatar>
                                                    )
                                            }

                                        </Col>
                                        <Col xxl={8} xl={8} lg={8} md={8} sm={8} xs={8}>
                                            <h6 className=" d-flex align-items-center m-b-1 ml-1" style={{ fontFamily: 'Poppins-SemiBold', fontSize: 28, lineHeight: 1.2 }}>{Number(Math.abs(Number(rev) - Number(val)).toFixed(Number(localStorage.getItem("Digits"))))}</h6>
                                            <p className='m-b-0 ml-1 ' style={{ fontFamily: 'Poppins-M#5e72e4edium', fontSize: 16, lineHeight: 1.2, color: '#7e7e7e' }}>{Number((Number(rev) - Number(val)).toFixed(Number(localStorage.getItem("Digits")))) > 0 ? "Profit" : "Loss"}</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>


                        <Col xl={3} lg={6} md={6} sm={12} xs={12}>
                            <Card style={{ borderRadius: 25 }}>
                                <Card.Body >
                                    <Row>
                                        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                                            <Avatar sx={{ bgcolor: '#f4f6fd' }} style={{ height: '50px', width: '50px' }}>
                                                <BsBagCheck className="ml-0" color="#2d47f7" size={38} />
                                            </Avatar>
                                        </Col>
                                        <Col xxl={8} xl={8} lg={8} md={8} sm={8} xs={8}>
                                            <h6 className=" d-flex align-items-center m-b-1 ml-1" style={{ fontFamily: 'Poppins-SemiBold', fontSize: 28, lineHeight: 1.2 }}>{ods}</h6>
                                            <p className='m-b-0 ml-1 ' style={{ fontFamily: 'Poppins-M#5e72e4edium', fontSize: 16, lineHeight: 1.2, color: '#7e7e7e' }}>Orders</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col> */}
                                        </Row>
                                    </div>
                                    : ''
                            }
                        </Aux >
                        :
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <p>Attendance user Doesn't have permission to access Live</p>
                        </div>
                }
            </>
        );
    }
}


export default Dashboard;