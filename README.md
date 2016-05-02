Hello-World REST­-like API ​
==============

This is a docker based, stateless REST­-like API ​created using node.js, redis, nginx.
--------------

**Installation with:**
    docker-compose up -d

**Usage Example**
    curl http://localhost:8569/v1/hello-world

Apart from providing a stateless REST-like API, this project also contains a set of static web pages (served using nginx) for retrieving API access logs. These static pages internally call APIs served by node.js server which returns the logs in JSON format.

*Static pages*
- http://localhost:7569/			Home Page
- http://localhost:7569/v1/logs			API Access logs
- http://localhost:7569/v1/hello-world/logs	API Access logs specific to /v1/hello-world endpoint

**Technology Stack**
- node.js	: For serving REST API
- Redis		: To persist the data
- nginx		: For serving static Web pages
- Docker	: For containerizing each of the above
- Docker Compose: For creating microservice application based on the three containers
