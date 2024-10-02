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
import test_img from './WhatsApp Image 2024-06-03 at 6.13.44 PM.jpeg'
import Skeleton from 'react-loading-skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import './people_style.css'

export default function Foot_Foll_count({ time_chk }) {
    const { page, startdate, starttime, enddate, endtime, apply, select, selected_cameras } = useSelector((state) => state)

    const [chart_data, setchart_data] = useState([])
    const [chart_field, setchart_field] = useState([])
    const [gender_chart_field, setgender_chart_field] = useState([])
    const [chart_bar, setchart_bar] = useState([])
    const [gender_chart_bar, setgender_chart_bar] = useState([])
    const [total_foot_fall, settotal_foot_fall] = useState(0)
    const [total_inside, settotal_inside] = useState(0)
    const [total_outside, settotal_outside] = useState(0)
    const [total_male, settotal_male] = useState(0)
    const [total_female, settotal_female] = useState(0)
    const [heat_map_image, setheat_map_image] = useState([])
    const [induval_cam, setinduval_cam] = useState([])
    const [gender_induval_cam, setgender_induval_cam] = useState([])
    const [chart_flag, setchart_flag] = useState(false)
    const [gender_chart_flag, setgender_chart_flag] = useState(false)
    const [res_flag, setres_flag] = useState('no res')
    const [overall_count, setoverall_count] = useState({})
    useEffect(() => {
        getdata(time_chk)
    }, [apply, selected_cameras, time_chk])

    const chart_model = () => {
        setchart_flag(false)
    }

    const gender_chart_model = () => {
        setgender_chart_flag(false)
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
        let heat_map_url = []

        let overall_data = {
            'inside_count': 0,
            'outside_count': 0,
            'male_count': 0,
            'female_count': 0,
            'total_count': 0,
            'total_people': 0,
            'dwell': 0
        }

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
                url: api.LIST_ANALYTICS_COUNT_CAMERA_ID,
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
                    induval_data.push({
                        'camera_name': val.name,
                        'combain_data': [
                            { name: 'Visitor Inside', data: [] },
                            { name: "Visitor Outside", data: [] },
                            { name: 'Male', data: [] },
                            { name: 'Female', data: [] },
                            { name: 'Total', data: [] },
                            { name: 'People Total', data: [] },
                        ],
                        'category': [],
                        'inside_count': 0,
                        'outside_count': 0,
                        'male_count': 0,
                        'female_count': 0,
                        'total_count': 0,
                        'total_people': 0,
                        'dwell': response.data.dwell
                    })

                    console.log(count_data)

                    Object.keys(count_data).forEach((val) => {
                        induval_data[induval_data.length - 1].category.push(val)
                        induval_data[induval_data.length - 1].combain_data[0].data.push(count_data[val].inside)
                        induval_data[induval_data.length - 1].combain_data[1].data.push(count_data[val].outside)
                        induval_data[induval_data.length - 1].combain_data[2].data.push(count_data[val].male)
                        induval_data[induval_data.length - 1].combain_data[3].data.push(count_data[val].female)
                        induval_data[induval_data.length - 1].combain_data[4].data.push(count_data[val].inside + count_data[val].outside)
                        induval_data[induval_data.length - 1].combain_data[5].data.push(count_data[val].male + count_data[val].female)
                        // induval_data[induval_data.length - 1].combain_data[2].data.push(count_data[val].inside + count_data[val].outside + count_data[val].male + count_data[val].female)
                    })

                    induval_data[induval_data.length - 1].combain_data.map((val) => {
                        let total = 0
                        val.data.map((value) => {
                            total = total + value
                        })

                        if (val.name == 'Visitor Inside') {
                            induval_data[induval_data.length - 1].inside_count = induval_data[induval_data.length - 1].inside_count + total
                        } else if (val.name == 'Visitor Outside') {
                            induval_data[induval_data.length - 1].outside_count = induval_data[induval_data.length - 1].outside_count + total
                        } else if (val.name == 'Male') {
                            induval_data[induval_data.length - 1].male_count = induval_data[induval_data.length - 1].male_count + total
                        } else if (val.name == 'Female') {
                            induval_data[induval_data.length - 1].female_count = induval_data[induval_data.length - 1].female_count + total
                        } else if (val.name == 'Total') {
                            induval_data[induval_data.length - 1].total_count = induval_data[induval_data.length - 1].total_count + total
                        } else if (val.name == 'People Total') {
                            induval_data[induval_data.length - 1].total_people = induval_data[induval_data.length - 1].total_people + total
                        }
                    })




                    heat_map_url = [...heat_map_url, ...response.data.heat_map]

                    if (val.main_type == 'true') {
                        if (Object.keys(data).length !== 0) {
                            Object.keys(count_data).forEach((key) => {
                                console.log(key);
                                console.log(data[key]);
                                // data[key] = { 'inside': data[key].inside + count_data[key].inside, 'outside': data[key].outside + count_data[key].outside }

                                data[key] = { 'inside': data[key].inside + count_data[key].inside, 'outside': data[key].outside + count_data[key].outside, 'male': data[key].male + count_data[key].male, 'female': data[key].female + count_data[key].female, }
                            })
                        } else {
                            data = count_data
                        }
                    }
                    count = count + 1

                    if (val.main_type == 'true') {
                        if (val.overall_count == 'In') {
                            overall_data.inside_count = overall_data.inside_count + (induval_data[induval_data.length - 1].inside_count + induval_data[induval_data.length - 1].outside_count)

                            overall_data.total_count = overall_data.total_count + (induval_data[induval_data.length - 1].inside_count + induval_data[induval_data.length - 1].outside_count)

                            overall_data.dwell = overall_data.dwell + induval_data[induval_data.length - 1].dwell
                        } else if (val.overall_count == 'Out') {
                            overall_data.outside_count = overall_data.outside_count + (induval_data[induval_data.length - 1].outside_count + induval_data[induval_data.length - 1].inside_count)

                            overall_data.total_count = overall_data.total_count + (induval_data[induval_data.length - 1].outside_count + induval_data[induval_data.length - 1].inside_count)

                            overall_data.dwell = overall_data.dwell + induval_data[induval_data.length - 1].dwell
                        } else {
                            overall_data.inside_count = overall_data.inside_count + induval_data[induval_data.length - 1].inside_count
                            overall_data.total_count = overall_data.total_count + induval_data[induval_data.length - 1].inside_count
                            overall_data.outside_count = overall_data.outside_count + induval_data[induval_data.length - 1].outside_count
                            overall_data.total_count = overall_data.total_count + induval_data[induval_data.length - 1].outside_count

                            overall_data.dwell = overall_data.dwell + induval_data[induval_data.length - 1].dwell
                        }
                    }

                    console.log(val.main_type);
                    console.log(val.overall_count);

                    if (count == region.length) {
                        let combain_data = [
                            { name: 'Visitor Inside', data: [] }, { name: "Visitor Outside", data: [] },
                            { name: 'Male', data: [] },
                            { name: 'Female', data: [] },
                            { name: 'Total', data: [] }
                        ]
                        let category = []

                        let gender_combain_data = [
                            { name: 'Male', data: [] }, { name: "Female", data: [] },
                            { name: 'Total', data: [] }
                        ]
                        let gender_category = []

                        Object.keys(data).forEach((val) => {
                            category.push(val)
                            gender_category.push(val)
                            combain_data[0].data.push(data[val].inside)
                            combain_data[1].data.push(data[val].outside)
                            gender_combain_data[0].data.push(data[val].male)
                            gender_combain_data[1].data.push(data[val].female)
                            combain_data[4].data.push(data[val].inside + data[val].outside)
                            gender_combain_data[2].data.push(data[val].male + data[val].female)
                            // combain_data[2].data.push(data[val].inside + data[val].outside + data[val].male + data[val].female)
                        })

                        console.log(category);
                        console.log(data);

                        combain_data.map((val) => {
                            let total = 0
                            if (val.name == 'Male') {
                                gender_combain_data[0].data.map((value) => {
                                    total = total + value
                                })
                            } else if (val.name == 'Female') {
                                gender_combain_data[1].data.map((value) => {
                                    total = total + value
                                })
                            } else {
                                val.data.map((value) => {
                                    total = total + value
                                })
                            }

                            if (val.name == 'Visitor Inside') {
                                settotal_inside(total_inside + total)
                            } else if (val.name == 'Visitor Outside') {
                                settotal_outside(total_outside + total)
                            } else if (val.name == 'Male') {
                                settotal_male(total_male + total)
                            } else if (val.name == 'Female') {
                                settotal_female(total_female + total)
                            } else if (val.name == 'Total') {
                                settotal_foot_fall(total_foot_fall + total)
                            }
                        })
                        console.log(category);
                        console.log(combain_data);
                        console.log(heat_map_url);
                        console.log(induval_data);

                        let split_visitor = []
                        let split_gender = []

                        induval_data.map((val) => {
                            split_visitor.push({
                                'camera_name': val.camera_name,
                                'combain_data': [
                                    { name: 'Visitor Inside', data: val.combain_data[0].data },
                                    { name: "Visitor Outside", data: val.combain_data[1].data },
                                    { name: 'Total', data: val.combain_data[4].data },
                                ],
                                'category': val.category,
                                'inside_count': val.inside_count,
                                'outside_count': val.outside_count,
                                'total_count': val.total_count,
                                'dwell': val.dwell
                            })

                            split_gender.push({
                                'camera_name': val.camera_name,
                                'combain_data': [
                                    { name: 'Male', data: val.combain_data[2].data },
                                    { name: "Female", data: val.combain_data[3].data },
                                    { name: 'Total', data: val.combain_data[5].data },
                                ],
                                'category': val.category,
                                'inside_count': val.male_count,
                                'outside_count': val.female_count,
                                'total_count': val.total_people,
                                'dwell': val.dwell
                            })
                        })

                        setoverall_count(overall_data)
                        setheat_map_image(heat_map_url)
                        setchart_bar([{ name: 'Visitor Inside', data: combain_data[0].data }, { name: "Visitor Outside", data: combain_data[1].data }, { name: 'Total', data: combain_data[4].data }])
                        setgender_chart_bar(gender_combain_data)
                        setchart_field(category)
                        setgender_chart_field(gender_category)
                        setchart_data(data)
                        setinduval_cam(split_visitor)
                        setgender_induval_cam(split_gender)
                        setres_flag('res')
                        // setchart_fields(date_types)
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
                colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560'],
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
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
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val
                    }
                }
            }
        },


    };

    const gender_state = {
        series: gender_chart_bar,
        options: {
            chart: {
                type: 'bar',
                height: 350,
                colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560'],
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
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
                categories: gender_chart_field,
            },
            yaxis: {
                title: {
                    text: 'Gender Analytics'
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val
                    }
                }
            }
        },


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
                                            colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560'],
                                        },
                                        plotOptions: {
                                            bar: {
                                                horizontal: false,
                                                columnWidth: '55%',
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
                                            opacity: 1
                                        },
                                        tooltip: {
                                            y: {
                                                formatter: function (val) {
                                                    return val
                                                }
                                            }
                                        }
                                    },


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
                                                                <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Visitor Inside</p>
                                                                <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.inside_count}</p>
                                                            </div>

                                                            <div style={{ display: 'flex' }}>
                                                                <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Visitor Outside</p>
                                                                <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.outside_count}</p>
                                                            </div>

                                                            {/* <div style={{display:'flex'}}>
                                                                        <p style={{ fontWeight: 'bold',marginRight:'5px' }}>Male</p>
                                                                        <p style={{ color: '#e32747', fontWeight: 'bolder', fontSize: '20px' }}>{val.male_count}</p>
                                                                    </div>

                                                                    <div style={{display:'flex'}}>
                                                                        <p style={{ fontWeight: 'bold',marginRight:'5px' }}>Female</p>
                                                                        <p style={{ color: '#e32747', fontWeight: 'bolder', fontSize: '20px' }}>{val.female_count}</p>
                                                                    </div> */}

                                                            <div style={{ display: 'flex' }}>
                                                                <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Total</p>
                                                                <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.total_count}</p>
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
                open={gender_chart_flag}
                onClose={gender_chart_model}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ marginLeft: 'auto', marginRight: 'auto', top: '5%', width: '95%', }}
            >
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', height: '95%', overflowY: 'scroll' }}>
                    <Row style={{ padding: '0px', alignItems: 'center', }}>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                                <CloseIcon style={{ fontSize: '15px', color: 'red', cursor: 'pointer' }} onClick={() => {
                                    gender_chart_model()
                                }} />

                            </div>
                        </Col>


                        {
                            gender_induval_cam.map((val) => {
                                const object = {
                                    series: val.combain_data,
                                    options: {
                                        chart: {
                                            type: 'bar',
                                            height: 350,
                                            colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560'],
                                        },
                                        plotOptions: {
                                            bar: {
                                                horizontal: false,
                                                columnWidth: '55%',
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
                                            opacity: 1
                                        },
                                        tooltip: {
                                            y: {
                                                formatter: function (val) {
                                                    return val
                                                }
                                            }
                                        }
                                    },


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
                                                                <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Male</p>
                                                                <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.inside_count}</p>
                                                            </div>

                                                            <div style={{ display: 'flex' }}>
                                                                <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Female</p>
                                                                <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.outside_count}</p>
                                                            </div>

                                                            {/* <div style={{display:'flex'}}>
                                                                        <p style={{ fontWeight: 'bold',marginRight:'5px' }}>Male</p>
                                                                        <p style={{ color: '#e32747', fontWeight: 'bolder', fontSize: '20px' }}>{val.male_count}</p>
                                                                    </div>

                                                                    <div style={{display:'flex'}}>
                                                                        <p style={{ fontWeight: 'bold',marginRight:'5px' }}>Female</p>
                                                                        <p style={{ color: '#e32747', fontWeight: 'bolder', fontSize: '20px' }}>{val.female_count}</p>
                                                                    </div> */}

                                                            <div style={{ display: 'flex' }}>
                                                                <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Total</p>
                                                                <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.total_count}</p>
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

                            <div style={{ display: 'flex', overflowX: 'scroll', marginTop: '20px' }}>

                                <div>
                                    <div style={{ backgroundColor: 'white', borderRadius: '5px', padding: '10px', display: 'inline-block', width: '250px', color: 'black', marginRight: '10px', marginBottom: '10px' }}>
                                        <p style={{ fontWeight: 'bold', color: '#e32747', fontSize: '18px' }}>Overall :-</p>
                                        <div style={{ display: 'flex' }}>
                                            <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Visitor Inside</p>
                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{overall_count.inside_count}</p>
                                        </div>

                                        <div style={{ display: 'flex' }}>
                                            <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Visitor Outside</p>
                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{overall_count.outside_count}</p>
                                        </div>

                                        {/* <div style={{display:'flex'}}>
                                                        <p style={{ fontWeight: 'bold',marginRight:'5px' }}>Male</p>
                                                        <p style={{ color: '#e32747', fontWeight: 'bolder', fontSize: '20px' }}>{val.male_count}</p>
                                                            </div>

                                                    <div style={{display:'flex'}}>
                                                        <p style={{ fontWeight: 'bold',marginRight:'5px' }}>Female</p>
                                                        <p style={{ color: '#e32747', fontWeight: 'bolder', fontSize: '20px' }}>{val.female_count}</p>
                                                    </div> */}

                                        {/* <div style={{ display: 'flex' }}>
                                            <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Total Footfall</p>
                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{overall_count.total_count}</p>
                                        </div> */}

                                        <div style={{ display: 'flex' }}>
                                            <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Dwell Time</p>
                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{parseFloat(overall_count.dwell.toFixed(1))}</p>
                                        </div>
                                    </div>
                                </div>

                                {
                                    induval_cam.map((val) => (
                                        <div>
                                            <div style={{ backgroundColor: 'white', borderRadius: '5px', padding: '10px', display: 'inline-block', width: '250px', color: 'black', marginRight: '10px', marginBottom: '10px' }}>
                                                <div className='scrollable-div' style={{ width: '230px', overflowX: 'scroll', marginBottom: '8px' }}>
                                                    <p style={{ fontWeight: 'bold', color: '#e32747', fontSize: '18px', whiteSpace: 'nowrap', margin: 0, marginBottom: '4px' }}>{val.camera_name} ({val.type}) :-</p>
                                                </div>

                                                <div style={{ display: 'flex' }}>
                                                    <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Visitor Inside</p>
                                                    <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.inside_count}</p>
                                                </div>

                                                <div style={{ display: 'flex' }}>
                                                    <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Visitor Outside</p>
                                                    <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.outside_count}</p>
                                                </div>

                                                {/* <div style={{display:'flex'}}>
                                                        <p style={{ fontWeight: 'bold',marginRight:'5px' }}>Male</p>
                                                        <p style={{ color: '#e32747', fontWeight: 'bolder', fontSize: '20px' }}>{val.male_count}</p>
                                                            </div>

                                                    <div style={{display:'flex'}}>
                                                        <p style={{ fontWeight: 'bold',marginRight:'5px' }}>Female</p>
                                                        <p style={{ color: '#e32747', fontWeight: 'bolder', fontSize: '20px' }}>{val.female_count}</p>
                                                    </div> */}

                                                {/* <div style={{ display: 'flex' }}>
                                                    <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Total Footfall</p>
                                                    <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.total_count}</p>
                                                </div> */}

                                                <div style={{ display: 'flex' }}>
                                                    <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Dwell Time</p>
                                                    <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{parseFloat(val.dwell.toFixed(1))}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button className="my-2" style={{ backgroundColor: '#e32747', color: 'white', borderRadius: '5px', border: 'none', padding: '5px' }} onClick={() => {
                                        setchart_flag(true)
                                    }}>Individual</button>
                                </div>
                                <div style={{ marginTop: '10px' }}>
                                    <Chart options={state.options} series={state.series} type="bar" height={350} />
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button className="my-2" style={{ backgroundColor: '#e32747', color: 'white', borderRadius: '5px', border: 'none', padding: '5px' }} onClick={() => {
                                        setgender_chart_flag(true)
                                    }}>Individual</button>
                                </div>
                                <div style={{ marginTop: '10px' }}>
                                    <Chart options={gender_state.options} series={gender_state.series} type="bar" height={350} />
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
        </div>
    )
}
