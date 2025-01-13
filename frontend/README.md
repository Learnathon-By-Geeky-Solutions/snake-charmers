# LifeRide Frontend

This is the frontend part of the LifeRide project, a web-based platform designed to provide quick and efficient ambulance services by connecting users with nearby drivers. The system integrates with Google Maps API and notification services to ensure seamless service delivery.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool and development server.
- **Tailwind CSS**: A utility-first CSS framework.
- **Docker**: Containerization platform for development and deployment.

## Prerequisites

- **Docker**: Ensure you have Docker installed. You can download it from [docker.com](https://www.docker.com/).
- **Docker Compose**: Ensure you have Docker Compose installed. You can download it from [docker.com](https://docs.docker.com/compose/install/).

## Development Setup

### 1. Clone the Repository

```sh
git clone git@github.com:Learnathon-By-Geeky-Solutions/snake-charmers.git
cd snake-charmers/frontend/my-app
```

### 2. Set Environment Variables
Create a `.env` file in the root of the `frontend` directory and add the following line, replacing `port` with your desired port number:

```sh
VITE_PORT=port
```

### 3. Build and Start the Application

```sh
docker-compose up --build
```
### 4. Access the Application

Once the application is running, you can access it by navigating to `http://localhost:port` in your web browser, replacing `port` with the port number you specified in the `.env` file.

## Adding New Packages

If you need to install a new package, follow these steps:

### 1. Add the Package to `package.json`

Open the `package.json` file in the `frontend` directory and add the new package to the `dependencies` or `devDependencies` section.

### 2. Rebuild the Container

After updating the `package.json` file, rebuild the Docker container to install the new package:

```sh
docker-compose up --build
```
## Good Luck!

Wish you all the best on your development journey with the LifeRide project. May your code be bug-free, your builds be swift, and your deployments be smooth. Happy coding!
