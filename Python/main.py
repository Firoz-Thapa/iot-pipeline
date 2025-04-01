import time
import network
import urequests
from machine import Pin
import gc

# ======= CONFIGURATION =======
# WiFi setup
WIFI_SSID = "Firoz thapa"
WIFI_PASSWORD = "Firoz123"

# PIR sensor pin
ENTRY_PIR_PIN = 27  # PIR sensors for entry detection (PIN 27)
EXIT_PIR_PIN = 29   # PIR sensors for detecting departures (PIN 29)

# InfluxDB Configuration
INFLUXDB_URL = "http://135.236.212.218:8086"
INFLUXDB_BUCKET = "iot-data"
INFLUXDB_ORG = "LAB"
INFLUXDB_TOKEN = "XFym-O4pGm1v4zmRkAlyW-tr1m_HJpivBYxoiOo_YBw5hl9uafe-TxJIrnN8CbFg3ITASDtklyxmbUQUn5u95Q=="

# IMPORTANT: Use the measurement name that's working
MEASUREMENT_NAME = "test_measurement"  # This is the name that works in your InfluxDB

# ======= GLOBALS =======
current_count = 0
last_detection_time = 0
detection_cooldown = 3.0  # 3 seconds between detections
wifi_connected = False

# Thresholds to prevent PIR mis-touch
CONSECUTIVE_THRESHOLD = 3   # try 2 or 4 to see which works better
entry_readings = 0
exit_readings = 0

# ======= WIFI CONNECTION =======
def connect_wifi():
    """Connect to WiFi network"""
    global wifi_connected
    print("\nConnecting to WiFi...")
    
    # Free memory before connection attempt
    gc.collect()
    
    # Initialize WiFi interface
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    
    # Show current connection status
    if wlan.isconnected():
        wifi_connected = True
        print(f"Already connected: {wlan.ifconfig()[0]}")
        return True
    
    try:
        wlan.connect(WIFI_SSID, WIFI_PASSWORD)
        for _ in range(10):
            if wlan.isconnected():
                wifi_connected = True
                print(f"Connected: {wlan.ifconfig()[0]}")
                return True
            time.sleep(1)
    except Exception as e:
        print(f"WiFi error: {e}")

    wifi_connected = False
    return False

# ======= INFLUXDB INTEGRATION =======
def send_to_influxdb(count):
    """Send entry count data to InfluxDB"""
    global wifi_connected
    
    # Check if WiFi is connected
    if not wifi_connected:
        print("Cannot send to InfluxDB: WiFi not connected")
        if not connect_wifi():
            return False
    
    # Create InfluxDB line protocol data - using the measurement name that works!
    # Important: We're using the format that worked in our test
    data = f"{MEASUREMENT_NAME},device=pir value={count}"
    headers = {
        "Authorization": f"Token {INFLUXDB_TOKEN}",
        "Content-Type": "text/plain"
    }
    # Prepare URL with query parameters
    url = f"{INFLUXDB_URL}/api/v2/write?org={INFLUXDB_ORG}&bucket={INFLUXDB_BUCKET}&precision=ns"
    
    try:
        # Send data to InfluxDB
        response = urequests.post(url, headers=headers, data=data, timeout=5)
        
        # Check response
        if response.status_code == 204:  # Success with no content
            print(f"Data sent: {count}")
            response.close()
            return True           
    except Exception as e:
        print(f"InfluxDB error: {e}")
        
    return False

# ======= MAIN FUNCTION =======
def main():
    """Main program function"""
    global current_count, last_detection_time
    
    print("\n=== GYM ENTRY/EXIT COUNTER ===")
    print(f"Monitoring entry on GP{ENTRY_PIR_PIN} and exit on GP{EXIT_PIR_PIN}")
    print(f"WiFi SSID: {WIFI_SSID}")
    print(f"Sending data to: {INFLUXDB_URL} as '{MEASUREMENT_NAME}'")
    print("--------------------------------------")
    
    # Initial WiFi connection
    connect_wifi()
    
    # Setup PIR sensor
    try:
        entry_sensor = Pin(ENTRY_PIR_PIN, Pin.IN, Pin.PULL_DOWN)
        exit_sensor = Pin(EXIT_PIR_PIN, Pin.IN, Pin.PULL_DOWN)
        print(f"PIR sensors initialized on GP{ENTRY_PIR_PIN} (entry) and GP{EXIT_PIR_PIN} (exit)")
    except Exception as e:
        print(f"Error initializing PIR sensor: {e}")
        return

    # Test signal status of the sensor
    while True:
        print(f"Entry Sensor: {entry_sensor.value()}, Exit Sensor: {exit_sensor.value()}")
        time.sleep(0.5)
    
    '''# Setup LED
    try:
        led = Pin("LED", Pin.OUT)
        print("Onboard LED initialized")
    except Exception:
        led = None
        print("No onboard LED available")
    '''
    
    previous_entry_state = 0
    previous_exit_state = 0
    
    try:
        while True:
            # Get current sensor state
            current_time = time.time()
            entry_state = entry_sensor.value()
            exit_state = exit_sensor.value()

            # Processing Entry Detection
            if entry_state == 1:
                entry_readings += 1
            else:
                entry_readings = 0

            if entry_readings >= CONSECUTIVE_THRESHOLD and previous_entry_state == 0 and (current_time - last_detection_time) > detection_cooldown:
                current_count += 1
                last_detection_time = current_time
                print(f"Person entered! Count: {current_count}")
                send_to_influxdb(current_count)
                entry_readings = 0

            # Processing Eixt Detection
            if exit_state == 1:
                exit_readings += 1
            else:
                exit_readings = 0

            if exit_readings >= CONSECUTIVE_THRESHOLD and previous_exit_state == 0 and (current_time - last_detection_time) > detection_cooldown:
                current_count = max(0, current_count - 1)
                last_detection_time = current_time
                print(f"Person exited! Count: {current_count}")
                send_to_influxdb(current_count)
                exit_readings = 0
                
            previous_entry_state = entry_state
            previous_exit_state = exit_state
            
            time.sleep(0.1)
    
    except KeyboardInterrupt:
        print("\nMonitoring stopped")
        print(f"Final count: {current_count} people")

# Run the program
if __name__ == "__main__":
    main()
