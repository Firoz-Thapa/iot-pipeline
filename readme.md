# Gym Occupancy Monitoring System with AI and IoT

## Project Overview

This project aims to develop an AI-powered gym occupancy monitoring system that tracks the number of people in various gym zones in real-time using HC-SR501 PIR sensors, edge devices, and AI models. The system will detect occupancy, recognize activities, and display data on a web dashboard. It also includes alerts for overcrowding and zone usage insights to optimize gym operations and enhance the member experience.

---

## System Architecture

![WhatsApp Image 2025-03-25 at 11 28 46](https://github.com/user-attachments/assets/66131f96-da3b-4215-8523-a32612462b00)


### Hardware
- HC-SR501 PIR Sensors – Motion detection for occupancy tracking.
- Raspberry Pi – Processing sensor data.
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

   - Deploy backend services on Microsodt Azure.
   - Optimize sensor placement for accurate motion detection.
   - Implement AI-based analytics for activity insights.

--- 
## Implementation Progress

### Completed Tasks
* ✅ Successfully deployed backend services on Microsoft Azure
* ✅ Configured InfluxDB for storing real-time occupancy data
* ✅ Set up MQTT broker for IoT communication
* ✅ Implemented Docker containerization for all services
* ✅ Created frontend dashboard with real-time zone occupancy display
* ✅ Implemented API endpoints for retrieving gym occupancy data
* ✅ Added AI-powered workout generation feature
* ✅ Configured network security and firewall rules

### Technical Configuration
* Backend: Node.js/Express running on port 3000
* Frontend: React.js served via Nginx on port 8000
* Database: InfluxDB (bucket: iot-data, org: LAB)
* MQTT Broker: Eclipse Mosquitto on ports 1883/9001
* Deployment: Docker containers on Azure VM

## Deployment Guide

### Prerequisites
* Ubuntu server (tested on 24.04 LTS)
* Docker and Docker Compose
* Git

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/iot-gym-system.git
   cd iot-gym-system

2. Configure environment variables:
```bash
# Create .env file with required variables
cat > .env << EOL
INFLUX_TOKEN=your_influxdb_token
INFLUX_ORG=LAB
INFLUX_BUCKET=iot-data
INFLUX_URL=http://your_server_ip:8086
EOL
```

3. Set up Nginx reverse proxy:
```bash
mkdir -p nginx-conf
```

4. Deploy with Docker Compose:
```bash
docker-compose up -d
```
5. Configure firewall rules:
```bash
sudo ufw allow 8000/tcp  # Frontend
sudo ufw allow 3000/tcp  # Backend API
sudo ufw allow 8086/tcp  # InfluxDB
sudo ufw allow 1883/tcp  # MQTT
sudo ufw allow 9001/tcp  # MQTT WebSockets
```


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

## Demonstration, pictures and links

# Demonstration

[View the presentation](./Gym%20Occupancy%20Monitoring%20System%20with%20AI%20and%20IoT_Group%20G.pdf)

[View the video presentation](https://youtu.be/yDCnUDdUOn4)

[View the application](https://youtube.com/shorts/FH_Mufzr4q8?feature=share)

# Pictures

![WhatsApp Image 2025-03-25 at 10 41 31 (2)](https://github.com/user-attachments/assets/3a27974c-e769-42bf-9d18-77d8129bc3d8)
![WhatsApp Image 2025-03-25 at 10 41 31 (1)](https://github.com/user-attachments/assets/de56a2de-5879-43dd-853d-20bf32f35e04)
![WhatsApp Image 2025-03-25 at 10 41 31](https://github.com/user-attachments/assets/7081abff-6c83-4a84-a818-3605649460e7)

# Link

http://135.236.212.218:8000/

---

## Conclusion

This project proposes a scalable and real-time gym occupancy monitoring system using *IoT and AI* technologies. By utilizing *object detection, **AI models, and **real-time dashboards, gym managers can monitor occupancy, improve resource allocation, and provide a better experience for gym members. With **alert systems* for overcrowding and *historical data analysis*, the system will help optimize gym operations and ensure safety and efficiency.

---


