# BeatGo - Microservices Backend API & JWT Refresh Token - Blacklist Authorization process

BeatGo app microservices Backend API has been designed to showcase microservices design patterns & refresh token - Blacklist authorization process. It consists of a two lightweight services, supporting database and back end data enrichment functions.

The BeatGo microservices Backend API is based on simple REST principles. The web API endpoints return JSON metadata about music artists, albums, and tracks, directly from the Spotify Data Catalogue. It also allows user registration and login, it provides access to user related data, like playlists and music that the user saves in the Your Music library. Such access is enabled through selective authorization, by the user.

- The two microservices are both written in Node.js using the Express framework. These have been containerized so can easily be deployed & run as containers
- Two NoSQL databases document store holding JSON, provided by MongoDB.
- Reverse proxy using NGINX responsible for forwarding requests and responses between the clients and the microservices. Our primary purpose is to access our API mapping to port 80 for HTTP.
- Redis Cache Memory server used in the authorization process for storing refresh tokens (key:userId, value:refreshToken) and used tokens in a blacklist.
- Message broker using MQRabbit to provide communication between services. (Subscriber/Publisher)

The app has been designed to be containerize with Docker Compose to run all the images in the same container.

This application supports a range of demonstration, and learning scenarios, such as:
 - A working example of microservices design
 - Use of containers, Docker 
 - NoSQL and document stores over traditional relational databases
 - RESTful API design 
 - Use of an open source application stack such as Node.js

---

# Table of Contents

