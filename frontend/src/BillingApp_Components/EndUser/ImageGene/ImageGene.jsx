import React, { useState } from "react";
import {
  DOWNLOAD_IMAGE_FROM_PATH,
  POSTER_CREATION_IMAGE_API,
  READ_IMAGE_FROM_PATH,
} from "../../Configurations/Api_Details";
import axios from "axios";
import Loading from "../../resources/Loading";

const ImageGene = () => {
  const [imageInputData, setImageInputData] = useState({
    colorCode1: "",
    colorCode2: "",
    colorCode3: "",
    description: "",
    offerType: "",
    offerPercentage: "",
  });
  const [imageData, setImageData] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleChangeImageInputData = (e) => {
    const { name, value } = e.target;
    setImageInputData({ ...imageInputData, [name]: value });
  };

  const handleSubmitImageData = async () => {
    setIsLoading(true);
    try {
      let payload = {
        colorCode1: imageInputData.colorCode1,
        colorCode2: imageInputData.colorCode2,
        colorCode3: imageInputData.colorCode3,
        description: imageInputData.description,
        offerType: imageInputData.offerType,
        offerPercentage: imageInputData.offerPercentage,
      };
      await axios.post(POSTER_CREATION_IMAGE_API, payload).then(async (res) => {
        setImagePath(res.data.data);
        let imagePayload = [
          {
            imageurl: res.data.data,
          },
        ];
        await axios
          .post(READ_IMAGE_FROM_PATH, imagePayload)
          .then((res) => {
            console.log("response from image", res.data.data);
            setImageData(res.data.data[0].imageurl);
            setIsLoading(false);
          })
          .catch((err) => {
            console.log("err", err);
            setIsLoading(false);
          });
      });
    } catch (err) {
      console.log("err", err);
      setIsLoading(false);
    }
  };

  const handleClickDownloadImage = async () => {
    try {
      const response = await axios.post(
        DOWNLOAD_IMAGE_FROM_PATH, // API endpoint
        { path: imagePath }, // Send image path to backend
        { responseType: "blob" } // Receive response as Blob
      );

      // Create a new Blob object from the response
      const imageBlob = new Blob([response.data], { type: "image/png" }); // Adjust MIME type if needed
      const imageURL = URL.createObjectURL(imageBlob);

      // Create a temporary <a> element
      const link = document.createElement("a");
      link.href = imageURL;

      // Optionally, extract the file name from the path or set your own
      const fileName = imagePath.split("/").pop(); // Extract the file name from the path
      link.download = fileName || "image.png"; // Set the download attribute

      // Append link to the document and trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up by removing the link and revoking the object URL
      document.body.removeChild(link);
      URL.revokeObjectURL(imageURL);
    } catch (err) {
      console.log("Error downloading image", err);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "200px",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "90%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "40px",
              width: "100%",
            }}
          >
            <input
              type="text"
              onChange={handleChangeImageInputData}
              name="offerType"
              id="offerType"
              value={imageInputData.offerType}
              placeholder="Enter the offer type"
              style={{
                width: "48%",
                height: "100%",
                border: "none",
                padding: "2px 8px",
                borderRadius: "6px",
              }}
            />
            <input
              type="number"
              onChange={handleChangeImageInputData}
              name="offerPercentage"
              id="offerPercentage"
              value={imageInputData.offerPercentage}
              placeholder="Enter the offer percentage"
              style={{
                width: "48%",
                height: "100%",
                border: "none",
                padding: "2px 8px",
                borderRadius: "6px",
              }}
            />
          </div>
          <div
            style={{
              width: "100%",
              height: "140px",
            }}
          >
            <textarea
              onChange={handleChangeImageInputData}
              name="description"
              id="description"
              value={imageInputData.description}
              placeholder="Enter prompt"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                padding: "2px 8px",
                borderRadius: "6px",
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
            width: "10%",
            height: "100%",
            backgroundColor: "#eaecee",
            borderRadius: "10px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
            }}
          >
            Color :{" "}
          </h2>
          <input
            type="color"
            onChange={handleChangeImageInputData}
            name="colorCode1"
            id="colorCode1"
            value={imageInputData.colorCode1}
          />
          <input
            type="color"
            onChange={handleChangeImageInputData}
            name="colorCode2"
            id="colorCode2"
            value={imageInputData.colorCode2}
          />
          <input
            type="color"
            onChange={handleChangeImageInputData}
            name="colorCode3"
            id="colorCode3"
            value={imageInputData.colorCode3}
          />
        </div>
      </div>
      <div
        style={{
          width: "50%",
          height: "50px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          margin: "auto",
        }}
      >
        <button
          onClick={handleSubmitImageData}
          style={{
            border: "none",
            padding: "4px 22px",
            backgroundColor: "#fdfefe",
            color: "black",
            cursor: "pointer",
            borderRadius: "6px",
            fontSize: "20px",
          }}
        >
          Generate
        </button>

        <button
          onClick={handleClickDownloadImage}
          style={{
            border: "none",
            padding: "4px 22px",
            backgroundColor: "#fdfefe",
            color: "black",
            cursor: "pointer",
            borderRadius: "6px",
            fontSize: "20px",
          }}
        >
          Download
        </button>
      </div>

      <div>
        {imageData !== null ? (
          <img
            src={`data:image/png;base64,${imageData}`}
            alt="loading..."
            style={{
              height: "auto",
              width: "1060px",
              borderRadius: "10px",
              objectFit: "cover",
              boxShadow: "0px 0px 5px 0px black",
            }}
          />
        ) : (
          <div
            style={{
              height: "500px",
              width: "500px",
              borderRadius: "10px",
            }}
          ></div>
        )}
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default ImageGene;
