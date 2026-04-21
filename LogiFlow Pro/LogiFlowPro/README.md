# 🚀 LogiFlow Pro: Reactive Event-Driven Logistics System

LogiFlow Pro is a state-of-the-art logistics and order management system built with a **Reactive Architecture**. It demonstrates the power of asynchronous event-driven communication, microservices resilience, and high-performance monitoring.

![Architecture Diagram](https://img.shields.io/badge/Architecture-Event--Driven-orange)
![Java Version](https://img.shields.io/badge/Java-21-blue)
![Spring Boot](https://img.shields.io/badge/Spring--Boot-4.0.5-brightgreen)
![Kafka](https://img.shields.io/badge/Kafka-Confluent-black)

---

## 🏗️ System Architecture

The system is composed of specialized microservices communicating through **Apache Kafka**:

1.  **Shipping Service**: Orchestrates the logistical flow, emitting events like `IN_TRANSIT` or `DELIVERED`.
2.  **Billing Service**: Consumes shipping events to trigger invoicing processes asynchronously.
3.  **Kafka Infrastructure**: Acts as the central nervous system, handling message distribution and retries.
4.  **Observability Stack**: Prometheus scrapes metrics from the services, and Grafana visualizes the real-time health of the system.

### Key Technical Highlights
-   **Virtual Threads (Project Loom)**: Optimized for high concurrency using Java 21 Virtual Threads.
-   **Resilience Patterns**: Implementation of the **Dead Letter Topic (DLT)** pattern to handle failures without blocking the main event stream.
-   **Observability-First**: Full integration with **Micrometer**, **Prometheus**, and **Grafana** to monitor message throughput and error rates.

---

## 🛠️ Tech Stack

-   **Backend**: Java 21, Spring Boot 4.0.5, Spring Kafka, Spring Data JPA.
-   **Messaging**: Apache Kafka (Confluent Platform).
-   **Database**: MySQL 8.0.
-   **Monitoring**: Prometheus & Grafana.
-   **Containerization**: Docker & Docker Compose.

---

## 📊 Observability & Monitoring

The project includes a pre-configured **Grafana Dashboard** that provides real-time insights into:
-   **Consumption Rate**: Messages processed per second across microservices.
-   **DLT Failure Rate**: Visibility into messages redirected to the Dead Letter Topic for manual intervention or automated retry.
-   **System Health**: Memory usage, thread counts (Virtual vs Platform), and JVM metrics.

---

## 🚀 Getting Started

### Prerequisites
-   Java 21
-   Docker & Docker Compose
-   Maven

### Running the Infrastructure
```bash
cd infrastructure
docker-compose up -d
```

### Running the Services
1.  **Shipping Service**:
    ```bash
    cd backend/shipping-service
    ./mvnw spring-boot:run
    ```
2.  **Billing Service**:
    ```bash
    cd backend/billing-service
    ./mvnw spring-boot:run
    ```

### Testing the Flow
Trigger a shipping event via REST:
```bash
GET http://localhost:8080/api/shipping/trigger?trackingId=LOGI-123&state=IN_TRANSIT
```

Simulate a database error to see the **DLT Pattern** in action:
```bash
GET http://localhost:8080/api/shipping/trigger?trackingId=LOGI-ERROR&state=SIMULATE_DB_ERROR
```

---

## 📈 Monitoring URL
-   **Grafana**: [http://localhost:3000](http://localhost:3000) (Dashboard: *LogiFlow Pro - Messaging*)
-   **Prometheus**: [http://localhost:9090](http://localhost:9090)

---

## 👨‍💻 Author
**Marcos Herrero** - *Full Stack Developer*
- [GitHub](https://github.com/MarcosHerrero12)
- [LinkedIn](https://www.linkedin.com/in/marcos-herrero/)

---

*This project was developed as part of a professional portfolio to demonstrate advanced knowledge in reactive architectures and microservices observability.*
