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

export default function History() {
  const userData = JSON.parse(localStorage.getItem("userData"))
  const [view_type, setview_type] = useState('In')
  const [page, setpage] = useState(1)

  const [selected_sites, setselected_sites] = useState([])
  const [site_list, setsite_list] = useState([])
  const [site_list1, setsite_list1] = useState([])
  const [skeleton, setskeleton] = useState(false)
  const [group_list, setgroup_list] = useState([])
  const [create_group_select, setcreate_group_select] = useState(false)
  const [site_manage_btn, setsite_manage_btn] = useState(false)
  const [data, setdata] = useState([])
  const [flag, setflag] = useState(false)

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
        url: `${api.VEHICLE_PARKING_CREATION_ORDER_STATUS}`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          type: view_type,
          page: page,
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
              date: '2024-06-29',
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
  }, [flag, selected_sites])

  return (
    <div>

      <div style={{ padding: '10px' }}>
        {
          skeleton == true ? (
            <div>
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


        <table style={{ width: '100%', backgroundColor: 'white' }}>
          <tr style={{ backgroundColor: '#e6e8eb', color: 'black' }}>
            <th style={{ padding: '15px' }}>Vehicle Type</th>
            <th style={{ padding: '15px' }}>Plate Number</th>
            <th style={{ padding: '15px' }}>In Time</th>
            <th style={{ padding: '15px' }}>Out Time</th>
            <th style={{ padding: '15px' }}>Amount</th>
            <th style={{ padding: '15px' }}>Date</th>
            <th style={{ padding: '15px' }}>Status</th>
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
                  <td style={{ padding: '15px' }}>{val.payment_status == true ? 'Paid' : 'Not Paid'}</td>
                </tr>
              )
            })
          }

        </table>
      </div>
    </div>
  )
}
