import React, { useState } from 'react'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import './style.css'

export default function DateComponent({ year, month, date, type, starttime, endtime, parentFunction, flag, select_hour, apply_can_fun, days_time, time_chk }) {

    const [currentfullyear, setcurrentfullyear] = useState(year);
    const [currentMonth, setcurrentMonth] = useState(month - 1);
    const [currentDate, setcurrentDate] = useState(date);
    const [flagDate, setflagDate] = useState(true);
    let [count, setcount] = useState(0);
    const [dateobject, setdateobject] = useState({
        'date': currentDate,
        'month': currentMonth,
        'year': currentfullyear
    });

    let montharray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let currentMonthLastDate = new Date(currentfullyear, currentMonth + 1, 0).getDate()
    let currentMonthFirstDay = new Date(currentfullyear, currentMonth, 1).getDay()
    let currentMonthLastDay = new Date(currentfullyear, currentMonth, currentMonthLastDate).getDay()
    let previousMonthLastDate = new Date(currentfullyear, currentMonth - 1, 0).getDate()
    let previousMonthLastDay = new Date(currentfullyear, currentMonth - 1, 0).getDay()
    let nextMonthLastDate = new Date(currentfullyear, currentMonth + 1, 0)
    let nextMonthLastDay = new Date(currentfullyear, currentMonth + 1, 0).getDay()
    // console.log(currentMonthFirstDay);
    // console.log(previousMonthLastDay);
    // console.log(nextMonthLastDay);

    let fulldates = []
    calPreviousMonth()
    function calPreviousMonth() {
        if (currentMonthFirstDay !== 0) {
            for (let index = previousMonthLastDate; index > previousMonthLastDate - currentMonthFirstDay; index--) {
                fulldates.push(
                    <div style={{ width: '50px', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}><p style={{ fontWeight: 'bolder', margin: 0, cursor: 'pointer', cursor: 'pointer', display: 'inline-block', backgroundColor: '#e6e8eb', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px', borderRadius: '50%', color: 'white' }}>{index}</p></div>
                )

            }
        }
    }
    fulldates = fulldates.reverse()

    for (let index = 0; index < currentMonthLastDate; index++) {
        if (index + 1 === currentDate && dateobject.month === currentMonth && dateobject.year === currentfullyear) {
            fulldates.push(
                <div style={{ width: '50px', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                    <p id={`date${index}`} style={{ fontWeight: 'bolder', margin: 0, cursor: 'pointer', cursor: 'pointer', display: 'inline-block', backgroundColor: '#e32747', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px', borderRadius: '50%', color: 'white' }} onClick={() => {
                        dateobject.date = index + 1
                        dateobject.month = currentMonth
                        dateobject.year = currentfullyear
                        parentFunction(index + 1, currentMonth, currentfullyear)
                        setcurrentDate(index + 1)
                        parentFunction(currentfullyear, currentMonth, index + 1, starttime, endtime, type)
                    }}>{index + 1}</p></div>
            )
        } else {
            fulldates.push(
                <div style={{ width: '50px', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                    <p id={`date${index}`} style={{ fontWeight: 'bolder', margin: 0, cursor: 'pointer', cursor: 'pointer', display: 'inline-block', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px', color: 'black' }} onClick={() => {
                        dateobject.date = index + 1
                        dateobject.month = currentMonth
                        dateobject.year = currentfullyear
                        parentFunction(index + 1, currentMonth, currentfullyear)
                        setcurrentDate(index + 1)
                        parentFunction(currentfullyear, currentMonth, index + 1, starttime, endtime, type)
                    }} onMouseEnter={() => {
                        let ele = document.getElementById(`date${index}`)
                        ele.style.backgroundColor = '#e32747'
                        ele.style.paddingLeft = '8px'
                        ele.style.paddingRight = '8px'
                        ele.style.paddingTop = '3px'
                        ele.style.paddingBottom = '3px'
                        ele.style.borderRadius = '50%'
                        ele.style.color = 'white'
                    }} onMouseLeave={() => {
                        let ele = document.getElementById(`date${index}`)
                        ele.style.backgroundColor = 'white'
                        ele.style.paddingLeft = '8px'
                        ele.style.paddingRight = '8px'
                        ele.style.paddingTop = '3px'
                        ele.style.paddingBottom = '3px'
                        ele.style.borderRadius = '50%'
                        ele.style.color = 'black'
                    }}>{index + 1}</p></div>
            )
        }
    }

    calNextMonth()
    function calNextMonth() {
        if (currentMonthLastDay !== 6) {
            for (let index = 0; index < 6 - currentMonthLastDay; index++) {
                fulldates.push(
                    <div style={{ width: '50px', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}><p style={{ fontWeight: 'bolder', margin: 0, cursor: 'pointer', cursor: 'pointer', display: 'inline-block', backgroundColor: '#e6e8eb', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px', borderRadius: '50%', color: 'white' }}>{index + 1}</p></div>
                )

            }
        }
    }

    return (
        <div>
            <div style={{ width: '380px', maxHeight: '320px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', border: '1px solid black' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'black' }}>
                    <p style={{ fontWeight: 'bolder', fontSize: '20px', margin: 0 }}>{montharray[currentMonth]} {currentfullyear} {days_time == true ? <span style={{ marginLeft: '10px' }}>{`${starttime}-${endtime}`}</span> : ''}</p>

                    <div style={{ display: 'flex' }}>
                        <ArrowLeftIcon style={{ fontSize: '30px', margin: 0, cursor: 'pointer' }} onClick={() => {
                            if (currentMonth - 1 < 0) {
                                setcurrentfullyear(currentfullyear - 1)
                                setcurrentMonth(11)

                                if (days_time == false) {
                                    setcurrentDate(1)
                                    parentFunction(currentfullyear - 1, currentMonth, 1, starttime, endtime, type)
                                }
                            } else {
                                setcurrentMonth(currentMonth - 1)

                                if (days_time == false) {
                                    setcurrentDate(1)
                                    parentFunction(currentfullyear, currentMonth - 1, 1, starttime, endtime, type)
                                }
                            }
                        }} />
                        <ArrowRightIcon style={{ fontSize: '30px', margin: 0, cursor: 'pointer' }} onClick={() => {
                            if (currentMonth + 1 > 11) {

                                setcurrentfullyear(currentfullyear + 1)
                                setcurrentMonth(0)

                                if (days_time == false) {
                                    setcurrentDate(1)
                                    parentFunction(currentfullyear + 1, currentMonth, 1, starttime, endtime, type)
                                }

                            } else {
                                setcurrentMonth(currentMonth + 1)
                                if (days_time == false) {
                                    setcurrentDate(1)
                                    parentFunction(currentfullyear, currentMonth + 1, 1, starttime, endtime, type)
                                }
                            }
                        }} />
                    </div>
                </div>
                <hr></hr>

                <div className='lower_alerts' style={{ height: '190px', overflowY : 'scroll' }}>

                    {
                        days_time == true ?
                            <>
                                <div style={{ display: 'flex', marginTop: '20px', color: '#e32747' }}>
                                    <p style={{ fontWeight: 'bolder', margin: 0, marginBottom: '30px', width: '50px', textAlign: 'center' }}>Sun</p>
                                    <p style={{ fontWeight: 'bolder', margin: 0, marginBottom: '30px', width: '50px', textAlign: 'center' }}>Mon</p>
                                    <p style={{ fontWeight: 'bolder', margin: 0, marginBottom: '30px', width: '50px', textAlign: 'center' }}>Tue</p>
                                    <p style={{ fontWeight: 'bolder', margin: 0, marginBottom: '30px', width: '50px', textAlign: 'center' }}>Wed</p>
                                    <p style={{ fontWeight: 'bolder', margin: 0, marginBottom: '30px', width: '50px', textAlign: 'center' }}>Thu</p>
                                    <p style={{ fontWeight: 'bolder', margin: 0, marginBottom: '30px', width: '50px', textAlign: 'center' }}>Fri</p>
                                    <p style={{ fontWeight: 'bolder', margin: 0, marginBottom: '30px', width: '50px', textAlign: 'center' }}>Sat</p>
                                </div>

                                {
                                    time_chk == 'week' ?
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {
                                                fulldates.map((val, i) => {
                                                    let crt = count
                                                    count = count + 1

                                                    if (count == 7) {
                                                        count = 0
                                                    }
                                                    return (
                                                        <>{crt == 0 ? val :
                                                            <div style={{ width: '50px', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}><p style={{ fontWeight: 'bolder', margin: 0, cursor: 'pointer', cursor: 'pointer', display: 'inline-block', backgroundColor: '#e6e8eb', paddingLeft: '8px', paddingRight: '8px', paddingTop: '3px', paddingBottom: '3px', borderRadius: '50%', color: 'white' }}>-</p></div>
                                                        }</>
                                                    )
                                                })

                                            }
                                        </div>
                                        :
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {
                                                fulldates.map((val, i) => (
                                                    val
                                                ))
                                            }
                                        </div>
                                }
                                <hr></hr>
                            </>
                            : ''
                    }


                    <div style={{ marginLeft: '15px', marginRight: '15px' }}>
                        {
                            days_time == true ?
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'black' }}>
                                        <p style={{ fontWeight: 'bolder', margin: 0, width: '50px', textAlign: 'center', textWrap: 'nowrap' }}>Start Time</p>
                                        <input type='time' style={{ fontWeight: 'bolder', fontSize: '15px', backgroundColor: '#e32747', color: 'white', border: 'none', borderRadius: '5px', padding: '5px', paddingLeft: '5px', paddingRight: '5px', }} value={starttime} onChange={(e) => {
                                            parentFunction(currentfullyear, currentMonth, date, e.target.value, endtime, 'time')
                                        }}></input>
                                    </div>

                                    {
                                        flag == 'endTime' ?
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'black', marginTop: '10px' }}>
                                                <p style={{ fontWeight: 'bolder', margin: 0, width: '50px', textAlign: 'center', textWrap: 'nowrap' }}>End Time</p>
                                                <input type='time' style={{ fontWeight: 'bolder', fontSize: '15px', backgroundColor: '#e32747', color: 'white', border: 'none', borderRadius: '5px', padding: '5px', paddingLeft: '5px', paddingRight: '5px', }} value={endtime} onChange={(e) => {
                                                    parentFunction(currentfullyear, currentMonth, date, starttime, e.target.value, 'time')
                                                }}></input>
                                            </div>
                                            : flag == 'hour' ?
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'black', marginTop: '10px' }}>
                                                    <p style={{ fontWeight: 'bolder', margin: 0, width: '50px', textAlign: 'center', textWrap: 'nowrap' }}>Duration</p>
                                                    <select id="hour" style={{ width: '113px', backgroundColor: '#e32747', color: 'white', borderRadius: '5px', padding: '3px' }} onChange={(e) => {
                                                        select_hour(e.target.value)
                                                    }}>
                                                        <option value="1:00:00">1:00:00</option>
                                                        <option value="2:00:00">2:00:00</option>
                                                        <option value="3:00:00">3:00:00</option>
                                                        <option value="4:00:00">4:00:00</option>
                                                        <option value="5:00:00">5:00:00</option>
                                                        <option value="6:00:00">6:00:00</option>
                                                    </select>
                                                </div>
                                                : ''
                                    }
                                    <hr></hr>
                                </>
                                : ''
                        }


                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <button style={{ backgroundColor: '#e22747', color: 'white', padding: '5px', borderRadius: '20px', border: '1px solid gray' }} onClick={() => {
                                apply_can_fun()
                            }}>Cancel</button>

                            <button style={{ backgroundColor: '#e22747', color: 'white', padding: '5px', borderRadius: '20px', border: '1px solid gray' }} onClick={() => {
                                apply_can_fun()
                            }}>Apply</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
