import React, { useState } from 'react';
import { Button, Col } from 'react-bootstrap'; 
import New from './New'
const YourComponent = () => {
    const [page ,setpage] =useState('')

  return (
    <div>
     { page === '' ? <Col
        xl={6}
        lg={6}
        md={8}
        sm={12}
        xs={12}
        style={{ padding: '10px' }}
      >
        <h2 style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '20px' }}>
          Choose presentation<span style={{ color: '#E32747' }}>.</span>
        </h2>

        {/* Demo presentation come to this part  */}


        <Button style={{
              background: 'linear-gradient(to right, #334BD2, #34C2C7)', 
              color: 'white', 
              padding: '10px 20px', 
              borderRadius: '50px', 
              cursor: 'pointer', 
              border: 'none', 
              outline: 'none',
              fontWeight:"bold",
              fontSize:"17px"
        }} onClick={()=>setpage('new')}>Create presentation</Button>
       
      </Col> :  <New onBack={() => setpage('')}/>}
     
    
    </div>
  );
};

export default YourComponent;
