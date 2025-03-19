const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));

// InfluxDB configuration
const url = process.env.INFLUX_URL || 'http://localhost:8086';
const token = process.env.INFLUX_TOKEN || 'your-influx-token';
const org = process.env.INFLUX_ORG || 'your-org';
const bucket = process.env.INFLUX_BUCKET || 'iot_monitoring';

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
// Updated to v1 instead of v1beta and using gemini-1.5-flash instead of gemini-pro
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

// Create InfluxDB client
const influxClient = new InfluxDB({ url, token });
const queryApi = influxClient.getQueryApi(org);
const writeApi = influxClient.getWriteApi(org, bucket, 'ns');

// Test InfluxDB connection
async function testInfluxConnection() {
  try {
    const fluxQuery = `from(bucket: "${bucket}") |> range(start: -1m) |> limit(n: 1)`;
    const result = await queryApi.collectRows(fluxQuery);
    console.log('✅ InfluxDB connection successful');
    return true;
  } catch (error) {
    console.error('❌ InfluxDB connection failed:', error.message);
    return false;
  }
}

// API routes
app.get('/api/occupancy', async (req, res) => {
  try {
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -24h)
        |> filter(fn: (r) => r._measurement == "gym_occupancy")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: 100)
    `;
    
    const result = await queryApi.collectRows(fluxQuery);
    
    if (!result || result.length === 0) {
      // If no data found, simulate some data for demo purposes
      const simulatedData = simulateOccupancyData();
      return res.json(simulatedData);
    }
    
    const formattedData = result.map(row => ({
      timestamp: row._time,
      value: row._value,
      status: determineStatus(row._value)
    }));
    
    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching occupancy data:', error);
    // Always return some data even if the query fails
    const simulatedData = simulateOccupancyData();
    res.json(simulatedData);
  }
});

app.get('/api/moisture/historical', async (req, res) => {
  try {
    const hours = req.query.hours || 24;
    
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -${hours}h)
        |> filter(fn: (r) => r._measurement == "moisture_level")
        |> sort(columns: ["_time"])
        |> limit(n: 1000)
    `;
    
    const result = await queryApi.collectRows(fluxQuery);
    
    if (!result || result.length === 0) {
      // If no data found, simulate some data for demo purposes
      const simulatedData = simulateMoistureData(parseInt(hours));
      return res.json(simulatedData);
    }
    
    const formattedData = result.map(row => ({
      timestamp: row._time,
      value: row._value,
      status: determineMoistureStatus(row._value)
    }));
    
    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching historical moisture data:', error);
    // Always return some data even if the query fails
    const simulatedData = simulateMoistureData(parseInt(req.query.hours || 24));
    res.json(simulatedData);
  }
});

// Generate workout plan endpoint
app.post('/generate-workout', async (req, res) => {
  try {
    // console.log('Received workout generation request:', req.body);
    
    const { goals, level, frequency } = req.body;
    
    // Validate required fields
    if (!goals || !Array.isArray(goals) || goals.length === 0) {
      return res.status(400).json({ error: 'Please select at least one fitness goal' });
    }
    
    if (!level) {
      return res.status(400).json({ error: 'Please select your fitness level' });
    }
    
    if (!frequency) {
      return res.status(400).json({ error: 'Please select your weekly gym frequency' });
    }
    
    // Check if Gemini API key is available
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'API key is not configured. Please contact support.' });
    }

    // Construct prompt for Gemini
    const prompt = `Create a personalized ${frequency} workout plan for a ${level} athlete focusing on ${goals.join(', ')}. 
                   Include warm-up exercises, main workout exercises with sets and reps, and cool-down exercises. 
                   Format the workout plan with proper sections and tables where appropriate.`;

    // console.log('Sending prompt to Gemini API:', prompt);

    // Call Gemini API
    const geminiResponse = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 25000 // 25 seconds timeout
      }
    );
    
    // Extract and format the response
    if (geminiResponse.data && 
        geminiResponse.data.candidates && 
        geminiResponse.data.candidates[0] && 
        geminiResponse.data.candidates[0].content && 
        geminiResponse.data.candidates[0].content.parts && 
        geminiResponse.data.candidates[0].content.parts[0]) {
      
      const workoutPlan = geminiResponse.data.candidates[0].content.parts[0].text;
      
      // console.log('Successfully generated workout plan');
      
      // Return the workout plan
      return res.json({ workoutPlan });
    } else {
      console.error('Invalid response format from Gemini API:', geminiResponse.data);
      return res.status(500).json({ error: 'Failed to generate workout plan. Please try again.' });
    }
    
  } catch (error) {
    console.error('Error generating workout plan:', error);
    
    let errorMessage = 'Failed to generate workout plan. Please try again.';
    
    if (error.response) {
      console.error('Gemini API error data:', error.response.data);
      console.error('Gemini API error status:', error.response.status);
      
      if (error.response.status === 400) {
        errorMessage = 'Invalid request to AI service. Please check your inputs.';
      } else if (error.response.status === 401 || error.response.status === 403) {
        errorMessage = 'API authentication failed. Please contact support.';
      } else if (error.response.status === 429) {
        errorMessage = 'AI service quota exceeded. Please try again later.';
      } else if (error.response.status >= 500) {
        errorMessage = 'AI service is currently unavailable. Please try again later.';
      }
    } else if (error.request) {
      errorMessage = 'No response from AI service. Please check your connection.';
    }
    
    return res.status(500).json({ error: errorMessage });
  }
});

