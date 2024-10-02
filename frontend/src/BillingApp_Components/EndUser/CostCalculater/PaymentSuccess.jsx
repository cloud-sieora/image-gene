
import payment_success from './assets/pngwing.com.png';

export default function PaymentSuccess() {






  return (
    <div style={{ width: '100%', height: "100vh", backgroundColor: "#1E1D28" }}>
      <p style={{ color: 'whitesmoke', textAlign: 'center', paddingTop: "10vh", fontSize: "40px", fontWeight: 500 }}>Payment Success</p>
      <p style={{ color: 'whitesmoke', textAlign: 'center', paddingTop: "2vh", fontSize: "20px", fontWeight: 100 }}>Your payment ID : 12121212</p>

      <div style={{ display: 'flex', justifyContent: 'center', }}>
        <button style={{ color: 'blue', fontWeight: '400', textDecoration: 'underline', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => {
          let currentURL = window.location.href;
          let newURL = currentURL.replace('/success', '/Login');
          window.location.href = newURL;
        }}>Login into TentoVision</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: "50px" }}>
        <img src={payment_success} style={{ width: '100px', height: '100px' }} />
      </div>
    </div>
  )
}