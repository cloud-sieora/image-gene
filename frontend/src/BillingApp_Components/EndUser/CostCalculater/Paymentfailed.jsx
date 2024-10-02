import payment_failed from './assets/cross_6711656.png';

export default function Paymentfailed() {


    return (
        <div style={{ width: '100%', height: "100vh", backgroundColor: "#1E1D28" }}>



            <p style={{ color: 'whitesmoke', textAlign: 'center', paddingTop: "10vh", fontSize: "40px", fontWeight: 500 }}>Payment Fail</p>
            <p style={{ color: 'whitesmoke', textAlign: 'center', paddingTop: "2vh", fontSize: "20px", fontWeight: 100 }}>Reason code : 12121212</p>
            <div style={{display:'flex', justifyContent:'center', marginTop:"60px"}}>
                <img src={payment_failed} className='logo-pay'/>
            </div>
        </div>
    )
}