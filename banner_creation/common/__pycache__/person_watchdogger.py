import os
import requests
import time
import cv2
import random
from datetime import datetime
import numpy as np
import sys
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer
from imutils import paths
folder_to_watch = 'person_image'


class ImageHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory and event.src_path.endswith('.jpg'):
            loaded_image = event.src_path
            if os.path.exists(loaded_image):
                print('loaded_image', loaded_image)
                loaded_image_new_path = f"{os.getcwd()}/{loaded_image}"
                # Loop for repeated execution
                try:
                    time.sleep(0.01)
                    # Prepare the payload for the POST request
                    data = {
                        'face_image':loaded_image_new_path,
                    }
                    # "Based on the analysis of the provided image, does the individual appear to be male, female, or is their gender indeterminate?"
                    try:
                        # Define the API endpoint
                        url = 'http://13.202.190.168:5000/florence_2_4bit'

                        file = {'file': open(f"{loaded_image_new_path}", 'rb')}
                        data = {'questions': '{"question": "what is the gender of the person ?"}'}

                        # Send the POST request
                        response = requests.post(url, files=file, data=data)

                        # Print the response from the server
                        print(response.json()['output']["question"])

                        if response.json()['output']["question"]=="male":
                            # Get a list of all files in the folder
                            files = os.listdir(response.json()['output']["question"])
                            
                            # Filter the list to include only image files (optional)
                            image_files = [f for f in files if f.endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif'))]

                            if not image_files:
                                print("No image files found in the folder.")
                                return None
                            random_image = random.choice(image_files)
                            path = f"male/{random_image}"



                        elif  response.json()['output']["question"]=="female":

                            # Get a list of all files in the folder
                            files = os.listdir(response.json()['output']["question"])
                                                        # Filter the list to include only image files (optional)
                            image_files = [f for f in files if f.endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif'))]

                            if not image_files:
                                print("No image files found in the folder.")
                                return None
                            random_image = random.choice(image_files)
                            path = f"female/{random_image}"
                            print("female path",path)

                        image = cv2.imread(path)

                        cv2.imshow("output image", cv2.resize(image, (1920, 1080)))

                        # Add a loop to wait for the 'q' key to close the window
                        while True:
                            # Wait for a key press and check if it's 'q' (ASCII value for 'q' is 113)
                            if cv2.waitKey(1) & 0xFF == ord('q'):
                                break
                        # Destroy all OpenCV windows
                        cv2.destroyAllWindows()


                        # url = f'http://0.0.0.0:5000/'
                        # response = requests.post(url, json=data)
                        # response.raise_for_status()  # Check if request was successful
                    except requests.exceptions.RequestException as e:
                        print(f"Error sending POST request: {e}")

                except Exception as e:
                    print(f"An unexpected error occurred: {e}")

def run_face_recognition():
    observer = Observer()
    event_handler = ImageHandler()
    observer.schedule(event_handler, folder_to_watch, recursive=True)
    observer.start()
    try:
        while True:
            # time.sleep(1)
            pass
    except KeyboardInterrupt:
        observer.stop()
        observer.join()
if __name__ == "__main__":
    result = run_face_recognition()

