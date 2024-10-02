import React, { useState, useEffect } from 'react'
import Enrollment from './Enrollment'
import PersonList from './PersonList'
import Attendance from './Attendance'

export default function Index() {
    const [page_flag, setpage_flag] = useState('enroll')
    let userData = JSON.parse(localStorage.getItem("userData"));
    return (
        <div>
            <div>
                <div style={{ display: 'flex' }}>
                    <p style={{ backgroundColor: page_flag == 'enroll' ? 'white' : '#e6e8eb', display: 'inline-block', padding: '5px', cursor: 'pointer', marginRight: '5px', fontSize: '17px', margin: 0, borderTopLeftRadius: '5px', borderTopRightRadius: page_flag == 'enroll' ? '5px' : '0px', paddingLeft: '15px', paddingRight: '15px' }} onClick={() => { setpage_flag('enroll') }}>Enrollment</p>
                    <p style={{ backgroundColor: page_flag == 'person' ? 'white' : '#e6e8eb', display: 'inline-block', padding: '5px', cursor: 'pointer', marginRight: '5px', fontSize: '17px', margin: 0, borderTopLeftRadius: '5px', borderTopRightRadius: page_flag == 'person' ? '5px' : '0px', paddingLeft: '15px', paddingRight: '15px' }} onClick={() => { setpage_flag('person') }}>Face Search</p>
                    <p style={{ backgroundColor: page_flag == 'attendance' ? 'white' : '#e6e8eb', display: 'inline-block', padding: '5px', cursor: 'pointer', marginRight: '5px', fontSize: '17px', margin: 0, borderTopLeftRadius: '5px', borderTopRightRadius: page_flag == 'attendance' ? '5px' : '0px', paddingLeft: '15px', paddingRight: '15px' }} onClick={() => { setpage_flag('attendance') }}>Attendance</p>
                </div>
                <div style={{ backgroundColor: 'white', height: '88vh', width: '100%', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', borderTopRightRadius: '5px', paddingTop: '10px' }}>
                    {
                        page_flag == 'enroll' ?
                            <Enrollment />
                            : page_flag == 'person' ?
                                <PersonList />
                                : page_flag == 'attendance' ?
                                    <Attendance />
                                    : ''
                    }
                </div>
            </div>
        </div>
    )
}
