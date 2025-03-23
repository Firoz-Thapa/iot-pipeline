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
PIR_PIN = 22  # GP22 where the PIR sensor is connected

# InfluxDB Configuration
INFLUXDB_URL = "http://135.236.212.218:8086"
INFLUXDB_BUCKET = "iot-data"
INFLUXDB_ORG = "LAB"
INFLUXDB_TOKEN = "XFym-O4pGm1v4zmRkAlyW-tr1m_HJpivBYxoiOo_YBw5hl9uafe-TxJIrnN8CbFg3ITASDtklyxmbUQUn5u95Q=="

# IMPORTANT: Use the measurement name that's working
MEASUREMENT_NAME = "test_measurement"  # This is the name that works in your InfluxDB

# ======= GLOBALS =======
entry_count = 0
last_detection_time = 0
detection_cooldown = 3.0  # 3 seconds between detections
last_wifi_check = 0
wifi_check_interval = 30  # Check WiFi every 30 seconds
last_influxdb_update = 0
influxdb_update_interval = 15  # Send to InfluxDB every 15 seconds
wifi_connected = False

# Auto-exit settings (no deque needed)
entry_times = []  # Simple list to store entry timestamps
exit_delay = 40  # 40 seconds
exit_count = 2   # Changed from 5 to 2 people per exit
last_auto_exit = 0

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
        ip = wlan.ifconfig()[0]
        print(f"Already connected to WiFi: {ip}")
        wifi_connected = True
        return True
    
    try:
        wlan.connect(WIFI_SSID, WIFI_PASSWORD)
        
        # Wait for connection with timeout
        max_wait = 10
        while max_wait > 0:
            if wlan.isconnected():
                break
            max_wait -= 1
            print(".", end="")
            time.sleep(1)
        
        print("")  # New line after dots
    except Exception as e:
        print(f"WiFi connection error: {e}")
        wifi_connected = False
        return False
    
    if wlan.isconnected():
        ip = wlan.ifconfig()[0]
        print(f"Connected to WiFi: {ip}")
        wifi_connected = True
        return True
    else:
        print("Failed to connect to WiFi")
        wifi_connected = False
        return False

# ======= INFLUXDB INTEGRATION =======
def send_to_influxdb(count):
    """Send entry count data to InfluxDB"""
    global wifi_connected
    
    # Check if WiFi is connected
    if not wifi_connected:
        print("Cannot send to InfluxDB: WiFi not connected")
        return False
    
    # Create InfluxDB line protocol data - using the measurement name that works!
    # Important: We're using the format that worked in our test
    data = f"{MEASUREMENT_NAME},device=pir value={count}"
    
    # Prepare headers
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
            print(f"Data sent to InfluxDB successfully (Response: {response.status_code})")
            response.close()
            return True
        else:
            print(f"Error from InfluxDB: {response.status_code}")
            response.close()
            return False
            
    except Exception as e:
        print(f"Error sending to InfluxDB: {e}")
        return False

# ======= MAIN FUNCTION =======
def main():
    """Main program function"""
    global entry_count, last_detection_time, last_wifi_check, last_influxdb_update, entry_times, last_auto_exit
    
    print("\n=== GYM ENTRY COUNTER WITH AUTO-EXIT ===")
    print(f"PIR sensor on pin GP{PIR_PIN}")
    print(f"WiFi SSID: {WIFI_SSID}")
    print(f"Auto-exit: {exit_count} people leave every {exit_delay} seconds")
    print(f"Sending data to: {INFLUXDB_URL} as '{MEASUREMENT_NAME}'")
    print("--------------------------------------")
    
    # Initial WiFi connection
    connect_wifi()
    
    # Setup PIR sensor
    try:
        pir_sensor = Pin(PIR_PIN, Pin.IN)
        print("PIR sensor initialized on GP22")
    except Exception as e:
        print(f"Error initializing PIR sensor: {e}")
        return
    
    # Setup LED
    try:
        led = Pin("LED", Pin.OUT)
        print("Onboard LED initialized")
    except:
        led = None
        print("No onboard LED available")
    
    print("Monitoring for gym entries...")
    print("(Press Ctrl+C to exit)")
    
    previous_state = 0
    consecutive_readings = 0
    last_wifi_check = time.time()
    last_influxdb_update = time.time()
    last_auto_exit = time.time()
    
    try:
        while True:
            # Garbage collection to free memory
            gc.collect()
            
            # Get current sensor state
            current_state = pir_sensor.value()
            current_time = time.time()
            
            # Process auto-exits every 40 seconds
            if current_time - last_auto_exit >= exit_delay and entry_count > 0:
                # Decrease count but don't go below zero
                old_count = entry_count
                entry_count = max(0, entry_count - exit_count)
                last_auto_exit = current_time
                
                # Only log if count actually changed
                if old_count != entry_count:
                    print(f"Auto exit: -{exit_count} | Total count: {entry_count}")
                    
                    # Send updated count to InfluxDB
                    send_to_influxdb(entry_count)
            
            # Simple motion detection logic
            if current_state == 1 and previous_state == 0:
                # Start counting consecutive high readings
                consecutive_readings = 1
            elif current_state == 1 and previous_state == 1:
                # Continue counting consecutive high readings
                consecutive_readings += 1
                
                # If we have enough consecutive high readings and cooldown has passed
                if consecutive_readings >= 3 and (current_time - last_detection_time) > detection_cooldown:
                    # Increment entry count
                    entry_count += 1
                    last_detection_time = current_time
                    # Reset consecutive readings to prevent multiple triggers
                    consecutive_readings = 0
                    
                    # Log the entry
                    print(f"Person entered! Total count: {entry_count}")
                    
                    # Try to send to InfluxDB immediately on detection
                    send_to_influxdb(entry_count)
                    last_influxdb_update = current_time
                    
                    # Flash the LED if available
                    if led:
                        led.value(1)  # Turn on
                        time.sleep(0.05)
                        led.value(0)  # Turn off
            else:
                # Reset consecutive readings counter on low state
                consecutive_readings = 0
            
            # Periodic WiFi check
            if current_time - last_wifi_check >= wifi_check_interval:
                last_wifi_check = current_time
                connect_wifi()
            
            # Periodic InfluxDB update even when no motion
            if current_time - last_influxdb_update >= influxdb_update_interval:
                last_influxdb_update = current_time
                send_to_influxdb(entry_count)
                print(f"Status update - Current count: {entry_count}")
            
            # Update previous state
            previous_state = current_state
            
            # Brief sleep for responsive detection
            time.sleep(0.1)
            
    except KeyboardInterrupt:
        print("\nMonitoring stopped")
        print(f"Final count: {entry_count} people")

# Run the program
if __name__ == "__main__":
    main()