// Simulated workout plan for fallback
app.post('/generate-workout-fallback', (req, res) => {
  const { goals, level, frequency } = req.body;
  
  // console.log('Using fallback workout plan generator for:', { goals, level, frequency });
  
  // Simple fallback workout plan template
  const workoutPlan = `# Personalized ${frequency} Workout Plan
  
  This plan is designed for a ${level} focusing on ${goals.join(', ')}.
  
  ## Day 1: Upper Body
  
  ### Warm-up
  • 5 minutes of light cardio
  • 10 arm circles forward and backward
  • 10 shoulder rolls
  
  ### Main Workout
  
  | Exercise | Sets | Reps | Rest |
  |----------|------|------|------|
  | Push-ups | 3 | 10-12 | 60s |
  | Dumbbell rows | 3 | 10-12 | 60s |
  | Shoulder press | 3 | 10-12 | 60s |
  | Bicep curls | 3 | 10-12 | 60s |
  | Tricep dips | 3 | 10-12 | 60s |
  
  ### Cool-down
  • Chest stretch (30s each side)
  • Tricep stretch (30s each side)
  • Shoulder stretch (30s each side)
  
  ## Day 2: Lower Body
  
  ### Warm-up
  • 5 minutes of light cardio
  • 10 bodyweight squats
  • 10 leg swings each side
  
  ### Main Workout
  
  | Exercise | Sets | Reps | Rest |
  |----------|------|------|------|
  | Squats | 3 | 12-15 | 90s |
  | Lunges | 3 | 10 each leg | 90s |
  | Leg press | 3 | 12-15 | 90s |
  | Calf raises | 3 | 15-20 | 60s |
  | Leg curls | 3 | 12-15 | 60s |
  
  ### Cool-down
  • Quad stretch (30s each side)
  • Hamstring stretch (30s each side)
  • Calf stretch (30s each side)
  
  ## Day 3: Full Body
  
  ### Warm-up
  • 5 minutes of light cardio
  • 10 jumping jacks
  • 10 arm and leg raises
  
  ### Main Workout
  
  | Exercise | Sets | Reps | Rest |
  |----------|------|------|------|
  | Deadlifts | 3 | 8-10 | 90s |
  | Bench press | 3 | 10-12 | 90s |
  | Pull-ups/assisted pull-ups | 3 | 8-10 | 90s |
  | Plank | 3 | 30-45s | 60s |
  | Russian twists | 3 | 15 each side | 60s |
  
  ### Cool-down
  • Full body stretch routine (5 minutes)
  • Deep breathing exercises
  
  Remember to stay hydrated and listen to your body. Adjust weights and reps as needed based on your comfort level.`;
  
  // Return the fallback plan
  res.json({ workoutPlan });
});

