import os
import sys
from datetime import datetime
import cv2
import numpy as np
from PIL import Image
import time
import pickle
import random
import io
import base64
from fastapi import FastAPI, HTTPException, Request
from flask import Flask, request, jsonify
import json
import requests
import requests
import io
import random
import webcolors
import os
import vertexai
from vertexai.preview.language_models import TextGenerationModel
from PIL import Image
# new token :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
API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev"
headers = {"Authorization": "Bearer "}
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specify allowed origins instead of allowing all origins
    allow_credentials=True,
    allow_methods=["*"],  # Adjust this to allow specific HTTP methods
    allow_headers=["*"])  # Adjust this to allow specific headers

def query(payload):
    global API_URL,headers
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.content


# Function to convert hex to RGB
def hex_to_rgb(hex_code):
    return webcolors.hex_to_rgb(hex_code)

# Function to calculate the nearest color name
def nearest_color_name(rgb):
    # Get all color names and their RGB values
    color_names = list(webcolors.CSS3_HEX_TO_NAMES.values())
    color_values = list(webcolors.CSS3_HEX_TO_NAMES.keys())
    
    # Find the closest color
    min_distance = float('inf')
    closest_color = ""
    for color_hex in color_values:
        color_rgb = hex_to_rgb(color_hex)
        distance = sum((c1 - c2) ** 2 for c1, c2 in zip(rgb, color_rgb)) ** 0.5  # Euclidean distance
        if distance < min_distance:
            min_distance = distance
            closest_color = webcolors.CSS3_HEX_TO_NAMES[color_hex]
    
    return closest_color


# Function to convert hex to color name
def hex_to_color_name(hex_code):
    try:
        # Convert hex to RGB
        rgb = hex_to_rgb(hex_code)
        # Find the exact color name
        color_name = webcolors.rgb_to_name(rgb)
    except ValueError:
        # If no exact match, find the closest color name
        color_name = nearest_color_name(rgb)
    return color_name


@app.post("/Poster_creattion")
async def poster_creation_api(request: Request):
    global query,Function,hex_to_rgb,nearest_color_name,hex_to_color_name
    request_data = await request.json()
    print(request_data)
    colorCode1 = request_data.get('colorCode1')
    print("colorCode1:",colorCode1)
    colorCode2 = request_data.get('colorCode2')
    print("colorCode2:",colorCode2)
    colorCode3 = request_data.get('colorCode3')
    print("colorCode3:",colorCode3)
    festival_name = request_data.get('description')
    print("festval_name:",festival_name)
    offerType = request_data.get('offerType')
    print("offerType:",offerType)
    offerPercentage = request_data.get('offerPercentage')
    print("offerPercentage:",offerPercentage)
    product_name = request_data.get('productname')
    print("product_name:",product_name)


    # Initialize Vertex AI
    PROJECT_ID = "Gemini API"
    vertexai.init(project=PROJECT_ID, location="us-central1")

    # Load the Gemini model
    model = TextGenerationModel.from_pretrained("gemini-1.5")

    # Perform text-to-text generation
    prompt = f"{festival_name}"
    response = model.predict(prompt)

    print(response.text)


    if not colorCode1:
        raise HTTPException(status_code=400, detail="No colorCode1 provided")
    
    if not colorCode2:
        raise HTTPException(status_code=400, detail="No colorCode2 provided")
    
    if not colorCode2:
        raise HTTPException(status_code=400, detail="No colorCode3 provided")
    
    if not festival_name:
        raise HTTPException(status_code=400, detail="No description provided")
    

    if not offerPercentage:
        raise HTTPException(status_code=400, detail="No offerPercentage provided")
        
    festival_name = f"{festival_name}"
        
        
    # Create the enhanced input text
    input_text = f"""

    Design a vibrant and festive poster for the {festival_name} Sale, showcasing {product_name} and embodying the joyous spirit of the celebration.

    **Main Visual**: Create lively illustrations that reflect {festival_name}, incorporating cultural elements such as {', '.join(festival_elements[festival_name])}. Ensure that these elements harmoniously integrate with {product_name} in the design. Avoid any brand logos.

    **Headline**: Craft a bold, eye-catching headline like "{festival_name} Special Offer" using large, clear typography that grabs immediate attention.

    **Offer Highlight**: Prominently display the offer: "{offerType} {offerPercentage} OFF on {product_name}," making it the focal point of the poster. Use bright colors and larger fonts to make this stand out.

    **Festive Image**: Include an engaging and colorful image that symbolizes the essence of {festival_name}, visually connecting {product_name} to the occasion and encouraging viewers to participate in the sale.

    **Color Scheme**: Employ a vibrant color palette with {colorCode1}, {colorCode2}, and {colorCode3} to create a lively, cohesive feel. Ensure the colors enhance the festive atmosphere without overwhelming the viewer.

    **Brand Name**: Position "bb" in a light green square box at the top left corner. The first "b" should be bright red and the second "b" gray, reinforcing brand recognition while maintaining a professional design.

    This prompt is designed to effectively promote {product_name} during {festival_name}, ensuring the layout is clean, visually engaging, and captures the festive spirit.
    """


    image_bytes = query({
        "inputs": input_text,
    })
        # Resize the image to maintain the desired resolution
    desired_resolution = (1360, 800)
    # You can access the image with PIL.Image for example
    number = random.randint(1,1000000)
    image = Image.open(io.BytesIO(image_bytes))
    image = image.resize(desired_resolution,  Image.LANCZOS)
    image.save(f"{os.getcwd()}/output_{number}.png")

    # Check if the collection exists
    return {"data":f"{os.getcwd()}/output_{number}.png" }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5050)

