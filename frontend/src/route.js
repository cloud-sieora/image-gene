import React from 'react';
import axios from 'axios'

const Login = React.lazy(() => import('./BillingApp_Components/Authentication/SignIn/SignIn1'));
const CostCalculator = React.lazy(() => import('./BillingApp_Components/EndUser/CostCalculater/Calculator'));
const CostSignup = React.lazy(() => import('./BillingApp_Components/EndUser/CostCalculater/Signup'));
const CostLogin = React.lazy(() => import('./BillingApp_Components/EndUser/CostCalculater/Login'));
const CostPayment = React.lazy(() => import('./BillingApp_Components/EndUser/CostCalculater/Payment'));
const Success = React.lazy(() => import('./BillingApp_Components/EndUser/CostCalculater/PaymentSuccess'));


let route = []
const userData = JSON.parse(localStorage.getItem("userData"))
// /Authentication?userName=gowtham@gmail.com&password=123
if (window.location.pathname == '/Authentication') {
    console.log('lkjhgfhjk')
    let url = window.location.search
    url = url.split('&')

    let user_name = url[0].split('=')
    user_name = user_name[1]
    let password = url[1].split('=')
    password = password[1]


    const userDetails = {
        "username": user_name,
        "password": password,
    }
    const validateSuperUser = {
        url: 'https://tentovision1.cloudjiffy.net/users_creation_api_validate/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(userDetails)
    }
    axios(validateSuperUser)
        .then(response0 => {
            console.log(response0.data)
            if (response0.data.success) {
                console.log("UserMenuItemslist")
                localStorage.setItem('48fn&&d', user_name);
                localStorage.setItem('operator_type', "ADMIN");
                localStorage.setItem('operator_id', user_name);
                localStorage.setItem('dfudfkj', "CA");
                localStorage.setItem('org_name', response0.data.data.company_name);
                localStorage.setItem('userData', JSON.stringify(response0.data.data));
                localStorage.setItem('&s47$sfblm#5dfn', "347fbxsdf*&^h&sdfkhj98sf*sdh0kjskdh*BDgdd&^%sdfg78&sdf876876adn");
                localStorage.setItem('Client_Id', user_name);
                localStorage.setItem('435dfsduduf', "4v3fr42dnsdhc_sfjh7_3449rgdjgfgjdfitdgkljdfgneret874sdfsd5574758wer8er)sddfgdffewr");
                localStorage.setItem('945d5fsdudu', "447v4dnsdhc_sfjh7_34@f4II88ert3f54654*&%*&&^4esdfkjert58345*(&wesdfrdd845345rge");
                localStorage.setItem('47rufjheh55', "4672dnsdhc_sfjh7_34@f4II888**3dfbdfe" + user_name + "sdfkjfsd4488745)((*57475" + user_name + "8wer8er89789erbf8vb");
                localStorage.setItem('435ererdscf', "4v3fr42dnsdhc_sfjh7_34@slfkj88*4357nfkhsef9934k448874sdfsd5574758wer8er)sddfgdff");
                localStorage.setItem('*sfk38f458e', "4v3fr42dnsdhc_sfjh7_34@slfkj8s8*4357nfkhsef9934k448874sdfsd557475dfgfdgdfgfdgdfg");

                // let newURL = window.location.origin + "/Home/Home";

                // // Change the URL
                // window.history.replaceState({}, '', newURL);

                let currentPath = window.location.pathname;
                console.log(currentPath);
                let newPath = currentPath.replace("/Authentication", "/Home/Home");
                console.log(newPath);

                // Change the pathname
                window.location.pathname = newPath;
                // window.location.reload()
                // history.push("/Home/Home")


            }

            else {
                alert("Given User Name and Password is Incorrect")
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

} else {
    route = [
        { path: '/Login', exact: true, name: 'Login', component: Login },
        { path: '/CostCalculator', exact: true, name: 'CostCalculator', component: CostCalculator },
        { path: '/success', exact: true, name: 'CostCalculator', component: Success },
        { path: '/', exact: true, name: 'Login', component: Login },


    ];
}

export default route;