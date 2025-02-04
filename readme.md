# Gym Occupancy Monitoring System with AI and IoT

## Project Overview

This project aims to build an *AI-powered gym occupancy monitoring system* that tracks the number of people in various gym zones in real-time using cameras, edge devices, and AI models. The system will use *object detection* to count people, recognize activities, and display this data on a *web dashboard*. Alerts for overcrowding and zone usage insights will help optimize gym operations and improve member experience.

---

## Project Steps

### Step 1: Setup the Camera and Edge Device

1. *Install the Camera*:
   - Use a *Raspberry Pi Camera Module* or *USB Camera* (e.g., Logitech C920) for video input.
   - For larger scale deployments, additional cameras can be installed in various gym zones (e.g., entrance, aerobic zone, functional area).
   
2. *Configure the Edge Device*:
   - Use an *NVIDIA Jetson Nano* or *Raspberry Pi* to connect the camera and handle edge processing.
   - Set up the device to process the video input locally, reducing latency and dependency on the cloud.

---

### Step 2: Deploy an AI Model

1. *Use Pre-trained Object Detection Models*:
   - Deploy *YOLOv5* (You Only Look Once) or *SSD* (Single Shot Multibox Detector) models to detect and count people in real-time.
   - Use a *lightweight AI framework* like *TensorFlow Lite* or *PyTorch Mobile* to ensure efficient processing on the edge device.

2. *Perform Inference*:
   - Process the video feed to detect and count people entering or exiting specific zones within the gym.
   - Optionally, recognize activities (e.g., exercise, waiting) using advanced models like *MediaPipe* for pose estimation.

---

### Step 3: Process Data Locally

1. *Perform Local AI Inference*:
   - On the edge device, use the AI model to count people and recognize specific activities in different gym zones.
   - Store the processed data (e.g., number of people in each zone) locally or send it to the cloud for further processing.

2. *Data Transmission*:
   - Send the processed data, such as *occupancy counts, to a **backend server* for storage and further analysis.

---

### Step 4: Build the Backend

1. *Create a Backend System*:
   - Set up a *Node.js* or *Flask* server to handle API requests from the edge device and serve the data to the dashboard.
   - Use *MongoDB* or any relational database to store real-time occupancy and historical activity data.

2. *Integrate with Cloud Services*:
   - Use *AWS IoT Core* or *Google Cloud IoT* for device management, scalable data storage, and device communication.
   - Ensure secure data transmission between the edge devices and the backend.

---

### Step 5: Build the Dashboard

1. *Create the Web Dashboard*:
   - Build an *interactive web dashboard* using *React.js* to display real-time data such as the current occupancy of the gym and its zones.
   - Use *Chart.js* or *D3.js* to create *data visualizations* for occupancy trends, activity heatmaps, and usage patterns.

2. *Key Dashboard Features*:
   - *Current Occupancy*: Show the number of people in each zone and the total occupancy.
   - *Activity Heatmaps*: Visualize which zones are the most or least used (e.g., aerobic zones, weights, etc.).
   - *Historical Data*: Display usage trends over time (e.g., peak times, preferred zones).
   - *Overcrowding Alerts*: Trigger alerts if any zone exceeds the maximum occupancy limit.

---

## Technologies Used

### Hardware
- *NVIDIA Jetson Nano*: Used for edge AI processing.
- *Raspberry Pi Camera Module* or *USB Camera (Logitech C920)*: Cameras for video input and people detection.

### AI & Software Frameworks
- *TensorFlow Lite*: For deploying lightweight AI models on edge devices.
- *OpenCV*: For image processing, motion detection, and video frame capture.
- *YOLOv5 / SSD*: Object detection models for counting people.
- *MediaPipe*: For advanced pose estimation and activity recognition.

### Backend & Cloud Integration
- *Node.js + Express.js*: For creating APIs and handling server-side logic.
- *MongoDB*: Database for storing occupancy and activity data.
- *AWS IoT Core / Google Cloud IoT*: Scalable backend solution for device communication and data storage.

### Frontend Dashboard
- *React.js*: For creating a dynamic and responsive user interface.
- *Chart.js / D3.js*: For visualizing data trends and occupancy heatmaps.

---

## Example Use Case: Gym Occupancy Monitoring

### Scenario: Gym Occupancy Monitoring
1. *Camera Setup*: Cameras are installed at the gym entrance and key zones (e.g., aerobic, weightlifting).
2. *AI Functionality*:
   - Detect and count the number of people entering/exiting the gym in real-time.
   - Track specific zones (e.g., weightlifting, aerobic area) based on the movement of people.
3. *Data Transmission*:
   - Processed data (occupancy counts and activity data) is sent to the backend server.
4. *Dashboard*:
   - *Real-Time Occupancy*: Show the number of people in each zone and total gym occupancy.
   - *Activity Heatmaps*: Highlight zones with high or low activity.
   - *Usage Trends*: Display historical data on occupancy patterns over the past days or weeks.
5. *Overcrowding Alerts*: Notify gym staff if any zone exceeds the maximum capacity, ensuring a safe and comfortable environment for members.

---

## Project Setup and Installation

### Hardware Setup
1. Connect the *Raspberry Pi Camera Module* or *USB camera* to the *Jetson Nano* or *Raspberry Pi*.
2. Install the necessary software (e.g., *OpenCV, **TensorFlow Lite, **YOLOv5*).

### Software Setup
1. Clone the repository and set up the backend API server using *Node.js* or *Flask*.
2. Configure the *database* (MongoDB) to store occupancy and activity data.
3. Develop the *React.js dashboard* to display the data and visualizations.
4. Deploy the application on a cloud service (AWS or Google Cloud) to handle data and device management.

---

## Project Challenges and Considerations

1. *Edge Device Performance*: Ensuring the edge device (Jetson Nano or Raspberry Pi) can process real-time video feeds efficiently while running AI models.
2. *Camera Placement*: Proper camera placement to ensure accurate tracking and counting of people in different gym zones.
3. *Data Security*: Protecting the privacy and security of occupancy data, especially in cloud storage and during transmission.

---

## Conclusion

This project proposes a scalable and real-time gym occupancy monitoring system using *IoT and AI* technologies. By utilizing *object detection, **AI models, and **real-time dashboards, gym managers can monitor occupancy, improve resource allocation, and provide a better experience for gym members. With **alert systems* for overcrowding and *historical data analysis*, the system will help optimize gym operations and ensure safety and efficiency.

---