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
import MovingIcon from '@mui/icons-material/Moving';
import './people_style.css'

let color_code_ind = 1
let induval_cam1 = []
export default function Foot_Foll_count({ time_chk }) {
    color_code_ind = 1
    const { page, startdate, starttime, enddate, endtime, apply, select, selected_cameras, socket } = useSelector((state) => state)

    const [chart_data, setchart_data] = useState([])
    const [chart_field, setchart_field] = useState([])
    const [chart_bar, setchart_bar] = useState([])
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
    const [res_flag, setres_flag] = useState('no res')
    const [overall_count, setoverall_count] = useState({})
    const [color_code, setcolor_code] = useState([{ first: "#3353C6", second: "#708FFE" }, { first: "#009887", second: "#21E5CF" }, { first: "#80C7F6", second: "#005DB0" }, { first: "#A993FF", second: "#7A5AF8" }])

    let [age_data, setage_data] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    useEffect(() => {
        getdata(time_chk)
    }, [apply, selected_cameras, time_chk])

    useEffect(() => {
        try {
            socket.on('new live', function (a) {
                console.log(JSON.parse(a))
                induval_cam1.map((val, i) => {
                    if (val.id == JSON.parse(a).region_id) {
                        induval_cam1[i] = { ...induval_cam1[i], live_count: JSON.parse(a).count }
                    }
                })
                setinduval_cam(induval_cam1)
            })
        } catch (e) {
            console.log(e);
        }
    }, [])

    const chart_model = () => {
        setchart_flag(false)
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
            'total_count': 0,
            'dwell': 0
        }

        let male = 0
        let female = 0
        let traditional = 0
        let modern = 0

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
                            // { name: 'Male', data: [] }, 
                            // { name: 'Female', data: [] },
                            { name: 'Total', data: [] }
                        ],
                        'category': [],
                        'age_data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        'inside_count': 0,
                        'outside_count': 0,
                        'male_count': 0,
                        'female_count': 0,
                        'total_count': 0,
                        'live_count': response.data.live_occupenct_count,
                        'dwell': response.data.dwell,
                        'id': val.id
                    })

                    console.log(count_data)

                    Object.keys(count_data).forEach((val) => {
                        induval_data[induval_data.length - 1].category.push(val)
                        induval_data[induval_data.length - 1].combain_data[0].data.push(count_data[val].inside)
                        induval_data[induval_data.length - 1].combain_data[1].data.push(count_data[val].outside)
                        // induval_data[induval_data.length - 1].combain_data[2].data.push(count_data[val].male)
                        // induval_data[induval_data.length - 1].combain_data[3].data.push(count_data[val].female)
                        induval_data[induval_data.length - 1].combain_data[2].data.push(count_data[val].inside + count_data[val].outside)
                        // induval_data[induval_data.length - 1].combain_data[2].data.push(count_data[val].inside + count_data[val].outside + count_data[val].male + count_data[val].female)

                        male = male + count_data[val].male
                        female = female + count_data[val].female
                        traditional = traditional + count_data[val].traditional
                        modern = modern + count_data[val].modern

                        if (count_data[val].object.person != undefined) {
                            if (count_data[val].object.person['0-5'] != undefined) {
                                induval_data[induval_data.length - 1].age_data[0] = induval_data[induval_data.length - 1].age_data[0] + count_data[val].object.person['0-5']
                                induval_data[induval_data.length - 1].age_data[1] = induval_data[induval_data.length - 1].age_data[1] + count_data[val].object.person['6-10']
                                induval_data[induval_data.length - 1].age_data[2] = induval_data[induval_data.length - 1].age_data[2] + count_data[val].object.person['11-15']
                                induval_data[induval_data.length - 1].age_data[3] = induval_data[induval_data.length - 1].age_data[3] + count_data[val].object.person['16-20']
                                induval_data[induval_data.length - 1].age_data[4] = induval_data[induval_data.length - 1].age_data[4] + count_data[val].object.person['21-25']
                                induval_data[induval_data.length - 1].age_data[5] = induval_data[induval_data.length - 1].age_data[5] + count_data[val].object.person['26-30']
                                induval_data[induval_data.length - 1].age_data[6] = induval_data[induval_data.length - 1].age_data[6] + count_data[val].object.person['31-35']
                                induval_data[induval_data.length - 1].age_data[7] = induval_data[induval_data.length - 1].age_data[7] + count_data[val].object.person['36-40']
                                induval_data[induval_data.length - 1].age_data[8] = induval_data[induval_data.length - 1].age_data[8] + count_data[val].object.person['41-45']
                                induval_data[induval_data.length - 1].age_data[9] = induval_data[induval_data.length - 1].age_data[9] + count_data[val].object.person['46-50']
                                induval_data[induval_data.length - 1].age_data[10] = induval_data[induval_data.length - 1].age_data[10] + count_data[val].object.person['51-55']
                                induval_data[induval_data.length - 1].age_data[11] = induval_data[induval_data.length - 1].age_data[11] + count_data[val].object.person['56-60']
                                induval_data[induval_data.length - 1].age_data[12] = induval_data[induval_data.length - 1].age_data[12] + count_data[val].object.person['61-65']
                                induval_data[induval_data.length - 1].age_data[13] = induval_data[induval_data.length - 1].age_data[13] + count_data[val].object.person['66-70']
                                induval_data[induval_data.length - 1].age_data[14] = induval_data[induval_data.length - 1].age_data[14] + count_data[val].object.person['71-75']
                                induval_data[induval_data.length - 1].age_data[15] = induval_data[induval_data.length - 1].age_data[15] + count_data[val].object.person['76-80']
                                induval_data[induval_data.length - 1].age_data[16] = induval_data[induval_data.length - 1].age_data[16] + count_data[val].object.person['81-85']
                                induval_data[induval_data.length - 1].age_data[17] = induval_data[induval_data.length - 1].age_data[17] + count_data[val].object.person['86-90']


                                age_data[0] = age_data[0] + count_data[val].object.person['0-5']
                                age_data[1] = age_data[1] + count_data[val].object.person['6-10']
                                age_data[2] = age_data[2] + count_data[val].object.person['11-15']
                                age_data[3] = age_data[3] + count_data[val].object.person['16-20']
                                age_data[4] = age_data[4] + count_data[val].object.person['21-25']
                                age_data[5] = age_data[5] + count_data[val].object.person['26-30']
                                age_data[6] = age_data[6] + count_data[val].object.person['31-35']
                                age_data[7] = age_data[7] + count_data[val].object.person['36-40']
                                age_data[8] = age_data[8] + count_data[val].object.person['41-45']
                                age_data[9] = age_data[9] + count_data[val].object.person['46-50']
                                age_data[10] = age_data[10] + count_data[val].object.person['51-55']
                                age_data[11] = age_data[11] + count_data[val].object.person['56-60']
                                age_data[12] = age_data[12] + count_data[val].object.person['61-65']
                                age_data[13] = age_data[13] + count_data[val].object.person['66-70']
                                age_data[14] = age_data[14] + count_data[val].object.person['71-75']
                                age_data[15] = age_data[15] + count_data[val].object.person['76-80']
                                age_data[16] = age_data[16] + count_data[val].object.person['81-85']
                                age_data[17] = age_data[17] + count_data[val].object.person['86-90']
                            }
                        }
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
                            // induval_data[induval_data.length - 1].inside_count = induval_data[induval_data.length - 1].male_count + total
                        } else if (val.name == 'Female') {
                            // induval_data[induval_data.length - 1].inside_count = induval_data[induval_data.length - 1].female_count + total
                        } else if (val.name == 'Total') {
                            induval_data[induval_data.length - 1].total_count = induval_data[induval_data.length - 1].total_count + total
                        }
                    })




                    heat_map_url = [...heat_map_url, ...response.data.heat_map]

                    if (val.main_type == 'true') {
                        if (Object.keys(data).length !== 0) {
                            Object.keys(count_data).forEach((key) => {
                                console.log(key);
                                console.log(data[key]);
                                data[key] = { 'inside': data[key].inside + count_data[key].inside, 'outside': data[key].outside + count_data[key].outside }

                                // data[key] = { 'inside': data[key].inside + count_data[key].inside, 'outside': data[key].outside + count_data[key].outside, 'male': data[key].male + count_data[key].male, 'female': data[key].female + count_data[key].female, }
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
                            { name: 'Visitor Inside', data: [] },
                            // { name: "Visitor Outside", data: [] },
                            // { name: 'Male', data: [] }, 
                            // { name: 'Female', data: [] }, 
                            // { name: 'Total', data: [] }
                        ]
                        let category = []

                        Object.keys(data).forEach((val) => {
                            category.push(val)
                            combain_data[0].data.push(data[val].inside)
                            // combain_data[1].data.push(data[val].outside)
                            // combain_data[2].data.push(data[val].male)
                            // combain_data[3].data.push(data[val].female)
                            // combain_data[2].data.push(data[val].inside + data[val].outside)
                            // combain_data[2].data.push(data[val].inside + data[val].outside + data[val].male + data[val].female)
                        })

                        console.log(category);
                        console.log(data);

                        combain_data.map((val) => {
                            let total = 0
                            val.data.map((value) => {
                                total = total + value
                            })

                            if (val.name == 'Visitor Inside') {
                                settotal_inside(total_inside + total)
                            } else if (val.name == 'Visitor Outside') {
                                settotal_outside(total_outside + total)
                            } else if (val.name == 'Male') {
                                // settotal_male(total_male + total)
                            } else if (val.name == 'Female') {
                                // settotal_female(total_female + total)
                            } else if (val.name == 'Total') {
                                settotal_foot_fall(total_foot_fall + total)
                            }
                        })
                        console.log(category);
                        console.log(combain_data);
                        console.log(heat_map_url);
                        console.log(induval_data);

                        induval_cam1 = induval_data
                        setoverall_count(overall_data)
                        setheat_map_image(heat_map_url)
                        setchart_bar(combain_data)
                        setchart_field(category)
                        setchart_data(data)
                        setinduval_cam(induval_data)
                        setres_flag('res')
                        settotal_male(male)
                        settotal_female(female)
                        settotal_traditional(traditional)
                        settotal_modern(modern)
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
                type: 'gradient', // Enable gradient fill
                gradient: {
                    type: 'vertical', // Apply gradient from top to bottom
                    shadeIntensity: 1,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100], // Gradient stops
                    colorStops: [
                        {
                            offset: 0,
                            color: '#00586B',
                            opacity: 1
                        },
                        {
                            offset: 100,
                            color: '#58E1E7',
                            opacity: 1
                        }
                    ]
                }
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val
                    }
                }
            }
        }
    };



    const age = {
        series: [{
            data: age_data
        }],
        options: {
            chart: {
                type: 'bar',
                height: 800,
            },
            plotOptions: {
                bar: {
                    borderRadius: 2,
                    borderRadiusApplication: 'end',
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: ["0-5", "6-10", "11-15", "16-20", "21-25", "26-30",
                    "31-35", "36-40", "41-45", "46-50", "51-55", "56-60",
                    "61-65", "66-70", "71-75", "76-80", "81-85", "86-90"],
            },
            colors: ['#002D4B']
        },
    };

    const gender = {
        series: total_male == 0 && total_female == 0 ? [100] : [total_male, total_female],
        options: {
            chart: {
                width: 380,
                type: 'donut',
            },
            labels: total_male == 0 && total_female == 0 ? ['Empty'] : ['Male', 'Female'],
            plotOptions: {
                donut: {
                    size: '70%',  // Adjust the size of the donut hole if needed
                    // Apply gradient colors
                    customScale: 1,  // Scale to adjust donut size, optional
                    dataLabels: {
                        // Disable data labels
                        enabled: false
                    }
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',  // Light or dark shading
                    shadeIntensity: 0.5,
                    gradientToColors: total_male == 0 && total_female == 0 ? ['#f4f4f4'] : ['#D36CEE', '#005DB0'],  // Colors for gradient effect
                    inverseColors: false,
                    opacityFrom: 0.5,
                    opacityTo: 1,
                    stops: [0, 100]  // Gradient stop points
                }
            },
            colors: total_male == 0 && total_female == 0 ? ['#f4f4f4'] : ['#9465F9', '#CBE5F6'],
            legend: {
                show: false,
                position: 'bottom',
                horizontalAlign: 'center', // Centers the legend horizontally
                itemMargin: {
                    horizontal: 5, // Adjusts horizontal spacing between legend items
                    vertical: 0  // Adjusts vertical spacing between legend items
                }
            },
            tooltip: {
                enabled: false  // Disable the tooltip
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        show: false,
                        position: 'bottom',
                        horizontalAlign: 'center'
                    }
                }
            }]
        },
    };

    const dress_type = {
        series: total_traditional == 0 && total_modern == 0 ? [100] : [total_traditional, total_modern],
        options: {
            chart: {
                width: 380,
                type: 'donut',
            },
            labels: total_traditional == 0 && total_modern == 0 ? ['Empty'] : ['Traditional', 'Modern'],
            plotOptions: {
                donut: {
                    size: '70%',  // Adjust the size of the donut hole if needed
                    // Apply gradient colors
                    customScale: 1,  // Scale to adjust donut size, optional
                    dataLabels: {
                        // Disable data labels
                        enabled: false
                    }
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',  // Light or dark shading
                    shadeIntensity: 0.5,
                    gradientToColors: total_traditional == 0 && total_modern == 0 ? ['#f4f4f4'] : ['#012E31', '#9053C0'],  // Colors for gradient effect
                    inverseColors: false,
                    opacityFrom: 0.5,
                    opacityTo: 1,
                    stops: [0, 100]  // Gradient stop points
                }
            },
            colors: total_traditional == 0 && total_modern == 0 ? ['#f4f4f4'] : ['#016F60', '#602C87'],
            legend: {
                show: false,
                position: 'bottom',
                horizontalAlign: 'center', // Centers the legend horizontally
                itemMargin: {
                    horizontal: 5, // Adjusts horizontal spacing between legend items
                    vertical: 0  // Adjusts vertical spacing between legend items
                }
            },
            tooltip: {
                enabled: false  // Disable the tooltip
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        show: false,
                        position: 'bottom',
                        horizontalAlign: 'center'
                    }
                }
            }]
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

                                                            {/* <div style={{ display: 'flex' }}>
                                                                <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Total Footfall</p>
                                                                <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.total_count}</p>
                                                            </div> */}
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
                                    <div style={{ background: `linear-gradient(${color_code[0].first}, ${color_code[0].second})`, borderRadius: '15px', padding: '10px', display: 'inline-block', width: '250px', color: 'black', marginRight: '10px', marginBottom: '10px', boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                            <div className='scrollable-div' style={{ width: '230px', overflowX: 'scroll', marginBottom: '8px' }}>
                                                <p style={{ fontWeight: 'bold', color: 'white', fontSize: '18px', whiteSpace: 'nowrap', margin: 0, marginBottom: '4px' }}>Overall</p>
                                            </div>
                                            <div style={{ borderRadius: '20px', background: `linear-gradient(${color_code[0].first}, ${color_code[0].second})`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '3px', paddingBottom: '3px', color: 'white' }}>
                                                <MovingIcon style={{ fontSize: '20px' }} />
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                                            <div style={{ borderRadius: '5px', background: `linear-gradient(${color_code[0].first}, ${color_code[0].second})`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '5px', paddingBottom: '5px' }}>
                                                <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>{(overall_count.inside_count - overall_count.outside_count) > 0 ? (overall_count.inside_count - overall_count.outside_count) : 0}</p>
                                            </div>
                                            <p style={{ fontWeight: 'bold', margin: 0, color: 'white', }}>-0.03%</p>
                                        </div>

                                        <div style={{ display: 'flex', }}>
                                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '30%' }}>
                                                <p style={{ fontWeight: 'bold', margin: 0, color: 'white', marginRight: '5px' }}>IN</p>
                                                <div style={{ borderRadius: '15px', background: `linear-gradient(${color_code[0].first}, ${color_code[0].second})`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '5px', paddingBottom: '5px' }}>
                                                    <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>{overall_count.inside_count > 0 ? overall_count.inside_count : 0}</p>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <p style={{ fontWeight: 'bold', margin: 0, color: 'white', marginRight: '5px' }}>OUT</p>
                                                <div style={{ borderRadius: '15px', background: `linear-gradient(${color_code[0].first}, ${color_code[0].second})`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '5px', paddingBottom: '5px' }}>
                                                    <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>{overall_count.outside_count > 0 ? overall_count.outside_count : 0}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* <p style={{ fontWeight: 'bold', color: '#e32747', fontSize: '18px' }}>Overall :-</p>
                                        <div style={{ display: 'flex' }}>
                                            <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Visitor Inside</p>
                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{overall_count.inside_count}</p>
                                        </div>

                                        <div style={{ display: 'flex' }}>
                                            <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Visitor Outside</p>
                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{overall_count.outside_count}</p>
                                        </div> */}

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

                                        {/* <div style={{ display: 'flex' }}>
                                            <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Dwell Time</p>
                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{parseFloat(overall_count.dwell.toFixed(1))}</p>
                                        </div> */}
                                    </div>
                                </div>

                                {
                                    induval_cam.map((val) => {
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

                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                                                        <div style={{ borderRadius: '5px', background: `linear-gradient(${color_code[color_code_ind - 1].first}, ${color_code[color_code_ind - 1].second})`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '5px', paddingBottom: '5px' }}>
                                                            <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>{val.live_count}</p>
                                                        </div>
                                                        <p style={{ fontWeight: 'bold', margin: 0, color: 'white', }}>-0.03%</p>
                                                    </div>

                                                    <div style={{ display: 'flex', }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '30%' }}>
                                                            <p style={{ fontWeight: 'bold', margin: 0, color: 'white', marginRight: '5px' }}>IN</p>
                                                            <div style={{ borderRadius: '15px', background: `linear-gradient(${color_code[color_code_ind - 1].first}, ${color_code[color_code_ind - 1].second})`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '5px', paddingBottom: '5px' }}>
                                                                <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>{val.inside_count}</p>
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <p style={{ fontWeight: 'bold', margin: 0, color: 'white', marginRight: '5px' }}>OUT</p>
                                                            <div style={{ borderRadius: '15px', background: `linear-gradient(${color_code[color_code_ind - 1].first}, ${color_code[color_code_ind - 1].second})`, boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", padding: '10px', paddingTop: '5px', paddingBottom: '5px' }}>
                                                                <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>{val.outside_count}</p>
                                                            </div>
                                                        </div>
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

                                                    {/* <div style={{ display: 'flex' }}>
                                                    <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Dwell Time</p>
                                                    <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{parseFloat(val.dwell.toFixed(1))}</p>
                                                </div> */}

                                                    {/* <div style={{ display: 'flex' }}>
                                                        <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Live Occupancy</p>
                                                        <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.live_count}</p>
                                                    </div> */}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <div>
                                <div>
                                    <div style={{ backgroundColor: 'white', borderRadius: '15px', boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <button className="my-2" style={{ backgroundColor: '#e32747', color: 'white', borderRadius: '5px', border: 'none', padding: '5px', marginRight: '10px' }} onClick={() => {
                                                setchart_flag(true)
                                            }}>Individual</button>
                                        </div>
                                        <div style={{ marginTop: '10px' }}>
                                            <Chart options={state.options} series={state.series} type="bar" height={350} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', width: '100%', marginTop: '10px', marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', width: '100%' }}>
                                            <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '10px', marginBottom: '5px', boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", position: 'relative', marginRight: '5px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', left: '140px', top: '140px' }}>
                                                    <p style={{ color: 'black', fontSize: '30px', margin: 0 }}>100%</p>
                                                    <p style={{ color: 'grey', fontSize: '15px' }}>Date</p>
                                                </div>
                                                <p style={{ color: '#e32747', fontWeight: 'bolder', marginLeft: '10px', marginTop: '10px' }}>Gender Chart</p>
                                                <Chart options={gender.options} series={gender.series} type="donut" width={320} />
                                                {
                                                    total_male == 0 && total_female == 0 ?
                                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                                                            <div style={{ display: 'flex', marginRight: '20px', alignItems: 'center' }}>
                                                                <div style={{ width: '15px', height: '15px', backgroundColor: '#f4f4f4', borderRadius: '50%' }}></div>
                                                                <p style={{ color: 'grey', margin: 0, marginLeft: '10px', }}>Empty</p>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
                                                            <div style={{ display: 'flex', marginRight: '20px', alignItems: 'center', marginBottom: '5px' }}>
                                                                <div style={{ width: '15px', height: '15px', backgroundColor: '#D36CEE', borderRadius: '50%' }}></div>
                                                                <p style={{ color: 'black', margin: 0, marginLeft: '10px', }}>Male - {Math.round(((total_male / (total_male + total_female)) * 100) * 10) / 10}%</p>
                                                            </div>

                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <div style={{ width: '15px', height: '15px', backgroundColor: '#005DB0', borderRadius: '50%' }}></div>
                                                                <p style={{ color: 'black', margin: 0, marginLeft: '10px', }}>Female - {Math.round(((total_female / (total_male + total_female)) * 100) * 10) / 10}%</p>
                                                            </div>
                                                        </div>

                                                }
                                            </div>

                                            <div style={{ backgroundColor: 'white', borderRadius: '15px', boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", width: '100%', marginRight: '5px', flexGrow: 1 }}>
                                                <p style={{ color: '#e32747', fontWeight: 'bolder', marginLeft: '10px', marginTop: '10px' }}>Age Chart</p>
                                                <Chart options={age.options} series={age.series} type="bar" height={450} />
                                            </div>

                                            <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '10px', boxShadow: " rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", position: 'relative' }}>
                                                <p style={{ color: '#e32747', fontWeight: 'bolder', marginLeft: '10px', marginTop: '10px' }}>Cloth Chart</p>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', left: '140px', top: '140px' }}>
                                                    <p style={{ color: 'black', fontSize: '30px', margin: 0 }}>100%</p>
                                                    <p style={{ color: 'grey', fontSize: '15px' }}>Date</p>
                                                </div>
                                                <Chart options={dress_type.options} series={dress_type.series} type="donut" width={320} />

                                                {
                                                    total_traditional == 0 && total_modern == 0 ?
                                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                                                            <div style={{ display: 'flex', marginRight: '20px', alignItems: 'center' }}>
                                                                <div style={{ width: '15px', height: '15px', backgroundColor: '#f4f4f4', borderRadius: '50%' }}></div>
                                                                <p style={{ color: 'grey', margin: 0, marginLeft: '10px', }}>Empty</p>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
                                                            <div style={{ display: 'flex', marginRight: '20px', alignItems: 'center', marginBottom: '5px' }}>
                                                                <div style={{ width: '15px', height: '15px', backgroundColor: '#016F60', borderRadius: '50%' }}></div>
                                                                <p style={{ color: 'black', margin: 0, marginLeft: '10px', }}>Traditional - {Math.round(((total_traditional / (total_traditional + total_modern)) * 100) * 10) / 10}%</p>
                                                            </div>

                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <div style={{ width: '15px', height: '15px', backgroundColor: '#602C87', borderRadius: '50%' }}></div>
                                                                <p style={{ color: 'black', margin: 0, marginLeft: '10px', }}>Modern - {Math.round(((total_modern / (total_traditional + total_modern)) * 100) * 10) / 10}%</p>
                                                            </div>
                                                        </div>
                                                }
                                            </div>
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
