---
layout: post
title: "Why We Chose Microservices Over a Monolith"
date: 2025-04-16 00:00:00 +0000
categories: architecture backend devlog
---

Throughout our development journey, one of the key architectural decisions we made was choosing microservices over a monolithic design. This choice wasn’t just for the hype — it was based on real needs and traffic patterns we expect in our system.

### The Problem: High Traffic on Specific Endpoints 📈

A core feature of our system is tracking the real-time location of ambulance drivers. We update each driver’s location every 15 seconds. Let’s break that down:

That’s 4 requests per minute per driver.

With 1,000 active drivers, that’s 4,000 requests per minute — or roughly 67 requests per second.

This number will grow as more drivers join the platform. Now, if we were using a monolith, this traffic could easily lead to resource exhaustion or outages, especially when paired with other system responsibilities like authentication, trip management, and real-time communication.

### The Fix: Scaling Through Microservices ⚙️

To handle this, we decided to break our backend into independent microservices, each handling a specific responsibility. This gave us the freedom to scale only the services that need it — instead of scaling the whole system unnecessarily.

For example:

The Location Service (Python) is responsible for handling location updates and sees high traffic. We can scale it independently.

The Auth Service (Python) sees far less traffic and doesn’t need to scale as aggressively.

The Coordinator WebSocket Service (Go) handles all real-time WebSocket connections. It’s a critical piece and gets a huge amount of concurrent traffic, so it also benefits from being separated and scaled on its own.

### The Big Picture: Modular, Scalable, Maintainable 🧩

Here’s a quick rundown of the microservices we’ve built:

Auth Service (Python)

Location Service (Python)

Coordinator WebSocket Service (Go)

Nearby Ambulance Finder Service (Python)

Trip Service (Python)

We used Go for the Coordinator Service due to performance benefits — more on that in another blog post.

### Key Takeaway

Choosing microservices was a practical decision driven by performance, traffic patterns, and long-term scalability. It’s allowed us to build a backend that’s not only more resilient but also much easier to maintain and scale as our user base grows. 