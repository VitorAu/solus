# Solus

Solus is a modern monorepo built with TurboRepo that powers a scalable
backend, shared packages, and multiple applications. The project focuses
on performance, developer experience, and clear architecture.

## Project Structure

This repository uses a monorepo structure so multiple apps and packages
can share code safely and consistently.

    apps/
      api/        Backend API
      web/        Web client
      mobile/     Mobile client

    packages/
      database/       Database schema and migrations
      interfaces/     Shared interfaces
      types/          Shared types and validation schemas
      typescript/     Shared TypeScript configurations

## System Architecture

![Solus Entity Relationship Diagram](https://github.com/VitorAu/solus/blob/53813332f28eedabbc8c8224f1ccd995cfb3bb71/solus_entity_relation.png)

## Tech Stack

- Node.js
- TypeScript
- TurboRepo
- PostgreSQL
- Drizzle ORM
- Zod
- Docker

## Scripts

Script Description

---

app::dev Run all apps in development
app::build Build all packages
app::format Format code using Prettier
docker::compose Start local services
docker::stop Stop containers

## Environment Variables

Copy the example file and adjust values:

    .env.example.dev
    .env.example.prod

Never commit real secrets.

## Project Goals

- Clean architecture
- Shared types across services
- Scalable monorepo
- Strong type safety
- Fast builds

## License

MIT
