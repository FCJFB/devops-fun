# 🛒 DockerMart: Containerized Full-Stack Marketplace

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue?logo=docker)
![React](https://img.shields.io/badge/Frontend-React_v18-cyan?logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql)

## 📖 Overview
DockerMart is a modern, full-stack web application built to demonstrate enterprise-grade system architecture and DevOps principles. It features a React-based storefront, a high-performance Python backend, and a relational database, all securely networked and containerized using Docker and routed through an Nginx reverse proxy.

This project was built to showcase end-to-end development skills, from database design and RESTful API creation to frontend styling and CI/CD automation.

## 🏗️ System Architecture
The application is broken down into isolated microservices:
* **The Front Door (Nginx):** Acts as a reverse proxy on Port 80, serving compiled React static files and silently routing `/api/` requests to the internal backend.
* **The Storefront (React + Vite):** A lightning-fast, Hot-Module-Replaced frontend styled strictly with Tailwind CSS v4.
* **The Engine (FastAPI):** A Python-based REST API that validates incoming data via Pydantic and communicates with the database using SQLAlchemy ORM.
* **The Vault (PostgreSQL):** A secure relational database running on an isolated Docker network, using Docker Secrets for password management.

## 🚀 Tech Stack
* **Frontend:** React, TypeScript, Tailwind CSS, Vite
* **Backend:** Python, FastAPI, SQLAlchemy, Pydantic
* **Database:** PostgreSQL (15-alpine)
* **Infrastructure:** Docker, Docker Compose, Nginx (Alpine)
* **CI/CD:** GitHub Actions (Automated build testing)

## ✨ Key Features
* **Full CRUD Functionality:** Users can read and write products directly to the PostgreSQL database via the React UI.
* **Zero-Port Exposure:** The Python API and PostgreSQL database are hidden inside an internal Docker network. Only Nginx is exposed to the outside world.
* **Multi-Stage Docker Builds:** The frontend uses a multi-stage Dockerfile to compile Node.js code and serve lightweight static files, drastically reducing image size.
* **Automated CI Pipeline:** A GitHub Actions workflow automatically spins up a virtual Ubuntu server to test the Docker Compose build process on every push to the `main` branch.

## 🛠️ How to Run Locally

### Prerequisites
You must have [Docker](https://www.docker.com/) and Docker Compose installed on your machine.

### 1. Clone the Repository
```bash
git clone [https://github.com/FCJFB/devops-fun.git](https://github.com/FCJFB/devops-fun.git)
cd devops-fun
```

### 2. Configure Local Secrets
For security, database passwords are not tracked in Git. You need to create a local secret file before booting the engine:
```bash
mkdir secrets
echo "your_super_secret_password" > secrets/db_password.txt
```

### 3. Boot the Matrix
Run the following command to download the images, compile the code, and start the isolated network:
```bash
docker compose up -d --build
```

### 4. Access the Application
* **Storefront:** `http://localhost`
* **API Documentation (Swagger UI):** `http://localhost/api/docs` (Routed through Nginx)

### 5. Graceful Teardown
To stop the containers while preserving your database data:
```bash
docker compose down
```
*(Note: To completely wipe the database and start fresh, run `docker compose down -v`)*

---
*Architected and built by Felix Falk with the help of AI tools for some code. Feel free to reach out through github DM or view my other projects.*
