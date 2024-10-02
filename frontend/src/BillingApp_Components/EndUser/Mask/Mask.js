
import React, { useEffect, useRef, useState } from 'react';
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
import Grid from '@mui/material/Grid';
import MenuIcon from '@mui/icons-material/Menu';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import CircularProgress from '@mui/material/CircularProgress';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import UndoIcon from '@mui/icons-material/Undo';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import * as api from '../../Configurations/Api_Details'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import axios from 'axios';

import { S3 } from "@aws-sdk/client-s3";
import AWS from "aws-sdk";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CreateBucketCommand, S3Client, GetObjectCommand, ListBucketsCommand, DeleteBucketCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

import getImageSize from 'image-size-from-url';

const s3Client = new S3({
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    endpoint: "https://sgp1.digitaloceanspaces.com",
    region: "us-east-1",
    credentials: {
        accessKeyId: "7GNWRGQS5347V5X7O4LV",
        secretAccessKey: "RNMZe1dhsFiOOA6uNa8y684V+u9ZgIbL3ENfd6Lzt8M"
    }
});

const DrawRectangle = ({ fun, image_edited, image, data1, camera_name, mask1, p, type, analytic_type, over_image_array, fun_over_image_array, second_flag, save_trigger }) => {
    // let image_edited = `https://sgp1.digitaloceanspaces.com/tentovision/T0001/Office.jpg?${new Date()}`
    // let image = `https://sgp1.digitaloceanspaces.com/tentovision/T0001/Office.jpg?${new Date()}`

    const digitalOceanSpaces = 'https://tentovision.s3.ap-south-1.amazonaws.com/'
    const bucketName = process.env.REACT_APP_AWS_BUCKET_NAME
    const userData = JSON.parse(localStorage.getItem("userData"))
    console.log(over_image_array);
    console.log(image_edited);
    console.log(camera_name);
    console.log(mask1);
    console.log(data1);

    const [drawing, setDrawing] = useState(
        // image_edited === 'none'  ? image : image_edited
    )
    const [drawing1, setDrawing1] = useState(
        // image_edited
    )
    const [button, setbutton] = useState('STROK')
    const [undo, setundo] = useState([])
    const [undo1, setundo1] = useState([])
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [height, setheight] = useState(300);
    const [width, setwidth] = useState(300);
    const [img_name, setimg_name] = useState('');
    const [save, setsave] = useState(true);
    const [count, setcount] = useState(image_edited === 'none' ? true : false);
    const [mask, setmask] = useState(true);
    console.log(mask);

    const canvasOffSetX = useRef(null);
    const canvasOffSetY = useRef(null);
    const startX = useRef(null);
    const startY = useRef(null);

    const device = JSON.parse(localStorage.getItem("device"))
    console.log(device);

    useEffect(() => {
        if (save_trigger > 0) {
            overall_save()
        }
    }, [save_trigger])


    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = width
        canvas.height = height

        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = "red";
        context.fillStyle = "rgba(252, 3, 3,0.5)"
        context.lineWidth = 5;
        contextRef.current = context;

        canvasOffSetX.current = canvas.offsetLeft;
        canvasOffSetY.current = canvas.offsetTop;

    }, [drawing, height, width, second_flag]);

    useEffect(() => {
        console.log(image_edited);
        if (image_edited !== 'none') {
            image_edited === 'none' ? get() : setDrawing(image_edited)
            setDrawing1(image_edited)
            setmask(true)
        } else {
            console.log(image_edited);
            let progress = document.getElementById('progress')
            let savebtn = document.getElementById('savebtn')
            let undo = document.getElementById('undo')
            let delete1 = document.getElementById('delete')
            let alert = document.getElementById('alert')
            let success = document.getElementById('success')
            progress.style.display = 'none'
            savebtn.style.display = 'block'
            undo.style.display = 'block'
            delete1.style.display = 'block'
            alert.style.display = 'none'
            success.style.display = 'none'

            get()
            setundo([])
            setundo1([])
            setDrawing1('none')
            setcount(true)
            setmask(false)
        }
    }, [mask1, second_flag])

    function get() {
        // let data = JSON.stringify({
        //     "camera_name": camera_name
        // });

        // let config = {
        //     method: 'post',
        //     maxBodyLength: Infinity,
        //     url: `${device.empty}/uri_base`,
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     data: data
        // };

        // axios.request(config)
        //     .then((response) => {
        //         let url = dataURItoBlob(`data:image/jpeg;base64,${response.data.data}`)
        //         let objectURL = URL.createObjectURL(url);
        //         setDrawing(objectURL)
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     })
        // let url = dataURItoBlob(`data:image/jpeg;base64,${mask1}`)
        // let objectURL = URL.createObjectURL(url);
        setDrawing(mask1)
    }

    function put() {
        let data = JSON.stringify(
            {
                "_id": data1._id, "device_id": data1.device_id, "camera_gereral_name": data1.camera_gereral_name, "from": data1.from, "to": data1.from, "camera_username": data1.camera_username, "password": data1.password, "local_ip": data1.local_ip, "rtsp": data1.rtsp, "channel": data1.channel, "vendor": data1.vendor, "type": data1.type, "notification_alert": data1.notification_alert, "intrusion": 1, "empty": data1.empty, "__v": data1.__v
            });

        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: `https://tentovision1.cloudjiffy.net/camera_creation_api/${data1._id}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                // trigger()
                // setcameras(response.data)
                // setselectedcameras(response.data)
                // setcut_off(true)
                // dispatch({ type: SELECTED_CAMERAS, value: response.data })
                // dispatch({ type: APPLY, value: !apply })


            })
            .catch((error) => {
                console.log(error);
            })
    }

    function trigger() {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${device.empty}/trigger`,
            headers: {
                'Content-Type': 'application/json'
            },
        };

        axios.request(config)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function width_height() {
        // let img_outer=document.getElementById('img-outer').offsetWidth
        let img_height = document.getElementById(`img-div${p}`).offsetHeight
        let img_width = document.getElementById(`img-div${p}`).offsetWidth
        // img_div.style.width=img_outer
        console.log(img_height);
        console.log(img_width);
        setheight(img_height)
        setwidth(img_width)

        // let canva=document.getElementById('canva')
        // canva.style.height=img_div

        // const canvas = canvasRef.current;
        // const context = canvas.getContext("2d");
        // context.lineCap = "round";
        // context.strokeStyle = "red";
        // context.fillStyle = "rgba(252, 3, 3,0.5)"
        // context.lineWidth = 5;
        // contextRef.current = context;
    }

    const startDrawingRectangle = ({ nativeEvent }) => {
        console.log('startDrawingRectangle')

        nativeEvent.preventDefault();
        nativeEvent.stopPropagation();

        var rect = canvasRef.current.getBoundingClientRect();

        startX.current = nativeEvent.clientX - rect.left
        startY.current = nativeEvent.clientY - rect.top;

        setIsDrawing(true);
    };

    const drawRectangle = ({ nativeEvent }) => {

        console.log('drawRectangle')
        if (!isDrawing) {
            return;
        }

        nativeEvent.preventDefault();
        nativeEvent.stopPropagation();

        var rect = canvasRef.current.getBoundingClientRect();

        let x = nativeEvent.clientX - rect.left
        let y = nativeEvent.clientY - rect.top;
        let x1 = x - startX.current
        let y1 = y - startY.current


        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        if (button === 'MASK') {
            contextRef.current.fillRect(startX.current, startY.current, x1, y1);
        } else if (button === 'STROK') {
            contextRef.current.strokeRect(startX.current, startY.current, x1, y1);
        } else if (button === 'LINE') {
            contextRef.current.beginPath();
            contextRef.current.moveTo(startX.current, startY.current);
            contextRef.current.lineTo(x, y)
            contextRef.current.stroke();
        }

    };

    const stopDrawingRectangle = () => {
        console.log('stopDrawingRectangle')
        if (isDrawing) {
            saveImageToLocal()
        }
        setIsDrawing(false);
    };

    const saveImageToLocal = async () => {
        let url = drawing
        console.log('main');
        console.log(url);

        let image = canvasRef.current
        let img = ''

        if (analytic_type == 'masking') {
            img = await loadImage(url)
        } else {
            let split_url = url.split(':')
            if (split_url[0] == 'https') {
                img = await loadImage(url)
            } else {
                img = url
            }
        }
        main()

        function main() {
            console.log('main inside')
            console.log(img)

            let imgage_new = new Image();


            imgage_new.onload = (e) => {
                console.log(e.target.src);

                let width = e.target.width
                let height = e.target.height

                var rect = canvasRef.current.getBoundingClientRect();
                const canvas = document.createElement("canvas");
                canvas.width = rect.width
                canvas.height = rect.height

                let baseCanvasContex = canvas.getContext("2d");

                let scale_factor = Math.min(canvas.width / width, canvas.height / height);
                let newWidth = width * scale_factor;
                let newHeight = height * scale_factor;
                // let x = (canvas.width / 2) - (newWidth / 2);
                // let y = (canvas.height / 2) - (newHeight / 2);

                baseCanvasContex.drawImage(imgage_new, 0, 0, newWidth, newHeight);
                baseCanvasContex.drawImage(image, 0, 0);

                undo.push(canvas.toDataURL("image/jpeg"))
                undo1.push(canvas.toDataURL("image/jpeg"))
                // console.log(JSON.stringify(canvas.toDataURL("image/jpeg")));
                // var objectURL = URL.createObjectURL(blob);
                setDrawing1(canvas.toDataURL("image/jpeg"));

                if (analytic_type != 'masking') {
                    setDrawing(canvas.toDataURL("image/jpeg"));
                }
                // setDrawing(canvas.toDataURL());
            }

            imgage_new.crossOrigin = 'anonymous'
            imgage_new.src = img;
        }

        async function loadImage(src) {
            console.log(src);

            const s3Client = new S3Client({
                region: "ap-south-1",
                credentials: {
                    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
                    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
                },
            });

            const image_command = new GetObjectCommand({
                Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                Key: data1.mask,
            });

            let image_uri = await getSignedUrl(s3Client, image_command)
            console.log(image_uri);
            return image_uri

            // image.src = `${src}?crossorigin`;
            // image.setAttribute('crossOrigin', 'anonymous');

        }

    };

    function un() {
        if (undo.length !== 0) {
            undo.pop()
            if (undo.length === 0) {
                // console.log(image);
                contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                setDrawing((old) => old)
                setDrawing1('')
            } else {
                setDrawing(undo[undo.length - 1])
                setDrawing1(undo[undo.length - 1])
            }
        }
    }

    function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;

        console.log(dataURI);
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
    }

    async function savemaskimage(blob) {
        const S3_BUCKET = process.env.REACT_APP_AWS_BUCKET_NAME;
        const REGION = "ap-south-1";

        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY
        });
        const s3 = new AWS.S3({
            params: { Bucket: S3_BUCKET },
            region: REGION,
        });

        const params = {
            Bucket: S3_BUCKET,
            Key: blob.name,
            Body: blob,
        };

        var upload = s3
            .putObject(params)
            .on("httpUploadProgress", (evt) => {
                console.log(
                    "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
                );
            })
            .promise();

        await upload.then(() => {
            putcamera(blob)
        }).catch((e) => {
            console.log(e);
        })
    }

    function putcamera(blob) {
        let progress = document.getElementById('progress')
        let savebtn = document.getElementById('savebtn')
        let undo = document.getElementById('undo')
        let delete1 = document.getElementById('delete')
        let alert = document.getElementById('alert')
        let success = document.getElementById('success')

        let imag = []
        over_image_array.map((da, i) => {
            if (da.id == data1._id) {
                da.img_arr.map((val, k) => {
                    if (val.flag == true) {
                        da.img_arr[k].url = blob.name
                        imag = da.img_arr
                    }

                    if (val.url != 'NONE') {
                        imag = da.img_arr
                    }
                })
            }
        })



        fun_over_image_array(over_image_array)

        let device_details = {}

        if (analytic_type == 'masking') {
            device_details = {
                ...data1,
                "image_edited": imag,
                alert: 1
            };
        } else if (analytic_type == 'people_masking') {
            device_details = {
                ...data1,
                "image_edited_people": imag,
                people_analytics: 1
            };
        } else if (analytic_type == 'vehicle_masking') {
            device_details = {
                ...data1,
                "image_edited_vehicle": imag,
                vehicle_analytics: 1
            };
        } else if (analytic_type == 'face_masking') {
            device_details = {
                ...data1,
                "image_edited_face": imag,
                face_dedaction: 1
            };
        } else if (analytic_type == 'anpr_masking') {
            device_details = {
                ...data1,
                "image_edited_anpr": imag,
                anpr: 1
            };
        }




        const options = {
            url: api.CAMERA_CREATION + data1._id,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(device_details)
        };

        console.log(device_details)

        axios(options)
            .then(response => {
                console.log(response);
                progress.style.display = 'none'
                savebtn.style.display = 'none'
                success.style.display = 'block'
                undo.style.display = 'none'
                delete1.style.display = 'block'
                alert.style.display = 'none'
                setsave(true)
                setmask(true)

                AWS.config.update({
                    region: 'ap-south-1', // e.g., 'us-east-1'
                    credentials: {
                        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
                        secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
                    },
                });

                const iot = new AWS.IotData({
                    endpoint: process.env.REACT_APP_AWS_MQTT_KEY
                });

                const params = {
                    topic: `${response.data.device_id}/edit_image`,
                    payload: analytic_type == 'masking' ? JSON.stringify({ user_id: userData._id, key: response.data.image_edited, device_id: response.data.device_id, camera_id: response.data._id, type: 'alert_masking' })
                        : analytic_type == 'people_masking' ? JSON.stringify({ user_id: userData._id, key: response.data.image_edited_people, device_id: response.data.device_id, camera_id: response.data._id, type: 'people_masking' })
                            : analytic_type == 'vehicle_masking' ? JSON.stringify({ user_id: userData._id, key: response.data.image_edited_vehicle, device_id: response.data.device_id, camera_id: response.data._id, type: 'vehicle_masking' })
                                : analytic_type == 'face_masking' ? JSON.stringify({ user_id: userData._id, key: response.data.image_edited_vehicle, device_id: response.data.device_id, camera_id: response.data._id, type: 'face_masking' })
                                    : analytic_type == 'anpr_masking' ? JSON.stringify({ user_id: userData._id, key: response.data.image_edited_vehicle, device_id: response.data.device_id, camera_id: response.data._id, type: 'anpr_masking' })
                                        : '',
                    qos: 0
                };

                iot.publish(params, (err, data) => {
                    if (err) {
                        console.error('Error publishing message:', err);
                    } else {
                        console.log('Message published successfully:', data);
                    }
                });
                // put()
            })
            .catch(function (e) {
                progress.style.display = 'none'
                savebtn.style.display = 'none'
                undo.style.display = 'none'
                delete1.style.display = 'none'
                alert.style.display = 'block'
                success.style.display = 'none'
                console.log(e);
                // if (e.message === 'Network Error') {
                //     alert("No Internet Found. Please check your internet connection")
                // }
                // else {

                //     alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                // }


            });
    }

    function overall_save() {
        let progress = document.getElementById('progress')
        let savebtn = document.getElementById('savebtn')
        let undo = document.getElementById('undo')
        let delete1 = document.getElementById('delete')
        let alert = document.getElementById('alert')
        let success = document.getElementById('success')
        progress.style.display = 'block'
        savebtn.style.display = 'none'
        undo.style.display = 'none'
        delete1.style.display = 'none'

        let imag = []

        for (let index = 0; index < over_image_array.length; index++) {
            if (over_image_array[index].id == data1._id) {
                let flag = false
                for (let index1 = 0; index1 < over_image_array[index].img_arr.length; index1++) {
                    if (over_image_array[index].img_arr[index1].url != 'NONE') {
                        imag = over_image_array[index].img_arr
                        flag = true
                    } else {
                        flag = false
                        break
                    }
                }

                if (!flag) {
                    imag = []
                }
            }

        }

        if (imag.length != 0) {
            let device_details = {}

            if (analytic_type == 'masking') {
                device_details = {
                    ...data1,
                    "image_edited": imag
                };
            } else if (analytic_type == 'people_masking') {
                device_details = {
                    ...data1,
                    "image_edited_people": imag
                };
            } else if (analytic_type == 'vehicle_masking') {
                device_details = {
                    ...data1,
                    "image_edited_vehicle": imag
                };
            } else if (analytic_type == 'face_masking') {
                device_details = {
                    ...data1,
                    "image_edited_face": imag
                };
            } else if (analytic_type == 'anpr_masking') {
                device_details = {
                    ...data1,
                    "image_edited_anpr": imag
                };
            }




            const options = {
                url: api.CAMERA_CREATION + data1._id,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(device_details)
            };

            console.log(device_details)

            axios(options)
                .then(response => {
                    console.log(response);
                    progress.style.display = 'none'
                    savebtn.style.display = 'none'
                    success.style.display = 'block'
                    undo.style.display = 'none'
                    delete1.style.display = 'block'
                    alert.style.display = 'none'
                    setsave(true)
                    setmask(true)

                    AWS.config.update({
                        region: 'ap-south-1', // e.g., 'us-east-1'
                        credentials: {
                            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
                            secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
                        },
                    });

                    const iot = new AWS.IotData({
                        endpoint: process.env.REACT_APP_AWS_MQTT_KEY
                    });

                    const params = {
                        topic: `${response.data.device_id}/edit_image`,
                        payload: analytic_type == 'masking' ? JSON.stringify({ user_id: userData._id, key: response.data.image_edited, device_id: response.data.device_id, camera_id: response.data._id, type: 'alert_masking' })
                            : analytic_type == 'people_masking' ? JSON.stringify({ user_id: userData._id, key: response.data.image_edited_people, device_id: response.data.device_id, camera_id: response.data._id, type: 'people_masking' })
                                : analytic_type == 'vehicle_masking' ? JSON.stringify({ user_id: userData._id, key: response.data.image_edited_vehicle, device_id: response.data.device_id, camera_id: response.data._id, type: 'vehicle_masking' })
                                    : analytic_type == 'face_masking' ? JSON.stringify({ user_id: userData._id, key: response.data.image_edited_vehicle, device_id: response.data.device_id, camera_id: response.data._id, type: 'face_masking' })
                                        : analytic_type == 'anpr_masking' ? JSON.stringify({ user_id: userData._id, key: response.data.image_edited_vehicle, device_id: response.data.device_id, camera_id: response.data._id, type: 'anpr_masking' })
                                            : '',
                        qos: 0
                    };

                    iot.publish(params, (err, data) => {
                        if (err) {
                            console.error('Error publishing message:', err);
                        } else {
                            console.log('Message published successfully:', data);
                        }
                    });
                    // put()
                })
                .catch(function (e) {
                    progress.style.display = 'none'
                    savebtn.style.display = 'none'
                    undo.style.display = 'none'
                    delete1.style.display = 'none'
                    alert.style.display = 'block'
                    success.style.display = 'none'
                    console.log(e);
                    // if (e.message === 'Network Error') {
                    //     alert("No Internet Found. Please check your internet connection")
                    // }
                    // else {

                    //     alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                    // }


                });
        } else {
            window.alert('save mask image!')
        }



    }


    return (

        <Grid item md={12} sx={12} xs={12}>
            <div style={{ paddingBottom: '20px' }}>
                <div>
                    <div style={{ backgroundColor: '#181828', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', }}>
                            <OpenInFullIcon style={{ fontSize: '30px', color: button === 'MASK' ? 'grey' : 'white', margin: 0 }} onClick={() => { setbutton('MASK') }} />
                            <p style={{ color: button === 'MASK' ? 'grey' : 'white', marginLeft: '10px', marginRight: '10px', marginBottom: 0, cursor: 'pointer' }} onClick={() => { setbutton('MASK') }} >MASK</p>

                            <HighlightAltIcon style={{ fontSize: '30px', color: button === 'STROK' ? 'grey' : 'white', margin: 0 }} onClick={() => { setbutton('STROK') }} />
                            <p style={{ color: button === 'STROK' ? 'grey' : 'white', marginLeft: '10px', marginRight: '10px', marginBottom: 0, cursor: 'pointer' }} onClick={() => { setbutton('STROK') }}>STROK</p>

                            <HorizontalRuleIcon style={{ fontSize: '30px', color: button === 'LINE' ? 'grey' : 'white', margin: 0 }} onClick={() => { setbutton('LINE') }} />
                            <p style={{ color: button === 'LINE' ? 'grey' : 'white', marginLeft: '10px', marginRight: '10px', marginBottom: 0, cursor: 'pointer' }} onClick={() => { setbutton('LINE') }}>LINE</p>

                            {/* <MenuIcon style={{ fontSize: '30px', color: 'blue', margin: 0 }} /> */}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p style={{ color: 'white', fontSize: '18px', margin: 0, fontWeight: 'bolder' }}>{camera_name}</p>
                        </div>
                    </div>
                    <div id='' style={{ backgroundColor: '#cdcdcd', display: 'flex', flexDirection: 'column', padding: '20px', }}>
                        <div id='img-outer'>

                            <div style={{ display: drawing === '' || drawing === 'none' ? 'none' : 'block', }}>

                                <div id='progress' style={{ display: 'none' }}>
                                    <div style={{ height: `${height}px`, width: `${width}px`, backgroundColor: 'rgb(128,128,128,0.5)', position: 'absolute', zIndex: 1 }}>
                                    </div>

                                    <div style={{ height: `${height}px`, width: `${width}px`, display: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', zIndex: 2 }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <CircularProgress style={{ color: '#e32747' }} />
                                            <p style={{ color: 'white' }}>Please wait...</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <div id={`img-div${p}`} style={{ border: '2px solid grey', position: 'absolute', verticalAlign: 'bottom', lineHeight: '0%', display: 'block' }}>
                                        <img id={`img${p}`} onLoad={() => {
                                            width_height()

                                        }} src={drawing} alt="exported drawing" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                                    </div>
                                </div>

                                <canvas id='canva' style={{ height: `${height}`, width: `${width}`, cursor: 'crosshair', zIndex: 0, position: 'relative', }}
                                    ref={canvasRef}
                                    onMouseDown={(event) => {
                                        if (mask !== true) {
                                            startDrawingRectangle(event)
                                        }
                                    }}
                                    onMouseMove={(event) => {
                                        if (mask !== true) {
                                            drawRectangle(event)
                                        }
                                    }}
                                    onMouseUp={(event) => {
                                        if (mask !== true) {
                                            stopDrawingRectangle(event)
                                        }
                                    }}
                                    onMouseLeave={(event) => {
                                        if (mask !== true) {
                                            stopDrawingRectangle(event)
                                        }
                                    }}
                                >
                                </canvas>

                                <p id='alert' style={{ color: 'red', fontSize: '12px', margin: 5, display: 'none' }}>Something went wrong... please mask again and save</p>
                                <p id='alert' style={{ color: '#181828', fontSize: '12px', margin: 5, display: mask ? 'block' : 'none' }}>The above masking saved. Do you want to change the mask click the delete button and change it...</p>

                                <p id='success' style={{ color: '#1ee02c', fontSize: '12px', margin: 5, display: 'none' }}>saved successfully</p>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ display: mask ? 'none' : 'block' }}>
                                        <button id='undo' style={{ display: 'flex', alignItems: 'center', backgroundColor: '#181828', borderRadius: '5px', color: 'white', border: `2px solid #181828`, marginRight: '5px' }} onClick={un}><UndoIcon style={{ fontSize: '30px', color: 'white', margin: 0 }} />Undo</button>
                                    </div>
                                    {
                                        console.log(mask ? 'none' : 'block')
                                    }

                                    <div style={{ display: mask ? 'none' : 'block' }}>
                                        <button id='savebtn' style={{ display: 'flex', height: '100%', alignItems: 'center', backgroundColor: '#181828', borderRadius: '5px', color: 'white', border: `2px solid #181828`, marginRight: '5px' }} onClick={() => {

                                            let progress = document.getElementById('progress')
                                            let savebtn = document.getElementById('savebtn')
                                            let undo = document.getElementById('undo')
                                            let delete1 = document.getElementById('delete')
                                            let alert = document.getElementById('alert')
                                            let success = document.getElementById('success')
                                            progress.style.display = 'block'
                                            savebtn.style.display = 'none'
                                            undo.style.display = 'none'
                                            delete1.style.display = 'none'

                                            let blob_name = ''
                                            over_image_array.map((da, i) => {
                                                if (da.id == data1._id) {
                                                    da.img_arr.map((val, k) => {
                                                        if (val.flag == true) {
                                                            blob_name = val.id
                                                        }
                                                    })
                                                }
                                            })

                                            const blob = dataURItoBlob(drawing1);
                                            if (analytic_type == 'masking') {
                                                blob.name = `${data1.device_id}/${data1._id}/${blob_name}_edit.jpg`
                                            } else if (analytic_type == 'people_masking') {
                                                blob.name = `${data1.device_id}/${data1._id}/${blob_name}_people_edit.jpg`
                                            } else if (analytic_type == 'vehicle_masking') {
                                                blob.name = `${data1.device_id}/${data1._id}/${blob_name}_vehicle_edit.jpg`
                                            } else if (analytic_type == 'face_masking') {
                                                blob.name = `${data1.device_id}/${data1._id}/${blob_name}_face_edit.jpg`
                                            } else if (analytic_type == 'anpr_masking') {
                                                blob.name = `${data1.device_id}/${data1._id}/${blob_name}_anpr_edit.jpg`
                                            }
                                            console.log(blob);

                                            savemaskimage(blob)
                                        }
                                        }>Save</button>
                                    </div>

                                    <button id='delete' style={{ display: 'flex', alignItems: 'center', backgroundColor: '#181828', borderRadius: '5px', color: 'white' }}><DeleteForeverIcon style={{ fontSize: '30px', color: 'white', margin: 0 }} onClick={() => {
                                        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                                        let progress = document.getElementById('progress')
                                        let savebtn = document.getElementById('savebtn')
                                        let undo = document.getElementById('undo')
                                        let delete1 = document.getElementById('delete')
                                        let alert = document.getElementById('alert')
                                        let success = document.getElementById('success')
                                        progress.style.display = 'none'
                                        success.style.display = 'none'
                                        savebtn.style.display = 'block'
                                        undo.style.display = 'block'
                                        delete1.style.display = 'block'

                                        get()
                                        setundo([])
                                        setundo1([])
                                        setDrawing1('none')
                                        setcount(true)
                                        setmask(false)
                                    }} /></button>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: drawing === '' || drawing === 'none' ? 'block' : 'none', textAlign: 'center', width: '100%' }}>
                            <p style={{ color: '#181828' }}>A snapshot does not exist. </p>
                            <p style={{ color: '#181828', fontSize: '12px', margin: '0px' }}>A snapshot will be taken next time camera is trigerred.</p>
                            <p style={{ color: '#181828', fontSize: '12px', margin: '0px' }}>Pleace come back later.</p>
                            <NoPhotographyIcon style={{ fontSize: '70px', color: '#a8a4a4' }} />
                        </div>

                        {/* <div style={{ display: drawing === '' ? 'block' : 'none' }}>
                            <input type='file' onChange={(event) => {
                                if (event.target.files && event.target.files[0]) {
                                    setDrawing(URL.createObjectURL(event.target.files[0]));
                                    undo.push(URL.createObjectURL(event.target.files[0]));
                                    undo1.push(URL.createObjectURL(event.target.files[0]));
                                }
                            }}></input>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* <button onClick={() => {

                const spacesEndpoint = new AWS.Endpoint('sgp1.digitaloceanspaces.com/');
                const s3 = new AWS.S3({
                    endpoint: spacesEndpoint,
                    accessKeyId: "7GNWRGQS5347V5X7O4LV",
                    secretAccessKey: 'RNMZe1dhsFiOOA6uNa8y684V+u9ZgIbL3ENfd6Lzt8M'
                });

                const blob = dataURItoBlob(drawing1);
                blob.name = JSON.stringify(Date.now())
                console.log(blob);
                const params = {
                    Body: blob,
                    Bucket: bucketName,
                    Key: blob.name
                };





                s3.putObject(params)
                    .on('build', request => {
                        console.log(request.httpRequest.headers);
                        request.httpRequest.headers.Host = digitalOceanSpaces;
                        //    request.httpRequest.headers['Content-Length'] = blob.size;
                        request.httpRequest.headers['Content-Type'] = 'Access-Control-Allow-Headers';
                        request.httpRequest.headers['x-amz-acl'] = 'public-read';
                    })
                    .send((err) => {
                        if (err) {
                            console.log(err);
                            // errorCallback();
                        }
                        else {

                            const imageUrl = digitalOceanSpaces + "/" + blob.name
                            const Url = digitalOceanSpaces + "/" + blob.name

                            console.log(Url)
                            console.log(imageUrl)
                            fun(imageUrl)

                        }
                    });
            }}>UPLOAD</button>
            // <a href={drawing} download='my image1'>download</a> */}
            {/* <a href={drawing1} download='my image1'>download</a> */}
        </Grid>

    )
}

export default DrawRectangle;