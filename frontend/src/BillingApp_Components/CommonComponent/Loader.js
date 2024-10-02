import React from 'react'
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Row, Col, Spinner } from 'react-bootstrap';

export default function Loader() {
  return (
    
    <Grid container
      justifyContent="center"
      alignItems="center"
      xs={12}
      marginTop={"25%"}

    >
      <Spinner animation="border" variant="primary" />
      <Typography variant="caption" display="block" style={{ marginLeft: 10, textAlign: 'center', fontSize: 25, fontFamily: "Poppins-SemiBold", color: 'darkblue', marginTop: 10 }}>Loading...</Typography>
    </Grid>

  )
}
