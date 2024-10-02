import { useState } from 'react'
import axios from "axios"
import { load } from '@cashfreepayments/cashfree-js'
import CircularProgress from '@mui/material/CircularProgress';


function CashFree({ user_data, sub_data, hardware_data, total_cost, buy_flag }) {
    console.log(user_data)

    const [flag, setflag] = useState(false)

    let cashfree;

    let insitialzeSDK = async function () {

        cashfree = await load({
            mode: "production",
        })
    }

    insitialzeSDK()

    const [orderId, setOrderId] = useState("")



    const getSessionId = async () => {
        console.log(user_data)
        try {
            let res = await axios.post("https://tentovision1.cloudjiffy.net/payment", {
                amount: total_cost,
                currency: 'INR',
                name: user_data.User_name,
                customer_details: {
                    "customer_id": user_data._id,
                    "customer_phone": user_data.mobile_number,
                    "customer_name": user_data.User_name,
                    "customer_email": user_data.mail
                },
            })

            console.log(res.data)
            if (res.data && res.data.payment_session_id) {

                console.log(res.data)
                setOrderId(res.data.order_id)
                setflag(false)
                return { sessionId: res.data.payment_session_id, orderId: res.data.order_id }
            } else {
                alert(res.data.error)
            }


        } catch (error) {
            console.log(error)
        }
    }

    const verifyPayment = async (order_id) => {
        try {

            let res = await axios.post("https://tentovision1.cloudjiffy.net/verify", {
                orderId: order_id
            })

            if (res && res.data) {
                alert("payment verified")
                // Get the current URL
                let currentURL = window.location.href;
                let newURL = currentURL.replace('/CostCalculator', '/success');
                window.location.href = newURL;
            }
            console.log(res.data);

        } catch (error) {
            console.log(error)
        }
    }

    const handleClick = async (e) => {
        // setflag(true)
        try {
            let obj = await getSessionId()
            console.log(obj);
            let sessionId = obj.sessionId
            console.log(sessionId,'sessien_id');
            console.log(obj);
            let checkoutOptions = {
                paymentSessionId: sessionId,
                redirectTarget: "_modal",
            }

            cashfree.checkout(checkoutOptions).then(async (res) => {
                console.log("payment initialized")
                axios.post("https://tentovision1.cloudjiffy.net/save_sub_plan", {
                    sub: { ...sub_data, cameras: [{ ...sub_data.cameras[0], device: hardware_data }] },
                    dealer_id: user_data.dealer_id,
                    orderId: obj.orderId,
                    gateway_name: 'Cashfree',
                    amount: total_cost
                }).then((response) => {
                    console.log(response.data);
                }).catch((e) => {
                    console.log(e);
                })

                verifyPayment(obj.orderId)
            })


        } catch (error) {
            console.log(error)
        }

    }
    return (
        <>

            <h3 style={{ color: flag == true ? 'grey' : 'white', textAlign: 'center', fontWeight: '600', borderRadius: '5px', padding: '5px', border: flag == true ? 'grey' : '2px solid blue', margin: 0, cursor: 'pointer' }} onClick={() => {
                console.log(flag)
                if (flag == false) {
                    handleClick()
                }
            }}> {flag == true ? <CircularProgress /> : 'Pay Now'}</h3>

        </>
    )
}

export default CashFree