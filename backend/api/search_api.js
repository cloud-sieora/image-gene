const axios = require('axios'); // Use require for axios
const fs = require('fs').promises;
const { default: OpenAI } = require("openai");
const multer = require('multer');

const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
const stream = false;

const headers = {
    "Authorization": "Bearer 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",
    "Accept": stream ? "text/event-stream" : "application/json"
};

const openai = new OpenAI({
    apiKey: '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',
    baseURL: 'https://integrate.api.nvidia.com/v1/',
})

const storage = multer.memoryStorage();  // Store image in memory for easy access
const upload = multer({ storage: storage }).single('image');

async function textToGetEmbedding(text) {
    const response = await openai.embeddings.create({
        input: [text],
        model: "nvidia/nvclip",
        encoding_format: "float"
    })

    const embedding = response.data[0].embedding;
    process.stdout.write(`${embedding}\n`);
    return embedding
}


let ReadImageFromPath = () => {
    let allImageData = req.body.map((image) => {
        const imagePath = path.join(image.imageurl);

        try {
            // Read image file as buffer
            const imageBuffer = fs.readFileSync(imagePath);

            // Convert image buffer to base64 string
            const imageBase64 = imageBuffer.toString('base64');

            // Return the image data in the response
            return { ...image, imageurl: imageBase64 };
        } catch (err) {
            console.error(`Error reading image: ${imagePath}`, err);
            return { ...image, imageurl: null, error: "Image not found or error reading file" };
        }
    });

    return allImageData

};


let textToGetEmbedding_api = async (req, res) => {
    console.log('p[calling')
    try {
        let payload = req.body
        let textEmbedding = await textToGetEmbedding(payload.text)
        if (textEmbedding) {
            res.json({ status: true, data: textEmbedding })
        }
    } catch (err) {
        console.log('err', err)
        res.json({status : false, data : 'Not clearing'})
    }
}


let imageCovertTextDes = (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ error: "Error uploading file" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        const imageBuffer = req.file.buffer;  // Image file from the frontend
        const imageB64 = imageBuffer.toString('base64');  // Convert image to base64

        console.log("Base64 image length:", imageB64.length);

        // Check image size
        // if (imageB64.length > 180000) {
        //     return res.status(400).json({ error: "Image too large, please use a smaller image" });
        // }

        // Prepare the payload for NVIDIA API
        const apiPayload = {
            model: "microsoft/phi-3.5-vision-instruct",
            messages: [
                {
                    role: "user",
                    content: `"Describe the content of an image in great detail. Provide a breakdown of key visual elements, such as shapes, objects, and people in the image. Include an analysis of colors (e.g., dominant colors and color gradients). Additionally, extract any visible text in the image using OCR, and specify the text’s location and style (e.g., font, size, alignment). Finally, describe the overall mood or setting of the image, if applicable. <img src="data:image/jpeg;base64,${imageB64}" />`
                }
            ],
            max_tokens: 512,
            temperature: 0.20,
            top_p: 0.70
        };

        try {
            const response = await axios.post(invokeUrl, apiPayload, { headers: headers });
            if (stream) {
                response.data.on('data', (chunk) => {
                    console.log('chunk', chunk.toString());
                    console.log("API call successful:", response);
                    res.json({ status: true, data: response });
                });
            } else {
                // console.log(JSON.stringify(response.data));
                let imageText = JSON.stringify(response.data.choices[0].message.content)
                console.log('API call resposne', JSON.stringify(response.data.choices[0].message.content))
                let embeddingResponse = await textToGetEmbedding(imageText)
                console.log('embeddingResponse', embeddingResponse)
                res.send({ status: true, data: embeddingResponse });
            }
        } catch (error) {
            console.error("Error calling API:", error);
            res.status(500).json({ status: false, error: error.message });
        }
    });
}




module.exports = {
    imageCovertTextDes,
    textToGetEmbedding_api
}



