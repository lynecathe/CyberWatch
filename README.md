# 🛡️ CyberWatch

CyberWatch is a full-stack Security Operations Center (SOC) monitoring and incident management platform.

The project was designed to simulate some of the core workflows used by security teams to monitor infrastructure, detect suspicious activity, generate security alerts, manage incidents, and assign analysts.

CyberWatch combines a modern Angular frontend, a Spring Boot REST API, PostgreSQL persistence, JWT-based authentication, role-based access control (RBAC), and Docker containerization.

---

## 🎯 Project Objective

The objective of CyberWatch is to provide a simplified SOC environment where security events can be transformed into actionable alerts and incidents.

The application follows the following security workflow:

```text
Security Event
      ↓
Detection Engine
      ↓
Security Alert
      ↓
Incident
      ↓
SOC Analyst
      ↓
Investigation / Resolution
```

The project demonstrates both full-stack development and cybersecurity concepts such as threat detection, infrastructure monitoring, incident management, authentication, authorization, and SOC workflows.

---

## ✨ Features

### 🔐 Authentication & Authorization

CyberWatch implements JWT-based authentication.

Three roles are available:

- `USER` — standard authenticated user
- `ANALYST` — SOC analyst with access to security operations
- `ADMIN` — administrator with user management privileges

Role-Based Access Control (RBAC) is enforced by the Spring Security backend and Angular route guards.

---

### 🚨 Security Alert Management

CyberWatch centralizes detected security alerts.

Alerts contain information such as:

- Alert title and description
- Source IP
- Destination IP
- Severity
- Status
- Detection timestamp

Supported severity levels include:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

---

### 🔎 Detection Engine

The backend contains a detection service capable of analyzing incoming security events and automatically generating alerts when suspicious activity is detected.

For example, repeated failed SSH authentication attempts can trigger a potential brute-force alert.

This provides the following automated workflow:

```text
Event → Detection Rule → Alert
```

---

### 🧯 Incident Management

Security alerts can be escalated into incidents.

Incidents include:

- Title
- Description
- Severity
- Status
- Associated security alert
- Assigned SOC analyst
- Creation date

The application also prevents multiple incidents from being created from the same alert.

Incident statuses allow the SOC workflow to be tracked from detection through resolution.

---

### 👨‍💻 Analyst Assignment

Security incidents can be assigned to registered SOC analysts.

The backend verifies that the selected user has the `ANALYST` role before allowing the assignment.

This simulates a real SOC incident-handling workflow.

---

### 🖥️ Machine Monitoring

CyberWatch maintains an inventory of monitored machines.

Each machine contains:

- Hostname
- IP address
- Operating system
- Status
- Criticality
- Last activity timestamp

Machine statuses include states such as:

```text
ONLINE
OFFLINE
COMPROMISED
```

This allows the dashboard to provide an overview of monitored infrastructure.

---

### 📊 SOC Dashboard

The dashboard provides an overview of the current security posture.

It displays information about:

- Total alerts
- Open alerts
- High-severity alerts
- Critical alerts
- Total incidents
- Open incidents
- Incidents under investigation
- Resolved incidents
- Total monitored machines
- Online machines
- Offline machines
- Compromised machines
- Recent security alerts
- Alert severity distribution
- Machine status distribution
- Incident status distribution

---

### 👥 User Administration

Administrators have access to a dedicated user management area.

Access to administrative functionality is protected through RBAC.

---

## 🏗️ Architecture

CyberWatch uses a three-tier architecture:

```text
┌──────────────────────────────┐
│       Angular Frontend       │
│          Port 4200           │
└──────────────┬───────────────┘
               │ HTTP / REST
               ▼
┌──────────────────────────────┐
│     Spring Boot Backend      │
│          Port 8080           │
│                              │
│  REST API                    │
│  JWT Authentication          │
│  Spring Security / RBAC      │
│  Detection Engine            │
│  Business Logic              │
└──────────────┬───────────────┘
               │ JPA / Hibernate
               ▼
┌──────────────────────────────┐
│          PostgreSQL          │
│          Port 5432           │
│                              │
│ Users                        │
│ Machines                     │
│ Security Alerts              │
│ Incidents                    │
└──────────────────────────────┘
```

---

## 🛠️ Technologies

### Frontend

- Angular
- TypeScript
- HTML
- SCSS
- Angular Router
- RxJS

### Backend

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- Maven
- JWT
- Lombok

### Database

- PostgreSQL 17

### DevOps

- Docker
- Docker Compose
- Nginx
- Git
- GitHub

---

## 🐳 Docker

The complete CyberWatch stack is containerized using Docker.

Docker Compose orchestrates three services:

```text
cyberwatch-frontend
cyberwatch-backend
cyberwatch-postgres
```

The frontend Angular production build is served through Nginx.

The backend runs as a Spring Boot container.

PostgreSQL runs inside its own container with a persistent Docker volume.

This allows the complete environment to be started consistently without manually launching each component.

---

## 🚀 Running CyberWatch with Docker

### Prerequisites

Install:

- Docker
- Docker Compose
- Git

Clone the repository:

```bash
git clone https://github.com/lynecathe/CyberWatch.git
cd CyberWatch
```

Create your environment configuration from `.env.example`.

Example:

```env
POSTGRES_DB=cyberwatch_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=change_me
JWT_SECRET=change_me_with_a_long_random_secret
```

Do not commit your personal `.env` file.

Build and start the application:

```bash
docker compose up -d --build
```

Check the containers:

```bash
docker compose ps
```

The following services should be running:

```text
cyberwatch-postgres
cyberwatch-backend
cyberwatch-frontend
```

Open the application in your browser:

```text
http://localhost:4200
```

Backend API:

```text
http://localhost:8080
```

---

## 💾 Data Persistence

PostgreSQL data is stored using a Docker volume.

This means application data persists when containers are stopped and restarted.

The stack can safely be stopped using:

```bash
docker compose down
```

Then restarted with:

```bash
docker compose up -d
```

Removing the PostgreSQL volume will remove the database data.

---

## 📁 Project Structure

```text
CyberWatch/
│
├── cyberwatch-backend/
│   ├── src/
│   ├── Dockerfile
│   └── .dockerignore
│
├── cyberwatch-frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔒 Security

CyberWatch includes several security mechanisms:

- JWT authentication
- Stateless authentication
- Password hashing with BCrypt
- Spring Security
- Role-Based Access Control
- Angular route guards
- Protected REST endpoints
- Environment variables for sensitive configuration
- Secrets excluded from Git

Sensitive information such as database passwords and JWT signing secrets must be stored in `.env` and must never be committed to the repository.

---

## 🔮 Possible Future Improvements

Possible extensions include:

- Real-time alerts using WebSockets
- SIEM integration
- MITRE ATT&CK mapping
- Automated IP reputation analysis
- Email or notification alerts
- Advanced detection rules
- Audit logs
- Vulnerability management
- Threat intelligence integration
- Deployment to a cloud environment

---

## 👩‍💻 Author

**Catherine Lyne Ngango Koloko**

Cybersecurity Engineering Student

GitHub: `lynecathe`

---

## 📄 License

This project was developed for educational and portfolio purposes.