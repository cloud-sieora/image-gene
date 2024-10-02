import { useState } from "react";
import { useLocation } from "react-router-dom";
import Cashfree from './Cashfree'

export default function Payment(props) {

    let datas = JSON.parse(localStorage.getItem('dataInLocal'));

    const [ADAPTER_YEARLY_PRICE, SET_ADAPTER_YEARLY_PRICE] = useState(0);
    const [ADAPTER_MONTHLY_PRICE, SET_ADAPTER_MONTHLY_PRICE] = useState(0);

    const [cardNumber, setCardNumber] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [cardExpiryDate, setCardExpiryDate] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [buy_flag, setbuy_flag] = useState(false);
    const [paymentId, setPaymentId] = useState("");

    if (datas != null) {
        let yearlyDiscountPercentage = localStorage.getItem('yearlyCamDiscount');
        console.log(yearlyDiscountPercentage);

        console.log(props.data);

        console.log(datas);

        const array_cam = ["_2mp", "_4mp", "_8mp", "continues", "options", "start_date", "start_time", "end_date", "end_time"]

        var hardwares_array = [];
        var total_harware_charge = 0;

        // const { state } = useLocation();
        // console.log(state);
        let client_id = localStorage.getItem('clientId') != null || "" || undefined ? localStorage.getItem('clientId') : 0;

        console.log(localStorage.getItem('uservalue'));
        let userData = JSON.parse(localStorage.getItem('uservalue')) != null || "" || undefined ? JSON.parse(localStorage.getItem('uservalue')) : "";

        


        const { adapter_data, cams_data, hardware_data, storage_data, subscription } = datas;

        const { analytics_cam, _2MP, _2MP_24, _4MP, _4MP_24, _8MP, _8MP_24 } = cams_data;

        console.log(cams_data);


        let total_no_of_motion_cameras = cams_data['_2MP']['QTY'] + cams_data['_4MP']['QTY'] + cams_data['_8MP']['QTY'];
        let total_no_of_live_cameras = cams_data['_2MP_24']['QTY'] + cams_data['_4MP_24']['QTY'] + cams_data['_8MP_24']['QTY'];

        let date = new Date();

        //Start Date
        let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        let year = date.getFullYear();

        let start_date = year + "-" + month + "-" + day;

        //Start Time
        let hour = date.getHours();
        let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        let second = date.getSeconds();

        let start_time = hour + ":" + minute;

        //End date
        let duration = 0;

        let durationDays = String(storage_data).split('y')

        if (durationDays[durationDays.length - 1] == 'ear') {

        }
        else {
            durationDays = String(storage_data).split('d')
        }

        let duraType = durationDays[durationDays.length - 1]

        console.log(duraType);

        if (duraType == 'ear') {
            duration = Number(String(durationDays[0]).trim()) * 365
        }
        else if (duraType == 'ay') {
            duration = Number(String(durationDays[0]).trim())
        }

        // if (subscription == 'monthly') {
        //     duration = storage_data;
        // }
        // else if (subscription == 'yearly') {
        //     duration = 365
        // }
        let end_date = getDateFromToday(duration)

        // End time equal to start time
        let end_time = start_time;








        // date = date.replace('/','-');
        // date = date.replace('/','-');




        let body_obj = {
            "cameras": [
                {
                    _2mp: {
                        motion: {
                            motion: cams_data['_2MP']['QTY'],
                            plan_id: cams_data['_2MP']['_id'],
                            payment_id: paymentId
                        },
                        continues: {
                            continues: cams_data['_2MP_24']['QTY'],
                            plan_id: cams_data['_2MP_24']['_id'],
                            payment_id: paymentId
                        }
                    },
                    _4mp: {
                        motion: {
                            motion: cams_data['_4MP']['QTY'],
                            plan_id: cams_data['_4MP']['_id'],
                            payment_id: paymentId
                        },
                        continues: {
                            continues: cams_data['_4MP_24']['QTY'],
                            plan_id: cams_data['_4MP_24']['_id'],
                            payment_id: paymentId
                        }
                    },
                    _8mp: {
                        motion: {
                            motion: cams_data['_8MP']['QTY'],
                            plan_id: cams_data['_8MP']['_id'],
                            payment_id: paymentId
                        },
                        continues: {
                            continues: cams_data['_8MP_24']['QTY'],
                            plan_id: cams_data['_8MP_24']['_id'],
                            payment_id: paymentId
                        }
                    },
                    options: {
                        alert: cams_data['alert_cam']['QTY'],
                        analytics: cams_data['analytics_cam']['QTY'],
                        cloud: 0,
                        local: 0,
                        face_dedaction: cams_data['face_attenance_cam']['QTY'],
                        motion: total_no_of_motion_cameras,
                        live: total_no_of_live_cameras
                    },
                    start_date: start_date,
                    start_time: start_time,
                    end_date: end_date,
                    end_time: end_time
                }
            ],
            client_id: client_id
        }


        console.log(body_obj);

        var total_price_monthly = 0;
        var total_price_yearly = 0;
        var analytic_paragraph = "";

        let plan_duration_type = "";

        // if (subscription == 'yearly') {

        //     plan_duration_type = `1 year`
        // }
        // else {
        //     if (storage_data >= 365) {
        //         let year = storage_data / 365;
        //         plan_duration_type = `${year} year`
        //     }
        //     else {
        //         plan_duration_type = `${storage_data} Days`
        //     }
        // }

        var storage_paragraph = String(`${storage_data} storage`);

        let sitesData = JSON.parse(localStorage.getItem('sitesData'));

        console.log(sitesData);

        // console.log(state);
        console.log(analytics_cam, _2MP, _2MP_24, _4MP, _4MP_24, _8MP, _8MP_24);

        console.log(cams_data);
        console.log(adapter_data);
        console.log(hardware_data);
        console.log(storage_data);
        console.log(subscription);


        for (let h in hardware_data) {
            console.log(hardware_data[h]);
            let para = ` 1 x ${hardware_data[h]['variant']} Channel cloud adapter - ₹${Number(hardware_data[h]['price']).toFixed(2)}`;
            total_harware_charge += Number(hardware_data[h]['price']);
            hardwares_array.push(String(para));
        }

        console.log(total_harware_charge);

        console.log(cams_data);


        console.log(hardwares_array);

        var cam_data = []

        function setHardwareDivPaymentPage() {

            let camDiv = document.getElementById('quote-div')
            // camDiv.innerHTML = "";
            console.log(camDiv);

            for (let cam in cams_data) {


                let pricePerCam = Number(cams_data[cam]['price']) * Number(cams_data[cam]['QTY'])


                if (cams_data[cam]['QTY'] != 0) {

                    // Price shown in right side div
                    total_price_monthly += pricePerCam;

                    let cost = Number(cams_data[cam]['price']) * Number(cams_data[cam]['QTY'])

                    // Pushed in ca_data array this will be mapped and show in price div
                    cam_data.push(String(`${cams_data[cam]['QTY']} x ${cams_data[cam]['CAM']} - ₹${cost}`));

                }
            }
        }


        setHardwareDivPaymentPage();

        console.log(total_price_monthly, total_price_yearly);


        var total_cost = 0;



        console.log(total_cost);

        setHardwareDivPaymentPage();

        if (subscription == "monthly") {

            console.log(total_price_monthly);
            total_cost = total_price_monthly + total_harware_charge
        }
        else if (subscription == "yearly") {

            total_cost = total_price_yearly + total_harware_charge
        }


        return (
            <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#1E1D28' }}>
                <div className="quote-div" id="quote-div" style={{ backgroundColor: '#1E1D28', margin: '0px', display: "flex" }}>

                    <div style={{ width: '100%', padding: '0px 0px 20px 0px' }}>

                        <div style={{ display: 'flex', alignItems: 'flex-end', padding: "50px 20px 0px 20px" }}>
                            <button style={{ color: 'whitesmoke', fontWeight: '500', border: '1px solid white', padding: '10px 20px', borderRadius: '5px' }} onClick={() => { props.setPageNumber(2); localStorage.removeItem('clientId') }}>Log Out</button>
                        </div>

                        <h1 style={{ color: 'aliceblue', paddingTop: '120px', textAlign: 'center', fontWeight: 600 }}>Your Quote</h1>

                        <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center' }}>

                            <div className="quote-cam-con" id="quote-cam-con">
                                <h3 style={{ fontWeight: 700 }}>Recurring Charge</h3>
                                <div className="quote-inn-div" style={{ color: 'whitesmoke' }}>
                                    <div className="quote-inn-div2" id="inn-div-quote" style={{ color: 'whitesmoke', fontSize: '20px' }}>
                                        {
                                            cam_data.map((c) => {

                                                return (
                                                    <p style={{ color: 'white', fontWeight: 400 }}>{c}</p>
                                                )
                                            })
                                        }
                                        <p style={{ color: 'white', fontWeight: 'bold' }}>{analytic_paragraph}</p>
                                        <p style={{ color: 'white', fontWeight: 'bold', fontSize: '30px' }}>{storage_paragraph}</p>
                                    </div>
                                    <div className="quote-inn-div2-2">

                                        <div id="inn-div-pur">
                                            <div><input type="checkbox" className="check-plan" id="check-plan-monthly" value="monthly"
                                                checked={subscription == 'monthly' ? true : false} /></div>
                                            {/* <div><input type="checkbox" className="check-plan" id="check-plan-yearly" value="yearly"
                                                checked={subscription == 'yearly' ? true : false} /></div> */}
                                        </div>

                                        <div id="inn-div-pur2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                            <p style={{ fontWeight: 600, fontSize: '20px' }} id="per-month-check">{'₹' + Number(total_price_monthly).toFixed(2)} / Month</p>
                                            <p style={{ opacity: 0.5 }}>Cancel Anytime</p>
                                            {/* <p style={{ margin: '5px', fontWeight: 400 }}>OR</p>
                                            <p style={{ fontWeight: 600, fontSize: '16px' }} id="per-year-check">{'₹' + Number(total_price_yearly).toFixed(2)} / Year</p>
                                            <p style={{ opacity: 0.5 }}>10% discount</p> */}
                                        </div>

                                    </div>
                                </div>

                            </div>

                            <div className="quote-cam-con" id="adapter-con" style={{ display: adapter_data == true ? 'none' : 'block' }}>
                                <h3 style={{ fontWeight: 700, }}>One-Off Hardware charge</h3>
                                <div className="quote-inn-div">
                                    <div className="quote-inn-div2" id="hardware-div" style={{ color: "whitesmoke", fontSize: '20px' }}>
                                        {
                                            hardwares_array.map((h) => {
                                                return (
                                                    <p style={{ color: 'whitesmoke', fontWeight: 'bold', fontSize: '21px' }}>{h}</p>
                                                )
                                            })

                                        }
                                    </div>
                                    <div className="quote-inn-div2-2" id="div2-inner-quote">
                                        <p id="sites-div" style={{ color: 'whitesmoke', fontWeight: '600', fontSize: '30px' }}></p>
                                        <p style={{ fontWeight: 600, color: 'whitesmoke', fontSize: '26px' }} id="hardware-amt-div">{"₹" + Number(total_harware_charge).toFixed(2)}</p>
                                        <p style={{ color: 'whitesmoke', fontSize: '22px', fontWeight: '300', textAlign: "center", opacity: 0.7 }}>One-off payment</p>
                                    </div>
                                </div>

                            </div>
                        </div>




                    </div>
                </div>

                <h3 style={{ color: 'whitesmoke', textAlign: 'center', margin: "50px 0px", fontWeight: '600' }}>Make Payment</h3>

                <div className="payment-integration-div">

                    <Cashfree user_data={userData} sub_data={body_obj} hardware_data={hardware_data} total_cost={total_cost} buy_flag={setbuy_flag} />

                    {/* <div className="payment-main-div">
                        <h5 style={{ color: "whitesmoke", fontWeight: 700, margin: '5px 20px' }}>Pay using Stripe</h5>
                        <div style={{ width: '100%', height: '3px', backgroundColor: 'whitesmoke', margin: '10px 0px 0px 0px' }}></div>
                        <div style={{ width: '100%', height: '10px', backgroundColor: 'white', opacity: "0.7", margin: '0px' }}></div>

                        <div style={{ padding: '10px' }}>
                            <Stripe user_data={userData} sub_data={body_obj} hardware_data={hardware_data} total_cost={total_cost} buy_flag={setbuy_flag}/>
                            <Cashfree user_data={userData} sub_data={body_obj} hardware_data={hardware_data} total_cost={total_cost} buy_flag={setbuy_flag} />
                        </div>

                        <div className="payment-inputs-div">
                            <div className="payment-input-div" style={{ width: '100%' }}>
                                <label>Card Number</label>
                                <input type="text" placeholder="1234 5678 9123" maxLength={14} pattern="\d{14}" required></input>
                            </div>
                            <div className="payment-div-innn" style={{ display: "flex", width: "100%" }}>
                                <div className="payment-input-div" style={{ width: '30%' }}>
                                    <label>CVV</label>
                                    <input type="text" placeholder="CVV" maxLength={3} style={{ width: '100%' }} required></input>
                                </div>
                                <div className="payment-input-div" style={{ width: '50%' }}>
                                    <label>Expiry Date</label>
                                    <div className="expiry-date-div" >
                                        <input style={{ width: '30%' }} type="text" id="expiry-month" name="expiry-month" placeholder="MM" maxlength="2" pattern="0[1-9]|1[0-2]" required />
                                        <span style={{ color: "whitesmoke", margin: "0px 5px", fontSize: '20px' }}>/</span>
                                        <input style={{ width: '30%' }} type="text" id="expiry-year" name="expiry-year" placeholder="YY" maxlength="2" pattern="\d{2}" required />
                                    </div>
                                </div>
                            </div>

                            <div className="payment-input-div" style={{ width: '100%' }}>
                                <label>Cardholder's Name</label>
                                <input type="text" placeholder="Cardholder Name"></input>
                            </div>


                        </div>

                    </div> */}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', padding: "50px 0px" }}>
                    <button style={{ color: 'white', fontWeight: '400', textDecoration: 'underline' }} onClick={() => props.setPageNumber(0)}>Return to Cost calculator</button>
                </div>

            </div>
        )




    }
    else {
        return (<p>No Data</p>)
    }


    function getDateFromToday(days) {
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + days);

        const year = futureDate.getFullYear();
        const month = String(futureDate.getMonth() + 1).padStart(2, '0');
        const day = String(futureDate.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}