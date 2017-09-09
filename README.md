## Docker Virtual Host Router

Router will help to maintain virtual hosts in Docker.

# Services:

1. Dashbord for virtual host configuration and monitoring ```web```
2. Router which redirects the requests by defined virtual hosts ```nginx```

## Installation and Startup

1. Build docker image ```docker-compose build```
2. Start ```docker-compose up```
3. Dashboard url: http://localhost

## Development

Development mode has source code hot swapping enabled.
Client side is updated after ```npm run build```
Server side is updated on source code changes

1. Start in development mode ```docker-compose -f docker-compose.development.yml -f docker-compose.yml up```
2. Dashboard url: http://localhost:8000
