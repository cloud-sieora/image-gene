import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Switch from '@mui/material/Switch';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import * as api from '../Configurations/Api_Details'

function New({ onBack }) {
    const userData = JSON.parse(localStorage.getItem("userData"))
    const [change, setchange] = useState(false)
    const [cam, setcam] = useState('');
    const [selectcom, setselectcam] = useState('')
    const [toggle, settoggle] = useState(false)

    // const handleChange = (event) => {
    //     setcam(event.target.value);
    // };
    // const handleChange1 = (event) => {
    //     setselectcam(event.target.value);
    // };

    const [sections, setSections] = useState([
        {
            cam: "",
            selectcom: "",
        },
    ]);

    const handleChange = (index, value) => {
        const updatedSections = [...sections];
        updatedSections[index].cam = value;
        setSections(updatedSections);
    };

    const handleChange1 = (index, value) => {
        const updatedSections = [...sections];
        updatedSections[index].selectcom = value;
        setSections(updatedSections);
    };

    const handleAddSection = () => {
        setSections([...sections, { cam: "", selectcom: "" }]);
    };

    const handleDeleteSection = (index) => {
        const updatedSections = [...sections];
        updatedSections.splice(index, 1);
        setSections(updatedSections);
    };


    useEffect(() => {
        const axios = require('axios');
        let data = JSON.stringify({
            "user_id": userData._id
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: api.LIST_CAMERA_USER_ID,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                // console.log(JSON.stringify(response.data));
              
                console.log(response.data);
                
                let element = document.getElementById(`outerDiv${0}`).clientHeight
                let vid = document.getElementsByTagName('video')
                // for (var i = 0; i < vid.length; i++) {
                //     vid[i].height=element
                //     golive(vid[i], `${device.local_ip}/${device_id}_${response.data[i].camera_gereral_name}.m3u8`, i)
                // }


            })
            .catch((error) => {
                console.log(error);
            })


        
    }, [])




    return (
        <div>
            <Col
                xl={6}
                lg={6}
                md={8}
                sm={12}
                xs={12}
                style={{ padding: '10px' }}
            >
                <div onClick={onBack} style={{ display: "flex", justifyContent: "start", cursor: "pointer" }}>
                    <ArrowBackIcon />  <p style={{ fontSize: "16px", fontWeight: "bold" }} >Back</p>
                </div>
            </Col>
            <Col xl={6}
                lg={6}
                md={8}
                sm={12}
                xs={12}>

                <p style={{ fontWeight: "bold", fontSize: "30px" }}>Create presentation<span style={{ color: "#E32747" }}>.</span></p>

            </Col>
            <Col xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}>
                <p style={{ width: "100%", fontWeight: "bold" }}>Presentation mode rotates through customized views in full screen. Choose your cameras and display options below.</p>
            </Col>

            <Col xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}>
                <div style={{ backgroundColor: "#FFFFFF", width: "100%", height: "50%", boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px", borderRadius: "5px" }}>


                    <p style={{ fontWeight: "bold", fontSize: "23px", padding: "20px" }}>Choose which cameras to include in your presentation<span style={{ color: "#E32747" }}>.</span></p>
                    <hr style={{ borderColor: "#E32747", width: "95%" }} />


                    <div style={{ display: "flex", alignItems: "center", padding: "20px" }}>
                        <p style={{ color: toggle ? "black" : "#E32747", fontWeight: "bold", fontSize: "16px", margin: "0" }}>All Cameras</p>
                        <div>

                            <div style={{ marginLeft: "10px", marginRight: "10px", backgroundColor: toggle ? '#E32747' : '#DDDDDD', width: '2.5rem', height: '1.2rem', borderRadius: '15px', display: 'flex', justifyContent: toggle == true ? 'flex-end' : 'flex-start', alignItems: 'center', padding: '2px' }} onClick={() => {
                                settoggle(!toggle)

                                let check = document.getElementsByClassName('check')
                                if (toggle === false) {
                                    console.log(check);

                                } else {
                                    console.log(check);

                                }
                            }}>
                                <div style={{ backgroundColor: 'white', width: '1.1rem', height: '1.1rem', borderRadius: '50%' }}></div>
                            </div>
                        </div>

                        <p style={{ color: toggle ? "#E32747" : "black", fontWeight: "bold", fontSize: "16px", margin: "0" }}>Custom</p>
                    </div>

                    {toggle && (

                        <div >
                            {sections.map((section, index) => (
                                <div style={{marginTop:"20px"}} key={index}>
                                    <div style={{ justifyContent: "space-evenly", marginLeft: "20px", width: "80%", height: "60px", display: "flex", alignItems: "center", backgroundColor: "white", borderRadius: "50px", boxShadow: "#DDDDDD 0px 3px 8px" }}>
                                        <p style={{ fontSize: "40px", margin: "0", fontWeight: "bolder", color: "#A3A3A9" }}>=</p>
                                        <p style={{ fontSize: "40px", margin: "0", fontWeight: "bolder", color: "#E32747" }}>{index + 1}</p>

                                        <FormControl style={{ width: "20%", height: "35px" }}>
                                            <InputLabel id={`demo-simple-select-label-${index}`}>Cameras Tags</InputLabel>
                                            <Select
                                                style={{ height: "40px" }}
                                                labelId={`demo-simple-select-label-${index}`}
                                                id={`demo-simple-select-${index}`}
                                                value={section.cam}
                                                label="Cameras With Tags"
                                                defaultValue='camera_tags'
                                                onChange={(e) => handleChange(index, e.target.value)}
                                            >
                                                <MenuItem value={'camera_tags'}> Camera with Tags</MenuItem>
                                                <MenuItem value={'camera_groups'}>Camera in Group ...</MenuItem>
                                                
                                                
                                            </Select>
                                        </FormControl>
                                        <FormControl style={{ width: "20%", height: "35px" }}>
                                            <InputLabel style={{ height: "35px" }} id={`demo-simple-select-label-${index}`}>in cam</InputLabel>
                                            <Select
                                                style={{ height: "40px" }}
                                                labelId={`demo-simple-select-label-${index}`}
                                                id={`demo-simple-select-${index}`}
                                                value={section.selectcom}
                                                label="Cameras With Tags"
                                                onChange={(e) => handleChange1(index, e.target.value)}
                                            >
                                                <MenuItem value={'kjdbkja'}>asbdk</MenuItem>
                                                <MenuItem value={'dbkjask'}>mansbjas</MenuItem>
                                                <MenuItem value={'asba'}>asbckbakj</MenuItem>
                                            </Select>
                                        </FormControl>


                                        {/* <DeleteOutlineIcon style={{ cursor: "pointer" }} onClick={()  => handleDeleteSection(index)} /> */}
                                        <DeleteOutlineIcon
                                            style={{ cursor: sections.length > 1 ? "pointer" : "not-allowed", }}
                                            onClick={() => sections.length > 1 ? handleDeleteSection(index) : alert("Don't delete")}
                                        />



                                        {/* //   <DeleteOutlineIcon disabled style={{ cursor: "not-allowed",  }} /> */}



                                    </div>
                                </div>
                            ))}
                            <p
                                style={{
                                    cursor: "pointer",
                                    width: "10%",
                                    marginLeft: "30px",
                                    marginTop: "20px",
                                    fontWeight: "bold",
                                    textDecoration: "none",
                                }}
                                onClick={handleAddSection}
                                onMouseOver={(e) => e.target.style.textDecoration = "underline"}
                                onMouseOut={(e) => e.target.style.textDecoration = "none"}
                            >
                                +Add section
                            </p>
                        </div>

                    )}





                </div>



            </Col>
        </div>
    )
}

export default New