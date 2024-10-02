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
import Chart from 'react-apexcharts'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux';
import * as api from '../../Configurations/Api_Details'
import axios from 'axios'
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Skeleton from 'react-loading-skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import MovingIcon from '@mui/icons-material/Moving';
import GroupsIcon from '@mui/icons-material/Groups';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import './people_style.css'

let color_code_ind = 1
export default function Foot_Foll_count({ time_chk }) {
    color_code_ind = 1
    const { page, startdate, starttime, enddate, endtime, apply, select, selected_cameras } = useSelector((state) => state)

    const [chart_data, setchart_data] = useState([])
    const [chart_field, setchart_field] = useState([])
    const [chart_field1, setchart_field1] = useState([])
    const [chart_bar, setchart_bar] = useState([])
    const [chart_bar1, setchart_bar1] = useState([])
    const [total_foot_fall, settotal_foot_fall] = useState(0)
    const [total_inside, settotal_inside] = useState(0)
    const [total_outside, settotal_outside] = useState(0)
    const [total_male, settotal_male] = useState(0)
    const [total_female, settotal_female] = useState(0)
    const [total_traditional, settotal_traditional] = useState(0)
    const [total_modern, settotal_modern] = useState(0)
    const [heat_map_image, setheat_map_image] = useState([])
    const [induval_cam, setinduval_cam] = useState([])
    const [chart_flag, setchart_flag] = useState(false)
    const [chart_flag1, setchart_flag1] = useState(false)
    const [res_flag, setres_flag] = useState('no res')
    const [high_count, sethigh_count] = useState(0)
    const [average_count, setaverage_count] = useState(0)
    const [high_time, sethigh_time] = useState(0)
    const [average_time, setaverage_time] = useState(0)
    const [induval_cam1, setinduval_cam1] = useState([])
    const [overall_count, setoverall_count] = useState({})
    const [color_code, setcolor_code] = useState([{ first: "#3353C6", second: "#708FFE" }, { first: "#009887", second: "#21E5CF" }, { first: "#80C7F6", second: "#005DB0" }, { first: "#A993FF", second: "#7A5AF8" }])

    let [age_data, setage_data] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    useEffect(() => {
        getdata(time_chk)
    }, [apply, selected_cameras, time_chk])

    const chart_model = () => {
        setchart_flag(false)
    }

    const chart_model1 = () => {
        setchart_flag1(false)
    }

    function getdata(flag_type) {
        setres_flag('no res')
        let endate = moment(startdate)
        let post_flag = false
        let date_types = []
        if (flag_type == 'hour') {
            if (moment(startdate).format('YYYY-MM-DD') == moment(enddate).format('YYYY-MM-DD')) {
                endate = enddate
                post_flag = true

                const startDate = starttime;
                const endDate = endtime;

                // Create an array to store the dates
                const datesInRange = [];

                // Loop through each date and push it to the array
                let currentDate = moment(startDate, 'HH:mm');
                console.log(startDate, endDate);
                while (moment(currentDate, 'HH:mm').isSameOrBefore(moment(endDate, 'HH:mm'))) {
                    datesInRange.push(`${currentDate.format('HH:mm')}:00`);
                    currentDate.add(1, 'hour');
                }

                if (datesInRange[datesInRange.length - 1] != endDate) {
                    date_types = [...datesInRange, endDate]
                } else {
                    date_types = datesInRange
                }

            } else {
                alert('select same date start and end')
                post_flag = false
            }
        } else if (flag_type == 'day') {
            let chk_date = moment(startdate);
            let chk_date2 = chk_date.clone().add(7, 'day');

            endate = enddate
            post_flag = true
            const startDate = moment(startdate);
            const endDate = moment(endate);

            // Create an array to store the dates
            const datesInRange = [];

            // Loop through each date and push it to the array
            let currentDate = startDate.clone();
            while (currentDate.isSameOrBefore(endDate)) {
                datesInRange.push(currentDate.format('YYYY-MM-DD'));
                currentDate.add(1, 'day');
            }
            date_types = datesInRange

            // if (moment(enddate, 'YYYY-MM-DD').isBefore(moment(chk_date2, 'YYYY-MM-DD')) || startdate == enddate) {
            //     endate = enddate
            //     post_flag = true
            //     const startDate = moment(startdate);
            //     const endDate = moment(endate);

            //     // Create an array to store the dates
            //     const datesInRange = [];

            //     // Loop through each date and push it to the array
            //     let currentDate = startDate.clone();
            //     while (currentDate.isSameOrBefore(endDate)) {
            //         datesInRange.push(currentDate.format('YYYY-MM-DD'));
            //         currentDate.add(1, 'day');
            //     }
            //     date_types = datesInRange
            // } else {
            //     alert('select 7 days or lesser than 7 days')
            //     post_flag = false
            // }

        } else if (flag_type == 'monthly') {
            let chk_date = moment(startdate, "YYYY-MM");
            let chk_date2 = chk_date.clone().add(11, 'month');
            if (moment(enddate, 'YYYY-MM').isBefore(moment(chk_date2, 'YYYY-MM')) || chk_date.format("YYYY-MM") == moment(enddate).format('YYYY-MM')) {
                endate = enddate
                post_flag = true
                const startDate = moment(startdate);
                const endDate = moment(endate);

                // Create an array to store the dates
                const datesInRange = [];

                // Loop through each date and push it to the array
                let currentDate = startDate.clone();
                while (currentDate.isSameOrBefore(endDate)) {
                    datesInRange.push(currentDate.format('YYYY-MM'));
                    currentDate.add(1, 'month');
                }
                date_types = datesInRange
            } else {
                alert('select 12 months or lesser than 12 months')
                post_flag = false
            }
        } else if (flag_type == 'yearly') {
            let chk_date = moment(startdate, "YYYY");
            let chk_date2 = chk_date.clone().add(11, 'year');
            if (moment(enddate, 'YYYY').isBefore(moment(chk_date2, 'YYYY')) || chk_date.format("YYYY") == moment(enddate).format('YYYY')) {
                endate = enddate
                post_flag = true
                const startDate = moment(startdate);
                const endDate = moment(endate);

                // Create an array to store the dates
                const datesInRange = [];

                // Loop through each date and push it to the array
                let currentDate = startDate.clone();
                while (currentDate.isSameOrBefore(endDate)) {
                    datesInRange.push(currentDate.format('YYYY'));
                    currentDate.add(11, 'year');
                }
                date_types = datesInRange
            } else {
                alert('select 12 Years or lesser than 12 years')
                post_flag = false
            }
        }

        console.log(date_types);

        let count = 0
        let data = {}
        let induval_data = []
        let induval_data1 = []
        let heat_map_url = []

        let overall_data = {
            'high_count': 0, 'high_time': 0, 'total_count': 0, 'total_time': 0, 'average_count': 0, 'average_time': 0
        }

        let high_count = 0
        let high_time = 0
        let total_time = 0
        let total_count = 0
        let average_count = 0
        let average_time = 0

        let region = []
        selected_cameras.map((value) => {
            value.image_edited_people.map((val) => {
                region.push({ name: val.name, id: val.id, main_type: value.main_type, overall_count: value.overall_count })
            })
        })

        if (region.length == 0 && selected_cameras.length != 0) {
            setres_flag('no data')
        }

        console.log(region);

        region.map((val) => {

            const getStocksData = {
                method: 'post',
                maxBodyLength: Infinity,
                url: api.LIST_QUEUE_COUNT_CAMERA_ID,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    'camera_id': val.id,
                    'start_date': startdate,
                    'end_date': enddate,
                    'start_time': '00:00:00',
                    'end_time': '23:59:59',
                    'option': ['inside', 'outside', 'male', 'female'],
                    'flag': flag_type,
                    'flag_count_arr': date_types,
                }
            }
            axios(getStocksData)
                .then(response => {
                    console.log(response.data);
                    console.log(val.id);

                    let count_data = response.data.value
                    induval_data1.push({
                        'camera_name': val.name,
                        'combain_data': [
                            { name: 'Higher Time', data: [] },
                            { name: "Average Time", data: [] },
                        ],
                        'category': [],
                        'high_count': 0,
                        'high_time': 0,
                        'total_count': 0,
                        'total_time': 0,
                        'average_count': 0,
                        'average_time': 0
                    })

                    induval_data.push({
                        'camera_name': val.name,
                        'combain_data': [
                            { name: 'Higher Count', data: [] },
                            { name: "Average Count", data: [] },
                        ],
                        'category': [],
                        'high_count': 0,
                        'high_time': 0,
                        'total_count': 0,
                        'total_time': 0,
                        'average_count': 0,
                        'average_time': 0
                    })

                    console.log(count_data)

                    Object.keys(count_data).forEach((val) => {
                        induval_data[induval_data.length - 1].category.push(val)
                        induval_data[induval_data.length - 1].combain_data[0].data.push(count_data[val].high_count)
                        induval_data[induval_data.length - 1].combain_data[1].data.push(count_data[val].average_count)

                        induval_data1[induval_data1.length - 1].category.push(val)
                        induval_data1[induval_data1.length - 1].combain_data[0].data.push(count_data[val].high_time)
                        induval_data1[induval_data1.length - 1].combain_data[1].data.push(count_data[val].average_time)
                    })

                    induval_data[induval_data.length - 1].combain_data.map((val) => {
                        let total = 0
                        val.data.map((value) => {
                            total = total + value
                        })

                        if (val.name == 'Higher Count') {
                            induval_data[induval_data.length - 1].high_count = induval_data[induval_data.length - 1].high_count + total
                        } else if (val.name == 'Average Count') {
                            induval_data[induval_data.length - 1].average_count = induval_data[induval_data.length - 1].average_count + total
                        }
                    })

                    induval_data1[induval_data1.length - 1].combain_data.map((val) => {
                        let total = 0
                        val.data.map((value) => {
                            total = total + value
                        })

                        if (val.name == 'Higher Time') {
                            induval_data1[induval_data1.length - 1].high_time = induval_data1[induval_data1.length - 1].high_time + total
                        } else if (val.name == 'Average Time') {
                            induval_data1[induval_data1.length - 1].average_time = induval_data1[induval_data1.length - 1].average_time + total
                        }
                    })

                    if (val.main_type == 'true') {
                        if (Object.keys(data).length !== 0) {
                            Object.keys(count_data).forEach((key) => {
                                data[key] = { 'high_count': data[key].high_count + count_data[key].high_count, 'high_time': data[key].high_time + count_data[key].high_time, 'total_count': data[key].total_count + count_data[key].total_count, 'total_time': data[key].total_time + count_data[key].total_time, 'average_count': data[key].average_count + count_data[key].average_count, 'average_time': data[key].average_time + count_data[key].average_time }
                            })
                        } else {
                            data = count_data
                        }
                    }
                    count = count + 1

                    if (val.main_type == 'true') {
                        overall_data.high_count = overall_data.high_count + induval_data[induval_data.length - 1].high_count
                        overall_data.high_time = overall_data.high_time + induval_data[induval_data.length - 1].high_time
                        overall_data.total_count = overall_data.total_count + induval_data[induval_data.length - 1].total_count
                        overall_data.total_time = overall_data.total_time + induval_data[induval_data.length - 1].total_time
                        overall_data.average_count = overall_data.average_count + induval_data[induval_data.length - 1].average_count
                        overall_data.average_time = overall_data.average_time + induval_data[induval_data.length - 1].average_time

                        overall_data.high_count = overall_data.high_count + induval_data1[induval_data1.length - 1].high_count
                        overall_data.high_time = overall_data.high_time + induval_data1[induval_data1.length - 1].high_time
                        overall_data.total_count = overall_data.total_count + induval_data1[induval_data1.length - 1].total_count
                        overall_data.total_time = overall_data.total_time + induval_data1[induval_data1.length - 1].total_time
                        overall_data.average_count = overall_data.average_count + induval_data1[induval_data1.length - 1].average_count
                        overall_data.average_time = overall_data.average_time + induval_data1[induval_data1.length - 1].average_time
                    }

                    console.log(val.main_type);
                    console.log(val.overall_count);

                    if (count == region.length) {
                        let combain_data = [
                            { name: 'Higher Count', data: [] },
                            { name: "Average Count", data: [] },
                        ]
                        let category = []

                        let combain_data1 = [
                            { name: 'Higher Time', data: [] },
                            { name: "Average Time", data: [] },
                        ]
                        let category1 = []

                        Object.keys(data).forEach((val) => {
                            category.push(val)
                            category1.push(val)
                            combain_data[0].data.push(data[val].high_count)
                            combain_data[1].data.push(data[val].average_count)
                            combain_data1[0].data.push(data[val].high_time)
                            combain_data1[1].data.push(data[val].average_time)
                        })

                        console.log(category);
                        console.log(data);

                        combain_data.map((val) => {
                            let total = 0
                            val.data.map((value) => {
                                total = total + value
                            })

                            if (val.name == 'Higher Count') {
                                sethigh_count(high_count + total)
                            } else if (val.name == 'Average Count') {
                                setaverage_count(average_count + total)
                            }
                        })

                        combain_data1.map((val) => {
                            let total = 0
                            val.data.map((value) => {
                                total = total + value
                            })

                            if (val.name == 'Higher Time') {
                                sethigh_time(high_time + total)
                            } else if (val.name == 'Average Time') {
                                setaverage_time(average_time + total)
                            }
                        })
                        console.log(category);
                        console.log(combain_data);
                        console.log(heat_map_url);
                        console.log(induval_data);

                        setoverall_count(overall_data)
                        setchart_bar(combain_data)
                        setchart_bar1(combain_data1)
                        setchart_field(category)
                        setchart_field1(category1)
                        setchart_data(data)
                        setinduval_cam(induval_data)
                        setinduval_cam1(induval_data1)
                        setres_flag('res')
                    }
                })
                .catch(function (e) {
                    console.log(e)
                    if (e.message === 'Network Error') {
                        alert("No Internet Found. Please check your internet connection")
                    }
                    else {
                        alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                    }

                });
        })
    }

    const state = {
        series: chart_bar,
        options: {
            chart: {
                type: 'bar',
                height: 350,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 7,
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: chart_field,
            },
            yaxis: {
                title: {
                    text: 'Customer Analytics'
                }
            },
            fill: {
                type: 'gradient', // Enable gradient fill
                gradient: {
                    type: 'vertical', // Apply gradient from top to bottom
                    shadeIntensity: 1,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100], // Gradient stops
                }
            },
            colors: ['#5719c2', '#104f7a'],
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val
                    }
                }
            }
        }
    };

    const state1 = {
        series: chart_bar1,
        options: {
            chart: {
                type: 'bar',
                height: 350,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 7,
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: chart_field1,
            },
            yaxis: {
                title: {
                    text: 'Customer Analytics'
                }
            },
            fill: {
                type: 'gradient', // Enable gradient fill
                gradient: {
                    type: 'vertical', // Apply gradient from top to bottom
                    shadeIntensity: 1,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100], // Gradient stops
                }
            },
            colors: ['#5719c2', '#104f7a'],
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val
                    }
                }
            }
        }
    };

    return (
        <div>

            <Modal
                open={chart_flag}
                onClose={chart_model}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ marginLeft: 'auto', marginRight: 'auto', top: '5%', width: '95%', }}
            >
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', height: '95%', overflowY: 'scroll' }}>
                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                                <CloseIcon style={{ fontSize: '15px', color: 'red', cursor: 'pointer' }} onClick={() => {
                                    chart_model()
                                }} />

                            </div>
                        </Col>


                        {
                            induval_cam.map((val) => {
                                const object = {
                                    series: val.combain_data,
                                    options: {
                                        chart: {
                                            type: 'bar',
                                            height: 350,
                                        },
                                        plotOptions: {
                                            bar: {
                                                horizontal: false,
                                                columnWidth: '55%',
                                                borderRadius: 7,
                                                endingShape: 'rounded'
                                            },
                                        },
                                        dataLabels: {
                                            enabled: false
                                        },
                                        stroke: {
                                            show: true,
                                            width: 2,
                                            colors: ['transparent']
                                        },
                                        xaxis: {
                                            categories: val.category,
                                        },
                                        yaxis: {
                                            title: {
                                                text: 'Customer Analytics'
                                            }
                                        },
                                        fill: {
                                            type: 'gradient', // Enable gradient fill
                                            gradient: {
                                                type: 'vertical', // Apply gradient from top to bottom
                                                shadeIntensity: 1,
                                                opacityFrom: 1,
                                                opacityTo: 1,
                                                stops: [0, 100], // Gradient stops
                                            }
                                        },
                                        colors: ['#5719c2', '#104f7a'],
                                        tooltip: {
                                            y: {
                                                formatter: function (val) {
                                                    return val
                                                }
                                            }
                                        }
                                    }

                                };
                                return (
                                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                        <div style={{ borderRadius: '5px', border: '1px solid black', marginBottom: '10px' }}>

                                            <div>

                                                <div>
                                                    <div style={{ backgroundColor: 'white', borderRadius: '5px', padding: '10px', color: 'black', marginRight: '10px', width: '100%' }}>
                                                        <p style={{ fontWeight: 'bold', color: '#e32747', fontSize: '18px' }}>{val.camera_name} :-</p>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <div style={{ display: 'flex' }}>
                                                                <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Average Count</p>
                                                                <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.average_count}</p>
                                                            </div>

                                                            <div style={{ display: 'flex' }}>
                                                                <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Average Time</p>
                                                                <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.average_time}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Chart options={object.options} series={object.series} type="bar" height={350} />
                                        </div>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </div>
            </Modal>

            <Modal
                open={chart_flag1}
                onClose={chart_model1}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ marginLeft: 'auto', marginRight: 'auto', top: '5%', width: '95%', }}
            >
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', height: '95%', overflowY: 'scroll' }}>
                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                                <CloseIcon style={{ fontSize: '15px', color: 'red', cursor: 'pointer' }} onClick={() => {
                                    chart_model1()
                                }} />

                            </div>
                        </Col>


                        {
                            induval_cam1.map((val) => {
                                const object = {
                                    series: val.combain_data,
                                    options: {
                                        chart: {
                                            type: 'bar',
                                            height: 350,
                                        },
                                        plotOptions: {
                                            bar: {
                                                horizontal: false,
                                                columnWidth: '55%',
                                                borderRadius: 7,
                                                endingShape: 'rounded'
                                            },
                                        },
                                        dataLabels: {
                                            enabled: false
                                        },
                                        stroke: {
                                            show: true,
                                            width: 2,
                                            colors: ['transparent']
                                        },
                                        xaxis: {
                                            categories: val.category,
                                        },
                                        yaxis: {
                                            title: {
                                                text: 'Customer Analytics'
                                            }
                                        },
                                        fill: {
                                            type: 'gradient', // Enable gradient fill
                                            gradient: {
                                                type: 'vertical', // Apply gradient from top to bottom
                                                shadeIntensity: 1,
                                                opacityFrom: 1,
                                                opacityTo: 1,
                                                stops: [0, 100], // Gradient stops
                                            }
                                        },
                                        colors: ['#5719c2', '#104f7a'],
                                        tooltip: {
                                            y: {
                                                formatter: function (val) {
                                                    return val
                                                }
                                            }
                                        }
                                    }

                                };
                                return (
                                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                        <div style={{ borderRadius: '5px', border: '1px solid black', marginBottom: '10px' }}>

                                            <div>

                                                <div>
                                                    <div style={{ backgroundColor: 'white', borderRadius: '5px', padding: '10px', color: 'black', marginRight: '10px', width: '100%' }}>
                                                        <p style={{ fontWeight: 'bold', color: '#e32747', fontSize: '18px' }}>{val.camera_name} :-</p>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <div style={{ display: 'flex' }}>
                                                                <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Average Count</p>
                                                                <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.average_count}</p>
                                                            </div>

                                                            <div style={{ display: 'flex' }}>
                                                                <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Average Time</p>
                                                                <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.average_time}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Chart options={object.options} series={object.series} type="bar" height={350} />
                                        </div>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </div>
            </Modal>
            <div>

                {
                    res_flag == 'res' ?
                        <div>

                            <div style={{ display: 'flex', overflowX: 'scroll' }}>

                                <div>
                                    <div style={{ background: `linear-gradient(${color_code[0].first}, ${color_code[0].second})`, borderRadius: '15px', padding: '10px', display: 'inline-block', width: '250px', color: 'black', marginRight: '10px', marginBottom: '10px', boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                            <div className='scrollable-div' style={{ width: '230px', overflowX: 'scroll', marginBottom: '8px' }}>
                                                <p style={{ fontWeight: 'bold', color: 'white', fontSize: '18px', whiteSpace: 'nowrap', margin: 0, marginBottom: '4px' }}>Overall :-</p>
                                            </div>
                                            <div style={{ borderRadius: '20px', background: `linear-gradient(${color_code[0].first}, ${color_code[0].second})`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '3px', paddingBottom: '3px', color: 'white' }}>
                                                <MovingIcon style={{ fontSize: '20px' }} />
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', }}>
                                            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginRight: '10px' }}>
                                                <p style={{ fontWeight: 'bold', margin: 0, color: 'white', marginRight: '5px' }}>Average Count</p>
                                                <div style={{ borderRadius: '15px', background: `linear-gradient(${color_code[0].first}, ${color_code[0].second})`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '5px', paddingBottom: '5px' }}>
                                                    <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>{overall_count.average_count}</p>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <p style={{ fontWeight: 'bold', margin: 0, color: 'white', marginRight: '5px' }}>Average Time</p>
                                                <div style={{ borderRadius: '15px', background: `linear-gradient(${color_code[0].first}, ${color_code[0].second})`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '5px', paddingBottom: '5px' }}>
                                                    <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>{overall_count.average_time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {
                                    induval_cam.map((val, i) => {
                                        if (color_code_ind == (color_code.length)) {
                                            color_code_ind = 0
                                            color_code_ind = color_code_ind + 1
                                        } else {
                                            color_code_ind = color_code_ind + 1
                                            console.log(color_code_ind);
                                        }
                                        return (
                                            <div>
                                                <div style={{ background: `linear-gradient(${color_code[color_code_ind - 1].first}, ${color_code[color_code_ind - 1].second})`, borderRadius: '15px', padding: '10px', display: 'inline-block', width: '250px', color: 'black', marginRight: '10px', marginBottom: '10px', boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}>

                                                    <div style={{ display: 'flex', alignItems: 'center', }}>
                                                        <div className='scrollable-div' style={{ width: '230px', overflowX: 'scroll', marginBottom: '8px' }}>
                                                            <p style={{ fontWeight: 'bold', color: 'white', fontSize: '18px', whiteSpace: 'nowrap', margin: 0, marginBottom: '4px' }}>{val.camera_name} ({val.type}) :-</p>
                                                        </div>
                                                        <div style={{ borderRadius: '20px', background: `linear-gradient(${color_code[color_code_ind - 1].first}, ${color_code[color_code_ind - 1].second})`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '3px', paddingBottom: '3px', color: 'white' }}>
                                                            <MovingIcon style={{ fontSize: '20px' }} />
                                                        </div>
                                                    </div>

                                                    <div style={{ display: 'flex', }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '10px', }}>
                                                            <p style={{ fontWeight: 'bold', margin: 0, color: 'white', marginRight: '5px' }}>Average Count</p>
                                                            <div style={{ borderRadius: '15px', background: `linear-gradient(${color_code[color_code_ind - 1].first}, ${color_code[color_code_ind - 1].second})`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '5px', paddingBottom: '5px' }}>
                                                                <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>{val.average_count}</p>
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                            <p style={{ fontWeight: 'bold', margin: 0, color: 'white', marginRight: '5px' }}>Average Time</p>
                                                            <div style={{ borderRadius: '15px', background: `linear-gradient(${color_code[color_code_ind - 1].first}, ${color_code[color_code_ind - 1].second})`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '5px', paddingBottom: '5px' }}>
                                                                <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>{induval_cam[i].average_time}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <div>
                                <div style={{marginBottom:'10px'}}>
                                    <div style={{ backgroundColor: 'white', borderRadius: '15px', boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px' }}>
                                            <div style={{ color: '#e32747', marginLeft: '20px', display: 'flex', alignItems: 'center', fontSize: '20px' }}>
                                                <GroupsIcon />
                                                <p style={{ fontWeight: 'bolder', margin: 0, marginLeft: '10px' }}>Queue Length</p>
                                            </div>
                                            <button className="my-2" style={{ backgroundColor: '#e32747', color: 'white', borderRadius: '5px', border: 'none', padding: '5px' }} onClick={() => {
                                                setchart_flag(true)
                                            }}>Individual</button>
                                        </div>
                                        <div style={{ marginTop: '10px' }}>
                                            <Chart options={state.options} series={state.series} type="bar" height={350} />
                                        </div>
                                    </div>

                                    <div style={{ backgroundColor: 'white', borderRadius: '15px', boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", marginTop: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px' }}>
                                            <div style={{ color: '#e32747', marginLeft: '20px', display: 'flex', alignItems: 'center', fontSize: '20px' }}>
                                                <HourglassTopIcon />
                                                <p style={{ fontWeight: 'bolder', margin: 0, marginLeft: '10px' }}>Queue Wait Time</p>
                                            </div>
                                            <button className="my-2" style={{ backgroundColor: '#e32747', color: 'white', borderRadius: '5px', border: 'none', padding: '5px', marginRight: '10px' }} onClick={() => {
                                                setchart_flag1(true)
                                            }}>Individual</button>
                                        </div>
                                        <div style={{ marginTop: '10px' }}>
                                            <Chart options={state1.options} series={state1.series} type="bar" height={350} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ width: '100%' }}>
                                <Row>
                                    {
                                        heat_map_image.map((val) => (

                                            <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                                <div style={{ padding: '5px' }}>
                                                    <img src={val} style={{ width: '100%', height: '100%' }}></img>
                                                </div>
                                            </Col>

                                        ))
                                    }
                                </Row>
                            </div>
                        </div>
                        : res_flag == 'no res' ?
                            <div style={{ width: '100%' }}>
                                <Row>

                                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: '80vh' }}>
                                            <CircularProgress />
                                            <p style={{ color: 'black', marginBottom: '5px' }}>Please wait...</p>
                                        </div>
                                        {/* <Skeleton style={{border:'1px solid grey'}} width='100%' height={500} /> */}
                                    </Col>
                                </Row>
                            </div>
                            :
                            <div style={{ width: '100%' }}>
                                <Row>

                                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: '80vh' }}>
                                            <p style={{ color: '#e32747', marginBottom: '5px' }}>No Data Found!</p>
                                        </div>
                                        {/* <Skeleton style={{border:'1px solid grey'}} width='100%' height={500} /> */}
                                    </Col>
                                </Row>
                            </div>
                }
            </div>
        </div >
    )
}
