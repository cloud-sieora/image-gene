import React, { useEffect, useState } from 'react'
import EventMenu from '../EventMenu'
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
import Events from '../Events'
import { useDispatch, useSelector } from 'react-redux';
import * as api from '../../Configurations/Api_Details'
import axios from 'axios'


export default function Index() {
  const userData = JSON.parse(localStorage.getItem("userData"))
  const { page, startdate, starttime, enddate, endtime, apply, select, selected_cameras } = useSelector((state) => state)
  const [cameraName, setcameraName] = useState('')
  const [res, setres] = useState('')
  const [data, setdata] = useState([])
  const [res_next_data, setres_next_data] = useState([])
  const [res1, setres1] = useState('')
  const [flag, setflag] = useState(false)
  const [response_start_length, setresponse_end_length] = useState({ start_count: 0, end_count: 30, total: 0 })
  const [analytics, setanalytics] = useState({ analytics_obj: [], analytics_num: {} })

  useEffect(() => {
    response_start_length.start_count = 0
    response_start_length.end_count = 30
    response_start_length.total = 0
    getdata()
    let pathName = window.location.pathname;
    let arr = pathName.split('/')
    setcameraName(arr[arr.length - 1])
    setflag(true)
  }, [apply])

  function getdata() {
    setdata([])
    setres('')
    setres_next_data([])

    if (flag) {
      if (selected_cameras.length !== 0) {
        console.log(selected_cameras);

        let ids = []
        selected_cameras.map((val) => {
          ids.push(val._id)
        })
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

        console.log(response_start_length.start_count);
        console.log(response_start_length.end_count);

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
            console.log(response.data.ana_length);
            response_start_length.total = response.data.ana_length
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
      } else {
        setres('empty response')
      }
    }

  }

  function call_next_data() {
    if (selected_cameras.length !== 0) {
      if (response_start_length.start_count + 60 <= response_start_length.total) {
        response_start_length.start_count = response_start_length.start_count + 30
        response_start_length.end_count = response_start_length.start_count + 30
        console.log(response_start_length.start_count);
        console.log(response_start_length.end_count);
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

    if (selected_cameras.length !== 0) {
      let ids = []
      selected_cameras.map((val) => {
        ids.push(val._id)
      })
      let data = JSON.stringify({
        "camera_id": ids,
        "camera_name": '',
        // startdate
        "start_date": startdate,
        "start_time": starttime,
        // enddate
        "end_date": enddate,
        "end_time": endtime,
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
    } else {
      setres1('no more data')
    }
  }

  return (
    <>
      {
        userData.position_type != 'Attendance User' ?
          <div id='main' style={{ width: '100%' }}>
            <Row style={{ padding: 0 }}>
              <Events data1={data} res={res} aditional_info={true} type={'motion_events'} alarm_status={() => { }} all_alert_count={{ active_alert: 0, inactive_alert: 0 }} res1={res1} analytics1={analytics} res_next_data={res_next_data} call_next_data={call_next_data} display_type={'none'} />
            </Row>
          </div>
          :
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <p>Attendance user Doesn't have permission to access Motion Events</p>
          </div>

      }
    </>
  )
}
