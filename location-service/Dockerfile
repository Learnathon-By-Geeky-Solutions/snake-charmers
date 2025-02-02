# Use the official Python 3.10-slim image from Docker Hub.
# NOTE: This image runs as root by default. For production,
#       consider creating a dedicated non-root user to reduce
#       privilege escalation risks.
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container.
# We rely on a .dockerignore file to ensure that sensitive files
COPY . .

# Expose the port that the app runs on
EXPOSE 8000

# Command to run the application with auto-reload for development
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]