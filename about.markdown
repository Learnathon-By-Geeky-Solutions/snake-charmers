# LifeRide 🚑

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://golang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)

<div align="center">
  <img src="public/images/liferide-banner.svg" alt="LifeRide Banner" width="100%">
  
  <h2>Every Second Counts. Every Life Matters.</h2>
  
  <p align="center">
    <b>LifeRide</b> is a cutting-edge emergency medical transportation platform connecting patients with ambulances in real-time.
    <br />
    <a href="https://app.swaggerhub.com/apis-docs/ImdadRaqib/api_documentation/1.0.0#/"><strong>Explore the API »</strong></a>
    <br />
    <br />
    <a href="#-getting-started">Quick Start</a>
    ·
    <a href="#-key-features">Features</a>
    ·
    <a href="https://github.com/Learnathon-By-Geeky-Solutions/snake-charmers/issues">Report Bug</a>
    ·
    <a href="https://github.com/Learnathon-By-Geeky-Solutions/snake-charmers/issues">Request Feature</a>
  </p>
  
  <div align="center">
    <img src="https://img.shields.io/badge/Maintained%3F-Yes-green.svg" alt="Maintenance">
    <img src="https://img.shields.io/github/license/your-organization/liferide" alt="License">
    <img src="https://img.shields.io/github/issues/your-organization/liferide" alt="Issues">
  </div>
</div>

## 🏥 About LifeRide

<table>
<tr>
<td>

**LifeRide** is revolutionizing emergency medical transportation by leveraging modern technology to save lives. Our platform seamlessly connects patients with the nearest available ambulances through an intuitive interface, providing real-time tracking, transparent pricing, and reliable service when it matters most.

### Why LifeRide?

- ⏱️ **Reduced Response Time**: Algorithmic matching of patients with the closest available ambulances
- 📍 **Precision Location**: Accurate GPS tracking for both patients and drivers
- 💰 **Transparent Pricing**: Clear cost estimates before booking
- 🔄 **Real-time Updates**: Live tracking and status notifications
- 💲 **Price Bidding System**: Negotiate fares directly with drivers for non-emergency transport
- ⭐ **Quality Assurance**: Post-service rating system for continuous improvement

</td>
<!-- <td width="50%">

<img src="public/images/architecture-diagram.png" alt="LifeRide System Architecture" width="100%">

</td> -->
</tr>
</table>

### Key Metrics

<div align="center">
  <table>
    <tr>
      <td align="center" width="25%">
        <h3>Adaptive</h3>
        <p>Search Radius</p>
      </td>
      <td align="center" width="25%">
        <h3>24/7</h3>
        <p>Service Availability</p>
      </td>
      <td align="center" width="25%">
        <h3>100%</h3>
        <p>Secure Transactions</p>
      </td>
      <td align="center" width="25%">
        <h3>Bidding</h3>
        <p>Fare Negotiation</p>
      </td>
    </tr>
  </table>
</div>

## 📋 Table of Contents
- [Team](#-team)
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Database Design](#-database-design)
- [API Documentation](#-api-documentation)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Development Guidelines](#-development-guidelines)
- [Testing](#-testing)
- [Resources](#-resources)
- [Contributing](#-contributing)
- [License](#-license)

## 👥 Team

### Core Developers
| Role | Name | GitHub |
|------|------|--------|
| **Team Leader** | Imdad Rakib | [![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/Imdad-Rakib) |
| **Developer** | SA-K1B | [![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/SA-K1B) |
| **Developer** | IAmAreza | [![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/iAmAreza) |

### Project Mentor
- **Shakil Shahan** - [![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/shakil-shahan)

## 🚀 Project Overview

LifeRide is a comprehensive web-based platform designed to revolutionize emergency medical transportation by connecting users with nearby ambulance drivers in real-time. The system leverages Google Maps API integration and real-time notifications to provide a seamless experience during medical emergencies when every second counts.

### Key Goals
- Reduce ambulance response time in emergencies
- Provide transparent pricing and ETA information
- Create a reliable platform for medical transport
- Enable real-time tracking and communication

## ✨ Key Features

### For Users 👤
- **Intuitive Profile Management**: Create and manage your personal profile
- **Location-Based Services**: View nearby available ambulances on a map
- **Route Planning**: Add precise start and end locations for your journey
- **Transparent Information**: View ETA and approximate price before booking
- **Seamless Booking**: Request an ambulance with a single click
- **Quality Control**: Rate drivers and provide feedback after service completion

### For Drivers 🚗
- **Professional Profiles**: Create and manage driver profiles with vehicle details
- **Availability Management**: Toggle availability status to control incoming requests
- **Request Handling**: Accept or reject ride requests based on availability
- **Trip Control**: Start, track, and end rides through an intuitive interface
- **Payment System**: Manage payments and view earnings history

## 🏗 System Architecture

### Architecture Diagram
![Architecture Diagram](public/images/architecture-diagram.png)

### Services Overview

Our platform uses a microservices architecture with the following key components:

| Service | Description |
|---------|-------------|
| **Location Service** | Tracks and manages real-time driver locations |
| **Ambulance Finder Service** | Identifies available ambulances within proximity |
| **Auth Service** | Handles user authentication and token validation |
| **Trip Service** | Manages trip creation, updates, and completion |
| **WebSocket Service** | Facilitates real-time communication between users and drivers |

### System Flow Diagram

![System Flow Diagram](public/images/sysflow.png)

#### Operational Flow Explained

1. **User Request Initiation** 📱
   - User specifies start and end locations through the app interface

2. **Proximity-Based Ambulance Search** 🔍
   - The Ambulance Finder Service locates available drivers within a 2km radius

3. **Driver Notification System** 📣
   - Available drivers receive notifications and can accept or decline

4. **Trip Commencement** 🚦
   - Upon acceptance, real-time tracking is activated via Google Maps API

5. **Real-Time Updates** 📊
   - Users receive continuous updates on driver location, ETA, and trip status

6. **Service Completion and Feedback** 💯
   - Post-trip payment processing and driver rating system activation

## 📊 Database Design

The ER diagram illustrates our relational database structure, showing the relationships between users, drivers, trips, and other key entities.

![ER Diagram](public/images/ER_Diagram.png)

## 📘 API Documentation

We maintain comprehensive API documentation to facilitate integration and development.

[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://app.swaggerhub.com/apis-docs/ImdadRaqib/api_documentation/1.0.0#/)

## 💻 Tech Stack

### Backend
- **FastAPI**: High-performance Python framework for building APIs
- **Go**: Used for performance-critical microservices
- **WebSockets**: For real-time bidirectional communication

### Frontend
- **React**: JavaScript library for building user interfaces
- **Redux**: State management for the application
- **Google Maps API**: For mapping, routing, and location services

### Infrastructure
- **PostgreSQL**: Relational database for storing application data
- **Nginx**: Load balancer for distributing traffic
- **Docker**: Containerization for consistent development and deployment
- **CI/CD**: Automated testing and deployment pipelines

