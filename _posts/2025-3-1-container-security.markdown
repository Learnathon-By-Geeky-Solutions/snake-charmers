---
layout: post
title: "Running Docker Containers as Non-Root: A Security Insight"
date: 2025-03-01 00:00:00 +0000
categories: docker security devlog
---

Throughout our development journey, we have been maintaining a **Dockerized setup**, and our `Dockerfile` has evolved significantly over time. This process has brought us valuable insights and learnings.

### The SonarQube Security Flag 🚨

At one point, when we pushed our initial `Dockerfile` to the **Main** branch, SonarQube flagged a security issue. This was something new for us, and naturally, we got intrigued. The issue? **Running the container as the root user.**

We know that **Docker containers** can be thought of as lightweight Linux machines. And in a Linux system, there are generally two types of users:  
1. **Superuser (Root User)** – Has unrestricted access to the system.  
2. **General User** – Has limited permissions for security reasons.  

By default, **if a user isn't explicitly defined in the `Dockerfile`**, the container runs as the **root user**. This means that if an attacker somehow gains access to the container, they can **execute commands with root privileges**, making it a serious security threat.

### The Fix: Running Containers as a Non-Root User 🛡️

To mitigate this, we needed to **create and switch to a non-root user** in the `Dockerfile`. This way, the container runs with limited privileges, meaning even if someone gains access, they won’t be able to execute harmful commands that could compromise the system.

A simple fix in the `Dockerfile` is:

```dockerfile
# Create a new user
RUN useradd -m myuser 

# Switch to that user
USER myuser
```
 
### Key Takeaway
This experience gave us new insights into container security, especially around best practices for securing Docker containers. Looking forward to uncovering more security aspects as we continue our journey! 🚀