import React, { useState } from 'react'
import {
    Row,
    Col,
    Card,
    Table,
    Tabs,
    Tab,
    Container,
    Button,
} from "react-bootstrap";
import MicIcon from '@mui/icons-material/Mic';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import SendIcon from '@mui/icons-material/Send';
import '../style.css'

export default function Index() {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();
    const [lable, setlable] = useState('Hold to record audio')
    console.log(listening);
    return (
        <Row>

            <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <div id='del' style={{ backgroundColor: 'black', position: 'absolute', top: 55, width: 180, padding: '10px', borderRadius: '15px', display: 'none' }}>
                        <div style={{ position: 'relative' }}>
                            <ArrowDropUpIcon style={{ color: 'black', position: 'absolute', fontSize: '40px', top: -33 }} />
                            <p style={{ color: 'white', fontWeight: 'bolder', margin: 0 }}>{listening ? 'Recording...' : 'Hold to record audio'}</p>
                        </div>
                    </div>
                    <MicIcon style={{ fontSize: '50px' }} onMouseOver={() => {
                        let div = document.getElementById('del')
                        div.style.display = 'block'
                    }} onMouseOut={() => {
                        let div = document.getElementById('del')
                        div.style.display = 'none'
                    }} onMouseDown={() => {
                        SpeechRecognition.startListening({ continuous: true })
                    }} onMouseUp={() => {
                        SpeechRecognition.stopListening()
                    }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', width: '100%', }}>
                    <div style={{ width: '100%' }}>
                        <p className='eventbtn' style={{ color: 'grey', margin: 0 }}>{transcript === '' ? 'Hold the mic to record audio' : transcript}</p>
                    </div>
                </div>

                <div>
                    <SendIcon style={{ fontSize: '50px' }} />
                </div>
            </Col>
        </Row>
    )
}
