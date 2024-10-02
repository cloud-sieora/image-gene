
import { useState } from "react";
import { withRouter } from 'react-router-dom'
import './App.css'
import './index.css'

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import '@fortawesome/fontawesome-free/css/all.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import countries_name from "./countries_name";
export default function Signup(props) {

    const [divState, setDivState] = useState(0)
    const [evaluate, setEvaluate] = useState(false);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [type, settype] = useState("customer");
    const [mobile, setMobile] = useState("");
    const [privacyPolicy, setPrivacyPolicy] = useState(false);
    const [updates, setUpdates] = useState(false);
    const [dealerId, setDealerId] = useState("");
    const [custData, setCustData] = useState({});
    const [address_line1, set_address_line1] = useState("");
    const [postal_code, set_postal_code] = useState("");
    const [city, setCity] = useState("");
    const [State, setState] = useState("");
    const [country, setCountry] = useState("")



    console.log(countries_name);

    function enableDealer(e) {

        settype(e.value)

        if (e.value === "distributor") {

            document.getElementById('dealer-id-div').style.display = 'block';
        }
        else if (e.value === 'customer') {

            document.getElementById('dealer-id-div').style.display = 'none';
        }

    }


    function showAddressDiv() {

        if (name != "" && email != "" && mobile != "" && password != "") {


            if (password != confirm_password) {
                alert("Incorrect password try again");
                document.getElementById('confirmpassword').value = "";
            }
            else {

                if (privacyPolicy == false) {
                    alert("Please agree to the privacy policy")
                }
                else {
                    setDivState(1);
                    document.getElementById('address-div').style.display = 'block';
                    document.getElementById('user-div').style.display = 'none';
                }
            }


        }
        else {
            alert("Please fill the required fields")
        }



    }

    function isNumeric(evt) {



        if (isNaN(evt)) {
            document.getElementById('mobile').value = "";
            console.log("Not");
        }
        else {
            setMobile(evt)
        }

    }

    async function submitForm() {

        let Evaluate = evaluate;
        let Password = password
        let Confirm_password = confirm_password
        let Name = name
        let Email = email
        let Mobile = mobile
        let Type = type
        let Privacy_policy = privacyPolicy;
        let Updates_email = updates
        let Dealer_ID = dealerId

        let data_obj = {

            name: Name,
            mail: Email,
            mobile: Mobile,
            type: Type,
            password, Password,
            DEALER_ID: Dealer_ID,
            address: {
                line1: address_line1,
                postal_code: postal_code,
                city: city,
                state: State,
                country: country,
            }
        }

        console.log(data_obj);

        if (address_line1 != "" && State != "" && country != "" && postal_code != "" && city != "") {




            let data = await createUser(data_obj);
            console.log(data);

            if (data == "User ID already exist") {
                alert("User already exixts")
            }
            else if (data.status = 200) {
                setCustData(data)
                alert("Signup successful");
                localStorage.setItem('clientId', data._id)
                localStorage.setItem('uservalue',  JSON.stringify(data))
                props.setPageNumber(3)
                // navigate('/payment', { state: data })
            }
            console.log(data);



        }
        else {
            alert("Please fill all the required fields Page 2")
        }


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

            client_id: Math.floor(new Date().getTime() / 1000),
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
            position_type: "Client",
            address: data.address

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





    return (
        <main id="main" className="service-main" style={{ backgroundColor: "#1E1D28", margin: '0px', paddingTop: "100px", paddingBottm: '50px', minHeight: '100vh' }}>

            <div style={{
                width: '100%',
                minHeight: '200px',
            }} id="create-account-div">

                <h1 style={{
                    textAlign: 'center',
                    color: 'aliceblue',
                    fontSize: '30px',
                    fontWeight: '700',
                }}>Create your account</h1>

                <div className="trial-div-head">
                    <div className="inn-div-trial-head" style={{ color: 'white' }}>
                        <p><i className="bi bi-check fa-2x" style={{
                            marginRight: '10px',
                            color: 'yellowgreen',
                        }}></i>30-day free trial</p>
                        <p><i className="bi bi-check fa-2x" style={{
                            marginRight: '10px',
                            color: 'yellowgreen',
                        }}></i>Cancel anytime</p>
                        <p><i className="bi bi-check fa-2x" style={{
                            marginRight: '10px',
                            color: 'yellowgreen',
                        }}></i>Proof of Concept</p>
                    </div>
                </div>

                {
                    divState == 0 ? <div className="form-user" style={{ marginBottom: '0px', color: 'whitesmoke' }} id="user-div">
                        <div className="form-user-inn">
                            <div className="input-create-user">
                                <label className="input-req">Name</label><input type="text" value={name} placeholder="Name" id="name" onChange={(e) => { setName(e.target.value) }} />
                            </div>
                            <div className="input-create-user">
                                <label className="input-req">Email address</label><input type="text" value={email} id="email" placeholder="Email address" onChange={(e) => { setEmail(e.target.value) }} />
                            </div>
                            <div className="input-create-user">
                                <label className="input-req">Mobile Number</label><input type="text" id="mobile" value={mobile} placeholder="Mobile Number" onInput={(e) => isNumeric(e.target.value)} />
                            </div>
                            <div className="input-create-user"><label className="input-req">Password</label><input id="password" value={password} type="text" placeholder="password" onChange={(e) => { setPassword(e.target.value) }} /></div>
                            <div className="input-create-user">
                                <label className="input-req">Confirm password</label><input type="password" id="confirmpassword" value={confirm_password} placeholder="confirm password" onChange={(e) => { setConfirmPassword(e.target.value) }} />
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                <div className="terms-div">
                                    <p><input type="checkbox" id="privacy-policy-check" onChange={(e) => { setPrivacyPolicy(e.target.checked) }} /></p><p style={{ textAlign: 'center' }}>I have read and agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
                                </div>
                                <div className="terms-div">
                                    <p><input type="checkbox" id="email-notification-check" onChange={(e) => { setUpdates(e.target.checked) }} /></p><p style={{ textAlign: 'center' }}>Please send me occasional emails about new features and exciting free trials</p>
                                </div>
                            </div>
                        </div>
                    </div> :
                        <div className="form-user" style={{ marginBottom: '0px', color: 'whitesmoke' }} id="address-div">
                            <div className="form-user-inn">
                                <div className="input-create-user">
                                    <label className="input-req">Address line 1</label><input type="text" id="Addressline1" placeholder="Address line 1" value={address_line1} onChange={(e) => { set_address_line1(e.target.value) }} />
                                </div>
                                <div className="input-create-user">
                                    <label className="input-req">Postal code</label><input type="text" id="postalcode" placeholder="Postal code" value={postal_code} onChange={(e) => { set_postal_code(e.target.value) }} />
                                </div>
                                <div className="input-create-user">
                                    <label className="input-req">City</label><input type="text" id="city" placeholder="City" value={city} onChange={(e) => { setCity(e.target.value) }} />
                                </div>
                                <div className="input-create-user">
                                    <label className="input-req">State</label><input type="text" id="state" placeholder="State" value={State} onChange={(e) => { setState(e.target.value) }} />
                                </div>
                                <div className="input-create-user">
                                    <label>Country</label>
                                    <select className="select-inn" value={country} onChange={(e) => { setCountry(e.target.value) }}>
                                        <option value="">Select an option</option>
                                        {
                                            countries_name.map(data => {

                                                return <option value={data.name}>{data.name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="input-create-user">
                                    <label>How will you use Tentovision?</label>
                                    <select className="select-inn">
                                        <option value="">Select an option</option>
                                        <option value="Banking">Banking</option>
                                        <option value="Construction">Construction</option>
                                        <option value="Education">Education</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Hotel">Hotel</option>
                                        <option value="Manufacturing">Manufacturing</option>
                                        <option value="Office">Office</option>
                                        <option value="Property management">Property management</option>
                                        <option value="Residential">Residential</option>
                                        <option value="Restaurant/bar/cafe">Restaurant/bar/cafe</option>
                                        <option value="Retail">Retail</option>
                                        <option value="Warehouse">Warehouse</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="input-create-user">
                                    <label>Who are you?</label>
                                    <select className="select-inn" id="type" onChange={(e) => enableDealer(e.target)}>
                                        <option value="customer">Customer</option>
                                        <option value="distributor">Distributor</option>
                                    </select>
                                </div>
                                <div className="input-create-user" id="dealer-id-div">
                                    <label>Dealer ID</label><input type="number" id="dealerId" placeholder="Dealer Id" onChange={(e) => setDealerId(e.target.value)} />

                                </div>

                            </div>
                        </div>
                }


                {
                    divState == 0 ?
                        <div style={{ display: "flex", justifyContent: 'center', gap: '5rem', padding: '10px 10px 0px 10px', }}>
                            <button className="lets-go-btn-cust" onClick={() => props.setPageNumber(0)} style={{ color: "#242323", fontWeight: "400", backgroundColor: "whitesmoke", opacity: '0.8' }}>
                                Edit cameras
                            </button>
                            <button className="lets-go-btn-cust" onClick={() => { showAddressDiv(); }}>
                                Next
                                <div className="arrow-wrapper">
                                    <div className="arrow"></div>
                                </div>
                            </button>
                        </div> :
                        <div style={{ display: "flex", justifyContent: 'center', gap: '5rem', padding: '10px 10px 0px 10px', }}>
                            <button className="lets-go-btn-cust" onClick={() => props.setPageNumber(0)} style={{ color: "#242323", fontWeight: "400", backgroundColor: "whitesmoke", opacity: '0.8' }}>
                                Back
                            </button>
                            <button className="lets-go-btn-cust" onClick={() => submitForm()}>
                                Let's Go
                                <div className="arrow-wrapper">
                                    <div className="arrow"></div>
                                </div>
                            </button>
                        </div>
                }

                <div style={{ display: 'flex', justifyContent: 'center', padding: "10px" }}>
                    <div style={{ backgroundColor: '#1E1D28' }}>
                        <a style={{ fontWeight: 'bold', color: 'whitesmoke' }} onClick={() =>props.history.push('/signup')}>Already have a account?</a>
                        <a style={{ textDecoration: 'none', color: 'white', cursor: 'pointer' }} onClick={() => props.setPageNumber(2)}> Log In</a>
                    </div>
                </div>

            </div>





            <div id="cost-final-calc">
                <h2 style={{
                    color: 'aliceblue',
                    marginTop: '0px',
                    textAlign: 'center',
                    fontWeight: '600',
                }}>Review and Payment</h2>
                <div className="quote-cam-con-out">

                    <div className="quote-cam-con">
                        <h3 style={{
                            fontWeight: '600',
                        }}>Your plan</h3>
                        <div className="quote-inn-div">
                            <div className="quote-inn-div2" id="inn-div-quote-final">
                            </div>
                        </div>
                    </div>

                    <div className="quote-cam-con" id="adapter-con-final">
                        <h3>Your hardware</h3>
                        <div className="quote-inn-div">
                            <div className="quote-inn-div2" id="final-hardware-rvw">
                            </div>
                            <div className="quote-inn-div2-2" id="div2-inner-quote">

                                <p style={{
                                    fontWeight: '600',
                                    fontSize: '30px',
                                }} id="harware-price-p"></p>
                                <p>One-off payment</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="payment-main-out-con">
                    <div className="inn-payment-con">
                        <h3 style={{
                            color: 'rgb(255, 255, 255)',
                            fontWeight: '600',
                        }}>Payment details</h3>
                        <div className="payment-main-inn">

                            <div className="card-pay-main">
                                <div style={{
                                    padding: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: '1rem',
                                }}>
                                    <i className="bi bi-credit-card" style={{ height: '20px' }}></i><span style={{
                                        fontSize: '15px',
                                        textAlign: 'center',
                                    }}>Card</span></div>
                                <div>
                                    <div>
                                        <p>Card Number</p>
                                        <input type="text" placeholder="" />
                                    </div>
                                    <div>
                                        <p>Expiry Date</p>
                                        <input type="number" placeholder="MM/YYYY" />
                                    </div>
                                    <div>
                                        <p>CVC</p>
                                        <input type="text" inputMode="numeric" />
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    margin: '40px',
                }}>
                    <button className="lets-go-btn-cust" onClick={()=>{}}>
                        Make Payment
                    </button>
                    <div className="arrow-wrapper">
                        <div className="arrow"></div>

                    </div>
                </div>
            </div>
        </main >
    )
}