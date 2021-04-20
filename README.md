# PAQUIDEPI
# REST API Example

This example shows how to implement a **REST API with TypeScript** using [Express](https://expressjs.com/) and [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client). It is based on a POSTGRES database.
Login 

## Getting started

### 1. Download example and install dependencies

```
Install npm dependencies:

```
yarn
```

### 2. Create and seed the database

Run the following command to create your SQLite database file. This also creates the `User` and `Post` tables that are defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```
npx prisma migrate dev --name init
```

### 3. Start the REST API server

```
yarn dev
```

The server is now running on `http://localhost:3000`.

## Using the REST API

You can access the REST API of the server using the following endpoints:

### `POST`

- `/signup`: Create a new user
  - Body:
    - `email: String` (required): The email address of the user
    - `name: String` (required): The name of the user
    - `password: String` (required): User password


- `/login`: Authenticate user and return a jwt
  - Body:
    - `email: String` (required): The email address of the user
    - `password: String` (optional): User password

