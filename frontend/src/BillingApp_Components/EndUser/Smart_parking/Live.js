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
import Skeleton from 'react-loading-skeleton';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { PAGE, STARTDATE, STARTTIME, ENDDATE, ENDTIME, APPLY, SELECT, SELECTED_CAMERAS } from '../../../store/actions'
import { useDispatch, useSelector } from 'react-redux';
import DateComponent from '../DateComponent';

export default function Live() {
  const userData = JSON.parse(localStorage.getItem("userData"))
  const [view_type, setview_type] = useState('In')
  const [page_page, setpage_page] = useState(10)
  const { page, startdate, starttime, enddate, endtime, apply, select, selected_cameras } = useSelector((state) => state)

  const [selected_sites, setselected_sites] = useState([])
  const [site_list, setsite_list] = useState([])
  const [site_list1, setsite_list1] = useState([])
  const [skeleton, setskeleton] = useState(false)
  const [group_list, setgroup_list] = useState([])
  const [create_group_select, setcreate_group_select] = useState(false)
  const [site_manage_btn, setsite_manage_btn] = useState(false)
  const [data, setdata] = useState([])
  const [flag, setflag] = useState(false)
  const [clickbtn1, setclickbtn1] = useState(false)
  const [btn1, setbtn1] = useState('')
  let split_start_date = startdate.split('-')
  let split_end_date = enddate.split('-')
  const [start_dateFullYear, setstart_dateFullYear] = useState(split_start_date[0]);
  const [start_dateMonth, setstart_dateMonth] = useState(split_start_date[1]);
  const [start_dateDate, setstart_dateDate] = useState(split_start_date[2]);
  const [end_dateFullYear, setend_dateFullYear] = useState(split_end_date[0]);
  const [end_dateMonth, setend_dateMonth] = useState(split_end_date[1]);
  const [end_dateDate, setend_dateDate] = useState(split_end_date[2]);
  const [viewstart_date, setviewstart_date] = useState(false);
  const [viewend_date, setviewend_date] = useState(false);

  const dispatch = useDispatch()
  const [clickbtn2, setclickbtn2] = useState(false)
  const [apply_flag, setapply_flag] = useState(false)

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
    let combain_data = []
    let count = 0
    selected_sites.map((val) => {
      const getStocksData = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${api.VEHICLE_PARKING_IN_OUT_CREATION}`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          start_date: startdate,
          end_date: enddate,
          type: view_type,
          page: page_page,
          site_id: val._id,
          client_id: userData.position_type == 'Client' ? userData._id : userData.clientt_id,
        }
      }
      axios(getStocksData)
        .then(response => {
          console.log(response.data);
          count = count + 1
          combain_data = [...combain_data, ...response.data]
          if (count == selected_sites.length) {
            setdata([{
              vehicle_type: 'Two Vehicle',
              plate_number: 'TN 05 BS 1140',
              in_time: '09:05',
              out_time: '10:05',
              date: '2024-07-05',
              payment_status: false,
              amount: 0,
            }])
          }
          // setdata(response.data)
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
  }, [flag, selected_sites, apply])

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
      setbtn1('analytics')
      let btn = document.getElementById('day')
      btn.style.backgroundColor = '#f0f0f0'
      btn.style.color = 'black'
    }
    setclickbtn2(false)
  }

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

  return (
    <div>

      <div style={{ padding: '10px' }}>
        {
          skeleton == true ? (
            <div style={{ display: 'flex' }}>
              <div style={{ position: 'relative', marginLeft: '10px' }}>
                <button className='eventbtn' onClick={() => {
                  setcreate_group_select(!create_group_select)

                }} style={{ display: 'flex', backgroundColor: create_group_select ? '#e32747' : '#e6e8eb', color: create_group_select ? 'white' : 'black' }}> <CheckCircleOutlinedIcon style={{ marginRight: '10px' }} />Select Site<ArrowDropDownIcon style={{ marginLeft: '10px' }} /></button>

                <div>
                  <div style={{ borderRadius: '5px', backgroundColor: '#181828', padding: '10px', position: 'absolute', top: '60px', zIndex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', width: '200px', display: create_group_select ? 'block' : 'none' }}>
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
                                  } else {

                                    let sit_data = []

                                    selected_sites.map((val, j) => {
                                      if (i !== j) {
                                        sit_data.push(val)
                                      }
                                    })

                                    setselected_sites(sit_data)
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

              <div className='eventsDiv1' style={{ position: 'relative' }}>
                {/* <button className='eventbtn' id='day' onClick={() => {
                                                    setclickbtn1(true)

                                                    }}> <AccessTimeIcon style={{ marginRight: '10px' }} />{`${startdate} (${starttime}) - ${enddate} (${endtime})`} <ArrowDropDownIcon style={{ marginLeft: '10px' }} /></button> */}



                <button className='eventbtn' id='day' onClick={() => {
                  setclickbtn1(true)


                }}> <CalendarMonthIcon style={{ marginRight: '7px' }} />{`${startdate} (${starttime})- ${enddate} (${endtime})`} <ArrowDropDownIcon style={{ marginLeft: '10px' }} /></button>


                <div>
                  <div style={{ width: page === 1 ? '350px' : '500px', borderRadius: '5px', backgroundColor: '#181828', padding: '10px', position: 'absolute', top: page === 1 ? '80px' : '60px', zIndex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', display: btn1 === 'day' ? 'block' : 'none' }}>
                    <div style={{ position: 'relative' }}>

                      <ArrowDropUpIcon style={{ fontSize: '50px', color: '#181828', margin: 0, position: 'absolute', top: '-37px', left: 0 }} />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ backgroundColor: '#e32747', borderRadius: '50%', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                          <CloseIcon style={{ fontSize: '12px', color: 'white' }} onClick={() => {
                            setclickbtn1(true)
                          }} />
                        </div>
                      </div>
                      <div style={{ display: page === 1 ? 'none' : 'block' }}>
                        <div style={{ display: 'flex', padding: '10px', flexDirection: 'column' }}>
                          <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '5px' }}>Start Date</p>
                          <div style={{ position: 'relative' }}>
                            <div style={{ backgroundColor: '#f4f7fa', borderRadius: '5px', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                              <p style={{ fontWeight: 'bolder', margin: 0, color: '#181828' }}>{`${start_dateFullYear}-${start_dateMonth}-${start_dateDate}`}  <span style={{ marginLeft: '10px' }}>{`${starttime}-${endtime}`}</span></p>
                              <CalendarMonthIcon style={{ cursor: 'pointer', color: '#181828' }} onClick={() => {
                                setviewstart_date(!viewstart_date)
                              }} />
                            </div>

                            <div style={{ position: 'absolute', zIndex: 2, top: '50px', display: viewstart_date === true ? 'block' : 'none' }}>
                              <DateComponent year={start_dateFullYear} month={Number(start_dateMonth)} date={Number(start_dateDate)} type={'start_date'} starttime={starttime} endtime={endtime} parentFunction={initialdate} flag={'endTime'} select_hour={'none'} days_time={true} />
                            </div>
                          </div>
                          {/* <input type="date" value={startdate} style={{ padding: '10px', borderRadius: '5px' }} onChange={(e) => {

                                                        dispatch({ type: STARTDATE, value: e.target.value })
                                                    }}></input>
                                                    <input type="time" value={starttime} style={{ padding: '10px', borderRadius: '5px' }} onChange={(e) => {

                                                        dispatch({ type: STARTTIME, value: e.target.value })
                                                    }}></input> */}
                        </div>

                        <div style={{ display: 'flex', padding: '10px', flexDirection: 'column' }}>
                          <p style={{ margin: 0, color: 'white', fontWeight: 'bolder', marginBottom: '5px' }}>End Date</p>
                          <div style={{ position: 'relative' }}>
                            <div style={{ backgroundColor: '#f4f7fa', borderRadius: '5px', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                              <p style={{ fontWeight: 'bolder', margin: 0, color: '#181828' }}>{`${end_dateFullYear}-${end_dateMonth}-${end_dateDate}`}  <span style={{ marginLeft: '10px' }}>{`${starttime}-${endtime}`}</span></p>
                              <CalendarMonthIcon style={{ cursor: 'pointer', color: '#181828' }} onClick={() => {
                                setviewend_date(!viewend_date)
                              }} />
                            </div>

                            <div style={{ position: 'absolute', zIndex: 2, top: '50px', display: viewend_date === true ? 'block' : 'none' }}>
                              <DateComponent year={end_dateFullYear} month={Number(end_dateMonth)} date={Number(end_dateDate)} type={'end_date'} starttime={starttime} endtime={endtime} parentFunction={initialdate} flag={'endTime'} select_hour={'none'} days_time={true} />
                            </div>
                          </div>
                          {/* <input type="date" value={enddate} style={{ padding: '10px', borderRadius: '5px' }} onChange={(e) => {
                                                        dispatch({ type: ENDDATE, value: e.target.value })
                                                    }}></input>
                                                    <input type="time" value={endtime} style={{ padding: '10px', borderRadius: '5px' }} onChange={(e) => {
                                                        dispatch({ type: ENDTIME, value: e.target.value })
                                                    }}></input> */}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '10px' }}>
                          <button className="my-2" style={{ backgroundColor: '#e32747', color: 'white', borderRadius: '5px', border: 'none', padding: '5px' }} onClick={() => {
                            setclickbtn1(true)
                            setapply_flag(true)
                            dispatch({ type: APPLY, value: !apply })
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
                                <DateComponent year={start_dateFullYear} month={Number(start_dateMonth)} date={Number(start_dateDate)} type={'start_date'} starttime={starttime} endtime={endtime} parentFunction={initialdate} flag={'endTime'} select_hour={'none'} days_time={true} />
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
                                <DateComponent year={end_dateFullYear} month={Number(end_dateMonth)} date={Number(end_dateDate)} type={'end_date'} starttime={starttime} endtime={endtime} parentFunction={initialdate} flag={'endTime'} select_hour={'none'} days_time={true} />
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
          ) : (

            <div>
              <div style={{ position: 'relative', display: 'flex', padding: '10px' }}>

                <Skeleton style={{ borderRadius: "20px", border: '1px solid gray', }} width={200} height={45} />
              </div>
            </div>

          )
        }

        <div style={{ padding: '10px', paddingTop: 0, marginTop: '10px' }}>
          <Row style={{ backgroundColor: '#f1f1f1', borderRadius: '5px', borderTopLeftRadius: site_manage_btn ? '0px' : '5px', borderTopRightRadius: site_manage_btn ? '0px' : '5px' }}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex' }}>
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

                        selected_sites.map((val, j) => {
                          if (i !== j) {
                            sit_data.push(val)
                          }
                        })
                        setselected_sites(sit_data)


                      }} /></p>
                    </div>
                  ))
                }
              </div>
            </Col>
          </Row>
        </div>

        <div>
          <div style={{ position: 'relative' }}>
            <p type='text' style={{ backgroundColor: '#e6e8eb', color: 'black', padding: '10px', borderRadius: '5px', border: '1px solid gray', marginRight: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', width: '100%' }} onClick={() => {
              if (document.getElementById(`cam_type`).style.display !== 'none') {
                document.getElementById(`cam_type`).style.display = 'none'
              } else {
                document.getElementById(`cam_type`).style.display = 'block'
              }

            }}>{view_type}<span><ArrowDropDownIcon /></span></p>

            <div id={`cam_type`} style={{ backgroundColor: '#e6e8eb', width: '100%', padding: '15px', borderRadius: '5px', position: 'absolute', display: 'none', maxHeight: '150px', overflowY: 'scroll' }}>
              <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                setview_type('In')
              }
              }>In</p>
              <hr></hr>
              <p style={{ padding: '0', margin: 0, cursor: 'pointer' }} onClick={() => {
                setview_type('Out')
              }
              }>Out</p>
            </div>
          </div>
        </div>


        <table style={{ width: '100%', backgroundColor: 'white' }}>
          <tr style={{ backgroundColor: '#e6e8eb', color: 'black' }}>
            <th style={{ padding: '15px' }}>Vehicle Type</th>
            <th style={{ padding: '15px' }}>Plate Number</th>
            <th style={{ padding: '15px' }}>In Time</th>
            <th style={{ padding: '15px' }}>Out Time</th>
            <th style={{ padding: '15px' }}>Amount</th>
            <th style={{ padding: '15px' }}>Date</th>
            <th style={{ padding: '15px' }}>Action</th>
          </tr>

          {
            data.map((val, i) => {
              return (
                <tr style={{ borderBottom: '1px solid grey', color: 'black' }}>
                  <td style={{ padding: '15px' }}>{val.vehicle_type}</td>
                  <td style={{ padding: '15px' }}>{val.plate_number}</td>
                  <td style={{ padding: '15px' }}>{val.in_time}</td>
                  <td style={{ padding: '15px' }}>{val.out_time}</td>
                  <td style={{ padding: '15px' }}>{val.amount}</td>
                  <td style={{ padding: '15px' }}>{val.date}</td>
                  <td style={{ padding: '15px', color: 'red' }}>
                    <div style={{ display: 'flex', color: 'black' }}>
                      <input type='checkbox' onClick={() => {
                        const getStocksData = {
                          method: 'post',
                          maxBodyLength: Infinity,
                          url: `${api.VEHICLE_PARKING_CREATION}${val._id}`,
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          data: {
                            payment_status: true,
                          }
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
                      }}></input>
                      <p style={{ margin: 0, marginLeft: '5px' }}>Paid</p>
                    </div>
                  </td>
                </tr>
              )
            })
          }

        </table>
      </div>
    </div>
  )
}
