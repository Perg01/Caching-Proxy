# Caching-Proxy

A caching proxy server built with Node.js, Express, and LRU Cache.

## Overview

This project provides a caching proxy server that sits between a client and an origin server. It caches frequently accessed resources from the origin server, reducing the number of requests made to the origin server and improving performance.

## Features

- Caches resources from the origin server using LRU Cache
- Automatically removes least recently accessed items from the cache when it reaches its maximum size
- Supports HTTP GET requests
- Configurable cache size and time-to-live (TTL)

## Usage

To start the proxy server, run the following command:

```bash
node app.js start --port <port> --origin <origin>
```

Replace <port> with the port number you want the proxy server to listen on, and <origin> with the URL of the origin server.

For example:

`node app.js start --port 3000 --origin https://example.com`

## Configuration

The proxy server can be configured using the following options:

- --port: The port number to listen on (default: 3000)
- --origin: The URL of the origin server (required)

## API

The proxy server provides the following API endpoints:

- GET /: Proxies requests to the origin server
- GET /clear-cache: Clears the cache

## License

This project is licensed under the MIT License

---

https://roadmap.sh/projects/caching-server
