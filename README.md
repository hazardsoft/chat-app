# Environment Variables

The following env vars files need to be created:
1. Copy `.env.example` and rename to `.env` (will be used for local development)
2. Copy `.env.example` and rename to `.env.test` (will be used for tests)

# Docker

## Application

```
Build image:
docker build --tag hazardsoft/chat-app:latest .

Run image:
docker run --env-file .env.docker --publish 3000:3000/tcp --detach hazardsoft/chat-app:latest
```