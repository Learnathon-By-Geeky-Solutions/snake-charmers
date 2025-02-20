# Stage 1: Build stage (install dependencies into a virtual environment)
FROM python:3.13.2-alpine AS build

# Install build dependencies
RUN apk update && apk add --no-cache build-base=0.5-r2 libffi-dev=3.2.1-r0

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file
COPY ./trip-service/requirements.txt .
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Final production stage (smaller image)
FROM python:3.13.2-alpine

# Install runtime dependencies (if needed)
# RUN apk add --no-cache libffi-dev

# Create a non-root user
RUN adduser -D myuser
USER myuser

# Set the working directory in the container
WORKDIR /app

# Copy the virtual environment from the build stage
COPY --from=build /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"


# Copy application code
COPY ./ambulance-finder-service/app ./app
COPY ./ambulance-finder-service/.env .
COPY ./models ./app/models

# Expose the port that the app runs on
EXPOSE 8000

# Run the application with auto-reload for development
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]