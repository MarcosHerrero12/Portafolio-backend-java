# 🏗️ Infrastructure & Monitoring Setup

This directory contains all the configuration files required to run the backing services for LogiFlow Pro using Docker Compose.

## 📦 Services Included

-   **Kafka & Zookeeper**: Event streaming platform for asynchronous communication.
-   **MySQL**: Relational database for persistent storage.
-   **Prometheus**: Metrics collection and storage system.
-   **Grafana**: Data visualization and monitoring platform.

## 📊 Monitoring Provisioning

The infrastructure is pre-configured with **Automatic Provisioning**:
-   **Data Sources**: Prometheus is automatically added as the default data source.
-   **Dashboards**: The `LogiFlow Pro - Messaging` dashboard is loaded automatically upon startup.

## 🚀 How to Run

1.  Start all services:
    ```bash
    docker-compose up -d
    ```
2.  Access Monitoring:
    -   **Grafana**: [http://localhost:3000](http://localhost:3000) (User: `admin` / Password: `jFEV89@t@PGvQp`)
    -   **Prometheus**: [http://localhost:9090](http://localhost:9090)

## 🛠️ Configuration Details

-   **Kafka Port**: `29092` (External for host machine) / `9092` (Internal for Docker network).
-   **Prometheus Scrape Interval**: 15 seconds.
-   **Grafana Volume**: Data is persisted in a Docker volume to keep your password and dashboard changes across restarts.
