FROM python:3.9-slim

WORKDIR /app

# Install dependencies for development
RUN apt-get update && apt-get install -y \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install required Python packages
RUN pip install --no-cache-dir \
    influxdb-client \
    paho-mqtt \
    requests

# Copy the Python code and requirements
COPY main.py requirements.txt ./

# Install additional requirements
RUN pip install --no-cache-dir -r requirements.txt

# Command to run the application
CMD ["python", "main.py"]