- [Architecture & Core App Components](#architecture--core-app-components)
- [Getting Started](#getting-started)
- [Repository Structure](#repository-structure)
- [Reference Implementation](#reference-implementation)
- [Fundamentals](#fundamentals)
- [Containers & Kubernetes](#containers--kubernetes)
- [Deploying to Azure](#deploying-to-azure)
- [DevOps & CI/CD](#devops--cicd)
- [Experimental Implementations](#experimental-implementations)
- [Changelog](#changelog)

---


# Architecture & Core App Components
![architecture](./assets/images/Microservices-artchitecture.png)

# Getting Started
There are a number of ways to get started with this project depending on your goals. Below are some suggestions and pointers
- [Running BeatGo Microservices Architecture locally with Node.js](./docs/local-dev.md) - If you're a developer interested in the building and running Node.js and/or Vue.js components locally, this is a good place to start.

## Build and Run
Prerequisites: 
- [Node.js v8+ & NPM 🡽](https://nodejs.org/en/)
- [Git 🡽](https://git-scm.com/downloads)
- [MongoDB 🡽](https://www.mongodb.com/download-center/community)
- [Redis](https://redis.io/) (*If docker is not used)

Assuming you have the pre-reqs installed and MongoDB running. A simplified "happy path" of the steps at the bash command line are:

#### 1. Clone the repo, set up local configuration env files and install Node modules (This configuration only allow you to run microservices webs API. Redis must be installed locally in your computer as a local server):
```
git clone https://github.com/alicembranos/microservices-backend.git
cd microservices
cp spotify/.env.example spotify/.env
cp users/.env.example users/.env
cd ./spotify 
npm install install
cd ./users 
npm install install
```

#### 2. Open two terminals and start the data API server
```
cd spotify
npm run start
cd users
npm run start
```
- [Docker Container](./docker-compose.yml) - There is available Docker container and Docker Composer if you would like to run many NodeJS Microservices.
Build API Microservice by using following command:

```sh
docker-compose up -d --build
```

See `Dockerfile` and `docker-compose.yml` for more details.

# Repository Structure
This is a [monorepo](https://en.wikipedia.org/wiki/Monorepo) so contains multiple discreet but loosely dependant projects. The top levels of the repository directory tree are laid out as follows 
```
/
├── spotify            Older and experimental code archive 
│   ├── node_modules             Nativescript + Vue.js mobile client 
│   └── src                 Work in progress re-write of the main services in Go
│       ├── api                 Work in progress re-write of the main services in Go
│       ├── api                 Work in progress re-write of the main services in Go
│       ├── api                 Work in progress re-write of the main services in Go
│       ├── api                 Work in progress re-write of the main services in Go


│   └── go                 Work in progress re-write of the main services in Go
│   └── go                 Work in progress re-write of the main services in Go
│   └── go                 Work in progress re-write of the main services in Go
│   └── go                 Work in progress re-write of the main services in Go
├── azure              Supporting files for Azure deployment etc
│   ├── functionsv2      Azure Functions serverless implementation
│   ├── pipelines        Azure Pipelines for CI/CD
│   └── templates        Example ARM templates
├── docs               Documentation
├── docker             Docker compose files, Note. Dockerfiles are elsewhere 
├── etc                Supporting files, pictures and other artefacts 
├── kubernetes         Docs and files to support deployment to Kubernetes & AKS
│   ├── helm             Helm chart for deploying Smilr with Helm
│   ├── advanced         Deployment YAML for use with Ingress, SSL and persistence
│   └── basic            Simple deployment without Ingress or persistence
├── node               Main microservices, written in Node.js
│   ├── data-api         Data API service source code
│   └── frontend         Frontend service source code
├── orleans            Orleans actor based implementation of the Data API
├── testing            Mock test data, API tests and load test scripts
└── vue                The main app frontend, a Vue.js SPA
    ├── src              Source code of Vue.js app
    └── mock-api         Provides a fake API and database for local testing
```


# Reference Implementation
The reference implementation of the Smilr app consists of the frontend server & data-api written in Node.js and the client as a SPA written in Vue.js. There are alternative versions (detailed below) but currently the core of the project is represented this implementation:

#### [:page_with_curl: Vue.js SPA - Documentation](./vue/) 
#### [:page_with_curl: Frontend Server - Documentation](./node/frontend) 
#### [:page_with_curl: Data API - Documentation](./node/data-api) 

### Notes on Security
As Smilr is commonly used in demos, workshops/labs and for self learning, it defaults to being unsecured and open. This makes it easier to deploy without additional configuration or authentication complications.

Should you want to secure Smilr, typically because you want to have a permanent "live" version hosted and accessible, this is also possible. Securing both single page applications and REST APIs presents some interesting challenges. The approach taken was to use [Azure Active Directory v2 for identity](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-overview), the OAuth2 Implicit Grant flow for authentication and OAuth2 bearer tokens for validation

- [Securing the Vue.js SPA](./vue/#security) 
- [Securing the Data API](./node/data-api#security) 


# Fundamentals
These docs covers some of the fundamental aspects of Smilr, which are independent of any particular implementation
#### [:page_with_curl: API Reference & Data Model](./docs/api-model.md) 
#### [:page_with_curl: Database Notes](./docs/database.md) 

## Runtime Configuration & Settings
The primary configuration mechanism for this project is system environmental variables (or env vars). These env vars are used with the Node.js services, container runtime, Docker tools and helper scripts. This gives a flexible and cross platform way to inject runtime settings, it is also widely supported in Azure (e.g. Azure App Service Settings) and Docker/Kubernetes.

There are numerous ways to set & override environmental variables; in the operating system, the user profile or from command line tools. For local development purposes it is strongly recommended you create & use `.env` files. These are simple text files containing `var=value` pairs. Sample files named `.env.sample` are provided within the project, which you can rename and use. *Note.* `.env` files can often contain secrets so they are prevented from being committed to Git


# Containers & Kubernetes 
As containers and Kubernetes represents such an important build & deployment scenario, they have dedicated guides and documentation

#### [:page_with_curl: Building Smilr as Containers](./docker)
#### [:page_with_curl: Running and deploying in Kubernetes](./kubernetes)

### Public Images
Pre built images are available on Dockerhub. Using these will naturally mean you can get started deploying/running Smilr without needing to do anything. However building your own is still recommended, especially if you want to understand the build process in more detail. 

Images for the Node.js data API and frontend (serving the Vue.js client) are available. 
- The `stable` tag is only pushed after some manual validation and testing,
- `latest` is auto-pushed with latest code every night

##### [Smilr on Dockerhub 🡽](https://hub.docker.com/u/smilr)


# Deploying to Azure 
See provided Azure Resource Manager (ARM) templates to allow you to deploy the complete Smilr app and all components to Azure. As all deployment scenarios are container based you also need to refer to the containers section described above

#### [ARM Deployment Templates](./azure/templates)


# DevOps & CI/CD
Automated CI/CD pipelines have been created using Azure Pipelines. These automatically build the various components as containers and releases them to Azure for testing. The current status of these builds & releases is shown below

| Automated Build | Status |
|---|---|
|Linux Images & Tests|[![Build Status](https://dev.azure.com/bencoleman/Smilr/_apis/build/status/Build%20to%20ACR%20and%20Deploy%20to%20ACI?branchName=master)](https://dev.azure.com/bencoleman/Smilr/_build/latest?definitionId=73&branchName=master)|
|Windows Images & Dockerhub|[![Build Status](https://dev.azure.com/bencoleman/Smilr/_apis/build/status/Build%20to%20ACR%20and%20Deploy%20to%20ACI?branchName=master)](https://dev.azure.com/bencoleman/Smilr/_build/latest?definitionId=73&branchName=master)|


You can visit the Azure Devops Public Project where these pipelines reside, although keep in mind the source code repo remains here on GitHub.
##### [DevOps Public Project - Smilr 🡽](https://dev.azure.com/bencoleman/Smilr)

If you want to try using Azure DevOps to build Smilr, [the pipelines are provided as YAML for your own use](./azure/pipelines). An Azure DevOps account/organisation is required to use these, but can be setup for free.


# Sub Projects
There are several sub-projects and re-implementations of the Smilr architecture. Either at the backend, providing an API compatible with the data-api REST specification. Also the frontend has been implemented as a mobile app. All of these alternatives are considered experimental and for technology demo use cases 

- [**Serverless - Azure Functions**](./azure/functionsv2)
- [**Go aka Golang**](./go)
- [**Native Mobile App**](./mobile)


# Changelog 
High level project changes and overall history are recorded here:

- *Jan 2020* - Rewrote Node.js data API, using MVCS pattern
- *Jul 2019* - Start of Go implementation. Archived old sub-projects
- *Jun 2019* - Security improvements, MSAL and token validation
- *Dec 2018* - Total rewrite of SPA in Vue.js and proper AAD security
- *May 2018* - Major updates for Kubernetes deployment & Angular 6
- *Mar 2018* - Switched to MongoDB for database
- *Jan 2018* - Simple onetime password security added to API
- *Dec 2017* - Name changed to Smilr
- *Nov 2017* - Switched to CosmosDB SQL API (aka DocumentDB)
- *Oct 2017* - Project created, using Azure Table storage

## Featuring Docker, Node, Express, MongoDB, Mongoose, & NGINX

![Tech Logos](./logos.png)

## License & Purpose

MIT License. This is something I've used in production before with success that I found useful for quickly bootstrapping RESTful APIs. You can fork and clone and take this apart without giving me any credit for anything. If you like it, you can star the repo ⭐️ or follow me on GitHub.

Feel free to make an issue or PR if you want to suggest ideas / fixes.

## About

This configuration is a backend [RESTful API](https://en.wikipedia.org/wiki/Representational_state_transfer) boilerplate with the following pieces:

- [Docker](https://www.docker.com/) as the container service to isolate the environment.
- [Node.js](https://nodejs.org/en/) (Long-Term-Support Version) as the run-time environment to run JavaScript.
- [Express.js](https://expressjs.com/) as the server framework / controller layer
- [MongoDB](https://www.mongodb.com/) as the database layer
- [Mongoose](https://mongoosejs.com/) as the "ODM" / model layer
- [NGINX](https://docs.nginx.com/nginx/admin-guide/content-cache/content-caching/) as a proxy / content-caching layer

## How to Install & Run

You will need to first download and install [Docker Desktop](https://www.docker.com/products/docker-desktop) or [Linux equivalent](https://docs.docker.com/install/linux/docker-ce/ubuntu/).

0.  Fork/Clone the repo
1.  Run `docker-compose up` to start three containers:
    - the MongoDB database container
    - the Node.js app container
    - the NGINX proxy container
1.  Server is accessible at `http://localhost:8080` if you have Docker for Windows or Mac. Use `http://localhost` without specifying the port to hit the NGINX proxy. On Linux, you may need to hit the IP Address of the docker-machine rather than `localhost` (port rules are the same.)

## How to Run Tests

Currently, tests are run outside of the Docker container (unfortunately for now). The tests use an in-memory version of MongoDB. You should be able to run `npm install` followed by `npm test` to run everything (assuming you have the LTS version of Node installed on your machine).

## App Structure

- the boilerplate entity is called "Thing" and all the routes are based on the thing resource. When you want to start building a real API, you can probably just do a global find and replace for thing, but mind the case-sensitivity.
- most folders have an `index.js` which simply exports the contents of all the files in those folders. This is to make importing things around the app slightly easier, since you can just `require` the folder name and destructure the functions you are looking for. Check out [this part of the Node.js docs](https://nodejs.org/api/modules.html#modules_folders_as_modules) for more info.

**\_\_tests\_\_**

- this folder contains unit and integration tests both run using `npm test` which in turn uses [Jest](https://jestjs.io/)

**./app**

- `handlers` are Express.js route handlers that have `request`, `response`, and `next` parameters.
- `helpers` are raw JS "classes" and utility functions for use across the app
- `models` are [Mongoose schema](https://mongoosejs.com/docs/guide.html) definitions and associated models
- `routers` are RESTful route declarations using [express.Router module](https://expressjs.com/en/guide/routing.html) that utilize the functions in `handlers`
- `schemas` are [JSONSchema](https://json-schema.org/understanding-json-schema/index.html) validation schemas for creating or updating a Thing. Pro-tip: use [JSONSchema.net](https://jsonschema.net/) to generate schemas based on examples for you.
- `app.js` is what builds and configures the express app
- `config.js` is the app-specific config that you will want to customize for your app
- `index.js` is the entrypoint that actually starts the Express server

**./config**

- config contains NGINX proxy configuration, the production pm2 configuration (the process-runner of choice), and the Jest configuration to run MongoDB in memory
