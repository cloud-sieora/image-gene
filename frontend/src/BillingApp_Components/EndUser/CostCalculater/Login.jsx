

import logo from './assets/logo.png'
import { useState } from "react";
import './App.css'
import './index.css'

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import '@fortawesome/fontawesome-free/css/all.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { withRouter } from 'react-router-dom'

export default function Login(props) {

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [mail, setEmail] = useState('');



    function logInButtonPress() {

        let URL = "https://tentovision1.cloudjiffy.net/users_creation_api_validate"

        let obj = {
            username: mail.trim(),
            password: password.trim()
        }

        const options = {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj)
        }

        console.log(obj);

        try {
            fetch(URL, options)
                .then(resp => {
                    return resp.json();
                })
                .then(data => {
                    console.log(data);
                    if (data.success == true) {
                        // navigate('/payment', { state: data.data })
                        localStorage.setItem('clientId', data.data._id)
                        localStorage.setItem('uservalue', JSON.stringify(data.data))
                        props.setPageNumber(3);
                        setEmail("")
                        setName("")
                        setPassword("")
                    }
                    else if (data.success == false) {
                        alert("Invalid Credentials");
                        setEmail("")
                        setName("")
                        setPassword("")
                    }
                })
        }
        catch (err) {
            console.log(err);
        }

    }

    return (

        <div className="login-div-main" style={{ width: "100%", minHeight: '100vh', backgroundColor: "#1E1D28", padding: '100px 30px' }}>
            {/* <p style={{textAlign:'center', color:'whitesmoke', fontWeight:'400', fontSize:"40px", marginBottom:'50px'}}>Existing User Login</p> */}
            <p style={{ textAlign: 'center', color: 'whitesmoke', fontWeight: '200', fontSize: "60px", color: 'white', display: 'flex', alignItems: 'center', justifyContent: "center", gap: "1.5rem" }}><p>TentoVision</p></p>

            <div className="login-inn-div" style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ padding: '20px 15px 0px 15px', borderRadius: '10px' }}>
                    <h2 style={{ textAlign: 'center', color: 'whitesmoke', fontWeight: '400' }}>log In</h2>
                    {/* <h3 style={{textAlign:'center', color:"whitesmoke"}}>log In</h3> */}
                    <div style={{ minHeight: '40vh', width: '90vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', padding: '30px 0px', borderRadius: '10px' }}>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="user name" style={{ padding: '10px 30px', marginTop: '10px', height: "52px", minWidth: '300px', maxWidth: '300px', border: 'none', backgroundColor: 'none', outline: 'none', borderRadius: '5px' }} />
                        <input value={mail} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" style={{ padding: '10px 30px', marginTop: '20px', height: "52px", minWidth: '300px', maxWidth: '300px', border: 'none', backgroundColor: 'none', outline: 'none', borderRadius: '5px' }} />
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" style={{ padding: '10px 30px', marginTop: '20px', height: "52px", minWidth: '300px', maxWidth: '300px', border: 'none', backgroundColor: 'none', outline: 'none', borderRadius: '5px' }} />
                        <button style={{ padding: '20px 30px', marginTop: '50px', width: '310px', backgroundColor: 'blue', alignSelf: 'center', borderRadius: '7px', fontWeight: '700', color: 'whitesmoke' }} onClick={() => { logInButtonPress() }}>Log In</button>
                    </div>
                </div>
            </div>
            <div>
                <p style={{ color: 'whitesmoke', textAlign: 'center', fontWeight: '600', }}><a onClick={() => props.setPageNumber(1)} style={{ color: 'white', cursor: 'pointer' }}>Not yet signed Up? Create a new account!</a></p>
            </div>
        </div>
    )
}