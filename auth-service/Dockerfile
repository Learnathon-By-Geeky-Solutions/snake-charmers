# Build Stage
FROM python:3.13.2-alpine AS build

# Install build dependencies
RUN apk update && apk add --no-cache bash build-base libffi-dev

# Set the working directory in the container
WORKDIR /app

# Copy the requirements files
COPY ./auth-service/requirements.txt .
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt





# Base Runtime Stage
FROM python:3.13.2-alpine AS base
# Create a non-root user

RUN adduser -D myuser

# Set the working directory in the container
WORKDIR /app

# Copy the virtual environment from the build stage
COPY --from=build /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy the application code
COPY ./auth-service/app ./app
COPY ./models ./app/models


# Development Stage
FROM base AS dev
# USER myuser
EXPOSE 8000
# CMD ["python", "-m", "app.main"]




# Test Stage
FROM base AS test
COPY ./pytest.ini .
COPY ./auth-service/tests ./tests
COPY ./auth-service/coverage-reports ./coverage-reports
COPY ./conftest.py ./tests

ENV PYTHONPATH=.

# USER myuser