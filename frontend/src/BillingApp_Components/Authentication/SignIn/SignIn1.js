import React, { useState, useEffect } from 'react';
import './../../../assets/scss/style.scss';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from "../../../store/actions";
import * as api from '../../Configurations/Api_Details'
import windowSize from 'react-window-size';
import logo from './1.png'
import CircularProgress from '@mui/material/CircularProgress';
import * as CommonStyling from '../../CommonStyling/CommonStyling';
import { withRouter } from 'react-router-dom'






function SignUp1({ history }) {
    const [username, setusername] = useState("");
    const [usertype, setusertype] = useState("Admin");
    const [oprator_id, setoprator_id] = useState("");
    const [ipaddress, setipaddress] = useState("");

    const [password, setpassword] = useState("");
    const [flag, setflag] = useState(0);
    const [login_btn, setlogin_btn] = useState(true);


    useEffect(() => {
        if (flag == 0) {
            localStorage.clear();
        }
    }, [flag])

    // function Login(e) {
    //     // localStorage.setItem('ipaddress', ipaddress);
    //     localStorage.setItem('customer_details_indicator', "0")
    //     e.preventDefault();
    //     if (username == "" || password == "") {
    //         alert("Please Enter Valid Username and Password")
    //     }
    //     // T961278S2
    //     // !uTre&c
    //     else if (username == "test" && password == "test" && usertype == "Admin") {

    //         localStorage.setItem('dfudfkj', "SA");
    //         localStorage.setItem('org_name', "SIEORA");
    //         localStorage.setItem('&s47$sfblm#5dfn', "88iifjd&^*^ddsd*^*sdffdf9987**assjsdjsd xxshddfkjdkfieru");
    //         localStorage.setItem('userData', JSON.stringify({ position_type: 'admin' }));
    //         localStorage.setItem('Client_Id', "admin");
    //         localStorage.setItem('435dfsduduf', "4v3fr42dnsdhc_sfjh7_3449rgdjgfgjdfitdgkljdfgneret874sdfsd5574758wer8er)sddfgdffewr");
    //         localStorage.setItem('945d5fsdudu', "447v4dnsdhc_sfjh7_34@f4II88ert3f54654*&%*&&^4esdfkjert58345*(&wesdfrdd845345rge");
    //         localStorage.setItem('47rufjheh55', "4672dnsdhc_sfjh7_34@f4II888**3dfbdfe" + "admin" + "sdfkjfsd4488745)((*57475" + "admin" + "8wer8er89789erbf8vb");
    //         localStorage.setItem('435ererdscf', "4v3fr42dnsdhc_sfjh7_34@slfkj88*4357nfkhseadminf9934k448874sdfsd5574758weradmin8er)sddfgdff");
    //         localStorage.setItem('*sfk38f458e', "4v3fr42dnsdhc_sfjh7_34@slfkj8s8*4357nfkhsef99admin34k448874sdfsd557475dfgfdgdfgfdgdfg");
    //         window.history.replaceState(null, null, "/DistributorCreations/DistributorCreations");
    //         setflag(1)
    //         window.location.reload();
    //     }
    //     else if (username != "" && password != "" && usertype == "Admin") {
    //         const userDetails = {
    //             "username": username,
    //             "password": password
    //         }
    //         const validateSuperUser = {
    //             url: api.SUPER_ADMIN_LOGIN,
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             data: JSON.stringify(userDetails)
    //         }
    //         axios(validateSuperUser)
    //             .then(response0 => {
    //                 if (response0.data.success) {
    //                     console.log("UserMenuItemslist")
    //                     localStorage.setItem('48fn&&d', username);
    //                     localStorage.setItem('operator_type', "ADMIN");
    //                     localStorage.setItem('operator_id', username);
    //                     localStorage.setItem('dfudfkj', "CA");
    //                     localStorage.setItem('userData', JSON.stringify({ position_type: 'admin' }));
    //                     localStorage.setItem('org_name', response0.data.data.company_name);
    //                     localStorage.setItem('&s47$sfblm#5dfn', "347fbxsdf*&^h&98sf*sdhfni*BDgdd&^%sdfg78&sdfHDje7574");
    //                     localStorage.setItem('Client_Id', username);
    //                     localStorage.setItem('435dfsduduf', "4v3fr42dnsdhc_sfjh7_3449rgdjgfgjdfitdgkljdfgneret874sdfsd5574758wer8er)sddfgdffewr");
    //                     localStorage.setItem('945d5fsdudu', "447v4dnsdhc_sfjh7_34@f4II88ert3f54654*&%*&&^4esdfkjert58345*(&wesdfrdd845345rge");
    //                     localStorage.setItem('47rufjheh55', "4672dnsdhc_sfjh7_34@f4II888**3dfbdfe" + username + "sdfkjfsd4488745)((*57475" + username + "8wer8er89789erbf8vb");
    //                     localStorage.setItem('435ererdscf', "4v3fr42dnsdhc_sfjh7_34@slfkj88*4357nfkhsef9934k448874sdfsd5574758wer8er)sddfgdff");
    //                     localStorage.setItem('*sfk38f458e', "4v3fr42dnsdhc_sfjh7_34@slfkj8s8*4357nfkhsef9934k448874sdfsd557475dfgfdgdfgfdgdfg");
    //                     window.history.replaceState(null, null, "/DealerCreations/DealerCreations");
    //                     setflag(1)
    //                     window.location.reload();
    //                 }

    //                 else {
    //                     alert("Given User Name and Password is Incorrect")
    //                 }


    //             })
    //             .catch(function (e) {
    //                 if (e.message === 'Network Error') {
    //                     alert("No Internet Found. Please check your internet connection")
    //                 }
    //                 else {
    //                     alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
    //                 }
    //             });
    //     }

    //     else if (username != "" && password != "" && usertype == "Dealer") {
    //         const userDetails = {
    //             "username": username,
    //             "password": password,
    //             "user_type": 'Distributor'
    //         }
    //         const validateSuperUser = {
    //             url: api.DEALER_LOGIN,
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             data: JSON.stringify(userDetails)
    //         }
    //         axios(validateSuperUser)
    //             .then(response0 => {
    //                 if (response0.data.success) {
    //                     console.log("UserMenuItemslist")
    //                     localStorage.setItem('48fn&&d', username);
    //                     localStorage.setItem('operator_type', "ADMIN");
    //                     localStorage.setItem('operator_id', username);
    //                     localStorage.setItem('dfudfkj', "CA");
    //                     localStorage.setItem('user_Data', JSON.stringify(response0.data.data));
    //                     localStorage.setItem('userData', JSON.stringify({ position_type: 'dealer' }));
    //                     localStorage.setItem('org_name', response0.data.data.company_name);
    //                     localStorage.setItem('&s47$sfblm#5dfn', "347fbxsdf*&^h&98sf*sdhfni*BDgdd&^%sdfg78&sdfKJH");
    //                     localStorage.setItem('Client_Id', username);
    //                     localStorage.setItem('435dfsduduf', "4v3fr42dnsdhc_sfjh7_3449rgdjgfgjdfitdgkljdfgneret874sdfsd5574758wer8er)sddfgdffewr");
    //                     localStorage.setItem('945d5fsdudu', "447v4dnsdhc_sfjh7_34@f4II88ert3f54654*&%*&&^4esdfkjert58345*(&wesdfrdd845345rge");
    //                     localStorage.setItem('47rufjheh55', "4672dnsdhc_sfjh7_34@f4II888**3dfbdfe" + username + "sdfkjfsd4488745)((*57475" + username + "8wer8er89789erbf8vb");
    //                     localStorage.setItem('435ererdscf', "4v3fr42dnsdhc_sfjh7_34@slfkj88*4357nfkhsef9934k448874sdfsd5574758wer8er)sddfgdff");
    //                     localStorage.setItem('*sfk38f458e', "4v3fr42dnsdhc_sfjh7_34@slfkj8s8*4357nfkhsef9934k448874sdfsd557475dfgfdgdfgfdgdfg");
    //                     window.history.replaceState(null, null, "/UserCreations/UserCreations");
    //                     setflag(1)
    //                     window.location.reload();
    //                 }

    //                 else {
    //                     alert("Given User Name and Password is Incorrect")
    //                 }


    //             })
    //             .catch(function (e) {
    //                 if (e.message === 'Network Error') {
    //                     alert("No Internet Found. Please check your internet connection")
    //                 }
    //                 else {
    //                     alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
    //                 }
    //             });
    //     }

    //     else if (username != '' && password != '' && (usertype == "Client" || usertype == "User")) {
    //         const userDetails = {
    //             "username": username,
    //             "password": password,
    //             "user_type": usertype
    //         }
    //         const validateSuperUser = {
    //             url: api.USER_LOGIN,
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             data: JSON.stringify(userDetails)
    //         }
    //         axios(validateSuperUser)
    //             .then(response0 => {
    //                 if (response0.data.success) {
    //                     console.log("UserMenuItemslist")
    //                     localStorage.setItem('48fn&&d', username);
    //                     localStorage.setItem('operator_type', "ADMIN");
    //                     localStorage.setItem('operator_id', username);
    //                     localStorage.setItem('dfudfkj', "CA");
    //                     localStorage.setItem('org_name', response0.data.data.company_name);
    //                     localStorage.setItem('userData', JSON.stringify(response0.data.data));
    //                     localStorage.setItem('&s47$sfblm#5dfn', "347fbxsdf*&^h&sdfkhj98sf*sdh0kjskdh*BDgdd&^%sdfg78&sdf876876adn");
    //                     localStorage.setItem('Client_Id', username);
    //                     localStorage.setItem('435dfsduduf', "4v3fr42dnsdhc_sfjh7_3449rgdjgfgjdfitdgkljdfgneret874sdfsd5574758wer8er)sddfgdffewr");
    //                     localStorage.setItem('945d5fsdudu', "447v4dnsdhc_sfjh7_34@f4II88ert3f54654*&%*&&^4esdfkjert58345*(&wesdfrdd845345rge");
    //                     localStorage.setItem('47rufjheh55', "4672dnsdhc_sfjh7_34@f4II888**3dfbdfe" + username + "sdfkjfsd4488745)((*57475" + username + "8wer8er89789erbf8vb");
    //                     localStorage.setItem('435ererdscf', "4v3fr42dnsdhc_sfjh7_34@slfkj88*4357nfkhsef9934k448874sdfsd5574758wer8er)sddfgdff");
    //                     localStorage.setItem('*sfk38f458e', "4v3fr42dnsdhc_sfjh7_34@slfkj8s8*4357nfkhsef9934k448874sdfsd557475dfgfdgdfgfdgdfg");
    //                     window.history.replaceState(null, null, "/Home/Home");
    //                     setflag(1)
    //                     window.location.reload();
    //                 }

    //                 else {
    //                     alert("Given User Name and Password is Incorrect")
    //                 }


    //             })
    //             .catch(function (e) {
    //                 if (e.message === 'Network Error') {
    //                     alert("No Internet Found. Please check your internet connection")
    //                 }
    //                 else {
    //                     alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
    //                 }
    //             });
    //     }
    // }

    function pagenavi(response0) {
        localStorage.setItem('48fn&&d', username);
        localStorage.setItem('operator_type', "ADMIN");
        localStorage.setItem('operator_id', username);
        localStorage.setItem('dfudfkj', "CA");
        localStorage.setItem('org_name', response0.data.data.company_name);
        localStorage.setItem('userData', JSON.stringify(response0.data.data));
        localStorage.setItem('&s47$sfblm#5dfn', "347fbxsdf*&^h&sdfkhj98sf*sdh0kjskdh*BDgdd&^%sdfg78&sdf876876adn");
        localStorage.setItem('Client_Id', username);
        localStorage.setItem('435dfsduduf', "4v3fr42dnsdhc_sfjh7_3449rgdjgfgjdfitdgkljdfgneret874sdfsd5574758wer8er)sddfgdffewr");
        localStorage.setItem('945d5fsdudu', "447v4dnsdhc_sfjh7_34@f4II88ert3f54654*&%*&&^4esdfkjert58345*(&wesdfrdd845345rge");
        localStorage.setItem('47rufjheh55', "4672dnsdhc_sfjh7_34@f4II888**3dfbdfe" + username + "sdfkjfsd4488745)((*57475" + username + "8wer8er89789erbf8vb");
        localStorage.setItem('435ererdscf', "4v3fr42dnsdhc_sfjh7_34@slfkj88*4357nfkhsef9934k448874sdfsd5574758wer8er)sddfgdff");
        localStorage.setItem('*sfk38f458e', "4v3fr42dnsdhc_sfjh7_34@slfkj8s8*4357nfkhsef9934k448874sdfsd557475dfgfdgdfgfdgdfg");
        history.push("/Home/Home")
        setflag(1)
    }

    function Login(e) {
        // localStorage.setItem('ipaddress', ipaddress);
        setlogin_btn(false)
        localStorage.setItem('customer_details_indicator', "0")
        e.preventDefault();
        if (username == "" || password == "") {
            alert("Please Enter Valid Username and Password")
            setlogin_btn(true)
        }
        // T961278S2
        // !uTre&c

        else {
            const userDetails = {
                "username": username,
                "password": password,
            }
            const validateSuperUser = {
                url: api.USER_LOGIN,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(userDetails)
            }
            axios(validateSuperUser)
                .then(response0 => {
                    if (response0.data.success) {
                        const getStocksData = {
                            url: response0.data.data.position_type == 'Client' ? api.LIST_DEVICE_DATA_CLIENT_ID : response0.data.data.position_type == 'Client Admin' ? api.LIST_DEVICE_DATA_CLIENT_ADMIN_ID : response0.data.data.position_type == 'Site Admin' ? api.LIST_DEVICE_DATA_SITE_ADMIN_ID : api.LIST_DEVICE_DATA_USER_ID,
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: response0.data.data.position_type == 'Client' ? JSON.stringify({

                                "client_id": response0.data.data._id

                            }) : response0.data.data.position_type == 'Client Admin' ? JSON.stringify({

                                "client_admin_id": response0.data.data._id

                            }) : response0.data.data.position_type == 'Site Admin' ? JSON.stringify({

                                "site_admin_id": response0.data.data._id

                            }) : JSON.stringify({

                                "user_id": response0.data.data._id

                            })
                        }

                        axios.request(getStocksData)
                            .then((response) => {
                                if (response.data.length != 0) {
                                    const getStocksData = {
                                        url: response0.data.data.position_type == 'Client' ? api.LIST_DEVICE_DATA_CLIENT_ID_LOCAL : response0.data.data.position_type == 'Client Admin' ? api.LIST_DEVICE_DATA_CLIENT_ADMIN_ID_LOCAL : response0.data.data.position_type == 'Site Admin' ? api.LIST_DEVICE_DATA_SITE_ADMIN_ID_LOCAL : api.LIST_DEVICE_DATA_USER_ID_LOCAL,
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        data: response0.data.data.position_type == 'Client' ? JSON.stringify({

                                            "client_id": response0.data.data._id

                                        }) : response0.data.data.position_type == 'Client Admin' ? JSON.stringify({

                                            "client_admin_id": response0.data.data._id

                                        }) : response0.data.data.position_type == 'Site Admin' ? JSON.stringify({

                                            "site_admin_id": response0.data.data._id

                                        }) : JSON.stringify({

                                            "user_id": response0.data.data._id

                                        })
                                    }

                                    axios.request(getStocksData)
                                        .then((device) => {
                                            if (device.length != 0) {
                                                let data = []
                                                for (let index = 0; index < device.data.length; index++) {
                                                    let flag = true
                                                    for (let index1 = 0; index1 < response.data.length; index1++) {
                                                        if (device.data[index].device_id == response.data[index1].device_id) {

                                                            if (device.data[index].user_id == response.data[index1].user_id || device.data[index].clientt_id == response.data[index1].clientt_id || device.data[index].client_admin_id == response.data[index1].client_admin_id || device.data[index].site_admin_id == response.data[index1].site_admin_id) {
                                                                flag = true
                                                                break
                                                            } else {
                                                                flag = false
                                                            }
                                                        } else {
                                                            flag = false
                                                        }

                                                    }

                                                    if (!flag) {
                                                        data.push(device.data[index])
                                                    }

                                                }

                                                let count = 0
                                                for (let index = 0; index < data.length; index++) {
                                                    const options = {
                                                        url: api.DEVICE_DATA_LOCAL + data[index]._id,
                                                        method: 'DELETE',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            // 'Authorization': 'Bearer ' + window.localStorage.getItem('codeofauth')
                                                        }
                                                    };
                                                    axios(options)
                                                        .then(response => {
                                                            count = count + 1

                                                            if (count == data.length) {
                                                                pagenavi(response0)
                                                            }
                                                        })
                                                        .catch((e) => {
                                                            console.log(e);
                                                        })
                                                }
                                                if (data.length == 0) {
                                                    pagenavi(response0)
                                                }
                                            } else {
                                                pagenavi(response0)
                                            }
                                        })
                                        .catch((e) => { console.log(e); })
                                } else {
                                    pagenavi(response0)
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            })
                    }

                    else {
                        alert("Given User Name and Password is Incorrect")
                    }
                    setlogin_btn(true)


                })
                .catch(function (e) {
                    setlogin_btn(true)
                    console.log(e);
                    if (e.message === 'Network Error') {
                        alert("No Internet Found. Please check your internet connection")
                    }
                    else {
                        alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                    }
                });
        }
    }


    return (

        <Aux>
            <div className="auth-wrapper" style={{
                // backgroundImage: `url(${backgroundImage})`,
                backgroundImage: 'linear-gradient(to right, #4218ed, #00BCD4)',
                // backgroundColor:'line',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                height: '100vh'
            }}>
                <div className="auth-content">
                    <div className="auth-bg">

                    </div>
                    <div style={{ backgroundColor: 'white', width: '100%', borderRadius: '5px' }}>
                        <form onSubmit={Login}>
                            <div className="card-body text-center">
                                <div className="mb-4">
                                    {/* <i className="feather icon-unlock auth-icon" /> */}
                                    <img src={logo} alt="" style={{ width: 120, height: 120 }} />

                                </div>
                                <h1 className="mb-4" style={{ color: 'darkblue', padding: 5, fontSize: 40 }}>Login</h1>
                                {/* <div className="input-group mb-3" style={{ padding: 10, height: 60 }}>
                                    <select className="form-control" value={usertype} style={{
                                        fontFamily: "Poppins, sans-serif",
                                        color: 'darkblue',
                                        fontSize: 19,
                                        height: 60
                                    }}
                                        onChange={(e) => setusertype(e.target.value)}>
                                        <option style={CommonStyling.form_control_inputtext} value="Admin" >Admin</option>
                                        <option style={CommonStyling.form_control_inputtext} value="Dealer">Dealer</option>
                                        <option style={CommonStyling.form_control_inputtext} value="Client" >Client</option>
                                        <option style={CommonStyling.form_control_inputtext} value="User">User</option>

                                    </select>
                                </div> */}


                                <div className="input-group mb-3" style={{ padding: 10, height: 60 }}>
                                    <input type="text" className="form-control" style={{

                                        color: 'darkblue',
                                        fontSize: 19,
                                        height: 60
                                    }} placeholder={usertype == "Distributor" ? "Multi Outlet Admin Id" : "Client Id"} value={username} onChange={(e) => setusername(e.target.value)} />
                                </div>
                                {/* {
                                    usertype == "Dealer" ? (
                                        <div className="input-group mb-3" style={{ padding: 10, height: 60 }}>
                                            <input type="text" className="form-control" style={{
                                                fontFamily: "Poppins, sans-serif",
                                                color: 'darkblue',
                                                fontSize: 19,
                                                height: 60
                                            }} placeholder="Oprator Id" value={oprator_id} onChange={(e) => setoprator_id(e.target.value)} />
                                        </div>

                                    ) : null
                                } */}

                                <div className="input-group mb-4" style={{ padding: 10, height: 60 }}>
                                    <input type="password" className="form-control" style={{

                                        color: 'darkblue',
                                        fontSize: 19,
                                        height: 60
                                    }} placeholder="Password" value={password} onChange={(e) => setpassword(e.target.value)} />
                                </div>

                                <button className="btn btn-primary shadow-2 mb-4" style={{
                                    fontSize: 25,

                                    color: 'white',
                                    backgroundColor: '#2f4cdd',
                                    padding: 10,
                                    width: 200
                                }}
                                    onClick={(e) => {
                                        if (login_btn) {
                                            Login(e)
                                        }
                                    }} type="submit">{login_btn ? 'Login' : <CircularProgress size={'18px'} style={{ color: 'white' }} />}</button>
                                <h4 style={{ fontSize: 15, color: 'grey' }}>© 2022, TentoSoft Solutions. All Rights Reserved</h4>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Aux>
    );

}

const mapStateToProps = state => {
    return {
        login_indicator: state.loginIndicator
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onloginIndicatorChange: (loginIndicator) => dispatch({ type: actionTypes.LOGIN_INDICATOR, loginIndicator: loginIndicator }),

    }
};

export default windowSize(connect(mapStateToProps, mapDispatchToProps)(SignUp1));
