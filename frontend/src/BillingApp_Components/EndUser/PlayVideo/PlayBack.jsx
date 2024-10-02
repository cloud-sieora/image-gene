import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import AWS from "aws-sdk";
import axios from "axios";
import * as api from "../../Configurations/Api_Details";
import { Pause, PlayArrow } from "@mui/icons-material";

const PlayBack = ({ selected_hour }) => {
  const [playing, setPlaying] = useState(false);
  const [allCameraData, setAllCameraData] = useState([]);
  const [videoUrls, setVideoUrls] = useState({});
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDurations, setVideoDurations] = useState([]); // Store the duration of each video
  const playerRefs = useRef([]);
  const currentVideoIndices = useRef({}); // Track which video is playing for each camera
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const speedOptions = [0.2, 0.5, 1, 1.5, 2, 3]; // Define playback speed options

  const { startdate, starttime, enddate, selected_cameras } = useSelector(
    (state) => state
  );

  const totalDuration = parseSelectedHour(selected_hour); // Total time for selected hour in seconds

  const generateSignedUrl = async (key) => {
    const s3 = new AWS.S3({
      region: "ap-south-1",
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
    });

    const params = {
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Key: key,
      Expires: 60 * 5,
    };

    try {
      return await s3.getSignedUrlPromise("getObject", params);
    } catch (error) {
      console.error("Error generating signed URL:", error);
      return null;
    }
  };

  const handleGetAllVideoUrl = async () => {
    try {
      const allData = await Promise.all(
        selected_cameras.map(async (camera) => {
          const data = {
            start_date: startdate,
            start_time: starttime,
            end_date: enddate,
            selected_hour,
            camera_id: camera._id,
          };

          const res = await axios.post(api.GET_ALL_CAMERA_VIDEO_URL, data);
          return res.data?.data || [];
        })
      );
      setAllCameraData(allData);
    } catch (err) {
      console.error("Error fetching video URLs:", err);
    }
  };

  useEffect(() => {
    handleGetAllVideoUrl();
  }, [selected_cameras, startdate, starttime, enddate, selected_hour]);

  useEffect(() => {
    const fetchAllVideoUrls = async () => {
      const urls = {};
      await Promise.all(
        allCameraData.map(async (camera, index) => {
          if (camera.length > 0 && camera[0].video_key) {
            const url = await generateSignedUrl(camera[0].video_key);
            urls[index] = { currentUrl: url, videoIndex: 0 };
            currentVideoIndices.current[index] = 0;
          }
        })
      );
      setVideoUrls(urls);
    };

    if (allCameraData.length > 0) {
      fetchAllVideoUrls();
    }
  }, [allCameraData]);

  const handlePlayPause = () => {
    setPlaying((prev) => !prev);
  };

  // Helper function to get the start and end time of each video in sequence
  const getVideoTimeRange = (index, videoIndex) => {
    const videoDurationsForCamera = videoDurations[index] || [];
    const start = videoDurationsForCamera
      .slice(0, videoIndex)
      .reduce((a, b) => a + b, 0);
    const end = start + (videoDurationsForCamera[videoIndex] || 0);
    return { start, end };
  };

  const handleSeekClick = (e) => {
    const boundingRect = e.target.getBoundingClientRect();
    const clickX = e.clientX - boundingRect.left;
    const seekTime = (clickX / boundingRect.width) * totalDuration;

    setCurrentTime(seekTime);

    allCameraData.forEach((_, index) => {
      const videoUrlsForCamera = videoUrls[index];
      if (!videoUrlsForCamera) return;

      let cumulativeTime = 0;
      for (let i = 0; i < allCameraData[index].length; i++) {
        const videoDuration = videoDurations[index]?.[i] || 0;

        if (
          seekTime >= cumulativeTime &&
          seekTime < cumulativeTime + videoDuration
        ) {
          // Seek to the corresponding time within the video
          playerRefs.current[index]?.seekTo(
            seekTime - cumulativeTime,
            "seconds"
          );
          currentVideoIndices.current[index] = i; // Update to the correct video index
          break;
        }
        cumulativeTime += videoDuration;
      }
    });
  };

  // onProgress: track progress and update currentTime
  const handleProgress = (index, { playedSeconds }) => {
    const { start } = getVideoTimeRange(
      index,
      currentVideoIndices.current[index]
    );
    setCurrentTime(start + playedSeconds); // Adjust current time to include previous video durations
  };

  const handleVideoEnded = async (index) => {
    const cameraData = allCameraData[index];
    const currentIndex = currentVideoIndices.current[index];

    // Check if there's a next video in the sequence for this camera
    if (cameraData && cameraData.length > currentIndex + 1) {
      currentVideoIndices.current[index] += 1;
      const nextVideo =
        cameraData[currentVideoIndices.current[index]].video_key;

      try {
        const url = await generateSignedUrl(nextVideo);
        if (url) {
          // Update the current video URL and ensure the player continues playing
          setVideoUrls((prevUrls) => ({
            ...prevUrls,
            [index]: {
              currentUrl: url,
              videoIndex: currentVideoIndices.current[index],
            },
          }));

          // Update the current time based on cumulative video durations
          const { start } = getVideoTimeRange(
            index,
            currentVideoIndices.current[index]
          );
          setCurrentTime(start); // Set time to the beginning of the new video

          playerRefs.current[index].seekTo(0, "seconds"); // Seek to start of the next video
          setPlaying(true); // Continue playing
        }
      } catch (error) {
        console.error("Error fetching next video URL:", error);
        setPlaying(false); // Stop playing if no more videos
      }
    } else {
      // No more videos to play, stop the playback
      setPlaying(false);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
          height: "70vh",
          overflowY: "scroll",
          backgroundColor: "#f4f6f6",
          borderRadius: "10px",
        }}
      >
        {allCameraData.map((camera, index) => {
          const videoUrl = videoUrls[index]?.currentUrl;

          return (
            <div key={index}>
              {camera.length > 0 && videoUrl ? (
                <ReactPlayer
                  ref={(el) => (playerRefs.current[index] = el)}
                  url={videoUrl}
                  playing={playing}
                  controls={false}
                  playbackRate={playbackSpeed} // Add playback speed support
                  width="300px"
                  height="200px"
                  onEnded={() => handleVideoEnded(index)}
                  onProgress={(progress) => handleProgress(index, progress)}
                  onDuration={(duration) => {
                    setVideoDurations((prevDurations) => {
                      const newDurations = [...prevDurations];
                      newDurations[index] = [
                        ...(newDurations[index] || []),
                        duration,
                      ];
                      return newDurations;
                    });
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "300px",
                    height: "200px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p>Video not found</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <label style={{ marginRight: "10px" }}>Speed:</label>
        {speedOptions.map((speed) => (
          <button
            key={speed}
            onClick={() => setPlaybackSpeed(speed)}
            style={{
              marginRight: "5px",
              backgroundColor: playbackSpeed === speed ? "#007bff" : "#fff",
              color: playbackSpeed === speed ? "#fff" : "#000",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            {speed}x
          </button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button onClick={handlePlayPause} style={{ marginRight: "10px" }}>
          {playing ? <Pause /> : <PlayArrow />}
        </button>
        <div
          style={{
            width: "80%",
            height: "5px",
            backgroundColor: "#ccc",
            cursor: "pointer",
          }}
          onClick={handleSeekClick}
        >
          <div
            style={{
              width: `${(currentTime / totalDuration) * 100}%`,
              height: "100%",
              backgroundColor: "#007bff",
            }}
          />
        </div>
        <span style={{ marginLeft: "10px" }}>{formatTime(currentTime)}</span>
      </div>
    </div>
  );
};

const parseSelectedHour = (selected_hour) => {
  const [hours, minutes, seconds] = selected_hour.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds; // Total seconds
};

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
};

export default PlayBack;
