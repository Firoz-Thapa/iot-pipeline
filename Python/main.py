import time
import network
import urequests
from machine import Pin
import gc

# WiFi setup
WIFI_SSID = "Firoz thapa"
WIFI_PASSWORD = "Firoz123"

# PIR sensor pins
ENTRY_PIR_PIN = 22  # GP22 where the ENTRY sensor is connected
EXIT_PIR_PIN = 21   # GP21 where the EXIT sensor is connected

INFLUXDB_URL = "http://135.236.212.218:8086"
INFLUXDB_BUCKET = "iot-data"
INFLUXDB_ORG = "LAB"
INFLUXDB_TOKEN = "XFym-O4pGm1v4zmRkAlyW-tr1m_HJpivBYxoiOo_YBw5hl9uafe-TxJIrnN8CbFg3ITASDtklyxmbUQUn5u95Q=="
MEASUREMENT_NAME = "test_measurement"

MOTION_THRESHOLD = 10 
MOTION_CHECK_DURATION = 2.0  
DETECTION_COOLDOWN = 3.0   

people_count = 0
last_entry_detection_time = 0
last_exit_detection_time = 0
last_wifi_check = 0
wifi_check_interval = 30
last_influxdb_update = 0
influxdb_update_interval = 2
wifi_connected = False
def log(message, level="INFO"):
    """Enhanced logging with timestamp"""
    print(f"[{time.time()}] [{level}] {message}")

def detect_motion(sensor, 
                  motion_threshold=10, 
                  check_duration=2.0, 
                  cooldown=3.0, 
                  last_detection_time=0):
    """
    Uniform motion detection for both entry and exit sensors
    
    Args:
    - sensor: PIR sensor Pin object
    - motion_threshold: Number of high readings needed
    - check_duration: Total time to check for motion
    - cooldown: Time between detections
    - last_detection_time: Time of last detection
    
    Returns:
    - Tuple (motion_detected, current_time)
    """
    current_time = time.time()
    
    if current_time - last_detection_time < cooldown:
        return False, last_detection_time
    
    high_readings = 0
    total_readings = 0
    start_time = current_time
    
    while time.time() - start_time < check_duration:
        current_reading = sensor.value()
        total_readings += 1
        
        if current_reading == 1:
            high_readings += 1
            
            if high_readings >= motion_threshold:
                log(f"Motion Detected: {high_readings} high readings out of {total_readings}", "MOTION")
                return True, current_time
        
        time.sleep(0.1)
    
    return False, last_detection_time

def connect_wifi():
    """Establish WiFi connection"""
    global wifi_connected
    
    log("Attempting WiFi connection")

    gc.collect()

    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)

    if wlan.isconnected():
        ip = wlan.ifconfig()[0]
        log(f"Already connected to WiFi: {ip}")
        wifi_connected = True
        return True
    
    try:
        wlan.connect(WIFI_SSID, WIFI_PASSWORD)

        max_wait = 10
        while max_wait > 0:
            if wlan.isconnected():
                break
            max_wait -= 1
            print(".", end="")
            time.sleep(1)
        
        print("")
    except Exception as e:
        log(f"WiFi connection error: {e}", "ERROR")
        wifi_connected = False
        return False
    
    if wlan.isconnected():
        ip = wlan.ifconfig()[0]
        log(f"Connected to WiFi: {ip}")
        wifi_connected = True
        return True
    else:
        log("Failed to connect to WiFi", "ERROR")
        wifi_connected = False
        return False

def send_to_influxdb(count):
    """Send people count to InfluxDB"""
    global wifi_connected
    
    if not wifi_connected:
        log("Cannot send to InfluxDB: WiFi not connected", "WARNING")
        return False
    data = f"{MEASUREMENT_NAME},device=pir value={count}"
    headers = {
        "Authorization": f"Token {INFLUXDB_TOKEN}",
        "Content-Type": "text/plain"
    }
    url = f"{INFLUXDB_URL}/api/v2/write?org={INFLUXDB_ORG}&bucket={INFLUXDB_BUCKET}&precision=ns"
    
    try:
        response = urequests.post(url, headers=headers, data=data, timeout=5)
        
        if response.status_code == 204:
            log("Data sent to InfluxDB successfully", "INFO")
            response.close()
            return True
        else:
            log(f"InfluxDB error: {response.status_code}", "ERROR")
            response.close()
            return False
    except Exception as e:
        log(f"InfluxDB send error: {e}", "ERROR")
        return False

def main():
    """Main people counting program"""
    global people_count, last_entry_detection_time, last_exit_detection_time
    global last_wifi_check, last_influxdb_update

    log("=== GYM MONITORING SYSTEM ===")
    log(f"Entry Sensor Pin: GP{ENTRY_PIR_PIN}")
    log(f"Exit Sensor Pin: GP{EXIT_PIR_PIN}")
    log("Detection Parameters:")
    log(f"  - Motion Threshold: {MOTION_THRESHOLD}")
    log(f"  - Detection Cooldown: {DETECTION_COOLDOWN}s")
    
    connect_wifi()   
    try:
        entry_sensor = Pin(ENTRY_PIR_PIN, Pin.IN)
        exit_sensor = Pin(EXIT_PIR_PIN, Pin.IN, Pin.PULL_DOWN)
        log("Sensors initialized successfully")
    except Exception as e:
        log(f"Sensor initialization error: {e}", "CRITICAL")
        return

    try:
        led = Pin("LED", Pin.OUT)
        log("Onboard LED initialized")
    except:
        led = None
        log("No onboard LED available", "WARNING")

    try:
        while True:
            current_time = time.time()

            entry_detected, last_entry_detection_time = detect_motion(
                entry_sensor, 
                motion_threshold=MOTION_THRESHOLD,
                check_duration=MOTION_CHECK_DURATION,
                cooldown=DETECTION_COOLDOWN,
                last_detection_time=last_entry_detection_time
            )
            
            if entry_detected:
                people_count += 1
                log(f"Person entered! Total count: {people_count}")
                send_to_influxdb(people_count)

                if led:
                    led.value(1)
                    time.sleep(0.1)
                    led.value(0)

            exit_detected, last_exit_detection_time = detect_motion(
                exit_sensor, 
                motion_threshold=MOTION_THRESHOLD,
                check_duration=MOTION_CHECK_DURATION,
                cooldown=DETECTION_COOLDOWN,
                last_detection_time=last_exit_detection_time
            )
            
            if exit_detected:
                if people_count > 0:
                    people_count -= 1
                    log(f"Person exited! Total count: {people_count}")
                    send_to_influxdb(people_count)

                    if led:
                        led.value(1)
                        time.sleep(0.1)
                        led.value(0)
                else:
                    log("Exit detected, count already at 0", "WARNING")

            if current_time - last_wifi_check >= wifi_check_interval:
                last_wifi_check = current_time
                connect_wifi()

            if current_time - last_influxdb_update >= influxdb_update_interval:
                last_influxdb_update = current_time
                send_to_influxdb(people_count)
                log(f"Status update - Current count: {people_count}")

            time.sleep(0.1)
    
    except KeyboardInterrupt:
        log("\nMonitoring stopped by user")
        log(f"Final people count: {people_count}")

main()