// Helper function to simulate occupancy data
function simulateOccupancyData() {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
    // Simulate a typical gym day with peak hours
    let hour = timestamp.getHours();
    let value;
    
    if (hour >= 5 && hour < 8) { 
      // Morning rush
      value = Math.floor(Math.random() * 30) + 60;
    } else if (hour >= 17 && hour < 20) {
      // Evening rush
      value = Math.floor(Math.random() * 30) + 70;
    } else if (hour >= 10 && hour < 14) {
      // Lunch hour moderate activity
      value = Math.floor(Math.random() * 20) + 40;
    } else if (hour >= 23 || hour < 5) {
      // Late night / early morning (minimal traffic)
      value = Math.floor(Math.random() * 10);
    } else {
      // Regular hours
      value = Math.floor(Math.random() * 20) + 20;
    }
    
    data.push({
      timestamp: timestamp.toISOString(),
      value: value,
      status: determineStatus(value)
    });
    
    // Also write to InfluxDB for future reference
    const point = new Point('gym_occupancy')
      .floatField('value', value)
      .timestamp(timestamp);
    writeApi.writePoint(point);
  }
  
  writeApi.flush().catch(e => console.error('Error writing to InfluxDB:', e));
  
  return data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// Helper function to simulate moisture data
function simulateMoistureData(hours) {
  const data = [];
  const now = new Date();
  const points = Math.min(hours * 4, 1000); // 4 readings per hour, maximum 1000 points
  
  for (let i = 0; i < points; i++) {
    const timestamp = new Date(now.getTime() - (i * (hours * 3600000 / points)));
    // Random value between 0 and 100
    const value = Math.floor(Math.random() * 100);
    
    data.push({
      timestamp: timestamp.toISOString(),
      value: value,
      status: determineMoistureStatus(value)
    });
  }
  
  return data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

function determineStatus(value) {
  if (value < 20) return 'low';
  if (value < 60) return 'moderate';
  if (value < 85) return 'high';
  return 'critical';
}

function determineMoistureStatus(value) {
  if (value < 20) return 'dry';
  if (value < 60) return 'moderate';
  if (value < 85) return 'moist';
  return 'wet';
}

// Set up WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  // Send initial moisture data
  fetchMoistureData().then(data => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data[data.length - 1] || { 
        timestamp: new Date().toISOString(), 
        value: 0, 
        status: 'active' 
      }));
    }
  }).catch(error => {
    console.error('Error sending initial moisture data:', error);
  });
  
  ws.on('message', (message) => {
    console.log('Received message from client:', message.toString());
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Send moisture data periodically
async function fetchMoistureData() {
  try {
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -1h)
        |> filter(fn: (r) => r._measurement == "moisture_level")
        |> sort(columns: ["_time"])
        |> limit(n: 30)
    `;
    
    const result = await queryApi.collectRows(fluxQuery);
    
    if (!result || result.length === 0) {
      return simulateMoistureData(1);
    }
    
    return result.map(row => ({
      timestamp: row._time,
      value: row._value,
      status: determineMoistureStatus(row._value)
    }));
  } catch (error) {
    console.error('Error fetching moisture data:', error);
    return simulateMoistureData(1);
  }
}

// Send moisture updates to all connected clients every 5 seconds
setInterval(() => {
  if (wss.clients.size > 0) {
    const now = new Date();
    // Random value between 0 and 100 for demonstration
    const moistureValue = Math.floor(Math.random() * 100);
    
    const data = {
      timestamp: now.toISOString(),
      value: moistureValue,
      status: determineMoistureStatus(moistureValue)
    };
    
    // Save to InfluxDB
    const point = new Point('moisture_level')
      .floatField('value', moistureValue)
      .timestamp(now);
    
    writeApi.writePoint(point);
    writeApi.flush().catch(e => console.error('Error writing to InfluxDB:', e));
    
    // Send to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
    
    console.log(`Sent moisture data (${moistureValue}) to ${wss.clients.size} clients`);
  }
}, 5000);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await testInfluxConnection();
  console.log('✅ Workout generator endpoint available at http://localhost:' + PORT + '/generate-workout');
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// At the end of your server.js file
module.exports = { app, server };