import "./Styles/UserAccount.css";
import { db_type } from './db_config'
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useEffect, useState } from "react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress';
import * as api from '../Configurations/Api_Details'
import AWS from 'aws-sdk';

const UserAccount = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [flag, setflag] = useState(true)
  const [sub_data, setsub_data] = useState([])
  const [refresh_camera_flag, setrefresh_camera_flag] = useState(false);
  const [cameras_view, setcameras_view] = useState([])
  const userDetails = JSON.parse(localStorage.getItem("userData"));

  const [subscriptionPlanData, setSubscriptionPlanData] = useState({})
  const getAllSubscriptionData = async () => {

    if (db_type != 'local') {
      const data = {
        "client_id": userDetails._id
      }
      await axios.post(api.LIST_SUBSCRIPTION_PLAN, data).then((res) => { setSubscriptionPlanData(res.data); setIsLoading(false) }).catch((err) => console.log(err))
    }
  }

  useEffect(() => {
    getAllSubscriptionData()
    get_all_cameras_live()
  }, [])

  const get_all_cameras_live = () => {
    let data1 = []
    let count = 0

    if (userDetails.position_type == 'Client' || userDetails.position_type == 'Client Admin') {
      const getStocksData = {
        url: userDetails.position_type == 'Client' ? api.LIST_CAMERA_DATA_CLIENT_ID : userDetails.position_type == 'Client Admin' ? api.LIST_CAMERA_DATA_CLIENT_ADMIN_ID : api.LIST_CAMERA_DATA_USER_ID,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: userDetails.position_type == 'Client' ? JSON.stringify({

          "client_id": (JSON.parse(localStorage.getItem("userData")))._id

        }) : userDetails.position_type == 'Client Admin' ? JSON.stringify({

          "client_admin_id": (JSON.parse(localStorage.getItem("userData")))._id

        }) : JSON.stringify({

          "site_id": (JSON.parse(localStorage.getItem("userData")))._id

        })
      }
      axios(getStocksData)
        .then(response => {
          console.log(response.data);
          setcameras_view(response.data)

          if (response.data.length == 0) {
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

    } else if (userDetails.position_type == 'Site Admin') {
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
              setcameras_view('no_res')

              if (data1.length == 0) {
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
      userDetails.camera_id.map((val) => {
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

          setcameras_view(response.data)

          if (response.data.length == 0) {
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
  }

  function refresh_camera() {
    document.getElementById('refresh_camera').innerText = 'Pleas wait...'
    document.getElementById('refresh_camera').disabled = true
    setrefresh_camera_flag(true)
    AWS.config.update({
      region: 'ap-south-1', // e.g., 'us-east-1'
      credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
      },
    });

    const iot = new AWS.IotData({
      endpoint: process.env.REACT_APP_AWS_MQTT_KEY
    });

    if (userDetails.position_type == 'Client' || userDetails.position_type == 'Client Admin') {
      const getStocksData = {
        url: userDetails.position_type == 'Client' ? api.LIST_DEVICE_DATA_CLIENT_ID : userDetails.position_type == 'Client Admin' ? api.LIST_DEVICE_DATA_CLIENT_ADMIN_ID : '',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: userDetails.position_type == 'Client' ? JSON.stringify({

          "client_id": (JSON.parse(localStorage.getItem("userData")))._id

        }) : userDetails.position_type == 'Client Admin' ? JSON.stringify({

          "client_admin_id": (JSON.parse(localStorage.getItem("userData")))._id

        }) : ''
      }

      axios.request(getStocksData)
        .then((response) => {
          console.log(response.data);
          if (response.data.length == 0) {
            alert('NO DEVICE')
          } else {
            response.data.map((val) => {
              const params = {
                topic: `${val.device_id}/refresh_camera`,
                payload: '',
                qos: 0
              };

              iot.publish(params, (err, data) => {
                if (err) {
                  console.error('Error publishing message:', err);
                } else {
                  console.log('Message published successfully:', data);
                }
              });
            })
          }

          document.getElementById('refresh_camera').innerText = 'Refresh Cameras'
          document.getElementById('refresh_camera').disabled = false
          setrefresh_camera_flag(false)
        })
        .catch((error) => {
          console.log(error);
        })
    } else {
      const getStocksData = {
        url: userDetails.position_type == 'Site Admin' ? api.LIST_DEVICE_DATA_SITE_ADMIN_ID : api.LIST_DEVICE_DATA_USER_ID,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: userDetails.position_type == 'Site Admin' ? JSON.stringify({

          "site_admin_id": (JSON.parse(localStorage.getItem("userData")))._id

        }) : JSON.stringify({

          "user_id": (JSON.parse(localStorage.getItem("userData")))._id

        })
      }

      axios.request(getStocksData)
        .then((response) => {
          console.log(response.data);
          let devices = []
          let newdevices = []
          response.data.map((val) => {
            devices.push(val.device_id)
          })
          cameras_view.map((val) => {
            devices.push(val.device_id)
          })

          for (let index = 0; index < devices.length; index++) {
            if (newdevices.length != 0) {
              let deviceflag = false
              for (let innerindex = 0; innerindex < newdevices.length; innerindex++) {
                if (newdevices[innerindex] == devices[index]) {
                  deviceflag = false
                  break
                } else {
                  deviceflag = true
                }
              }

              if (deviceflag) {
                newdevices.push(devices[index])
              }
            } else {
              newdevices.push(devices[index])
            }

          }

          if (newdevices.length == 0) {
            alert('NO DEVICES')
          } else {
            newdevices.map((val) => {
              const params = {
                topic: `${val.device_id}/refresh_camera`,
                payload: '',
                qos: 0
              };

              iot.publish(params, (err, data) => {
                if (err) {
                  console.error('Error publishing message:', err);
                } else {
                  console.log('Message published successfully:', data);
                }
              });
            })
          }

          document.getElementById('refresh_camera').innerText = 'Refresh Cameras'
          document.getElementById('refresh_camera').disabled = false
          setrefresh_camera_flag(false)
        })
        .catch((error) => {
          console.log(error);
        })
    }

  }


  if (!userDetails || isLoading) {
    return (
      <div className="user-parent" >
        <div className="user-header">
          <Skeleton width={80} height={80} className="user-header-icon" />
          <Skeleton />
        </div>

        <div className="user-info">
          <div className="user-basic-info-parent">
            <Skeleton className="user-basic-info-child" />
          </div>
          <div className="user-contact-info-parent">
            <Skeleton className="user-contact-info-child" />
          </div>
        </div>

        <div className="user-profile-parent">
          <Skeleton className="user-profile-child" />
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="user-parent">
        <div className="user-header">
          <AccountCircleIcon className="user-header-icon" />
          <h3>Welcome {userDetails.User_name}</h3>
        </div>

        <div className="user-info">
          <div className="user-basic-info-parent">
            <h4>Basic Info</h4>
            <div className="user-basic-info-child">
              <div className="user-info-title">
                <p>Name : </p>
                <p>Gender : </p>
              </div>
              <div className="user-info-ans">
                <p>{userDetails.User_name}</p>
                <p>{userDetails.gender}</p>
              </div>
            </div>
          </div>

          <div className="user-contact-info-parent">
            <h4>Contact Info</h4>
            <div className="user-contact-info-child">
              <div className="user-info-title">
                <p>Mail : </p>
                <p>Mobile : </p>
              </div>
              <div className="user-info-ans">
                <p>{userDetails.mail}</p>
                <p>{userDetails.mobile_number}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="user-profile-parent">
          <h4>Your Profile</h4>
          <div className="user-profile-child">
            <div className="user-info-title">
              <p>Company Name : </p>
              <p>Operation Type : </p>
              <p>Position Type : </p>
              <p>Created Date : </p>
              <p>Alert Notification : </p>

              <button
                id='refresh_camera'
                style={{
                  backgroundColor: '#e22747',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '20px',
                  border: '1px solid gray'
                }}
                onClick={refresh_camera}
              >
                <span style={{ display: refresh_camera_flag ? 'block' : 'none' }}>
                  <CircularProgress size={20} style={{ marginRight: '5px', color: 'white' }} />
                </span>
                Refresh Cameras
              </button>
            </div>
            <div className="user-info-ans">
              <p>{userDetails.company_name}</p>
              {userDetails.operation_type.map((d, i) => (
                <p key={i}>{d}</p>
              ))}
              <p>{userDetails.position_type}</p>
              <p>{userDetails.created_date}</p>
              <div>
                <div style={{ backgroundColor: userDetails.alert_noti == true ? '#e32747' : '#a8a4a4', width: '3rem', height: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: userDetails.alert_noti == true ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }} onClick={() => {

                  console.log(userDetails.alert_noti);
                  const client_admin_details = {
                    alert_noti: userDetails.alert_noti == 0 ? 1 : 0,
                  };

                  const options = {
                    url: api.USER_DATA + userDetails._id,
                    method: 'PUT',
                    headers: {
                      "Content-Type": "application/json",
                      // 'Authorization': 'Bearer ' + window.localStorage.getItem('codeofauth')
                    },
                    data: JSON.stringify(client_admin_details),
                  };

                  axios(options)
                    .then((response) => {
                      console.log(response.data);
                      localStorage.setItem('userData', JSON.stringify(response.data.data));
                      console.log(JSON.parse(localStorage.getItem("userData")))
                      setflag(!flag)
                    })
                    .catch(function (e) {
                      if (e.message === "Network Error") {
                        alert(
                          "No Internet Found. Please check your internet connection"
                        );
                      } else {
                        alert(
                          "Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support."
                        );
                      }
                    });
                }}>
                  <div style={{ backgroundColor: 'white', width: '1.3rem', height: '1.3rem', borderRadius: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px', marginTop: '10px', marginBottom: '10px' }}>
        <p style={{ color: 'black', fontWeight: 'bolder' }}>Plan(s)</p>
        <div>

          <div style={{ cursor: 'pointer', width: '100%', display: 'flex', overflowX: 'scroll' }} >
            {
              subscriptionPlanData.sub.length != 0 ?
                subscriptionPlanData.sub?.map((plans, planIndex) => (
                  <div key={planIndex} style={{ marginLeft: '10px', marginBottom: '10px' }}>


                    <div style={{
                      border: '1px solid black',
                      display: 'inline-block', borderRadius: '5px', padding: '5px',
                      backgroundColor: 'white',
                      width: '23rem'
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
                  </div>
                ))
                :
                <div style={{ width: '100%' }}>
                  <p style={{ color: '#e22747', fontWeight: 'bolder', textAlign: 'center' }}>No Plans</p>
                </div>
            }


          </div>
        </div>
      </div>
    </div >
  );
};

export default UserAccount;
