const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch')
const moment = require('moment')

function splitRTSPStreams(rtspUrls, outputDir) {
    console.log(rtspUrls);

    let parent_folder = ''
    if (rtspUrls.lengt !== 0) {
        parent_folder = rtspUrls[0].device_id
        fs.mkdirSync(parent_folder, { recursive: true });
    }

    rtspUrls.forEach((rtspUrl, idx) => {
        // const streamOutputDir = `${rtspUrl.device_id}_${rtspUrl.camera_id}`
        const child_folder = path.join(parent_folder, rtspUrl.camera_id)
        fs.mkdirSync(child_folder, { recursive: true });

        // const outputPattern = `${streamOutputDir}_%Y-%m-%d_%H-%M-%S.mp4`;
        const outputPattern = path.join(child_folder, `${rtspUrl.device_id}_${rtspUrl.camera_id}_%Y-%m-%d_%H-%M-%S.mp4`);

        const ffmpegCommand = ffmpeg(rtspUrl.rtsp)
            .inputOptions([
                '-fflags +genpts',
                '-rtsp_transport tcp'
            ])
            .output(outputPattern) // Set output path here
            .outputOptions([
                '-c:v copy',
                '-c:a aac',
                '-f segment',
                '-segment_time 30',
                '-segment_format mp4',
                '-reset_timestamps 1',
                '-strftime 1',
                '-segment_time_delta 1'
            ])
            .on('start', function (commandLine) {
                console.log('Spawned Ffmpeg with command: ' + commandLine);
            })
            // .on('progress', function(progress) {
            //     // console.log(`Segment for camera ${idx} ${progress.timemark} finished writing at ${new Date().toString()}`);
            //     if (progress.timemark === '00:00:30.000') {
            //         console.log(`Segment for camera ${idx} finished writing at ${new Date().toISOString()}`);
            //     }
            // })
            .on('stderr', function (stderrLine) {
                if (stderrLine.includes('[segment @') && stderrLine.includes('Opening')) {
                    console.log('Stderr output: ' + stderrLine);

                    let file_path = stderrLine.split(' ')
                    

                    if (fs.existsSync('live_segment.json')) {
                        // File exists, you can proceed to read it
                        const fileContents = fs.readFileSync('live_segment.json', { encoding: 'utf8' });
                        const data = JSON.parse(fileContents)

                        let str = moment(new Date()).format('HH:mm:ss')
                        let en = moment(str, 'HH:mm:ss')
                        en.add(30, 'seconds')
                        data.push({ camera_id: rtspUrl.camera_id, device_id: rtspUrl.device_id, date: moment(new Date()).format('YYY-MM-DD'), start_duration: str, end_duration: en.format('HH:mm:ss'), file_path: file_path[4] })

                        fs.writeFileSync('live_segment.json', JSON.stringify(data, null, 2));

                    } else {

                        const data = []
                        let str = moment(new Date()).format('HH:mm:ss')
                        let en = moment(str, 'HH:mm:ss')
                        en.add(30, 'seconds')
                        data.push({ camera_id: rtspUrl.camera_id, device_id: rtspUrl.device_id, date: moment(new Date()).format('YYY-MM-DD'), start_duration: str, end_duration: en.format('HH:mm:ss'), file_path: file_path[4] })

                        fs.writeFileSync('live_segment.json', JSON.stringify(data, null, 4), (err) => {
                            if (err) {
                                console.error('Error creating file:', err);
                                return;
                            }
                            console.log('File created successfully');
                        });
                    }
                }
            })
            .on('error', function (err, stdout, stderr) {
                console.error('An error occurred: ' + err.message);
                console.error('ffmpeg stdout: ' + stdout);
                console.error('ffmpeg stderr: ' + stderr);
            })
            .on('end', function () {
                console.log('Processing finished!');
            });

        ffmpegCommand.run();
    });
}

// List of RTSP stream URLs
const rtspUrls = [
    'rtsp://admin:Sieora123@192.168.1.71:554/Streaming/Channels/101?transportmode=unicast&profile=Profile_1',
    'rtsp://admin:Sieora123@192.168.1.73:554/Streaming/Channels/101?transportmode=unicast&profile=Profile_1',
    // 'rtsp://admin:Sieora123@192.168.1.75:554/Streaming/Channels/101?transportmode=unicast&profile=Profile_1',
    'rtsp://admin:Sieora123@192.168.1.77:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',
    'rtsp://admin:Sieora123@192.168.1.80:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',
    'rtsp://admin:Sieora123@192.168.1.81:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',
    'rtsp://admin:Sieora123@192.168.1.82:554/1/1?transmode=unicast&profile=vam',
    'rtsp://admin:Sieora123@192.168.1.85:554/profile1',
];


const device = {
    method: 'POST',
    body: JSON.stringify({ device_id: `TEST002` }),
    headers: { 'Content-Type': 'application/json' }
}

const device_uri = 'https://tentovision1.cloudjiffy.net/list_device_camera'

fetch(device_uri, device)
    .then((data) => data.json())
    .then(async (value) => {

        // const fileContents = fs.readFileSync('device.json', { encoding: 'utf8' });
        // let data = []
        // try {

        //     data = JSON.parse(fileContents)
        // } catch (e) {
        //     console.log(e);
        // }

        // data=[]
        // data.push(value)

        if (fs.existsSync('device.json')) {
            // File exists, you can proceed to read it
            fs.writeFile('device.json', JSON.stringify(value, null, 4), (err) => {
                if (err) {
                    console.error('Error creating file:', err);
                    return;
                }
                console.log('File created successfully');

                let rtsp = []

                value.cameras.map((val) => {
                    rtsp.push({ camera_id: val._id, device_id: val.device_id, rtsp: val.camera_url })
                })


                // Output directory for segmented videos
                const outputDir = 'segmented_videos';

                // Split RTSP streams into segmented videos
                splitRTSPStreams(rtsp, outputDir);
            });

        } else {
            fs.writeFile('device.json', JSON.stringify(value, null, 4), (err) => {
                if (err) {
                    console.error('Error creating file:', err);
                    return;
                }
                console.log('File created successfully');

                let rtsp = []

                value.cameras.map((val) => {
                    rtsp.push({ camera_id: val._id, device_id: val.device_id, rtsp: val.camera_url })
                })

                // Output directory for segmented videos
                const outputDir = 'segmented_videos';

                // Split RTSP streams into segmented videos
                splitRTSPStreams(rtsp, outputDir);
            });
        }

    })