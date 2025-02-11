# Gym Occupancy Monitoring System with AI and IoT

## Project Overview

This project aims to develop an AI-powered gym occupancy monitoring system that tracks the number of people in various gym zones in real-time using HC-SR501 PIR sensors, edge devices, and AI models. The system will detect occupancy, recognize activities, and display data on a web dashboard. It also includes alerts for overcrowding and zone usage insights to optimize gym operations and enhance the member experience.

## System Architecture
![WhatsApp Image 2025-02-04 at 13 40 40_cad48b38](https://github.com/user-attachments/assets/8cc97d6d-4981-45b4-b0ab-baeaba7f17b7)

---

## System Architecture

### Hardware
- HC-SR501 PIR Sensors – Motion detection for occupancy tracking.
- Raspberry Pi / ESP32 – Processing sensor data.
- WiFi Module – Transmitting data to the cloud.

### Software 
- Frontend – Built with React.js and TailwindCSS / Material UI for UI design.
- Backend – Developed using Node.js and Express.js for handling API requests.
- Database – InfluxDB for storing real-time occupancy data.
- IoT Communication – MQTT / WebSockets for real-time updates.

---

## Project Steps

### Step 1: Setup the PIR Sensor and Edge Device

   - Install HC-SR501 PIR sensor in key gym zones.
   - Connect sensors to RaspberryPi or ESP32 for processing.
   - Configure Wifi to transmit data.
   
---

### Step 2: Process Data Locally

   - Use Raspberry Pi/ESP32 to collect sensor data.
   - Process occupancy counts using custom logic.
   - Send data to the backend server via MQTT/Websockets.

---

### Step 3: Backend Development

   - Set up a Node.js server to handle API requests.
   - Store real-time data in InfluxDB.
   - Manage data transmission securely.

---

### Step 4: Build the WebDashboard.

   - Create an interactive dashboard using React.js.
   - Implement real-time updates with WebSockets.
   - Display occupancy, historical trends, and alerts.

---

### Step 5: Deployment and Optimization

   - Deploy backend services on AWS IoT Core / Microsodt Azure.
   - Optimize sensor placement for accurate motion detection.
   - Implement AI-based analytics for activity insights.

--- 



## Project Goals

1. Real-time Occupancy Tracking – Monitor the number of people in different gym zones using motion detection from PIR sensors.
2. Activity Recognition – Identify and classify gym activities to provide insights into equipment usage and workout trends.
3. Web Dashboard Integration – Display occupancy data, activity trends, and alerts on a user-friendly web interface.

---

## Key Features

1. Real-Time Data Monitoring – Live tracking of people in the gym and its various zones
2. Zone-Based Occupancy Counting – Detect and count people in Muscle Fitness, Aerobic, Functional, and Not on Devices zones.
3. Historical Data & Insights – Display trends on gym occupancy over time for better decision-making.

---
## Team Responsibilities

### 1. Damindu Koswattage (Project Manager)
- Responsible for overall project coordination and progress management.
- Scheduling meetings and supervising task completion.

### 2. Firoz Thapa (Technical)
- Implements the **IoT pipeline** and resolves **technical issues**.
- Handles **hardware and software integration**, debugging.

### 3. Yumeng Tai & Simpal Koirala (Hardware & Documentation)
- Responsible for **setting up and testing PIR sensors**.
- Creating, updating, and organizing **all project documentation**.

### 4. Kavindi Gamaralalage (Communication)
- Manages **internal and external communication**.
- Records **meeting minutes** and liaises with **stakeholders**.

### 5. Ruisi Li (Hardware & Testing)
- Ensures **quality control and testing** of **IoT components**.
- Verifies the **functionality and performance** of the system.


---

## Project Timeline

| **Phase**   | **Tasks**                          | **Duration** |
|------------|----------------------------------|------------|
| **Phase 1** | Sensor & Edge Device Setup      | 2 Weeks    |
| **Phase 2** | Backend & Database Implementation | 3 Weeks    |
| **Phase 3** | Web Dashboard Development       | 3 Weeks    |
| **Phase 4** | Integration & Testing           | 2 Weeks    |
| **Phase 5** | Deployment & Optimization       | 2 Weeks    |

---

## Challenges & Considerations

- **Sensor Accuracy**: Ensuring accurate motion detection and reducing false positives.
- **Network Stability**: Maintaining a reliable WiFi connection for real-time updates.
- **Data Security**: Protecting sensitive data in cloud storage and during transmission.

---

## Link to the Presentation

[View the presentation](./Gym%20Occupancy%20Monitoring%20System%20with%20AI%20and%20IoT_Group%20G.pdf)


---

## Conclusion

This project proposes a scalable and real-time gym occupancy monitoring system using *IoT and AI* technologies. By utilizing *object detection, **AI models, and **real-time dashboards, gym managers can monitor occupancy, improve resource allocation, and provide a better experience for gym members. With **alert systems* for overcrowding and *historical data analysis*, the system will help optimize gym operations and ensure safety and efficiency.

---


