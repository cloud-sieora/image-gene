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
import './vehicle_style.css'

export default function Foot_Foll_count({ time_chk }) {
    const { page, startdate, starttime, enddate, endtime, apply, select, selected_cameras } = useSelector((state) => state)

    const [chart_data, setchart_data] = useState([])
    const [chart_field, setchart_field] = useState([])
    const [chart_bar, setchart_bar] = useState([])
    const [total_foot_fall, settotal_foot_fall] = useState(0)
    const [total_inside, settotal_inside] = useState(0)
    const [total_outside, settotal_outside] = useState(0)
    const [total_male, settotal_male] = useState(0)
    const [total_female, settotal_female] = useState(0)
    const [total_car_inside, settotal_car_inside] = useState(0)
    const [total_car_outside, settotal_car_outside] = useState(0)
    const [total_truck_inside, settotal_truck_inside] = useState(0)
    const [total_truck_outside, settotal_truck_outside] = useState(0)
    const [total_motorcycle_inside, settotal_motorcycle_inside] = useState(0)
    const [total_motorcycle_outside, settotal_motorcycle_outside] = useState(0)
    const [total_bus_inside, settotal_bus_inside] = useState(0)
    const [total_bus_outside, settotal_bus_outside] = useState(0)
    const [heat_map_image, setheat_map_image] = useState([])
    const [induval_cam, setinduval_cam] = useState([])
    const [chart_flag, setchart_flag] = useState(false)
    const [res_flag, setres_flag] = useState('no res')
    const [overall_count, setoverall_count] = useState({})
    useEffect(() => {
        getdata(time_chk)
    }, [apply, selected_cameras, time_chk])

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
            if (moment(enddate, 'YYYY-MM-DD').isBefore(moment(chk_date2, 'YYYY-MM-DD')) || startdate == enddate) {
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
            } else {
                alert('select 7 days or lesser than 7 days')
                post_flag = false
            }

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

        let overall_data_full = {
            'vehicle_inside': 0,
            'vehicle_outside': 0,
            'car_inside': 0,
            'car_outside': 0,
            'truck_inside': 0,
            'truck_outside': 0,
            'motorcycle_inside': 0,
            'motorcycle_outside': 0,
            'bus_inside': 0,
            'bus_outside': 0,
            'total_count': 0,
        }

        let region = []
        selected_cameras.map((value) => {
            value.image_edited_vehicle.map((val) => {
                region.push({ name: val.name, id: val.id, vehicle_in_out: value.vehicle_in_out, main_type: value.main_type, overall_count: value.overall_count })
            })
        })

        if (region.length == 0 && selected_cameras.length != 0) {
            setres_flag('no data')
        }

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
                    'option': ['vehicle_inside', 'vehicle_outside'],
                    'flag': flag_type,
                    'flag_count_arr': date_types
                }
            }
            axios(getStocksData)
                .then(response => {
                    console.log(response.data);

                    let count_data = response.data.value
                    induval_data.push({
                        'camera_name': val.name,
                        'combain_data': [
                            // { name: 'Vehicle Inside', data: [] },
                            // { name: "Vehicle Outside", data: [] },
                            // { name: 'Male', data: [] }, 
                            // { name: 'Female', data: [] }, 
                            { name: 'Total', data: [] },
                            { name: 'Car Inside', data: [] },
                            { name: 'Car Outside', data: [] },
                            { name: 'Truck Inside', data: [] },
                            { name: 'Truck Outside', data: [] },
                            { name: 'Motorcycle Inside', data: [] },
                            { name: 'Motorcycle Outside', data: [] },
                            { name: 'Bus Inside', data: [] },
                            { name: 'Bus Outside', data: [] },
                        ],
                        'category': [],
                        'vehicle_inside_count': 0,
                        'vehicle_outside_count': 0,
                        'total_count': 0,
                        'car_inside_count': 0,
                        'car_outside_count': 0,
                        'truck_inside_count': 0,
                        'truck_outside_count': 0,
                        'motorcycle_inside_count': 0,
                        'motorcycle_outside_count': 0,
                        'bus_inside_count': 0,
                        'bus_outside_count': 0,
                        'type': val.vehicle_in_out
                    })

                    console.log(count_data)

                    Object.keys(count_data).forEach((val) => {
                        induval_data[induval_data.length - 1].category.push(val)
                        // induval_data[induval_data.length - 1].combain_data[0].data.push(count_data[val].vehicle_inside)
                        // induval_data[induval_data.length - 1].combain_data[1].data.push(count_data[val].vehicle_outside)
                        // induval_data[induval_data.length - 1].combain_data[2].data.push(count_data[val].male)
                        // induval_data[induval_data.length - 1].combain_data[3].data.push(count_data[val].female)
                        induval_data[induval_data.length - 1].combain_data[0].data.push(count_data[val].vehicle_inside + count_data[val].vehicle_outside)
                        // induval_data[induval_data.length - 1].combain_data[2].data.push(count_data[val].inside + count_data[val].outside + count_data[val].male + count_data[val].female)
                        induval_data[induval_data.length - 1].combain_data[1].data.push(count_data[val].object.car != undefined ? count_data[val].object.car.in : 0)

                        induval_data[induval_data.length - 1].combain_data[2].data.push(count_data[val].object.car != undefined ? count_data[val].object.car.out : 0)

                        induval_data[induval_data.length - 1].combain_data[3].data.push(count_data[val].object.truck != undefined ? count_data[val].object.truck.in : 0)

                        induval_data[induval_data.length - 1].combain_data[4].data.push(count_data[val].object.truck != undefined ? count_data[val].object.truck.out : 0)

                        induval_data[induval_data.length - 1].combain_data[5].data.push(count_data[val].object.motorbike != undefined ? count_data[val].object.motorbike.in : 0)

                        induval_data[induval_data.length - 1].combain_data[6].data.push(count_data[val].object.motorbike != undefined ? count_data[val].object.motorbike.out : 0)

                        induval_data[induval_data.length - 1].combain_data[7].data.push(count_data[val].object.bus != undefined ? count_data[val].object.bus.in : 0)

                        induval_data[induval_data.length - 1].combain_data[8].data.push(count_data[val].object.bus != undefined ? count_data[val].object.bus.out : 0)
                    })

                    induval_data[induval_data.length - 1].combain_data.map((val) => {
                        let total = 0
                        val.data.map((value) => {
                            total = total + value
                        })

                        // if (val.name == 'Vehicle Inside') {
                        //     induval_data[induval_data.length - 1].vehicle_inside_count = induval_data[induval_data.length - 1].vehicle_inside_count + total
                        // } else if (val.name == 'Vehicle Outside') {
                        //     induval_data[induval_data.length - 1].vehicle_outside_count = induval_data[induval_data.length - 1].vehicle_outside_count + total
                        // } else 
                        if (val.name == 'Total') {
                            induval_data[induval_data.length - 1].total_count = induval_data[induval_data.length - 1].total_count + total
                        } else if (val.name == 'Car Inside') {
                            induval_data[induval_data.length - 1].car_inside_count = induval_data[induval_data.length - 1].car_inside_count + total
                        } else if (val.name == 'Car Outside') {
                            induval_data[induval_data.length - 1].car_outside_count = induval_data[induval_data.length - 1].car_outside_count + total
                        } else if (val.name == 'Truck Inside') {
                            induval_data[induval_data.length - 1].truck_inside_count = induval_data[induval_data.length - 1].truck_inside_count + total
                        } else if (val.name == 'Truck Outside') {
                            induval_data[induval_data.length - 1].truck_outside_count = induval_data[induval_data.length - 1].truck_outside_count + total
                        } else if (val.name == 'Motorcycle Inside') {
                            induval_data[induval_data.length - 1].motorcycle_inside_count = induval_data[induval_data.length - 1].motorcycle_inside_count + total
                        } else if (val.name == 'Motorcycle Outside') {
                            induval_data[induval_data.length - 1].motorcycle_outside_count = induval_data[induval_data.length - 1].motorcycle_outside_count + total
                        } else if (val.name == 'Bus Inside') {
                            induval_data[induval_data.length - 1].bus_inside_count = induval_data[induval_data.length - 1].bus_inside_count + total
                        } else if (val.name == 'Bus Outside') {
                            induval_data[induval_data.length - 1].bus_outside_count = induval_data[induval_data.length - 1].bus_outside_count + total
                        }
                    })

                    console.log(induval_data);


                    heat_map_url = [...heat_map_url, ...response.data.heat_map]

                    if (val.main_type == 'true') {
                        if (Object.keys(data).length !== 0) {

                            Object.keys(count_data).forEach((key) => {
                                data[key] = { 'vehicle_inside': data[key].vehicle_inside + count_data[key].vehicle_inside, 'vehicle_outside': data[key].vehicle_outside + count_data[key].vehicle_outside, object: { 'car': { 'in': data[key].object.car != undefined ? data[key].object.car.in : 0 + (count_data[key].object.car != undefined ? count_data[key].object.car.in : 0), 'out': data[key].object.car != undefined ? data[key].object.car.out : 0 + (count_data[key].object.car != undefined ? count_data[key].object.car.out : 0) }, 'truck': { 'in': data[key].object.truck != undefined ? data[key].object.truck.in : 0 + (count_data[key].object.truck != undefined ? count_data[key].object.truck.in : 0), 'out': data[key].object.truck != undefined ? data[key].object.truck.out : 0 + (count_data[key].object.truck != undefined ? count_data[key].object.truck.out : 0) }, 'motorcycle': { 'in': data[key].object.motorcycle != undefined ? data[key].object.motorcycle.in : 0 + (count_data[key].object.motorcycle != undefined ? count_data[key].object.motorcycle.in : 0), 'out': data[key].object.motorcycle != undefined ? data[key].object.motorcycle.out : 0 + (count_data[key].object.motorcycle != undefined ? count_data[key].object.motorcycle.out : 0) }, 'bus': { 'in': data[key].object.bus != undefined ? data[key].object.bus : 0 + (count_data[key].object.bus != undefined ? count_data[key].object.bus.in : 0), 'out': data[key].object.bus != undefined ? data[key].object.bus.out : 0 + (count_data[key].object.bus != undefined ? count_data[key].object.bus.out : 0) }, } }

                                // data[key] = { 'inside': data[key].inside + count_data[key].inside, 'outside': data[key].outside + count_data[key].outside, 'male': data[key].male + count_data[key].male, 'female': data[key].female + count_data[key].female, }
                            })
                        } else {
                            data = count_data
                        }
                    }

                    count = count + 1

                    let overall_data = {
                        'vehicle_inside': 0,
                        'vehicle_outside': 0,
                        'car_inside': 0,
                        'car_outside': 0,
                        'truck_inside': 0,
                        'truck_outside': 0,
                        'motorcycle_inside': 0,
                        'motorcycle_outside': 0,
                        'bus_inside': 0,
                        'bus_outside': 0,
                        'total_count': 0,
                        object: []
                    }

                    if (val.main_type == 'true') {
                        if (val.vehicle_in_out == 'In') {
                            overall_data.vehicle_inside = overall_data.vehicle_inside + (induval_data[induval_data.length - 1].vehicle_inside_count + induval_data[induval_data.length - 1].vehicle_outside_count)

                            overall_data.total_count = overall_data.total_count + (induval_data[induval_data.length - 1].vehicle_inside_count + induval_data[induval_data.length - 1].vehicle_outside_count)

                            overall_data.car_inside = overall_data.car_inside + (induval_data[induval_data.length - 1].car_inside_count + induval_data[induval_data.length - 1].car_outside_count)
                            overall_data.truck_inside = overall_data.truck_inside + (induval_data[induval_data.length - 1].truck_inside_count + induval_data[induval_data.length - 1].truck_outside_count)
                            overall_data.motorcycle_inside = overall_data.motorcycle_inside + (induval_data[induval_data.length - 1].motorcycle_inside_count + induval_data[induval_data.length - 1].motorcycle_outside_count)
                            overall_data.bus_inside = overall_data.bus_inside + (induval_data[induval_data.length - 1].bus_inside_count + induval_data[induval_data.length - 1].bus_outside_count)


                        } else if (val.vehicle_in_out == 'Out') {
                            overall_data.vehicle_outside = overall_data.vehicle_outside + (induval_data[induval_data.length - 1].vehicle_outside_count + induval_data[induval_data.length - 1].vehicle_inside_count)

                            overall_data.total_count = overall_data.total_count_count + (induval_data[induval_data.length - 1].vehicle_outside_count + induval_data[induval_data.length - 1].vehicle_inside_count)

                            overall_data.car_outside = overall_data.car_outside + (induval_data[induval_data.length - 1].car_outside_count + induval_data[induval_data.length - 1].car_inside_count)
                            overall_data.truck_outside = overall_data.truck_outside + (induval_data[induval_data.length - 1].truck_outside_count + induval_data[induval_data.length - 1].truck_inside_count)
                            overall_data.motorcycle_outside = overall_data.motorcycle_outside + (induval_data[induval_data.length - 1].motorcycle_outside_count + induval_data[induval_data.length - 1].motorcycle_inside_count)
                            overall_data.bus_outside = overall_data.bus_outside + (induval_data[induval_data.length - 1].bus_outside_count + induval_data[induval_data.length - 1].bus_inside_count)
                        } else {
                            overall_data.vehicle_inside = overall_data.vehicle_inside + induval_data[induval_data.length - 1].vehicle_inside_count
                            overall_data.total_count = overall_data.total_count + induval_data[induval_data.length - 1].vehicle_inside_count
                            overall_data.vehicle_outside = overall_data.vehicle_outside + induval_data[induval_data.length - 1].vehicle_outside_count
                            overall_data.total_count = overall_data.total_count + induval_data[induval_data.length - 1].vehicle_outside_count

                            overall_data.car_inside = overall_data.car_inside + induval_data[induval_data.length - 1].car_inside_count
                            overall_data.car_outside = overall_data.car_outside + induval_data[induval_data.length - 1].car_outside_count
                            overall_data.truck_inside = overall_data.truck_inside + induval_data[induval_data.length - 1].truck_inside_count
                            overall_data.truck_outside = overall_data.truck_outside + induval_data[induval_data.length - 1].truck_outside_count
                            overall_data.motorcycle_inside = overall_data.motorcycle_inside + induval_data[induval_data.length - 1].motorcycle_inside_count
                            overall_data.motorcycle_outside = overall_data.motorcycle_outside + induval_data[induval_data.length - 1].motorcycle_outside_motorcycle
                            overall_data.bus_inside = overall_data.bus_inside + induval_data[induval_data.length - 1].bus_inside_count
                            overall_data.bus_outside = overall_data.bus_outside + induval_data[induval_data.length - 1].bus_outside_count
                        }

                        if (val.overall_count == 'In') {
                            overall_data_full.vehicle_inside = overall_data_full.vehicle_inside + overall_data.vehicle_inside
                            overall_data_full.total_count = overall_data_full.total_count + overall_data.vehicle_inside

                            overall_data_full.car_inside = overall_data_full.car_inside + overall_data.car_inside
                            overall_data_full.truck_inside = overall_data_full.truck_inside + overall_data.truck_inside
                            overall_data_full.motorcycle_inside = overall_data_full.motorcycle_inside + overall_data.motorcycle_inside
                            overall_data_full.bus_inside = overall_data_full.bus_inside + overall_data.bus_inside
                        }
                        else if (val.overall_count == 'Out') {
                            overall_data_full.vehicle_outside = overall_data_full.vehicle_outside + overall_data.vehicle_outside

                            overall_data_full.total_count = overall_data_full.total_count + overall_data.vehicle_outside

                            overall_data_full.car_outside = overall_data_full.car_outside + overall_data.car_outside
                            overall_data_full.truck_outside = overall_data_full.truck_outside + overall_data.truck_outside
                            overall_data_full.motorcycle_outside = overall_data_full.motorcycle_outside + overall_data.motorcycle_outside
                            overall_data_full.bus_outside = overall_data_full.bus_outside + overall_data.bus_outside
                        } else {
                            overall_data_full.vehicle_inside = overall_data_full.vehicle_inside + induval_data[induval_data.length - 1].vehicle_inside
                            overall_data_full.total_count = overall_data_full.total_count + induval_data[induval_data.length - 1].vehicle_inside
                            overall_data_full.vehicle_outside = overall_data_full.vehicle_outside + induval_data[induval_data.length - 1].vehicle_outside
                            overall_data_full.total_count = overall_data_full.total_count + induval_data[induval_data.length - 1].vehicle_outside

                            overall_data_full.car_inside = overall_data_full.car_inside + induval_data[induval_data.length - 1].car_inside
                            overall_data_full.car_outside = overall_data_full.car_outside + induval_data[induval_data.length - 1].car_outside
                            overall_data_full.truck_inside = overall_data_full.truck_inside + induval_data[induval_data.length - 1].truck_inside
                            overall_data_full.truck_outside = overall_data_full.truck_outside + induval_data[induval_data.length - 1].truck_outside
                            overall_data_full.motorcycle_inside = overall_data_full.motorcycle_inside + induval_data[induval_data.length - 1].motorcycle_inside
                            overall_data_full.motorcycle_outside = overall_data_full.motorcycle_outside + induval_data[induval_data.length - 1].motorcycle_outside
                            overall_data_full.bus_inside = overall_data_full.bus_inside + induval_data[induval_data.length - 1].bus_inside
                            overall_data_full.bus_outside = overall_data_full.bus_outside + induval_data[induval_data.length - 1].bus_outside
                        }
                    }

                    if (count == region.length) {
                        let combain_data = [
                            // { name: 'Vehicle Inside', data: [] },
                            // { name: "Vehicle Outside", data: [] },
                            // { name: 'Male', data: [] }, 
                            // { name: 'Female', data: [] }, 
                            { name: 'Total', data: [] },
                            { name: 'Car Inside', data: [] },
                            { name: 'Car Outside', data: [] },
                            { name: 'Truck Inside', data: [] },
                            { name: 'Truck Outside', data: [] },
                            { name: 'Motorcycle Inside', data: [] },
                            { name: 'Motorcycle Outside', data: [] },
                            { name: 'Bus Inside', data: [] },
                            { name: 'Bus Outside', data: [] },
                        ]
                        let category = []
                        console.log(data)
                        Object.keys(data).forEach((val) => {
                            console.log(data[val]);
                            category.push(val)
                            // combain_data[0].data.push(data[val].vehicle_inside)
                            // combain_data[1].data.push(data[val].vehicle_outside)
                            // combain_data[2].data.push(data[val].male)
                            // combain_data[3].data.push(data[val].female)
                            combain_data[0].data.push(data[val].vehicle_inside + data[val].vehicle_outside)
                            // combain_data[2].data.push(data[val].inside + data[val].outside + data[val].male + data[val].female)
                            combain_data[1].data.push(data[val].object.car != undefined ? data[val].object.car.in : 0)
                            combain_data[2].data.push(data[val].object.car != undefined ? data[val].object.car.out : 0)
                            combain_data[3].data.push(data[val].object.truck != undefined ? data[val].object.truck.in : 0)
                            combain_data[4].data.push(data[val].object.truck != undefined ? data[val].object.truck.out : 0)
                            combain_data[5].data.push(data[val].object.motorcycle != undefined ? data[val].object.motorcycle.in : 0)
                            combain_data[6].data.push(data[val].object.motorcycle != undefined ? data[val].object.motorcycle.out : 0)
                            combain_data[7].data.push(data[val].object.bus != undefined ? data[val].object.bus.in : 0)
                            combain_data[8].data.push(data[val].object.bus != undefined ? data[val].object.bus.out : 0)
                        })

                        combain_data.map((val) => {
                            let total = 0
                            val.data.map((value) => {
                                total = total + value
                            })

                            // if (val.name == 'Vehicle Inside') {
                            //     settotal_inside(total_inside + total)
                            // } else if (val.name == 'Vehicle Outside') {
                            //     settotal_outside(total_outside + total)
                            // } else 
                            if (val.name == 'Total') {
                                settotal_foot_fall(total_foot_fall + total)
                            } else if (val.name == 'Car Inside') {
                                settotal_car_inside(total_car_inside + total)
                            } else if (val.name == 'Car Outside') {
                                settotal_car_outside(total_car_outside + total)
                            } else if (val.name == 'Truck Inside') {
                                settotal_car_inside(total_truck_inside + total)
                            } else if (val.name == 'Truck Outside') {
                                settotal_car_outside(total_truck_outside + total)
                            } else if (val.name == 'Motorcycle Inside') {
                                settotal_motorcycle_inside(total_motorcycle_inside + total)
                            } else if (val.name == 'Motorcycle Outside') {
                                settotal_motorcycle_outside(total_motorcycle_outside + total)
                            } else if (val.name == 'Bus Inside') {
                                settotal_bus_inside(total_bus_inside + total)
                            } else if (val.name == 'Bus Outside') {
                                settotal_bus_outside(total_bus_outside + total)
                            }
                        })
                        console.log(category);
                        console.log(combain_data);
                        console.log(heat_map_url);
                        console.log(induval_data);

                        setoverall_count(overall_data_full)
                        setheat_map_image(heat_map_url)
                        setchart_bar(combain_data)
                        setchart_field(category)
                        setchart_data(data)
                        setinduval_cam(induval_data)
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
                type: 'area',
                height: 350,
                colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#D7263d', '#5A2A27', '#546E7A', '#2E294E',],
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
            colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#D7263d', '#5A2A27', '#546E7A', '#2E294E', '#f803fc'],
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
                                            type: 'area',
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
                                    <Col xl={induval_cam.length == 1 ? 12 : 6} lg={induval_cam.length == 1 ? 12 : 6} md={induval_cam.length == 1 ? 12 : 6} sm={12} xs={12}>
                                        <div style={{ borderRadius: '5px', border: '1px solid black', marginBottom: '10px' }}>

                                            <div>

                                                <div>
                                                    <div style={{ backgroundColor: 'white', borderRadius: '5px', padding: '10px', color: 'black', marginRight: '10px', width: '100%' }}>
                                                        <p style={{ fontWeight: 'bold', color: '#e32747', fontSize: '18px' }}>{val.camera_name} :-</p>
                                                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                            <div>
                                                                <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Vehicle Inside</p>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginRight: '12px' }}>
                                                                        <p>Car</p>
                                                                        <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.car_inside_count : val.type == 'In' ? val.car_inside_count + val.car_outside_count : 0}</p>
                                                                    </div>

                                                                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginRight: '12px' }}>
                                                                        <p>Truck</p>
                                                                        <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.truck_inside_count : val.type == 'In' ? val.truck_inside_count + val.truck_outside_count : 0}</p>
                                                                    </div>

                                                                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginRight: '12px' }}>
                                                                        <p>Motorcycle</p>
                                                                        <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.motorcycle_inside_count : val.type == 'In' ? val.motorcycle_inside_count + val.motorcycle_outside_count : 0}</p>
                                                                    </div>

                                                                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginRight: '12px' }}>
                                                                        <p>Bus</p>
                                                                        <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.bus_inside_count : val.type == 'In' ? val.bus_inside_count + val.bus_outside_count : 0}</p>
                                                                    </div>

                                                                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', }}>
                                                                        <p>Total</p>
                                                                        <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.car_inside_count + val.truck_inside_count + val.motorcycle_inside_count + val.bus_inside_count : val.type == 'In' ? val.car_inside_count + val.car_outside_count + val.truck_outside_count + val.truck_inside_count + val.motorcycle_inside_count + val.motorcycle_outside_count + val.bus_inside_count + val.bus_outside_count : 0}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Vehicle Outside</p>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginRight: '12px' }}>
                                                                        <p>Car</p>
                                                                        <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.car_outside_count : val.type == 'Out' ? val.car_inside_count + val.car_outside_count : 0}</p>
                                                                    </div>

                                                                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginRight: '12px' }}>
                                                                        <p>Truck</p>
                                                                        <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.truck_outside_count : val.type == 'Out' ? val.truck_inside_count + val.truck_outside_count : 0}</p>
                                                                    </div>

                                                                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginRight: '12px' }}>
                                                                        <p>Motorcycle</p>
                                                                        <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.motorcycle_outside_count : val.type == 'Out' ? val.motorcycle_inside_count + val.motorcycle_outside_count : 0}</p>
                                                                    </div>

                                                                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginRight: '12px' }}>
                                                                        <p>Bus</p>
                                                                        <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.bus_outside_count : val.type == 'Out' ? val.bus_inside_count + val.bus_outside_count : 0}</p>
                                                                    </div>

                                                                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginRight: '12px' }}>
                                                                        <p>Total</p>
                                                                        <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.car_outside_count + val.truck_outside_count + val.motorcycle_outside_count + val.bus_outside_count : val.type == 'Out' ? val.car_inside_count + val.car_outside_count + val.truck_outside_count + val.truck_inside_count + val.motorcycle_inside_count + val.motorcycle_outside_count + val.bus_inside_count + val.bus_outside_count : 0}</p>
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
                                                                <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Total Vehicle Count</p>
                                                                <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.total_count}</p>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Chart options={object.options} series={object.series} type={time_chk == 'hour' ? "area" : 'bar'} height={350} />
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
                                    <div style={{ backgroundColor: 'white', borderRadius: '5px', padding: '10px', display: 'inline-block', width: '350px', color: 'black', marginRight: '10px' }}>
                                        <p style={{ fontWeight: 'bold', color: '#e32747', fontSize: '18px' }}>Overall :-</p>

                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <p>Vehicle Inside</p>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                    <p>Car</p>
                                                    <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{overall_count.car_inside}</p>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                    <p>Truck</p>
                                                    <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{overall_count.truck_inside}</p>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                    <p>Motorcycle</p>
                                                    <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{overall_count.motorcycle_inside}</p>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                    <p>Bus</p>
                                                    <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{overall_count.bus_inside}</p>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                    <p>Total</p>
                                                    <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{overall_count.car_inside + overall_count.truck_inside + overall_count.motorcycle_inside + overall_count.bus_inside}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <p>Vehicle Outside</p>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                    <p>Car</p>
                                                    <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{overall_count.car_outside}</p>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                    <p>Truck</p>
                                                    <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{overall_count.truck_outside}</p>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                    <p>Motorcycle</p>
                                                    <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{overall_count.motorcycle_outside}</p>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                    <p>Bus</p>
                                                    <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{overall_count.bus_outside}</p>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                    <p>Total</p>
                                                    <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{overall_count.car_outside + overall_count.truck_outside + overall_count.motorcycle_outside + overall_count.bus_outside}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div style={{ display: 'flex' }}>
                                            <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Vehicle Inside</p>
                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{overall_count.vehicle_inside}</p>
                                        </div>

                                        <div style={{ display: 'flex' }}>
                                            <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Vehicle Outside</p>
                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{overall_count.vehicle_outside}</p>
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
                                            <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Total Vehicle Count</p>
                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{overall_count.total_count}</p>
                                        </div> */}
                                    </div>
                                </div>

                                {
                                    induval_cam.map((val) => (
                                        <div>
                                            <div style={{ backgroundColor: 'white', borderRadius: '5px', padding: '10px', display: 'inline-block', width: '350px', color: 'black', marginRight: '10px' }}>
                                                {/* <div className='scrollable-div' style={{ width: '330px', overflowX: 'scroll', marginBottom: '8px' }}>
                                                    <p style={{ fontWeight: 'bold', color: '#e32747', fontSize: '18px', whiteSpace: 'nowrap', margin: 0, marginBottom: '4px' }}>{val.camera_name} ({val.type}) :-</p>
                                                </div> */}
                                                <p style={{ fontWeight: 'bold', color: '#e32747', fontSize: '18px' }}>{val.camera_name} ({val.type}) :-</p>

                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <p>Vehicle Inside</p>
                                                    </div>

                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                            <p>Car</p>
                                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.car_inside_count : val.type == 'In' ? val.car_inside_count + val.car_outside_count : 0}</p>
                                                        </div>

                                                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                            <p>Truck</p>
                                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.truck_inside_count : val.type == 'In' ? val.truck_inside_count + val.truck_outside_count : 0}</p>
                                                        </div>

                                                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                            <p>Motorcycle</p>
                                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.motorcycle_inside_count : val.type == 'In' ? val.motorcycle_inside_count + val.motorcycle_outside_count : 0}</p>
                                                        </div>

                                                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                            <p>Bus</p>
                                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.bus_inside_count : val.type == 'In' ? val.bus_inside_count + val.bus_outside_count : 0}</p>
                                                        </div>

                                                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                            <p>Total</p>
                                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.car_inside_count + val.truck_inside_count + val.motorcycle_inside_count + val.bus_inside_count : val.type == 'In' ? val.car_inside_count + val.car_outside_count + val.truck_outside_count + val.truck_inside_count + val.motorcycle_inside_count + val.motorcycle_outside_count + val.bus_inside_count + val.bus_outside_count : 0}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <p>Vehicle Outside</p>
                                                    </div>

                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                            <p>Car</p>
                                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.car_outside_count : val.type == 'Out' ? val.car_inside_count + val.car_outside_count : 0}</p>
                                                        </div>

                                                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                            <p>Truck</p>
                                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.truck_outside_count : val.type == 'Out' ? val.truck_inside_count + val.truck_outside_count : 0}</p>
                                                        </div>

                                                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                            <p>Motorcycle</p>
                                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.motorcycle_outside_count : val.type == 'Out' ? val.motorcycle_inside_count + val.motorcycle_outside_count : 0}</p>
                                                        </div>

                                                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                            <p>Bus</p>
                                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.bus_outside_count : val.type == 'Out' ? val.bus_inside_count + val.bus_outside_count : 0}</p>
                                                        </div>

                                                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                                            <p>Total</p>
                                                            <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.car_outside_count + val.truck_outside_count + val.motorcycle_outside_count + val.bus_outside_count : val.type == 'Out' ? val.car_inside_count + val.car_outside_count + val.truck_outside_count + val.truck_inside_count + val.motorcycle_inside_count + val.motorcycle_outside_count + val.bus_inside_count + val.bus_outside_count : 0}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* <div style={{ display: 'flex' }}>
                                                    <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Vehicle Inside</p>
                                                    <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.vehicle_inside_count : val.type == 'In' ? val.total_count : 0}</p>
                                                </div>

                                                <div style={{ display: 'flex' }}>
                                                    <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Vehicle Outside</p>
                                                    <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.type == 'In & Out' ? val.vehicle_outside_count : val.type == 'Out' ? val.total_count : 0}</p>
                                                </div>

                                                <div style={{ display: 'flex' }}>
                                                    <p style={{ fontWeight: 'bold', marginRight: '5px' }}>Total Vehicle Count</p>
                                                    <p style={{ color: '#e32747', fontWeight: 'bolder' }}>{val.total_count}</p>
                                                </div> */}

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
                                    <Chart options={state.options} series={state.series} type={time_chk == 'hour' ? "area" : 'bar'} height={350} />
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
