import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export default function PositionedSnackbar() {
    const [state, setState] = React.useState({
        open: true,
        vertical: 'top',
        horizontal: 'center',
    });
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const { vertical, horizontal, open } = state;

    const handleClick = (newState) => () => {
        setState({ open: true, ...newState });
    };

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    

    return (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>

            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                onClose={handleClose}
                key={vertical + horizontal}
                style={{ backgroundColor: 'red' }}
                autoHideDuration={1000}
            >

                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Data has been saved successfully !!
                </Alert>

            </Snackbar>

        </div>
    );
}
