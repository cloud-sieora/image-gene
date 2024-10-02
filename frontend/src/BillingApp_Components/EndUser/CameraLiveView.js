import React, { useState, useEffect, createContext, useReducer, useCallback, useRef } from "react";
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
import './style.css'
import { db_type } from './db_config'
import Aux from "../../hoc/_Aux";
import HLSVideoPlayer from "../Components/LiveHLSPlayer";
import Loader from "../CommonComponent/Loader";
import { BsArrowLeftShort } from "react-icons/bs";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CloseIcon from '@mui/icons-material/Close';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
// import EventMenu from "./EventMenu";
import Events from "./Events";
import { date } from './DateTimeFun'
import { useDispatch, useSelector } from 'react-redux';
import Hls from "hls.js";
import * as api from '../Configurations/Api_Details'
import { WebRTCAdaptor } from '@antmedia/webrtc_adaptor';
import { CreateBucketCommand, S3Client, GetObjectCommand, ListBucketsCommand, DeleteBucketCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import './Styles/Live.css'
import ReactHlsPlayer from 'react-hls-player';
import ReactPlayer from 'react-player'


import {
  TransformWrapper,
  TransformComponent,
  useControls
} from "react-zoom-pan-pinch";



export const Context = createContext()

let playing_return = false
let replay_interval = ''
let retry_count = 0

function Dashboard() {
  const playerRef = useRef(null);
  const camera_details = JSON.parse(localStorage.getItem('cameraDetails'))
  const [playing, setPlaying] = useState(false);
  const [websocketConnected, setWebsocketConnected] = useState(false);
  const [streamId, setStreamId] = useState(camera_details.stream_id);
  const [imguri, setimguri] = useState('');
  const webRTCAdaptor = useRef(null);
  var playingStream = useRef(null);
  let pathName = window.location.pathname;
  let arr = pathName.split('/')

  const date1 = date()
  const { page, startdate, starttime, enddate, endtime, apply, select, selected_cameras } = useSelector((state) => state)
  const [buttonval, setbuttonval] = useState(false);
  const [screenlogic, setscreenlogic] = useState(1);
  const [flag, setflag] = useState(false);
  const [flag1, setflag1] = useState(false);
  const [retry_count1, setretry_count1] = useState(false);

  localStorage.setItem("button_value", buttonval);
  localStorage.setItem("button_flag", flag);


  const [btn, setbtn] = useState('events')
  // const [toggle, settoggle] = useState(false)
  // const [toggle1, settoggle1] = useState(false)
  const [videoFlag, setvideoFlag] = useState(1)
  const [cameraName, setcameraName] = useState(arr[arr.length - 1])
  const [res, setres] = useState('')
  const [hlsDetail, sethlsDetail] = useState([])

  const [showdata, setshowdata] = useState([])
  const [showdata1, setshowdata1] = useState([])

  const [showflag, setshowflag] = useState(false)
  const [showflag2, setshowflag2] = useState(false)





  // const [startdate, setstartdate] = useState(date1[0])
  // const [starttime, setstarttime] = useState('00:00')
  // const [endtime, setendtime] = useState(`${date1[2]}:${date1[3]}`)
  // const [enddate, setenddate] = useState(date1[1])
  const [data, setdata] = useState([])

  const [res_next_data, setres_next_data] = useState([])
  const [res1, setres1] = useState('')
  const [response_start_length, setresponse_end_length] = useState({ start_count: 0, end_count: 30, total: 0 })
  const [analytics, setanalytics] = useState({ analytics_obj: [], analytics_num: {} })
  // console.log(camera_details, 'oihqwfiuwehfiwefij');

  // const handleRecordingModeChange = (event) => {

  //   const selectedValue = event.target.value;

  //   const newRecordingMode = selectedValue === "Continuous" ? 1 : 0;
  //   console.log(recording_mode,'ssss');
  //   setRecordingMode(newRecordingMode);
  // };

  // const [selectedTag, setSelectedTag] = useState([camera_details.camera_tags]);
  const [selectedTag, setSelectedTag] = useState(camera_details.camera_tags);
  const [selectedTag1, setSelectedTag1] = useState(camera_details.camera_groups);


  const [isZoomDisplay, setIsZoomDisplay] = useState(false)
  // const [isHover, setIsHover] = useState(false)

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    return (
      <>
        <div style={{
          display: 'none',
          position: 'absolute',
          top: '20px',
          right: '65px',
          zIndex: 1,
          // border : '1px solid red',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          justifyContent: 'space-evenly',
          height: '35%',
          fontSize: '12px',
          // width : '100%'
        }} >
          <AddIcon style={{
            cursor: 'pointer'
          }}
            onClick={() => { zoomIn() }}
          />
          <RotateLeftIcon style={{
            cursor: 'pointer'
          }}
            onClick={() => { resetTransform() }}
          />
          <RemoveIcon style={{
            cursor: 'pointer'
          }}
            onClick={() => { zoomOut() }}
          />
        </div>
      </>
    );
  };




  // const handleTagClick = (tag) => {
  //   setSelectedTag([...selectedTag, tag]);
  // };

  // const handleTagRemove = (id, name) => {

  //   const updatedTags = [...selectedTag];


  //   updatedTags.splice(id, 1);


  //   setSelectedTag(updatedTags);
  //   const updatedTagsData = updatedTags.map(tag => ({ name: tag.name, id: tag.id }));

  //   const option = {
  //     url: api.CAMERA_CREATION + camera_details._id,
  //     method: "PUT",
  //     data: {
  //       "camera_tags": updatedTagsData
  //     }
  //   };
  //   axios(option)
  //     .then((res) => {

  //       console.log("Tag removed successfully:", res.data);

  //       const getTagsOption = {
  //         url: api.TAG_API_CREATE + id,
  //         method: 'GET'
  //       };


  //       axios(getTagsOption).then((res) => {

  //         console.log("Current tags:", res.data.tags);


  //         const updatedTags = [...res.data.tags];
  //         updatedTags.splice(camera_details._id)



  //         const updateTagsOption = {
  //           url: api.TAG_API_CREATE + id,
  //           method: "PUT",
  //           data: {
  //             "tags": updatedTags,
  //           }
  //         };

  //         return axios(updateTagsOption);
  //       }).then((res) => {
  //         console.log("Response after updating tags:", res.data);
  //       }).catch((error) => {
  //         console.error("Error:", error);
  //       });

  //     })
  //     .catch((error) => {
  //       console.error("Error removing tag:", error);
  //     });
  // };
  const handleTagRemove = (id, name) => {
    const updatedTags = [...selectedTag];

    updatedTags.splice(id, 1);

    setSelectedTag(updatedTags);

    const updatedTagsData = updatedTags.map(tag => ({ name: tag.name, id: tag.id }));

    const option = {
      url: api.CAMERA_CREATION + camera_details._id,
      method: "PUT",
      data: {
        "camera_tags": updatedTagsData
      }
    };

    axios(option)
      .then((res) => {
        console.log("Tag removed successfully:", res.data);

        const getTagsOption = {
          url: api.TAG_API_CREATE + id,
          method: 'GET'
        };

        return axios(getTagsOption);
      })
      .then((res) => {
        console.log("Current tags:", res.data.tags);


        const updatedTags = [...res.data.tags];

        const indexToRemove = updatedTags.findIndex(tag => tag === camera_details._id);
        if (indexToRemove !== -1) {
          updatedTags.splice(indexToRemove, 1);
        }


        const updateTagsOption = {
          url: api.TAG_API_CREATE + id,
          method: "PUT",
          data: {
            "tags": updatedTags,
          }
        };


        return axios(updateTagsOption);
      })
      .then((res) => {
        console.log("Response after updating tags:", res.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  const handleTagRemove2 = (id, group_name) => {
    const updatedTags = [...selectedTag1];
    console.log(id, 'sajshkjashkjah');

    updatedTags.splice(id, 1);

    setSelectedTag1(updatedTags);

    const updatedTagsData = updatedTags.map(tag => ({ name: tag.name, id: tag.id }));
    console.log(updatedTagsData, 'sakgsag');

    const option = {
      url: api.CAMERA_CREATION + camera_details._id,
      method: "PUT",
      data: {
        "camera_groups": updatedTagsData
      }
    };

    axios(option)
      .then((res) => {
        console.log("Tag removed successfully:", res.data);

        const getTagsOption = {
          url: api.GROUP_API_CREATE + id,
          method: 'GET'
        };

        return axios(getTagsOption);
      })
      .then((res) => {
        console.log("Current tags:", res.data.groups);


        const updatedTags = [...res.data.groups];

        const indexToRemove = updatedTags.findIndex(tag => tag === camera_details._id);
        if (indexToRemove !== -1) {
          updatedTags.splice(indexToRemove, 1);
        }


        const updateTagsOption = {
          url: api.GROUP_API_CREATE + id,
          method: "PUT",
          data: {
            "groups": updatedTags,
          }
        };


        return axios(updateTagsOption);
      })
      .then((res) => {
        console.log("Response after updating tags:", res.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };



  const handleTagClick2 = async (group_id, groupname) => {
    try {
      const options = {
        url: api.CAMERA_CREATION + camera_details._id,
        method: "PUT",
        data: {
          "camera_groups": [...selectedTag1, { name: groupname, id: group_id }]
        },
      };
      console.log(options);
      console.log(group_id, groupname);

      const response = await axios(options);
      console.log(response, 'akak');
      setSelectedTag1([...selectedTag1, { name: groupname, id: group_id }]);
      localStorage.setItem('camera_details', JSON.stringify(response.data));
      console.log(group_id, 'pooo');

      console.log(selectedTag1);

      console.log(response.data);


      const getTagsOption = {
        url: api.GROUP_API_CREATE + group_id,
        method: 'GET'
      };


      axios(getTagsOption).then((res) => {

        console.log("Current tags:", res.data, 'osjsk');


        const updatedTags = [...res.data.groups, camera_details._id];


        const updateTagsOption = {
          url: api.GROUP_API_CREATE + group_id,
          method: "PUT",
          data: {
            "groups": updatedTags,
          }
        };

        return axios(updateTagsOption);
      }).then((res) => {
        console.log("Response after updating groups:", res.data);
      }).catch((error) => {
        console.error("Error:", error);
      });

    }



    catch (error) {
      console.error("Error:2", error);
    }
  };



  const handleTagClick = async (tagid, tagname) => {
    try {
      const options = {
        url: api.CAMERA_CREATION + camera_details._id,
        method: "PUT",
        data: {
          "camera_tags": [...selectedTag, { name: tagname, id: tagid }]
        },
      };
      console.log(options);
      console.log(tagid, tagname);

      const response = await axios(options);
      console.log(response, 'akak');
      setSelectedTag([...selectedTag, { name: tagname, id: tagid }]);
      localStorage.setItem('camera_details', JSON.stringify(response.data));
      console.log(tagid, 'pooo');

      console.log(selectedTag);

      console.log(response.data);


      const getTagsOption = {
        url: api.TAG_API_CREATE + tagid,
        method: 'GET'
      };


      axios(getTagsOption).then((res) => {

        console.log("Current tags:", res.data.tags);


        const updatedTags = [...res.data.tags, camera_details._id];


        const updateTagsOption = {
          url: api.TAG_API_CREATE + tagid,
          method: "PUT",
          data: {
            "tags": updatedTags,
          }
        };

        return axios(updateTagsOption);
      }).then((res) => {
        console.log("Response after updating tags:", res.data);
      }).catch((error) => {
        console.error("Error:", error);
      });

    }



    catch (error) {
      console.error("Error:2", error);
    }
  };

  useEffect(() => {

    if (db_type == 'local') {

    } else {
      webRTCAdaptor.current = new WebRTCAdaptor({
        websocket_url: 'wss://live.tentovision.com:5443/WebRTCAppEE/websocket',
        // websocket_url: 'wss://antmedia.cloudjiffy.net/WebRTCAppEE/websocket',
        mediaConstraints: {
          video: false,
          audio: false,
        },
        peerconnection_config: {
          iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }],
        },
        sdp_constraints: {
          OfferToReceiveAudio: false,
          OfferToReceiveVideo: true, // Set to true to receive video
        },
        remoteVideoId: `video0`,
        callback: (info, obj) => {
          if (info === 'initialized') {
            setWebsocketConnected(true)
            handlePlay()
          }
        },
        callbackError: function (error, message) {
          console.log(error);
          console.log(message);

          // setTimeout(() => {
          //   setflag1(!flag1)

          // }, 10000)

          if (error === 'no_stream_exist') {
            let tech = document.getElementById(`tech`)
            tech.style.display = 'block'

            let live = document.getElementById(`live`)
            live.style.display = 'none'

            let load = document.getElementById(`load`)
            load.style.display = 'none'

            let buff = document.getElementById(`buff`)
            buff.style.display = 'none'

            // document.getElementById(`p1`).innerText(`"${camera_details.camera_gereral_name}"`)
            // document.getElementById(`p2`).innerText('No Stream Exist')
            handleStopPlaying();
            setPlaying(false);
            playing_return = false
          } else if (error === 'WebSocketNotConnected') {
            setvideoFlag(0)
          } else if (error === 'invalidStreamName') {
            let tech = document.getElementById(`tech`)
            tech.style.display = 'block'

            let live = document.getElementById(`live`)
            live.style.display = 'none'

            let load = document.getElementById(`load`)
            load.style.display = 'none'

            let buff = document.getElementById(`buff`)
            buff.style.display = 'none'

            // document.getElementById(`p1`).innerText(`"${camera_details.camera_gereral_name}"`)
            // document.getElementById(`p2`).innerText('Please Check the Stream Name')
          }
        },
      });
    }

    getimageuri(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, camera_details)

    return () => {
      if (db_type == 'local') {

      } else {
        if (playing_return) {
          console.log('if');
          handleStopPlaying();
        }
        webRTCAdaptor.current.callbackError = () => {

        }
      }
    }

  }, [flag1]);


  useEffect(() => {
    const load = async () => {


      let data = JSON.stringify({
        "user_id": camera_details.user_id
      });
      const option = {
        url: api.TAG_API_LIST,
        method: "POST",
        data: data,

      }
      console.log(option, 'a');
      await axios(option).then((res) => {
        console.log(res.data, 'akakaa');
        setshowdata(res.data)

      })
    }
    load()

  }, [btn]);


  useEffect(() => {
    let data = JSON.stringify({
      "user_id": camera_details.user_id
    });
    const options = {
      url: api.GROUP_API_LIST,
      method: "POST",
      data: data,
    }
    console.log(options, 'sooo');
    axios(options).then((res) => {
      console.log(res.data, 'asjhdkjashdkja');
      setshowdata1(res.data)
    })

  }, [btn])

  // console.log(setshowdata1,'sss');



  console.log(camera_details, 'camera_details');

  const [recording_mode, setRecordingMode] = useState(camera_details.recording_mode);
  console.log(recording_mode);
  const [username, setusername] = useState(camera_details.camera_gereral_name);
  const [toggle, settoggle] = useState(camera_details.cloud_recording == 0 ? false : true);
  const [toggle1, settoggle1] = useState(camera_details.analytics_alert == 0 ? false : true);
  const [toggle3, settoggle3] = useState(camera_details.alert == 0 ? false : true);
  const [camera_pixels, setCameraPixels] = useState(camera_details.camera_mp)
  const [isPlanSelected, setIsPlanSelected] = useState(false)




  const [planSettingsDetails, setPlanSettingsDetails] = useState({
    recording_mode:
      camera_details.camera_option.live === 1 ? 1 :
        camera_details.camera_option.motion === 1 ? 0 :
          'select'
    ,
    camera_gereral_name: camera_details.camera_gereral_name,
    alert: camera_details.camera_option.alert,
    analytics: camera_details.camera_option.analytics,
    camera_mp: camera_details.camera_mp,
    people_analytics: camera_details.camera_option.people_analytics,
    vehicle_analytics: camera_details.camera_option.vehicle_analytics,
    _id: camera_details._id
  })

  const [checkWhichDataChanged, setCheckWhichDataChanged] = useState({
    recording_mode: false,
    camera_gereral_name: false,
    alert: false,
    analytics: false,
    people_analytics: false,
    vehicle_analytics: false
  })

  const handleChangePlanDetails = (e) => {
    console.log('onchange function', e.target.value)
    const { name, value } = e.target
    setCheckWhichDataChanged((prevState) => ({
      ...prevState,
      [name]: true
    }));
    setPlanSettingsDetails({ ...planSettingsDetails, [name]: value })
  }



  console.log('planSettingsDetails', planSettingsDetails);
  // console.log('userSelectedPlan', userSelectedPlan);
  console.log('camera_details', camera_details);

  const handleCLickChangePlanDetails = async () => {
    if (planSettingsDetails.alert == 0 && planSettingsDetails.analytics == 0 && planSettingsDetails.vehicle_analytics == 0 && planSettingsDetails.people_analytics == 0 && planSettingsDetails.recording_mode == 'select') {
      let updatedData = {
        camera_gereral_name: planSettingsDetails.camera_gereral_name,
        // camera_mp: planSettingsDetails.camera_mp,
        // _id: camera_details._id,
        // plan_end_date: userSelectedPlan.sub.end_date,
        // plan_end_time: userSelectedPlan.sub.end_time,
        // plan_start_date: userSelectedPlan.sub.start_date,
        // plan_start_time: userSelectedPlan.sub.start_time,
        // subscribe_id: userSelectedPlan.sub._id
        camera_option: {
          ...camera_details.camera_option,
          live: 0,
          motion: 0,
          alert: 0,
          analytics: 0,
          people_analytics: 0,
          vehicle_analytics: 0,
        },
      }
      const options = {
        url: api.CAMERA_CREATION + camera_details._id,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(updatedData)

      };

      console.log('updated data', updatedData)


      await axios(options)
        .then(response => {
          console.log('response from the put request', response.data)
          window.history.replaceState(null, null, "/Home/Home/")
          window.location.reload();

        })
        .catch(function (e) {
          if (e.message === 'Network Error') {
            alert("No Internet Found. Please check your internet connection")
          }
          else {

            alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
          }


        });
    } else if (isPlanSelected) {

      let allowedAnalytics = true;
      let allowedAlert = true;
      let allowedPeople = true;
      let allowedVehicle = true;
      let allowedRecording_mode = true;

      console.log('planSettingsDetails', planSettingsDetails);
      console.log('userSelectedPlan', userSelectedPlan);
      console.log('camera_details', camera_details);

      // Check if cloud_recording value is greater than cloud value
      // if (planSettingsDetails.camera_option.cloud > userSelectedPlan.cameras_options.cloud) {
      //   allowed = false;
      // }

      // Check if analytics_alert value is greater than alert value


      if (checkWhichDataChanged.analytics && planSettingsDetails.analytics > userSelectedPlan.cameras_options.analytics && userSelectedPlan.cameras_options.analytics >= 0) {
        allowedAnalytics = false;
      }


      if (checkWhichDataChanged.alert && planSettingsDetails.alert > userSelectedPlan.cameras_options.alert && userSelectedPlan.cameras_options.alert >= 0) {
        allowedAlert = false;
      }

      if (checkWhichDataChanged.vehicle_analytics && planSettingsDetails.vehicle_analytics > userSelectedPlan.cameras_options.vehicle_analytics && userSelectedPlan.cameras_options.vehicle_analytics >= 0) {
        allowedVehicle = false;
      }


      if (checkWhichDataChanged.people_analytics && planSettingsDetails.people_analytics > userSelectedPlan.cameras_options.people_analytics && userSelectedPlan.cameras_options.people_analytics >= 0) {
        allowedPeople = false;
      }

      // Check if recording_mode is 0 and motion planDetails.cameras_options value is less than camera_mp
      const cameraMp = parseInt(planSettingsDetails.camera_mp);
      if (checkWhichDataChanged.recording_mode && planSettingsDetails.recording_mode == 0) {
        if (cameraMp == 2) {
          allowedRecording_mode = userSelectedPlan.cameras_options._2mp.motion > 0
        } else if (cameraMp == 4) {
          allowedRecording_mode = userSelectedPlan.cameras_options._4mp.motion > 0
        } else if (cameraMp == 8) {
          allowedRecording_mode = userSelectedPlan.cameras_options._8mp.motion > 0
        }
      }
      else if (checkWhichDataChanged.recording_mode && planSettingsDetails.recording_mode == 1) {
        if (cameraMp == 2) {
          allowedRecording_mode = userSelectedPlan.cameras_options._2mp.continues > 0
        } else if (cameraMp == 4) {
          allowedRecording_mode = userSelectedPlan.cameras_options._4mp.continues > 0
        } else if (cameraMp == 8) {
          allowedRecording_mode = userSelectedPlan.cameras_options._8mp.continues > 0
        }
      }



      console.log('recording mode', planSettingsDetails.recording_mode)
      console.log('Alert', planSettingsDetails.alert)

      console.log('allowedAnalytics', allowedAnalytics)
      console.log('allowedAlert', allowedAlert)
      console.log('allowedVehicle', allowedVehicle)
      console.log('allowedPeople', allowedPeople)
      console.log('allowedRecording_mode', allowedRecording_mode)


      if (!allowedAnalytics || !allowedAlert || !allowedVehicle || !allowedPeople || !allowedRecording_mode) {
        alert('Your plan is not eligible');
      } else {
        console.log('coming inside allowed');
        let updatedData = {
          camera_gereral_name: planSettingsDetails.camera_gereral_name,
          camera_option: {
            ...camera_details.camera_option,
            alert: planSettingsDetails.alert,
            analytics: planSettingsDetails.analytics,
            live: planSettingsDetails.recording_mode == 1 ? 1 : 0,
            motion: planSettingsDetails.recording_mode == 0 ? 1 : 0,
            vehicle_analytics: planSettingsDetails.vehicle_analytics,
            people_analytics: planSettingsDetails.people_analytics,
            cloud: userSelectedPlan.sub.options.cloud,
            local: userSelectedPlan.sub.options.local
          },
          camera_mp: planSettingsDetails.camera_mp,
          _id: camera_details._id,
          plan_end_date: userSelectedPlan.sub.end_date,
          plan_end_time: userSelectedPlan.sub.end_time,
          plan_start_date: userSelectedPlan.sub.start_date,
          plan_start_time: userSelectedPlan.sub.start_time,
          subscribe_id: userSelectedPlan.sub._id
        }
        const options = {
          url: api.CAMERA_CREATION + camera_details._id,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify(updatedData)

        };

        console.log('updated data', updatedData)


        await axios(options)
          .then(response => {
            console.log('response from the put request', response.data)
            window.history.replaceState(null, null, "/Home/Home/")
            window.location.reload();

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
    } else {
      let updatedData = {
        camera_gereral_name: planSettingsDetails.camera_gereral_name,
      }
      const options = {
        url: api.CAMERA_CREATION + camera_details._id,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(updatedData)

      };

      console.log('updated data', updatedData)


      await axios(options)
        .then(response => {
          console.log('response from the put request', response.data)
          window.history.replaceState(null, null, "/Home/Home/")
          window.location.reload();

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


  };



  const handleCLickChangePlanDetails1 = async () => {


    let allowed = true

    console.log('changed data', planSettingsDetails)

    allowed = planSettingsDetails.cloud_recording <= userSelectedPlan.cameras_options.cloud
    allowed = planSettingsDetails.analytics_alert <= userSelectedPlan.cameras_options.analytics
    allowed = planSettingsDetails.vehicle_analytics <= userSelectedPlan.cameras_options.vehicle_analytics
    allowed = planSettingsDetails.people_analytics <= userSelectedPlan.cameras_options.people_analytics


    if (!allowed) {
      alert('your plan is not eligible')
    } else {
      console.log('coming inside allowed', allowed)
      let updatedData = {

      }
      const options = {
        url: api.CAMERA_CREATION + camera_details._id,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)

      };


    }




    // if (selectedRecordingMode === 0) {

    //   if (camera_pixels == 2) {
    //     allowed = userSelectedPlan.cameras_options._2mp.motion === 1
    //   } else if (camera_pixels == 4) {
    //     allowed = userSelectedPlan.cameras_options._4mp.motion === 1
    //   } else if (camera_pixels == 8) {
    //     allowed = userSelectedPlan.cameras_options._8mp.motion === 1
    //   }
    // }

    // else if (selectedRecordingMode === 1) {
    //   if (camera_pixels == 2) {
    //     allowed = userSelectedPlan.cameras_options._2mp.continues === 1
    //   } else if (camera_pixels == 4) {
    //     allowed = userSelectedPlan.cameras_options._4mp.continues === 1
    //   } else if (camera_pixels == 8) {
    //     allowed = userSelectedPlan.cameras_options._8mp.continues === 1
    //   }
    // }






    // axios(options)
    //   .then(response => {
    //     console.log(response.data)
    //     window.history.replaceState(null, null, "/Home/Home/")
    //     window.location.reload();

    //   })
    //   .catch(function (e) {
    //     if (e.message === 'Network Error') {
    //       alert("No Internet Found. Please check your internet connection")
    //     }
    //     else {

    //       alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
    //     }


    //   });



    // onClick={() => {

    //   if (userSelectedPlan.cameras_options.cloud > 0) {
    //     const options = {
    //       url: api.CAMERA_CREATION + camera_details._id,
    //       method: "PUT",
    //       data: {
    //         "cloud_recording": !toggle ? 1 : 0,
    //       }
    //     };

    //     axios.request(options)
    //       .then((response) => {
    //         console.log(response.data)
    //         localStorage.setItem('cameraDetails', JSON.stringify(response.data));
    //         settoggle(!toggle)
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       })
    //   } else {
    //     alert('your plan is not allowed to cloud recording')
    //   }

    // }}

    // onChange={(e) => {
    //   const selectedRecordingMode = parseInt(e.target.value);


    //   let allowed = false;


    //   if (selectedRecordingMode === 0) {

    //     if(camera_pixels == 2){
    //       allowed = userSelectedPlan.cameras_options._2mp.motion === 1
    //     }else if(camera_pixels == 4){
    //       allowed = userSelectedPlan.cameras_options._4mp.motion === 1
    //     }else if(camera_pixels == 8){
    //       allowed = userSelectedPlan.cameras_options._8mp.motion === 1
    //     }
    //   }

    //   else if (selectedRecordingMode === 1) {
    //     if(camera_pixels == 2){
    //       allowed = userSelectedPlan.cameras_options._2mp.continues === 1
    //     }else if(camera_pixels == 4){
    //       allowed = userSelectedPlan.cameras_options._4mp.continues === 1
    //     }else if(camera_pixels == 8){
    //       allowed = userSelectedPlan.cameras_options._8mp.continues === 1
    //     }
    //   }


    //   if (allowed) {
    //     const options = {
    //       url: api.CAMERA_CREATION + camera_details._id,
    //       method: "PUT",
    //       data: {
    //         "recording_mode": selectedRecordingMode,
    //       }
    //     };

    //     axios.request(options)
    //       .then((response) => {
    //         console.log(response.data);
    //         localStorage.setItem('cameraDetails', JSON.stringify(response.data));
    //         setRecordingMode(response.data.recording_mode);
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //   } else {
    //     alert('Your plan does not allow this recording mode');
    //   }
    // }}

    // onClick={() => {
    //   console.log('user selected plan', userSelectedPlan)
    //   if (userSelectedPlan.cameras_options.analytics > 0) {
    //     const options = {
    //       url: api.CAMERA_CREATION + camera_details._id,
    //       method: "PUT",
    //       data: {
    //         "analytics_alert": !toggle1 ? 1 : 0,
    //       }
    //     };

    //     axios.request(options)
    //       .then((response) => {
    //         console.log(response.data)
    //         localStorage.setItem('cameraDetails', JSON.stringify(response.data));
    //         settoggle1(!toggle1)
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       })
    //   } else {
    //     alert('Your plan is not allowed to Analytics')
    //   }


    // }}

    // onClick={() => {
    //   console.log('user selected plan', userSelectedPlan)
    //   if (userSelectedPlan.cameras_options.laert > 0) {
    //     const options = {
    //       url: api.CAMERA_CREATION + camera_details._id,
    //       method: "PUT",
    //       data: {
    //         "alert": !toggle3 ? 1 : 0,
    //       }
    //     };

    //     axios.request(options)
    //       .then((response) => {
    //         console.log(response.data)
    //         localStorage.setItem('cameraDetails', JSON.stringify(response.data));
    //         settoggle3(!toggle3)
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       })
    //   } else {
    //     alert('Your plan is not allowed to Analytics')
    //   }


    // }}

  }



  console.log('camera details', camera_details)


  const [flag2, setflag2] = useState(false)

  const update = async () => {
    try {
      const options = {
        url: api.CAMERA_CREATION + camera_details._id,
        method: "PUT",
        data: {
          "camera_gereral_name": username,
        }
      };

      const res = await axios(options);
      console.log("Update response:", res.data);

      localStorage.setItem('cameraDetails', JSON.stringify(res.data));
      setusername(res.data.camera_gereral_name);

    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handlePlay = () => {
    setPlaying(true);
    playing_return = true
    playingStream.current = streamId
    if (camera_details.publish_mode == 1) {
      webRTCAdaptor.current.play(streamId);
    } else {
      webRTCAdaptor.current.join(streamId);
    }
    // webRTCAdaptor.current.join('test_stream');
  };

  const handleStopPlaying = () => {
    setPlaying(false);
    playing_return = false
    webRTCAdaptor.current.stop(playingStream.current);
  };

  useEffect(() => {
    setres('')
    let pathName = window.location.pathname;
    let arr = pathName.split('/')
    setcameraName(arr[arr.length - 1])

    getdata(startdate, enddate, arr[arr.length - 1])

  }, [apply])

  function getdata(startdate, enddate, cameraName) {
    let pathName = window.location.pathname;
    let arr = pathName.split('/')
    setdata([])
    setres('')
    setres_next_data([])

    let ids = [camera_details._id]

    let data = JSON.stringify({
      "camera_id": ids,
      "camera_name": '',
      // startdate
      "start_date": startdate,
      "start_time": starttime,
      // enddate
      "end_date": enddate,
      "end_time": endtime,
      "start_count": response_start_length.start_count,
      "end_count": response_start_length.end_count,
      "analytic_flag": true
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: api.ANALYTICS_LIST,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }

    axios.request(config)
      .then((response) => {
        console.log(response.data.data);
        console.log(response.data.analytics);

        response_start_length.total = response.data.length
        let element = document.getElementById('outerDiv').clientHeight
        let ele = document.getElementById('video0')
        ele.height = element

        setdata(response.data.data)
        setanalytics(response.data.analytics)
        if (response.data.data.length === 0) {
          setres('empty response')
        } else {
          setres('')
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function call_next_data() {
    if (selected_cameras.length !== 0) {
      if (response_start_length.start_count + 60 <= response_start_length.total) {
        response_start_length.start_count = response_start_length.start_count + 30
        response_start_length.end_count = response_start_length.start_count + 30
        next_data()
      } else if (response_start_length.start_count + 30 <= response_start_length.total) {
        response_start_length.start_count = response_start_length.start_count + 30
        response_start_length.end_count = response_start_length.start_count + 30
        next_data()
      } else if (response_start_length.start_count <= response_start_length.total) {
        response_start_length.start_count = response_start_length.total + 1
        response_start_length.end_count = response_start_length.total
        next_data()
      } else {
        setres1('no more data')
      }
    }

  }

  function next_data() {
    setres1('progress')

    let ids = [camera_details._id]

    let data = JSON.stringify({
      "camera_id": ids,
      "camera_name": '',
      // startdate
      "start_date": startdate,
      "start_time": starttime,
      // enddate
      "end_date": enddate,
      "end_date": endtime,
      "start_count": response_start_length.start_count + 1,
      "end_count": response_start_length.end_count,
      "analytic_flag": false
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: api.ANALYTICS_LIST,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }

    axios.request(config)
      .then((response) => {
        console.log(response.data.data);
        setres_next_data(response.data.data)
        if (response.data.data.length === 0) {
          setres1('no more data')
        } else {
          setres1('')
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const golive = (url) => {
    // console.log(player);


    const player = document.getElementById('video0')

    if (Hls.isSupported() && player) {
      const video = player;
      const hls = new Hls({
        "debug": false,
        "enableWorker": true,
        "lowLatencyMode": true,
        "backBufferLength": 90
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.muted = true;
        var playPromise = video.play();

        if (playPromise !== undefined) {
          // console.log(playPromise, "play");
          playPromise.then(val => {
            // console.log(val, "hdushdhsd");
            // console.log(i);
            let tech = document.getElementById(`tech`)
            tech.style.display = 'none'

            let live = document.getElementById(`live`)
            live.style.display = 'block'

            let load = document.getElementById(`load`)
            load.style.display = 'none'

            let buff = document.getElementById(`buff`)
            buff.style.display = 'none'
            // Automatic playback started!
            // Show playing UI.
            // We can now safely pause video...
          })
            .catch(error => {
              console.log(error, "error");
              // Auto-play was prevented
              // Show paused UI.
            });
        }
      });
      hls.on(Hls.Events.ERROR, function (error, data) {
        // console.log(error);
        // console.log(data.error.message);
        if (data.error.message !== 'A network error (status 404) occurred while loading manifest') {
          hls.loadSource(url)
          let tech = document.getElementById(`tech`)
          tech.style.display = 'none'

          let live = document.getElementById(`live`)
          live.style.display = 'none'

          let load = document.getElementById(`load`)
          load.style.display = 'none'

          let buff = document.getElementById(`buff`)
          buff.style.display = 'block'
        } else {
          let tech = document.getElementById(`tech`)
          tech.style.display = 'block'

          let live = document.getElementById(`live`)
          live.style.display = 'none'

          let load = document.getElementById(`load`)
          load.style.display = 'none'

          let buff = document.getElementById(`buff`)
          buff.style.display = 'none'
        }
        // hls.loadSource(url)
        // hls.startLoad(url)
        // hls.detachMedia()
        // hls.attachMedia(document.getElementById(`video${0}`))
      })

      hlsDetail.push({ 'hls': hls, 'player': player })
      // console.log(hlsDetail);
    }
  }

  async function getimageuri(accessKeyId, secretAccessKey, Bucket, data) {
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

    let image_url = ''

    if (db_type == 'local') {
      image_url = data.image_uri
    } else {
      image_url = await getSignedUrl(s3Client, image_command)
    }
    setimguri(image_url)

  }



  const userDataFromLocalStorge = JSON.parse(localStorage.getItem('userData'))
  const [subscriptionPlanData, setSubscriptionPlanData] = useState({})
  const [userSelectedPlan, setUserSelectedPlan] = useState({})
  const getAllSubscriptionData = async () => {
    const data = {
      "client_id": userDataFromLocalStorge._id
    }
    await axios.post(`${api.LIST_SUBSCRIPTION_PLAN}`, data).then((res) => {
      console.log(res.data);
      setSubscriptionPlanData(res.data)
    }).catch((err) => console.log(err))
    // await axios.post(`http://10.147.28.80:5008/subscription_explain_api`, data).then((res) => setSubscriptionPlanData(res.data)).catch((err) => console.log(err))
  }

  useEffect(() => {
    getAllSubscriptionData()
  }, [])


  console.log('subscription data', subscriptionPlanData)
  console.log('user data from local storage data', userDataFromLocalStorge._id)
  console.log('userSelectedPlan', userSelectedPlan);


  if (screenlogic == 0) {
    return (
      <div>
        <Loader />
      </div>
    );
  } else {
    return (
      <>
        <div id="main" style={{ overflowY: 'hidden' }}>
          <Aux>

            <div>

              <div style={{ width: '100%', display: page === 1 ? 'none' : 'block', position: 'relative' }}>
                <Row>

                  {/* <button className="backbtn" onClick={() => {
                    window.history.replaceState(null, null, "/Home/Home/")
                    window.location.reload();
                  }}><BsArrowLeftShort size={30} style={{ marginRight: '5px' }} /> Back</button> */}
                  {/* <Button style={{ marginLeft:20,marginBottom:15 }} onClick={() => {
                      setbuttonval(true)
                      setflag(!flag)
                      }} >YESTERDAY</Button>
                      <Button style={{ marginBottom:15 }}onClick={() => {
                      setbuttonval(false)
                      setflag(!flag)
                      }} >TODAY</Button> */}
                </Row>

                <Row>
                  <Col xl={12} lg={12} md={12} sm={12} xs={12}>

                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <div style={{ position: 'absolute', left: 0, right: 0 }}>
                        <button className="backbtn" onClick={() => {
                          window.history.replaceState(null, null, "/Home/Home/")
                          window.location.reload();
                        }}><BsArrowLeftShort size={30} style={{ marginRight: '5px' }} /> Back</button>
                      </div>

                      <h1 style={{ color: 'black', fontSize: '30px', marginLeft: '10px', fontWeight: 'bolder', display: 'flex', alignItems: 'flex-end' }}>{camera_details.camera_gereral_name}<span><div style={{ width: '10px', height: '10px', backgroundColor: '#e32747', borderRadius: '50%' }}></div></span></h1>
                    </div>

                    <hr></hr>
                  </Col>
                </Row>

                {cameraName != '' && Screen != 1 ?
                  <Row className="justify-content-md-center">
                    <Col xl={8} lg={10} md={10} sm={12} xs={12} >

                      <div className="mx-auto my-3" style={{ backgroundColor: "black", alignItems: 'center', position: 'relative', }}>

                        <div id='outerDiv' style={{ backgroundColor: "black", }}>

                          {
                            db_type == 'local' ?
                              <ReactPlayer
                                id={`video0`}
                                url={camera_details.stream_id}
                                muted
                                playing
                                controls={false}
                                width="100%"
                                height="100%"
                                style={{
                                  lineHeight: 0, display: 'block', cursor: 'pointer', objectFit: 'cover'
                                }}
                                onPlay={() => {
                                  let tech = document.getElementById(`tech`)
                                  tech.style.display = 'none'

                                  let live = document.getElementById(`live`)
                                  live.style.display = 'block'

                                  let load = document.getElementById(`load`)
                                  load.style.display = 'none'

                                  let buff = document.getElementById(`buff`)
                                  buff.style.display = 'none'
                                }}

                                onWaiting={() => {
                                  let tech = document.getElementById(`tech`)
                                  tech.style.display = 'none'

                                  let live = document.getElementById(`live`)
                                  live.style.display = 'none'

                                  let load = document.getElementById(`load`)
                                  load.style.display = 'none'

                                  let buff = document.getElementById(`buff`)
                                  buff.style.display = 'block'
                                }}

                                onPlaying={() => {
                                  let tech = document.getElementById(`tech`)
                                  tech.style.display = 'none'

                                  let live = document.getElementById(`live`)
                                  live.style.display = 'block'

                                  let load = document.getElementById(`load`)
                                  load.style.display = 'none'

                                  let buff = document.getElementById(`buff`)
                                  buff.style.display = 'none'
                                }}

                                onPause={() => {
                                  let tech = document.getElementById(`tech`)
                                  tech.style.display = 'block'

                                  let live = document.getElementById(`live`)
                                  live.style.display = 'none'

                                  let load = document.getElementById(`load`)
                                  load.style.display = 'none'

                                  let buff = document.getElementById(`buff`)
                                  buff.style.display = 'none'

                                  // document.getElementById(`p1`).innerText(`"${camera_details.camera_gereral_name}" camera is offline`)
                                  // document.getElementById(`p2`).innerText('Please switch on the camera and try again!')
                                }}

                                onError={() => {
                                  let tech = document.getElementById(`tech`)
                                  tech.style.display = 'block'

                                  let live = document.getElementById(`live`)
                                  live.style.display = 'none'

                                  let load = document.getElementById(`load`)
                                  load.style.display = 'none'

                                  let buff = document.getElementById(`buff`)
                                  buff.style.display = 'none'

                                  // document.getElementById(`p1`).innerText(`"${camera_details.camera_gereral_name}" camera is offline`)
                                  // document.getElementById(`p2`).innerText('Please switch on the camera and try again!')
                                }}
                              />
                              :
                              <video
                                id={`video0`}
                                autoPlay
                                muted
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  lineHeight: 0, display: 'block', objectFit: 'fill'
                                }}
                                onPlay={() => {
                                  let tech = document.getElementById(`tech`)
                                  tech.style.display = 'none'

                                  let live = document.getElementById(`live`)
                                  live.style.display = 'block'

                                  let load = document.getElementById(`load`)
                                  load.style.display = 'none'

                                  let buff = document.getElementById(`buff`)
                                  buff.style.display = 'none'
                                }}

                                onWaiting={() => {
                                  let tech = document.getElementById(`tech`)
                                  tech.style.display = 'none'

                                  let live = document.getElementById(`live`)
                                  live.style.display = 'none'

                                  let load = document.getElementById(`load`)
                                  load.style.display = 'none'

                                  let buff = document.getElementById(`buff`)
                                  buff.style.display = 'block'
                                }}

                                onPlaying={() => {
                                  let tech = document.getElementById(`tech`)
                                  tech.style.display = 'none'

                                  let live = document.getElementById(`live`)
                                  live.style.display = 'block'

                                  let load = document.getElementById(`load`)
                                  load.style.display = 'none'

                                  let buff = document.getElementById(`buff`)
                                  buff.style.display = 'none'
                                }}

                                onPause={() => {
                                  let tech = document.getElementById(`tech`)
                                  tech.style.display = 'block'

                                  let live = document.getElementById(`live`)
                                  live.style.display = 'none'

                                  let load = document.getElementById(`load`)
                                  load.style.display = 'none'

                                  let buff = document.getElementById(`buff`)
                                  buff.style.display = 'none'

                                  // document.getElementById(`p1`).innerText(`"${camera_details.camera_gereral_name}" camera is offline`)
                                  // document.getElementById(`p2`).innerText('Please switch on the camera and try again!')
                                }}

                                onError={() => {
                                  let tech = document.getElementById(`tech`)
                                  tech.style.display = 'block'

                                  let live = document.getElementById(`live`)
                                  live.style.display = 'none'

                                  let load = document.getElementById(`load`)
                                  load.style.display = 'none'

                                  let buff = document.getElementById(`buff`)
                                  buff.style.display = 'none'

                                  // document.getElementById(`p1`).innerText(`"${camera_details.camera_gereral_name}" camera is offline`)
                                  // document.getElementById(`p2`).innerText('Please switch on the camera and try again!')
                                }}
                              ></video>
                          }
                        </div>

                        <div id={`tech`} style={{ display: 'none' }}>
                          <div style={{ position: 'absolute', bottom: 0, top: 0, left: 0, right: 0, width: '100%', height: '100%', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                            <img id='orginal_image' crossorigin="anonymous" style={{ filter: 'blur(1px)' }} width='100%' height="100%" src={`${imguri}`} onError={() => {
                              document.getElementById('errorimage').style.display = 'block'
                            }} onLoad={() => {
                              document.getElementById('errorimage').style.display = 'none'
                            }}></img>

                            <img id='errorimage' crossorigin="anonymous" style={{ filter: 'blur(1px)', display: 'block' }} width='100%' height="100%" src={'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png'}></img>

                            <div style={{ position: 'absolute', bottom: 0, top: 0, left: 0, right: 0, width: '100%', height: '100%', backgroundColor: 'black', opacity: '0.5' }}></div>

                            <div style={{ position: 'absolute', bottom: 0, top: 0, left: 0, right: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '5px' }}>
                              <div style={{ backgroundColor: 'red', borderRadius: '50%', padding: '5px' }}>
                                <VideocamOffOutlinedIcon style={{ color: 'white' }} />
                              </div>
                              <p id={`p1`} style={{ color: 'white', margin: '0px', fontWeight: 'bolder' }}>"{camera_details.camera_gereral_name}" camera is offline</p>
                              <p id={`p2`} style={{ color: 'white', margin: '0px', fontSize: '10px' }}>Please switch on the camera and try again!</p>
                              <button style={{ backgroundColor: 'transparent', border: retry_count == 0 ? '1px solid red' : '1px solid grey', borderRadius: '15px', color: retry_count == 0 ? 'white' : 'grey' }} onClick={() => {
                                if (retry_count == 0) {
                                  replay_interval = setInterval(() => {
                                    if (retry_count == 10) {
                                      clearInterval(replay_interval)
                                      retry_count = 0
                                      setretry_count1(0)
                                    } else {
                                      console.log(retry_count);
                                      retry_count = retry_count + 1
                                      setretry_count1(retry_count + 1)
                                    }
                                  }, 1000);
                                  setflag(!flag1)
                                }
                              }}>Retry {retry_count != 0 ? `(${retry_count})` : <RestartAltIcon />}</button>
                            </div>
                          </div>
                        </div>

                        <div id='live' style={{ display: 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#00ff00' }}></div>
                              <p style={{ color: 'white', fontWeight: 'bolder', marginLeft: '10px', marginBottom: 0, fontSize: '18px' }}>Live</p>
                            </div>
                            <FullscreenOutlinedIcon size={'15px'} style={{ color: 'white', cursor: 'pointer' }} onClick={() => {
                              let elem = document.getElementById("video0")
                              if (elem.requestFullscreen) {
                                elem.requestFullscreen();
                              } else if (elem.webkitRequestFullscreen) { /* Safari */
                                elem.webkitRequestFullscreen();
                              } else if (elem.msRequestFullscreen) { /* IE11 */
                                elem.msRequestFullscreen();
                              }
                            }} />
                          </div>
                        </div>

                        <div id={`load`} style={{ display: 'block', }}>
                          <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
                            <CircularProgress size={'15px'} style={{ color: 'white' }} />
                            <p style={{ color: 'white', fontWeight: 'bolder', marginLeft: '10px', marginBottom: 0, fontSize: '18px' }}>Loading</p>
                          </div>
                        </div>

                        <div id={`buff`} style={{ display: 'none', }}>
                          <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
                            <CircularProgress size={'15px'} style={{ color: 'white' }} />
                            <p style={{ color: 'white', fontWeight: 'bolder', marginLeft: '10px', marginBottom: 0, fontSize: '18px' }}>Buffering</p>
                          </div>
                        </div>

                        {videoFlag === 0 ?
                          <div style={{ position: 'absolute', bottom: 0, top: 0, left: 0, right: 0, width: '100%', height: '100%', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <VideocamOffOutlinedIcon style={{ color: 'gray' }} />
                            <p style={{ color: 'white' }}>No internet</p>
                          </div> : ''}

                      </div>



                    </Col>
                  </Row> : ''}
              </div>

              <Row style={{ padding: '10px' }}>
                <div style={{ display: page === 1 ? 'none' : 'block', width: '99.6%' }}>
                  <Row style={{ padding: '10px', backgroundColor: '#e6e8eb' }}>
                    <Col xl={2} lg={2} md={2} sm={3} xs={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
                      <button id='btn1' style={{ border: 'none', borderBottom: '1px solid #e32747', backgroundColor: '#e6e8eb', paddingBottom: '20px', color: '#e32747', borderColor: '#e32747', width: '100%' }} onClick={() => {
                        let btn1 = document.getElementById('btn1')
                        btn1.style.color = '#e32747'
                        btn1.style.borderBottomColor = '#e32747'

                        let btn2 = document.getElementById('btn2')
                        btn2.style.color = 'gray'
                        btn2.style.borderBottomColor = 'gray'

                        let btn3 = document.getElementById('btn3')
                        btn3.style.color = 'gray'
                        btn3.style.borderBottomColor = 'gray'

                        let btn4 = document.getElementById('btn4')
                        btn4.style.color = 'gray'
                        btn4.style.borderBottomColor = 'gray'

                        let btn5 = document.getElementById('btn5')
                        btn5.style.color = 'gray'
                        btn5.style.borderBottomColor = 'gray'

                        setbtn('events')
                      }}>Events</button>
                    </Col>

                    <Col xl={2} lg={2} md={2} sm={3} xs={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
                      <button id='btn2' style={{ border: 'none', borderBottom: '1px solid black', backgroundColor: '#e6e8eb', paddingBottom: '20px', color: 'gray', borderColor: 'gray', width: '100%' }} onClick={() => {
                        let btn1 = document.getElementById('btn1')
                        btn1.style.color = 'gray'
                        btn1.style.borderBottomColor = 'gray'

                        let btn2 = document.getElementById('btn2')
                        btn2.style.color = '#e32747'
                        btn2.style.borderBottomColor = '#e32747'

                        let btn3 = document.getElementById('btn3')
                        btn3.style.color = 'gray'
                        btn3.style.borderBottomColor = 'gray'

                        let btn4 = document.getElementById('btn4')
                        btn4.style.color = 'gray'
                        btn4.style.borderBottomColor = 'gray'

                        let btn5 = document.getElementById('btn5')
                        btn5.style.color = 'gray'
                        btn5.style.borderBottomColor = 'gray'

                        setbtn('tags')
                      }}

                      >Tags</button>
                    </Col>




                    <Col xl={2} lg={2} md={2} sm={3} xs={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
                      <button id='btn3' style={{ border: 'none', borderBottom: '1px solid black', backgroundColor: '#e6e8eb', paddingBottom: '20px', color: 'gray', borderColor: 'gray', width: '100%' }} onClick={() => {
                        let btn1 = document.getElementById('btn1')
                        btn1.style.color = 'gray'
                        btn1.style.borderBottomColor = 'gray'

                        let btn2 = document.getElementById('btn2')
                        btn2.style.color = 'gray'
                        btn2.style.borderBottomColor = 'gray'

                        let btn3 = document.getElementById('btn3')
                        btn3.style.color = '#e32747'
                        btn3.style.borderBottomColor = '#e32747'

                        let btn4 = document.getElementById('btn4')
                        btn4.style.color = 'gray'
                        btn4.style.borderBottomColor = 'gray'

                        let btn5 = document.getElementById('btn5')
                        btn5.style.color = 'gray'
                        btn5.style.borderBottomColor = 'gray'

                        setbtn('ptz')
                      }}
                      >PTZ</button>
                    </Col>

                    <Col xl={2} lg={2} md={2} sm={3} xs={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
                      <button id='btn4' style={{ border: 'none', borderBottom: '1px solid black', backgroundColor: '#e6e8eb', paddingBottom: '20px', color: 'gray', borderColor: 'gray', width: '100%' }} onClick={() => {
                        let btn1 = document.getElementById('btn1')
                        btn1.style.color = 'gray'
                        btn1.style.borderBottomColor = 'gray'

                        let btn2 = document.getElementById('btn2')
                        btn2.style.color = 'gray'
                        btn2.style.borderBottomColor = 'gray'

                        let btn3 = document.getElementById('btn3')
                        btn3.style.color = 'gray'
                        btn3.style.borderBottomColor = 'gray'

                        let btn4 = document.getElementById('btn4')
                        btn4.style.color = '#e32747'
                        btn4.style.borderBottomColor = '#e32747'
                        let btn5 = document.getElementById('btn5')
                        btn5.style.color = 'gray'
                        btn5.style.borderBottomColor = 'gray'

                        setbtn('settings')
                      }}
                      >Settings</button>
                    </Col>

                    <Col xl={2} lg={2} md={2} sm={3} xs={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
                      <button id='btn5' style={{ border: 'none', borderBottom: '1px solid black', backgroundColor: '#e6e8eb', paddingBottom: '20px', color: 'gray', borderColor: 'gray', width: '100%' }} onClick={() => {
                        let btn1 = document.getElementById('btn1')
                        btn1.style.color = 'gray'
                        btn1.style.borderBottomColor = 'gray'

                        let btn2 = document.getElementById('btn2')
                        btn2.style.color = 'gray'
                        btn2.style.borderBottomColor = 'gray'

                        let btn3 = document.getElementById('btn3')
                        btn3.style.color = 'gray'
                        btn3.style.borderBottomColor = 'gray'

                        let btn4 = document.getElementById('btn4')
                        btn4.style.color = 'gray'
                        btn4.style.borderBottomColor = '#gray'
                        let btn5 = document.getElementById('btn5')
                        btn5.style.color = '#e32747'
                        btn5.style.borderBottomColor = '#e32747'

                        setbtn('group')
                      }}
                      >Group</button>
                    </Col>


                  </Row>
                </div>

                {
                  btn === 'events' ?
                    <Events data1={data} res={res} aditional_info={false} camera_name={cameraName} type={'motion_events'} alarm_status={() => { }} all_alert_count={{ active_alert: 0, inactive_alert: 0 }} res1={res1} analytics1={analytics} res_next_data={res_next_data} call_next_data={call_next_data} list_type={'inside'} />

                    :
                    btn === 'tags' ?
                      <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                        <div style={{ marginLeft: '10px', marginTop: '40px', marginBottom: '40px' }}>
                          <div style={{ display: 'flex' }}>
                            {selectedTag.map((tag, index) => (
                              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #0d0e90', alignItems: 'center', padding: '10px', borderRadius: '15px', marginRight: '10px' }}>
                                <p key={index} style={{ margin: 0, marginRight: '20px' }}>{tag.name}</p>
                                <CloseIcon style={{ cursor: "pointer" }} onClick={() => { handleTagRemove(tag.id, tag.name); }} />
                              </div>
                            ))}
                          </div>

                          <div style={{ marginTop: '20px', display: 'inline-block', borderRadius: '5px', padding: '10px', overflowY: 'auto' }}>
                            <Button style={{ backgroundColor: "#FF0000", border: '1px solid #FF0000', width: "27vh" }} onClick={() => { setshowflag(!showflag) }}>+Add Tag</Button>
                            <div style={{ backgroundColor: '#E6E8EB' }}>
                              {showflag ?
                                showdata.map((val, index) => (
                                  <div key={index} style={{
                                    backgroundColor: '#E6E8EB',
                                    cursor: 'pointer',
                                    width: "26.5vh",
                                    fontSize: "20px",
                                  }} onClick={() => handleTagClick(val._id, val.tag_name)}>

                                    {!selectedTag.some(tag => tag.id === val._id) && (
                                      <p style={{ fontSize: '20px', margin: 0, marginBottom: '10px', marginLeft: "10px" }}>
                                        {val.tag_name}
                                      </p>
                                    )}
                                  </div>
                                ))
                                : null}
                            </div>
                          </div>
                        </div>
                      </Col>



                      : btn === 'ptz' ?
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                          <div style={{ width: '100%', marginLeft: '10px', marginTop: '40px' }}>
                            <p style={{ color: 'black', }}><span style={{ color: 'black', fontWeight: 'bolder' }}>BETA: </span>Camera moves when command pressed, but there is 5-10s lag before live stream is updated. Lag is shorter via mobile app and will be reduced to 1-2s on web.</p>

                            <div>

                              <Row>
                                <Col xl={5} lg={5} md={5} sm={2} xs={2}>
                                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', width: '100%', height: '100%' }}>
                                    <AddIcon style={{ border: '2px solid black', fontSize: '50px' }} />
                                    <RemoveIcon style={{ border: '2px solid black', fontSize: '50px' }} />
                                  </div>
                                </Col>

                                <Col xl={3} lg={3} md={3} sm={10} xs={10}>
                                  <div>

                                    <Row>
                                      <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                          <ArrowCircleLeftIcon style={{ transform: 'rotate(90deg)', fontSize: '80px', }} />
                                        </div>
                                      </Col>

                                      <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <ArrowCircleLeftIcon style={{ fontSize: '80px' }} />
                                          <ArrowCircleRightIcon style={{ fontSize: '80px' }} />
                                        </div>
                                      </Col>

                                      <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                                          <ArrowCircleRightIcon style={{ transform: 'rotate(90deg)', fontSize: '80px' }} />
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>



                            </div>
                          </div>
                        </Col>

                        : btn === 'group' ?
                          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <div style={{ marginLeft: '10px', marginTop: '40px', marginBottom: '40px' }}>
                              <div style={{ display: 'flex' }}>
                                {selectedTag1.map((tag, index) => (
                                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #0d0e90', alignItems: 'center', padding: '10px', borderRadius: '15px', marginRight: '10px' }}>
                                    <p key={index} style={{ margin: 0, marginRight: '20px' }}>{tag.name}</p>
                                    <CloseIcon style={{ cursor: "pointer" }} onClick={() => { handleTagRemove2(tag.id, tag.name); console.log(tag); }} />
                                  </div>
                                ))}
                              </div>

                              <div style={{ marginTop: '20px', display: 'inline-block', borderRadius: '5px', padding: '10px', overflowY: 'auto' }}>
                                <Button style={{ backgroundColor: "#FF0000", border: '1px solid #FF0000', width: "27vh" }}

                                  onClick={() => {
                                    setshowflag2(!showflag2);
                                    console.log(showdata1);
                                  }}

                                >+Add Tag</Button>
                                <div style={{ backgroundColor: '#E6E8EB' }}>
                                  {showflag2 ?
                                    showdata1.map((val, index) => (
                                      <div key={index} style={{
                                        backgroundColor: '#E6E8EB',
                                        cursor: 'pointer',
                                        width: "26.5vh",
                                        fontSize: "20px",
                                      }} onClick={() => { handleTagClick2(val._id, val.group_name); console.log(val, 'aaa'); }}>

                                        {!selectedTag1.some(tag => tag.id === val._id) && (
                                          <p style={{ fontSize: '20px', margin: 0, marginBottom: '10px', marginLeft: "10px" }}>
                                            {val.group_name}
                                          </p>
                                        )}
                                      </div>
                                    ))
                                    : null}
                                </div>
                              </div>
                            </div>
                          </Col>

                          : btn === 'settings' ?
                            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                              <div style={{ border: '', display: 'inline-block', borderRadius: '5px', padding: '5px', width: '100%' }} >
                                <div>

                                  <h4 style={{ fontWeight: 'bolder' }} >Select Your Plan</h4>
                                  <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'centre', width: '100%', overflowX: 'scroll' }} >
                                    {
                                      subscriptionPlanData.sub?.map((plans, planIndex) => (
                                        <div key={planIndex} onClick={() => {
                                          setUserSelectedPlan(plans)
                                          setIsPlanSelected(true)

                                        }
                                        }  >

                                          <div style={{
                                            border: userSelectedPlan && plans.sub?._id === userSelectedPlan.sub?._id ? '4px solid black' : '1px solid black',
                                            display: 'inline-block', borderRadius: '5px', padding: '5px',
                                            backgroundColor: userSelectedPlan && plans.sub?._id === userSelectedPlan.sub?._id ? 'lightgray' : 'white',
                                            width: '23rem',
                                            marginRight: '10px'
                                          }}

                                            key={planIndex} >
                                            <div>
                                              <p style={{ margin: 0 }}>Your plan</p>
                                              <div  >
                                                <div style={{ border: '1px solid grey', borderRadius: '5px', display: 'inline-block', color: 'black', backgroundColor: 'white', marginRight: '10px' }}>
                                                  <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
                                                    <p style={{ padding: '5px', margin: 0, }}>2 mp cameras</p>
                                                  </div>
                                                  <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                                                    <div style={{ marginRight: '10px' }}>
                                                      <p style={{ margin: 0 }}>Motion triggered</p>
                                                      <p style={{ margin: 0 }}>24/Continuous</p>
                                                    </div>
                                                    <div>
                                                      <p style={{ margin: 0 }}> {plans.sub._2mp.motion.motion - plans.cameras_options._2mp.motion} / {plans.sub._2mp.motion.motion}</p>
                                                      <p style={{ margin: 0 }}> {plans.sub._2mp.continues.continues - plans.cameras_options._2mp.continues} / {plans.sub._2mp.continues.continues}</p>
                                                    </div>
                                                  </div>
                                                </div>

                                                <div style={{ border: '1px solid grey', borderRadius: '5px', display: 'inline-block', color: 'black', backgroundColor: 'white' }}>
                                                  <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
                                                    <p style={{ padding: '5px', margin: 0, }}>4 mp cameras</p>
                                                  </div>
                                                  <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                                                    <div style={{ marginRight: '10px' }}>
                                                      <p style={{ margin: 0 }}>Motion triggered</p>
                                                      <p style={{ margin: 0 }}>24/Continuous</p>
                                                    </div>
                                                    <div>
                                                      <p style={{ margin: 0 }}> {plans.sub._4mp.motion.motion - plans.cameras_options._4mp.motion} / {plans.sub._4mp.motion.motion}</p>
                                                      <p style={{ margin: 0 }}> {plans.sub._4mp.continues.continues - plans.cameras_options._4mp.continues} / {plans.sub._4mp.continues.continues}</p>
                                                    </div>
                                                  </div>
                                                </div>

                                                <div style={{ border: '1px solid grey', borderRadius: '5px', display: 'inline-block', color: 'black', backgroundColor: 'white', marginRight: '10px', marginTop: '5px' }}>
                                                  <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
                                                    <p style={{ padding: '5px', margin: 0, }}>8 mp cameras</p>
                                                  </div>
                                                  <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                                                    <div style={{ marginRight: '10px' }}>
                                                      <p style={{ margin: 0 }}>Motion triggered</p>
                                                      <p style={{ margin: 0 }}>24/Continuous</p>
                                                    </div>
                                                    <div>
                                                      <p style={{ margin: 0 }}> {plans.sub._8mp.motion.motion - plans.cameras_options._8mp.motion} / {plans.sub._8mp.motion.motion}</p>
                                                      <p style={{ margin: 0 }}> {plans.sub._8mp.continues.continues - plans.cameras_options._8mp.continues} / {plans.sub._8mp.continues.continues}</p>
                                                    </div>
                                                  </div>
                                                </div>

                                                <div style={{ border: '1px solid grey', borderRadius: '5px', display: 'inline-block', color: 'black', backgroundColor: 'white', width: '170px', marginTop: '5px' }}>
                                                  <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
                                                    <p style={{ padding: '5px', margin: 0, }}>Storage</p>
                                                  </div>
                                                  <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                                                    <div style={{ marginRight: '10px' }}>
                                                      <p style={{ margin: 0 }}>Cloud</p>
                                                      <p style={{ margin: 0 }}>Local</p>
                                                    </div>
                                                    <div>
                                                      <p style={{ margin: 0 }}> {plans.sub.options.cloud} Days</p>
                                                      <p style={{ margin: 0 }}> {plans.sub.options.local} Days</p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>

                                              <div style={{ border: '1px solid grey', borderRadius: '5px', color: 'black', backgroundColor: 'white', marginTop: '5px' }}>
                                                <div style={{ backgroundColor: '#e6e8eb', color: 'darkblue', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
                                                  <p style={{ padding: '5px', margin: 0, }}>Other Subscription</p>
                                                </div>
                                                <div style={{ display: 'flex', padding: '5px' }}>
                                                  <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                                                    <div style={{ marginRight: '10px' }}>
                                                      <p style={{ margin: 0 }}>Alert</p>
                                                      <p style={{ margin: 0 }}>Analytic</p>
                                                      <p style={{ margin: 0 }}>Live Stream</p>
                                                    </div>
                                                    <div>
                                                      <p style={{ margin: 0 }}>{plans.sub.options.alert - plans.cameras_options.alert} / {plans.sub.options.alert}</p>
                                                      <p style={{ margin: 0 }}>{plans.sub.options.analytics - plans.cameras_options.analytics} / {plans.sub.options.analytics}</p>
                                                      <p style={{ margin: 0 }}>{plans.cameras_options.live_stream == undefined ? 0 : plans.sub.options.live_stream - plans.cameras_options.live_stream} / {plans.sub.options.live_stream == undefined ? 0 : plans.sub.options.live_stream}</p>
                                                    </div>
                                                  </div>
                                                  {/* <div style={{ display: 'flex', alignItems: 'center', width: '35%' }}>
                                                    <div style={{ marginRight: '10px' }}>
                                                    <p style={{ margin: 0 }}>People Analytics</p>
                                                      <p style={{ margin: 0 }}>Vehicle Analytics</p>
                                                    </div>
                                                    <div>
                                                    <p style={{ margin: 0 }}>{plans.sub.options.people_analytics - plans.cameras_options.people_analytics} / {plans.cameras_options.people_analytics}</p>
                                                      <p style={{ margin: 0 }}>{plans.sub.options.vehicle_analytics - plans.cameras_options.vehicle_analytics} / {plans.cameras_options.vehicle_analytics}</p>
                              
                                                    </div>
                                                  </div> */}

                                                  <div style={{ display: 'flex', width: '50%' }}>
                                                    <div style={{ marginRight: '10px' }}>
                                                      <p style={{ margin: 0 }}>People Analytics</p>
                                                      <p style={{ margin: 0 }}>Vehicle Analytics</p>
                                                      <p style={{ margin: 0 }}>Face Dedaction</p>
                                                      {/* <p style={{ margin: 0 }}>Cloud</p> */}
                                                    </div>
                                                    <div>
                                                      <p style={{ margin: 0 }}>{plans.sub.options.people_analytics - plans.cameras_options.people_analytics} / {plans.sub.options.people_analytics}</p>
                                                      <p style={{ margin: 0 }}>{plans.sub.options.vehicle_analytics - plans.cameras_options.vehicle_analytics} / {plans.sub.options.vehicle_analytics}</p>
                                                      <p style={{ margin: 0 }}>{plans.cameras_options.face_dedaction == undefined ? 0 : plans.sub.options.face_dedaction - plans.cameras_options.face_dedaction} / {plans.sub.options.face_dedaction == undefined ? 0 : plans.sub.options.face_dedaction}</p>
                                                      {/* <p style={{ margin: 0 }}>{plans.sub.options.cloud - plans.cameras_options.cloud} / {plans.sub.options.cloud}</p> */}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>










                                          {/* <h4>Alert - {plans.cameras_options.alert}</h4>
                                            <h4>Analytics - {plans.cameras_options.analytics}</h4>
                                            <h4>Cloud - {plans.cameras_options.cloud}</h4>
                                            <h4>Face Detection - {plans.cameras_options.face_dedaction}</h4>
                                            <h4>Local - {plans.cameras_options.local}</h4> */}
                                        </div>
                                      ))
                                    }


                                  </div>




                                  <Row style={{ marginTop: '30px', width: '100%' }}>
                                    <Col xl={2} lg={2} md={2} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                      <p style={{ color: 'black', fontWeight: 'bolder', margin: 0 }}>Name</p>
                                    </Col>
                                    <Col xl={3} lg={3} md={3} sm={7} xs={7}>
                                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <input
                                          type="text"
                                          name="camera_gereral_name"
                                          style={{ padding: '10px', borderRadius: '5px', width: '100%' }}
                                          value={planSettingsDetails.camera_gereral_name}
                                          onChange={handleChangePlanDetails}
                                        />
                                        {camera_details.camera_gereral_name !== username && (
                                          <p style={{ marginTop: "15px", marginLeft: "40px", cursor: "pointer" }} onClick={() => {
                                            update()
                                          }}>Update</p>

                                        )}
                                      </div>

                                    </Col>
                                  </Row>

                                  {/* <Row style={{ marginTop: '30px' }}>
                                    <Col xl={2} lg={2} md={2} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                      <p style={{ color: 'black', fontWeight: 'bolder', margin: 0 }}>Cloud recording</p>
                                    </Col>
                                    <Col xl={10} lg={10} md={10} sm={7} xs={7}>
                                      <div>

                                        <div style={{ backgroundColor: planSettingsDetails.cloud_recording == 1 ? '#e32747' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: planSettingsDetails.cloud_recording == 1 ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }}

                                          onClick={() => handleChangePlanDetails({ target: { name: 'cloud_recording', value: planSettingsDetails.cloud_recording === 1 ? 0 : 1 } })}

                                        >
                                          <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                        </div>
                                      </div>
                                    </Col>
                                  </Row> */}

                                  <Row style={{ marginTop: '30px' }}>
                                    <Col xl={2} lg={2} md={2} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                      <p style={{ color: 'black', fontWeight: 'bolder', margin: 0 }}>Recording mode</p>
                                    </Col>
                                    <Col xl={3} lg={3} md={3} sm={7} xs={7}>
                                      <select
                                        style={{ padding: '10px', borderRadius: '5px', width: '100%' }}
                                        value={planSettingsDetails.recording_mode}
                                        name="recording_mode"
                                        onChange={(e) => {
                                          const { name, value } = e.target
                                          if (value == 0) {
                                            handleChangePlanDetails({ target: { name: 'motion', value: 1 } })
                                          } else if (value == 1) {
                                            handleChangePlanDetails({ target: { name: 'live', value: 1 } })
                                          } else if (value == 3) {
                                            handleChangePlanDetails({ target: { name: 'live', value: 0 } })
                                            handleChangePlanDetails({ target: { name: 'motion', value: 0 } })
                                          }
                                        }}
                                      >
                                        <option value='select' >Select recording mode</option>
                                        <option value={3}>None</option>
                                        <option value={0}>Motion triggered</option>
                                        <option value={1}>24/7 Continuous</option>
                                      </select>
                                    </Col>
                                  </Row>

                                  <Row style={{ marginTop: '30px' }}>
                                    <Col xl={2} lg={2} md={2} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                      <p style={{ color: 'black', fontWeight: 'bolder', margin: 0 }}>Recording video quality</p>
                                    </Col>
                                    <Col xl={3} lg={3} md={3} sm={7} xs={7}>
                                      <input style={{ padding: '10px', borderRadius: '5px', width: '100%' }}
                                        value={planSettingsDetails.camera_mp}
                                      />
                                    </Col>
                                  </Row>

                                  <Row style={{ marginTop: '30px' }}>
                                    <Col xl={2} lg={2} md={2} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                      <p style={{ color: 'black', fontWeight: 'bolder', margin: 0 }}>Live Stream</p>
                                    </Col>
                                    <Col xl={10} lg={10} md={10} sm={7} xs={7}>
                                      <div>

                                        <div style={{ backgroundColor: planSettingsDetails.live_stream == 1 ? '#e32747' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: planSettingsDetails.live_stream == 1 ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }}

                                          onClick={() => handleChangePlanDetails({ target: { name: 'live_stream', value: planSettingsDetails.live_stream === 1 ? 0 : 1 } })}

                                        >
                                          <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>

                                  <Row style={{ marginTop: '30px' }}>
                                    <Col xl={2} lg={2} md={2} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                      <p style={{ color: 'black', fontWeight: 'bolder', margin: 0 }}>Alerts</p>
                                    </Col>
                                    <Col xl={10} lg={10} md={10} sm={7} xs={7}>
                                      <div>

                                        <div style={{ backgroundColor: planSettingsDetails.alert == 1 ? '#e32747' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: planSettingsDetails.alert == 1 ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }}

                                          onClick={() => handleChangePlanDetails({ target: { name: 'alert', value: planSettingsDetails.alert === 1 ? 0 : 1 } })}

                                        >
                                          <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row style={{ marginTop: '30px' }}>
                                    <Col xl={2} lg={2} md={2} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                      <p style={{ color: 'black', fontWeight: 'bolder', margin: 0 }}>Analytics</p>
                                    </Col>
                                    <Col xl={10} lg={10} md={10} sm={7} xs={7}>
                                      <div>

                                        <div style={{ backgroundColor: planSettingsDetails.analytics == 1 ? '#e32747' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: planSettingsDetails.analytics == 1 ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }}

                                          onClick={() => handleChangePlanDetails({ target: { name: 'analytics', value: planSettingsDetails.analytics === 1 ? 0 : 1 } })}

                                        >
                                          <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row style={{ marginTop: '30px' }}>
                                    <Col xl={2} lg={2} md={2} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                      <p style={{ color: 'black', fontWeight: 'bolder', margin: 0 }}>Vehicle Analytics</p>
                                    </Col>
                                    <Col xl={10} lg={10} md={10} sm={7} xs={7}>
                                      <div>

                                        <div style={{ backgroundColor: planSettingsDetails.vehicle_analytics == 1 ? '#e32747' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: planSettingsDetails.vehicle_analytics == 1 ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }}

                                          onClick={() => handleChangePlanDetails({ target: { name: 'vehicle_analytics', value: planSettingsDetails.vehicle_analytics === 1 ? 0 : 1 } })}

                                        >
                                          <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>


                                  <Row style={{ marginTop: '30px' }}>
                                    <Col xl={2} lg={2} md={2} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                      <p style={{ color: 'black', fontWeight: 'bolder', margin: 0 }}>People Analytics</p>
                                    </Col>
                                    <Col xl={10} lg={10} md={10} sm={7} xs={7}>
                                      <div>

                                        <div style={{ backgroundColor: planSettingsDetails.people_analytics == 1 ? '#e32747' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: planSettingsDetails.people_analytics == 1 ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }}

                                          onClick={() => handleChangePlanDetails({ target: { name: 'people_analytics', value: planSettingsDetails.people_analytics === 1 ? 0 : 1 } })}

                                        >
                                          <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>


                                  {/* <Row style={{ marginTop: '30px' }}>
                                    <Col xl={2} lg={2} md={2} sm={5} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                      <p style={{ color: 'black', fontWeight: 'bolder', margin: 0 }}>Alert</p>
                                    </Col>
                                    <Col xl={10} lg={10} md={10} sm={7} xs={7}>
                                      <div>

                                        <div style={{ backgroundColor: planSettingsDetails.alert == 1 ? '#e32747' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: planSettingsDetails.alert == 1 ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }}

                                          onClick={() => handleChangePlanDetails({ target: { name: 'alert', value: planSettingsDetails.alert === 1 ? 0 : 1 } })}
                                        >
                                          <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                                        </div>
                                      </div>
                                    </Col>
                                  </Row> */}

                                  <Row style={{ marginTop: '30px' }}>
                                    <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                      <button style={{ border: 'none', borderRadius: '15px', backgroundColor: '#e32747', color: 'white', padding: '10px', marginTop: '10px', marginBottom: '30px', marginRight: '20px' }}
                                        onClick={handleCLickChangePlanDetails}
                                      >Save</button>
                                      <button style={{ border: 'none', borderRadius: '15px', backgroundColor: '#e32747', color: 'white', padding: '10px', marginTop: '10px', marginBottom: '30px' }}
                                        onClick={() => {
                                          const options = {
                                            url: api.CAMERA_CREATION + camera_details._id,
                                            method: 'DELETE',
                                            headers: {
                                              'Content-Type': 'application/json',
                                            },

                                          };

                                          axios(options)
                                            .then(response => {
                                              console.log(response.data)
                                              window.history.replaceState(null, null, "/Home/Home/")
                                              window.location.reload();

                                            })
                                            .catch(function (e) {
                                              if (e.message === 'Network Error') {
                                                alert("No Internet Found. Please check your internet connection")
                                              }
                                              else {

                                                alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                                              }


                                            });
                                        }}>Delete camera</button>
                                    </Col>
                                  </Row>

                                </div>
                              </div>
                            </Col>

                            : ''}
              </Row>



              <Row >

                {
                  btn === 'events' ? ''

                    // <Events datetime={{ startdate, enddate, starttime, endtime }} />


                    // data.map((data, j) => {
                    //   return (
                    //     <>
                    //       <Col xl={12} lg={12} md={12} sm={12} xs={12} >
                    //         <h2 style={{ color: 'grey', fontFamily: 'Poppins-SemiBold', fontSize: 20 }}>{moment(data[j].date).format('dddd, MMMM D YYYY')}</h2>
                    //       </Col>


                    //       <>

                    //         {

                    //           data.map((data, i) => {

                    //             return (

                    //               <>



                    //                 <Col xl={3} lg={6} md={6} sm={12} xs={12}  >



                    //                   <div className="mx-auto my-3" style={{ backgroundColor: 'black', position: 'relative', width: '100%', height: '200px' }} onClick={() => {
                    //                     //    window.history.replaceState(null, null, "/Home/Home/"+data)
                    //                     //    window.location.reload();
                    //                     setsmallVideo(data)

                    //                     const moment = require('moment')
                    //                     let now = moment(data.date)
                    //                     setdate(now.format('dddd, MMMM D YYYY'))
                    //                     handleOpen()

                    //                   }}>

                    //                     <img id={`img${j}${i}`} src={data.uri} width={'100%'} height={'100%'} onError={() => {
                    //                       let tech = document.getElementById(`tech${j}${i}`)
                    //                       tech.style.display = 'block'
                    //                     }} onLoad={() => {
                    //                       let loadimg = document.getElementById(`loadimg${j}${i}`)
                    //                       loadimg.style.display = 'none'
                    //                     }}></img>


                    //                     <div id={`loadimg${j}${i}`} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: '100%px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    //                       <CircularProgress size={'30px'} style={{ color: 'white' }} />
                    //                     </div>

                    //                     <div id={`tech${j}${i}`} style={{ display: 'none' }}>
                    //                       <div style={{ position: 'absolute', bottom: 0, top: 0, left: 0, right: 0, width: '100%', height: '100%', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    //                         <HideImageOutlinedIcon style={{ color: 'gray' }} />
                    //                         <p style={{ color: 'white', margin: '0px' }}>No thumbnail</p>
                    //                         <p style={{ color: 'white', margin: '0px', fontSize: '10px' }}>Try again later!</p>
                    //                       </div>
                    //                     </div>

                    //                     <div style={{ position: 'absolute', backgroundColor: 'rgba(0,0,0,0.7)', top: 5, left: 5, right: 0, bottom: 0, height: '28px', width: '80px', padding: '5px', borderRadius: '5px' }}>
                    //                       <p id={`date${j}${i}`} style={{ color: 'white', fontWeight: 'bolder' }}>{data.time}</p>
                    //                     </div>


                    //                   </div>

                    //                   {videoFlag === 0 ?
                    //                     <div style={{ position: 'absolute', bottom: 0, top: 0, left: 0, right: 0, width: '100%', height: '100%', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    //                       <VideocamOffOutlinedIcon style={{ color: 'gray' }} />
                    //                       <p style={{ color: 'white' }}>No internet</p>
                    //                     </div> : ''}
                    //                 </Col>
                    //               </>
                    //             )
                    //           })
                    //         }
                    //       </>
                    //     </>

                    //   )
                    // }
                    // ) 
                    :
                    ''

                }

                <Col xl={12} lg={12} md={12} sm={12} xs={12} >
                  <div id={`videotech`} style={{ display: 'none' }}>
                    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                      <VideocamOffOutlinedIcon style={{ color: 'gray' }} />
                      <p style={{ color: 'red', margin: '0px' }}>Error!</p>
                      <p style={{ color: 'white', margin: '0px' }}>No video found</p>
                      <p style={{ color: 'white', margin: '0px', fontSize: '10px' }}>Try again later!</p>
                    </div>
                  </div>
                </Col>

              </Row>
            </div>

          </Aux ></div>
      </>
    );
  }
}

export default Dashboard;
