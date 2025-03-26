---
layout: post
title: "How Dockerized Testing Solved Our Pytest Configuration Duplication Issue in a Monorepo "
date: 2025-3-26 00:00:00 +0000
categories: docker pytest monorepo testing
---

Managing test configurations in a monorepo can be challenging, especially when dealing with multiple microservices. Each service often requires its own test setup, which can lead to redundant code and maintenance headaches. In this post, we’ll discuss how we tackled this issue by leveraging Docker to centralize and streamline our pytest configuration, reducing duplication and improving maintainability.  



## Brief  
 
In our project, which follows a **microservices architecture** and is maintained in a **monorepo**, we encountered a significant challenge with test configuration duplication. Each microservice is a **distinct FastAPI application**, and we use **pytest** for testing.  

## The Problem: Code Duplication in Pytest Configuration  

Pytest generally expects test files inside a folder named `tests/`, and it allows defining shared test configurations in a `conftest.py` file within the same directory. Since each microservice had its own test directory (`tests/`), we initially placed a separate copy of `conftest.py` inside each service’s `tests/` folder.  

While this approach worked functionally, it led to a **code duplication issue** when we pushed our code to the main branch. **SonarQube flagged a 37% duplication rate**, primarily because the `conftest.py` file was identical across multiple services.  

## The Solution: Dockerized Testing  

To eliminate redundancy, we decided to maintain **a single instance of `conftest.py`** at the root of our monorepo (`snake-charmers/`). However, pytest still required `conftest.py` inside each service’s `tests/` folder for test execution.  

### How Docker Helped  
Instead of manually copying `conftest.py` across services, we leveraged **Docker’s build process**:  
- During **image build**, we **copied `conftest.py` into each service’s `tests/` folder** inside the container.  
![Dockerized Testing Workflow](../images/dockerfile-test.png)  

- This ensured that each service had its own `conftest.py` inside the container while avoiding duplication in the codebase.  

