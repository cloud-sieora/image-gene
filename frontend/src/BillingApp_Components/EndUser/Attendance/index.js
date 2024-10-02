import React, { useState } from 'react'
import Enrollment from './Enrollment'
import Attendance from './Attendance'

export default function Index() {
    const [page_flag, setpage_flag] = useState('enroll')
    return (
        <div>
            <div>
                <div style={{ display: 'flex' }}>
                    <p style={{ backgroundColor: page_flag == 'enroll' ? 'white' : '#e6e8eb', display: 'inline-block', padding: '5px', cursor: 'pointer', marginRight: '5px', fontSize: '17px', margin: 0, borderTopLeftRadius: '5px', borderTopRightRadius: page_flag == 'enroll' ? '5px' : '0px', paddingLeft: '15px', paddingRight: '15px' }} onClick={() => { setpage_flag('enroll') }}>Enrollment</p>
                    <p style={{ backgroundColor: page_flag == 'atten' ? 'white' : '#e6e8eb', display: 'inline-block', padding: '5px', cursor: 'pointer', fontSize: '17px', margin: 0,borderTopLeftRadius: page_flag == 'atten' ? '5px' : '0px',borderTopRightRadius: page_flag == 'atten' ? '5px' : '0px', paddingLeft: '15px', paddingRight: '15px' }} onClick={() => { setpage_flag('atten') }}>Attendance</p>
                </div>
                <div style={{ backgroundColor: 'white', height: '88vh', width: '100%', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', borderTopRightRadius: '5px', paddingTop: '10px' }}>
                    {
                        page_flag == 'enroll' ?
                            <Enrollment />
                            :
                            <Attendance />
                    }
                </div>
            </div>
        </div>
    )
}
