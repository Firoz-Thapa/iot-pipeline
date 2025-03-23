try:
    from app_secrets import WIFI_SSID, WIFI_PASSWORD, INFLUXDB_TOKEN
except ImportError:
    print("Create app_secrets.py with your credentials")
    WIFI_SSID = ""
    WIFI_PASSWORD = ""
    INFLUXDB_TOKEN = ""

# Other non-sensitive configurations
INFLUXDB_URL = "http://135.236.212.218:8086"
INFLUXDB_BUCKET = "iot-data"
INFLUXDB_ORG = "LAB"
PIR_PIN = 22
MEASUREMENT_NAME = "test_measurement"