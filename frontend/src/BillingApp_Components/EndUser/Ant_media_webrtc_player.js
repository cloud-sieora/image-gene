import React, { useState, useEffect, useRef } from 'react';
import { db_type } from './db_config'
import { Button, Container, Row, Col } from 'react-bootstrap';
import CircularProgress from '@mui/material/CircularProgress';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import { WebRTCAdaptor } from '@antmedia/webrtc_adaptor';
import { CreateBucketCommand, S3Client, GetObjectCommand, ListBucketsCommand, DeleteBucketCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import tentovision_logo from '../../assets/images/tentovision_logo.jpeg'
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ReactHlsPlayer from 'react-hls-player';
import ReactPlayer from 'react-player'
import { PAGE, STARTDATE, STARTTIME, ENDDATE, ENDTIME, APPLY, SELECT, SELECTED_CAMERAS } from '../../store/actions'
import { useDispatch, useSelector } from 'react-redux';


const PlayingComponent = ({ i, data, initial_webrtc, play_stream_id, returnstrams, cameras_ids_for_stream, function_cameras_ids_for_stream, totalCameraCoverScreen }) => {
  const dispatch = useDispatch()
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [playing_flag, setplaying_flag] = useState(false);
  const [videoFlag, setvideoFlag] = useState(1);
  const [websocketConnected, setWebsocketConnected] = useState(false);
  const [streamId, setStreamId] = useState(data.stream_id);
  const [imguri, setimguri] = useState('');
  const [flag, setflag] = useState(false);
  const [flag1, setflag1] = useState(false);
  const [retry_count1, setretry_count1] = useState(0);
  const [retry_btn, setretry_btn] = useState(false);
  let [replay_interval, setreplay_interval] = useState(false);
  let [retry_count, setretry_count] = useState(0);
  let [hsl_restart_flag, sethsl_restart_flag] = useState(false);
  const [image_onload, setimage_onload] = useState(false);
  const webRTCAdaptor = useRef(null);
  var playingStream = useRef(null);
  let interval = ''

  useEffect(() => {
    if (image_onload) {
      let loadimg = document.getElementById(`loadimge${i}`)
      // // console.log(loadimg.clientHeight);
      let video_tag = document.getElementById(`video${i}`)
      video_tag.style.maxHeight = `${loadimg.clientHeight}px`
      video_tag.style.height = `${loadimg.clientHeight}px`
    }
  }, [image_onload])

  const handlePlay = (streamid) => {
    setPlaying(true);
    play_stream_id(streamId)
    console.log(streamId);
    playingStream.current = streamid
    if (data.publish_mode == 1) {
      webRTCAdaptor.current.play(streamId);
    } else {
      webRTCAdaptor.current.join(streamId);
    }
  };

  const handleStopPlaying = () => {
    setPlaying(false);
    webRTCAdaptor.current.stop(playingStream.current);
  };

  const handleStreamIdChange = (value) => {
    setStreamId(value);
    handlePlay(data.stream_id)
  };

  function interval_fun() {
    replay_interval = setInterval(() => {
      if (retry_count == 10) {
        clearInterval(replay_interval)
        retry_count = 0
        setretry_count1(0)
      } else {
        console.log(retry_count);
        retry_count = retry_count + 1
        setretry_count1(retry_count)
        setflag(!flag)
      }
    }, 1000);
  }

  useEffect(() => {
    console.log('jhgh');

    if (db_type == 'local') {
      getimageuri(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, data)
    } else {
      try {
        webRTCAdaptor.current = new WebRTCAdaptor({
          websocket_url: 'wss://live.tentovision.com:5443/WebRTCAppEE/websocket',
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
          remoteVideoId: `video${i}`,
          callback: (info, obj) => {
            if (info === 'initialized') {
              setWebsocketConnected(true)
              initial_webrtc(webRTCAdaptor, data._id, i, true, 'no error', handlePlay, handleStopPlaying)
              handlePlay(data.stream_id)
            }
          },
          callbackError: function (error, message) {
            initial_webrtc(webRTCAdaptor, data._id, i, false, 'error', handlePlay, handleStopPlaying)
            handelliveerror(error, message)
          },
        });
      } catch (e) {
        console.log(e);
      }
    }



    getimageuri(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, data)

    return () => {
      if (db_type == 'local') {

      } else {
        let val = returnstrams()

        val.map((id) => {
          try {
            webRTCAdaptor.current.stop(id)
          } catch (e) {
            console.log(e);
          }
        })
        webRTCAdaptor.current.callbackError = () => {

        }
      }
    }
  }, [flag]);

  // useEffect(() => {
  //   console.log(playing_flag);
  //   if (playing_flag) {
  //     let div1 = document.getElementById(`div${i}`)
  //     div1.style.display = 'block'

  //     let div2 = document.getElementById(`div1${i}`)
  //     div2.style.display = 'none'

  //     let div3 = document.getElementById(`div2${i}`)
  //     div3.style.display = 'none'

  //     let loadimg = document.getElementById(`loadimg${i}`)
  //     loadimg.style.display = 'none'

  //     let div4 = document.getElementById(`div3${i}`)
  //     div4.style.display = 'block'

  //     // let outerdiv = document.getElementById(`outerDiv${i}`)
  //     // outerdiv.style.height = '85%'

  //     let tech = document.getElementById(`tech${i}`)
  //     tech.style.display = 'none'

  //     getimageuri(process.env.REACT_APP_AWS_ACCESS_KEY, process.env.REACT_APP_AWS_SECRET_KEY, process.env.REACT_APP_AWS_BUCKET_NAME, data)
  //     handleStreamIdChange(data.stream_id)
  //   }
  //   setplaying_flag(true)
  // }, [data])

  function handelliveerror(error, message) {
    console.log(error);
    console.log(message);

    // if (cameras_ids_for_stream[data.stream_id] == 'none') {
    //   // function_cameras_ids_for_stream(setInterval(() => {
    //   //   setflag(!flag)

    //   // }, 10000), data.stream_id)

    //   function_cameras_ids_for_stream(setTimeout(() => {
    //     setflag(!flag)

    //   }, 10000), data.stream_id)
    //   console.log(data.stream_id);
    // }

    // function_cameras_ids_for_stream(setTimeout(() => {
    //   setflag(!flag)

    // }, 10000), data.stream_id)

    if (error === 'no_stream_exist') {
      let div1 = document.getElementById(`div${i}`)
      div1.style.display = 'none'

      let div2 = document.getElementById(`div1${i}`)
      div2.style.display = 'none'

      let div3 = document.getElementById(`div2${i}`)
      div3.style.display = 'none'

      let loadimg = document.getElementById(`loadimg${i}`)
      loadimg.style.display = 'none'

      let div4 = document.getElementById(`div3${i}`)
      div4.style.display = 'none'

      // let outerdiv = document.getElementById(`outerDiv${i}`)
      // outerdiv.style.height = '85%'

      let tech = document.getElementById(`tech${i}`)
      tech.style.display = 'block'

      // let tech2 = document.getElementById(`tech2${i}`)
      // tech2.style.display = 'block'


      // document.getElementById(`p1${i}`).innerText('yggfgf')
      handleStopPlaying();
      setPlaying(false);
    } else if (error === 'WebSocketNotConnected') {
      setvideoFlag(0)
    } else if (error === 'invalidStreamName') {
      let div1 = document.getElementById(`div${i}`)
      div1.style.display = 'none'

      let div2 = document.getElementById(`div1${i}`)
      div2.style.display = 'none'

      let div3 = document.getElementById(`div2${i}`)
      div3.style.display = 'none'

      let loadimg = document.getElementById(`loadimg${i}`)
      loadimg.style.display = 'none'

      let div4 = document.getElementById(`div3${i}`)
      div4.style.display = 'none'

      // let outerdiv = document.getElementById(`outerDiv${i}`)
      // outerdiv.style.height = '85%'

      let tech = document.getElementById(`tech${i}`)
      tech.style.display = 'block'

      // let tech2 = document.getElementById(`tech2${i}`)
      // tech2.style.display = 'block'

      // document.getElementById(`p1${i}`).innerText(`"${data.camera_gereral_name}"`)
      // document.getElementById(`p2${i}`).innerText('Please Check the Stream Name')
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

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <div className='outerDiv' id={`outerDiv${i}`} style={{ backgroundColor: 'black', position: 'relative', height: '100%', width: '100%' }} onClick={() => {
        dispatch({ type: SELECTED_CAMERAS, value: [data] })
        localStorage.setItem('cameraDetails', JSON.stringify(data))
        // history.push("/Home/Home/" + data.camera_gereral_name)
        window.history.replaceState(null, null, "/Home/Home/" + data.camera_gereral_name)
        window.location.reload();

      }} onMouseOver={() => {
        let div = document.getElementById(`div${i}`)
        div.style.display = 'block'
      }} onMouseOut={() => {
        let div = document.getElementById(`div${i}`)
        div.style.display = 'none'
      }}>
        {
          db_type == 'local' ?
            <div>
              <ReactPlayer
                id={`video${i}`}
                url={data.stream_id}
                controls={false}
                muted
                playing
                width="100%"
                height="100%"
                style={{
                  lineHeight: 0, display: 'block', cursor: 'pointer', objectFit: 'cover'
                }}
                onPlay={() => {
                  let div1 = document.getElementById(`div${i}`)
                  div1.style.display = 'none'

                  let div2 = document.getElementById(`div1${i}`)
                  div2.style.display = 'block'

                  let div3 = document.getElementById(`div2${i}`)
                  div3.style.display = 'none'

                  let loadimg = document.getElementById(`loadimg${i}`)
                  loadimg.style.display = 'none'

                  let div4 = document.getElementById(`div3${i}`)
                  div4.style.display = 'none'

                  // let outerdiv = document.getElementById(`outerDiv${i}`)
                  // outerdiv.style.height = 'auto'

                  let tech = document.getElementById(`tech${i}`)
                  tech.style.display = 'none'

                  // let tech2 = document.getElementById(`tech2${i}`)
                  // tech2.style.display = 'none'
                }}

                onWaiting={() => {
                  let div1 = document.getElementById(`div${i}`)
                  div1.style.display = 'block'

                  let div2 = document.getElementById(`div1${i}`)
                  div2.style.display = 'none'

                  let div3 = document.getElementById(`div2${i}`)
                  div3.style.display = 'none'

                  let loadimg = document.getElementById(`loadimg${i}`)
                  loadimg.style.display = 'none'

                  let div4 = document.getElementById(`div3${i}`)
                  div4.style.display = 'block'

                  // let outerdiv = document.getElementById(`outerDiv${i}`)
                  // outerdiv.style.height = '85%'

                  let tech = document.getElementById(`tech${i}`)
                  tech.style.display = 'none'

                  // let tech2 = document.getElementById(`tech2${i}`)
                  // tech2.style.display = 'none'
                }}

                onPlaying={() => {
                  let div1 = document.getElementById(`div${i}`)
                  div1.style.display = 'none'

                  let div2 = document.getElementById(`div1${i}`)
                  div2.style.display = 'block'

                  let div3 = document.getElementById(`div2${i}`)
                  div3.style.display = 'none'

                  let loadimg = document.getElementById(`loadimg${i}`)
                  loadimg.style.display = 'none'

                  let div4 = document.getElementById(`div3${i}`)
                  div4.style.display = 'none'

                  // let outerdiv = document.getElementById(`outerDiv${i}`)
                  // outerdiv.style.height = 'auto'

                  let tech = document.getElementById(`tech${i}`)
                  tech.style.display = 'none'

                  // let tech2 = document.getElementById(`tech2${i}`)
                  // tech2.style.display = 'none'
                }}

                onPause={() => {
                  let div1 = document.getElementById(`div${i}`)
                  div1.style.display = 'block'

                  let div2 = document.getElementById(`div1${i}`)
                  div2.style.display = 'block'

                  let div3 = document.getElementById(`div2${i}`)
                  div3.style.display = 'none'

                  let loadimg = document.getElementById(`loadimg${i}`)
                  loadimg.style.display = 'none'

                  let div4 = document.getElementById(`div3${i}`)
                  div4.style.display = 'none'

                  // let outerdiv = document.getElementById(`outerDiv${i}`)
                  // outerdiv.style.height = 'auto'

                  let tech = document.getElementById(`tech${i}`)
                  tech.style.display = 'none'

                  // let tech2 = document.getElementById(`tech2${i}`)
                  // tech2.style.display = 'none'

                  // document.getElementById(`p1${i}`).innerText(`"${data.camera_gereral_name}" camera is offline`)
                  // document.getElementById(`p2${i}`).innerText('Please switch on the camera and try again!')
                }}

                onError={() => {
                  let div1 = document.getElementById(`div${i}`)
                  div1.style.display = 'none'

                  let div2 = document.getElementById(`div1${i}`)
                  div2.style.display = 'none'

                  let div3 = document.getElementById(`div2${i}`)
                  div3.style.display = 'none'

                  let loadimg = document.getElementById(`loadimg${i}`)
                  loadimg.style.display = 'none'


                  let div4 = document.getElementById(`div3${i}`)
                  div4.style.display = 'none'

                  // let outerdiv = document.getElementById(`outerDiv${i}`)
                  // outerdiv.style.height = '85%'

                  let tech = document.getElementById(`tech${i}`)
                  tech.style.display = 'block'

                  // let tech2 = document.getElementById(`tech2${i}`)
                  // tech2.style.display = 'block'

                  // document.getElementById(`p1${i}`).innerText(`"${data.camera_gereral_name}" camera is offline`)
                  // document.getElementById(`p2${i}`).innerText('Please switch on the camera and try again!')
                }} />
            </div>
            :
            <video
              id={`video${i}`}
              autoPlay
              muted
              style={{
                width: '100%',
                maxWidth: '100%',
                lineHeight: 0, display: 'block', cursor: 'pointer', objectFit: 'cover',
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
              onPlay={() => {
                let div1 = document.getElementById(`div${i}`)
                div1.style.display = 'none'

                let div2 = document.getElementById(`div1${i}`)
                div2.style.display = 'block'

                let div3 = document.getElementById(`div2${i}`)
                div3.style.display = 'none'

                let loadimg = document.getElementById(`loadimg${i}`)
                loadimg.style.display = 'none'

                let div4 = document.getElementById(`div3${i}`)
                div4.style.display = 'none'

                // let outerdiv = document.getElementById(`outerDiv${i}`)
                // outerdiv.style.height = 'auto'

                let tech = document.getElementById(`tech${i}`)
                tech.style.display = 'none'

                // let tech2 = document.getElementById(`tech2${i}`)
                // tech2.style.display = 'none'
              }}

              onWaiting={() => {
                let div1 = document.getElementById(`div${i}`)
                div1.style.display = 'block'

                let div2 = document.getElementById(`div1${i}`)
                div2.style.display = 'none'

                let div3 = document.getElementById(`div2${i}`)
                div3.style.display = 'none'

                let loadimg = document.getElementById(`loadimg${i}`)
                loadimg.style.display = 'none'

                let div4 = document.getElementById(`div3${i}`)
                div4.style.display = 'block'

                // let outerdiv = document.getElementById(`outerDiv${i}`)
                // outerdiv.style.height = '85%'

                let tech = document.getElementById(`tech${i}`)
                tech.style.display = 'none'

                // let tech2 = document.getElementById(`tech2${i}`)
                // tech2.style.display = 'none'
              }}

              onPlaying={() => {
                let div1 = document.getElementById(`div${i}`)
                div1.style.display = 'none'

                let div2 = document.getElementById(`div1${i}`)
                div2.style.display = 'block'

                let div3 = document.getElementById(`div2${i}`)
                div3.style.display = 'none'

                let loadimg = document.getElementById(`loadimg${i}`)
                loadimg.style.display = 'none'

                let div4 = document.getElementById(`div3${i}`)
                div4.style.display = 'none'

                // let outerdiv = document.getElementById(`outerDiv${i}`)
                // outerdiv.style.height = 'auto'

                let tech = document.getElementById(`tech${i}`)
                tech.style.display = 'none'

                // let tech2 = document.getElementById(`tech2${i}`)
                // tech2.style.display = 'none'
              }}

              onPause={() => {
                let div1 = document.getElementById(`div${i}`)
                div1.style.display = 'block'

                let div2 = document.getElementById(`div1${i}`)
                div2.style.display = 'block'

                let div3 = document.getElementById(`div2${i}`)
                div3.style.display = 'none'

                let loadimg = document.getElementById(`loadimg${i}`)
                loadimg.style.display = 'none'

                let div4 = document.getElementById(`div3${i}`)
                div4.style.display = 'none'

                // let outerdiv = document.getElementById(`outerDiv${i}`)
                // outerdiv.style.height = 'auto'

                let tech = document.getElementById(`tech${i}`)
                tech.style.display = 'none'

                // let tech2 = document.getElementById(`tech2${i}`)
                // tech2.style.display = 'none'

                // document.getElementById(`p1${i}`).innerText(`"${data.camera_gereral_name}" camera is offline`)
                // document.getElementById(`p2${i}`).innerText('Please switch on the camera and try again!')
              }}

              onError={() => {
                let div1 = document.getElementById(`div${i}`)
                div1.style.display = 'none'

                let div2 = document.getElementById(`div1${i}`)
                div2.style.display = 'none'

                let div3 = document.getElementById(`div2${i}`)
                div3.style.display = 'none'

                let loadimg = document.getElementById(`loadimg${i}`)
                loadimg.style.display = 'none'


                let div4 = document.getElementById(`div3${i}`)
                div4.style.display = 'none'

                // let outerdiv = document.getElementById(`outerDiv${i}`)
                // outerdiv.style.height = '85%'

                let tech = document.getElementById(`tech${i}`)
                tech.style.display = 'block'

                // let tech2 = document.getElementById(`tech2${i}`)
                // tech2.style.display = 'block'

                // document.getElementById(`p1${i}`).innerText(`"${data.camera_gereral_name}" camera is offline`)
                // document.getElementById(`p2${i}`).innerText('Please switch on the camera and try again!')
              }}
            ></video>
        }

        <div id={`loadimg${i}`} style={{ display: 'block' }}>
          <div style={{ position: 'absolute', bottom: 0, top: 0, left: 0, right: 0, width: '100%', height: '100%', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

            <img id={`initial${i}`} crossorigin="anonymous" style={{ style: 'none' }} width='100%' height="100%" src={tentovision_logo}></img>

            <img id={`loadimge${i}`} crossorigin="anonymous" style={{ style: 'none' }} width='100%' height="100%" src={imguri} onError={(e) => {
              // document.getElementById(`loadimge${i}`).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png'
              // document.getElementById(`loadimge${i}`).style.display = 'none'
            }} onLoad={() => {
              document.getElementById(`initial${i}`).style.display = 'none'
              document.getElementById(`loadimge${i}`).src = imguri
              setimage_onload(true)
            }}></img>

          </div>
        </div>

        <div id={`div${i}`} style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px', display: 'block' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ color: 'white', margin: 0 }}>{data.camera_gereral_name}</p>

            <div id={`div1${i}`} style={{ display: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#00ff00' }}></div>
                <p style={{ color: 'white', marginLeft: '10px', marginBottom: 0 }}>Live</p>
              </div>
            </div>

            <div id={`div2${i}`} style={{ display: 'block', }}>
              <div style={{ display: 'flex', alignItems: 'center', }}>
                <CircularProgress size={'15px'} style={{ color: 'white' }} />
                <p style={{ color: 'white', marginLeft: '10px', marginBottom: 0 }}>Loading</p>
              </div>
            </div>

            <div id={`div3${i}`} style={{ display: 'none', }}>
              <div style={{ display: 'flex', alignItems: 'center', }}>
                <CircularProgress size={'15px'} style={{ color: 'white' }} />
                <p style={{ color: 'white', marginLeft: '10px', marginBottom: 0 }}>Buffering</p>
              </div>
            </div>
          </div>
        </div>

        <div id={`tech${i}`} style={{ display: 'none', width : '100%', height : '100%' }}>
          <div style={{ position: 'absolute', bottom: 0, top: 0, left: 0, right: 0, width: '100%', height: totalCameraCoverScreen === 6 ? '20vh' : totalCameraCoverScreen === 12 ? '15vh' : '100%', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

            <img id={`orginal_image${i}`} crossorigin="anonymous" style={{ filter: 'blur(1px)', objectFit : 'cover', width : '100%', height: totalCameraCoverScreen === 6 ? '20vh' : totalCameraCoverScreen === 12 ? '15vh' : '100%' }} width='100%' height="100%" src={imguri} onError={() => {
              document.getElementById(`errorimage${i}`).style.display = 'block'
              document.getElementById(`orginal_image${i}`).style.display = 'none'
            }} onLoad={() => {
              document.getElementById(`errorimage${i}`).style.display = 'none'
            }}></img>

            <img id={`errorimage${i}`} crossorigin="anonymous" style={{ filter: 'blur(1px)', display: 'none', width : '100%', height: totalCameraCoverScreen === 6 ? '20vh' : totalCameraCoverScreen === 12 ? '15vh' : '100%' }} src={tentovision_logo} onLoad={() => {
              document.getElementById(`orginal_image${i}`).style.display = 'none'
            }}></img>

            <div style={{ position: 'absolute', bottom: 0, top: 0, left: 0, right: 0, width: '100%', height: totalCameraCoverScreen === 6 ? '20vh' : totalCameraCoverScreen === 12 ? '15vh' : '100%', backgroundColor: 'black', opacity: '0.5' }}></div>

            <div style={{ position: 'absolute', bottom: 0, top: 0, left: 0, right: 0, width: '100%', height: totalCameraCoverScreen === 6 ? '20vh' : totalCameraCoverScreen === 12 ? '15vh' : '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '5px' }}>
              <div style={{ backgroundColor: 'red', borderRadius: '50%', padding: '5px' }}>
                <VideocamOffOutlinedIcon style={{ color: 'white' }} />
              </div>
              {
  (totalCameraCoverScreen !== 12 && totalCameraCoverScreen !== 6) ? (
    <>
      <p id={`p1${i}`} style={{ color: 'white', margin: '0px', fontWeight: 'bolder' }}>
        "{data.camera_gereral_name}" camera is offline
      </p>
      <p id={`p2${i}`} style={{ color: 'white', margin: '0px', fontSize: '10px' }}>
        Please switch on the camera and try again!
      </p>
    </>
  ) : null
}
            </div>
          </div>
        </div>

        {videoFlag === 0 ?
          <div style={{ position: 'absolute', bottom: 0, top: 0, left: 0, right: 0, width: '100%', height: '100%', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <VideocamOffOutlinedIcon style={{ color: 'gray' }} />
            <p style={{ color: 'white' }}>No internet</p>
          </div> : ''}
      </div>

      {/* <div id={`tech2${i}`} style={{ position: 'absolute', top: 120, display: 'none' }}>
        <button style={{ backgroundColor: 'transparent', border: retry_count1 == 0 ? '1px solid red' : '1px solid grey', borderRadius: '15px', color: retry_count1 == 0 ? 'white' : 'grey' }} onClick={() => {
          if (retry_count1 == 0) {
            interval_fun()
          }
        }}>Retry {retry_count1 != 0 ? `(${retry_count1})` : <RestartAltIcon />}</button>
      </div> */}
    </div >
  );
};

export default PlayingComponent;
