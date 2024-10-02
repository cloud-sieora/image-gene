import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import res from "./data";
import Login from './Login';
import Payment from './Payment';
import Signup from './Signup';


export default function Calculator() {

    window.addEventListener('beforeunload', function () {
        // Clear the local storage
        localStorage.clear();
    });

    const [aiTriggeredCameraIsActive, setaiTriggeredCameraIsActive] = useState({
        alert: 0,
        analytics: 0,
        face_attenance: 0,
        heat_map: 0,
        people_count: 0,
        vehicle_count:0
    })

    const [storageOptions, setStorageOptions] = useState([])

    let cams_data = JSON.parse(localStorage.getItem('camPlanData'));
    console.log(res);

    const [pageNumber, setPageNumber] = useState(0);

    const [EIGHT_CHANNE_ADAPTER, SET_EIGHT_CHANNEL_ADAPTER] = useState(3000);
    const [SIXTEEN_CHANNEL_ADAPTER, SET_SIXTEEN_CHANNEL_ADAPTER] = useState(4500);
    const [THIRTY_TWO_CHANNEL_ADAPTER, SET_THIRTY_TWO_CHANNEL_ADAPTER] = useState(8000);
    const [SIXTY_FOUR_CHANNEL_ADAPTER, SET_SIXTY_FOUR_CHANNEL_ADAPTER] = useState(13000);
    const [ANALYTIC_CAMERA_PRICE_MONTHLY, SET_ANALYTIC_CAMERA_PRICE_MONTHLY] = useState(0);
    const [ANALYTIC_CAMERA_PRICE_YEARLY, SET_ANALYTIC_CAMERA_PRICE_YEARLY] = useState(0);
    const [yearlyPlanDiscountPercentage, setYearlyPlanDiscountPercentage] = useState(0);
    const [daysStorage, setDaysStorage] = useState(0);
    const [plansObject, setPlansObject] = useState([]);





    const _2MP_3_CAM_PRICE = 0;
    const _4MP_3_CAM_PRICE = 0;
    const _8MP_3_CAM_PRICE = 0;

    const _2MP_7_CAM_PRICE = 0;
    const _4MP_7_CAM_PRICE = 0;
    const _8MP_7_CAM_PRICE = 0;

    const _2MP_30_CAM_PRICE = 0;
    const _4MP_30_CAM_PRICE = 0;
    const _8MP_30_CAM_PRICE = 0;

    const _2MP_3_24_CAM_PRICE = 0;
    const _4MP_3_24_CAM_PRICE = 0;
    const _8MP_3_24_CAM_PRICE = 0;

    const _2MP_7_24_CAM_PRICE = 0;
    const _4MP_7_24_CAM_PRICE = 0;
    const _8MP_7_24_CAM_PRICE = 0;

    const _2MP_30_24_CAM_PRICE = 0;
    const _4MP_30_24_CAM_PRICE = 0;
    const _8MP_30_24_CAM_PRICE = 0;


    const [plansAPIData, setPlansAPIData] = useState([])

    const site_obj = {
        _2MP: 0,
        _4MP: 0,
        _8MP: 0,
        _2MP_24: 0,
        _4MP_24: 0,
        _8MP_24: 0,
        analytics_cam: 0,
        people_count: 0,
        alert_cam: 0,
        face_attendance_cam: 0,
        heat_map_cam: 0,
        vehicle_count_cam:0
    }

    const [sites, setSites] = useState([site_obj]);
    const [adapterData, setAdaptersData] = useState({
        _8_adapter: 0,
        _16_adapter: 0,
        _32_adapter: 0,
        _64_adapter: 0,
    })
    const [totalCamData, setTotalCamData] = useState({
        _2MP: 0,
        _4MP: 0,
        _8MP: 0,
        _2MP_24: 0,
        _4MP_24: 0,
        _8MP_24: 0,
        analytics_cam: 0,
        alert_cam: 0,
        people_count: 0,
        face_attenance_cam: 0,
        heat_map_cam: 0,
        vehicle_count_cam:0

    });
    const [planData, setPlanData] = useState({});

    const [flag, setFlag] = useState(false);
    var analytic_price = 5.00;




    useEffect(() => {

        const URL = "https://tentovision1.cloudjiffy.net/plans_api";
        const options = {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            }
        }

        // alert("useEffect")


        fetch(URL, options)
            .then(response => {
                console.log(response);
                return response.json()
            })
            .then(data => {

                let obj = []
                setStorageOptions([])

                console.log(data);

                let objCam = {}
                data.map((d, i) => {

                    console.log(d['plan_name']);

                    if (d['plan_name'] == "alert") {
                        // aiTriggeredCameraIsActive['alert'] = d['Active']
                        objCam['alert'] = d['Active']
                    }
                    else if (d['plan_name'] == "analytics") {
                        // aiTriggeredCameraIsActive['analytics'] = d['Active']
                        // objCam.push({ analytics: d['Active'] })
                        objCam['analytics'] = d['Active']
                    }
                    else if (d['plan_name'] == "heat map") {
                        // aiTriggeredCameraIsActive['heat_map'] = d['Active']
                        // objCam.push({ heat_map: d['Active'] })
                        objCam['heat_map'] = d['Active']

                    }
                    else if (d['plan_name'] == "people count") {
                        // aiTriggeredCameraIsActive['people_count'] = d['Active']
                        // objCam.push({ people_count: d['Active'] })
                        objCam['people_count'] = d['Active']

                    }
                    else if (d['plan_name'] == "face attanance") {
                        // aiTriggeredCameraIsActive["face_attanance"] = d['Active']
                        // objCam.push({ face_attanance: d['Active'] })
                        objCam['face_attanance'] = d['Active']

                    }
                    else if (d['plan_name'] == "Vehicle count") {
                        // aiTriggeredCameraIsActive["face_attanance"] = d['Active']
                        // objCam.push({ face_attanance: d['Active'] })
                        objCam['vehicle_count_cam'] = d['Active']

                    }
                    else if (d['plan_name'] == "cloud_days") {
                        console.log(d['plan_details']['storage']);
                        setStorageOptions(d['plan_details']['storage'])

                    }

                    console.log(objCam);
                    setaiTriggeredCameraIsActive(objCam)

                    obj.push({ PLAN_NAME: d['plan_name'], PRIZE: d['prize'], TYPE: d['plan_details'], DISCOUNT: d['discount'], _id: d['_id'] });

                    if (d['plan_name'] == "analytics") {
                        SET_ANALYTIC_CAMERA_PRICE_MONTHLY(d['prize']);
                        let disc = d['discount'];
                        let percentage = disc[0]['_20cameras'];
                        console.log(percentage);
                        if (percentage == '10%') {

                            //Yearly data will be provided for now 
                            let yearly = 900;
                            SET_ANALYTIC_CAMERA_PRICE_YEARLY(yearly)
                        }
                    }
                })

                console.log(obj);
                setPlansAPIData(data)
                setPlansObject(obj);
            })
            .catch(err => {
                console.log(err);
            })


    }, [])


    console.log(storageOptions)

    function updateCamData() {


        {

            let _2MP = 0;
            let _4MP = 0;
            let _8MP = 0;

            let _2MP_24 = 0;
            let _4MP_24 = 0;
            let _8MP_24 = 0;

            let analytics_cameras = 0;
            let alert_cameras = 0;
            let face_attenance_cameras = 0;
            let heat_map_cameras = 0;
            let people_count_cam = 0
            let vehicle_count_cams = 0

            console.log(sites);

            sites.map(site => {

                _2MP += Number(site["_2MP"]);
                _4MP += Number(site["_4MP"]);
                _8MP += Number(site["_8MP"]);

                _2MP_24 += Number(site["_2MP_24"]);
                _4MP_24 += Number(site["_4MP_24"]);
                _8MP_24 += Number(site["_8MP_24"]);

                analytics_cameras += Number(site['analytics_cam']);
                console.log(site['alert_cam']);
                alert_cameras += site['alert_cam'];
                face_attenance_cameras += site['face_attendance_cam'];
                heat_map_cameras += site['heat_map_cam']
                people_count_cam += site['people_count']
                vehicle_count_cams += site['vehicle_count_cam']
                console.log(site);
            })

            let obj = {
                _2MP: _2MP,
                _4MP: _4MP,
                _8MP: _8MP,
                _2MP_24: _2MP_24,
                _4MP_24: _4MP_24,
                _8MP_24: _8MP_24,
                analytics_cam: analytics_cameras,
                alert_cam: alert_cameras,
                people_count: people_count_cam,
                face_attenance_cam: face_attenance_cameras,
                heat_map_cam: heat_map_cameras,
                vehicle_count_cam: vehicle_count_cams

            }

            console.log(obj);

            setTotalCamData(obj)
            console.log(_2MP, _4MP, _8MP, _2MP_24, _4MP_24, _8MP_24, analytics_cameras);
        }
    }


    console.log(totalCamData);

    console.log(storageOptions);


    var sites_data = [];
    var adapters_available = [8, 16, 32, 64];
    var hardware_price = 199.00
    sessionStorage.setItem('sitesData', JSON.stringify(sites_data));



    function removeSite(id) {

        let newSitesArray = [];

        sites.map((s, i) => {
            if (i != id) { newSitesArray.push(s) }
        })

        setSites(newSitesArray)

    }

    // function removeSite(e) {
    //     let parent = e.parentNode
    //     var parentDiv = document.getElementById('site-div-additional');
    //     var childToRemove = e.parentNode;
    //     parentDiv.removeChild(childToRemove);
    //     console.log(e.id);
    //     let sites = JSON.parse(sessionStorage.getItem('sitesData'));

    //     console.log(sites);

    //     let obj = [];

    //     sites.forEach(a => {
    //         if (a.name != e.parentNode.id) {
    //             obj.push(a)
    //         }
    //     })

    //     sessionStorage.setItem('sitesData', JSON.stringify(obj));
    //     console.log(JSON.parse(sessionStorage.getItem('sitesData')));
    // }


    function camsSelectedShowCost(two_mp, four_mp, eight_mp, two_mp_24, four_mp_24, eight_mp_24, analytic_cam, alert_cam, face_attenance_cam, heat_map_cam, people_count, vehicle_count, discount, _days) {

        let cam_show_div = document.getElementById('para-con-secondPage');
        let days = _days;
        console.log(two_mp, four_mp, eight_mp, two_mp_24, four_mp_24, eight_mp_24, analytic_cam, alert_cam, face_attenance_cam, heat_map_cam, people_count, discount, _days)

        //Div will be cleared
        cam_show_div.innerHTML = "";

        let disc = discount;
        let cam_arr = ["_2MP", "_4MP", "_8MP", "_2MP_24", "_4MP_24", "_8MP_24", "analytics_cam", "heat_map_cam", "people_count", "alert_cam", "face_attenance_cam", "vehicle_count_cam"];


        let cam_price_data = {}


        cam_arr.map((c, i) => {

            let cam_name = '';
            let price = '';
            let id = ''

            if (c === "_2MP") {
                cam_name = "2MP Motion triggered ";
                price = Number(two_mp['cost']);
                id = two_mp['id']
            }
            if (c === "_4MP") {
                cam_name = "4MP Motion triggered ";
                price = Number(four_mp['cost']);
                id = four_mp['id']
            }
            if (c === "_8MP") {
                cam_name = "8MP Motion triggered ";
                price = Number(eight_mp['cost']);
                id = eight_mp['id']
            }

            if (c === "_2MP_24") {
                cam_name = "2MP 24/7 continuous ";
                price = Number(two_mp_24['cost']);
                id = two_mp_24['id']
            }
            if (c === "_4MP_24") {
                cam_name = "4MP 24/7 continuous ";
                price = Number(four_mp_24['cost']);
                id = four_mp_24['id']
            }
            if (c === "_8MP_24") {
                cam_name = "8MP 24/7 continuous ";
                price = Number(eight_mp_24['cost']);
                id = eight_mp_24['id']
            }
            if (c === "analytics_cam") {
                cam_name = "Analytics camera";
                price = Number(analytic_cam['cost']);
                id = analytic_cam['id']
            }
            if (c === "people_count") {
                cam_name = "People count camera";
                price = Number(people_count['cost']);
                id = people_count['id']
            }
            if (c === "vehicle_count_cam") {
                cam_name = "Vehicle count camera";
                price = Number(vehicle_count['cost']);
                id = vehicle_count['id']
            }
            if (c === "alert_cam") {
                cam_name = "Alert camera";
                price = Number(alert_cam['cost'])
                id = alert_cam['id']
            }
            if (c === "face_attenance_cam") {
                cam_name = "Face attendance camera";
                price = Number(face_attenance_cam['cost'])
                id = face_attenance_cam['id']
            }
            if (c === "heat_map_cam") {
                cam_name = "Heat map camera";
                price = Number(heat_map_cam['cost'])
                id = heat_map_cam['id']
            }


            console.log(c);
            console.log(totalCamData);


            let paragraph = document.createElement('p');
            let cost = Number((price) * totalCamData[c]).toFixed(2);

            paragraph.innerHTML = `${totalCamData[c]} x ${cam_name} - ₹${cost}`;
            // console.log(totalCamData[c] * totalCamData[c]);

            cam_price_data[c] = {
                "CAM": cam_name,
                "QTY": totalCamData[c],
                "price": price,
                "_id": id
            }
            // console.log(totalCamData[c]);


            if (totalCamData[c] > 0) {
                cam_show_div.append(paragraph);
            }

        });

        console.log(cam_price_data);
        setQuoteDivDataFunc(disc);
        sessionStorage.setItem('cameraPricingData', JSON.stringify(cam_price_data));

    }









    function showCamsEstimationPage2() {

        let selected_slider_value = Number(document.getElementById('customRange2').value);
        let account_type = localStorage.getItem('accountType')

        console.log(selected_slider_value)
        console.log(account_type);

        // let selected_storage_object = storageOptions[selected_slider_value]
        let selected_storage_day_name = storageOptions[selected_slider_value]

        console.log(selected_storage_day_name);

        let _2_continuos = 0
        let _4_continuos = 0
        let _8_continuos = 0

        let _2_motion_trig = 0
        let _4_motion_trig = 0
        let _8_motion_trig = 0


        //AI CAMERAS
        let analytic_cam_price = 0;
        let alert_cam_price = 0;
        let face_attendance_cam_price = 0;
        let heat_map_cam_price = 0;
        let people_count_cam_price = 0;
        let vehicle_count_cam_price = 0


        let user_plan_type = account_type == 'CUSTOMER' ? 'prize' : 'dealer_discount';
        let ai_plan_user_type = account_type == 'CUSTOMER' ? 'client' : 'dealer';

        let _days = storageOptions[selected_slider_value]
        let adapter_cost_obj = {}

        plansAPIData.map(plan => {

            console.log(plan);

            if (plan.plan_name == "2mp") {

                let liveOriginalPrice = 0;
                let motionOriginalPrice = 0;

                if (account_type == 'CUSTOMER') {
                    liveOriginalPrice = plan[user_plan_type]['live'][selected_slider_value].rate;
                    motionOriginalPrice = plan[user_plan_type]['motion'][selected_slider_value].rate
                }
                else if (account_type === 'DISTRIBUTOR') {
                    console.log(account_type);

                    liveOriginalPrice = plan[user_plan_type][0]['live'][selected_slider_value].rate
                    motionOriginalPrice = plan[user_plan_type][0]['motion'][selected_slider_value].rate
                }


                let cam_qty_live = totalCamData['_2MP'];
                let livediscountPercentage = 0;

                plan['discount'].map(data => {
                    if (cam_qty_live >= data['cam_qty']) {
                        let percent = String(data['cam_qty']).split('%')[0];
                        if (Number(percent) < 10) {
                            percent = String("0" + percent)
                        }
                        percent = Number("0." + percent)
                        livediscountPercentage = percent;
                    }
                })

                let cam_qty_motion = totalCamData['_2MP_24'];
                let motiondiscountPercentage = 0;

                plan['discount'].map(data => {
                    if (cam_qty_motion >= data['cam_qty']) {
                        let percent = String(data['cam_qty']).split('%')[0];
                        if (percent < 10) {
                            percent = String("0" + percent)
                        }
                        percent = Number("0." + percent)
                        motiondiscountPercentage = percent;
                    }
                })


                console.log(liveOriginalPrice, (liveOriginalPrice * livediscountPercentage), motionOriginalPrice - (motionOriginalPrice * motiondiscountPercentage));

                _2_continuos = {
                    cost: liveOriginalPrice - (liveOriginalPrice * livediscountPercentage),
                    id: plan['_id']
                }
                _2_motion_trig = {
                    cost: motionOriginalPrice - (motionOriginalPrice * livediscountPercentage),
                    id: plan['_id']
                }
            }
            else if (plan.plan_name == "4mp") {



                let liveOriginalPrice = 0;
                let motionOriginalPrice = 0;

                if (account_type == 'CUSTOMER') {
                    liveOriginalPrice = plan[user_plan_type]['live'][selected_slider_value].rate;
                    motionOriginalPrice = plan[user_plan_type]['motion'][selected_slider_value].rate
                }
                else if (account_type === 'DISTRIBUTOR') {
                    liveOriginalPrice = plan[user_plan_type][0]['live'][selected_slider_value].rate;
                    motionOriginalPrice = plan[user_plan_type][0]['motion'][selected_slider_value].rate
                }

                let cam_qty_live = totalCamData['_4MP'];
                let livediscountPercentage = 0;

                plan['discount'].map(data => {
                    if (cam_qty_live >= data['cam_qty']) {
                        let percent = String(data['cam_qty']).split('%')[0];
                        if (Number(percent) < 10) {
                            percent = String("0" + percent)
                        }
                        percent = Number("0." + percent)
                        livediscountPercentage = percent;
                    }
                })

                let cam_qty_motion = totalCamData['_4MP_24'];
                let motiondiscountPercentage = 0;

                plan['discount'].map(data => {
                    if (cam_qty_motion >= data['cam_qty']) {
                        let percent = String(data['cam_qty']).split('%')[0];
                        if (Number(percent) < 10) {
                            percent = String("0" + percent)
                        }
                        percent = Number("0." + percent)
                        motiondiscountPercentage = percent;
                    }
                })

                _4_continuos = {
                    cost: liveOriginalPrice - (liveOriginalPrice * livediscountPercentage),
                    id: plan['_id']
                }
                _4_motion_trig = {
                    cost: motionOriginalPrice - (motionOriginalPrice * livediscountPercentage),
                    id: plan['_id']
                }

            }
            else if (plan.plan_name == "8mp") {


                let liveOriginalPrice = 0;
                let motionOriginalPrice = 0;

                if (account_type == 'CUSTOMER') {
                    liveOriginalPrice = plan[user_plan_type]['live'][selected_slider_value].rate;
                    motionOriginalPrice = plan[user_plan_type]['motion'][selected_slider_value].rate
                }
                else if (account_type === 'DISTRIBUTOR') {

                    liveOriginalPrice = plan[user_plan_type][0]['live'][selected_slider_value].rate;
                    motionOriginalPrice = plan[user_plan_type][0]['motion'][selected_slider_value].rate
                }

                let cam_qty_live = totalCamData['_8MP'];
                let livediscountPercentage = 0;

                plan['discount'].map(data => {
                    if (cam_qty_live >= data['cam_qty']) {
                        let percent = String(data['cam_qty']).split('%')[0];
                        if (Number(percent) < 10) {
                            percent = String("0" + percent)
                        }
                        percent = Number("0." + percent)
                        livediscountPercentage = percent;
                    }
                })

                let cam_qty_motion = totalCamData['_8MP_24'];
                let motiondiscountPercentage = 0;

                plan['discount'].map(data => {
                    if (cam_qty_motion >= data['cam_qty']) {
                        let percent = String(data['cam_qty']).split('%')[0];
                        if (Number(percent) < 10) {
                            percent = String("0" + percent)
                        }
                        percent = Number("0." + percent)
                        motiondiscountPercentage = percent;
                    }
                })

                _8_continuos = {
                    cost: liveOriginalPrice - (liveOriginalPrice * livediscountPercentage),
                    id: plan['_id']
                }
                _8_motion_trig = {
                    cost: motionOriginalPrice - (motionOriginalPrice * livediscountPercentage),
                    id: plan['_id']
                }

            }
            else if (plan.plan_name == "alert") {

                let originalPrice = plan['ai_price'][ai_plan_user_type];
                let discount = 1;

                plan['discount'].map(data => {
                    if (originalPrice >= data['cam_qty']) {
                        let percent = String(data['cam_qty']).split('%')[0];
                        if (percent < 10) {
                            percent = Number("0" + percent)
                        }
                        percent = Number("0." + percent)
                        discount = percent;
                    }
                })

                alert_cam_price = {
                    cost: originalPrice - (originalPrice * discount),
                    id: plan['id']
                };

            }
            else if (plan.plan_name == "analytics") {

                let originalPrice = plan['ai_price'][ai_plan_user_type];
                let discount = 1;

                plan['discount'].map(data => {
                    if (originalPrice >= data['cam_qty']) {
                        let percent = String(data['cam_qty']).split('%')[0];
                        if (percent < 10) {
                            percent = Number("0" + percent)
                        }
                        percent = Number("0." + percent)
                        discount = percent;
                    }
                })

                analytic_cam_price = {
                    cost: originalPrice - (originalPrice * discount),
                    id: plan['_id']
                };

            }
            else if (plan.plan_name == "face attanance") {

                let originalPrice = plan['ai_price'][ai_plan_user_type];
                let discount = 1;

                plan['discount'].map(data => {
                    if (originalPrice >= data['cam_qty']) {
                        let percent = String(data['cam_qty']).split('%')[0];
                        if (percent < 10) {
                            percent = Number("0" + percent)
                        }
                        percent = Number("0." + percent)
                        discount = percent;
                    }
                })

                face_attendance_cam_price = {
                    cost: originalPrice - (originalPrice * discount),
                    id: plan['_id']
                };


            }
            else if (plan.plan_name == "heat map") {

                let originalPrice = plan['ai_price'][ai_plan_user_type];
                let discount = 1;

                plan['discount'].map(data => {
                    if (originalPrice >= data['cam_qty']) {
                        let percent = String(data['cam_qty']).split('%')[0];
                        if (percent < 10) {
                            percent = Number("0" + percent)
                        }
                        percent = Number("0." + percent)
                        discount = percent;
                    }
                })

                heat_map_cam_price = {
                    cost: originalPrice - (originalPrice * discount),
                    id: plan['_id']
                };

            }
            else if (plan.plan_name == "people count") {

                let originalPrice = plan['ai_price'][ai_plan_user_type];
                let discount = 1;

                plan['discount'].map(data => {
                    if (originalPrice >= data['cam_qty']) {
                        let percent = String(data['cam_qty']).split('%')[0];
                        if (percent < 10) {
                            percent = Number("0" + percent)
                        }
                        percent = Number("0." + percent)
                        discount = percent;
                    }
                })
                people_count_cam_price = {
                    cost: originalPrice - (originalPrice * discount),
                    id: plan['_id']
                };

            }
            else if (plan.plan_name == "Vehicle count") {

                let originalPrice = plan['ai_price'][ai_plan_user_type];
                let discount = 1;

                plan['discount'].map(data => {
                    if (originalPrice >= data['cam_qty']) {
                        let percent = String(data['cam_qty']).split('%')[0];
                        if (percent < 10) {
                            percent = Number("0" + percent)
                        }
                        percent = Number("0." + percent)
                        discount = percent;
                    }
                })
                vehicle_count_cam_price = {
                    cost: originalPrice - (originalPrice * discount),
                    id: plan['_id']
                };

            }
            else if (plan.plan_name == "device") {
                // alert(10)
                console.log(plan[user_plan_type])
                if (account_type == 'CUSTOMER') {
                    adapter_cost_obj = {
                        _8_Channel: plan[user_plan_type]['device'][0],
                        _16_channel: plan[user_plan_type]['device'][1],
                        _32_channel: plan[user_plan_type]['device'][2],
                        _64_channel: plan[user_plan_type]['device'][3]
                    }
                }
                else if (account_type == 'DISTRIBUTOR') {
                    adapter_cost_obj = {
                        _8_Channel: plan[user_plan_type][0],
                        _16_channel: plan[user_plan_type][1],
                        _32_channel: plan[user_plan_type][2],
                        _64_channel: plan[user_plan_type][3]
                    }

                }
            }
        })


        localStorage.setItem('adapterTariffData', JSON.stringify(adapter_cost_obj))

        console.log(_2_continuos, _4_continuos, _8_continuos, _2_motion_trig, _4_motion_trig, _8_motion_trig, analytic_cam_price, alert_cam_price, face_attendance_cam_price, heat_map_cam_price, people_count_cam_price, user_plan_type);
        console.log(_days);


        let daay = _days
        daay = String(daay).split('y')
        console.log(daay);


        sessionStorage.setItem('storage_days', _days)



        camsSelectedShowCost(_2_continuos, _4_continuos, _8_continuos, _2_motion_trig, _4_motion_trig, _8_motion_trig, analytic_cam_price, alert_cam_price, face_attendance_cam_price, heat_map_cam_price, people_count_cam_price,vehicle_count_cam_price,  false, _days);




        setHardwaresDivContent();
        let camplanData = sessionStorage.getItem('cameraPricingData')
        console.log(camplanData);

        // Total number of cams based on their plan
        localStorage.setItem('camPlanData', camplanData);

        // // site wise camera selection
        localStorage.setItem('sitesData', JSON.stringify(sites))
    }


    function setQuoteDivDataFunc(discount) {


        let monthly_cost = document.getElementById('per-month-check');
        let yearly_cost = document.getElementById('per-year-check');
        let yearly_discount = localStorage.getItem('yearlyCamDiscount')

        monthly_cost.innerHTML = "";
        yearly_cost.innerHTML = "";

        let disc = discount;
        let plan_data = JSON.parse(sessionStorage.getItem('cameraPricingData'));
        let storage = sessionStorage.getItem('storage_days');

        let monthly_charge = 0;
        let yearly_charge = 0;

        console.log(storage);
        let quote_paragraph_ele = document.getElementById('inn-div-quote');

        //Clearing the paragraph div before appending
        quote_paragraph_ele.innerHTML = '';

        let sitesCountDiv = document.getElementById('sites-div');
        let total_price = 0;


        // localStorage.setItem('camPlanData', JSON.stringify(planData))
        console.log(planData);
        console.log(yearly_discount);
        console.log(plan_data);


        for (let obj in plan_data) {

            if (plan_data[obj]['QTY'] > 0) {


                // Price per month calculation
                let price = Number(plan_data[obj]['price']) * plan_data[obj]['QTY'];

                // Price per Year  calculation
                let price_year = (Number(plan_data[obj]['price']) * 365) * plan_data[obj]['QTY'];

                // Price per Year with discount calculation
                let price_ten_per = price_year * yearly_discount;


                if (plan_data[obj]['QTY'] > 0) {
                    monthly_charge += price;
                    yearly_charge += Number(price_year - price_ten_per);
                }
            }
        }

        monthly_cost.innerHTML = `₹${Number(monthly_charge).toFixed(2)}/month`;
        yearly_cost.innerHTML = `₹${Number(yearly_charge).toFixed(2)}/year`;

        console.log(monthly_charge, yearly_charge);


        for (let obj in plan_data) {

            console.log(obj);

            let price = '';


            if (disc) {

                let price_yearly = plan_data[obj]['price'] * plan_data[obj]['QTY']

                console.log(price_yearly);
                let price_ten_percentage = price_yearly * yearly_discount;

                price = Number(price_yearly - price_ten_percentage).toFixed(2);
                console.log(price);

                if (price < 0) {
                    price = price * -1;
                }
                console.log(Number(price).toFixed(2));
            }
            else {
                console.log((plan_data[obj]['price']) * plan_data[obj]['QTY']);
                price = (plan_data[obj]['price']) * plan_data[obj]['QTY'];
            }






            if (plan_data[obj]['QTY'] > 0) {


                if (plan_data[obj]['CAM'] != 'Analytics camera') {
                    let para = document.createElement('p');
                    para.innerHTML = `${plan_data[obj]['QTY']} x ${plan_data[obj]['CAM']} - ₹${price}`;
                    quote_paragraph_ele.append(para);
                    total_price += Number(plan_data[obj]['price']);
                    console.log(`${plan_data[obj]['QTY']} x ${plan_data[obj]['CAM']} - ${price}`);
                }
                else if (plan_data[obj]['CAM'] === 'Analytics camera') {
                    let para = document.createElement('p');
                    let pcost = 0;
                    if (disc) {
                        console.log(plan_data[obj]['price']);

                        pcost = ((plan_data[obj]['price']) * 365) - ((plan_data[obj]['price'] * 365) * yearly_discount);
                    }
                    else {
                        pcost = (plan_data[obj]['price']);
                    }

                    console.log(pcost);

                    let p = plan_data[obj]['QTY'] * pcost;


                    para.innerHTML = `${plan_data[obj]['QTY']} x ${plan_data[obj]['CAM']} - ₹${p.toFixed(2)}`;
                    quote_paragraph_ele.append(para);
                    total_price += Number(plan_data[obj]['price']);

                    console.log(plan_data[obj]);

                }
            }
        }



        let para2 = document.createElement('p');

        // if (storage == 365 || discount) {
        //     storage = '1 year'
        // }
        // else if (storage == 730) {
        //     storage = '2 year'
        // }
        // else {
        //     storage = storage + ' days'
        // }

        para2.innerHTML = `${storage} storage`;
        para2.style.fontWeight = 'bold'
        quote_paragraph_ele.append(para2);

        console.log(plan_data, quote_paragraph_ele, disc, sitesCountDiv);
    }


    let page = 0;
    let data_to_pass_in_props = {};


    function nextCalcSlider(e) {

        // alert(page)

        if (e.id == "back-btn") {

            console.log(e.id);
            let p = localStorage.getItem('page');

            console.log(p);

            page = p - 1;
            localStorage.setItem('page', page);


            if (page == 0) {
                document.getElementById("first-calc-div").style.display = "block";
                document.getElementById("site-div-additional").style.display = "block"
                // document.getElementById('add-site-div').style.display = "block"
                document.getElementById("slider-div").style.display = "none";
            }
            else if (page == 1) {
                document.getElementById("quote-div").style.display = "none";
                document.getElementById("calculator-div").style.display = "block";
            }
            else if (page < 0) {
                page = 0;
            }
        }
        else if (e.id === 'continue-btn') {

            if (page == 0) {
                //To get the total number of selected cams
                let cam_count = 0;
                console.log(totalCamData);
                for (let cam in totalCamData) {
                    cam_count += totalCamData[cam];
                    console.log(totalCamData[cam]);
                }

                if (cam_count > 0) {

                    // alert(page)

                    page += 1;

                    localStorage.setItem('page', page);
                    showCamsEstimationPage2();
                    document.getElementById("first-calc-div").style.display = "none";
                    document.getElementById("site-div-additional").style.display = "none"
                    // document.getElementById("add-site-div").style.display = "none"
                    document.getElementById("slider-div").style.display = "block";
                }
                else {
                    alert("Atleast one camera has to be selected")
                }
            }
            else if (page == 1) {
                document.getElementById("calculator-div").style.display = "none";
                document.getElementById("quote-div").style.display = "block";
                document.getElementById('co').innerText = "Buy now"
                console.log(document.getElementById('co'));
                showCamsEstimationPage2();
                page += 1;
                localStorage.setItem('page', page);
            }
            else {
                alert(page);
            }
        }
        else if (e.id == 'co') {

            localStorage.setItem('page', 2)

            let client_id = localStorage.getItem('clientId');


            if (client_id != undefined || null || "") {

                setPageNumber(3)
                let adapter_data = JSON.parse(localStorage.getItem('adapter'));
                let hardware_data = JSON.parse(localStorage.getItem('hardwareData'));
                let storage_data = sessionStorage.getItem('storage_days')
                let subscription = JSON.parse(localStorage.getItem('subscription'));
                localStorage.setItem("dataInLocal", JSON.stringify({ cams_data: cams_data, adapter_data: adapter_data, hardware_data: hardware_data, storage_data: storage_data, subscription: subscription }));
                data_to_pass_in_props = { cams_data: cams_data, adapter_data: adapter_data, hardware_data: hardware_data, storage_data: storage_data, subscription: subscription };

            }
            else {
                setPageNumber(1);
            }


            //navigate('/signup', { state: { cams_data: cams_data, adapter_data: adapter_data, hardware_data: hardware_data, storage_data: storage_data, subscription: subscription } })

        }
    }



    const camera = JSON.parse(localStorage.getItem('cams'));
    let days = sessionStorage.getItem('days');
    console.log(camera);

    function changeSubscriptionDiv() {
        console.log(camera, days);

    }

    var subscription = 'monthly';
    if (localStorage.getItem('subscription') == null) {
        localStorage.setItem('subscription', JSON.stringify(subscription))
    }

    function onChangeQuotePlan(e) {

        console.log(e);
        let sel = e.value;
        // console.log(sel);



        const checkboxes = document.querySelectorAll('.check-plan');

        checkboxes.forEach((checkbox) => {

            if (checkbox !== e) {
                checkbox.checked = false;
            }
            else {
                checkbox.checked = true;

            }
        })

        if (sel == 'monthly') {
            setQuoteDivDataFunc(false);
            localStorage.setItem('subscription', JSON.stringify('monthly'))

        }
        else if (sel == 'yearly') {
            setQuoteDivDataFunc(true);

            localStorage.setItem('subscription', JSON.stringify('yearly'))
        }

    }



    var adapter_required = localStorage.getItem("adapter");
    adapter_required = false;
    console.log(adapter_required);





    function setHardwaresDivContent() {

        let adapter_required = JSON.parse(localStorage.getItem("adapter"));
        console.log(adapter_required);

        document.getElementById('hardware-div').innerHTML = "";


        let cam = 0;

        for (let ca in totalCamData) {
            cam += Number(totalCamData[ca]);
            console.log(totalCamData[ca]);
        }

        console.log(cam)

        let cams_remaining = cam;
        let adapter_paragraph = [];
        let hardware_div = document.getElementById('hardware-div');
        let adapterInfo = JSON.parse(localStorage.getItem('adapterTariffData'))


        console.log(adapterInfo);


        while (cams_remaining > 0) {

            if (cams_remaining <= 8) {
                // console.log("With in eight");
                let p1 = document.createElement('p');
                p1.innerHTML = `You'll need ${1} x Cloud Adapter ${8}`;
                let c = cams_remaining - 8;

                if (cams_remaining < 8) {
                    c = 0;
                }

                cams_remaining = c;
                console.log(adapterInfo);
                adapter_paragraph.push({ variant: 8, price: adapterInfo['_8_Channel']['prize'] });
                hardware_div.append(p1)
                console.log(p1);
            }
            else if (cams_remaining <= 16) {
                // console.log("With in 16");
                let p1 = document.createElement('p');
                p1.innerHTML = `You'll need ${1} x Cloud Adapter ${16}`;
                let c = cams_remaining - 16;
                if (cams_remaining < 16) {
                    c = 0;
                }

                cams_remaining = c;
                adapter_paragraph.push({ variant: 16, price: adapterInfo['_16_channel']['prize'] });
                hardware_div.append(p1)
                console.log(p1);
            }
            else if (cams_remaining <= 32) {
                // console.log("With in 32");
                let p1 = document.createElement('p');
                p1.innerHTML = `You'll need ${1} x Cloud Adapter ${32}`;
                let c = cams_remaining - 32;
                if (cams_remaining < 32) {
                    c = 0;
                }

                cams_remaining = c;
                adapter_paragraph.push({ variant: 32, price: adapterInfo['_32_channel']['prize'] });
                hardware_div.append(p1)
                console.log(p1);
            }
            else if (cams_remaining <= 64) {
                // console.log("With in 64");
                let p1 = document.createElement('p');
                p1.innerHTML = `You'll need ${1} x Cloud Adapter ${64}`;
                let c = cams_remaining - 64;
                if (cams_remaining < 64) {
                    c = 0;
                }
                cams_remaining = c;
                adapter_paragraph.push({ variant: 64, price: adapterInfo['_64_channel']['prize'] });
                hardware_div.append(p1)
                console.log(p1);
            }
            else if (cams_remaining > 64) {
                let p1 = document.createElement('p');
                p1.innerHTML = `You'll need ${1} x Cloud Adapter ${64}`;
                let c = cams_remaining - 64;
                cams_remaining = c;
                adapter_paragraph.push({ variant: 64, price: adapterInfo['_64_channel']['prize'] });
                hardware_div.append(p1)
                console.log(p1);
            }
            console.log(cams_remaining);
        }

        let harware_tot_div = document.getElementById('hardware-amt-div');

        harware_tot_div.innerHTML = '';

        let total_hardware_cost = 0.00;

        adapter_paragraph.forEach((a) => {

            total_hardware_cost += a['price']
        })

        localStorage.setItem("hardwareData", JSON.stringify(adapter_paragraph))

        //Total harware cost
        harware_tot_div.innerHTML = `₹${Number(total_hardware_cost).toFixed(2)}`;
    }

    // var adapter_required = JSON.parse(localStorage.getItem('adapter'));



    if (localStorage.getItem("adapter") == null) {
        localStorage.setItem("adapter", String(false))
    }
    else {
        localStorage.getItem("adapter")
    }

    function checkIsAdapterRequired(e) {


        // Has the info whther the adapter in required or not
        let isRequired = e.target.checked
        localStorage.setItem("adapter", String(isRequired));

        console.log(e.target.checked);

        console.log(document.getElementById('adapt-req').checked);

        if (document.getElementById('adapt-req').checked == true) {
            document.getElementById('adapter-con').style.display = 'none';
            document.getElementById('adapt-req').checked = true;
            adapter_required = false;
        }
        else {
            document.getElementById('adapter-con').style.display = 'block';
            adapter_required = true;
        }
        setHardwaresDivContent();
        showCamsEstimationPage2();
    }





    function nextAfterCreate() {


        let cams = JSON.parse(localStorage.getItem('camData'));
        let storage_days = sessionStorage.getItem('days');
        let sub = sessionStorage.getItem('subscription');
        let subscription = sub === null ? "monthly" : sessionStorage.getItem('subscription');
        let adapter = localStorage.getItem('adapter');
        let total = sessionStorage.getItem('total')
        let analticCamData = JSON.parse(sessionStorage.getItem('analyticCamAllData'));
        let total_analytic_cameras = Number(analticCamData["QTY"]);
        let price_analytic_cam_data = Number(analticCamData["PRICE"]);
        let price_per_cam_yearly = 50;

        let hardware = JSON.parse(localStorage.getItem('hardwareInfo'));
        console.log(hardware);


        console.log(analticCamData);
        console.log(cams, storage_days, subscription, adapter);

        document.getElementById('cost-final-calc').style.display = 'block';
        document.getElementById('create-account-div').style.display = 'none';


        let para = []

        cams.map(d => {

            if (d['Name'] == "CAM_2MP") {
                para.push(`${d['QTY']} x 2MP Motion triggered - Rs.${d['price']}`)
            }
            else if (d['Name'] == "CAM_2MP_24") {
                para.push(`${d['Qty']} x 2MP 24/7 continuous - Rs.${d['price']}`)
            }
            else if (d['Name'] == "CAM_4MP") {
                para.push(`${d['QTY']} x 4MP Motion triggered - Rs.${d['price']}`)
            }
            else if (d['Name'] == "CAM_4MP_24") {
                para.push(`${d['QTY']} x 4MP 24/7 continuous - Rs.${d['price']}`)
            }
            else if (d['Name'] == "CAM_8MP") {
                para.push(`${d['QTY']} x 8MP Motion triggered - Rs.${d['price']}`)
            }
            else if (d['NAME'] == "CAM_8MP_24") {
                para.push(`${d['QTY']} x 8MP 24/7 continuous - Rs.${d['price']}`)
            }
        })

        para.map(p => {
            let paragraph = document.createElement('p');
            paragraph.innerHTML = p;
            document.getElementById('inn-div-quote-final').append(paragraph);
        })

        let hardware_div = document.getElementById('final-hardware-rvw');
        let total_hardware_cost = 0;

        hardware.forEach(h => {

            let p = document.createElement('p');
            p.innerHTML = `You'll need 1 x Cloud Adapter ${h.variant}`;
            hardware_div.append(p);

            total_hardware_cost += Number(h.price)

        })

        let paragraph2 = document.createElement('p');
        let paragraph3 = document.createElement('p');
        let paragraph4 = document.createElement('p');
        let paragraph5 = document.createElement('p');

        let tot_analytic_cams = JSON.parse(sessionStorage.getItem('analyticsCam'));
        console.log(tot_analytic_cams);


        if (total_analytic_cameras > 0) {


            if (subscription === 'monthly') {
                paragraph5.innerHTML = `${total_analytic_cameras} x analytic camera $${price_analytic_cam_data}`;
                paragraph5.style.fontWeight = 600;
                paragraph5.style.fontSize = '20px'
                document.getElementById('inn-div-quote-final').append(paragraph5);
            }
            else if (subscription === 'yearly') {

                let tot_price = price_per_cam_yearly * total_analytic_cameras;

                paragraph5.innerHTML = `${total_analytic_cameras} x analytic camera $${tot_price}`;
                paragraph5.style.fontWeight = 600;
                paragraph5.style.fontSize = '20px'
                document.getElementById('inn-div-quote-final').append(paragraph5);

            }
        }

        paragraph2.innerHTML = `${storage_days} storage`;
        paragraph2.style.fontWeight = 600;
        paragraph2.style.fontSize = '20px';
        document.getElementById('inn-div-quote-final').append(paragraph2);

        paragraph3.innerHTML = `$${total} / ${subscription}`;
        paragraph3.style.fontWeight = 700;
        paragraph3.style.fontSize = '30px';
        document.getElementById('inn-div-quote-final').append(paragraph3);

        paragraph4.innerHTML = subscription === 'monthly' ? 'Cancel at any time' : '10% discount';
        paragraph4.style.opacity = 0.5;
        paragraph4.style.fontSize = '17px';
        document.getElementById('inn-div-quote-final').append(paragraph4);

        if (adapter == "true") {
            document.getElementById('adapter-con-final').style.display = 'none'
        }
        else if (adapter == "false") {
            document.getElementById('adapter-con-final').style.display = 'block'
            // alert(1)
        }


        document.getElementById('harware-price-p').innerHTML = `$${total_hardware_cost.toFixed(2)}`;

    }


    async function createUser(data) {

        let URL = "https://tentovision1.cloudjiffy.net/users_creation_api/";

        let today = new Date();
        let date_today = 0
        let month_today = 0

        if (today.getDate() < 10) {
            date_today = String(0) + today.getDate();
        }

        if (today.getMonth() + 1 < 10) {
            month_today = String(0) + (Number(today.getMonth()) + 1);
        }


        let date = today.getFullYear() + "-" + date_today + "-" + month_today;
        console.log(date);
        let dealerId = "NONE";

        if (data.type === "distributor") {
            let res = await getDistributorId(data.DEALER_ID);
            dealerId = res._id;
            console.log(res._id);
        }




        const options = {

            client_id: Number(Math.random() * 10000000).toFixed(0),
            User_name: data.name,
            password: data.password,
            mobile_number: data.mobile,
            mail: data.mail,
            Active: 0,
            created_date: date,
            created_time: date,
            updated_date: date,
            updated_time: date,
            dealer_id: dealerId,
            gender: "NONE",
            user_type: 'User',
            operation_type: ['All'],
            company_name: "NONE",
            position_type: "Client"

        };

        console.log(options);


        const response = await fetch(URL, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(options)
        })

        // console.log( response.json());

        return response.json();
    }


    async function getDistributorId(id) {

        let URL = 'https://tentovision1.cloudjiffy.net/dealer_creation_dealer_id_api';

        const options = {
            dealer_id: Number(id)
        }

        console.log(options);

        const response = await fetch(URL, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(options)
        })


        return response.json();
    }


    function isNumeric(evt) {


        if (isNaN(evt)) {
            document.getElementById('mobile').value = "";
            console.log("Not");
        }
        else {
            document.getElementById('mobile').value = evt
        }

    }


    function enableDealer(e) {

        if (e.value === "distributor") {

            document.getElementById('dealer-id-div').style.display = 'block';
        }
        else if (e.value === 'customer') {

            document.getElementById('dealer-id-div').style.display = 'none';
        }

    }

    function button_click(index, id, ele) {


        console.log(index, id, ele);
        console.log(index, id);
        let obj = sites[index];
        console.log(obj);


        let cams = 0;
        let cam2 = 0;


        for (let i in sites[index]) {

            if (i != "people_count" && i != 'analytics_cam' && i != 'alert_cam' && i != "face_attendance_cam" && i != 'heat_map_cam' && i != "vehicle_count_cam") {
                cams += Number(sites[index][i])

            }
        }

        for (let o in obj) {
            if (o == "analytics_cam" || o == "face_attendance_cam" || o == "heat_map_cam" || o == "alert_cam" || o == "people_count" || o != "vehicle_count_cam") {
                cam2 += Number(obj[o]);
            }
        }
        console.log(cams, cam2);

        // sites.map(site => {
        //     for (let key in site) {
        //         if (site.hasOwnProperty(key)) { // Check to avoid inherited properties
        //             console.log(key, site[key]);
        //             if (key != 'analytics_cam') {
        //                 cams += site[key];
        //             }
        //         }
        //     }
        // })

        // console.log(cams);

        // console.log(obj[index]);


        console.log(index, id);

        if (id == "b2sub") {
            if (obj._2MP > 0) {

                if (cams > cam2) {
                    obj._2MP = Number(obj._2MP) - 1;
                    setSites([])
                }
                else {
                    alert("Sites camera shouldn't be lesser than Featured cameras!")
                }
            }
        }
        else if (id == "b2add") {
            obj._2MP = Number(obj._2MP) + 1;
            setSites([])
        }
        else if (id == "b4sub") {
            if (obj._4MP > 0) {
                if (cams > cam2) {
                    obj._4MP = Number(obj._4MP) - 1;
                    setSites([])
                }
                else {
                    alert("Sites camera shouldn't be lesser than Featured cameras!")
                }

            }
        }
        else if (id == "b4add") {
            obj._4MP = Number(obj._4MP) + 1;
            setSites([])
        }
        else if (id == "b8sub") {
            if (obj._8MP > 0) {
                if (cams > cam2) {
                    obj._8MP = Number(obj._8MP) - 1;
                    setSites([])

                }
                else {
                    alert("Sites camera shouldn't be lesser than Featured cameras!")
                }

            }
        }
        else if (id == "b8add") {
            obj._8MP = Number(obj._8MP) + 1;
            setSites([])
        }
        else if (id == "basub") {
            if (obj._2MP_24 > 0) {
                if (cams > cam2) {
                    obj._2MP_24 = Number(obj._2MP_24) - 1;
                    setSites([])
                }
                else {
                    alert("Sites camera shouldn't be lesser than Featured cameras!")
                }

            }
        }
        else if (id == "baadd") {
            // alert(1)
            obj._2MP_24 = Number(obj._2MP_24) + 1;
            setSites([])
        }
        else if (id == "bbsub") {
            if (obj._4MP_24 > 0) {
                if (cams > cam2) {
                    obj._4MP_24 = Number(obj._4MP_24) - 1;
                    setSites([])
                }
                else {
                    alert("Sites camera shouldn't be lesser than Featured cameras!")
                }

            }
        }
        else if (id == "bbadd") {
            obj._4MP_24 = Number(obj._4MP_24) + 1;
            setSites([])
        }
        else if (id == "bcsub") {
            if (obj._8MP_24 > 0) {
                if (cams > cam2) {
                    obj._8MP_24 = Number(obj._8MP_24) - 1;
                    setSites([])
                }
                else {
                    alert("Sites camera shouldn't be lesser than Featured cameras!")
                }

            }
        }
        else if (id == "bcadd") {
            obj._8MP_24 = Number(obj._8MP_24) + 1;
            setSites([])
        }
        else if (id == 'people-sub') {
            if (obj.people_count > 0) {
                obj.people_count = Number(obj.people_count) - 1;
                setSites([])
            }
        }
        else if (id == "people-add") {


            let parent_div = ele.target.parentNode.parentNode;
            let input_val = parent_div.querySelector('#people-input');

            console.log(sites[index], parent_div.querySelector('#people-input'));
            console.log(input_val);
            console.log(Number(input_val.value), cams);

            if (cams > Number(input_val.value)) {
                obj.people_count = Number(obj.people_count) + 1;
                setSites([]);
            }


        }
        else if (id == 'analytic-sub') {
            if (obj.analytics_cam > 0) {
                obj.analytics_cam = Number(obj.analytics_cam) - 1;
                setSites([])
            }
        }
        else if (id == "analytic-add") {

            let parent_div = ele.target.parentNode.parentNode;
            let input_val = parent_div.querySelector('#analytic-input');


            if (cams > Number(input_val.value)) {
                obj.analytics_cam = Number(obj.analytics_cam) + 1;
                setSites([]);
            }



        }
        else if (id == 'alert-sub') {
            if (obj.alert_cam > 0) {

                obj.alert_cam = Number(obj.alert_cam) - 1;
                setSites([])
            }
        }
        else if (id == "alert-add") {



            let parent_div = ele.target.parentNode.parentNode;
            let input_val = parent_div.querySelector('#alert-input');
            console.log(input_val);
            console.log(Number(input_val.value), cams);

            if (cams > Number(input_val.value)) {
                obj.alert_cam = Number(obj.alert_cam) + 1;
                setSites([]);
            }
        }
        else if (id == 'face-attendance-sub') {
            if (obj.face_attendance_cam > 0) {
                obj.face_attendance_cam = Number(obj.face_attendance_cam) - 1;
                setSites([])
            }
        }
        else if (id == "face-attendance-add") {



            let parent_div = ele.target.parentNode.parentNode;
            let input_val = parent_div.querySelector('#face-attendance-input');
            console.log(input_val);
            console.log(Number(input_val.value), cams);

            if (cams > Number(input_val.value)) {
                obj.face_attendance_cam = Number(obj.face_attendance_cam) + 1;
                setSites([]);
            }
        }
        else if (id == 'vehicle-sub') {
            if (obj.vehicle_count_cam > 0) {
                obj.vehicle_count_cam = Number(obj.vehicle_count_cam) - 1;
                setSites([])
            }
        }
        else if (id == "vehicle-add") {



            let parent_div = ele.target.parentNode.parentNode;
            let input_val = parent_div.querySelector('#vehicle-input');
            console.log(input_val);
            console.log(Number(input_val.value), cams);

            if (cams > Number(input_val.value)) {
                obj.vehicle_count_cam = Number(obj.vehicle_count_cam) + 1;
                setSites([]);
            }
        }
        else if (id == 'heat-map-sub') {
            if (obj.heat_map_cam > 0) {
                obj.heat_map_cam = Number(obj.heat_map_cam) - 1;
                setSites([])
            }
        }
        else if (id == "heat-map-add") {



            let parent_div = ele.target.parentNode.parentNode;
            let input_val = parent_div.querySelector('#heat-map-input');
            console.log(input_val);
            console.log(Number(input_val.value), cams);

            if (cams > Number(input_val.value)) {
                obj.heat_map_cam = Number(obj.heat_map_cam) + 1;
                setSites([]);
            }
        }

        // console.log("SITES",obj);

        const updated_array = [];
        sites.map((s, i) => {
            if (i == index) {
                updated_array.push(obj)
            }
            else {
                updated_array.push(s)
            }
        })

        console.log(updated_array);

        setSites(updated_array);
        // console.log("I am running");
        updateCamData();
    }

    console.log(sites);


    console.log(pageNumber, "PAGE NUMBER");
    if (pageNumber == 3) {
        let cams_data = JSON.parse(localStorage.getItem('camPlanData'));
        let adapter_data = JSON.parse(localStorage.getItem('adapter'));
        let hardware_data = JSON.parse(localStorage.getItem('hardwareData'));
        let storage_data = sessionStorage.getItem('storage_days')
        let subscription = JSON.parse(localStorage.getItem('subscription'));
        localStorage.setItem("dataInLocal", JSON.stringify({ cams_data: cams_data, adapter_data: adapter_data, hardware_data: hardware_data, storage_data: storage_data, subscription: subscription }));
        data_to_pass_in_props = { cams_data: cams_data, adapter_data: adapter_data, hardware_data: hardware_data, storage_data: storage_data, subscription: subscription };
    }

    const [accountype, setaccountype] = useState("")
    console.log(localStorage.getItem('accountType'))
    let userType_modal_enable = localStorage.getItem('accountType') == null ? true : false;
    const [accountypemodal, setaccountypemodal] = useState(userType_modal_enable)
    const [distributorVerificalModal, setdistributorVerificalModal] = useState(false)
    const [verificationDistributor, setverificationDistributor] = useState(false)
    const [distributorId, setDistributorId] = useState("")

    async function verfiyDistributor() {
        let URL = 'https://tentovision1.cloudjiffy.net/dealer_creation_dealer_id_api';
        const options = {
            dealer_id: Number(distributorId)
        }

        console.log(options);

        try {
            const response = await fetch(URL, {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(options)
            })

            if (response.status == 200) {
                setaccountypemodal(false)
                setaccountype('DISTRIBUTOR')
                localStorage.setItem('accountType', "DISTRIBUTOR")
            }
            else {
                setverificationDistributor(true)
                setDistributorId("")
            }

            console.log(response);
        }
        catch (err) {
            console.log(err);
        }


    }

    console.log(aiTriggeredCameraIsActive);

    return (

        accountypemodal ?
            <div style={{ position: "absolute", width: "100vw", height: "100vh", backgroundColor: "#1E1D28", zIndex: "70", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <p style={{ color: 'whitesmoke', fontSize: "45px", marginTop: "80px", textAlign: 'center' }}>Let us know who you are!</p>
                <div>
                    <div style={{ fontSize: "15px" }}><button style={{ backgroundColor: "whitesmoke", width: "12vw", minWidth: "200px", padding: "15px ", margin: "10px", borderRadius: "25px", fontSize: "15px", fontWeight: "700", color: '#1E1D28' }} onClick={() => { setaccountype("CUSTOMER"); setaccountypemodal(false); localStorage.setItem('accountType', "CUSTOMER") }}><i class="bi bi-person fa-2x" style={{ color: '#1E1D28' }}></i><div>Customer</div></button>
                    </div><button style={{ backgroundColor: "whitesmoke", width: "12vw", minWidth: "200px", padding: "15px ", margin: "10px", borderRadius: "25px", fontSize: "15px", fontWeight: "700", color: '#1E1D28' }} onClick={() => { setdistributorVerificalModal(true) }}><i class="bi bi-person-check fa-2x" style={{ color: '#1E1D28' }}></i><div>Distributor</div></button>
                </div>
                {distributorVerificalModal ? <div style={{ position: 'absolute', width: "100vw", height: "100vh", backgroundColor: "rgba(14, 14, 21, 0.45)", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: "30vw", borderRadius: "10px", minWidth: "300px", minHeight: "70vh", minHeight: "300px", backgroundColor: '#1E1D28', boxShadow: "1px 1px 10px #16161e", padding: "25px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <p style={{ textAlign: 'center', color: "whitesmoke", fontSize: "30px", fontWeight: "300" }}>Verify distributor</p>
                        <input type="text" placeholder="Distributor ID" style={{ border: 'none', margin: "20px 0px", borderRadius: "10px", outline: 'none', boxShadow: 'none', padding: "15px", width: "100%", maxWidth: "400px", minWidth: "280px" }} onChange={(e) => { setDistributorId(e.target.value) }}></input>
                        <button style={{ padding: "15px", width: "100%", maxWidth: "400px", minWidth: "280px", borderRadius: "10px", color: "whitesmoke", backgroundColor: "blue" }} onClick={() => { verfiyDistributor() }}>Verify</button>
                        {verificationDistributor ? <div style={{ width: "100%", maxWidth: "400px", minWidth: "280px", marginTop: "60px", padding: "12px", backgroundColor: '#d20000f0', borderRadius: '5px' }}>
                            <p style={{ color: 'whitesmoke', fontWeight: "600", textAlign: 'center', margin: '0px' }}>Verification Failed</p>
                        </div> : null}
                        <div>

                        </div>
                        <button style={{ padding: '13px', width: "100%", maxWidth: "400px", minWidth: "280px", border: "1px solid whitesmoke", borderRadius: "10px", marginTop: "15px", color: 'whitesmoke', fontSize: "20px", fontWeight: "400" }} onClick={() => setdistributorVerificalModal(false)}>Back</button>
                    </div>

                </div> : null}
            </div>
            :
            <>

                <div className="calc-page" style={{ display: pageNumber == 0 ? "block" : "none" }}>

                    <div className="calculator-div" id="calculator-div" style={{ backgroundColor: '#1E1D28' }}>
                        <div style={{ width: '100%', padding: '0px 0px 200px 0px' }}>

                            <div className={"head-calc"}>Cost calculator</div>

                            <div className="head-calc-points">
                                <div className="inner-points-head">
                                    <i className="bi bi-check fa-2x" style={{ marginRight: '10px', color: 'yellowgreen' }}></i>
                                    <h3>30 days free trial</h3>
                                </div>
                                <div className="inner-points-head">
                                    <i className="bi bi-check fa-2x" style={{ marginRight: '10px', color: 'yellowgreen' }}></i>
                                    <h3>Cancel anytime</h3>
                                </div>
                                <div className="inner-points-head">
                                    <i className="bi bi-check fa-2x" style={{ marginRight: '10px', color: 'yellowgreen' }}></i>
                                    <h3>Proof of Concept</h3>
                                </div>
                            </div>


                            <div className={"first-calc-div"} id="first-calc-div">
                                <h2 id="title-head-calc1">How many cameras?</h2>

                                {/* <div clas="site-div" id="site-div">
                            <div style={{ textAlign: 'center', color: 'aliceblue', margin: '20px', opacity: 0.8 }}> <h3 style={{ color: "aliceblue" }}>Site 1</h3></div>
                            <div className={"title-calc-head"} >
                                <div className={"title-head-sub"} id="first">Resolution</div>
                                <div className={"title-head-sub"} id="second">Motion Triggered</div>
                                <div className={"title-head-sub"} id="third">24/7 Continuous</div>
                            </div>



                            <div className={"calc-div1"}>

                                <div className={"calc-inn"} style={{ fontSize: "15px" }} id="first">2MP/1080p</div>


                                <div className={"calc-inn"} id="second">
                                    <button type="button" onClick={(e)=>{button_clicked(e.target.parentNode)}} className="custom-btn-red" id="b2sub" >
                                    <i style={{ color: '#0045E6' }} className={"bi bi-dash-square-fill"}></i>
                                    </button>
                                    <input type="text" onChange={(e) => {
                                        onchanged(e)
                                    }} readOnly id="2" value="0" className={"mt-1 text-center"}
                                        style={{ width: '60px' }} />
                                    <button type="button"  onClick={(e)=>{button_clicked(e.target.parentNode)}} className={"custom-btn"} id="b2add" ><i className={"bi bi-plus-square-fill"} style={{ color: '#0045E6' }}></i></button>
                                </div>

                                <div className={"calc-inn"} id="third">
                                    <button type="button"  onClick={(e)=>{button_clicked(e.target.parentNode)}} id="basub"
                                        className={"custom-btn-red"} ><i style={{ color: '#0045E6' }}
                                            className={"bi bi-dash-square-fill"}></i></button>
                                    <input type="text" value="0" className={"mt-1 text-center"} id="a" style={{ width: '60px' }} readOnly />
                                    <button type="button"  onClick={(e)=>{button_clicked(e.target.parentNode)}} id="baadd" className={"custom-btn"}><i className={"bi bi-plus-square-fill"}
                                        style={{ color: '#0045E6' }}></i></button>
                                </div>


                            </div>

                            <div className={"calc-div1"}>

                                <div className="calc-inn" style={{ fontSize: '15px' }} id="first">4MP/1080p</div>


                                <div className="calc-inn" id="second">
                                    <button type="button" onClick={(e)=>{button_clicked(e.target.parentNode)}} className="custom-btn-red" id="b4sub" ><i style={{ color: '#0045E6' }} className="bi bi-dash-square-fill"></i></button>
                                    <input type="text" onChange={(e) => { onchanged(e) }} readOnly id="4" value="0" className="mt-1 text-center" style={{ width: '60px' }} />
                                    <button type="button"  onClick={(e)=>{button_clicked(e.target.parentNode)}} className="custom-btn" id="b4add" ><i className="bi bi-plus-square-fill" style={{ color: '#0045E6' }}></i></button>
                                </div>

                                <div className="calc-inn" id="third">

                                    <button type="button"  onClick={(e)=>{button_clicked(e.target.parentNode)}} id="bbsub" className="custom-btn-red" ><i style={{ color: '#0045E6' }} className="bi bi-dash-square-fill"></i></button>
                                    <input type="text" value="0" className="mt-1 text-center" id="b" style={{ width: '60px' }} readOnly />
                                    <button type="button"  onClick={(e)=>{button_clicked(e.target.parentNode)}} id="bbadd" className="custom-btn" ><i className="bi bi-plus-square-fill" style={{ color: '#0045E6' }}></i></button>

                                </div>


                            </div>

                            <div className="calc-div1">

                                <div className="calc-inn" style={{ fontSize: '15px' }} id="first">8MP/1080p</div>


                                <div className="calc-inn" id="second">
                                    <button type="button"  onClick={(e)=>{button_clicked(e.target.parentNode)}} className="custom-btn-red" id="b8sub" ><i style={{ color: '#0045E6' }} className="bi bi-dash-square-fill"></i></button>
                                    <input type="text" onChange={(e) => { onchanged(e) }} readOnly id="8" value="0" className="mt-1 text-center" style={{ width: '60px' }} />
                                    <button type="button"  onClick={(e)=>{button_clicked(e.target.parentNode)}} className="custom-btn" id="b8add" ><i className="bi bi-plus-square-fill" style={{ color: '#0045E6' }}></i></button>
                                </div>

                                <div className="calc-inn" id="third">

                                    <button type="button"  onClick={(e)=>{button_clicked(e.target.parentNode)}} id="bcsub" className="custom-btn-red" ><i style={{ color: '#0045E6' }} className="bi bi-dash-square-fill"></i></button>
                                    <input type="text" value="0" className="mt-1 text-center" id="c" style={{ width: '60px' }} readOnly />
                                    <button type="button"  onClick={(e)=>{button_clicked(e.target.parentNode)}} id="bcadd" className="custom-btn" ><i className="bi bi-plus-square-fill" style={{ color: '#0045E6' }}></i></button>

                                </div>
                            </div>
                        </div>
                        <div className={"btn-suite-div"} style={{ marginBottom: '0px' }}>
                            <div>
                                <div style={{ color: 'whitesmoke', fontSize: 'medium', margin: '10px 0px', fontWeight: 600 }}>Analytics cameras</div>
                                <button type="button" onClick={(e)=>{button_clicked(e.target.parentNode)}} id="a-sub" className="custom-btn-red" ><i style={{ color: '#0045E6' }} className="bi bi-dash-square-fill"></i></button>
                                <input type="text" value="0" className="mt-1 text-center" id="a-input"
                                    style={{ width: '60px' }} readOnly />
                                <button type="button" onClick={(e)=>{
                                button_clicked(e.target.parentNode)}} id="a-add" className="custom-btn">
                                    <i className="bi bi-plus-square-fill" style={{ color: '#0045E6' }}></i></button>
                            </div>
                        </div> */}

                                {
                                    sites.length != 0 ? sites.map((o, i) => {
                                        return (

                                            <div id={`site-div${i}`} >
                                                <div className={`site-div${i}`} style={{ marginTop: '50px' }}>

                                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', padding: '0px 200px' }}>
                                                        {i + 1 != 1 ? <i className="bi bi-trash" style={{ cursor: 'pointer', color: "white" }} onClick={(e) => { removeSite(i); }}></i> : <></>}
                                                    </div>
                                                    <div style={{ textAlign: 'center', color: 'aliceblue', margin: '20px', opacity: 0.8 }}>
                                                        <h3 style={{ color: 'aliceblue' }} className="site-name">Site {i + 1}</h3>
                                                    </div>
                                                    <div className="title-calc-head" >
                                                        <div className="title-head-sub" id="first">Resolution</div>
                                                        <div className="title-head-sub" id="second">Motion Triggered</div>
                                                        <div className="title-head-sub" id="third">24/7 Continuous</div>
                                                    </div>



                                                    <div className="calc-div1">

                                                        <div className="calc-inn" style={{ fontSize: '15px' }} id="first">2MP/1080p</div>


                                                        <div className="calc-inn" id="second">
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id) }} className="custom-btn-red" id="b2sub"><i style={{ color: '#0045E6' }} className="bi bi-dash-square-fill"></i></button>
                                                            <input type="text" readOnly id="2" value={o._2MP} className="mt-1 text-center" style={{ width: '60px' }} />
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id) }} className="custom-btn" id="b2add" ><i className="bi bi-plus-square-fill" style={{ color: '#0045E6' }}></i></button>
                                                        </div>

                                                        <div className="calc-inn" id="third">
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id) }} id="basub" className="custom-btn-red" ><i style={{ color: '#0045E6' }} className="bi bi-dash-square-fill"></i></button>
                                                            <input type="text" value={o._2MP_24} className="mt-1 text-center" id="a" style={{ width: '60px' }} readOnly />
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id) }} id="baadd" className="custom-btn"><i className="bi bi-plus-square-fill" style={{ color: '#0045E6' }}></i></button>
                                                        </div>


                                                    </div>

                                                    <div className="calc-div1">

                                                        <div className="calc-inn" style={{ fontSize: '15px' }} id="first">4MP/1080p</div>


                                                        <div className="calc-inn" id="second">
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id) }} className="custom-btn-red" id="b4sub" ><i style={{ color: '#0045E6' }} className="bi bi-dash-square-fill"></i></button>
                                                            <input type="text" readOnly id="4" value={o._4MP} className="mt-1 text-center" style={{ width: '60px' }} />
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id) }} className="custom-btn" id="b4add" ><i className="bi bi-plus-square-fill" style={{ color: '#0045E6' }}></i></button>
                                                        </div>

                                                        <div className="calc-inn" id="third">

                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id) }} id="bbsub" className="custom-btn-red" ><i style={{ color: '#0045E6' }} className="bi bi-dash-square-fill"></i></button>
                                                            <input type="text" value={o._4MP_24} className="mt-1 text-center" id="b" style={{ width: '60px' }} readOnly />
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id) }} id="bbadd" className="custom-btn" ><i className="bi bi-plus-square-fill" style={{ color: '#0045E6' }}></i></button>

                                                        </div>


                                                    </div>

                                                    <div className="calc-div1">

                                                        <div className="calc-inn" style={{ fontSize: '15px' }} id="first">8MP/1080p</div>


                                                        <div className="calc-inn" id="second">
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id) }} className="custom-btn-red" id="b8sub" ><i style={{ color: '#0045E6' }} className="bi bi-dash-square-fill"></i></button>
                                                            <input type="text" readOnly id="8" value={o._8MP} className="mt-1 text-center" style={{ width: '60px' }} />
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id) }} className="custom-btn" id="b8add" ><i className="bi bi-plus-square-fill" style={{ color: '#0045E6' }}></i></button>
                                                        </div>

                                                        <div className="calc-inn" id="third">

                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id) }} id="bcsub" className="custom-btn-red" ><i style={{ color: '#0045E6' }} className="bi bi-dash-square-fill"></i></button>
                                                            <input type="text" value={o._8MP_24} className="mt-1 text-center" id="c" style={{ width: '60px' }} readOnly />
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id) }} id="bcadd" className="custom-btn" ><i className="bi bi-plus-square-fill" style={{ color: '#0045E6' }}></i></button>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="analtic-btn-con">
                                                    <div style={{ color: "whitesmoke", textAlign: "center", margin: '20px', fontSize: "20px" }}>AI triggered features</div>
                                                    <div style={{ display: 'flex', flex: 'wrap', flexWrap: 'wrap', justifyItems: "start", justifyContent: 'center', columnGap: "50px", padding: "10px 10px 30px 10px", width: "100%", }}>

                                                        <div style={{ display: aiTriggeredCameraIsActive['people_count'] == 1 ? "block" : "none" }}>
                                                            <div style={{ color: 'whitesmoke', fontSize: 'medium', margin: '10px 0px', fontWeight: 100, textAlign: 'center', }}>People Count</div>
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id, e) }} id="people-sub" className="custom-btn-red" ><i style={{ color: '#0045E6' }} className="bi bi-dash-square-fill"></i></button>
                                                            <input type="text" value={o.people_count} className="mt-1 text-center" id="people-input" style={{ width: '60px' }} readOnly />
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id, e) }} id="people-add" className="custom-btn" ><i className="bi bi-plus-square-fill" style={{ color: '#0045E6' }}></i></button>
                                                        </div>

                                                        <div style={{ display: aiTriggeredCameraIsActive['analytics'] == 1 ? "block" : "none" }}>
                                                            <div style={{ color: 'whitesmoke', fontSize: 'medium', margin: '10px 0px', fontWeight: 100, textAlign: 'center', }}>Analytics cameras</div>
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id, e) }} id="analytic-sub" className="custom-btn-red" ><i style={{ color: '#0045E6' }} className="bi bi-dash-square-fill"></i></button>
                                                            <input type="text" value={o.analytics_cam} className="mt-1 text-center" id="analytic-input" style={{ width: '60px' }} readOnly />
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id, e) }} id="analytic-add" className="custom-btn" ><i className="bi bi-plus-square-fill" style={{ color: '#0045E6' }}></i></button>
                                                        </div>
                                                        <div style={{ display: aiTriggeredCameraIsActive['alert'] == 1 ? "block" : "none" }}>
                                                            <div style={{ color: 'whitesmoke', fontSize: 'medium', margin: '10px 0px', fontWeight: 100, textAlign: 'center' }}>Alert cameras</div>
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id, e) }} id="alert-sub" className="custom-btn-red" ><i style={{ color: '#0045E6' }} className="bi bi-dash-square-fill"></i></button>
                                                            <input type="text" value={o.alert_cam} className="mt-1 text-center" id="alert-input" style={{ width: '60px' }} readOnly />
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id, e) }} id="alert-add" className="custom-btn" ><i className="bi bi-plus-square-fill" style={{ color: '#0045E6' }}></i></button>
                                                        </div>
                                                        <div style={{ display: aiTriggeredCameraIsActive['face_attenance'] == 1 ? "block" : "none" }}>
                                                            <div style={{ color: 'whitesmoke', fontSize: 'medium', margin: '10px 0px', fontWeight: 100, textAlign: 'center' }}>Face attendance</div>
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id, e) }} id="face-attendance-sub" className="custom-btn-red" ><i style={{ color: '#0045E6' }} className="bi bi-dash-square-fill"></i></button>
                                                            <input type="text" value={o.face_attendance_cam} className="mt-1 text-center" id="face-attendance-input" style={{ width: '60px' }} readOnly />
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id, e) }} id="face-attendance-add" className="custom-btn" ><i className="bi bi-plus-square-fill" style={{ color: '#0045E6' }}></i></button>
                                                        </div>
                                                        <div style={{ display: aiTriggeredCameraIsActive['heat_map'] == 1 ? "block" : "none" }}>
                                                            <div style={{ color: 'whitesmoke', fontSize: 'medium', margin: '10px 0px', fontWeight: 100, textAlign: 'center' }}>Heat map</div>
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id, e) }} id="heat-map-sub" className="custom-btn-red" ><i style={{ color: '#0045E6' }} className="bi bi-dash-square-fill"></i></button>
                                                            <input type="text" value={o.heat_map_cam} className="mt-1 text-center" id="heat-map-input" style={{ width: '60px' }} readOnly />
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id, e) }} id="heat-map-add" className="custom-btn" ><i className="bi bi-plus-square-fill" style={{ color: '#0045E6' }}></i></button>
                                                        </div>

                                                        <div style={{ display: aiTriggeredCameraIsActive['vehicle_count_cam'] == 1 ? "block" : "none" }}>
                                                            <div style={{ color: 'whitesmoke', fontSize: 'medium', margin: '10px 0px', fontWeight: 100, textAlign: 'center' }}>Vehicle count</div>
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id, e) }} id="vehicle-sub" className="custom-btn-red" ><i style={{ color: '#0045E6' }} className="bi bi-dash-square-fill"></i></button>
                                                            <input type="text" value={o.vehicle_count_cam} className="mt-1 text-center" id="vehicle-input" style={{ width: '60px' }} readOnly />
                                                            <button type="button" onClick={(e) => { button_click(i, e.target.parentNode.id, e) }} id="vehicle-add" className="custom-btn" ><i className="bi bi-plus-square-fill" style={{ color: '#0045E6' }}></i></button>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>)
                                    }) : null



                                }

                            </div>


                            <div id="site-div-additional" style={{ minHeight: '0px' }}>

                            </div>

                            {/* <div className="btn-suite-div" id="add-site-div" style={{ marginTop: '20px' }}> <button className="add-ste-btn" onClick={() => { addSiteNew() }}>+ Add site</button></div> */}


                            <div className="slider-div" id="slider-div">
                                <div>
                                    <h3 style={{ color: 'aliceblue', width: '100%', textAlign: 'center', marginTop: '30px' }}>Select cloud storage duration</h3>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <div className="days-div">
                                        {
                                            storageOptions.map(s => {
                                                return <p className="days" >{String(s)}</p>
                                            })
                                        }

                                    </div>
                                </div>
                                <div className="days-slider" id="slider" >
                                    <input style={{ width: '100%' }} type="range" className="form-range" min="0" form-range-track-height="1rem" max={storageOptions.length - 1} step="1"
                                        onChange={(e) => { showCamsEstimationPage2() }} data-slider-value="1" tooltip="always" id="customRange2" />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', minHeight: '50px' }}>
                                    <div style={{ minWidth: '200px', padding: '25px 15px', minHeight: '30px', margin: '10px', border: 'solid', borderColor: 'aliceblue' }}>
                                        <h1 id="dollar-month" style={{ color: 'aliceblue', fontSize: 'medium', fontWeight: 600, textAlign: 'center', marginTop: '10px' }}></h1>
                                        {/* <!-- <h1 id="site-mth" style="color: aliceblue; font-size: medium; font-weight: 600; text-align: center;">Accross 1 site</h1> --> */}
                                        <div className="" style={{ alignItems: 'center', color: 'whitesmoke', marginTop: '20px', fontSize: '20px', fontWeight: 550 }} id="para-con-secondPage">
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '20px' }}>
                                <button onClick={(e) => { nextCalcSlider(e.target) }} id="back-btn" style={{ padding: '10px 50px', border: 'solid', color: 'aliceblue', borderColor: 'aliceblue', borderRadius: '20px', fontWeight: 600, marginTop: '30px' }}>Back</button>
                                <button onClick={(e) => { nextCalcSlider(e.target) }} id="continue-btn" style={{ padding: '10px 50px', backgroundColor: 'aliceblue', borderRadius: '20px', fontWeight: 600, marginTop: '30px' }} >Continue</button>
                            </div>

                        </div>
                    </div>

                    <div className="quote-div" id="quote-div" style={{ backgroundColor: '#1E1D28', margin: '0px' }}>
                        <div style={{ width: '100%', padding: '0px 0px 200px 0px' }}>

                            <h1 style={{ color: 'aliceblue', paddingTop: '120px', textAlign: 'center', fontWeight: 600 }}>Your Quote</h1>

                            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center' }}>

                                <div className="quote-cam-con">
                                    <h3 style={{ fontWeight: 700 }}>Recurring Charge</h3>
                                    <div className="quote-inn-div" style={{ color: 'whitesmoke' }}>
                                        <div className="quote-inn-div2" id="inn-div-quote" style={{ color: 'whitesmoke', fontSize: '20px' }}>
                                        </div>
                                        <div className="quote-inn-div2-2">



                                            <div id="inn-div-pur">
                                                <div><input type="checkbox" className="check-plan" value="monthly"
                                                    onChange={(e) => { onChangeQuotePlan(e.target) }} checked /></div>
                                                <div style={{ display: 'none' }}><input type="checkbox" className="check-plan" value="yearly"
                                                    onChange={(e) => { onChangeQuotePlan(e.target) }} /></div>
                                            </div>

                                            <div id="inn-div-pur2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <p style={{ fontWeight: 600, fontSize: '18px' }} id="per-month-check">Month</p>
                                                <p style={{ opacity: 0.5 }}>Cancel Anytime</p>
                                                <p style={{ margin: '5px', fontWeight: 400, display: 'none' }}>OR</p>
                                                <p style={{ fontWeight: 600, fontSize: '16px', display: 'none' }} id="per-year-check">Per Year</p>
                                                <p style={{ opacity: 0.5, display: 'none' }}>10% discount</p>
                                            </div>

                                        </div>
                                    </div>

                                </div>

                                <div className="quote-cam-con" id="adapter-con">
                                    <h3 style={{ fontWeight: 700, }}>One-Off Hardware charge</h3>
                                    <div className="quote-inn-div">
                                        <div className="quote-inn-div2" id="hardware-div" style={{ color: "whitesmoke", fontSize: '20px' }}>
                                        </div>
                                        <div className="quote-inn-div2-2" id="div2-inner-quote">
                                            <p id="sites-div" style={{ color: 'whitesmoke', fontWeight: '600', fontSize: '30px' }}></p>
                                            <p style={{ fontWeight: 600, color: 'whitesmoke', fontSize: '26px' }} id="hardware-amt-div"></p>
                                            <p style={{ color: 'whitesmoke', fontSize: '18px', fontWeight: '700', textAlign: 'center', opacity: 0.8 }}>One-off payment</p>


                                        </div>
                                    </div>

                                </div>


                                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <input id="adapt-req" type="checkbox" onClick={(e) => { checkIsAdapterRequired(e) }} /><span style={{ marginLeft: '10px', color: 'whitesmoke' }}>I already have a Cloud Adapter</span>
                                </div>
                            </div>

                            {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><button id="email-btn" >Email this Quote</button></div> */}

                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '20px' }}>
                                <button onClick={(e) => { nextCalcSlider(e.target) }} id="back-btn" className="back-btn">Back</button>
                                <button onClick={(e) => { nextCalcSlider(e.target) }} id="co" className="cont-btn">Continue</button>
                            </div>


                        </div>
                    </div>


                    <div />
                </div>
                <div className="signup-page" style={{ display: pageNumber == 1 ? "block" : "none" }}>
                    <Signup setPageNumber={setPageNumber} data={data_to_pass_in_props} />
                </div>
                <div className="login-page" style={{ display: pageNumber == 2 ? "block" : "none" }}>
                    <Login setPageNumber={setPageNumber} data={data_to_pass_in_props} />
                </div>
                <div className="payment-page" style={{ display: pageNumber == 3 ? "block" : "none" }}>
                    <Payment setPageNumber={setPageNumber} data={data_to_pass_in_props} />
                </div>
            </>



    )
}


