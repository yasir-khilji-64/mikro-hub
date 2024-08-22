# Mikro Hub

**mikro-hub** is a microservices-based project developed using the Moleculer.js framework with TypeScript and MongoDB. It consists of two primary microservices: the Products Service and the Warehouse Service. These services communicate with each other to manage product availability and inventory in a seamless and scalable manner.

- [Mikro Hub](#mikro-hub)
  - [Overview](#overview)
  - [Microservices](#microservices)
    - [Product Service](#product-service)
    - [Warehouse Service](#warehouse-service)
  - [Database Setup](#database-setup)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)

## Overview

**mikro-hub** demonstrates a simple yet powerful microservices architecture, focusing on product management and inventory control. The project uses the Moleculer.js framework, a modern and open-source microservices framework, to create a highly maintainable and scalable system. MongoDB serves as the database for storing product and inventory information, and Docker Compose is used to orchestrate the services and the database.

## Microservices

### Product Service

The **Products Service** is responsible for handling product-related operations. It interacts with the **Warehouse Service** to manage inventory.

Endpoints:

- **Get Avaialable Products**: Fetches the list of available products by querying the **Warehouse Service**.
- **Buy a Product**: Purchases a product and updates the product count in the **Warehouse Service**.

### Warehouse Service

The **Warehouse Service** manages the product inventory, keeping track of product quantities.

Endpoints:

- **Get Product Count**: Retrieves the count of a specific product based on its Product ID.
- **Update Product Count**: Updates the count of a product when a purchase is made.

## Database Setup

The project uses MongoDB to store product and inventory data. A working MongoDB service is added with the Docker Compose for local development.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Docker and Docker Compose

### Installation

- Clone the repository:

```bash
git clone https://github.com/yasir-khilji-64/mikro-hub.git
cd mikro-hub
```

- Running the Services:
You can start the services and api gateway using Docker Compose. Docker Compose will orchestrate all the services and dependencies with one command.

```bash
npm run dc:up
```
